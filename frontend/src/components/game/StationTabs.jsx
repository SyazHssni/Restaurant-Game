import { STATIONS } from "../../game/config";
import { TUTORIAL_STEPS } from "../../game/engine";
import { grillStatus, fryStatus } from "../../game/scoring";
import { useGame } from "./shared";

function badge(s, id) {
  if (id === "counter") return s.queue.length;
  if (id === "register") return s.orders.filter((o) => o.status === "awaiting_payment").length;
  if (id === "grill") return s.grill.filter((g) => g && ["flip", "ready", "burnt"].includes(grillStatus(g).key)).length;
  if (id === "fryer") return s.fryer.filter((b) => b && fryStatus(b).key !== "cooking").length;
  if (id === "drinks") return s.drinkTray ? s.drinkTray.cups.length : 0;
  if (id === "packing") return s.orders.filter((o) => o.status === "paid" && o.units.every((u) => u.state !== "todo")).length;
  if (id === "assembly") return s.pattyTray.length;
  return 0;
}

export const StationTabs = () => {
  const { state: s, dispatch } = useGame();
  const target = s.tutorial ? TUTORIAL_STEPS[s.tutorial.step].station : null;
  return (
    <nav className="flex gap-2 flex-wrap" aria-label="Stesen" data-testid="station-tabs">
      {STATIONS.map((st) => {
        const n = badge(s, st.id);
        return (
          <button key={st.id} data-testid={`station-tab-${st.id}`} data-active={s.station === st.id}
            className={`rb-tab ${st.id} ${target === st.id && s.station !== st.id ? "rb-pulse" : ""}`}
            onClick={() => dispatch({ type: "SET_STATION", station: st.id })}>
            <span className="kbd">{st.key}</span>{st.name}
            {n > 0 && <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-[var(--tomato)] text-white text-xs">{n}</span>}
          </button>
        );
      })}
    </nav>
  );
};
