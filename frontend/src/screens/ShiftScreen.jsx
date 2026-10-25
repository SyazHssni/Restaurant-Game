import { useEffect, useReducer, useRef } from "react";
import { GameCtx } from "../components/game/shared";
import { reducer, createShift } from "../game/engine";
import { STATIONS } from "../game/config";
import { grillStatus, fryStatus } from "../game/scoring";
import { playSound, syncLoopingSound, stopLoopingSounds } from "../game/sound";
import { StatusBar } from "../components/game/StatusBar";
import { CustomerQueue } from "../components/game/CustomerQueue";
import { TicketRail } from "../components/game/TicketRail";
import { StationTabs } from "../components/game/StationTabs";
import { Counter } from "../components/game/Counter";
import { Register } from "../components/game/Register";
import { Grill } from "../components/game/Grill";
import { Fryer } from "../components/game/Fryer";
import { Assembly } from "../components/game/Assembly";
import { Drinks } from "../components/game/Drinks";
import { Packing } from "../components/game/Packing";
import { TutorialCard, FxToasts, PauseMenu, PackWarn } from "../components/game/Overlays";

const VIEWS = { counter: Counter, register: Register, grill: Grill, fryer: Fryer, assembly: Assembly, drinks: Drinks, packing: Packing };

const SPEED = Math.min(10, Number(new URLSearchParams(window.location.search).get("speed")) || 1);

function useLoop(dispatch) {
  useEffect(() => {
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      dispatch({ type: "TICK", dt: Math.min(0.25, (now - last) / 1000) * SPEED });
      last = now;
    }, 100);
    const vis = () => document.hidden && dispatch({ type: "PAUSE" });
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", vis); };
  }, [dispatch]);
}

function useKeys(state, dispatch) {
  const ref = useRef(state);
  ref.current = state;
  useEffect(() => {
    const onKey = (e) => {
      const s = ref.current;
      if (e.defaultPrevented) return;
      if (e.target.tagName === "INPUT" || s.ended || s.packWarn || s.menuOpen) return;
      if (e.key === "Escape" || e.key.toLowerCase() === "p") { dispatch({ type: s.paused ? "RESUME" : "PAUSE" }); return; }
      if (s.paused) return;
      const o = s.station === "register" && s.orders.find((x) => x.id === s.selectedOrderId && x.status === "awaiting_payment" && x.payment.stage === "bill");
      if (o && !e.altKey && /^[0-9.]$/.test(e.key)) { dispatch({ type: "REG_KEY", orderId: o.id, key: e.key }); e.preventDefault(); return; }
      if (o && e.key === "Backspace") { dispatch({ type: "REG_KEY", orderId: o.id, key: "back" }); return; }
      if (o && e.key === "Enter") { dispatch({ type: "REG_SUBMIT", orderId: o.id }); e.preventDefault(); return; }
      const dp = s.drinkPrep;
      if (dp && s.station === "drinks" && e.code === "Space") {
        e.preventDefault();
        if (e.repeat) return;
        const map = { ice: "DRINK_GAME_ICE", heat: "DRINK_GAME_HEAT_START", pour: "DRINK_GAME_POUR_START", stir: "DRINK_GAME_STIR", lid: "DRINK_GAME_LID" };
        dispatch({ type: map[dp.step] });
        return;
      }
      const st = STATIONS.find((x) => x.key === e.key);
      if (st) dispatch({ type: "SET_STATION", station: st.id });
    };
    const onUp = (e) => {
      const dp = ref.current.drinkPrep;
      if (e.code !== "Space" || !dp) return;
      if (dp.step === "pour") dispatch({ type: "DRINK_GAME_POUR_STOP" });
      if (dp.step === "heat") dispatch({ type: "DRINK_GAME_HEAT_STOP" });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onUp); };
  }, [dispatch]);
}

export default function ShiftScreen({ save, settings, tutorial, onEnd, onQuit, onTutorialDone }) {
  const [state, dispatch] = useReducer(reducer, null, () => createShift(save, settings, tutorial));
  const lastSfx = useRef(0);
  const ended = useRef(false);
  const hadTutorial = useRef(!!tutorial);
  useLoop(dispatch);
  useKeys(state, dispatch);

  useEffect(() => {
    state.sfx.forEach((f) => { if (f.id > lastSfx.current) { lastSfx.current = f.id; playSound(f.name, settings.volume); } });
  }, [state.sfx, settings.volume]);
  useEffect(() => {
    const canPlay = !state.paused && !state.ended;
    const cooking = canPlay && (
      state.grill.some((slot) => slot && grillStatus(slot).key === "cooking") ||
      state.fryer.some((batch) => batch && fryStatus(batch).key === "cooking")
    );
    const pouring = canPlay && Boolean(state.drinkPrep?.pouring);
    syncLoopingSound("cooking", cooking, settings.volume);
    syncLoopingSound("pouring", pouring, settings.volume);
  }, [state, settings.volume]);
  useEffect(() => () => stopLoopingSounds(), []);
  useEffect(() => {
    if (hadTutorial.current && !state.tutorial) { hadTutorial.current = false; onTutorialDone(); }
  }, [state.tutorial, onTutorialDone]);
  useEffect(() => {
    if (state.ended && !ended.current) { ended.current = true; setTimeout(() => onEnd(state), 900); }
  }, [state, onEnd]);

  const View = VIEWS[state.station];
  const restart = () => { ended.current = false; dispatch({ type: "RESET", state: createShift(save, settings, false) }); };
  return (
    <GameCtx.Provider value={{ state, dispatch }}>
      <div className="h-screen flex flex-col overflow-hidden" data-testid="shift-screen">
        <StatusBar />
        <div className="flex-1 min-h-0 grid lg:grid-cols-[300px_1fr] gap-3 p-3">
          <TicketRail />
          <div className="flex flex-col min-h-0 gap-3">
            <CustomerQueue />
            <StationTabs />
            <section className="rb-card flex-1 min-h-0 overflow-y-auto rb-scroll p-5" data-testid="station-panel" key={state.station}>
              <div className="rb-rise"><View /></div>
            </section>
          </div>
        </div>
        <FxToasts />
        <TutorialCard />
        <PackWarn />
        <PauseMenu onQuit={onQuit} onRestart={restart} />
        {state.ended && <div className="fixed inset-0 z-50 bg-[rgba(43,42,40,0.5)] flex items-center justify-center" data-testid="shift-over"><p className="rb-display text-5xl text-white font-extrabold rb-pop">Syif Tamat!</p></div>}
      </div>
    </GameCtx.Provider>
  );
}
