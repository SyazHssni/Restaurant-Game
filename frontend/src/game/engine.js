import { OPENING_FLOAT, INGREDIENTS, BURGERS, FRY_ITEMS, DRINKS, DRINK_COST, TEMPS, SIZE_NAMES, GRILL_SLOTS, STARTING_STOCK, RESTOCK, GRILL, FRYER, GRACE_SECONDS, COMPLAINT_PENALTY, CUSTOMER_TYPES, dayConfig } from "./config";
import { makeRng, pickCustomerType, buildOrderDraft, expandUnits, TUTORIAL_DRAFT, lineName } from "./orders";
import { parseRM, sumDenoms, makeChange, formatRM, lineTotal } from "./money";
import { windowQuality, grillStatus, fryStatus, burgerCheck, scoreOrder, tipFor } from "./scoring";

export const TUTORIAL_STEPS = [
  { station: "counter", title: "Pelanggan pertama", text: "Pak Hamid sedang menunggu di kaunter. Klik kad pelanggan di barisan atas, kemudian tekan butang 'Ambil Pesanan'." },
  { station: "register", title: "Kira jumlah bil", text: "Lihat resit: darab harga seunit dengan kuantiti bagi setiap baris. RM6.00 × 1, RM2.00 × 1 dan RM1.50 × 1. Tambah semua jawapan, taip jumlahnya pada pad nombor dan tekan Sahkan." },
  { station: "register", title: "Kira dan beri baki", text: "Baki = wang yang dibayar − jumlah bil. Pak Hamid bayar RM10.00. Tolak jumlah bil daripada RM10.00, kemudian pilih syiling atau not yang betul dan tekan 'Beri Baki'." },
  { station: "grill", title: "Masak patty", text: "Pergi ke Gril (kekunci 3). Tekan 'Letak Patty Daging' (anda boleh memasak sehingga 4 patty serentak). Bila tertera 'Terbalikkan sekarang!', tekan Terbalikkan. Bila tertera 'Sedia', tekan Angkat." },
  { station: "assembly", title: "Pasang burger", text: "Pergi ke Pemasangan (kekunci 5). Pilih burger, kemudian tambah lapisan ikut senarai semak: roti bawah dahulu dan roti atas terakhir. Tekan 'Siap'." },
  { station: "fryer", title: "Goreng kentang", text: "Pergi ke Penggoreng (kekunci 4). Tekan Goreng pada kentang goreng. Angkat bila tertera 'Sedia' — jangan biar hangus!" },
  { station: "drinks", title: "Sediakan minuman", text: "Pergi ke Minuman (kekunci 6). Baca pesanan: Kola, saiz kecil, sejuk × 1. Pilih jenis minuman, saiz cawan dan suhu yang sama, tekan 'Sediakan', kemudian 'Sahkan Penyediaan'." },
  { station: "packing", title: "Bungkus dan hidang", text: "Pergi ke Pembungkusan (kekunci 7). Masukkan setiap item ke dalam beg, semak senarai, kemudian tekan 'Hantar Pesanan'." },
  { station: null, title: "Hebat! Anda bersedia.", text: "Syif sebenar bermula sekarang mengikut tahap matematik dalam Tetapan. Pelanggan akan datang dan masa akan berjalan. Selamat berniaga!" },
];

const tutorialDone = (s, step) => {
  const o = s.orders[0];
  const unit = (k) => o && o.units.find((u) => u.kind === k);
  const done = (k) => unit(k) && ["ready", "packed"].includes(unit(k).state);
  switch (step) {
    case 0: return !!o;
    case 1: return o && o.payment.stage !== "bill";
    case 2: return o && o.status !== "awaiting_payment";
    case 3: return s.pattyTray.length > 0 || done("burger") || (s.assembly && s.assembly.layers.some((l) => l.q != null));
    case 4: return done("burger");
    case 5: return done("fries");
    case 6: return done("drink");
    case 7: return o && o.status === "served";
    default: return false;
  }
};

const newStats = () => ({ billOrders: 0, billFirstTry: 0, billWrong: 0, changeTotal: 0, changeCorrect: 0, changeWrong: 0, streak: 0, bestStreak: 0, hints: 0, served: 0, left: 0, starsSum: 0, foodAccSum: 0 });

function spawnCustomer(s, type, extra = {}) {
  const max = Math.round(55 * type.patience * s.cfg.patienceMod);
  s.queue.push({ id: `C${s.idSeq++}`, typeId: type.id, name: type.name, role: type.role, look: type.look, greet: type.greet, tip: type.tip, patience: max, maxPatience: max, ...extra });
  s.spawned += 1;
  s.recentTypes = [type.id, ...s.recentTypes].slice(0, 4);
  sfx(s, "bell");
}

