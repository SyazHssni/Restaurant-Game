import { useMemo, useState } from "react";
import { BURGERS, INGREDIENTS, ASSEMBLY_ORDER } from "../../game/config";
import { formatRM } from "../../game/money";

const FILTERS = [
  ["all", "Semua"], ["special", "Pilihan Kedai"], ["beef", "Daging"], ["double", "Daging Berganda"], ["veg", "Patty Sayur"], ["none", "Tanpa Patty"],
];
const matchesKind = (b, kind) => {
  if (kind === "all") return true;
  if (kind === "special") return !!b.special;
  if (kind === "veg") return b.patty === "veg";
  if (kind === "double") return b.patty === "beef" && b.pattyCount === 2;
  if (kind === "beef") return b.patty === "beef" && b.pattyCount === 1;
  return !b.patty;
};

// stock + missingFn are only passed during a shift.
export const MenuList = ({ day, stock, missingFn }) => {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const items = useMemo(() => Object.entries(BURGERS).map(([id, b]) => {
    const locked = day && b.day > day;
    const missing = !locked && missingFn ? missingFn(id) : [];
    return { id, b, locked, missing, available: !locked && !missing.length };
  }), [day, missingFn]);
  const shown = items.filter(({ b, available }) => matchesKind(b, filter)
    && b.name.toLowerCase().includes(q.toLowerCase()) && (!onlyAvail || available));
  return (
    <div data-testid="menu-list">
      <div className="flex gap-2 flex-wrap items-center mb-3">
        {FILTERS.map(([k, l]) => (
          <button key={k} data-testid={`menu-filter-${k}`} className={`rb-btn text-xs px-3 py-1 ${filter === k ? "rb-dark" : "rb-white"}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
        <input data-testid="menu-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama menu…" className="border-2 border-[var(--line)] rounded-full px-3 py-1 text-sm bg-white" />
        {day && <label className="text-xs font-semibold flex items-center gap-1"><input type="checkbox" data-testid="menu-only-available" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} />Hanya yang tersedia</label>}
        <span className="text-xs text-[var(--muted)]" data-testid="menu-count">{shown.length} daripada {items.length} menu</span>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {shown.map(({ id, b, locked, missing, available }) => (
          <div key={id} data-testid={`menu-item-${id}`} className={`bg-white rounded-2xl border-2 p-4 text-sm ${available ? "border-[var(--line)]" : "border-dashed border-[var(--line)] opacity-70"}`}>
            <p><span className="text-[var(--muted)]">Nama Menu:</span> <b className="rb-display text-base">{b.name}</b></p>
            <p className="text-xs text-[var(--muted)]">Harga: {formatRM(b.price)}</p>
            <p className="font-semibold mt-2">Bahan:</p>
            <ul className="leading-relaxed">
              {b.layers.map((ing, i) => <li key={i} className={missing.includes(ing) ? "text-[var(--tomato)] font-semibold" : ""}>{INGREDIENTS[ing].name}</li>)}
            </ul>
            <p className="mt-2 text-xs font-semibold" data-testid={`menu-status-${id}`}>
              {locked ? `Dibuka pada Hari ${b.day}` : missing.length ? `Tidak tersedia — stok habis: ${missing.map((i) => INGREDIENTS[i].name).join(", ")}` : day ? "Tersedia" : `Mula dijual pada Hari ${b.day}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StockPanel = ({ stock, deliveries, onRestock }) => (
  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-5" data-testid="stock-panel">
    {ASSEMBLY_ORDER.map((ing) => {
      const pending = deliveries.some((d) => d.ing === ing);
      const out = stock[ing] <= 0;
      return (
        <div key={ing} className={`rounded-xl border-2 p-2 text-center ${out ? "border-[var(--tomato)] bg-[#fde3dc]" : "border-[var(--line)] bg-white"}`}>
          <p className="text-xs font-semibold leading-tight">{INGREDIENTS[ing].name}</p>
          <p className="rb-display text-xl font-bold" data-testid={`stock-${ing}`}>{stock[ing]}</p>
          <p className="text-[10px] font-semibold">{out ? "Tidak tersedia" : "Tersedia"}</p>
          <button data-testid={`restock-${ing}`} disabled={pending} className="rb-btn rb-white text-[10px] px-2 py-0.5 mt-1" onClick={() => onRestock(ing)}>{pending ? "Dihantar…" : "Pesan +10"}</button>
        </div>
      );
    })}
  </div>
);
