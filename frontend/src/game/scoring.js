import { STAR_BANDS, BURGERS, INGREDIENTS, GRILL, FRYER } from "./config";

const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

export function windowQuality(t, lo, hi, burn) {
  if (t < lo) return clamp(Math.max(30, 100 - (lo - t) * 14));
  if (t <= hi) return 100;
  if (t < burn) return clamp(100 - ((t - hi) / (burn - hi)) * 40);
  return 0;
}

export function grillStatus(slot) {
  if (!slot.flipped) {
    if (slot.sideA >= GRILL.burnA) return { key: "burnt", label: "Hangus" };
    if (slot.sideA >= GRILL.flipWin[0]) return { key: "flip", label: "Terbalikkan sekarang!" };
    return { key: "cooking", label: slot.sideA < 1 ? "Mentah" : "Sedang masak" };
  }
  if (slot.sideB >= GRILL.burnB) return { key: "burnt", label: "Hangus" };
  if (slot.sideB >= GRILL.readyWin[0]) return { key: "ready", label: slot.sideB > GRILL.readyWin[1] ? "Angkat segera!" : "Sedia" };
  return { key: "cooking", label: "Sedang masak (sisi 2)" };
}

export function fryStatus(b) {
  if (b.t >= FRYER.burn) return { key: "burnt", label: "Hangus" };
  if (b.t >= FRYER.win[0]) return { key: "ready", label: b.t > FRYER.win[1] ? "Angkat segera!" : "Sedia" };
  return { key: "cooking", label: b.t < 3 ? "Baru dimasukkan" : "Sedang menggoreng" };
}

export function requiredLayers(unit) {
  return BURGERS[unit.productId].layers.filter((i) => !unit.exclude.includes(i));
}

export function burgerCheck(unit, layers) {
  const need = requiredLayers(unit);
  const have = layers.map((l) => l.ing);
  const count = (arr) => arr.reduce((m, i) => ({ ...m, [i]: (m[i] || 0) + 1 }), {});
  const n = count(need), h = count(have);
  const missing = [], extra = [];
  Object.keys(INGREDIENTS).forEach((i) => {
    const d = (n[i] || 0) - (h[i] || 0);
    if (d > 0) missing.push(...Array(d).fill(i));
    if (d < 0) extra.push(...Array(-d).fill(i));
  });
  const excludedAdded = unit.exclude.filter((i) => h[i]);
  let accuracy = 100 - missing.length * 20 - extra.length * 15;
  if (have[0] !== "bun_bottom" || have[have.length - 1] !== "bun_top") accuracy -= 10;
  return { missing, extra, excludedAdded, accuracy: clamp(accuracy) };
}

export const starsFor = (score) => STAR_BANDS.find(([min]) => score >= min)[1];

export function scoreOrder(order) {
  const units = order.units;
  const accuracy = clamp(units.reduce((a, u) => a + (u.state === "packed" ? u.accuracy : 0), 0) / units.length);
  const packed = units.filter((u) => u.state === "packed");
  const quality = packed.length ? clamp(packed.reduce((a, u) => a + u.quality, 0) / packed.length) : 0;
  const target = 55 + units.length * 18;
  const over = Math.max(0, order.serviceTime - target);
  const speed = clamp(100 - (over / target) * 100);
  const final = clamp(0.55 * accuracy + 0.25 * speed + 0.2 * quality);
  return { accuracy, quality, speed, final, stars: starsFor(final) };
}

export function tipFor(order, stars, tipFactor, reputation) {
  if (stars < 3) return 0;
  const base = order.total * (stars - 2) * 0.04 * tipFactor * (0.85 + reputation / 333);
  const tip = Math.round((order.payment.hintUsed ? base / 2 : base) / 10) * 10;
  return Math.min(tip, 500);
}
