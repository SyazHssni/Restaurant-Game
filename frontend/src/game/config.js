import { CUSTOMER_DIALOGUE } from "./customerDialogues";
const publicAssetUrl = (assetPath) => {
  const publicBase = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
  if (publicBase && publicBase !== ".") return `${publicBase}/${assetPath}`;
  if (typeof document === "undefined") return `/${assetPath}`;
  const appBase = new URL(document.baseURI);
  if (!appBase.pathname.endsWith("/")) {
    const slash = appBase.pathname.lastIndexOf("/");
    const lastSegment = appBase.pathname.slice(slash + 1);
    appBase.pathname = lastSegment.includes(".") ? appBase.pathname.slice(0, slash + 1) : `${appBase.pathname}/`;
  }
  return new URL(assetPath, appBase).href;
};
// All money values are integer sen.
export const DENOMS = [10000, 5000, 2000, 1000, 500, 100, 50, 20, 10];
export const DENOM_INFO = {
  10000: { label: "RM100", type: "note", image: publicAssetUrl("money/rm-100.png") },
  5000: { label: "RM50", type: "note", image: publicAssetUrl("money/rm-50.png") },
  2000: { label: "RM20", type: "note", image: publicAssetUrl("money/rm-20.png") },
  1000: { label: "RM10", type: "note", image: publicAssetUrl("money/rm-10.png") },
  500: { label: "RM5", type: "note", image: publicAssetUrl("money/rm-5.png") },
  100: { label: "RM1", type: "note", image: publicAssetUrl("money/rm-1.png") },
  50: { label: "50 sen", type: "coin", image: publicAssetUrl("money/50-sen.png") },
  20: { label: "20 sen", type: "coin", image: publicAssetUrl("money/20-sen.png") },
  10: { label: "10 sen", type: "coin", image: publicAssetUrl("money/10-sen.png") },
};
export const OPENING_FLOAT = { 10000: 1, 5000: 1, 2000: 1, 1000: 3, 500: 4, 100: 20, 50: 40, 20: 50, 10: 100 };

export const START_FUNDS = 30000;
export const START_REPUTATION = 50;
export const OPERATING_COST = 2500;
export const COMPLAINT_PENALTY = 200;
export const GRACE_SECONDS = 30;
export const SHIFT_SECONDS = 240;

export const INGREDIENTS = {
  bun_bottom: { name: "Roti Bawah", cost: 20, color: "#e0a457", texture: publicAssetUrl("game-textures/ingredient-bun-bottom.png") },
  sauce_house: { name: "Sos Istimewa", cost: 10, color: "#f08a3c", texture: publicAssetUrl("game-textures/ingredient-sauce.png") },
  patty_beef: { name: "Patty Daging", cost: 120, color: "#7a4a2e", patty: "beef", texture: publicAssetUrl("game-textures/patty-beef-cooked.png") },
  patty_veg: { name: "Patty Sayur", cost: 110, color: "#8a9a3a", patty: "veg", texture: publicAssetUrl("game-textures/patty-veg-cooked.png") },
  cheese: { name: "Keju", cost: 30, color: "#f6c636", texture: publicAssetUrl("game-textures/ingredient-cheese.png") },
  lettuce: { name: "Salad", cost: 10, color: "#6cbf4a", texture: publicAssetUrl("game-textures/ingredient-lettuce.png") },
  tomato: { name: "Tomato", cost: 10, color: "#e5462e", texture: publicAssetUrl("game-textures/ingredient-tomato.png") },
  pickle: { name: "Jeruk", cost: 10, color: "#7d9b3c", texture: publicAssetUrl("game-textures/ingredient-orange.png") },
  bun_top: { name: "Roti Atas", cost: 20, color: "#e8ad5f", texture: publicAssetUrl("game-textures/ingredient-bun-top.png") },
};
export const PATTY_TEXTURES = {
  beef: {
    raw: publicAssetUrl("game-textures/patty-beef-raw.png"),
    medium: publicAssetUrl("game-textures/patty-beef-medium.png"),
    cooked: publicAssetUrl("game-textures/patty-beef-cooked.png"),
    overcooked: publicAssetUrl("game-textures/patty-beef-overcooked.png"),
    burned: publicAssetUrl("game-textures/patty-beef-burned.png"),
  },
  veg: {
    raw: publicAssetUrl("game-textures/patty-veg-raw.png"),
    medium: publicAssetUrl("game-textures/patty-veg-medium.png"),
    cooked: publicAssetUrl("game-textures/patty-veg-cooked.png"),
    overcooked: publicAssetUrl("game-textures/patty-veg-overcooked.png"),
    burned: publicAssetUrl("game-textures/patty-veg-burned.png"),
  },
};
export const CUP_TEXTURES = {
  S: publicAssetUrl("game-textures/cup-small.png"),
  M: publicAssetUrl("game-textures/cup-medium.png"),
  L: publicAssetUrl("game-textures/cup-large.png"),
};
export const CUP_COVER_TEXTURE = publicAssetUrl("game-textures/cup-cover.png");
export const ICE_CUBE_TEXTURE = publicAssetUrl("game-textures/ice-cube.png");
export const ASSEMBLY_ORDER = ["bun_bottom", "sauce_house", "patty_beef", "patty_veg", "cheese", "lettuce", "tomato", "pickle", "bun_top"];
export const REMOVABLE = ["lettuce", "tomato", "pickle", "sauce_house"];

