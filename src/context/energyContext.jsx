import { createContext, useContext, useEffect, useState } from "react";
import { calculateNewEnergy } from "../services/energyService";
import {
  loadEnergyStateFromCloud,
  saveEnergyStateToCloud,
} from "../services/energyApi";
import {
  saveLogToCloud,
  loadLogsFromCloud,
  clearLogsFromCloud,
} from "../services/logsApi";
import {
  loadSettingsFromCloud,
  saveSettingsToCloud,
  getDefaultSettings,
} from "../services/settingsApi";

const EnergyContext = createContext();

export function EnergyProvider({ children }) {
  const [energy, setEnergyState] = useState(100);
  const [logs, setLogs] = useState([]);
  const [settings, setSettingsState] = useState(getDefaultSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);

      const cloudSettings = await loadSettingsFromCloud();
      const cloudEnergy = await loadEnergyStateFromCloud();
      const cloudLogs = await loadLogsFromCloud();

      setSettingsState(cloudSettings);
      setLogs(cloudLogs);

      if (cloudEnergy) {
        const recoveredEnergy = applyAutoRecovery(
          cloudEnergy.energy,
          cloudEnergy.last_recovery_at,
          cloudSettings.autoRecovery
        );

        setEnergyState(recoveredEnergy);

        if (recoveredEnergy !== cloudEnergy.energy) {
          await saveEnergyStateToCloud(
            recoveredEnergy,
            new Date().toISOString()
          );
        }
      } else {
        setEnergyState(100);
        await saveEnergyStateToCloud(100, new Date().toISOString());
      }

      setLoading(false);
    }

    loadInitialData();
  }, []);

  function applyAutoRecovery(currentEnergy, lastRecoveryAt, autoRecovery) {
    if (!autoRecovery || !lastRecoveryAt) return currentEnergy;

    const lastDate = new Date(lastRecoveryAt);
    const now = new Date();

    const hoursPassed = Math.floor((now - lastDate) / (1000 * 60 * 60));

    if (hoursPassed <= 0) return currentEnergy;

    const recoveredEnergy = currentEnergy + hoursPassed * 5;

    return Math.min(recoveredEnergy, 100);
  }

  async function updateEnergy(value) {
    const safeEnergy = calculateNewEnergy(0, value);

    setEnergyState(safeEnergy);
    await saveEnergyStateToCloud(safeEnergy, new Date().toISOString());

    return safeEnergy;
  }

  async function addLog(newLog) {
    const savedLog = await saveLogToCloud(newLog);

    if (!savedLog) return null;

    const newEnergy = calculateNewEnergy(energy, newLog.impact);

    setLogs((prevLogs) => [savedLog, ...prevLogs]);
    setEnergyState(newEnergy);

    await saveEnergyStateToCloud(newEnergy, new Date().toISOString());

    return {
      log: savedLog,
      energy: newEnergy,
    };
  }

  async function updateSettings(newSettings) {
    setSettingsState(newSettings);
    await saveSettingsToCloud(newSettings);
  }

  async function clearLogs() {
    await clearLogsFromCloud();
    setLogs([]);
  }

  const value = {
    energy,
    logs,
    settings,
    loading,
    setEnergy: updateEnergy,
    addLog,
    updateSettings,
    clearLogs,
  };

  return (
    <EnergyContext.Provider value={value}>
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const context = useContext(EnergyContext);

  if (!context) {
    throw new Error("useEnergy debe usarse dentro de EnergyProvider");
  }

  return context;
}