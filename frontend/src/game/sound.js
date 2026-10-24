let ctx = null;
const SOUNDS = {
  bell: [[880, 0.08], [1320, 0.12]],
  ding: [[1046, 0.1]],
  ok: [[660, 0.07], [990, 0.1]],
  err: [[220, 0.15, "square"]],
  coin: [[1568, 0.05, "triangle"]],
  cash: [[784, 0.06], [1046, 0.06], [1568, 0.12]],
  sizzle: [[120, 0.12, "sawtooth"]],
  flip: [[520, 0.06, "triangle"]],
  pop: [[740, 0.06, "triangle"], [988, 0.06, "triangle"]],
  pour: [[400, 0.1, "sine"]],
  tap: [[600, 0.03, "triangle"]],
  star: [[880, 0.07], [1175, 0.07], [1397, 0.14]],
  sad: [[392, 0.1], [294, 0.16]],
  end: [[523, 0.1], [659, 0.1], [784, 0.2]],
};

export function playSound(name, volume) {
  if (!volume || !SOUNDS[name]) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    let t = ctx.currentTime;
    SOUNDS[name].forEach(([f, d, type = "sine"]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime((volume / 100) * 0.15, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + d + 0.02);
      t += d * 0.9;
    });
  } catch { /* audio unavailable */ }
}
