import { DENOMS } from "./config";

export const formatRM = (sen) => `${sen < 0 ? "−" : ""}RM${(Math.abs(sen) / 100).toFixed(2)}`;
export const lineTotal = (unitSen, qty) => unitSen * qty;
export const orderSubtotal = (lines) => lines.reduce((a, l) => a + lineTotal(l.unit, l.qty), 0);
export const orderTotal = (lines, discountSen = 0) => orderSubtotal(lines) - discountSen;
export const calcChange = (tenderSen, totalSen) => tenderSen - totalSen;
export const sumDenoms = (arr) => arr.reduce((a, b) => a + b, 0);

export function parseRM(str) {
  if (!/^\d{1,4}(\.\d{0,2})?$/.test(str)) return null;
  const [r, s = ""] = str.split(".");
  return parseInt(r, 10) * 100 + parseInt((s + "00").slice(0, 2), 10);
}

// Greedy with stock limits; a returned combination is always valid.
export function makeChange(amount, drawer) {
  const out = [];
  let left = amount;
  for (const d of DENOMS) {
    let n = Math.min(Math.floor(left / d), drawer[d] || 0);
    while (n-- > 0) { out.push(d); left -= d; }
  }
  return left === 0 ? out : null;
}

export const countBy = (arr) => arr.reduce((m, d) => ({ ...m, [d]: (m[d] || 0) + 1 }), {});
