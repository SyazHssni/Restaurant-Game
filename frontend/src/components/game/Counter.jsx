import { useGame, Empty, PatienceBar, moodFor, MOOD_TEXT } from "./shared";
import { Portrait } from "./Art";
import { lineName } from "../../game/orders";
import { INGREDIENTS } from "../../game/config";

const joinItems = (items) => items.length < 2 ? (items[0] || "") : `${items.slice(0, -1).join(", ")} dan ${items[items.length - 1]}`;

function dialogueOrderItems(lines = []) {
  const describe = (line) => {
    const quantity = line.qty > 1 ? `${line.qty} × ` : "";
    const modifiers = (line.exclude || []).map((ingredient) => `tanpa ${INGREDIENTS[ingredient]?.name?.toLowerCase() || ingredient}`);
    return `${quantity}${lineName(line)}${modifiers.length ? ` (${modifiers.join(", ")})` : ""}`;
  };
  return {
    food_item: joinItems(lines.filter((line) => line.kind !== "drink").map(describe)),
    drink_item: joinItems(lines.filter((line) => line.kind === "drink").map(describe)),
  };
}

export const Counter = () => {
  const { state: s, dispatch } = useGame();
  const c = s.queue.find((x) => x.id === s.selectedCustomerId) || s.queue[0];
  const active = s.orders.filter((o) => o.status === "awaiting_payment" || o.status === "paid").length;
  const full = active >= s.cfg.maxActive;
  if (!c) return <Empty testId="counter-empty" title="Kaunter lengang" text={s.grace ? "Kedai sudah ditutup. Siapkan pesanan yang tinggal." : "Pelanggan seterusnya akan tiba sebentar lagi. Gunakan masa ini untuk memasak."} />;
  const mood = moodFor(c.patience / c.maxPatience);
  const dialogueIndex = c.dialogueIndex || 0;
  const greetingOrder = c.dialogue?.greetingOrder?.[dialogueIndex % (c.dialogue?.greetingOrder?.length || 1)];
  const items = dialogueOrderItems(c.orderLines);
  const spokenOrder = greetingOrder?.order
    ?.replaceAll("{food_item}", items.food_item || "hidangan")
    .replaceAll("{drink_item}", items.drink_item || "minuman");
  const moodLines = mood === "waiting" ? c.dialogue?.waiting : c.dialogue?.leaving;
  const dialogue = Array.isArray(moodLines)
    ? moodLines[dialogueIndex % moodLines.length]
    : moodLines;
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center p-4" data-testid="counter-station">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-[#ffe7a6] p-3 border-2 border-[var(--line)]"><Portrait look={c.look} mood={mood} size={150} /></div>
        <p className="rb-display text-2xl font-extrabold" data-testid="counter-customer-name">{c.name}</p>
        <p className="text-sm text-[var(--muted)]">{MOOD_TEXT[mood]}</p>
        <div className="w-48"><PatienceBar value={c.patience} max={c.maxPatience} /></div>
      </div>
      <div className="space-y-6">
        <div className="relative bg-white border-2 border-[var(--charcoal)] rounded-3xl p-6 max-w-xl rb-pop space-y-2">
          {mood === "happy" && greetingOrder ? (
            <>
              <p className="text-lg" data-testid="counter-greeting">"{greetingOrder.greeting}"</p>
              <p className="text-lg" data-testid="counter-order-dialogue">"{spokenOrder}"</p>
            </>
          ) : (
            <p className="text-lg" data-testid="counter-greeting">"{dialogue}"</p>
          )}
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
