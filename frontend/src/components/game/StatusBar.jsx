import { Pause, AlertTriangle, Star, Clock } from "lucide-react";
import { useGame } from "./shared";
import { formatRM } from "../../game/money";
import { shiftNet, mathScore, businessAtRisk } from "../../game/engine";

const MODE = { challenge: "Mod Cabaran", mental: "Mod Matematik Mental", guided: "Mod Berpandu" };
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

const Stat = ({ label, value, testId, tone }) => (
  <div className="flex flex-col leading-tight">
    <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-semibold">{label}</span>
    <span data-testid={testId} className={`rb-display text-xl font-bold tabular ${tone || ""}`}>{value}</span>
  </div>
);

export const StatusBar = () => {
  const { state: s, dispatch } = useGame();
  const net = shiftNet(s.ledger);
  const ms = mathScore(s.stats);
  const risk = businessAtRisk(s);
  return (
    <div className="px-3 pt-3">
      <div className="rb-card px-4 py-2 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--tomato)] border-2 border-[var(--charcoal)] flex items-center justify-center text-white rb-display font-extrabold">RB</div>
          <div className="leading-tight">
            <p className="rb-display text-lg font-extrabold" data-testid="hud-day">Hari {s.day}</p>
            <p className="text-xs text-[var(--muted)]" data-testid="hud-mode">{MODE[s.mode]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <Stat label={s.tutorial ? "Tutorial" : s.grace ? "Masa tambahan" : "Masa syif"} testId="hud-timer"
            value={s.tutorial ? "Dijeda" : mmss(s.grace ? s.graceLeft : s.timeLeft)} tone={s.grace || (!s.tutorial && s.timeLeft < 30) ? "text-[var(--tomato)]" : ""} />
        </div>
        <Stat label="Dana perniagaan" value={formatRM(s.startFunds + net)} testId="hud-funds" />
        <Stat label={`Untung syif / sasaran ${formatRM(s.cfg.target)}`} value={formatRM(net)} testId="hud-net" tone={net >= s.cfg.target ? "text-[var(--lettuce-dark)]" : ""} />
        <div className="min-w-[120px]">
          <span className="text-[11px] uppercase tracking-wider text-[var(--muted)] font-semibold">Reputasi {s.reputation}/100</span>
          <div className="rb-bar mt-1" data-testid="hud-reputation"><div style={{ width: `${s.reputation}%`, background: s.reputation < 30 ? "var(--tomato)" : "var(--mustard)" }} /></div>
        </div>
        <Stat label="Skor matematik" value={ms === null ? "—" : `${ms}%`} testId="hud-math-score" />
        <Stat label="Rentetan baki betul" value={<span className="inline-flex items-center gap-1">{s.stats.streak}<Star size={16} fill="var(--mustard)" /></span>} testId="hud-streak" />
        <div className="ml-auto flex items-center gap-2">
          {risk && (
            <span data-testid="business-risk-warning" className="flex items-center gap-1 bg-[var(--tomato)] text-white px-3 py-1 rounded-full text-sm font-semibold rb-pulse">
              <AlertTriangle size={16} /> Perniagaan berisiko
            </span>
          )}
          <button data-testid="pause-button" className="rb-btn rb-white flex items-center gap-1" onClick={() => dispatch({ type: "PAUSE" })}>
            <Pause size={16} /> Jeda
          </button>
        </div>
      </div>
    </div>
  );
};
