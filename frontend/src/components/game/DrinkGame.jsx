import { Check, Snowflake, Flame, GlassWater, RotateCw, CupSoda } from "lucide-react";
import { useGame } from "./shared";
import { Cup } from "./Art";
import { DRINK_GAME, SIZE_NAMES } from "../../game/config";
import { drinkLabel } from "../../game/engine";

const STEP_INFO = {
  ice: { label: "Masukkan ais", icon: Snowflake },
  heat: { label: "Panaskan", icon: Flame },
  pour: { label: "Tuang ke garisan", icon: GlassWater },
  stir: { label: "Tarik / kacau", icon: RotateCw },
  lid: { label: "Tutup cawan", icon: CupSoda },
};

const Band = ({ value, max, lo, hi, testId, color = "var(--charcoal)" }) => (
  <div className="relative h-5 rounded-full bg-[#f1e4cc] border-2 border-[var(--line)] overflow-hidden" data-testid={testId}>
    <div className="absolute top-0 bottom-0 bg-[rgba(90,165,68,0.45)] border-x-2 border-[var(--lettuce-dark)]" style={{ left: `${(lo / max) * 100}%`, width: `${((hi - lo) / max) * 100}%` }} />
    <div className="absolute top-[-2px] bottom-[-2px] w-2 rounded" style={{ background: color, left: `calc(${Math.min(100, (value / max) * 100)}% - 4px)` }} />
  </div>
);

const hold = (dispatch, start, stop) => ({
  onPointerDown: (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); dispatch({ type: start }); },
  onPointerUp: () => dispatch({ type: stop }),
  onPointerCancel: () => dispatch({ type: stop }),
});

