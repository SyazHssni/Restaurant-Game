import { Page } from "./InfoScreens";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";

const Group = ({ label, desc, options, value, onChange, testId }) => (
  <div className="rb-card p-5">
    <p className="rb-display text-xl font-extrabold">{label}</p>
    {desc && <p className="text-sm text-[var(--muted)] mb-3">{desc}</p>}
    <div className="flex gap-2 flex-wrap" data-testid={testId}>
      {options.map(([v, l]) => (
        <button key={v} data-testid={`${testId}-${v}`} className={`rb-btn text-sm ${value === v ? "rb-dark" : "rb-white"}`} onClick={() => onChange(v)}>{l}</button>
      ))}
    </div>
  </div>
);

const Toggle = ({ label, desc, checked, onChange, testId }) => (
  <div className="rb-card p-5 flex items-center justify-between gap-4">
    <div><p className="rb-display text-xl font-extrabold">{label}</p><p className="text-sm text-[var(--muted)]">{desc}</p></div>
    <Switch data-testid={testId} checked={checked} onCheckedChange={onChange} />
  </div>
);

export default function SettingsScreen({ settings, onChange, onBack }) {
  const set = (k) => (v) => onChange({ ...settings, [k]: v });
  return (
    <Page title="Tetapan" onBack={onBack} testId="settings-screen">
      <div className="grid md:grid-cols-2 gap-4">
        <Group label="Tahap matematik" desc="Berkuat kuasa pada syif seterusnya." testId="setting-math-mode" value={settings.mathMode} onChange={set("mathMode")}
          options={[["guided", "Berpandu"], ["mental", "Matematik Mental"], ["challenge", "Cabaran"]]} />
        <Group label="Kesukaran masa" desc="Mengubah kesabaran pelanggan dan panjang syif." testId="setting-timer" value={settings.timerDifficulty} onChange={set("timerDifficulty")}
          options={[["santai", "Santai"], ["biasa", "Biasa"], ["sukar", "Sukar"]]} />
        <div className="rb-card p-5">
          <p className="rb-display text-xl font-extrabold">Kelantangan: {settings.volume}%</p>
          <Slider data-testid="setting-volume" className="mt-4" value={[settings.volume]} max={100} step={5} onValueChange={([v]) => set("volume")(v)} />
        </div>
        <Group label="Saiz teks" testId="setting-text-size" value={settings.textSize} onChange={set("textSize")}
          options={[["normal", "Biasa"], ["large", "Besar"], ["xlarge", "Sangat besar"]]} />
        <Toggle label="Kurangkan gerakan" desc="Mematikan kebanyakan animasi." testId="setting-reduced-motion" checked={settings.reducedMotion} onChange={set("reducedMotion")} />
        <Toggle label="Kontras tinggi" desc="Warna lebih jelas dan sempadan lebih tebal." testId="setting-high-contrast" checked={settings.highContrast} onChange={set("highContrast")} />
      </div>
    </Page>
  );
}