export function createShift(save, settings, withTutorial) {
  const cfg = dayConfig(save.day, settings);
  const s = {
    day: save.day, cfg, mode: settings.mathMode, clock: 0, timeLeft: cfg.shiftLength, grace: false, graceLeft: GRACE_SECONDS,
    ended: false, paused: false, tutorial: withTutorial ? { step: 0 } : null,
    nextSpawnAt: withTutorial ? Infinity : 2, spawned: 0, queue: [], orders: [], orderSeq: 101, idSeq: 1,
    seed: Number(new URLSearchParams(window.location.search).get("seed")) || Date.now() % 2147483647,
    drawer: { ...OPENING_FLOAT }, grill: Array(GRILL_SLOTS).fill(null), fryer: [null, null], pattyTray: [], assembly: null, drinkTray: null,
    stock: { ...STARTING_STOCK }, deliveries: [],
    ledger: { sales: 0, ingredients: 0, tips: 0, refunds: 0, shortages: 0, penalties: 0, bonus: 0, underReturned: 0 },
    stats: newStats(), startFunds: save.funds, startRep: save.reputation, reputation: save.reputation,
    station: "counter", selectedCustomerId: null, selectedOrderId: null, recentTypes: [], fx: [], sfx: [], fxSeq: 1,
    workedExample: null, packWarn: null, lastPayment: null, drinkFeedback: null,
  };
  if (withTutorial) {
    const type = CUSTOMER_TYPES[0];
    spawnCustomer(s, type, { tutorial: true });
    s.selectedCustomerId = s.queue[0].id;
  }
  return s;
}

function rng(s) {
  const r = makeRng(s.seed);
  const v = r();
  s.seed = Math.floor(r() * 2147483646) + 1;
  return v;
}
const rngFn = (s) => () => rng(s);

function fx(s, text, tone = "info") {
  s.fx.push({ id: s.fxSeq++, text, tone, at: s.clock });
  s.fx = s.fx.slice(-4);
}
function sfx(s, name) {
  s.sfx.push({ id: s.fxSeq++, name, at: s.clock });
}
const rep = (s, d) => { s.reputation = Math.max(0, Math.min(100, s.reputation + d)); };
const cost = (s, o, amt) => { s.ledger.ingredients += amt; o.ingredientCost += amt; };
const getOrder = (s, id) => s.orders.find((o) => o.id === id);
const activeOrders = (s) => s.orders.filter((o) => o.status === "awaiting_payment" || o.status === "paid");

export const shiftNet = (l) => l.sales + l.tips + l.bonus - l.ingredients - l.refunds - l.shortages - l.penalties;
export const mathScore = (st) => {
  const den = st.billOrders + st.billWrong + st.changeTotal;
  return den ? Math.round((100 * (st.billOrders + st.changeCorrect)) / den) : null;
};
export const businessAtRisk = (s) => s.stats.changeWrong >= 3 || s.reputation < 30 || s.startFunds + shiftNet(s.ledger) < 5000;

// Ingredients a burger needs that the current stock cannot cover.
export function missingStock(s, burgerId) {
  const need = {};
  BURGERS[burgerId].layers.forEach((i) => { need[i] = (need[i] || 0) + 1; });
  return Object.keys(need).filter((i) => {
    const spare = INGREDIENTS[i].patty ? s.pattyTray.filter((p) => p.type === INGREDIENTS[i].patty).length : 0;
    return s.stock[i] + spare < need[i];
  });
}

export function pattiesNeeded(s, o, type) {
  const need = o.units.filter((u) => u.kind === "burger" && u.state === "todo" && BURGERS[u.productId].patty === type)
    .reduce((a, u) => a + BURGERS[u.productId].pattyCount, 0);
  const inAsm = s.assembly && s.assembly.orderId === o.id ? s.assembly.layers.filter((l) => l.ing === `patty_${type}`).length : 0;
  const held = s.pattyTray.filter((p) => p.orderId === o.id && p.type === type).length;
  const onGrill = s.grill.filter((g) => g && g.orderId === o.id && g.type === type && grillStatus(g).key !== "burnt").length;
  return need - inAsm - held - onGrill;
}

function cleanupOrder(s, o) {
  s.grill.forEach((g) => { if (g && g.orderId === o.id) { g.orderId = null; g.orderNum = null; } });
  s.fryer = s.fryer.map((b) => (b && b.orderId === o.id ? null : b));
  s.pattyTray.forEach((p) => { if (p.orderId === o.id) { p.orderId = null; p.orderNum = null; } });
  if (s.assembly && s.assembly.orderId === o.id) s.assembly = null;
  if (s.drinkTray && s.drinkTray.orderId === o.id) s.drinkTray = null;
  if (s.packWarn === o.id) s.packWarn = null;
}

