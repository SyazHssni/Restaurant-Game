let ctx = null;

export function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) return null;
  ctx = ctx || new AudioContextType();
  return ctx;
}
const SOUNDS = {
  bell: [[880, 0.08], [1320, 0.12]],
  ding: [[1046, 0.1]],
  ok: [[660, 0.07], [990, 0.1]],
  err: [[220, 0.15, "square"]],
  coin: [[1568, 0.05, "triangle"]],
  cash: [[784, 0.06], [1046, 0.06], [1568, 0.12]],
  flip: [[520, 0.06, "triangle"]],
  pop: [[740, 0.06, "triangle"], [988, 0.06, "triangle"]],
  tap: [[600, 0.03, "triangle"]],
  star: [[880, 0.07], [1175, 0.07], [1397, 0.14]],
  sad: [[392, 0.1], [294, 0.16]],
  end: [[523, 0.1], [659, 0.1], [784, 0.2]],
};

const LOOP_SOUNDS = { cooking: "Cooking.mp3", pouring: "Pouring.mp3" };
const loopPlayers = new Map();

function loopSoundUrl(filename) {
  const assetPath = `sfx/${encodeURIComponent(filename)}`;
  const publicBase = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
  return publicBase && publicBase !== "."
    ? `${publicBase}/${assetPath}`
    : new URL(assetPath, document.baseURI).href;
}

function getLoopPlayer(name) {
  if (!LOOP_SOUNDS[name]) return null;
  if (!loopPlayers.has(name)) {
    loopPlayers.set(name, {
      active: false,
      buffer: null,
      failed: false,
      gain: null,
      loading: null,
      source: null,
      targetVolume: 0,
      fadeTimer: null,
    });
  }
  return loopPlayers.get(name);
}

function fadeLoopVolume(entry, target) {
  if (!entry.gain) return;
  if (entry.fadeTimer) clearInterval(entry.fadeTimer);
  entry.fadeTimer = null;
  const from = entry.gain.gain.value;
  if (Math.abs(from - target) < 0.01) {
    if (target === 0 && !entry.active) stopLoop(entry);
    return;
  }
  const steps = 8;
  let step = 0;
  entry.fadeTimer = setInterval(() => {
    step += 1;
    if (entry.gain) entry.gain.gain.value = from + (target - from) * (step / steps);
    if (step >= steps) {
      clearInterval(entry.fadeTimer);
      entry.fadeTimer = null;
      if (target === 0 && !entry.active) stopLoop(entry);
    }
  }, 20);
}

function stopLoop(entry) {
  if (!entry.source) return;
  const source = entry.source;
  entry.source = null;
  entry.gain = null;
  source.onended = null;
  try { source.stop(); } catch { /* already stopped */ }
  source.disconnect();
}

function startLoop(entry) {
  const audio = getAudioContext();
  if (!audio || !entry.buffer || entry.source) return;
  if (audio.state === "suspended") audio.resume().catch(() => {});
  const source = audio.createBufferSource();
  const gain = audio.createGain();
  source.buffer = entry.buffer;
  source.loop = true;
  gain.gain.value = 0;
  source.connect(gain).connect(audio.destination);
  entry.source = source;
  entry.gain = gain;
  source.start();
  fadeLoopVolume(entry, entry.active ? entry.targetVolume : 0);
}

function loadLoop(name, entry) {
  const audio = getAudioContext();
  if (!audio || entry.loading || entry.buffer || entry.failed) return;
  entry.loading = fetch(loopSoundUrl(LOOP_SOUNDS[name]))
    .then((response) => {
      if (!response.ok) throw new Error(`Unable to load ${LOOP_SOUNDS[name]}`);
      return response.arrayBuffer();
    })
    .then((data) => audio.decodeAudioData(data))
    .then((buffer) => {
      entry.buffer = buffer;
      entry.loading = null;
      if (entry.active) startLoop(entry);
    })
    .catch(() => {
      entry.loading = null;
      entry.failed = true;
    });
}

export function syncLoopingSound(name, active, volume) {
  const entry = getLoopPlayer(name);
  if (!entry) return;
  const level = Math.max(0, Math.min(100, Number(volume) || 0));
  const wasActive = entry.active;
  const nextActive = Boolean(active) && level > 0;
  const nextTarget = nextActive ? level / 100 : 0;
  const targetChanged = Math.abs(nextTarget - entry.targetVolume) > 0.005;
  entry.active = nextActive;
  entry.targetVolume = nextTarget;

  if (!entry.active) {
    if (entry.gain && (targetChanged || wasActive || !entry.fadeTimer)) fadeLoopVolume(entry, 0);
    return;
  }
  if (!entry.buffer) {
    loadLoop(name, entry);
    return;
  }
  if (!entry.source) startLoop(entry);
  if (entry.gain && (targetChanged || !wasActive || !entry.fadeTimer)) fadeLoopVolume(entry, entry.targetVolume);
}

export function stopLoopingSounds() {
  Object.keys(LOOP_SOUNDS).forEach((name) => syncLoopingSound(name, false, 0));
}

export function playSound(name, volume) {
  if (!volume || !SOUNDS[name]) return;
  try {
    const audio = getAudioContext();
    if (!audio) return;
    if (audio.state === "suspended") audio.resume().catch(() => {});
    let t = audio.currentTime;
    SOUNDS[name].forEach(([f, d, type = "sine"]) => {
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime((volume / 100) * 0.15, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(audio.destination);
      o.start(t);
      o.stop(t + d + 0.02);
      t += d * 0.9;
    });
  } catch { /* audio unavailable */ }
}
