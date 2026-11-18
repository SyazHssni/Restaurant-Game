import { ArrowLeft, Gamepad2, Sparkles } from "lucide-react";
import { MenuList } from "../components/game/MenuBook";

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
  ["5. Masak", "Gril: letak patty, terbalikkan dalam jalur hijau, angkat bila 'Sedia'. Penggoreng: angkat kentang atau kepingan ayam sebelum hangus. Pemasangan: bina burger lapis demi lapis ikut senarai semak. Minuman: baca pesanan pelanggan (jenis, saiz, suhu, kuantiti), pilih konfigurasi yang sama dalam Penyediaan Minuman, tekan Sediakan dan Sahkan Penyediaan. Sistem menyemak setiap cawan."],
  ["Buku Menu & stok", "Lebih 100 menu burger dibina daripada sembilan bahan. Buka Buku Menu ketika syif untuk melihat bahan setiap burger dan stok semasa. Burger yang bahannya habis tidak akan dipesan sehingga stok dikemas kini (Pesan +10)."],
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

export function MenuScreen({ onBack }) {
  return (
    <Page title="Menu Burger" onBack={onBack} testId="menu-screen">
      <p className="text-sm text-[var(--muted)] mb-4 max-w-2xl">Semua menu dibina daripada sembilan bahan sahaja: Roti Bawah, Sos Istimewa, Patty Daging, Patty Sayur, Keju, Salad, Tomato, Jeruk dan Roti Atas. Setiap menu mempunyai kombinasi bahan yang berbeza.</p>
      <MenuList />
    </Page>
  );
}

export function Credits({ onBack }) {
  return (
    <Page title="Kredit" onBack={onBack} testId="credits-screen">
      <div className="max-w-3xl space-y-5">
        <section className="rb-card relative overflow-hidden border-[var(--mustard-dark)] bg-gradient-to-br from-[#fffaf0] via-white to-[#ffe7a6] p-5 sm:p-8" data-testid="creator-credit-card">
          <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--mustard)] opacity-20" />
          <div aria-hidden="true" className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[var(--tomato)] opacity-10" />
          <div className="relative grid items-center gap-7 sm:grid-cols-[190px_minmax(0,1fr)]">
            <div className="relative mx-auto h-44 w-44">
              <div aria-hidden="true" className="absolute -inset-2 rounded-full border-4 border-dashed border-[var(--mustard-dark)]" />
              <img
                src={`${process.env.PUBLIC_URL}/credits/syazwan-husaini.jpg`}
                alt="Potret Syazwan Husaini bin Suhaimi, pencipta Max Burger’s"
                className="relative h-full w-full rounded-full border-4 border-[var(--charcoal)] object-cover shadow-lg"
                style={{ objectPosition: "center 38%" }}
                width="500"
                height="889"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--charcoal)] bg-[var(--mustard)] px-3 py-1 text-xs font-extrabold tracking-[0.16em]">
                <Sparkles size={15} aria-hidden="true" /> KREDIT PENCIPTA
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--muted)]">Dihasilkan oleh saya</p>
              <h2 className="rb-display mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">SYAZWAN HUSAINI BIN SUHAIMI</h2>
              <p className="mt-4 text-sm font-semibold text-[var(--muted)]">Dengan bantuan AI</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full border-2 border-[var(--lettuce-dark)] bg-[#e5f4dc] px-4 py-1.5 font-bold">@emergent</span>
                <span className="rounded-full border-2 border-[var(--charcoal)] bg-white px-4 py-1.5 font-bold">@Chat GPT</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rb-card flex items-start gap-4 p-5 sm:p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--charcoal)] bg-[var(--tomato)] text-white">
            <Gamepad2 size={22} aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="rb-display text-xl font-extrabold">Max Burger’s: Kedai Burger Matematik</p>
            <p className="text-sm leading-relaxed">Permainan ini dibangunkan khas untuk membantu murid berlatih operasi gabungan melibatkan wang sambil bermain. Reka bentuk, ilustrasi dan kesan bunyi dihasilkan khas untuk permainan ini. Semua nama pelanggan, menu dan harga yang digunakan hanyalah rekaan.</p>
            <p className="text-xs text-[var(--muted)]">Kemajuan permainan disimpan secara automatik pada peranti ini sahaja.</p>
          </div>
        </section>
      </div>
    </Page>
  );
}