function customerLeaves(s, o, reason) {
  if (o.status === "paid") {
    s.ledger.refunds += o.total;
    o.refund = o.total;
    rep(s, -4);
  } else rep(s, -2);
  o.status = "left";
  s.stats.left += 1;
  cleanupOrder(s, o);
  fx(s, `${o.customer.name} ${reason}`, "bad");
  sfx(s, "sad");
}

function endShift(s) {
  s.queue = [];
  s.orders.forEach((o) => {
    if (o.status === "awaiting_payment") { o.status = "left"; s.stats.left += 1; }
    if (o.status === "paid") { s.ledger.refunds += o.total; o.refund = o.total; o.status = "left"; s.stats.left += 1; rep(s, -3); }
  });
  if (s.stats.bestStreak >= 3) s.ledger.bonus = Math.min(300, s.stats.bestStreak * 20);
  if (shiftNet(s.ledger) >= s.cfg.target) rep(s, 2);
  s.ended = true;
  s.paused = false;
  sfx(s, "end");
}

function tick(s, dt) {
  s.clock += dt;
  s.grill.forEach((g) => { if (g) { if (g.flipped) g.sideB += dt; else g.sideA += dt; } });
  s.fryer.forEach((b) => { if (b) b.t += dt; });
  s.deliveries.filter((d) => d.at <= s.clock).forEach((d) => {
    s.stock[d.ing] += d.qty;
    fx(s, `Stok ${INGREDIENTS[d.ing].name} dikemas kini (+${d.qty}).`, "good");
  });
  s.deliveries = s.deliveries.filter((d) => d.at > s.clock);
  if (!s.tutorial) {
    if (!s.grace) {
      s.timeLeft -= dt;
      if (s.timeLeft <= 0) {
        s.timeLeft = 0;
        s.grace = true;
        fx(s, "Kedai ditutup! 30 saat lagi untuk siapkan pesanan yang sudah diambil.", "warn");
        s.queue.forEach(() => { s.stats.left += 1; });
        s.queue = [];
      }
    } else {
      s.graceLeft -= dt;
      if (s.graceLeft <= 0) { s.graceLeft = 0; endShift(s); return; }
    }
    if (!s.grace && s.spawned < s.cfg.customers && s.clock >= s.nextSpawnAt) {
      if (s.queue.length < s.cfg.maxQueue) {
        spawnCustomer(s, pickCustomerType(rngFn(s), s.recentTypes));
        const [a, b] = s.cfg.interval;
        s.nextSpawnAt = s.clock + (a + rng(s) * (b - a)) * (1.15 - s.reputation / 333);
      } else s.nextSpawnAt = s.clock + 2;
    }
    s.queue.forEach((c) => { c.patience -= dt; });
    const gone = s.queue.filter((c) => c.patience <= 0);
    gone.forEach((c) => { s.stats.left += 1; rep(s, -2); fx(s, `${c.name} penat menunggu dan beredar.`, "bad"); sfx(s, "sad"); });
    s.queue = s.queue.filter((c) => c.patience > 0);
    activeOrders(s).forEach((o) => {
      o.patience -= dt;
      if (o.patience <= 0) customerLeaves(s, o, "tidak dapat menunggu lagi dan beredar.");
    });
    if (s.spawned >= s.cfg.customers && !s.queue.length && !activeOrders(s).length && s.orders.length) endShift(s);
  }
  s.fx = s.fx.filter((f) => s.clock - f.at < 5);
  s.sfx = s.sfx.filter((f) => s.clock - f.at < 1);
}

function advanceTutorial(s) {
  if (!s.tutorial) return;
  while (s.tutorial.step < TUTORIAL_STEPS.length - 1 && tutorialDone(s, s.tutorial.step)) {
    s.tutorial.step += 1;
    sfx(s, "ok");
  }
}

function takeOrder(s, customerId) {
  const c = s.queue.find((x) => x.id === customerId);
  if (!c) return;
  if (activeOrders(s).length >= s.cfg.maxActive) { fx(s, "Rel tiket penuh. Siapkan pesanan lain dahulu.", "warn"); return; }
  const type = CUSTOMER_TYPES.find((t) => t.id === c.typeId);
  const cfg = { ...s.cfg, menu: { ...s.cfg.menu, burgers: s.cfg.menu.burgers.filter((id) => !missingStock(s, id).length) } };
  const draft = c.tutorial ? TUTORIAL_DRAFT : buildOrderDraft(rngFn(s), cfg, s.mode, type, s.drawer);
  const units = expandUnits(draft.lines);
  const max = Math.round((75 + units.length * 20) * type.patience * s.cfg.patienceMod);
  const o = {
    id: `O${s.idSeq++}`, num: s.orderSeq++, customer: { id: c.id, name: c.name, role: c.role, look: c.look, tip: c.tip },
    lines: draft.lines, discount: draft.discount, total: draft.total, tender: draft.tender, tenderSum: sumDenoms(draft.tender),
    units, status: "awaiting_payment", patience: max, maxPatience: max, acceptedAt: s.clock, angry: false, ingredientCost: 0, mistakes: [],
    payment: { stage: "bill", input: "", wrong: 0, hint: 0, hintUsed: false, tray: [], recount: null, result: null },
  };
  s.orders.push(o);
  s.queue = s.queue.filter((x) => x.id !== c.id);
  s.selectedOrderId = o.id;
  s.selectedCustomerId = null;
  s.station = "register";
  sfx(s, "ding");
}

