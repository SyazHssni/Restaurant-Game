import { BURGERS, FRY_ITEMS, DRINKS, DRINK_PRICES, SIZE_NAMES, INGREDIENTS, REMOVABLE, DISCOUNTS, CUSTOMER_TYPES } from "./config";
import { orderTotal, makeChange } from "./money";

export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

export function lineName(l) {
  if (l.kind === "burger") return BURGERS[l.productId].name;
  if (l.kind === "fries") return `${FRY_ITEMS.fries.name} ${SIZE_NAMES[l.size]}`;
  if (l.kind === "bites") return `${FRY_ITEMS.bites.name} ${SIZE_NAMES[l.size]}`;
  return `${DRINKS[l.flavour].name} ${SIZE_NAMES[l.size]}`;
}
export function lineMods(l) {
  const m = l.exclude.map((i) => `Tanpa ${INGREDIENTS[i].name.toLowerCase()}`);
  if (l.kind === "drink" && !l.ice) m.push("Tanpa ais");
  return m;
}
const lineKey = (l) => [l.kind, l.productId, l.size, l.flavour, l.ice, l.exclude.join("+")].join("|");

export function orderSpeech(lines) {
  const parts = lines.map((l) => {
    const mods = lineMods(l);
    return `${l.qty} ${lineName(l)}${mods.length ? ` (${mods.join(", ").toLowerCase()})` : ""}`;
  });
  const last = parts.pop();
  return `Saya nak ${parts.length ? parts.join(", ") + " dan " : ""}${last}.`;
}

function buildLine(rng, kind, cfg, type, allowMods) {
  const base = { kind, exclude: [], ice: true, qty: 1 };
  if (kind === "burger") {
    const pool = type.explorer ? cfg.menu.burgers.slice(-2) : cfg.menu.burgers;
    const productId = pick(rng, pool);
    const ex = [];
    if (allowMods && (type.picky || rng() < 0.22)) {
      const opts = REMOVABLE.filter((i) => BURGERS[productId].layers.includes(i));
      ex.push(pick(rng, opts));
    }
    return { ...base, productId, exclude: ex, unit: BURGERS[productId].price };
  }
  if (kind === "fries" || kind === "bites") {
    const size = pick(rng, kind === "fries" ? cfg.menu.fries : cfg.menu.bites);
    return { ...base, productId: kind, size, unit: FRY_ITEMS[kind].sizes[size] };
  }
  const size = pick(rng, cfg.menu.sizes);
  const flavour = pick(rng, cfg.menu.drinks);
  const ice = flavour === "water" ? true : !(cfg.noIce && allowMods && (type.picky || rng() < 0.2));
  return { ...base, productId: "drink", size, flavour, ice, unit: DRINK_PRICES[size] };
}

export function pickCustomerType(rng, recentTypes) {
  const pool = CUSTOMER_TYPES.filter((c) => !recentTypes.includes(c.id));
  return pick(rng, pool.length ? pool : CUSTOMER_TYPES);
}

export function generateLines(rng, cfg, mode, type) {
  const challenge = mode === "challenge";
  let maxLines = cfg.maxLines + (challenge ? 1 : 0);
  let nLines = type.simple ? 1 + Math.floor(rng() * 2) : 1 + Math.floor(rng() * maxLines);
  if (type.family) nLines = Math.max(2, Math.min(maxLines + 1, nLines + 1));
  nLines = Math.max(1, Math.min(nLines, 4));
  const cats = ["burger", "fries", "drink"];
  if (cfg.menu.bites.length) cats.push("bites");
  const order = [...cats].sort(() => rng() - 0.5);
  if (!order.slice(0, nLines).includes("burger") && rng() < 0.7) order.unshift("burger");
  const kinds = [];
  for (let i = 0; i < nLines; i++) kinds.push(order[i % order.length]);
  const lines = [];
  for (const k of kinds) {
    const l = buildLine(rng, k, cfg, type, cfg.exclusions);
    const maxQty = cfg.maxQty + (challenge ? 1 : 0) + (type.family || type.big ? 1 : 0);
    if (rng() < (challenge ? 0.45 : 0.3)) l.qty = 2 + Math.floor(rng() * Math.max(1, maxQty - 1));
    l.qty = Math.min(l.qty, maxQty);
    const dup = lines.find((x) => lineKey(x) === lineKey(l));
    if (dup) dup.qty = Math.min(dup.qty + l.qty, maxQty);
    else lines.push(l);
  }
  let units = lines.reduce((a, l) => a + l.qty, 0);
  while (units > 6) {
    const big = lines.reduce((a, b) => (b.qty > a.qty ? b : a));
    big.qty -= 1;
    units -= 1;
  }
  return lines.map((l, i) => ({ ...l, lid: `L${i + 1}` }));
}

