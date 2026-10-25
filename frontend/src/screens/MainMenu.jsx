import { useRef, useState } from "react";
import { Play, RotateCcw, BookOpen, Settings, Award, AlertTriangle, Utensils } from "lucide-react";
import { formatRM } from "../game/money";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
} from "../components/ui/alert-dialog";

export default function MainMenu({ save, settings, onNew, onContinue, onRestartBusiness, go }) {
  const [confirm, setConfirm] = useState(false);
  const [catLaughing, setCatLaughing] = useState(false);
  const catLaughAudio = useRef(null);
  const playCatLaugh = () => {
    const audio = catLaughAudio.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, (Number(settings?.volume ?? 70) || 0) / 100));
    audio.currentTime = 0;
    audio.play().catch(() => setCatLaughing(false));
  };
  const hasSave = !!save && (save.history.length > 0 || save.tutorialDone);
  const newGame = () => (hasSave ? setConfirm(true) : onNew());
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] items-center gap-10 px-6 md:px-16 py-10 max-w-7xl mx-auto" data-testid="main-menu">
      <div className="space-y-8">
        <div className="rb-rise">
          <p className="inline-block bg-[var(--mustard)] border-2 border-[var(--charcoal)] rounded-full px-4 py-1 text-sm font-semibold">Operasi gabungan melibatkan wang</p>
          <h1 className="rb-display mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-none whitespace-nowrap text-[var(--tomato)]" style={{ textShadow: "4px 4px 0 var(--charcoal)" }}>Max Burger's</h1>
          <p className="rb-display text-2xl sm:text-3xl font-bold mt-2">Kedai Burger Matematik</p>
          <p className="text-base mt-3 max-w-lg text-[var(--muted)]">Ambil pesanan, kira bil dan baki dalam kepala, beri wang baki yang tepat, kemudian masak dan hidangkan. Kira betul — kedai untung. Selalu salah — kedai boleh muflis!</p>
        </div>
        {save && save.bankrupt && (
          <div className="rb-card p-4 border-[var(--tomato)] flex gap-3 items-start" data-testid="bankrupt-notice">
            <AlertTriangle className="text-[var(--tomato)] shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold">Kedai anda telah muflis selepas dana kekal RM0.00 atau kurang selama dua syif.</p>
              <button data-testid="restart-business-button" className="rb-btn rb-red" onClick={onRestartBusiness}>Mula Semula Perniagaan</button>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 max-w-sm rb-rise" style={{ animationDelay: "0.1s" }}>
          <button data-testid="menu-new-game" className="rb-btn rb-red text-xl py-3 flex items-center justify-center gap-2" onClick={newGame}><Play size={20} />Permainan Baru</button>
          <button data-testid="menu-continue" className="rb-btn rb-yellow text-xl py-3 flex items-center justify-center gap-2" disabled={!hasSave || save.bankrupt} onClick={onContinue}>
            <RotateCcw size={20} />Teruskan{hasSave && !save.bankrupt ? ` — Hari ${save.day}` : ""}
          </button>
          <button data-testid="menu-burger-book" className="rb-btn rb-white text-base py-2 flex items-center justify-center gap-2" onClick={() => go("menubook")}><Utensils size={18} />Menu Burger</button>
          <div className="grid grid-cols-3 gap-2">
            <button data-testid="menu-how-to-play" className="rb-btn rb-white text-sm flex flex-col items-center gap-1 py-2 rounded-2xl" onClick={() => go("howto")}><BookOpen size={18} />Cara Bermain</button>
            <button data-testid="menu-settings" className="rb-btn rb-white text-sm flex flex-col items-center gap-1 py-2 rounded-2xl" onClick={() => go("settings")}><Settings size={18} />Tetapan</button>
            <button data-testid="menu-credits" className="rb-btn rb-white text-sm flex flex-col items-center gap-1 py-2 rounded-2xl" onClick={() => go("credits")}><Award size={18} />Kredit</button>
          </div>
        </div>
        {hasSave && !save.bankrupt && <p className="text-sm text-[var(--muted)]" data-testid="menu-save-info">Simpanan: Hari {save.day} · Dana {formatRM(save.funds)} · Reputasi {save.reputation}/100</p>}
      </div>
      <div className="relative flex items-center justify-center h-[320px] sm:h-[420px] lg:h-[520px]">
        <div className="relative aspect-square w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[520px]">
          <img
            src={`${process.env.PUBLIC_URL}/${catLaughing ? "title-screen-storefront-clicked.png" : "title-screen-storefront.png"}`}
            alt="Ilustrasi kedai burger dengan seekor kucing"
            className="block w-full h-full object-contain"
          />
          <button
            type="button"
            data-testid="cat-laugh-hotspot"
            data-skip-click-sound
            aria-label="Mainkan bunyi kucing"
            title="Klik kucing"
            onClick={playCatLaugh}
            className="absolute left-[37%] top-[40%] w-[30%] h-[30%] rounded-full cursor-pointer border-0 bg-transparent p-0 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--tomato)]"
          />
        </div>
        <audio
          ref={catLaughAudio}
          preload="auto"
          src={`${process.env.PUBLIC_URL}/sfx/cat-laugh.mp3`}
          className="hidden"
          onPlay={() => setCatLaughing(true)}
          onEnded={() => setCatLaughing(false)}
          onError={() => setCatLaughing(false)}
        />
      </div>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent data-testid="new-game-confirm-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Mulakan permainan baharu?</AlertDialogTitle>
            <AlertDialogDescription>Kemajuan kempen semasa (Hari {save?.day}) akan digantikan. Tetapan anda kekal.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="new-game-cancel">Batal</AlertDialogCancel>
            <button data-testid="new-game-confirm" className="rb-btn rb-red" onClick={() => { setConfirm(false); onNew(); }}>Ya, mula baharu</button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