function register(s, a) {
  const o = getOrder(s, a.orderId);
  if (!o || o.status !== "awaiting_payment") return;
  const p = o.payment;
  if (a.type === "REG_KEY" && p.stage === "bill") {
    if (a.key === "back") p.input = p.input.slice(0, -1);
    else if (a.key === "clear") p.input = "";
    else if (a.key === "." && p.input.includes(".")) return;
    else if (p.input.length < 7) p.input = (p.input === "" && a.key === "." ? "0" : p.input) + a.key;
    return;
  }
  if (a.type === "REG_SUBMIT" && p.stage === "bill") {
    const v = parseRM(p.input);
    if (v === null) { fx(s, "Taip jumlah dalam bentuk seperti 10.20", "warn"); return; }
    if (v === o.total) {
      p.stage = "change";
      s.stats.billOrders += 1;
      if (p.wrong === 0) s.stats.billFirstTry += 1;
      p.billMsg = { ok: true, text: `Betul! Jumlah bil ${formatRM(o.total)}.` };
      sfx(s, "ok");
    } else {
      p.wrong += 1;
      s.stats.billWrong += 1;
      o.patience -= Math.round(o.maxPatience * 0.12);
      o.mistakes.push(`Jumlah bil salah: ${p.input}`);
      p.billMsg = { ok: false, text: p.wrong >= 3 ? "Belum tepat. Cuba tekan 'Petunjuk' untuk melihat jumlah setiap baris." : "Belum tepat — semak harga seunit dan kuantiti, kemudian cuba lagi." };
      p.input = "";
      sfx(s, "err");
    }
    return;
  }
  if (a.type === "REG_HINT") {
    const maxHint = p.stage === "bill" ? 2 : 3;
    if (p.hint >= maxHint) return;
    p.hint = p.stage === "bill" ? p.hint + 1 : 3;
    if (!p.hintUsed) s.stats.hints += 1;
    p.hintUsed = true;
    return;
  }
  if (p.stage !== "change") return;
  const inTray = (d) => p.tray.filter((x) => x === d).length;
  if (a.type === "REG_ADD") {
    if ((s.drawer[a.denom] || 0) - inTray(a.denom) <= 0) { fx(s, "Laci sudah kehabisan nilai ini. Cuba gabungan lain.", "warn"); return; }
    if (p.tray.length >= 40) return;
    p.tray.push(a.denom); p.recount = null; sfx(s, "coin");
  } else if (a.type === "REG_UNDO") { p.tray.pop(); p.recount = null; }
  else if (a.type === "REG_CLEAR") { p.tray = []; p.recount = null; }
  else if (a.type === "REG_RECOUNT") p.recount = sumDenoms(p.tray);
  else if (a.type === "REG_GIVE") commitPayment(s, o);
}

