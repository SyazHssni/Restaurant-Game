import { useEffect, useState } from "react";
import { X, Minus, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { useGame, StationHeader, OrderPicker } from "./shared";
import { DRINKS, SIZE_NAMES, TEMPS } from "../../game/config";
import { drinkLabel } from "../../game/engine";

const needsDrink = (o) => o.units.some((u) => u.kind === "drink" && u.state === "todo");
const GROUPS = [...new Set(Object.values(DRINKS).map((d) => d.group))];
const STATUS_CLS = { "Belum Disediakan": "bg-white", "Sedang Disediakan": "bg-[var(--mustard)]", Siap: "bg-[var(--lettuce)] text-white", "Perlu Dibetulkan": "bg-[var(--tomato)] text-white" };

const Pick = ({ label, active, disabled, onClick, testId }) => (
  <button data-testid={testId} disabled={disabled} onClick={onClick} className={`rb-btn text-xs px-3 py-1.5 ${active ? "rb-dark" : "rb-white"}`}>{label}</button>
);

const OrderDrinks = ({ o }) => {
  const { state: s } = useGame();
  const lines = o.lines.filter((l) => l.kind === "drink");
  const inTray = s.drinkTray && s.drinkTray.orderId === o.id && s.drinkTray.cups.length > 0;
  const total = lines.reduce((a, l) => a + l.qty, 0);
  const done = o.units.filter((u) => u.kind === "drink" && u.state !== "todo").length;
  return (
    <div className="rb-receipt p-4 space-y-2" data-testid="drink-order-panel">
      <p className="rb-display font-extrabold text-lg">Pesanan Pelanggan #{o.num} — {o.customer.name}</p>
      {lines.map((l) => {
        const d = o.units.filter((u) => u.lid === l.lid && u.state !== "todo").length;
        const issues = o.drinkIssues && o.drinkIssues[l.lid];
        const working = inTray && s.drinkTray.cups.some((c) => c.flavour === l.flavour);
        const status = d >= l.qty ? "Siap" : working ? "Sedang Disediakan" : issues ? "Perlu Dibetulkan" : d > 0 ? "Sedang Disediakan" : "Belum Disediakan";
        return (
          <div key={l.lid} className="border-b border-dashed border-[var(--line)] pb-2" data-testid={`drink-line-${l.lid}`}>
            <div className="flex justify-between gap-2 items-start">
              <span className="font-semibold text-sm">{drinkLabel(l)} × {l.qty}</span>
              <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full border border-[var(--charcoal)] ${STATUS_CLS[status]}`} data-testid={`drink-line-status-${l.lid}`}>{status}</span>
            </div>
            <p className="text-xs text-[var(--muted)]">{d}/{l.qty} disediakan dengan betul</p>
            {issues && d < l.qty && issues.map((m, i) => <p key={i} className="text-xs font-semibold text-[var(--tomato-dark)]">{m}</p>)}
          </div>
        );
      })}
      <p className="text-sm font-semibold" data-testid="drink-progress-summary">Minuman diperlukan: {total} · Disediakan dengan betul: {done}</p>
    </div>
  );
};

const Config = ({ o }) => {
  const { state: s, dispatch } = useGame();
  const [cfg, setCfg] = useState({ flavour: null, size: null, temp: null, qty: 1 });
  useEffect(() => { setCfg({ flavour: null, size: null, temp: null, qty: 1 }); }, [o.id]);
  const set = (k, v) => setCfg((c) => ({ ...c, [k]: v, ...(k === "flavour" && c.temp && !DRINKS[v].temps.includes(c.temp) ? { temp: null } : {}) }));
  const prepare = () => { dispatch({ type: "DRINK_PREPARE", orderId: o.id, ...cfg }); setCfg((c) => ({ ...c, qty: 1 })); };
  const allowed = cfg.flavour ? DRINKS[cfg.flavour].temps : [];
  return (
    <div className="space-y-3" data-testid="drink-config">
      <p className="rb-display font-extrabold text-lg">Penyediaan Minuman</p>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Jenis minuman</p>
        <div className="space-y-1.5 max-h-[230px] overflow-y-auto rb-scroll pr-1">
          {GROUPS.map((g) => (
            <div key={g} className="flex gap-1.5 flex-wrap items-center">
              <span className="text-[11px] font-semibold w-24 shrink-0 text-[var(--muted)]">{g}</span>
              {Object.entries(DRINKS).filter(([, d]) => d.group === g).map(([id, d]) => (
                <Pick key={id} testId={`drink-type-${id}`} label={d.name} active={cfg.flavour === id} onClick={() => set("flavour", id)} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Saiz cawan</p>
          <div className="flex gap-1.5">{["S", "M", "L"].map((z) => <Pick key={z} testId={`drink-size-${z}`} label={SIZE_NAMES[z]} active={cfg.size === z} onClick={() => set("size", z)} />)}</div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Suhu minuman</p>
          <div className="flex gap-1.5">{Object.entries(TEMPS).map(([k, t]) => <Pick key={k} testId={`drink-temp-${k}`} label={t} active={cfg.temp === k} disabled={!cfg.flavour || !allowed.includes(k)} onClick={() => set("temp", k)} />)}</div>
          {!cfg.flavour && <p className="text-[11px] text-[var(--muted)] mt-1">Pilih jenis minuman untuk melihat suhu yang sesuai.</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-1">Kuantiti</p>
          <div className="flex items-center gap-2">
            <button data-testid="drink-qty-minus" className="rb-btn rb-white px-2 py-1" onClick={() => set("qty", Math.max(1, cfg.qty - 1))} aria-label="Kurang"><Minus size={14} /></button>
            <span className="rb-display text-xl font-bold w-6 text-center" data-testid="drink-qty-value">{cfg.qty}</span>
            <button data-testid="drink-qty-plus" className="rb-btn rb-white px-2 py-1" onClick={() => set("qty", Math.min(8, cfg.qty + 1))} aria-label="Tambah"><Plus size={14} /></button>
          </div>
        </div>
      </div>
      <button data-testid="drink-prepare-button" className="rb-btn rb-red" disabled={!cfg.flavour || !cfg.size || !cfg.temp} onClick={prepare}>Sediakan</button>
      <Tray o={o} feedback={s.drinkFeedback && s.drinkFeedback.orderId === o.id ? s.drinkFeedback : null} />
    </div>
  );
};

const Tray = ({ o, feedback }) => {
  const { state: s, dispatch } = useGame();
  const t = s.drinkTray && s.drinkTray.orderId === o.id ? s.drinkTray : null;
  const other = s.drinkTray && s.drinkTray.orderId !== o.id ? s.drinkTray : null;
  return (
    <div className="space-y-2">
      {other && <p className="text-xs font-semibold text-[var(--tomato-dark)]" data-testid="drink-tray-other">Dulang sedang digunakan untuk tiket #{other.orderNum}. Pilih tiket itu untuk mengesahkan atau mengosongkan dulang.</p>}
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Dulang minuman disediakan</p>
      <div className="min-h-[52px] rounded-2xl border-2 border-dashed border-[var(--charcoal)] bg-[#e8f3f7] p-2 flex flex-wrap gap-2" data-testid="drink-tray">
        {!t && <span className="text-sm text-[var(--muted)] p-1">Dulang kosong</span>}
        {t && t.cups.map((c) => (
          <span key={c.id} className="rb-pop inline-flex items-center gap-1 bg-white border-2 border-[var(--line)] rounded-full pl-1 pr-2 py-0.5 text-xs font-semibold">
            <span className="w-4 h-4 rounded-full border border-black/40" style={{ background: DRINKS[c.flavour].color }} />
            {drinkLabel(c)}
            <button data-testid={`drink-cup-remove-${c.id}`} onClick={() => dispatch({ type: "DRINK_REMOVE_CUP", id: c.id })} aria-label="Buang cawan"><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <button data-testid="drink-confirm-button" className="rb-btn rb-green" disabled={!t} onClick={() => dispatch({ type: "DRINK_CONFIRM" })}>Sahkan Penyediaan</button>
        <button data-testid="drink-clear-button" className="rb-btn rb-white" disabled={!t} onClick={() => dispatch({ type: "DRINK_CLEAR" })}>Kosongkan Dulang</button>
      </div>
      {feedback && (
        <div data-testid="drink-feedback" className={`rounded-xl border-2 px-3 py-2 text-sm space-y-1 ${feedback.ok ? "bg-[#e5f4dc] border-[var(--lettuce)]" : "bg-[#fde3dc] border-[var(--tomato)]"}`}>
          {feedback.msgs.map((m, i) => <p key={i} className="flex gap-1">{feedback.ok ? <CheckCircle2 size={15} className="shrink-0 mt-0.5" /> : <AlertTriangle size={15} className="shrink-0 mt-0.5" />}{m}</p>)}
        </div>
      )}
    </div>
  );
};

export const Drinks = () => {
  const { state: s } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "paid");
  const hasDrinks = o && o.lines.some((l) => l.kind === "drink");
  return (
    <div data-testid="drinks-station">
      <StationHeader title="Minuman"><OrderPicker filter={needsDrink} emptyText="Tiada minuman untuk disediakan." /></StationHeader>
      {!o && <p className="text-sm text-[var(--muted)]">Pilih tiket berbayar untuk membaca pesanan minuman pelanggan.</p>}
      {o && !hasDrinks && <p className="text-sm text-[var(--muted)]">Tiket #{o.num} tidak memesan minuman.</p>}
      {hasDrinks && (
        <div className="grid xl:grid-cols-[1fr_1.6fr] gap-5">
          <OrderDrinks o={o} />
          {needsDrink(o) ? <Config o={o} /> : <p className="text-sm font-semibold text-[var(--lettuce-dark)] flex items-center gap-1" data-testid="drinks-complete"><CheckCircle2 size={16} />Semua minuman untuk tiket ini sudah siap. Bawa ke Pembungkusan.</p>}
        </div>
      )}
    </div>
  );
};
