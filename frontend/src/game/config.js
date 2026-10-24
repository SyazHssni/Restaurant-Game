// All money values are integer sen.
export const DENOMS = [10000, 5000, 2000, 1000, 500, 100, 50, 20, 10];
export const DENOM_INFO = {
  10000: { label: "RM100", type: "note", color: "#8a5bb0" },
  5000: { label: "RM50", type: "note", color: "#2f9c8f" },
  2000: { label: "RM20", type: "note", color: "#e3843a" },
  1000: { label: "RM10", type: "note", color: "#d9483b" },
  500: { label: "RM5", type: "note", color: "#4f9a4a" },
  100: { label: "RM1", type: "note", color: "#3d74c4" },
  50: { label: "50 sen", type: "coin", color: "#d8b24a" },
  20: { label: "20 sen", type: "coin", color: "#c8ccd2" },
  10: { label: "10 sen", type: "coin", color: "#b9bec6" },
};
export const OPENING_FLOAT = { 10000: 1, 5000: 1, 2000: 1, 1000: 3, 500: 4, 100: 20, 50: 40, 20: 50, 10: 100 };

export const START_FUNDS = 30000;
export const START_REPUTATION = 50;
export const OPERATING_COST = 2500;
export const COMPLAINT_PENALTY = 200;
export const GRACE_SECONDS = 30;
export const SHIFT_SECONDS = 240;

export const INGREDIENTS = {
  bun_bottom: { name: "Roti Bawah", cost: 20, color: "#e0a457" },
  sauce_house: { name: "Sos Istimewa", cost: 10, color: "#f08a3c" },
  patty_beef: { name: "Patty Daging", cost: 120, color: "#7a4a2e", patty: "beef" },
  patty_veg: { name: "Patty Sayur", cost: 110, color: "#8a9a3a", patty: "veg" },
  cheese: { name: "Keju", cost: 30, color: "#f6c636" },
  lettuce: { name: "Salad", cost: 10, color: "#6cbf4a" },
  tomato: { name: "Tomato", cost: 10, color: "#e5462e" },
  pickle: { name: "Jeruk", cost: 10, color: "#7d9b3c" },
  bun_top: { name: "Roti Atas", cost: 20, color: "#e8ad5f" },
};
export const ASSEMBLY_ORDER = ["bun_bottom", "sauce_house", "patty_beef", "patty_veg", "cheese", "lettuce", "tomato", "pickle", "bun_top"];
export const REMOVABLE = ["lettuce", "tomato", "pickle", "sauce_house"];

export const BURGERS = {
  classic: { name: "Classic Stack", price: 600, patty: "beef", pattyCount: 1, layers: ["bun_bottom", "sauce_house", "patty_beef", "lettuce", "tomato", "bun_top"] },
  cheese: { name: "Cheese Stack", price: 670, patty: "beef", pattyCount: 1, layers: ["bun_bottom", "sauce_house", "patty_beef", "cheese", "lettuce", "tomato", "bun_top"] },
  double: { name: "Double Stack", price: 850, patty: "beef", pattyCount: 2, layers: ["bun_bottom", "sauce_house", "patty_beef", "cheese", "patty_beef", "lettuce", "bun_top"] },
  garden: { name: "Garden Stack", price: 650, patty: "veg", pattyCount: 1, layers: ["bun_bottom", "sauce_house", "patty_veg", "lettuce", "tomato", "pickle", "bun_top"] },
};
export const FRY_ITEMS = {
  fries: { name: "Kentang Goreng", sizes: { S: 200, M: 270, L: 350 }, cost: { S: 50, M: 70, L: 90 } },
  bites: { name: "Kepingan Ayam", sizes: { 4: 350, 6: 470 }, cost: { 4: 110, 6: 150 } },
};
export const DRINKS = {
  cola: { name: "Kola", color: "#5a2d1c" },
  lemon: { name: "Soda Lemon-Limau", color: "#c9e36b" },
  orange: { name: "Soda Oren", color: "#f39a2b" },
  water: { name: "Air Mineral", color: "#bfe3f2" },
};
export const DRINK_PRICES = { S: 150, M: 200, L: 250 };
export const DRINK_COST = { S: 30, M: 40, L: 50 };
export const SIZE_NAMES = { S: "Kecil", M: "Sederhana", L: "Besar", 4: "4 ketul", 6: "6 ketul" };