function commitPayment(s, o) {
  const p = o.payment;
  const given = sumDenoms(p.tray);
  const due = o.tenderSum - o.total;
  o.tender.forEach((d) => { s.drawer[d] = (s.drawer[d] || 0) + 1; });
  p.tray.forEach((d) => { s.drawer[d] -= 1; });
  s.ledger.sales += o.total;
  s.stats.changeTotal += 1;
  const diff = given - due;
  if (diff === 0) {
    s.stats.changeCorrect += 1;
    s.stats.streak += 1;
    s.stats.bestStreak = Math.max(s.stats.bestStreak, s.stats.streak);
    p.result = { ok: true, text: `Baki tepat ${formatRM(due)}! Rentetan baki betul: ${s.stats.streak}.` };
    if (!s.workedExample) s.workedExample = { lines: o.lines.map((l) => ({ name: lineName(l), qty: l.qty, unit: l.unit, total: lineTotal(l.unit, l.qty) })), discount: o.discount, total: o.total, tender: o.tenderSum, change: due };
    sfx(s, "cash");
  } else {
    s.stats.changeWrong += 1;
    s.stats.streak = 0;
    o.angry = true;
    if (diff > 0) {
      s.ledger.shortages += diff;
      rep(s, -2);
      p.result = { ok: false, text: `Baki terlebih ${formatRM(diff)}. Ini dicatat sebagai kekurangan tunai kedai. Baki sepatutnya ${formatRM(due)}.` };
      o.mistakes.push(`Baki terlebih ${formatRM(diff)}`);
    } else {
      const back = makeChange(-diff, s.drawer);
      if (back) back.forEach((d) => { s.drawer[d] -= 1; });
      s.ledger.underReturned += -diff;
      s.ledger.penalties += COMPLAINT_PENALTY;
      o.patience -= Math.round(o.maxPatience * 0.15);
      rep(s, -4);
      p.result = { ok: false, text: `Baki kurang ${formatRM(-diff)}. Pelanggan mengadu: perbezaan dipulangkan dan penalti aduan ${formatRM(COMPLAINT_PENALTY)} dikenakan. Baki sepatutnya ${formatRM(due)}.` };
      o.mistakes.push(`Baki kurang ${formatRM(-diff)}`);
    }
    sfx(s, "err");
  }
  p.stage = "done";
  s.lastPayment = { orderNum: o.num, ...p.result };
  o.status = "paid";
  fx(s, p.result.ok ? `Pesanan #${o.num} dibayar. Mulakan memasak!` : `Pesanan #${o.num}: semak semula kiraan baki untuk pelanggan seterusnya.`, p.result.ok ? "good" : "bad");
}

function putPatty(s, o, type) {
  const i = s.grill.findIndex((g) => !g);
  if (i < 0) { fx(s, "Semua slot gril sedang digunakan.", "warn"); return false; }
  const ing = `patty_${type}`;
  if (s.stock[ing] <= 0) { fx(s, `Stok ${INGREDIENTS[ing].name} habis. Pesan stok di Buku Menu.`, "warn"); return false; }
  s.stock[ing] -= 1;
  s.grill[i] = { id: `G${s.idSeq++}`, orderId: o ? o.id : null, orderNum: o ? o.num : null, type, sideA: 0, sideB: 0, flipped: false, flipQ: null };
  if (o) cost(s, o, INGREDIENTS[ing].cost);
  else s.ledger.ingredients += INGREDIENTS[ing].cost;
  sfx(s, "sizzle");
  return true;
}

function grill(s, a) {
  if (a.type === "GRILL_ADD" || a.type === "GRILL_ADD_ALL") {
    if (!a.orderId) { putPatty(s, null, a.patty); return; }
    const o = getOrder(s, a.orderId);
    if (!o || o.status !== "paid") return;
    if (pattiesNeeded(s, o, a.patty) <= 0) { fx(s, "Tiket ini sudah cukup patty.", "warn"); return; }
    if (a.type === "GRILL_ADD") putPatty(s, o, a.patty);
    else while (pattiesNeeded(s, o, a.patty) > 0 && putPatty(s, o, a.patty));
    return;
  }
  const g = s.grill[a.index];
  if (!g) return;
  const st = grillStatus(g);
  if (a.type === "GRILL_FLIP" && !g.flipped && st.key !== "burnt") {
    g.flipQ = windowQuality(g.sideA, ...GRILL.flipWin, GRILL.burnA);
    g.flipped = true;
    sfx(s, "flip");
  } else if (a.type === "GRILL_REMOVE" && g.flipped && st.key !== "burnt") {
    if (g.sideB < 2.5) { fx(s, "Patty masih mentah. Tunggu sehingga 'Sedia'.", "warn"); return; }
    const q = Math.round((g.flipQ + windowQuality(g.sideB, ...GRILL.readyWin, GRILL.burnB)) / 2);
    s.pattyTray.push({ id: g.id, orderId: g.orderId, orderNum: g.orderNum, type: g.type, quality: q });
    s.grill[a.index] = null;
    fx(s, g.orderNum ? `Patty untuk #${g.orderNum} siap (kualiti ${q}). Bawa ke Pemasangan.` : `Patty simpanan siap (kualiti ${q}).`, "good");
    sfx(s, "pop");
  } else if (a.type === "GRILL_DISCARD") {
    s.grill[a.index] = null;
    fx(s, "Patty dibuang. Kos bahan tetap dikira — masak semula.", "warn");
  }
}

