import { useGame, StationHeader, OrderPicker } from "./shared";
import { PattyDisc } from "./Art";
import { GRILL } from "../../game/config";
import { grillStatus } from "../../game/scoring";
import { pattiesNeeded } from "../../game/engine";

export const TimingBar = ({ t, win, burn, testId }) => (
  <div className="relative h-4 rounded-full bg-[#f1e4cc] border-2 border-[var(--line)] overflow-hidden" data-testid={testId}>
    <div className="absolute top-0 bottom-0 bg-[rgba(90,165,68,0.45)] border-x-2 border-[var(--lettuce-dark)]" style={{ left: `${(win[0] / burn) * 100}%`, width: `${((win[1] - win[0]) / burn) * 100}%` }} />
    <div className="absolute top-0 bottom-0 right-0 bg-[rgba(229,70,46,0.3)]" style={{ width: "6%" }} />
    <div className="absolute top-[-2px] bottom-[-2px] w-1.5 bg-[var(--charcoal)] rounded" style={{ left: `calc(${Math.min(100, (t / burn) * 100)}% - 3px)` }} />
  </div>
);

const doneness = (g, key) => (key === "burnt" ? "burnt" : !g.flipped ? (g.sideA < 3 ? "raw" : "mid") : "done");

const Slot = ({ g, i }) => {
  const { dispatch } = useGame();
  if (!g) return <div className="rounded-2xl border-2 border-dashed border-[var(--line)] h-[230px] flex items-center justify-center text-sm text-[var(--muted)]" data-testid={`grill-slot-${i}-empty`}>Slot {i + 1} kosong</div>;
  const st = grillStatus(g);
  const toneCls = { flip: "bg-[var(--mustard)]", ready: "bg-[var(--lettuce)] text-white", burnt: "bg-[var(--charcoal)] text-white", cooking: "bg-white" }[st.key];
  return (
    <div className="rounded-2xl border-2 border-[var(--charcoal)] bg-[#3a3632] p-4 text-white space-y-3" data-testid={`grill-slot-${i}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold">Slot {i + 1} · Tiket #{g.orderNum} · {g.type === "veg" ? "Patty sayur" : "Patty daging"}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-[var(--charcoal)] ${toneCls}`} data-testid={`grill-status-${i}`}>{st.label}</span>
      </div>
      <div className="flex justify-center py-2"><div key={g.flipped ? "b" : "a"} className="rb-flip"><PattyDisc doneness={doneness(g, st.key)} /></div></div>
      <p className="text-xs opacity-80">{g.flipped ? "Sisi 2 — angkat dalam jalur hijau" : "Sisi 1 — terbalikkan dalam jalur hijau"}</p>
      {g.flipped ? <TimingBar t={g.sideB} win={GRILL.readyWin} burn={GRILL.burnB} /> : <TimingBar t={g.sideA} win={GRILL.flipWin} burn={GRILL.burnA} />}
      <div className="flex gap-2">
        {st.key === "burnt" ? (
          <button data-testid={`grill-discard-${i}`} className="rb-btn rb-white flex-1" onClick={() => dispatch({ type: "GRILL_DISCARD", index: i })}>Buang &amp; Masak Semula</button>
        ) : !g.flipped ? (
          <button data-testid={`grill-flip-${i}`} className={`rb-btn rb-yellow flex-1 ${st.key === "flip" ? "rb-pulse" : ""}`} onClick={() => dispatch({ type: "GRILL_FLIP", index: i })}>Terbalikkan</button>
        ) : (
          <button data-testid={`grill-remove-${i}`} className={`rb-btn rb-green flex-1 ${st.key === "ready" ? "rb-pulse" : ""}`} onClick={() => dispatch({ type: "GRILL_REMOVE", index: i })}>Angkat</button>
        )}
      </div>
    </div>
  );
};

export const Grill = () => {
  const { state: s, dispatch } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "paid");
  const beef = o ? pattiesNeeded(s, o, "beef") : 0;
  const veg = o ? pattiesNeeded(s, o, "veg") : 0;
  return (
    <div data-testid="grill-station">
      <StationHeader title="Gril">
        <OrderPicker filter={(x) => pattiesNeeded(s, x, "beef") > 0 || pattiesNeeded(s, x, "veg") > 0} emptyText="Tiada tiket berbayar yang perlukan patty." />
      </StationHeader>
      <div className="flex items-center gap-3 flex-wrap mb-4">
        {o ? <p className="text-sm font-semibold" data-testid="grill-selected-info">Tiket #{o.num}: perlu {beef} patty daging{veg > 0 ? `, ${veg} patty sayur` : ""} lagi</p>
          : <p className="text-sm text-[var(--muted)]">Pilih tiket berbayar untuk mula memasak.</p>}
        <button data-testid="grill-add-beef" className="rb-btn rb-red" disabled={!o || beef <= 0} onClick={() => dispatch({ type: "GRILL_ADD", orderId: o.id, patty: "beef" })}>Letak Patty Daging</button>
        {(veg > 0 || s.cfg.menu.burgers.includes("garden")) && (
          <button data-testid="grill-add-veg" className="rb-btn rb-green" disabled={!o || veg <= 0} onClick={() => dispatch({ type: "GRILL_ADD", orderId: o.id, patty: "veg" })}>Letak Patty Sayur</button>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-4">{s.grill.map((g, i) => <Slot key={g ? g.id : `e${i}`} g={g} i={i} />)}</div>
      <div className="mt-4" data-testid="patty-tray">
        <p className="rb-display font-extrabold">Dulang patty siap</p>
        <div className="flex gap-2 flex-wrap mt-1">
          {!s.pattyTray.length && <span className="text-sm text-[var(--muted)]">Kosong</span>}
          {s.pattyTray.map((p) => <span key={p.id} className="text-xs font-semibold bg-white border-2 border-[var(--line)] rounded-full px-3 py-1">#{p.orderNum} · {p.type === "veg" ? "Sayur" : "Daging"} · kualiti {p.quality}</span>)}
        </div>
      </div>
    </div>
  );
};