const StepControls = ({ dp }) => {
  const { dispatch } = useGame();
  const G = DRINK_GAME;
  if (dp.step === "ice") return (
    <div className="space-y-3">
      <p className="text-sm">Cawan {SIZE_NAMES[dp.size].toLowerCase()} perlukan <b>{G.ice[dp.size]} ketul ais</b>. Ais dalam cawan: <b data-testid="drink-game-ice-count">{dp.ice}</b></p>
      <div className="flex gap-2">
        <button data-testid="drink-game-ice" className="rb-btn rb-white flex items-center gap-1" onClick={() => dispatch({ type: "DRINK_GAME_ICE" })}><Snowflake size={16} />Tambah Ais</button>
        <button data-testid="drink-game-ice-done" className="rb-btn rb-green" onClick={() => dispatch({ type: "DRINK_GAME_ICE_DONE" })}>Cukup, Teruskan</button>
      </div>
    </div>
  );
  if (dp.step === "heat") return (
    <div className="space-y-3">
      <p className="text-sm">Tekan dan tahan untuk memanaskan. Lepaskan dalam jalur hijau ({G.heat.target[0]}–{G.heat.target[1]}°C). Suhu: <b data-testid="drink-game-heat">{Math.round(dp.heat)}°C</b></p>
      <Band value={dp.heat} max={100} lo={G.heat.target[0]} hi={G.heat.target[1]} testId="drink-game-heat-bar" color="var(--tomato)" />
      <button data-testid="drink-game-heat-button" className={`rb-btn rb-red select-none touch-none ${dp.heating ? "rb-pulse" : ""}`} {...hold(dispatch, "DRINK_GAME_HEAT_START", "DRINK_GAME_HEAT_STOP")}>
        {dp.heating ? "Memanaskan… lepaskan!" : "Tekan & Tahan: Panaskan"}
      </button>
    </div>
  );
  if (dp.step === "pour") return (
    <div className="space-y-3">
      <p className="text-sm">Tekan dan tahan untuk menuang. Lepaskan apabila air berada dalam jalur hijau. Terlebih 115% akan tertumpah!</p>
      <Band value={dp.fill} max={1.2} lo={G.pour.target[0]} hi={G.pour.target[1]} testId="drink-game-fill-bar" />
      <button data-testid="drink-game-pour-button" className={`rb-btn rb-red text-lg px-6 select-none touch-none ${dp.pouring ? "rb-pulse" : ""}`} {...hold(dispatch, "DRINK_GAME_POUR_START", "DRINK_GAME_POUR_STOP")}>
        {dp.pouring ? "Menuang… lepaskan!" : "Tekan & Tahan: Tuang"}
      </button>
    </div>
  );
  if (dp.step === "stir") {
    const tarik = dp.flavour === "teh_tarik";
    return (
      <div className="space-y-3">
        <p className="text-sm">Tekan apabila penunjuk berada dalam jalur hijau. {tarik ? "Tarik" : "Kacau"} {dp.hits}/{dp.needHits}.</p>
        <Band value={dp.needle} max={1} lo={G.stir.sweet[0]} hi={G.stir.sweet[1]} testId="drink-game-stir-bar" />
        <button data-testid="drink-game-stir-button" className="rb-btn rb-yellow text-lg px-6" onClick={() => dispatch({ type: "DRINK_GAME_STIR" })}>{tarik ? "Tarik!" : "Kacau!"}</button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-sm">Minuman sudah dituang. Tutup cawan untuk siap.</p>
      <button data-testid="drink-game-lid-button" className="rb-btn rb-green text-lg px-6" onClick={() => dispatch({ type: "DRINK_GAME_LID" })}>Tutup Cawan</button>
    </div>
  );
};

export const DrinkGame = ({ dp }) => {
  const { dispatch } = useGame();
  const idx = dp.steps.indexOf(dp.step);
  return (
    <div className="space-y-4" data-testid="drink-game">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="rb-display font-extrabold text-lg">Membuat: {drinkLabel(dp)} — cawan {dp.total - dp.left + 1}/{dp.total}</p>
        <button data-testid="drink-game-cancel" className="rb-btn rb-white text-sm" onClick={() => dispatch({ type: "DRINK_GAME_CANCEL" })}>Batal</button>
      </div>
      <ol className="flex gap-2 flex-wrap" data-testid="drink-game-steps">
        {dp.steps.map((st, i) => {
          const I = STEP_INFO[st].icon;
          return (
            <li key={st} className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border-2 ${i < idx ? "bg-[var(--lettuce)] text-white border-[var(--lettuce-dark)]" : i === idx ? "bg-[var(--mustard)] border-[var(--charcoal)]" : "bg-white border-[var(--line)]"}`}>
              {i < idx ? <Check size={13} /> : <I size={13} />}{i + 1}. {STEP_INFO[st].label}
            </li>
          );
        })}
      </ol>
      <div className="grid md:grid-cols-[1fr_180px] gap-5 items-end">
        <StepControls dp={dp} />
        <div className="flex flex-col items-center bg-[#e8f3f7] rounded-2xl border-2 border-[var(--line)] p-3">
          <div className="w-20 h-5 bg-[var(--charcoal)] rounded-t-lg relative">{dp.pouring && <div className="absolute left-1/2 -translate-x-1/2 top-5 w-2 h-14 bg-[rgba(91,155,213,0.8)]" />}</div>
          <div className="relative mt-1">
            <Cup flavour={dp.flavour} fill={dp.step === "ice" || dp.step === "heat" ? 0 : dp.fill} size={dp.size} ice={false} target={DRINK_GAME.pour.target} />
            <div className="absolute bottom-3 left-0 right-0 flex flex-wrap justify-center gap-0.5 px-4">
              {Array.from({ length: dp.ice }).map((_, i) => <span key={i} className="w-3 h-3 bg-white/90 border border-sky-300 rotate-12 rounded-sm" />)}
            </div>
          </div>
          <p className="text-xs font-semibold mt-1 tabular" data-testid="drink-game-fill">{Math.round(dp.fill * 100)}% penuh</p>
        </div>
      </div>
    </div>
  );
};