function fryer(s, a) {
  if (a.type === "FRY_START") {
    const o = getOrder(s, a.orderId);
    const u = o && o.status === "paid" && o.units.find((x) => x.uid === a.uid);
    if (!u || u.state !== "todo" || u.busy) return;
    const i = s.fryer.findIndex((b) => !b);
    if (i < 0) { fx(s, "Kedua-dua bakul penggoreng sedang digunakan.", "warn"); return; }
    s.fryer[i] = { id: `F${s.idSeq++}`, orderId: o.id, orderNum: o.num, uid: u.uid, kind: u.kind, size: u.size, t: 0 };
    u.busy = true;
    cost(s, o, FRY_ITEMS[u.kind].cost[u.size]);
    sfx(s, "sizzle");
    return;
  }
  const b = s.fryer[a.index];
  if (!b) return;
  const o = getOrder(s, b.orderId);
  const u = o.units.find((x) => x.uid === b.uid);
  const st = fryStatus(b);
  s.fryer[a.index] = null;
  u.busy = false;
  if (st.key === "burnt" || a.type === "FRY_DISCARD") { fx(s, "Bakul dibuang. Goreng semula untuk tiket ini.", "warn"); return; }
  u.quality = windowQuality(b.t, ...FRYER.win, FRYER.burn);
  u.accuracy = 100;
  u.state = "ready";
  fx(s, b.t < FRYER.win[0] ? `Diangkat awal — kurang masak (kualiti ${u.quality}).` : `Siap untuk #${b.orderNum} (kualiti ${u.quality}).`, b.t < FRYER.win[0] ? "warn" : "good");
  sfx(s, "pop");
}

function assembly(s, a) {
  if (a.type === "ASM_START") {
    if (s.assembly) return;
    const o = getOrder(s, a.orderId);
    const u = o && o.status === "paid" && o.units.find((x) => x.uid === a.uid);
    if (!u || u.state !== "todo" || u.busy) return;
    u.busy = true;
    s.assembly = { orderId: o.id, orderNum: o.num, uid: u.uid, layers: [] };
    return;
  }
  const asm = s.assembly;
  if (!asm) return;
  const o = getOrder(s, asm.orderId);
  const u = o.units.find((x) => x.uid === asm.uid);
  const returnPatties = () => asm.layers.forEach((l) => {
    if (l.q == null) s.stock[l.ing] += 1;
    else s.pattyTray.push({ id: `P${s.idSeq++}`, orderId: o.id, orderNum: o.num, type: INGREDIENTS[l.ing].patty, quality: l.q });
  });
  if (a.type === "ASM_ADD") {
    if (asm.layers.length >= 12) return;
    const pt = INGREDIENTS[a.ing].patty;
    if (pt) {
      let i = s.pattyTray.findIndex((p) => p.orderId === o.id && p.type === pt);
      if (i < 0) i = s.pattyTray.findIndex((p) => p.orderId === null && p.type === pt);
      if (i < 0) { fx(s, `Tiada ${INGREDIENTS[a.ing].name.toLowerCase()} yang dimasak untuk #${o.num}. Masak di Gril dahulu.`, "warn"); return; }
      asm.layers.push({ ing: a.ing, q: s.pattyTray[i].quality });
      s.pattyTray.splice(i, 1);
    } else {
      if (s.stock[a.ing] <= 0) { fx(s, `Stok ${INGREDIENTS[a.ing].name} habis. Pesan stok di Buku Menu.`, "warn"); return; }
      s.stock[a.ing] -= 1;
      asm.layers.push({ ing: a.ing });
    }
    sfx(s, "tap");
  } else if (a.type === "ASM_UNDO") {
    const l = asm.layers.pop();
    if (l && l.q == null) s.stock[l.ing] += 1;
    if (l && l.q != null) s.pattyTray.push({ id: `P${s.idSeq++}`, orderId: o.id, orderNum: o.num, type: INGREDIENTS[l.ing].patty, quality: l.q });
  } else if (a.type === "ASM_RESET") {
    returnPatties();
    asm.layers = [];
    o.patience -= 5;
    fx(s, "Bina semula burger: −5 saat kesabaran pelanggan.", "warn");
  } else if (a.type === "ASM_CANCEL") {
    returnPatties();
    u.busy = false;
    s.assembly = null;
  } else if (a.type === "ASM_FINISH") {
    if (asm.layers.length < 2) return;
    const chk = burgerCheck(u, asm.layers);
    asm.layers.filter((l) => l.q == null).forEach((l) => cost(s, o, INGREDIENTS[l.ing].cost));
    const pq = asm.layers.filter((l) => l.q != null).map((l) => l.q);
    u.accuracy = chk.accuracy;
    u.quality = pq.length ? Math.round(pq.reduce((x, y) => x + y, 0) / pq.length) : 40;
    u.state = "ready";
    u.busy = false;
    u.check = chk;
    s.assembly = null;
    const issues = [...chk.missing.map((i) => `kurang ${INGREDIENTS[i].name}`), ...chk.extra.map((i) => `lebih ${INGREDIENTS[i].name}`)];
    fx(s, issues.length ? `Burger siap dengan isu: ${issues.join(", ")}.` : `Burger sempurna untuk #${o.num}!`, issues.length ? "warn" : "good");
    sfx(s, "pop");
  }
}

