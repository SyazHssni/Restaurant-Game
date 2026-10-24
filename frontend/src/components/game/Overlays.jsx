import { GraduationCap } from "lucide-react";
import { useGame } from "./shared";
import { TUTORIAL_STEPS } from "../../game/engine";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
} from "../ui/alert-dialog";

export const TutorialCard = () => {
  const { state: s, dispatch } = useGame();
  if (!s.tutorial) return null;
  const i = s.tutorial.step;
  const st = TUTORIAL_STEPS[i];
  const last = i === TUTORIAL_STEPS.length - 1;
  return (
    <div className="fixed bottom-4 left-3 z-40 w-[300px] max-w-[calc(100vw-2rem)] rb-card p-5 border-[var(--charcoal)] rb-rise" key={i} data-testid="tutorial-card" role="dialog" aria-label="Tutorial">
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
        <GraduationCap size={16} /> Tutorial · Langkah {i + 1}/{TUTORIAL_STEPS.length}
      </div>
      <p className="rb-display text-xl font-extrabold mt-1" data-testid="tutorial-title">{st.title}</p>
      <p className="text-sm mt-1 leading-relaxed" data-testid="tutorial-text">{st.text}</p>
      <div className="flex gap-2 mt-4 justify-end">
        {last ? (
          <button data-testid="tutorial-start-shift" className="rb-btn rb-red" onClick={() => dispatch({ type: "TUTORIAL_FINISH" })}>Mula Syif Sebenar</button>
        ) : (
          <button data-testid="tutorial-skip" className="rb-btn rb-white text-sm" onClick={() => dispatch({ type: "TUTORIAL_FINISH" })}>Langkau Tutorial</button>
        )}
      </div>
    </div>
  );
};

const TONE = { good: "bg-[#e5f4dc] border-[var(--lettuce)]", bad: "bg-[#fde3dc] border-[var(--tomato)]", warn: "bg-[#fff1cf] border-[var(--mustard-dark)]", info: "bg-white border-[var(--line)]" };
export const FxToasts = () => {
  const { state: s } = useGame();
  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-2 items-end max-w-[520px] pointer-events-none" aria-live="polite" data-testid="fx-toasts">
      {s.fx.map((f) => <div key={f.id} className={`rb-pop rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-md ${TONE[f.tone]}`}>{f.text}</div>)}
    </div>
  );
};

export const PauseMenu = ({ onQuit, onRestart }) => {
  const { state: s, dispatch } = useGame();
  if (!s.paused || s.menuOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[rgba(43,42,40,0.6)] backdrop-blur-sm flex items-center justify-center" data-testid="pause-menu">
      <div className="rb-card p-8 w-[360px] text-center space-y-3 rb-pop">
        <p className="rb-display text-3xl font-extrabold">Permainan Dijeda</p>
        <p className="text-sm text-[var(--muted)]">Semua pemasa dihentikan.</p>
        <button data-testid="pause-resume" className="rb-btn rb-green w-full" onClick={() => dispatch({ type: "RESUME" })}>Sambung</button>
        <button data-testid="pause-restart" className="rb-btn rb-white w-full" onClick={onRestart}>Mula Semula Syif</button>
        <button data-testid="pause-quit" className="rb-btn rb-white w-full" onClick={onQuit}>Keluar ke Menu Utama</button>
        <p className="text-xs text-[var(--muted)]">Kemajuan syif ini tidak disimpan jika anda keluar. Hari yang sudah tamat kekal disimpan.</p>
      </div>
    </div>
  );
};

export const PackWarn = () => {
  const { state: s, dispatch } = useGame();
  const o = s.packWarn && s.orders.find((x) => x.id === s.packWarn);
  return (
    <AlertDialog open={!!o} onOpenChange={(v) => !v && dispatch({ type: "CLOSE_PACK_WARN" })}>
      <AlertDialogContent data-testid="pack-warning-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Pesanan #{o?.num} belum lengkap</AlertDialogTitle>
          <AlertDialogDescription>Ada item yang belum dimasukkan ke dalam beg. Jika dihantar juga, ketepatan, tip dan reputasi akan berkurang.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <button data-testid="pack-warning-review" className="rb-btn rb-white" onClick={() => dispatch({ type: "CLOSE_PACK_WARN" })}>Semak Tiket</button>
          <button data-testid="pack-warning-serve-anyway" className="rb-btn rb-red" onClick={() => dispatch({ type: "DELIVER", orderId: o.id, force: true })}>Hantar Juga</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
