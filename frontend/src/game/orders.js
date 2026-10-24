import { BURGERS, FRY_ITEMS, DRINKS, drinkPrice, TEMPS, SIZE_NAMES, INGREDIENTS, REMOVABLE, DISCOUNTS, CUSTOMER_TYPES } from "./config";
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
  return `${DRINKS[l.flavour].name}, saiz ${SIZE_NAMES[l.size].toLowerCase()}, ${TEMPS[l.temp].toLowerCase()}`;
}
export function lineMods(l) {
  const m = l.exclude.map((i) => `Tanpa ${INGREDIENTS[i].name.toLowerCase()}`);
  return m;
}
const lineKey = (l) => [l.kind, l.productId, l.size, l.flavour, l.temp, l.exclude.join("+")].join("|");

export function orderSpeech(lines) {
  const parts = lines.map((l) => {
    const mods = lineMods(l);
    return `${l.qty} ${lineName(l)}${mods.length ? ` (${mods.join(", ").toLowerCase()})` : ""}`;
  });
  const last = parts.pop();
  return `Saya nak ${parts.length ? parts.join(", ") + " dan " : ""}${last}.`;
}

function buildLine(rng, kind, cfg, type, allowMods) {
  const base = { kind, exclude: [], qty: 1 };
  if (kind === "burger") {
    const newest = Math.max(...cfg.menu.burgers.map((b) => BURGERS[b].day));
    const fresh = cfg.menu.burgers.filter((b) => BURGERS[b].day === newest);
    const pool = type.explorer && fresh.length ? fresh : cfg.menu.burgers;
    const productId = pick(rng, pool);
    const ex = [];
    const opts = REMOVABLE.filter((i) => BURGERS[productId].layers.includes(i));
    if (allowMods && opts.length > 1 && (type.picky || rng() < 0.15)) {
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
  const temp = pick(rng, DRINKS[flavour].temps);
  return { ...base, productId: "drink", size, flavour, temp, unit: drinkPrice(flavour, size) };
}

export function pickCustomerType(rng, recentTypes) {
  const pool = CUSTOMER_TYPES.filter((c) => !recentTypes.includes(c.id));
  return pick(rng, pool.length ? pool : CUSTOMER_TYPES);
}

// Large mixed orders from Day 4: several burgers, several drinks, sides, many configurations.
function generateBulkLines(rng, cfg, type) {
  const lines = [];
  const add = (kind, qty) => {
    const l = { ...buildLine(rng, kind, cfg, type, cfg.exclusions), qty };
    const dup = lines.find((x) => lineKey(x) === lineKey(l));
    if (dup) dup.qty += qty;
    else lines.push(l);
  };
  const split = (total, kind) => {
    let left = total;
    while (left > 0) {
      const q = left === 1 || rng() < 0.4 ? left : 1 + Math.floor(rng() * (left - 1));
      add(kind, q);
      left -= q;
    }
  };
  if (cfg.menu.burgers.length) split(2 + Math.floor(rng() * 3), "burger");
  split(2 + Math.floor(rng() * 2), "drink");
  split(1 + Math.floor(rng() * 2), "fries");
  if (cfg.menu.bites.length && rng() < 0.5) add("bites", 1);
  return lines;
}

export function generateLines(rng, cfg, mode, type) {
  const challenge = mode === "challenge";
  if (cfg.bulk && (rng() < cfg.bulk || (type.family && rng() < 0.7))) {
    const bulk = generateBulkLines(rng, cfg, type);
    let units = bulk.reduce((a, l) => a + l.qty, 0);
    while (units > 10 || orderTotal(bulk, 0) > 8000) {
      const big = bulk.reduce((a, b) => (b.qty > a.qty ? b : a));
      if (big.qty > 1) big.qty -= 1; else bulk.splice(bulk.indexOf(big), 1);
      units = bulk.reduce((a, l) => a + l.qty, 0);
    }
    return bulk.map((l, i) => ({ ...l, lid: `L${i + 1}` }));
  }
  let maxLines = cfg.maxLines + (challenge ? 1 : 0);
  let nLines = type.simple ? 1 + Math.floor(rng() * 2) : 1 + Math.floor(rng() * maxLines);
  if (type.family) nLines = Math.max(2, Math.min(maxLines + 1, nLines + 1));
  nLines = Math.max(1, Math.min(nLines, 4));
  const cats = ["fries", "drink"];
  if (cfg.menu.burgers.length) cats.push("burger");
  if (cfg.menu.bites.length) cats.push("bites");
  const order = [...cats].sort(() => rng() - 0.5);
  if (cfg.menu.burgers.length && !order.slice(0, nLines).includes("burger") && rng() < 0.7) order.unshift("burger");
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
      units.push({ uid: `${l.lid}-${k + 1}`, lid: l.lid, kind: l.kind, productId: l.productId, size: l.size, flavour: l.flavour, temp: l.temp, exclude: l.exclude, state: "todo", accuracy: null, quality: null, busy: false });
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
  return { lines, discount, total, tender, bulk: lines.reduce((a, l) => a + l.qty, 0) >= 7 };
}

export const TUTORIAL_DRAFT = {
  lines: [
    { lid: "L1", kind: "burger", productId: "classic", exclude: [], qty: 1, unit: 600 },
    { lid: "L2", kind: "fries", productId: "fries", size: "S", exclude: [], qty: 1, unit: 200 },
    { lid: "L3", kind: "drink", productId: "drink", size: "S", flavour: "cola", temp: "sejuk", exclude: [], qty: 1, unit: 150 },
  ],
  discount: null,
  total: 950,
  tender: [1000],
};