export const drinkLabel = (c) => `${DRINKS[c.flavour].name}, saiz ${SIZE_NAMES[c.size].toLowerCase()}, ${TEMPS[c.temp].toLowerCase()}`;

function confirmDrinks(s) {
  const t = s.drinkTray;
  const o = getOrder(s, t.orderId);
  const todo = o.units.filter((u) => u.kind === "drink" && u.state === "todo");
  const wrong = [];
  t.cups.forEach((c) => {
    const i = todo.findIndex((u) => u.flavour === c.flavour && u.size === c.size && u.temp === c.temp);
    if (i >= 0) {
      Object.assign(todo[i], { state: "ready", accuracy: 100, quality: 100, busy: false });
      todo.splice(i, 1);
    } else wrong.push(c);
  });
  const issues = {};
  wrong.forEach((c) => {
    if (!todo.length) { (issues._extra = issues._extra || []).push(`${drinkLabel(c)} tidak dipesan — dibuang.`); return; }
    const score = (u) => (u.flavour === c.flavour) * 2 + (u.size === c.size) + (u.temp === c.temp);
    const u = todo.reduce((x, y) => (score(y) > score(x) ? y : x));
    const errs = [];
    if (u.flavour !== c.flavour) errs.push(`jenis ${DRINKS[c.flavour].name} (sepatutnya ${DRINKS[u.flavour].name})`);
    if (u.size !== c.size) errs.push(`saiz ${SIZE_NAMES[c.size]} (sepatutnya ${SIZE_NAMES[u.size]})`);
    if (u.temp !== c.temp) errs.push(`suhu ${TEMPS[c.temp]} (sepatutnya ${TEMPS[u.temp]})`);
    (issues[u.lid] = issues[u.lid] || []).push(`Salah ${errs.join(", ")}.`);
  });
  o.drinkIssues = {};
  const msgs = [];
  o.lines.filter((l) => l.kind === "drink").forEach((l) => {
    const units = o.units.filter((u) => u.lid === l.lid);
    const done = units.filter((u) => u.state !== "todo").length;
    if (issues[l.lid]) { o.drinkIssues[l.lid] = issues[l.lid]; msgs.push(`${drinkLabel(l)}: ${issues[l.lid].join(" ")} Perlu dibetulkan (${done}/${l.qty}).`); }
    else if (done < l.qty) msgs.push(`${drinkLabel(l)}: belum lengkap — ${done}/${l.qty} disediakan.`);
  });
  if (issues._extra) msgs.push(...issues._extra);
  const ok = o.units.filter((u) => u.kind === "drink").every((u) => u.state !== "todo") && !wrong.length;
  s.drinkFeedback = { orderId: o.id, ok, msgs: ok ? ["Semua minuman sepadan dengan pesanan. Siap!"] : msgs };
  s.drinkTray = null;
  fx(s, ok ? `Minuman #${o.num} siap dan betul!` : `Minuman #${o.num}: semak status penyediaan.`, ok ? "good" : "warn");
  sfx(s, ok ? "ok" : "err");
}

function drinks(s, a) {
  const t = s.drinkTray;
  if (a.type === "DRINK_PREPARE") {
    const o = getOrder(s, a.orderId);
    if (!o || o.status !== "paid" || !o.units.some((u) => u.kind === "drink" && u.state === "todo")) return;
    if (!a.flavour || !a.size || !a.temp) { fx(s, "Pilih jenis minuman, saiz cawan dan suhu dahulu.", "warn"); return; }
    if (!DRINKS[a.flavour].temps.includes(a.temp)) { fx(s, `${DRINKS[a.flavour].name} tidak boleh disediakan ${TEMPS[a.temp].toLowerCase()}.`, "warn"); return; }
    if (t && t.orderId !== o.id && t.cups.length) { fx(s, `Sahkan atau kosongkan dulang minuman #${t.orderNum} dahulu.`, "warn"); return; }
    const tray = t && t.orderId === o.id ? t : { orderId: o.id, orderNum: o.num, cups: [] };
    const qty = Math.max(1, Math.min(a.qty || 1, 8 - tray.cups.length));
    if (tray.cups.length >= 8) { fx(s, "Dulang minuman penuh (8 cawan).", "warn"); return; }
    for (let k = 0; k < qty; k++) {
      tray.cups.push({ id: `D${s.idSeq++}`, flavour: a.flavour, size: a.size, temp: a.temp });
      cost(s, o, DRINK_COST[a.size]);
    }
    s.drinkTray = tray;
    if (s.drinkFeedback && s.drinkFeedback.orderId === o.id) s.drinkFeedback = null;
    sfx(s, "pour");
  } else if (a.type === "DRINK_REMOVE_CUP" && t) {
    t.cups = t.cups.filter((c) => c.id !== a.id);
    if (!t.cups.length) s.drinkTray = null;
  } else if (a.type === "DRINK_CLEAR") s.drinkTray = null;
  else if (a.type === "DRINK_CONFIRM" && t && t.cups.length) confirmDrinks(s);
}