const SPECIALS = {
  classic: { name: "Classic Stack", price: 600, day: 1, layers: ["bun_bottom", "sauce_house", "patty_beef", "lettuce", "tomato", "bun_top"] },
  cheese: { name: "Cheese Stack", price: 670, day: 2, layers: ["bun_bottom", "sauce_house", "patty_beef", "cheese", "lettuce", "tomato", "bun_top"] },
  double: { name: "Double Stack", price: 850, day: 3, layers: ["bun_bottom", "sauce_house", "patty_beef", "cheese", "patty_beef", "lettuce", "bun_top"] },
  garden: { name: "Garden Stack", price: 650, day: 5, layers: ["bun_bottom", "sauce_house", "patty_veg", "lettuce", "tomato", "pickle", "bun_top"] },
  double_garden: { name: "Double Garden Stack", price: 850, day: 5, layers: ["bun_bottom", "sauce_house", "patty_veg", "cheese", "patty_veg", "lettuce", "tomato", "bun_top"] },
  harvest_melt: { name: "Harvest Melt", price: 820, day: 5, layers: ["bun_bottom", "patty_veg", "cheese", "patty_veg", "tomato", "pickle", "bun_top"] },
  green_crunch: { name: "Green Crunch", price: 790, day: 5, layers: ["bun_bottom", "sauce_house", "patty_veg", "lettuce", "patty_veg", "tomato", "pickle", "bun_top"] },
  sunny_garden: { name: "Sunny Garden", price: 820, day: 5, layers: ["bun_bottom", "patty_veg", "cheese", "patty_veg", "lettuce", "pickle", "bun_top"] },
};
const FILLINGS = ["cheese", "lettuce", "tomato", "pickle"];
const FILL_WORD = { cheese: "Keju", lettuce: "Salad", tomato: "Tomato", pickle: "Jeruk" };
const PATTY_BASES = [
  { key: "beef", word: "Daging", patties: ["patty_beef"], base: 480 },
  { key: "double", word: "Daging Berganda", patties: ["patty_beef", "patty_beef"], base: 700 },
  { key: "veg", word: "Sayur", patties: ["patty_veg"], base: 450 },
  { key: "veg_double", word: "Sayur Berganda", patties: ["patty_veg", "patty_veg"], base: 650 },
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
export const FRY_TEXTURES = {
  S: publicAssetUrl("game-textures/fries-small.png"),
  M: publicAssetUrl("game-textures/fries-medium.png"),
  L: publicAssetUrl("game-textures/fries-large.png"),
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

const characterPortrait = (filename) => publicAssetUrl(`characters/${filename}`);

export const CUSTOMER_TYPES = [
  {
    id: "david-martinez", name: "David Martinez",
    patience: 0.95, tip: 1.0, big: true,
    look: { image: characterPortrait("david-martinez.png") },
    dialogue: CUSTOMER_DIALOGUE["david-martinez"],
  },
  {
    id: "gojo-satoru", name: "Gojo Satoru",
    patience: 1.2, tip: 1.15,
    look: { image: characterPortrait("gojo-satoru.png") },
    dialogue: CUSTOMER_DIALOGUE["gojo-satoru"],
  },
  {
    id: "isagi-yoichi", name: "Isagi Yoichi",
    patience: 0.95, tip: 1.0, picky: true,
    look: { image: characterPortrait("isagi-yoichi.png") },
    dialogue: CUSTOMER_DIALOGUE["isagi-yoichi"],
  },
  {
    id: "ishigami-senku", name: "Ishigami Senku",
    patience: 1.0, tip: 1.2, explorer: true,
    look: { image: characterPortrait("ishigami-senku.png") },
    dialogue: CUSTOMER_DIALOGUE["ishigami-senku"],
  },
  {
    id: "ken-takakura", name: "Ken Takakura",
    patience: 1.05, tip: 0.9, simple: true,
    look: { image: characterPortrait("ken-takakura.png") },
    dialogue: CUSTOMER_DIALOGUE["ken-takakura"],
  },
  {
    id: "kohaku", name: "Kohaku",
    patience: 1.15, tip: 1.05, big: true,
    look: { image: characterPortrait("kohaku.png") },
    dialogue: CUSTOMER_DIALOGUE["kohaku"],
  },
  {
    id: "kurapika", name: "Kurapika",
    patience: 0.95, tip: 1.15, picky: true,
    look: { image: characterPortrait("kurapika.png") },
    dialogue: CUSTOMER_DIALOGUE["kurapika"],
  },
  {
    id: "l-lawliet", name: "L Lawliet",
    patience: 1.0, tip: 1.3, picky: true,
    look: { image: characterPortrait("l-lawliet.png") },
    dialogue: CUSTOMER_DIALOGUE["l-lawliet"],
  },
  {
    id: "loid-forger", name: "Loid Forger",
    patience: 0.85, tip: 1.0, simple: true,
    look: { image: characterPortrait("loid-forger.png") },
    dialogue: CUSTOMER_DIALOGUE["loid-forger"],
  },
  {
    id: "lucyna-kushinada", name: "Lucyna Kushinada",
    patience: 0.9, tip: 1.0, simple: true,
    look: { image: characterPortrait("lucyna-kushinada.png") },
    dialogue: CUSTOMER_DIALOGUE["lucyna-kushinada"],
  },
  {
    id: "luffy", name: "Luffy",
    patience: 0.95, tip: 0.8, big: true,
    look: { image: characterPortrait("luffy.png") },
    dialogue: CUSTOMER_DIALOGUE["luffy"],
  },
  {
    id: "mao-mao", name: "Mao Mao",
    patience: 1.1, tip: 1.3, explorer: true,
    look: { image: characterPortrait("mao-mao.png") },
    dialogue: CUSTOMER_DIALOGUE["mao-mao"],
  },
  {
    id: "rudeus-greyrat", name: "Rudeus Greyrat",
    patience: 1.0, tip: 1.0,
    look: { image: characterPortrait("rudeus-greyrat.png") },
    dialogue: CUSTOMER_DIALOGUE["rudeus-greyrat"],
  },
  {
    id: "satou-kazuma", name: "Satou Kazuma",
    patience: 0.85, tip: 0.8, simple: true,
    look: { image: characterPortrait("satou-kazuma.png") },
    dialogue: CUSTOMER_DIALOGUE["satou-kazuma"],
  },
  {
    id: "sosuke-aizen", name: "Sosuke Aizen",
    patience: 1.2, tip: 1.1, picky: true,
    look: { image: characterPortrait("sosuke-aizen.png") },
    dialogue: CUSTOMER_DIALOGUE["sosuke-aizen"],
  },
  {
    id: "suzuki-iruma", name: "Suzuki Iruma",
    patience: 1.2, tip: 1.1, simple: true,
    look: { image: characterPortrait("suzuki-iruma.png") },
    dialogue: CUSTOMER_DIALOGUE["suzuki-iruma"],
  },
  {
    id: "sylphiette-greyrat", name: "Sylphiette Greyrat",
    patience: 1.2, tip: 1.2, simple: true,
    look: { image: characterPortrait("sylphiette-greyrat.png") },
    dialogue: CUSTOMER_DIALOGUE["sylphiette-greyrat"],
  },
  {
    id: "vamola", name: "Vamola",
    patience: 1.1, tip: 1.0, simple: true,
    look: { image: characterPortrait("vamola.png") },
    dialogue: CUSTOMER_DIALOGUE["vamola"],
  },
  {
    id: "yor-forger", name: "Yor Forger",
    patience: 1.0, tip: 1.1,
    look: { image: characterPortrait("yor-forger.png") },
    dialogue: CUSTOMER_DIALOGUE["yor-forger"],
  },
  {
    id: "yuzaki-nasa", name: "Yuzaki Nasa",
    patience: 1.0, tip: 1.0, picky: true,
    look: { image: characterPortrait("yuzaki-nasa.png") },
    dialogue: CUSTOMER_DIALOGUE["yuzaki-nasa"],
  },
  {
    id: "yuzaki-tsukasa", name: "Yuzaki Tsukasa",
    patience: 1.25, tip: 1.1, simple: true,
    look: { image: characterPortrait("yuzaki-tsukasa.png") },
    dialogue: CUSTOMER_DIALOGUE["yuzaki-tsukasa"],
  },
  {
    id: "zenin-maki", name: "Zen'in Maki",
    patience: 0.9, tip: 1.0, big: true,
    look: { image: characterPortrait("zenin-maki.png") },
    dialogue: CUSTOMER_DIALOGUE["zenin-maki"],
  },
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
  5: "Baharu: Garden Stack dan beberapa burger patty sayur, termasuk pilihan berganda, latte, jus mangga dan air kelapa.",
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
