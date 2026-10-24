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

const SPECIALS = {
  classic: { name: "Classic Stack", price: 600, day: 1, layers: ["bun_bottom", "sauce_house", "patty_beef", "lettuce", "tomato", "bun_top"] },
  cheese: { name: "Cheese Stack", price: 670, day: 2, layers: ["bun_bottom", "sauce_house", "patty_beef", "cheese", "lettuce", "tomato", "bun_top"] },
  double: { name: "Double Stack", price: 850, day: 3, layers: ["bun_bottom", "sauce_house", "patty_beef", "cheese", "patty_beef", "lettuce", "bun_top"] },
  garden: { name: "Garden Stack", price: 650, day: 5, layers: ["bun_bottom", "sauce_house", "patty_veg", "lettuce", "tomato", "pickle", "bun_top"] },
};
const FILLINGS = ["cheese", "lettuce", "tomato", "pickle"];
const FILL_WORD = { cheese: "Keju", lettuce: "Salad", tomato: "Tomato", pickle: "Jeruk" };
const PATTY_BASES = [
  { key: "beef", word: "Daging", patties: ["patty_beef"], base: 480 },
  { key: "double", word: "Daging Berganda", patties: ["patty_beef", "patty_beef"], base: 700 },
  { key: "veg", word: "Sayur", patties: ["patty_veg"], base: 450 },
  { key: "none", word: "", patties: [], base: 300 },
];
const PHRASES = {
  "": "Asli", "lettuce+tomato": "Segar", "lettuce+tomato+pickle": "Kebun", "cheese+lettuce+tomato": "Keju Segar",
  "cheese+lettuce+tomato+pickle": "Lengkap", "cheese+pickle": "Keju dan Jeruk", "lettuce+pickle": "Salad Rangup",
};
const joinWords = (w) => (w.length < 2 ? w.join("") : `${w.slice(0, -1).join(", ")} dan ${w[w.length - 1]}`);
const comboKey = (layers) => [...layers].sort().join("+");

function stackLayers(patties, fills, sauce) {
  const l = ["bun_bottom"];
  if (sauce) l.push("sauce_house");
  if (patties[0]) l.push(patties[0]);
  if (fills.includes("cheese")) l.push("cheese");
  if (patties[1]) l.push(patties[1]);
  ["lettuce", "tomato", "pickle"].forEach((f) => fills.includes(f) && l.push(f));
  l.push("bun_top");
  return l;
}

// Every distinct, sensible combination of the nine ingredients, with a unique name.
function buildCatalogue() {
  const out = {};
  const seen = new Set();
  Object.entries(SPECIALS).forEach(([id, b]) => { seen.add(comboKey(b.layers)); out[id] = { ...b, special: true }; });
  const names = new Set(Object.values(out).map((b) => b.name));
  for (const pb of PATTY_BASES) {
    for (let mask = 0; mask < 16; mask++) {
      const fills = FILLINGS.filter((_, i) => mask & (1 << i));
      if (pb.key === "none" && (fills.length < 2 || !(fills.includes("lettuce") || fills.includes("tomato")))) continue;
      for (const sauce of [true, false]) {
        const layers = stackLayers(pb.patties, fills, sauce);
        const key = comboKey(layers);
        if (seen.has(key)) continue;
        const phrase = PHRASES[fills.join("+")] || joinWords(fills.map((f) => FILL_WORD[f]));
        const head = pb.word ? `Burger ${pb.word}` : "Burger";
        let name = fills.length === 0 ? `${head} ${sauce ? "Istimewa" : "Asli"}`
          : fills.length === 4 && !sauce ? `${head} Berlapis` : `${head} ${phrase}${sauce && fills.length < 4 ? " Istimewa" : ""}`;
        if (names.has(name)) continue;
        const veg = fills.filter((f) => f !== "cheese").length;
        const price = pb.base + (fills.includes("cheese") ? 70 : 0) + veg * 30 + (sauce ? 20 : 0);
        const day = pb.key === "beef" ? (fills.length <= 1 ? 1 : fills.length === 2 ? 2 : 3) : pb.key === "double" ? 3 : pb.key === "none" ? 4 : 5;
        seen.add(key);
        names.add(name);
        out[`b_${pb.key}_${mask}_${sauce ? "s" : "n"}`] = { name, price, day, layers };
      }
    }
  }
  Object.values(out).forEach((b) => {
    const patties = b.layers.filter((i) => i.startsWith("patty_"));
    b.patty = patties[0] ? patties[0].slice(6) : null;
    b.pattyCount = patties.length;
  });
  return out;
}
export const BURGERS = buildCatalogue();

