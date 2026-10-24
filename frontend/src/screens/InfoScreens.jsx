import { ArrowLeft } from "lucide-react";

export const Page = ({ title, onBack, children, testId }) => (
  <div className="min-h-screen max-w-5xl mx-auto px-6 md:px-12 py-10" data-testid={testId}>
    <button data-testid="back-button" className="rb-btn rb-white flex items-center gap-1 mb-6" onClick={onBack}><ArrowLeft size={16} />Kembali</button>
    <h1 className="rb-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-8">{title}</h1>
    {children}
  </div>
);

const SECTIONS = [
  ["1. Ambil pesanan", "Klik pelanggan dalam barisan dan tekan 'Ambil Pesanan'. Tiket muncul di Rel Tiket dengan harga seunit dan kuantiti setiap item. Pelanggan akan beredar jika menunggu terlalu lama."],
  ["2. Kira jumlah bil", "Di Mesin Tunai, darab harga seunit dengan kuantiti bagi setiap baris, tambah semua baris dan tolak diskaun jika ada. Taip jawapan pada pad nombor. Pad itu hanya merekod jawapan — ia tidak mengira untuk anda."],
  ["3. Kira dan beri baki", "Baki = wang dibayar − jumlah bil. Pilih not RM100, RM50, RM20, RM10, RM5, RM1 dan syiling 50 sen, 20 sen, 10 sen. Gunakan 'Kira Semula' untuk mengira dulang, kemudian tekan 'Beri Baki'. Jika pelanggan bayar tepat, tekan 'Bayaran Tepat — Sahkan RM0.00'."],
  ["4. Akibat kesilapan", "Bil salah: kesabaran pelanggan berkurang dan skor matematik turun (wang tidak berubah). Baki terlebih: dicatat sebagai kekurangan tunai. Baki kurang: perbezaan dipulangkan dan penalti aduan RM2.00 dikenakan. Reputasi kedai turun. Jika dana kekal RM0.00 atau kurang selama dua syif, kedai muflis."],
  ["5. Masak", "Gril: letak patty, terbalikkan dalam jalur hijau, angkat bila 'Sedia'. Penggoreng: angkat kentang atau kepingan ayam sebelum hangus. Pemasangan: bina burger lapis demi lapis ikut senarai semak. Minuman: pilih saiz, perisa dan ais, kemudian berhenti mengisi dalam jalur hijau."],
  ["6. Bungkus dan hidang", "Di Pembungkusan, masukkan setiap item ke dalam beg dan tekan 'Hantar Pesanan'. Setiap pesanan dinilai pada ketepatan, kelajuan dan kualiti masakan untuk bintang dan tip."],
  ["Kekunci pintas", "1–7: tukar stesen · Nombor, titik, Backspace, Enter: pad bil di Mesin Tunai (gunakan Alt + nombor untuk tukar stesen ketika itu) · P atau Esc: jeda."],
  ["Tahap matematik", "Cabaran (lalai): jawapan tersembunyi, pesanan lebih besar, bayaran dengan beberapa not dan diskaun kecil. Matematik Mental: tanpa diskaun, bayaran satu not. Berpandu: jumlah setiap baris dan jumlah dalam dulang dipaparkan. Petunjuk sentiasa ada tetapi mengurangkan bonus."],
];

export function HowToPlay({ onBack, onReplayTutorial }) {
  return (
    <Page title="Cara Bermain" onBack={onBack} testId="how-to-play-screen">
      <div className="grid md:grid-cols-2 gap-4">
        {SECTIONS.map(([t, d], i) => (
          <div key={t} className="rb-card p-5 rb-rise" style={{ animationDelay: `${i * 0.04}s` }}>
            <p className="rb-display text-xl font-extrabold">{t}</p>
            <p className="text-sm mt-1 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
      <button data-testid="replay-tutorial-button" className="rb-btn rb-red text-lg mt-8" onClick={onReplayTutorial}>Main Semula Tutorial</button>
    </Page>
  );
}

export function Credits({ onBack }) {
  return (
    <Page title="Kredit" onBack={onBack} testId="credits-screen">
      <div className="rb-card p-6 space-y-3 max-w-2xl">
        <p><b>Rush Bite: Kedai Burger Matematik</b> — permainan pendidikan asli untuk latihan operasi gabungan melibatkan wang.</p>
        <p>Reka bentuk permainan, ilustrasi dan kesan bunyi dihasilkan khas untuk permainan ini. Semua nama pelanggan, menu dan harga adalah rekaan.</p>
        <p className="text-sm text-[var(--muted)]">Kemajuan disimpan dalam pelayar pada peranti ini sahaja.</p>
      </div>
    </Page>
  );
}
