import { AlertTriangle, CheckCircle2, Circle, Package, Wallet, Flame } from "lucide-react";
import { useGame, PatienceBar, moodFor } from "./shared";
import { Portrait } from "./Art";
import { lineName, lineMods } from "../../game/orders";
import { formatRM } from "../../game/money";

const STATUS = {
  awaiting_payment: { text: "Menunggu bayaran", cls: "bg-[var(--mustard)] text-[var(--charcoal)]", icon: Wallet },
  paid: { text: "Sedang disediakan", cls: "bg-[var(--lettuce)] text-white", icon: Flame },
  ready: { text: "Sedia dibungkus", cls: "bg-[#3d74c4] text-white", icon: Package },
};
const UNIT_ICON = { todo: Circle, ready: CheckCircle2, packed: Package };

const Ticket = ({ o }) => {
  const { state: s, dispatch } = useGame();
  const allReady = o.status === "paid" && o.units.every((u) => u.state !== "todo");
  const st = STATUS[allReady ? "ready" : o.status];
  const r = o.patience / o.maxPatience;
  const sel = s.selectedOrderId === o.id;
  const Icon = st.icon;
  return (
    <button data-testid={`ticket-${o.num}`} onClick={() => dispatch({ type: "SELECT_ORDER", orderId: o.id })}
      className={`rb-rise w-full text-left bg-white rounded-2xl border-2 p-3 transition-colors ${sel ? "border-[var(--charcoal)] ring-4 ring-[rgba(242,182,50,0.45)]" : "border-[var(--line)] hover:border-[var(--mustard-dark)]"}`}>
      <div className="flex items-center gap-2">
        <Portrait look={o.customer.look} mood={moodFor(r, o.angry)} size={36} />
        <div className="flex-1 min-w-0">
          <p className="rb-display font-extrabold leading-none">#{o.num} <span className="font-semibold text-sm">{o.customer.name}</span></p>
          {o.bulk && <span className="inline-block mt-1 mr-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--charcoal)] text-white" data-testid={`ticket-bulk-${o.num}`}>Pesanan Besar · {o.units.length} item</span>}
          <span className={`inline-flex items-center gap-1 mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`} data-testid={`ticket-status-${o.num}`}><Icon size={12} />{st.text}</span>
        </div>
      </div>
      <ul className="mt-2 space-y-1 text-sm">
        {o.lines.map((l) => (
          <li key={l.lid}>
            <div className="flex justify-between gap-2">
              <span><b>{l.qty} ×</b> {lineName(l)}</span>
              <span className="text-[var(--muted)] tabular text-xs pt-0.5">{formatRM(l.unit)}</span>
            </div>
            {lineMods(l).length > 0 && <p className="text-xs font-semibold text-[var(--tomato)]">! {lineMods(l).join(", ")}</p>}
            <div className="flex gap-1 mt-0.5">
              {o.units.filter((u) => u.lid === l.lid).map((u) => {
                const I = UNIT_ICON[u.state];
                return <I key={u.uid} size={14} className={u.state === "todo" ? "text-[var(--muted)]" : "text-[var(--lettuce-dark)]"} aria-label={u.state} />;
              })}
            </div>
          </li>
        ))}
        {o.discount && <li className="text-xs font-semibold text-[var(--lettuce-dark)]">{o.discount.label}: −{formatRM(o.discount.amount)}</li>}
      </ul>
      <div className="mt-2"><PatienceBar value={o.patience} max={o.maxPatience} testId={`ticket-patience-${o.num}`} /></div>
      {r < 0.25 && <p className="mt-1 text-xs font-semibold text-[var(--tomato)] flex items-center gap-1"><AlertTriangle size={12} /> Pelanggan hampir beredar!</p>}
      {o.mistakes.length > 0 && <p className="mt-1 text-xs text-[var(--tomato-dark)]">Kesilapan: {o.mistakes.length}</p>}
    </button>
  );
};

export const TicketRail = () => {
  const { state: s } = useGame();
  const active = s.orders.filter((o) => o.status === "awaiting_payment" || o.status === "paid");
  return (
    <aside className="rb-card p-3 flex flex-col min-h-0" data-testid="ticket-rail">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="rb-display text-xl font-extrabold">Rel Tiket</h2>
        <span className="text-xs text-[var(--muted)]" data-testid="ticket-capacity">{active.length}/{s.cfg.maxActive} aktif</span>
      </div>
      <div className="flex-1 overflow-y-auto rb-scroll space-y-2 pr-1">
        {!active.length && <p className="text-sm text-[var(--muted)]">Belum ada pesanan. Ambil pesanan di Kaunter.</p>}
        {active.map((o) => <Ticket key={o.id} o={o} />)}
      </div>
    </aside>
  );
};
