import { Check, Package, AlertTriangle } from "lucide-react";
import { useGame, StationHeader, OrderPicker } from "./shared";
import { lineName, lineMods } from "../../game/orders";
import { INGREDIENTS } from "../../game/config";

const STATE_TEXT = { todo: "Belum siap", ready: "Sedia", packed: "Dalam beg" };

export const Packing = () => {
  const { state: s, dispatch } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "paid");
  const complete = o && o.units.every((u) => u.state === "packed");
  return (
    <div data-testid="packing-station">
      <StationHeader title="Pembungkusan"><OrderPicker filter={(x) => x.units.some((u) => u.state !== "todo")} emptyText="Belum ada item siap untuk dibungkus." /></StationHeader>
      {!o ? <p className="text-sm text-[var(--muted)]">Pilih tiket berbayar untuk membungkus.</p> : (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          <div className="space-y-2" data-testid="packing-checklist">
            <p className="rb-display font-extrabold">Senarai semak #{o.num} — {o.customer.name}</p>
            {o.units.map((u) => {
              const warn = u.state !== "todo" && u.accuracy !== null && u.accuracy < 100;
              return (
                <div key={u.uid} className="flex items-center gap-3 bg-white rounded-xl border-2 border-[var(--line)] px-3 py-2" data-testid={`pack-unit-${u.uid}`}>
                  {u.state === "packed" ? <Check className="text-[var(--lettuce-dark)]" size={18} /> : <Package size={18} className="text-[var(--muted)]" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{lineName(u)}</p>
                    <p className="text-xs text-[var(--muted)]">{STATE_TEXT[u.state]}{lineMods(u).length ? ` · ${lineMods(u).join(", ")}` : ""}</p>
                    {warn && <p className="text-xs font-semibold text-[var(--tomato)] flex items-center gap-1"><AlertTriangle size={12} />Tidak sepadan dengan tiket{u.check && u.check.missing.length ? ` (kurang: ${u.check.missing.map((i) => INGREDIENTS[i].name).join(", ")})` : ""}</p>}
                  </div>
                  {u.state === "ready" && <button data-testid={`pack-add-${u.uid}`} className="rb-btn rb-yellow text-sm" onClick={() => dispatch({ type: "PACK_ADD", orderId: o.id, uid: u.uid })}>Masuk Beg</button>}
                  {u.state === "packed" && <button data-testid={`pack-remove-${u.uid}`} className="rb-btn rb-white text-sm" onClick={() => dispatch({ type: "PACK_REMOVE", orderId: o.id, uid: u.uid })}>Keluarkan</button>}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center gap-4 bg-[#f6ead2] rounded-2xl border-2 border-[var(--line)] p-5">
            <div className="relative w-64 h-60 flex items-center justify-center">
              <img
                src={`${process.env.PUBLIC_URL}/game-textures/max-burger-bag.png`}
                alt="Beg kertas Max Burger"
                className="absolute inset-0 w-full h-full object-fill"
                width="640"
                height="640"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute bottom-[13%] rounded-full bg-[rgba(255,250,240,0.78)] px-2 py-0.5 text-xs font-bold text-[var(--charcoal)]" data-testid="bag-count">{o.units.filter((u) => u.state === "packed").length}/{o.units.length} item</span>
            </div>
            <button data-testid="deliver-order-button" className={`rb-btn ${complete ? "rb-green rb-pulse" : "rb-white"} text-lg px-8 py-3`} onClick={() => dispatch({ type: "DELIVER", orderId: o.id })}>Hantar Pesanan</button>
            {!complete && <p className="text-xs text-[var(--muted)] text-center">Masukkan semua item ke dalam beg sebelum menghantar.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