export const DISCOUNTS = [
  { amount: 50, label: "Kupon Hari Ini" },
  { amount: 100, label: "Diskaun Pelajar" },
  { amount: 150, label: "Kupon Ahli" },
];

// Cooking timings (seconds)
export const GRILL = { flipWin: [5, 8.5], burnA: 11, readyWin: [5, 8.5], burnB: 11.5 };
export const FRYER = { win: [7, 10.5], burn: 14 };
export const DRINK_FILL = { rate: 0.4, target: [0.85, 1.0], overflow: 1.2 };

export const STAR_BANDS = [[90, 5], [80, 4], [65, 3], [45, 2], [0, 1]];

export const STATIONS = [
  { id: "counter", key: "1", name: "Kaunter" },
  { id: "register", key: "2", name: "Mesin Tunai" },
  { id: "grill", key: "3", name: "Gril" },
  { id: "fryer", key: "4", name: "Penggoreng" },
  { id: "assembly", key: "5", name: "Pemasangan" },
  { id: "drinks", key: "6", name: "Minuman" },
  { id: "packing", key: "7", name: "Pembungkusan" },
];

export const CUSTOMER_TYPES = [
  { id: "tetap", role: "Pelanggan Tetap", name: "Pak Hamid", patience: 1.1, tip: 1.0, greet: "Assalamualaikum! Macam biasa, ya.", look: { skin: "#c98a5b", hair: "#d9d9d9", shirt: "#3d74c4", style: "cap" } },
  { id: "bergegas", role: "Penumpang Bergegas", name: "Kak Liza", patience: 0.75, tip: 0.9, simple: true, greet: "Cepat sikit ya, bas saya hampir sampai!", look: { skin: "#e0a77a", hair: "#7b3f8c", shirt: "#e3843a", style: "tudung" } },
  { id: "pelajar", role: "Pelajar Lapar", name: "Arif", patience: 1.0, tip: 0.6, greet: "Laparnya lepas kelas tambahan!", look: { skin: "#b97a4f", hair: "#2b2a28", shirt: "#5aa544", style: "short" } },
  { id: "keluarga", role: "Kumpulan Keluarga", name: "Keluarga Encik Ravi", patience: 1.25, tip: 1.2, family: true, greet: "Kami sekeluarga nak pesan, ya.", look: { skin: "#8d5a3b", hair: "#2b2a28", shirt: "#d9483b", style: "short" } },
  { id: "teliti", role: "Pelanggan Teliti", name: "Cik Mei Ling", patience: 1.0, tip: 1.3, picky: true, greet: "Tolong ikut pesanan saya dengan tepat, ya.", look: { skin: "#f1c9a5", hair: "#2b2a28", shirt: "#2f9c8f", style: "long" } },
  { id: "peminat", role: "Peminat Setia", name: "Danish", patience: 1.15, tip: 1.5, greet: "Kedai kegemaran saya! Apa khabar?", look: { skin: "#d39a6a", hair: "#5a3a22", shirt: "#f2b632", style: "curly" } },
  { id: "peneroka", role: "Peneroka Menu", name: "Puan Rosnah", patience: 1.0, tip: 1.0, explorer: true, greet: "Ada menu baharu? Saya nak cuba!", look: { skin: "#c98a5b", hair: "#e5462e", shirt: "#8a5bb0", style: "tudung" } },
  { id: "pejabat", role: "Pekerja Pejabat", name: "Encik Wong", patience: 0.85, tip: 1.0, greet: "Waktu rehat saya singkat hari ini.", look: { skin: "#f0c79e", hair: "#3a3a3a", shirt: "#5b6b7a", style: "short" } },
  { id: "atlet", role: "Atlet Sekolah", name: "Aiman", patience: 0.95, tip: 0.9, big: true, greet: "Baru habis latihan bola. Lapar!", look: { skin: "#a86b45", hair: "#2b2a28", shirt: "#e5462e", style: "cap" } },
  { id: "guru", role: "Cikgu Sekolah", name: "Cikgu Farah", patience: 1.25, tip: 1.1, greet: "Selamat petang! Tak perlu tergesa-gesa.", look: { skin: "#d8a27a", hair: "#2f6f4f", shirt: "#f2b632", style: "tudung" } },
  { id: "artis", role: "Artis Jalanan", name: "Siti", patience: 1.3, tip: 0.8, greet: "Hai! Bau burger ni sedap sangat.", look: { skin: "#e6b48c", hair: "#2b2a28", shirt: "#5aa544", style: "bun" } },
];

