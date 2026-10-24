import { useGame, StationHeader, OrderPicker } from "./shared";
import { Cup } from "./Art";
import { DRINKS, SIZE_NAMES, DRINK_FILL } from "../../game/config";
import { lineName, lineMods } from "../../game/orders";

const needsDrink = (o) => o.units.some((u) => u.kind === "drink" && u.state === "todo" && !u.busy);

const Choice = ({ label, active, onClick, disabled, testId }) => (
  <button data-testid={testId} disabled={disabled} onClick={onClick} className={`rb-btn text-sm ${active ? "rb-dark" : "rb-white"}`}>{label}</button>
);

const Machine = () => {
  const { state: s, dispatch } = useGame();
  const d = s.drink;
  const o = s.orders.find((x) => x.id === d.orderId);
  const u = o.units.find((x) => x.uid === d.uid);
  const locked = d.filling || d.fill > 0;
  const set = (field, value) => dispatch({ type: "DRINK_SET", field, value });
  return (
    <div className="grid md:grid-cols-[1.3fr_1fr] gap-6" data-testid="drink-machine">
      <div className="space-y-4">
        <p className="text-sm">Tiket #{o.num} minta: <b>{lineName(u)}</b>{lineMods(u).length ? <span className="text-[var(--tomato)] font-semibold"> · {lineMods(u).join(", ")}</span> : ""}</p>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Saiz cawan</p>
          <div className="flex gap-2">{s.cfg.menu.sizes.map((z) => <Choice key={z} testId={`drink-size-${z}`} label={SIZE_NAMES[z]} active={d.size === z} disabled={locked} onClick={() => set("size", z)} />)}</div></div>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Perisa</p>
          <div className="flex gap-2 flex-wrap">{s.cfg.menu.drinks.map((f) => <Choice key={f} testId={`drink-flavour-${f}`} label={DRINKS[f].name} active={d.flavour === f} disabled={locked} onClick={() => set("flavour", f)} />)}</div></div>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Ais</p>
          <div className="flex gap-2"><Choice testId="drink-ice-yes" label="Dengan ais" active={d.ice} disabled={locked} onClick={() => set("ice", true)} /><Choice testId="drink-ice-no" label="Tanpa ais" active={!d.ice} disabled={locked} onClick={() => set("ice", false)} /></div></div>
        <div className="flex gap-2">
          {!d.filling ? (
            <>
              <button data-testid="drink-fill-button" className="rb-btn rb-red text-lg px-6" disabled={d.fill > 0} onClick={() => dispatch({ type: "DRINK_FILL" })}>Isi Cawan</button>
              <button data-testid="drink-cancel-button" className="rb-btn rb-white" disabled={d.fill > 0} onClick={() => dispatch({ type: "DRINK_CANCEL" })}>Tukar Minuman</button>
            </>
          ) : (
            <button data-testid="drink-stop-button" className="rb-btn rb-green text-lg px-6 rb-pulse" onClick={() => dispatch({ type: "DRINK_STOP" })}>Berhenti</button>
          )}
        </div>
        <p className="text-xs text-[var(--muted)]">Berhenti apabila air berada dalam jalur hijau.</p>
      </div>
      <div className="flex flex-col items-center justify-end bg-[#e8f3f7] rounded-2xl border-2 border-[var(--line)] p-4">
        <div className="w-24 h-6 bg-[var(--charcoal)] rounded-t-lg mb-1 relative">{d.filling && <div className="absolute left-1/2 -translate-x-1/2 top-6 w-2 h-16" style={{ background: DRINKS[d.flavour].color }} />}</div>
        <Cup flavour={d.flavour} fill={d.fill} size={d.size} ice={d.ice} target={DRINK_FILL.target} />
        <p className="text-sm font-semibold mt-2 tabular" data-testid="drink-fill-level">{Math.round(d.fill * 100)}% penuh</p>
      </div>
    </div>
  );
};

export const Drinks = () => {
  const { state: s, dispatch } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "paid");
  const units = o ? o.units.filter((u) => u.kind === "drink" && u.state === "todo") : [];
  return (
    <div data-testid="drinks-station">
      <StationHeader title="Minuman">{!s.drink && <OrderPicker filter={needsDrink} emptyText="Tiada minuman untuk disediakan." />}</StationHeader>
      {s.drink ? <Machine /> : (
        <div className="flex gap-2 flex-wrap items-center">
          {!o && <p className="text-sm text-[var(--muted)]">Pilih tiket berbayar untuk menyediakan minuman.</p>}
          {o && !units.length && <p className="text-sm text-[var(--muted)]">Tiket #{o.num} tiada minuman yang perlu disediakan.</p>}
          {units.map((u) => (
            <button key={u.uid} data-testid={`drink-start-${u.uid}`} className="rb-btn rb-yellow" onClick={() => dispatch({ type: "DRINK_START", orderId: o.id, uid: u.uid })}>
              Sediakan: {lineName(u)}{u.ice ? "" : " (tanpa ais)"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
