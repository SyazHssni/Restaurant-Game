import { Delete, Lightbulb, Undo2, Eraser, Calculator, HandCoins, CheckCircle2, XCircle } from "lucide-react";
import { useGame, Empty, StationHeader } from "./shared";
import { Money } from "./Art";
import { DENOMS, DENOM_INFO } from "../../game/config";
import { formatRM, lineTotal, sumDenoms } from "../../game/money";
import { lineName, lineMods, orderSpeech } from "../../game/orders";

const Receipt = ({ o }) => {
  const { state: s } = useGame();
  const p = o.payment;
  const showLines = s.mode === "guided" || p.hint >= 1;
  const showTotal = p.stage !== "bill" || p.hint >= 2;
  return (
    <div className="rb-receipt p-4 space-y-2" data-testid="register-receipt">
      <p className="text-xs text-[var(--muted)] italic">"{orderSpeech(o.lines)}"</p>
      <div className="border-t-2 border-dashed border-[var(--line)] pt-2 space-y-2">
        {o.lines.map((l) => (
          <div key={l.lid} className="text-sm" data-testid={`receipt-line-${l.lid}`}>
            <div className="flex justify-between gap-2 font-semibold"><span>{lineName(l)}</span><span>{formatRM(l.unit)} × {l.qty}</span></div>
            {lineMods(l).length > 0 && <p className="text-xs text-[var(--muted)]">{lineMods(l).join(", ")}</p>}
            {showLines && <p className="text-right text-xs text-[var(--lettuce-dark)] font-semibold">= {formatRM(lineTotal(l.unit, l.qty))}</p>}
          </div>
        ))}
        {o.discount && (
          <div className="flex justify-between text-sm font-semibold text-[var(--lettuce-dark)]" data-testid="receipt-discount">
            <span>{o.discount.label}</span><span>− {formatRM(o.discount.amount)}</span>
          </div>
        )}
      </div>
      <div className="border-t-2 border-[var(--charcoal)] pt-2 flex justify-between rb-display text-lg font-extrabold">
        <span>Jumlah bil</span>
        <span data-testid="receipt-total">{showTotal ? formatRM(o.total) : "RM ?"}</span>
      </div>
      <div className="bg-[#fff1cf] rounded-xl p-3">
        <p className="text-sm font-semibold">Pelanggan bayar: <span className="rb-display text-lg" data-testid="receipt-tender">{formatRM(o.tenderSum)}</span></p>
        <div className="flex gap-1 flex-wrap mt-2 items-center">{o.tender.map((d, i) => <Money key={i} denom={d} scale={0.7} />)}</div>
      </div>
      {p.stage === "change" && (
        <p className="text-sm font-semibold" data-testid="receipt-change-hint">
          {p.hint >= 3 ? <>Baki perlu diberi: <span className="text-[var(--tomato)]">{formatRM(o.tenderSum - o.total)}</span></>
            : s.mode === "challenge" ? "Baki = ? (kira sendiri)" : <>Baki = {formatRM(o.tenderSum)} − {formatRM(o.total)} = ?</>}
        </p>
      )}
    </div>
  );
};

