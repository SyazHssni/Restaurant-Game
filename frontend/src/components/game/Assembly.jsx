import { Check, X } from "lucide-react";
import { useGame, StationHeader, OrderPicker } from "./shared";
import { BurgerStack } from "./Art";
import { INGREDIENTS, ASSEMBLY_ORDER } from "../../game/config";
import { requiredLayers } from "../../game/scoring";
import { lineName } from "../../game/orders";

const needsBurger = (o) => o.units.some((u) => u.kind === "burger" && u.state === "todo" && !u.busy);

const Board = () => {
  const { state: s, dispatch } = useGame();
  const asm = s.assembly;
  const o = s.orders.find((x) => x.id === asm.orderId);
  const u = o.units.find((x) => x.uid === asm.uid);
  const need = requiredLayers(u);
  const have = asm.layers.map((l) => l.ing);
  const used = {};
  const act = (type, extra) => dispatch({ type, ...extra });
  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr_1fr] gap-5" data-testid="assembly-board">
      <div>
        <p className="rb-display font-extrabold mb-2">Bahan</p>
        <div className="grid grid-cols-3 gap-2">
          {ASSEMBLY_ORDER.map((ing) => {
            const pt = INGREDIENTS[ing].patty;
            const avail = pt ? s.pattyTray.filter((p) => (p.orderId === o.id || p.orderId === null) && p.type === pt).length : null;
            const out = !pt && s.stock[ing] <= 0;
            return (
              <button key={ing} data-testid={`asm-add-${ing}`} disabled={(pt && !avail) || out} onClick={() => act("ASM_ADD", { ing })}
                className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-[var(--line)] bg-white hover:border-[var(--mustard-dark)] hover:bg-[#fff1cf] disabled:opacity-40 transition-colors">
                <img src={INGREDIENTS[ing].texture} alt="" aria-hidden="true" draggable="false" className="h-8 w-12 object-contain" />
                <span className="text-xs font-semibold text-center leading-tight">{INGREDIENTS[ing].name}</span>
                {pt ? <span className="text-[10px] text-[var(--muted)]">Siap: {avail}</span>
                  : <span className={`text-[10px] ${out ? "text-[var(--tomato)] font-bold" : "text-[var(--muted)]"}`} data-testid={`asm-stock-${ing}`}>{out ? "Stok habis" : `Stok: ${s.stock[ing]}`}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center justify-end rounded-2xl bg-[#f6ead2] border-2 border-[var(--line)] p-4 min-h-[260px]">
        <BurgerStack layers={asm.layers} />
        <div className="w-44 h-3 rounded-full bg-[var(--line)] mt-1" />
        <p className="text-xs text-[var(--muted)] mt-2" data-testid="asm-layer-count">{asm.layers.length} lapisan</p>
      </div>
      <div className="space-y-3">
        <p className="rb-display font-extrabold">Senarai semak: {lineName(u)} (#{o.num})</p>
        {u.exclude.length > 0 && <p className="text-sm font-bold text-[var(--tomato)]" data-testid="asm-exclusions">JANGAN letak: {u.exclude.map((i) => INGREDIENTS[i].name).join(", ")}</p>}
        <ul className="space-y-1 text-sm" data-testid="asm-checklist">
          {need.map((ing, i) => {
            used[ing] = (used[ing] || 0) + 1;
            const ok = have.filter((h) => h === ing).length >= used[ing];
            return <li key={i} className="flex items-center gap-2">{ok ? <Check size={16} className="text-[var(--lettuce-dark)]" /> : <X size={16} className="text-[var(--muted)]" />}<span className={ok ? "font-semibold" : ""}>{i + 1}. {INGREDIENTS[ing].name}</span></li>;
          })}
        </ul>
        <div className="grid grid-cols-2 gap-2">
          <button data-testid="asm-undo" className="rb-btn rb-white text-sm" onClick={() => act("ASM_UNDO")}>Buang Lapisan Akhir</button>
          <button data-testid="asm-reset" className="rb-btn rb-white text-sm" onClick={() => act("ASM_RESET")}>Bina Semula (−5s)</button>
          <button data-testid="asm-cancel" className="rb-btn rb-white text-sm" onClick={() => act("ASM_CANCEL")}>Tukar Burger</button>
          <button data-testid="asm-finish" className="rb-btn rb-green" disabled={asm.layers.length < 2} onClick={() => act("ASM_FINISH")}>Siap</button>
        </div>
      </div>
    </div>
  );
};

export const Assembly = () => {
  const { state: s, dispatch } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "paid");
  const units = o ? o.units.filter((u) => u.kind === "burger" && u.state === "todo") : [];
  return (
    <div data-testid="assembly-station">
      <StationHeader title="Pemasangan">{!s.assembly && <OrderPicker filter={needsBurger} emptyText="Tiada burger untuk dipasang." />}</StationHeader>
      {s.assembly ? <Board /> : (
        <div className="flex gap-2 flex-wrap items-center">
          {!o && <p className="text-sm text-[var(--muted)]">Pilih tiket berbayar, kemudian pilih burger untuk dipasang. Masak patty di Gril dahulu.</p>}
          {o && !units.length && <p className="text-sm text-[var(--muted)]">Tiket #{o.num} tiada burger yang perlu dipasang.</p>}
          {units.map((u) => (
            <button key={u.uid} data-testid={`asm-start-${u.uid}`} className="rb-btn rb-yellow" onClick={() => dispatch({ type: "ASM_START", orderId: o.id, uid: u.uid })}>
              Pasang: {lineName(u)}{u.exclude.length ? " (khas)" : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
