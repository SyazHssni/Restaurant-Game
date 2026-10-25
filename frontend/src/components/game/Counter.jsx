import { useGame, Empty, PatienceBar, moodFor, MOOD_TEXT } from "./shared";
import { Portrait } from "./Art";

export const Counter = () => {
  const { state: s, dispatch } = useGame();
  const c = s.queue.find((x) => x.id === s.selectedCustomerId) || s.queue[0];
  const active = s.orders.filter((o) => o.status === "awaiting_payment" || o.status === "paid").length;
  const full = active >= s.cfg.maxActive;
  if (!c) return <Empty testId="counter-empty" title="Kaunter lengang" text={s.grace ? "Kedai sudah ditutup. Siapkan pesanan yang tinggal." : "Pelanggan seterusnya akan tiba sebentar lagi. Gunakan masa ini untuk memasak."} />;
  const mood = moodFor(c.patience / c.maxPatience);
  const dialogueLines = c.dialogue?.[mood] ?? c.dialogue?.happy ?? c.greet;
  const customerNumber = Number(String(c.id || "").match(/\d+/)?.[0] || 0);
  const dialogue = Array.isArray(dialogueLines)
    ? dialogueLines[customerNumber % dialogueLines.length]
    : dialogueLines;
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center p-4" data-testid="counter-station">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-[#ffe7a6] p-3 border-2 border-[var(--line)]"><Portrait look={c.look} mood={mood} size={150} /></div>
        <p className="rb-display text-2xl font-extrabold" data-testid="counter-customer-name">{c.name}</p>
        <p className="text-sm text-[var(--muted)]">{MOOD_TEXT[mood]}</p>
        <div className="w-48"><PatienceBar value={c.patience} max={c.maxPatience} /></div>
      </div>
      <div className="space-y-6">
        <div className="relative bg-white border-2 border-[var(--charcoal)] rounded-3xl p-6 max-w-xl rb-pop">
          <p className="text-lg" data-testid="counter-greeting">"{dialogue}"</p>
          <span className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-[var(--charcoal)] rotate-45" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button data-testid="take-order-button" disabled={full} className="rb-btn rb-red text-xl px-8 py-3" onClick={() => dispatch({ type: "TAKE_ORDER", customerId: c.id })}>
            Ambil Pesanan
          </button>
          {full && <p className="text-sm font-semibold text-[var(--tomato)]" data-testid="ticket-rail-full">Rel tiket penuh ({active}/{s.cfg.maxActive}). Hidangkan pesanan dahulu.</p>}
        </div>
        <p className="text-sm text-[var(--muted)] max-w-xl">Selepas mengambil pesanan, terima bayaran di <b>Mesin Tunai</b> dahulu. Makanan hanya boleh disediakan selepas bayaran.</p>
      </div>
    </div>
  );
};