const BASE_DAYS = [
  { customers: 6, interval: [30, 38], maxQueue: 3, maxActive: 3, target: 2000, maxLines: 2, maxQty: 2, discount: false, exclusions: false, noIce: false,
    menu: { burgers: ["classic"], fries: ["S", "M"], bites: [], drinks: ["cola", "water"], sizes: ["S", "M"] } },
  { customers: 7, interval: [27, 34], maxQueue: 3, maxActive: 3, target: 2800, maxLines: 2, maxQty: 2, discount: true, exclusions: true, noIce: true,
    menu: { burgers: ["classic", "cheese"], fries: ["S", "M"], bites: [], drinks: ["cola", "lemon", "water"], sizes: ["S", "M"] } },
  { customers: 8, interval: [25, 31], maxQueue: 4, maxActive: 4, target: 3500, maxLines: 3, maxQty: 2, discount: true, exclusions: true, noIce: true,
    menu: { burgers: ["classic", "cheese", "double"], fries: ["S", "M", "L"], bites: [], drinks: ["cola", "lemon", "water"], sizes: ["S", "M", "L"] } },
  { customers: 8, interval: [24, 30], maxQueue: 4, maxActive: 4, target: 4000, maxLines: 3, maxQty: 3, discount: true, exclusions: true, noIce: true,
    menu: { burgers: ["classic", "cheese", "double"], fries: ["S", "M", "L"], bites: ["4", "6"], drinks: ["cola", "lemon", "orange", "water"], sizes: ["S", "M", "L"] } },
  { customers: 9, interval: [22, 28], maxQueue: 4, maxActive: 4, target: 4600, maxLines: 3, maxQty: 3, discount: true, exclusions: true, noIce: true,
    menu: { burgers: ["classic", "cheese", "double", "garden"], fries: ["S", "M", "L"], bites: ["4", "6"], drinks: ["cola", "lemon", "orange", "water"], sizes: ["S", "M", "L"] } },
];

export const UNLOCK_NOTES = {
  1: "Menu: Classic Stack, kentang goreng, kola dan air mineral.",
  2: "Baharu: Cheese Stack, Soda Lemon-Limau, permintaan khas dan diskaun kecil.",
  3: "Baharu: Double Stack (2 patty) dan kentang goreng besar.",
  4: "Baharu: Kepingan Ayam dan Soda Oren.",
  5: "Baharu: Garden Stack dengan patty sayur.",
};

const TIMER_DIFF = { santai: { patience: 1.4, shift: 1.1 }, biasa: { patience: 1, shift: 1 }, sukar: { patience: 0.8, shift: 0.95 } };

export function dayConfig(day, settings) {
  const base = BASE_DAYS[Math.min(day, BASE_DAYS.length) - 1];
  const extra = Math.max(0, day - BASE_DAYS.length);
  const td = TIMER_DIFF[settings.timerDifficulty] || TIMER_DIFF.biasa;
  return {
    ...base,
    customers: base.customers + Math.min(extra, 6),
    interval: base.interval.map((v) => Math.max(16, v - extra)),
    target: base.target + extra * 400,
    patienceMod: td.patience,
    shiftLength: Math.round(SHIFT_SECONDS * td.shift),
  };
}
