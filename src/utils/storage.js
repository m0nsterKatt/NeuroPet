const LOGS_KEY = "neuropet_logs";
const ENERGY_KEY = "neuropet_energy";
const SETTINGS_KEY = "neuropet_settings";

export function getLogs() {
  const logs = localStorage.getItem(LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
}

export function getEnergy() {
  const energy = localStorage.getItem(ENERGY_KEY);
  return energy !== null ? Number(energy) : 100;
}

export function setEnergy(value) {
  const safeValue = Math.max(0, Math.min(100, value));
  localStorage.setItem(ENERGY_KEY, String(safeValue));
  return safeValue;
}

export function saveLog(newLog) {
  const logs = getLogs();
  const updatedLogs = [newLog, ...logs];
  localStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));

  const currentEnergy = getEnergy();
  const newEnergy = setEnergy(currentEnergy + newLog.impact);

  return {
    logs: updatedLogs,
    energy: newEnergy,
  };
}

export function getSettings() {
  const settings = localStorage.getItem(SETTINGS_KEY);

  return settings
    ? JSON.parse(settings)
    : {
        autoRecovery: false,
        showExactEnergy: true,
        autoOpenHelp: false,
      };
}

export function saveSettings(newSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
}

export function clearLogs() {
  localStorage.removeItem(LOGS_KEY);
}

export function resetAppData() {
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(ENERGY_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}