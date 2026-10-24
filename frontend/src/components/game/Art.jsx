import { DENOM_INFO, INGREDIENTS, DRINKS } from "../../game/config";

const MOUTHS = {
  happy: "M14 27 Q20 33 26 27",
  waiting: "M15 28 L25 28",
  impatient: "M15 29 Q20 26 25 29",
  angry: "M14 30 Q20 24 26 30",
};

export const Portrait = ({ look, mood = "waiting", size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#fff3d6" stroke="#2b2a28" strokeWidth="1.5" />
    <path d="M6 40 Q8 30 20 30 Q32 30 34 40 Z" fill={look.shirt} stroke="#2b2a28" strokeWidth="1.2" />
    {look.style === "tudung" && <path d="M8 24 Q8 6 20 6 Q32 6 32 24 L33 32 Q20 36 7 32 Z" fill={look.hair} stroke="#2b2a28" strokeWidth="1.2" />}
    {look.style === "long" && <path d="M10 30 Q8 8 20 8 Q32 8 30 30 Z" fill={look.hair} stroke="#2b2a28" strokeWidth="1.2" />}
    <circle cx="20" cy="20" r="10" fill={look.skin} stroke="#2b2a28" strokeWidth="1.2" />
    {look.style === "short" && <path d="M10 18 Q11 8 20 8 Q29 8 30 18 Q24 13 10 18 Z" fill={look.hair} />}
    {look.style === "curly" && <path d="M10 18 Q9 8 14 9 Q16 6 20 8 Q24 6 26 9 Q31 8 30 18 Q20 12 10 18 Z" fill={look.hair} />}
    {look.style === "bun" && <><circle cx="20" cy="7" r="4" fill={look.hair} /><path d="M10 18 Q11 9 20 9 Q29 9 30 18 Q20 13 10 18 Z" fill={look.hair} /></>}
    {look.style === "cap" && <><path d="M10 16 Q11 8 20 8 Q29 8 30 16 Z" fill={look.shirt} stroke="#2b2a28" strokeWidth="1" /><path d="M24 15 L35 16 L30 18 L22 17 Z" fill={look.shirt} stroke="#2b2a28" strokeWidth="1" /></>}
    <circle cx="16.5" cy="20" r="1.3" fill="#2b2a28" />
    <circle cx="23.5" cy="20" r="1.3" fill="#2b2a28" />
    {mood === "angry" && <path d="M14 16.5 L18 18 M26 16.5 L22 18" stroke="#2b2a28" strokeWidth="1.3" />}
    <path d={MOUTHS[mood]} transform="translate(0 -3)" stroke="#2b2a28" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const Money = ({ denom, scale = 1, testId }) => {
  const info = DENOM_INFO[denom];
  if (info.type === "coin") {
    const d = (denom === 50 ? 46 : denom === 20 ? 40 : 36) * scale;
    return (
      <div data-testid={testId} className="rb-coin" style={{ width: d, height: d, background: info.color, fontSize: 11 * scale }}>
        {denom}<span style={{ fontSize: 8 * scale, marginLeft: 1 }}>s</span>
      </div>
    );
  }
  return (
    <div data-testid={testId} className="rb-note" style={{ width: 78 * scale, height: 40 * scale, background: info.color, fontSize: 15 * scale }}>
      {info.label}
    </div>
  );
};

const LAYER_H = { bun_bottom: 16, bun_top: 24, patty_beef: 14, patty_veg: 14, cheese: 6, lettuce: 8, tomato: 7, pickle: 6, sauce_house: 5 };

export const BurgerStack = ({ layers, width = 150 }) => (
  <div className="flex flex-col-reverse items-center" style={{ minHeight: 40 }} aria-label="Timbunan burger">
    {layers.map((l, i) => {
      const ing = typeof l === "string" ? l : l.ing;
      const top = ing === "bun_top";
      return (
        <div key={i} className="rb-pop" title={INGREDIENTS[ing].name}
          style={{
            width: ing === "lettuce" ? width + 10 : ing === "cheese" ? width + 4 : width,
            height: LAYER_H[ing], background: INGREDIENTS[ing].color, border: "1.5px solid rgba(43,42,40,.55)",
            borderRadius: top ? "60px 60px 8px 8px" : ing === "bun_bottom" ? "6px 6px 18px 18px" : ing === "lettuce" ? 10 : 6,
            marginTop: -2,
          }} />
      );
    })}
  </div>
);

export const Cup = ({ flavour, fill = 0, size = "M", ice = true, target }) => {
  const h = { S: 90, M: 110, L: 130 }[size] || 110;
  const pct = Math.min(1.2, fill);
  return (
    <div className="relative" style={{ width: 80, height: h + 10 }}>
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: h, border: "2.5px solid #2b2a28", borderTop: "none", borderRadius: "0 0 14px 14px", background: "#fff", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)" }}>
        {target && <div className="absolute left-0 right-0" style={{ bottom: `${target[0] * 100}%`, height: `${(target[1] - target[0]) * 100}%`, background: "rgba(90,165,68,.25)", borderTop: "2px dashed #3f7f2f", borderBottom: "2px dashed #3f7f2f" }} />}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: `${Math.min(100, pct * 100)}%`, background: flavour ? DRINKS[flavour].color : "#ddd", opacity: 0.9, transition: "height .1s linear" }} />
        {ice && fill > 0.2 && <div className="absolute left-4 bottom-4 w-3 h-3 bg-white/80 rotate-12 rounded-sm" />}
      </div>
      {pct > 1 && <div className="absolute -top-1 left-2 right-2 h-3 rounded-full" style={{ background: DRINKS[flavour].color }} />}
    </div>
  );
};

export const FriesBox = ({ kind = "fries", quality }) => (
  <div className="relative flex flex-col items-center" style={{ width: 54 }}>
    <div className="flex gap-[2px]" style={{ marginBottom: -6 }}>
      {kind === "fries"
        ? [0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 7, height: 26 + (i % 2) * 6, background: quality === 0 ? "#5a3a22" : "#f6c636", border: "1px solid #c98d12", borderRadius: 2 }} />)
        : [0, 1, 2].map((i) => <div key={i} style={{ width: 15, height: 12, background: quality === 0 ? "#5a3a22" : "#d9953f", border: "1px solid #8a5a22", borderRadius: 6 }} />)}
    </div>
    <div style={{ width: 54, height: 30, background: kind === "fries" ? "var(--tomato)" : "var(--mustard)", border: "2px solid #2b2a28", borderRadius: "4px 4px 10px 10px" }} />
  </div>
);

export const PattyDisc = ({ doneness }) => {
  const c = doneness === "burnt" ? "#2a1a12" : doneness === "raw" ? "#c4736b" : doneness === "mid" ? "#9a5a3c" : "#6e4128";
  return <div className={doneness !== "burnt" ? "rb-sizzle" : ""} style={{ width: 90, height: 34, borderRadius: "50%", background: c, border: "2.5px solid #2b2a28", boxShadow: "inset 0 -5px 0 rgba(0,0,0,.2)" }} />;
};
