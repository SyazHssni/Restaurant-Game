import { useGame, PatienceBar, moodFor, MOOD_TEXT } from "./shared";
import { Portrait } from "./Art";

export const CustomerQueue = () => {
  const { state: s, dispatch } = useGame();
  return (
    <div className="rb-card px-4 py-3" data-testid="customer-queue">
      <div className="flex items-center gap-3 overflow-x-auto rb-scroll">
        <div className="shrink-0 pr-2 border-r-2 border-dashed border-[var(--line)]">
          <p className="rb-display font-extrabold text-lg leading-none">Barisan</p>
          <p className="text-xs text-[var(--muted)] mt-1" data-testid="queue-count">{s.queue.length}/{s.cfg.maxQueue} menunggu</p>
          {s.grace && <p className="text-xs font-semibold text-[var(--tomato)]">Kedai ditutup</p>}
        </div>
        {!s.queue.length && <p className="text-sm text-[var(--muted)]" data-testid="queue-empty">Tiada pelanggan menunggu di kaunter.</p>}
        {s.queue.map((c) => {
          const mood = moodFor(c.patience / c.maxPatience);
          const sel = s.selectedCustomerId === c.id;
          return (
            <button key={c.id} data-testid={`queue-customer-${c.id}`} onClick={() => dispatch({ type: "SELECT_CUSTOMER", customerId: c.id })}
              className={`rb-rise shrink-0 flex items-center gap-3 text-left rounded-2xl border-2 px-3 py-2 w-[230px] transition-colors ${sel ? "border-[var(--charcoal)] bg-[#ffe7a6]" : "border-[var(--line)] bg-white hover:bg-[#fff1cf]"}`}>
              <span className={mood === "impatient" ? "rb-wiggle" : ""}><Portrait look={c.look} mood={mood} size={46} /></span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold text-sm truncate">{c.name}</span>
                <span className="block text-[11px] text-[var(--muted)] truncate">{MOOD_TEXT[mood]}</span>
                <span className="block mt-1"><PatienceBar value={c.patience} max={c.maxPatience} /></span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