export const FRY_ITEMS = {
  fries: { name: "Kentang Goreng", sizes: { S: 200, M: 270, L: 350 }, cost: { S: 50, M: 70, L: 90 } },
  bites: { name: "Kepingan Ayam", sizes: { 4: 350, 6: 470 }, cost: { 4: 110, 6: 150 } },
};
export const TEMPS = { sejuk: "Sejuk", panas: "Panas", bilik: "Suhu Bilik" };
const DRINK_TIERS = { W: { S: 100, M: 130, L: 160 }, A: { S: 150, M: 200, L: 250 }, B: { S: 180, M: 230, L: 280 }, C: { S: 250, M: 300, L: 350 }, D: { S: 300, M: 350, L: 400 } };
const d = (name, group, tier, temps, day, color) => ({ name, group, tier, temps, day, color });
export const DRINKS = {
  cola: d("Kola", "Soda", "A", ["sejuk"], 1, "#5a2d1c"),
  cola_zero: d("Kola Tanpa Gula", "Soda", "A", ["sejuk"], 2, "#3b2218"),
  soda_oren: d("Soda Oren", "Soda", "A", ["sejuk"], 2, "#f39a2b"),
  soda_anggur: d("Soda Anggur", "Soda", "A", ["sejuk"], 4, "#7b3f8c"),
  air_mineral: d("Air Mineral", "Air", "W", ["sejuk", "bilik"], 1, "#bfe3f2"),
  air_lemon: d("Air Lemon", "Air", "A", ["sejuk", "panas"], 4, "#e8e36b"),
  jus_oren: d("Jus Oren", "Jus", "C", ["sejuk"], 3, "#f7a531"),
  jus_epal: d("Jus Epal", "Jus", "C", ["sejuk"], 3, "#d9cf6a"),
  jus_mangga: d("Jus Mangga", "Jus", "C", ["sejuk"], 5, "#f6b733"),
  teh_o: d("Teh O", "Teh", "B", ["panas", "sejuk"], 1, "#9a4f1f"),
  teh_o_limau: d("Teh O Limau", "Teh", "B", ["panas", "sejuk"], 3, "#b8742a"),
  teh_tarik: d("Teh Tarik", "Teh", "B", ["panas", "sejuk"], 2, "#c98d5a"),
  teh_lemon: d("Teh Lemon", "Teh", "B", ["panas", "sejuk"], 4, "#c9a23a"),
  teh_hijau: d("Teh Hijau", "Teh", "B", ["panas", "sejuk"], 5, "#8fae3c"),
  kopi_o: d("Kopi O", "Kopi", "B", ["panas", "sejuk"], 2, "#3a2216"),
  kopi_susu: d("Kopi Susu", "Kopi", "B", ["panas", "sejuk"], 4, "#8a5a3a"),
  latte: d("Latte", "Kopi", "D", ["panas", "sejuk"], 5, "#c7a27e"),
  coklat_panas: d("Coklat Panas", "Coklat & Susu", "D", ["panas"], 4, "#6b3a22"),
  coklat_ais: d("Coklat Ais", "Coklat & Susu", "D", ["sejuk"], 4, "#7a4a2e"),
  susu_segar: d("Susu Segar", "Coklat & Susu", "C", ["sejuk", "panas"], 5, "#f4f1ea"),
  sirap: d("Sirap", "Tradisional", "A", ["sejuk"], 1, "#e5466e"),
  sirap_limau: d("Sirap Limau", "Tradisional", "A", ["sejuk"], 3, "#ef6a7a"),
  bandung: d("Bandung", "Tradisional", "A", ["sejuk"], 3, "#f3a6bd"),
  air_barli: d("Air Barli", "Tradisional", "A", ["panas", "sejuk"], 3, "#e9dcb0"),
  air_jagung: d("Air Jagung", "Tradisional", "A", ["panas", "sejuk"], 4, "#f2d16b"),
  air_kelapa: d("Air Kelapa", "Tradisional", "C", ["sejuk", "bilik"], 5, "#eef3e2"),
  air_kosong: d("Air Kosong", "Air", "W", ["sejuk", "panas", "bilik"], 2, "#dceef6"),
};
export const drinkPrice = (flavour, size) => DRINK_TIERS[DRINKS[flavour].tier][size];
export const DRINK_COST = { S: 30, M: 40, L: 50 };
// Drink minigame: ice / heat, pour to the line, then stir/pull or lid.
export const DRINK_GAME = {
  ice: { S: 2, M: 3, L: 4 },
  heat: { rate: 22, start: 25, target: [70, 85], burn: 96 },
  pour: { rate: { S: 0.42, M: 0.36, L: 0.3 }, target: [0.85, 1.0], spill: 1.15 },
  stir: { speed: 0.8, sweet: [0.38, 0.62], hits: { teh_tarik: 3, kopi_susu: 2, latte: 2, coklat_panas: 2, coklat_ais: 2, susu_segar: 1, bandung: 2, air_jagung: 1, teh_o_limau: 1, sirap_limau: 1 } },
};
export function drinkSteps(flavour, temp) {
  const steps = [];
  if (temp === "sejuk") steps.push("ice");
  if (temp === "panas") steps.push("heat");
  steps.push("pour");
  steps.push(DRINK_GAME.stir.hits[flavour] ? "stir" : "lid");
  return steps;
}
export const SIZE_NAMES = { S: "Kecil", M: "Sederhana", L: "Besar", 4: "4 ketul", 6: "6 ketul" };