function restock(s, ing) {
  if (!INGREDIENTS[ing] || s.deliveries.some((d) => d.ing === ing)) return;
  s.deliveries.push({ ing, qty: RESTOCK.qty, at: s.clock + RESTOCK.seconds });
  fx(s, `Stok ${INGREDIENTS[ing].name} sedang dihantar (${RESTOCK.seconds} saat).`, "info");
}

function deliver(s, orderId, force) {
  const o = getOrder(s, orderId);
  if (!o || o.status !== "paid") return;
  const missing = o.units.filter((u) => u.state !== "packed");
  if (missing.length && !force) { s.packWarn = o.id; return; }
  s.packWarn = null;
  o.serviceTime = s.clock - o.acceptedAt;
  const sc = scoreOrder(o);
  const tip = o.angry ? 0 : tipFor(o, sc.stars, o.customer.tip, s.reputation);
  s.ledger.tips += tip;
  let refund = 0;
  if (sc.accuracy < 40) {
    refund = Math.round(o.total / 20) * 10;
    s.ledger.refunds += refund;
    o.refund = refund;
    rep(s, -4);
  } else if (sc.stars >= 4) rep(s, 2);
  else if (sc.stars <= 2) rep(s, -2);
  o.result = { ...sc, tip, refund };
  o.status = "served";
  s.stats.served += 1;
  s.stats.starsSum += sc.stars;
  s.stats.foodAccSum += sc.accuracy;
  cleanupOrder(s, o);
  if (s.selectedOrderId === o.id) s.selectedOrderId = null;
  fx(s, `#${o.num} dihidang: ${"★".repeat(sc.stars)} · Ketepatan makanan ${sc.accuracy} · Tip +${formatRM(tip)}${refund ? ` · Bayaran balik −${formatRM(refund)}` : ""}`, sc.stars >= 3 ? "good" : "warn");
  sfx(s, "star");
}

export function reducer(state, a) {
  if (a.type === "RESET") return a.state;
  if (state.ended && a.type !== "TICK") return state;
  if (a.type === "TICK" && (state.paused || state.ended)) return state;
  const s = structuredClone(state);
  switch (a.type) {
    case "TICK": tick(s, a.dt); break;
    case "PAUSE": s.paused = true; break;
    case "OPEN_MENU": s.menuOpen = true; s.paused = true; s.menuPaused = true; break;
    case "CLOSE_MENU": s.menuOpen = false; s.paused = false; s.menuPaused = false; break;
    case "RESUME": s.paused = false; break;
    case "SET_STATION": s.station = a.station; break;
    case "SELECT_ORDER": s.selectedOrderId = a.orderId; break;
    case "SELECT_CUSTOMER": s.selectedCustomerId = a.customerId; s.station = "counter"; break;
    case "TAKE_ORDER": takeOrder(s, a.customerId); break;
    case "CLOSE_PACK_WARN": s.packWarn = null; break;
    case "RESTOCK": restock(s, a.ing); break;
    case "PACK_ADD": case "PACK_REMOVE": {
      const o = getOrder(s, a.orderId);
      const u = o && o.status === "paid" && o.units.find((x) => x.uid === a.uid);
      if (u && a.type === "PACK_ADD" && u.state === "ready") { u.state = "packed"; sfx(s, "tap"); }
      if (u && a.type === "PACK_REMOVE" && u.state === "packed") u.state = "ready";
      break;
    }
    case "DELIVER": deliver(s, a.orderId, a.force); break;
    case "TUTORIAL_FINISH":
      s.tutorial = null;
      s.nextSpawnAt = s.clock + 3;
      s.timeLeft = s.cfg.shiftLength;
      s.orders.forEach((o) => { o.patience = o.maxPatience; });
      s.queue.forEach((c) => { c.patience = c.maxPatience; });
      break;
    default:
      if (a.type.startsWith("REG_")) register(s, a);
      else if (a.type.startsWith("GRILL_")) grill(s, a);
      else if (a.type.startsWith("FRY_")) fryer(s, a);
      else if (a.type.startsWith("ASM_")) assembly(s, a);
      else if (a.type.startsWith("DRINK_")) drinks(s, a);
  }
  advanceTutorial(s);
  return s;
}