const PAD = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "back"];
const BillPad = ({ o }) => {
  const { dispatch } = useGame();
  const p = o.payment;
  const key = (k) => dispatch({ type: "REG_KEY", orderId: o.id, key: k });
  return (
    <div className="space-y-3" data-testid="bill-pad">
      <p className="text-sm font-semibold">Langkah 1: Kira jumlah bil dan taipkan.</p>
      <div className="bg-[var(--charcoal)] text-[#b8f28a] rounded-2xl px-4 py-3 rb-display text-4xl font-bold text-right tabular" data-testid="bill-input-display">
        RM {p.input || <span className="opacity-40">0.00</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {PAD.map((k) => (
          <button key={k} data-testid={`numpad-${k === "." ? "dot" : k}`} onClick={() => key(k)} className="rb-btn rb-white text-2xl py-3 rounded-2xl" aria-label={k === "back" ? "Padam satu" : k}>
            {k === "back" ? <Delete className="mx-auto" /> : k}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button data-testid="numpad-clear" className="rb-btn rb-white" onClick={() => key("clear")}>Padam Semua</button>
        <button data-testid="bill-submit-button" className="rb-btn rb-green text-lg" onClick={() => dispatch({ type: "REG_SUBMIT", orderId: o.id })}>Sahkan</button>
      </div>
      {p.billMsg && !p.billMsg.ok && <p data-testid="bill-feedback" className="text-sm font-semibold text-[var(--tomato-dark)] flex gap-1"><XCircle size={16} className="shrink-0 mt-0.5" />{p.billMsg.text}</p>}
      <p className="text-xs text-[var(--muted)]">Pad ini hanya merekod jawapan — ia tidak mengira. Kekunci nombor, titik, Backspace dan Enter juga boleh digunakan.</p>
    </div>
  );
};

const ChangeTray = ({ o }) => {
  const { state: s, dispatch } = useGame();
  const p = o.payment;
  const exact = o.tenderSum === o.total;
  const act = (type) => dispatch({ type, orderId: o.id });
  return (
    <div className="space-y-3" data-testid="change-tray">
      <p className="text-sm font-semibold flex items-center gap-1 text-[var(--lettuce-dark)]"><CheckCircle2 size={16} />{p.billMsg?.text}</p>
      <p className="text-sm font-semibold">Langkah 2: Kira baki, kemudian pilih not dan syiling dari laci.</p>
      <div className="min-h-[120px] rounded-2xl border-2 border-dashed border-[var(--charcoal)] bg-[#f6ead2] p-3 flex flex-wrap gap-2 items-center content-start rb-drawer">
        {!p.tray.length && <span className="text-sm text-[var(--muted)]">Dulang baki kosong</span>}
        {p.tray.map((d, i) => <span key={i} className="rb-pop"><Money denom={d} scale={0.8} /></span>)}
      </div>
      <p className="text-sm tabular" data-testid="tray-count">
        {p.tray.length} keping dalam dulang
        {(s.mode === "guided" || p.recount !== null) && <> · Jumlah dalam dulang: <b>{formatRM(s.mode === "guided" ? sumDenoms(p.tray) : p.recount)}</b></>}
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button data-testid="change-undo-button" className="rb-btn rb-white text-sm flex items-center justify-center gap-1" onClick={() => act("REG_UNDO")}><Undo2 size={15} />Buat Asal</button>
        <button data-testid="change-clear-button" className="rb-btn rb-white text-sm flex items-center justify-center gap-1" onClick={() => act("REG_CLEAR")}><Eraser size={15} />Kosongkan</button>
        <button data-testid="change-recount-button" className="rb-btn rb-white text-sm flex items-center justify-center gap-1" onClick={() => act("REG_RECOUNT")}><Calculator size={15} />Kira Semula</button>
      </div>
      {exact ? (
        <button data-testid="exact-payment-confirm-button" className="rb-btn rb-yellow w-full text-lg py-3" onClick={() => { act("REG_CLEAR"); act("REG_GIVE"); }}>
          Bayaran Tepat — Sahkan RM0.00
        </button>
      ) : (
        <button data-testid="give-change-button" className="rb-btn rb-red w-full text-lg py-3 flex items-center justify-center gap-2" onClick={() => act("REG_GIVE")}>
          <HandCoins size={20} />Beri Baki
        </button>
      )}
    </div>
  );
};

const Drawer = ({ o }) => {
  const { state: s, dispatch } = useGame();
  const p = o.payment;
  const disabled = p.stage !== "change" || o.tenderSum === o.total;
  return (
    <div data-testid="cash-drawer">
      <p className="rb-display font-extrabold mb-2">Laci Wang</p>
      <div className="grid grid-cols-3 gap-2">
        {DENOMS.map((d) => {
          const left = (s.drawer[d] || 0) - p.tray.filter((x) => x === d).length;
          return (
            <button key={d} data-testid={`denom-${d}`} disabled={disabled || left <= 0}
              onClick={() => dispatch({ type: "REG_ADD", orderId: o.id, denom: d })}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-[var(--line)] bg-white hover:bg-[#fff1cf] hover:border-[var(--mustard-dark)] disabled:opacity-40 disabled:hover:bg-white transition-colors">
              <Money denom={d} scale={0.75} />
              <span className="text-[11px] font-semibold">{DENOM_INFO[d].label}</span>
              <span className="text-[11px] text-[var(--muted)]" data-testid={`denom-left-${d}`}>Tinggal: {left}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Register = () => {
  const { state: s, dispatch } = useGame();
  const o = s.orders.find((x) => x.id === s.selectedOrderId && x.status === "awaiting_payment");
  const waiting = s.orders.filter((x) => x.status === "awaiting_payment");
  const last = s.lastPayment;
  return (
    <div data-testid="register-station">
      <StationHeader title={o ? `Mesin Tunai — Pesanan #${o.num}` : "Mesin Tunai"}>
        {waiting.map((w) => (
          <button key={w.id} data-testid={`register-pick-${w.num}`} className={`rb-btn text-sm ${o && o.id === w.id ? "rb-dark" : "rb-yellow"}`} onClick={() => dispatch({ type: "SELECT_ORDER", orderId: w.id })}>
            #{w.num} {w.customer.name}
          </button>
        ))}
        {o && (
          <button data-testid="register-hint-button" className="rb-btn rb-white text-sm flex items-center gap-1" disabled={o.payment.hint >= (o.payment.stage === "bill" ? 2 : 3)} onClick={() => dispatch({ type: "REG_HINT", orderId: o.id })}>
            <Lightbulb size={15} /> Petunjuk <span className="text-[10px] text-[var(--muted)]">(kurangkan bonus)</span>
          </button>
        )}
      </StationHeader>
      {last && (
        <div data-testid="payment-result" className={`mb-3 rounded-xl px-4 py-2 text-sm font-semibold border-2 ${last.ok ? "bg-[#e5f4dc] border-[var(--lettuce)]" : "bg-[#fde3dc] border-[var(--tomato)]"}`}>
          Keputusan bayaran #{last.orderNum}: {last.text}
        </div>
      )}
      {!o ? (
        <Empty testId="register-empty" title="Tiada bayaran untuk diproses" text={waiting.length ? "Pilih pesanan di atas untuk menerima bayaran." : "Ambil pesanan di Kaunter, kemudian kembali ke sini untuk mengira bil dan baki."} />
      ) : (
        <div className="grid lg:grid-cols-[1fr_1fr_1.2fr] gap-5">
          <Receipt o={o} />
          {o.payment.stage === "bill" ? <BillPad o={o} /> : <ChangeTray o={o} />}
          <Drawer o={o} />
        </div>
      )}
    </div>
  );
};
