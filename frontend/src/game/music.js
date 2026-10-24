const TRACKS = [
  "Ahead of the Curve.mp3",
  "Hometown Hills.mp3",
  "Taking Flight.mp3",
  "Almost Was Good Enough.mp3",
  "Destinations.mp3",
  "Reconstruction.mp3",
  "Safe Travels.mp3",
  "All That Should Hold.mp3",
];

let player = null;
let playlist = [];
let previousTrack = null;
let volume = 30;
let shouldPlay = false;
let failedTracks = 0;

function trackUrl(filename) {
  const assetPath = `music/${encodeURIComponent(filename)}`;
  const publicBase = (process.env.PUBLIC_URL || "").replace(/\/+$/, "");
  return publicBase && publicBase !== "."
    ? `${publicBase}/${assetPath}`
    : new URL(assetPath, document.baseURI).href;
}

function shufflePlaylist() {
  const shuffled = [...TRACKS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (shuffled.length > 1 && shuffled[0] === previousTrack) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  playlist = shuffled;
}

function nextTrack() {
  if (playlist.length === 0) shufflePlaylist();
  previousTrack = playlist.shift();
  return previousTrack;
}

function playNextTrack() {
  if (!shouldPlay || !player) return;
  const filename = nextTrack();
  player.src = trackUrl(filename);
  player.currentTime = 0;
  player.volume = volume / 100;
  player.load();
  player.play().catch(() => {});
}

function getPlayer() {
  if (player || typeof Audio === "undefined") return player;
  player = new Audio();
  player.preload = "auto";
  player.addEventListener("playing", () => { failedTracks = 0; });
  player.addEventListener("ended", () => {
    if (shouldPlay) playNextTrack();
  });
  player.addEventListener("error", () => {
    if (!shouldPlay) return;
    failedTracks += 1;
    if (failedTracks >= TRACKS.length) {
      shouldPlay = false;
      player.pause();
      return;
    }
    playNextTrack();
  });
  return player;
}

export function setMusicVolume(value) {
  volume = Math.max(0, Math.min(100, Number(value) || 0));
  if (player) player.volume = volume / 100;
}

export function startBackgroundMusic(value = volume) {
  setMusicVolume(value);
  shouldPlay = true;
  const audio = getPlayer();
  if (!audio) return;
  if (!audio.src || audio.ended) {
    playNextTrack();
  } else if (audio.paused) {
    audio.play().catch(() => {});
  }
}

export function stopBackgroundMusic() {
  shouldPlay = false;
  if (player) player.pause();
}