export function pickDiscount(rng, cfg, mode, subtotal) {
  if (mode !== "challenge" || !cfg.discount || subtotal < 800 || rng() > 0.3) return null;
  return pick(rng, DISCOUNTS);
}

const NOTES = [500, 1000, 2000, 5000, 10000];
export function generateTender(rng, total, mode, drawer) {
  const cands = [];
  const single = NOTES.find((n) => n >= total);
  if (single) cands.push([single]);
  if (mode === "challenge") {
    const ringgitUp = Math.ceil(total / 100) * 100;
    const notes = [];
    let left = ringgitUp;
    for (const n of [5000, 2000, 1000, 500, 100]) while (left >= n) { notes.push(n); left -= n; }
    if (notes.length > 1) cands.push(notes, notes);
    if (single && total % 100 !== 0) {
      const sen = total % 100;
      const coins = [];
      let s = sen;
      for (const c of [50, 20, 10]) while (s >= c) { coins.push(c); s -= c; }
      if (single - total > 100) cands.push([single, ...coins]);
    }
    if (single && single < 10000 && rng() < 0.3) cands.push([NOTES[NOTES.indexOf(single) + 1]]);
  }
  if (rng() < 0.1) {
    const exact = makeChange(total, { 10000: 1, 5000: 1, 2000: 2, 1000: 2, 500: 2, 100: 9, 50: 1, 20: 4, 10: 2 });
    if (exact) cands.push(exact);
  }
  const valid = cands.filter((c) => {
    const tender = c.reduce((a, b) => a + b, 0);
    if (tender < total) return false;
    const after = { ...drawer };
    c.forEach((d) => { after[d] = (after[d] || 0) + 1; });
    return makeChange(tender - total, after) !== null;
  });
  if (!valid.length) return makeChange(total, { 10000: 9, 5000: 9, 2000: 9, 1000: 9, 500: 9, 100: 9, 50: 9, 20: 9, 10: 9 });
  return pick(rng, valid);
}

export function expandUnits(lines) {
  const units = [];
  lines.forEach((l) => {
    for (let k = 0; k < l.qty; k++) {
      units.push({ uid: `${l.lid}-${k + 1}`, lid: l.lid, kind: l.kind, productId: l.productId, size: l.size, flavour: l.flavour, ice: l.ice, exclude: l.exclude, state: "todo", accuracy: null, quality: null, busy: false });
    }
  });
  return units;
}

export function buildOrderDraft(rng, cfg, mode, type, drawer) {
  const lines = generateLines(rng, cfg, mode, type);
  const subtotal = orderTotal(lines, 0);
  const discount = pickDiscount(rng, cfg, mode, subtotal);
  const total = subtotal - (discount ? discount.amount : 0);
  const tender = generateTender(rng, total, mode, drawer);
  return { lines, discount, total, tender };
}

export const TUTORIAL_DRAFT = {
  lines: [
    { lid: "L1", kind: "burger", productId: "classic", exclude: [], ice: true, qty: 1, unit: 600 },
    { lid: "L2", kind: "fries", productId: "fries", size: "S", exclude: [], ice: true, qty: 1, unit: 200 },
    { lid: "L3", kind: "drink", productId: "drink", size: "S", flavour: "cola", exclude: [], ice: true, qty: 1, unit: 150 },
  ],
  discount: null,
  total: 950,
  tender: [1000],
};
