import { Star, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { formatRM } from "../game/money";

const Row = ({ label, value, sign, strong, testId }) => (
  <div className={`flex justify-between py-1.5 ${strong ? "border-t-2 border-[var(--charcoal)] font-bold rb-display text-lg" : "border-b border-dashed border-[var(--line)] text-sm"}`}>
    <span>{label}</span>
    <span className="tabular" data-testid={testId}>{sign}{formatRM(value)}</span>
  </div>
);

const Box = ({ title, children, testId, delay = 0 }) => (
  <div className="rb-card p-5 rb-rise" style={{ animationDelay: `${delay}s` }} data-testid={testId}>
    <p className="rb-display text-2xl font-extrabold mb-3">{title}</p>
    {children}
  </div>
);

const Fact = ({ label, value, testId }) => (
  <div className="flex justify-between py-1.5 border-b border-dashed border-[var(--line)] text-sm"><span>{label}</span><b data-testid={testId}>{value}</b></div>
);

const Worked = ({ ex }) => (
  <div className="rb-receipt p-3 text-sm space-y-1 mt-3" data-testid="worked-example">
    <p className="font-semibold">Contoh kiraan daripada syif ini:</p>
    {ex.lines.map((l, i) => <p key={i}>{l.name}: {formatRM(l.unit)} × {l.qty} = {formatRM(l.total)}</p>)}
    <p>Tambah: {ex.lines.map((l) => formatRM(l.total)).join(" + ")} = {formatRM(ex.lines.reduce((a, l) => a + l.total, 0))}</p>
    {ex.discount && <p>Tolak {ex.discount.label.toLowerCase()}: − {formatRM(ex.discount.amount)}</p>}
    <p className="font-semibold">Jumlah bil = {formatRM(ex.total)}</p>
    <p className="font-semibold">Baki = {formatRM(ex.tender)} − {formatRM(ex.total)} = {formatRM(ex.change)}</p>
  </div>
);

export default function SummaryScreen({ sum, save, unlockNote, onNext, onMenu, onRestartBusiness }) {
  const l = sum.ledger;
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 md:px-12 py-10" data-testid="summary-screen">
      <p className="text-sm font-semibold text-[var(--muted)]">Ringkasan syif</p>
      <h1 className="rb-display text-4xl sm:text-5xl lg:text-6xl font-extrabold">Hari {sum.day} selesai</h1>
      <p className={`mt-3 inline-flex items-center gap-2 rounded-full border-2 px-4 py-1 font-semibold ${sum.met ? "bg-[#e5f4dc] border-[var(--lettuce)]" : "bg-[#fff1cf] border-[var(--mustard-dark)]"}`} data-testid="summary-target">
        <Target size={16} /> Sasaran untung {formatRM(sum.target)}: {sum.met ? "Tercapai!" : `Belum tercapai (kurang ${formatRM(sum.target - sum.net)})`}
      </p>
      {save.bankrupt ? (
        <div className="rb-card p-5 mt-6 border-[var(--tomato)]" data-testid="bankrupt-panel">
          <p className="rb-display text-2xl font-extrabold text-[var(--tomato)] flex items-center gap-2"><AlertTriangle />Kedai muflis</p>
          <p className="text-sm mt-1">Dana perniagaan kekal RM0.00 atau kurang selama dua syif berturut-turut. Punca terbesar syif ini: kos bahan {formatRM(l.ingredients)}, bayaran balik {formatRM(l.refunds)}, kekurangan tunai {formatRM(l.shortages)} dan penalti aduan {formatRM(l.penalties)}.</p>
          <p className="text-sm mt-1">Anda boleh mula semula dengan dana baharu. Rekod rentetan terbaik dan status tutorial anda kekal.</p>
        </div>
      ) : save.insolventShifts > 0 && (
        <div className="rb-card p-4 mt-6 border-[var(--tomato)] flex gap-2 items-center" data-testid="insolvent-warning">
          <AlertTriangle className="text-[var(--tomato)]" /><p className="text-sm font-semibold">Amaran: dana perniagaan RM0.00 atau kurang. Satu lagi syif seperti ini dan kedai akan muflis. Fokus pada baki yang tepat!</p>
        </div>
      )}
      <div className="grid lg:grid-cols-3 gap-5 mt-8">
        <Box title="Keputusan Wang" testId="summary-money" delay={0.05}>
          <Row label="Jualan (bayaran diterima)" value={l.sales} sign="+" testId="sum-sales" />
          <Row label="Tip" value={l.tips} sign="+" testId="sum-tips" />
          <Row label="Bonus rentetan baki betul" value={l.bonus} sign="+" testId="sum-bonus" />
          <Row label="Kos bahan" value={l.ingredients} sign="−" testId="sum-ingredients" />
          <Row label="Bayaran balik" value={l.refunds} sign="−" testId="sum-refunds" />
          <Row label="Kekurangan tunai (baki terlebih)" value={l.shortages} sign="−" testId="sum-shortages" />
          <Row label="Penalti aduan (baki kurang)" value={l.penalties} sign="−" testId="sum-penalties" />
          <Row label="Untung syif" value={sum.net} strong testId="sum-net" />
          <Row label="Kos operasi harian (sewa & elektrik)" value={sum.operating} sign="−" testId="sum-operating" />
          <Row label="Dana sebelum syif" value={sum.fundsBefore} testId="sum-funds-before" />
          <Row label="Dana selepas syif" value={sum.fundsAfter} strong testId="sum-funds-after" />
          {l.underReturned > 0 && <p className="text-xs text-[var(--muted)] mt-2">Baki kurang {formatRM(l.underReturned)} telah dipulangkan kepada pelanggan (tidak mengubah untung).</p>}
        </Box>
        <Box title="Keputusan Matematik" testId="summary-maths" delay={0.1}>
          <Fact label="Skor matematik" value={sum.mathScore === null ? "—" : `${sum.mathScore}%`} testId="sum-math-score" />
          <Fact label="Jumlah bil betul pada cubaan pertama" value={`${sum.bill.firstTry}/${sum.bill.correct}`} testId="sum-bill-first" />
          <Fact label="Cubaan bil yang salah" value={sum.bill.wrong} testId="sum-bill-wrong" />
          <Fact label="Baki diberi dengan tepat" value={`${sum.change.correct}/${sum.change.total}`} testId="sum-change-accuracy" />
          <Fact label="Rentetan baki betul terbaik" value={sum.bestStreak} testId="sum-best-streak" />
          <Fact label="Petunjuk digunakan" value={sum.hints} testId="sum-hints" />
          {sum.workedExample ? <Worked ex={sum.workedExample} /> : <p className="text-xs text-[var(--muted)] mt-3">Tiada contoh kiraan — beri baki yang tepat untuk melihat contoh di sini.</p>}
        </Box>
        <Box title="Keputusan Makanan" testId="summary-food" delay={0.15}>
          <Fact label="Pesanan dihidang" value={sum.served} testId="sum-served" />
          <Fact label="Pelanggan beredar" value={sum.left} testId="sum-left" />
          <Fact label="Purata bintang" value={<span className="inline-flex items-center gap-1">{sum.avgStars}<Star size={14} fill="var(--mustard)" /></span>} testId="sum-avg-stars" />
          <Fact label="Purata ketepatan makanan" value={sum.foodAcc === null ? "—" : sum.foodAcc} testId="sum-food-accuracy" />
          <Fact label="Reputasi" value={`${sum.repBefore} → ${sum.repAfter}`} testId="sum-reputation" />
          <p className="text-xs text-[var(--muted)] mt-3 flex gap-1"><CheckCircle2 size={14} className="shrink-0" />Keputusan wang dikira di mesin tunai; keputusan makanan dikira semasa menghidang.</p>
        </Box>
      </div>
      {unlockNote && !save.bankrupt && <p className="mt-8 text-sm font-semibold bg-[#fff1cf] border-2 border-[var(--mustard-dark)] rounded-xl px-4 py-2 inline-block" data-testid="unlock-note">Hari {save.day}: {unlockNote}</p>}
      <div className="flex gap-3 mt-6 flex-wrap">
        {save.bankrupt
          ? <button data-testid="summary-restart-business" className="rb-btn rb-red text-lg px-8" onClick={onRestartBusiness}>Mula Semula Perniagaan</button>
          : <button data-testid="summary-next-day" className="rb-btn rb-red text-lg px-8" onClick={onNext}>Teruskan ke Hari {save.day}</button>}
        <button data-testid="summary-menu" className="rb-btn rb-white text-lg" onClick={onMenu}>Menu Utama</button>
      </div>
    </div>
  );
}
