import { Page } from "./InfoScreens";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";

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

const VolumeControl = ({ label, value, onChange, testId, disabled = false }) => (
  <div className="rb-card p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <p className="rb-display text-xl font-extrabold">{label}</p>
      <span className="text-sm font-semibold tabular-nums" aria-live="polite">{value}%</span>
    </div>
    <Slider
      min={0}
      max={100}
      step={1}
      value={[value]}
      onValueChange={([next]) => onChange(next)}
      disabled={disabled}
      data-testid={testId}
      aria-label={label}
    />
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
        <VolumeControl label="Kelantangan kesan bunyi permainan" value={settings.volume} onChange={set("volume")} testId="setting-volume" />
        <Toggle label="Muzik latar" desc="Muzik bermula selepas interaksi pertama dengan permainan." testId="setting-music-enabled" checked={settings.musicEnabled} onChange={set("musicEnabled")} />
        <VolumeControl label="Kelantangan muzik" value={settings.musicVolume} onChange={set("musicVolume")} testId="setting-music-volume" disabled={!settings.musicEnabled} />
        <Group label="Saiz teks" testId="setting-text-size" value={settings.textSize} onChange={set("textSize")}
          options={[["normal", "Biasa"], ["large", "Besar"], ["xlarge", "Sangat besar"]]} />
        <Toggle label="Kurangkan gerakan" desc="Mematikan kebanyakan animasi." testId="setting-reduced-motion" checked={settings.reducedMotion} onChange={set("reducedMotion")} />
        <Toggle label="Kontras tinggi" desc="Warna lebih jelas dan sempadan lebih tebal." testId="setting-high-contrast" checked={settings.highContrast} onChange={set("highContrast")} />
      </div>
    </Page>
  );
}