export const DISCOUNTS = [
  { amount: 50, label: "Kupon Hari Ini" },
  { amount: 100, label: "Diskaun Pelajar" },
  { amount: 150, label: "Kupon Ahli" },
];

// Cooking timings (seconds)
export const GRILL_SLOTS = 4;
export const GRILL = { flipWin: [5, 8.5], burnA: 11, readyWin: [5, 8.5], burnB: 11.5 };
export const FRYER = { win: [7, 10.5], burn: 14 };

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
  { customers: 6, interval: [30, 38], maxQueue: 3, maxActive: 3, target: 2000, maxLines: 2, maxQty: 2, discount: false, exclusions: false,
    menu: { fries: ["S", "M"], bites: [], sizes: ["S", "M"] } },
  { customers: 7, interval: [27, 34], maxQueue: 3, maxActive: 3, target: 2800, maxLines: 2, maxQty: 2, discount: true, exclusions: true,
    menu: { fries: ["S", "M"], bites: [], sizes: ["S", "M"] } },
  { customers: 8, interval: [25, 31], maxQueue: 4, maxActive: 4, target: 3500, maxLines: 3, maxQty: 2, discount: true, exclusions: true,
    menu: { fries: ["S", "M", "L"], bites: [], sizes: ["S", "M", "L"] } },
  { customers: 8, interval: [24, 30], maxQueue: 4, maxActive: 4, target: 4600, maxLines: 3, maxQty: 3, bulk: 0.3, discount: true, exclusions: true,
    menu: { fries: ["S", "M", "L"], bites: ["4", "6"], sizes: ["S", "M", "L"] } },
  { customers: 9, interval: [22, 28], maxQueue: 4, maxActive: 4, target: 5400, maxLines: 3, maxQty: 3, bulk: 0.4, discount: true, exclusions: true,
    menu: { fries: ["S", "M", "L"], bites: ["4", "6"], sizes: ["S", "M", "L"] } },
];

export const UNLOCK_NOTES = {
  1: "Menu: Classic Stack, burger daging asas, kentang goreng, kola, air mineral, teh O dan sirap.",
  2: "Baharu: Cheese Stack, lebih banyak burger daging, teh tarik, kopi O, soda dan diskaun kecil.",
  3: "Baharu: Double Stack, burger daging berganda, jus dan minuman tradisional.",
  4: "Baharu: burger tanpa patty, Kepingan Ayam, kopi susu dan coklat.",
  5: "Baharu: Garden Stack, semua burger sayur, latte, jus mangga dan air kelapa.",
};

export const STARTING_STOCK = { bun_bottom: 30, sauce_house: 30, patty_beef: 24, patty_veg: 14, cheese: 18, lettuce: 20, tomato: 18, pickle: 10, bun_top: 30 };
export const RESTOCK = { qty: 10, seconds: 15 };

const TIMER_DIFF = { santai: { patience: 1.4, shift: 1.1 }, biasa: { patience: 1, shift: 1 }, sukar: { patience: 0.8, shift: 0.95 } };

export function dayConfig(day, settings) {
  const base = BASE_DAYS[Math.min(day, BASE_DAYS.length) - 1];
  const extra = Math.max(0, day - BASE_DAYS.length);
  const td = TIMER_DIFF[settings.timerDifficulty] || TIMER_DIFF.biasa;
  const unlocked = (obj) => Object.keys(obj).filter((k) => obj[k].day <= day);
  return {
    ...base,
    menu: { ...base.menu, burgers: unlocked(BURGERS), drinks: unlocked(DRINKS) },
    customers: base.customers + Math.min(extra, 6),
    bulk: base.bulk ? Math.min(0.6, base.bulk + extra * 0.05) : 0,
    interval: base.interval.map((v) => Math.max(16, v - extra)),
    target: base.target + extra * 400,
    patienceMod: td.patience,
    shiftLength: Math.round(SHIFT_SECONDS * td.shift),
  };
}
