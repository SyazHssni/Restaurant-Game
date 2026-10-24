import { createContext, useContext } from "react";

export const GameCtx = createContext(null);
export const useGame = () => useContext(GameCtx);

export const moodFor = (ratio, angry) => (angry ? "angry" : ratio > 0.6 ? "happy" : ratio > 0.25 ? "waiting" : "impatient");
export const MOOD_TEXT = { happy: "Gembira", waiting: "Menunggu", impatient: "Hampir pergi!", angry: "Tidak puas hati" };

export const PatienceBar = ({ value, max, testId }) => {
  const r = Math.max(0, value / max);
  const color = r > 0.5 ? "var(--lettuce)" : r > 0.25 ? "var(--mustard)" : "var(--tomato)";
  return (
    <div className="rb-bar" data-testid={testId} role="progressbar" aria-valuenow={Math.round(r * 100)} aria-label="Kesabaran">
      <div style={{ width: `${r * 100}%`, background: color }} />
    </div>
  );
};

export const Empty = ({ title, text, testId }) => (
  <div data-testid={testId} className="h-full min-h-[220px] flex flex-col items-center justify-center text-center gap-2 p-8">
    <p className="rb-display text-2xl font-bold">{title}</p>
    <p className="text-sm text-[var(--muted)] max-w-md">{text}</p>
  </div>
);

export const StationHeader = ({ title, children }) => (
  <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
    <h2 className="rb-display text-2xl font-extrabold">{title}</h2>
    <div className="flex items-center gap-2 flex-wrap">{children}</div>
  </div>
);

// Chips of paid orders that still need work at this station.
export const OrderPicker = ({ filter, emptyText }) => {
  const { state, dispatch } = useGame();
  const orders = state.orders.filter((o) => o.status === "paid" && filter(o));
  if (!orders.length) return <p className="text-sm text-[var(--muted)]" data-testid="order-picker-empty">{emptyText}</p>;
  return (
    <div className="flex gap-2 flex-wrap" data-testid="order-picker">
      {orders.map((o) => (
        <button key={o.id} data-testid={`order-picker-${o.num}`} onClick={() => dispatch({ type: "SELECT_ORDER", orderId: o.id })}
          className={`rb-btn text-sm ${state.selectedOrderId === o.id ? "rb-dark" : "rb-white"}`}>
          #{o.num} · {o.customer.name}
        </button>
      ))}
    </div>
  );
};
