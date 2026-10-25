import { DENOM_INFO, INGREDIENTS, DRINKS, PATTY_TEXTURES, CUP_TEXTURES, CUP_COVER_TEXTURE, ICE_CUBE_TEXTURE, FRY_TEXTURES } from "../../game/config";

const MOUTHS = {
  happy: "M14 27 Q20 33 26 27",
  waiting: "M15 28 L25 28",
  impatient: "M15 29 Q20 26 25 29",
  angry: "M14 30 Q20 24 26 30",
};

export const Portrait = ({ look, mood = "waiting", size = 56 }) => look?.image ? (
  <img src={look.image} width={size} height={size} className="block rounded-full border border-[var(--charcoal)] bg-white object-cover" alt="" aria-hidden="true" />
) : (
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
  const coinSize = denom === 50 ? 46 : denom === 20 ? 40 : 36;
  const width = (info.type === "coin" ? coinSize : 78) * scale;
  const height = (info.type === "coin" ? coinSize : 40) * scale;
  return (
    <div data-testid={testId} className="flex shrink-0 items-center justify-center overflow-hidden" style={{ width, height }}>
      <img
        src={info.image}
        alt={info.label}
        width={width}
        height={height}
        className={`h-full w-full select-none ${info.type === "coin" ? "object-contain" : "object-cover"}`}
        draggable="false"
      />
    </div>
  );
};


const OVERLAP_BY_TOP_LAYER = { pickle: 52, tomato: 50, cheese: 50, sauce_house: 52 };

export const BurgerStack = ({ layers, width = 150 }) => (
  <div className="flex flex-col items-center" style={{ minHeight: 40 }} aria-label="Timbunan burger">
    {[...layers].map((layer, index) => ({ layer, index })).reverse().map(({ layer, index }) => {
      const ing = typeof layer === "string" ? layer : layer.ing;
      const aboveLayer = layers[index + 1];
      const aboveIng = aboveLayer ? (typeof aboveLayer === "string" ? aboveLayer : aboveLayer.ing) : null;
      const overlap = OVERLAP_BY_TOP_LAYER[aboveIng] ?? 40;
      const layerWidth = (ing === "lettuce" ? width + 10 : ing === "cheese" ? width + 4 : width) * 0.68;
      return (
        <img
          key={index}
          src={INGREDIENTS[ing].texture}
          title={INGREDIENTS[ing].name}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="rb-pop select-none"
          style={{ width: layerWidth, height: "auto", marginTop: index === layers.length - 1 ? 0 : -overlap, position: "relative", zIndex: index + 1 }}
        />
      );
    })}
  </div>
);

export const Cup = ({ flavour, fill = 0, size = "M", ice = true, target, covered = false }) => {
  const sizes = { S: { height: 90, ratio: 85 / 108 }, M: { height: 110, ratio: 101 / 145 }, L: { height: 130, ratio: 119 / 185 } };
  const { height: h, ratio } = sizes[size] || sizes.M;
  const w = Math.round(h * ratio);
  const pct = Math.min(1.2, fill);
  const liquid = flavour ? DRINKS[flavour].color : "#bfe3f2";
  const bodyBottom = 3;
  const bodyHeight = 84;
  const cupInterior = "polygon(0 0,100% 0,85% 100%,15% 100%)";
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <img src={CUP_TEXTURES[size] || CUP_TEXTURES.M} alt="" aria-hidden="true" draggable="false" className="absolute inset-0 z-0 h-full w-full select-none object-contain" />
      {pct > 0 && (
        <div className="absolute left-[5%] right-[5%] overflow-hidden" style={{ bottom: `${bodyBottom}%`, height: `${bodyHeight}%`, clipPath: cupInterior, zIndex: 1 }}>
          <div className="absolute inset-x-0 bottom-0" style={{ height: `${Math.min(100, pct * 100)}%`, backgroundColor: liquid, opacity: 0.55, transition: "height .1s linear", borderRadius: "50% 50% 0 0 / 8px 8px 0 0" }} />
        </div>
      )}
      {target && (
        <div className="absolute left-[5%] right-[5%] border-y-2 border-dashed border-[var(--lettuce-dark)] bg-[rgba(90,165,68,0.25)]" style={{ bottom: `${bodyBottom + target[0] * bodyHeight}%`, height: `${Math.max(2, (target[1] - target[0]) * bodyHeight)}%`, clipPath: cupInterior, zIndex: 2 }} />
      )}
      {ice && fill > 0.2 && <img src={ICE_CUBE_TEXTURE} alt="" aria-hidden="true" className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 object-contain" style={{ zIndex: 3 }} />}
      {covered && <img src={CUP_COVER_TEXTURE} alt="" aria-hidden="true" draggable="false" className="absolute left-1/2 -translate-x-1/2 select-none" style={{ width: w * 1.12, maxWidth: "none", top: "-6%", zIndex: 4 }} />}
    </div>
  );
};

export const FriesBox = ({ kind = "fries", quality, size = "M" }) => {
  if (kind === "fries") {
    const width = { S: 125, M: 120, L: 138 }[size] || 120;
    return (
      <div className="flex items-center justify-center">
        <img
          src={FRY_TEXTURES[size] || FRY_TEXTURES.M}
          alt=""
          aria-hidden="true"
          draggable="false"
          className="select-none object-contain"
          style={{ width, height: "auto", filter: quality === 0 ? "grayscale(0.55) brightness(0.58)" : undefined }}
        />
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center" style={{ width: 54 }}>
      <div className="flex gap-[2px]" style={{ marginBottom: -6 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 15, height: 12, background: quality === 0 ? "#5a3a22" : "#d9953f", border: "1px solid #8a5a22", borderRadius: 6 }} />)}
      </div>
      <div style={{ width: 54, height: 30, background: "var(--mustard)", border: "2px solid #2b2a28", borderRadius: "4px 4px 10px 10px" }} />
    </div>
  );
};

export const PattyDisc = ({ doneness, type = "beef", size = 90 }) => {
  const pattyType = type === "veg" ? "veg" : "beef";
  const stage = { raw: "raw", mid: "medium", done: "cooked", overcooked: "overcooked", burnt: "burned" }[doneness] || "cooked";
  const width = size;
  const height = Math.round(size / (pattyType === "veg" ? 1.6 : 1.8));
  return (
    <img
      src={PATTY_TEXTURES[pattyType][stage]}
      width={width}
      height={height}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`${doneness !== "burnt" ? "rb-sizzle" : ""} select-none object-contain`}
    />
  );
};
