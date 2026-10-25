import { useGame, StationHeader, OrderPicker } from "./shared";
import { FriesBox } from "./Art";
import { TimingBar } from "./Grill";
import { FRYER } from "../../game/config";
import { fryStatus } from "../../game/scoring";
import { lineName } from "../../game/orders";

const needsFry = (o) => o.units.some((u) => (u.kind === "fries" || u.kind === "bites") && u.state === "todo" && !u.busy);

const Basket = ({ b, i }) => {
  const { dispatch } = useGame();
  if (!b) return <div className="rounded-2xl border-2 border-dashed border-[var(--line)] h-[210px] flex items-center justify-center text-sm text-[var(--muted)]" data-testid={`fryer-basket-${i}-empty`}>Bakul {i + 1} kosong</div>;
  const st = fryStatus(b);
  return (
    <div className="rounded-2xl border-2 border-[var(--charcoal)] bg-[#f7d98a] p-4 space-y-3" data-testid={`fryer-basket-${i}`}>
      <div className="flex justify-between text-sm font-semibold">
        <span>Bakul {i + 1} · Tiket #{b.orderNum}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${st.key === "ready" ? "bg-[var(--lettuce)] text-white" : st.key === "burnt" ? "bg-[var(--charcoal)] text-white" : "bg-white"}`} data-testid={`fryer-status-${i}`}>{st.label}</span>
      </div>
      <p className="text-sm">{lineName({ kind: b.kind, size: b.size })}</p>
      <div className={`flex justify-center ${st.key === "cooking" ? "rb-sizzle" : ""}`}><FriesBox kind={b.kind} size={b.size} quality={st.key === "burnt" ? 0 : 100} /></div>
      <TimingBar t={b.t} win={FRYER.win} burn={FRYER.burn} />
      {st.key === "burnt"
        ? <button data-testid={`fryer-discard-${i}`} className="rb-btn rb-white w-full" onClick={() => dispatch({ type: "FRY_DISCARD", index: i })}>Buang &amp; Goreng Semula</button>
        : <button data-testid={`fryer-remove-${i}`} className={`rb-btn rb-green w-full ${st.key === "ready" ? "rb-pulse" : ""}`} onClick={() => dispatch({ type: "FRY_REMOVE", index: i })}>Angkat</button>}
    </div>
  );
};

export const Fryer = () => {
  const { state: s, dispatch } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "paid");
  const units = o ? o.units.filter((u) => (u.kind === "fries" || u.kind === "bites") && u.state === "todo") : [];
  return (
    <div data-testid="fryer-station">
      <StationHeader title="Penggoreng"><OrderPicker filter={needsFry} emptyText="Tiada tiket berbayar yang perlukan gorengan." /></StationHeader>
      <div className="flex gap-2 flex-wrap mb-4 items-center">
        {!o && <p className="text-sm text-[var(--muted)]">Pilih tiket berbayar untuk mula menggoreng.</p>}
        {o && !units.length && <p className="text-sm text-[var(--muted)]">Tiket #{o.num} tidak perlukan gorengan lagi.</p>}
        {units.map((u) => (
          <button key={u.uid} data-testid={`fry-start-${u.uid}`} disabled={u.busy} className="rb-btn rb-yellow" onClick={() => dispatch({ type: "FRY_START", orderId: o.id, uid: u.uid })}>
            {u.busy ? "Sedang digoreng" : `Goreng: ${lineName(u)}`}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">{s.fryer.map((b, i) => <Basket key={b ? b.id : `e${i}`} b={b} i={i} />)}</div>
    </div>
  );
};
