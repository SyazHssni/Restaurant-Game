import { useCallback, useEffect, useState } from "react";
import "@/App.css";
import MainMenu from "./screens/MainMenu";
import ShiftScreen from "./screens/ShiftScreen";
import SummaryScreen from "./screens/SummaryScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { HowToPlay, Credits, MenuScreen } from "./screens/InfoScreens";
import { loadSave, writeSave, newSave, loadSettings, writeSettings } from "./game/storage";
import { buildSummary } from "./game/summary";
import { UNLOCK_NOTES } from "./game/config";

const FONT = { normal: "16px", large: "18px", xlarge: "20px" };

function App() {
  const [screen, setScreen] = useState("menu");
  const [save, setSave] = useState(loadSave);
  const [settings, setSettings] = useState(loadSettings);
  const [summary, setSummary] = useState(null);
  const [run, setRun] = useState(null);

  useEffect(() => {
    const h = document.documentElement;
    h.style.fontSize = FONT[settings.textSize];
    h.classList.toggle("hc", settings.highContrast);
    h.classList.toggle("rm", settings.reducedMotion);
  }, [settings]);

  const persist = (s) => { writeSave(s); setSave(s); };
  const start = (s, tutorial) => { setRun({ key: Date.now(), tutorial }); setScreen("shift"); persist(s); };
  const onNew = () => { const s = newSave(save); s.tutorialDone = false; start(s, true); };
  const restartBusiness = () => { persist(newSave(save)); setScreen("menu"); };
  const onTutorialDone = useCallback(() => {
    setSave((prev) => { const s = { ...prev, tutorialDone: true }; writeSave(s); return s; });
  }, []);

  const onEnd = useCallback((st) => {
    const sum = buildSummary(st);
    setSave((prev) => {
      const insolvent = sum.fundsAfter <= 0 ? prev.insolventShifts + 1 : 0;
      const next = {
        ...prev, day: prev.day + 1, funds: sum.fundsAfter, reputation: sum.repAfter, insolventShifts: insolvent, bankrupt: insolvent >= 2,
        bestStreak: Math.max(prev.bestStreak, sum.bestStreak),
        history: [...prev.history, { day: sum.day, net: sum.net, served: sum.served, mathScore: sum.mathScore }].slice(-40),
      };
      writeSave(next);
      return next;
    });
    setSummary(sum);
    setScreen("summary");
  }, []);

  const updateSettings = (s) => { setSettings(s); writeSettings(s); };
  const back = () => setScreen("menu");

  return (
    <div className="rb-app">
      {screen === "menu" && <MainMenu save={save} onNew={onNew} onContinue={() => start(save, !save.tutorialDone && save.day === 1)} onRestartBusiness={restartBusiness} go={setScreen} />}
      {screen === "howto" && <HowToPlay onBack={back} onReplayTutorial={() => start(save && !save.bankrupt ? save : newSave(save), true)} />}
      {screen === "settings" && <SettingsScreen settings={settings} onChange={updateSettings} onBack={back} />}
      {screen === "credits" && <Credits onBack={back} />}
      {screen === "menubook" && <MenuScreen onBack={back} />}
      {screen === "shift" && save && (
        <ShiftScreen key={run.key} save={save} settings={settings} tutorial={run.tutorial} onEnd={onEnd} onQuit={back} onTutorialDone={onTutorialDone} />
      )}
      {screen === "summary" && summary && (
        <>
          <SummaryScreen sum={summary} save={save} unlockNote={UNLOCK_NOTES[save.day]} onNext={() => start(save, false)} onMenu={back} onRestartBusiness={restartBusiness} />
        </>
      )}
    </div>
  );
}

export default App;
