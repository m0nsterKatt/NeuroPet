import { calculateNewEnergy } from "../services/energyService";

import {
  saveEnergyToCloud,
} from "../services/energyApi";

import {
  saveLogToCloud,
  clearLogsFromCloud,
} from "../services/logsApi";

const LOGS_KEY = "neuropet_logs";
const ENERGY_KEY = "neuropet_energy";
const SETTINGS_KEY = "neuropet_settings";
const SELECTED_CATEGORY_KEY =
  "neuropet_selected_category";

export function getLogs() {
  const logs = localStorage.getItem(LOGS_KEY);

  return logs ? JSON.parse(logs) : [];
}

export function getEnergy() {
  const energy = localStorage.getItem(ENERGY_KEY);

  return energy !== null
    ? Number(energy)
    : 100;
}

export function setEnergy(value) {
  const safeValue = calculateNewEnergy(
    0,
    value
  );

  localStorage.setItem(
    ENERGY_KEY,
    String(safeValue)
  );

  saveEnergyToCloud(safeValue);

  return safeValue;
}

export function saveLog(newLog) {
  const logs = getLogs();

  const updatedLogs = [
    newLog,
    ...logs,
  ];

  localStorage.setItem(
    LOGS_KEY,
    JSON.stringify(updatedLogs)
  );

saveLogToCloud(newLog).then((error) => {
  console.log("Error guardando log:", error);
});

  const currentEnergy = getEnergy();

  const newEnergy = setEnergy(
    calculateNewEnergy(
      currentEnergy,
      newLog.impact
    )
  );

  return {
    logs: updatedLogs,
    energy: newEnergy,
  };
}

export function getSettings() {
  const settings = localStorage.getItem(
    SETTINGS_KEY
  );

  return settings
    ? JSON.parse(settings)
    : {
        autoRecovery: false,
        showExactEnergy: true,
        autoOpenHelp: false,
        breathingCycles: 5,
      };
}

export function saveSettings(newSettings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(newSettings)
  );
}

export function getSelectedCategory() {
  const category = localStorage.getItem(
    SELECTED_CATEGORY_KEY
  );

  return category
    ? JSON.parse(category)
    : null;
}

export function saveSelectedCategory(
  category
) {
  localStorage.setItem(
    SELECTED_CATEGORY_KEY,
    JSON.stringify(category)
  );
}

export function clearLogs() {
  localStorage.removeItem(LOGS_KEY);

  clearLogsFromCloud();
}

export function resetAppData() {
  localStorage.removeItem(LOGS_KEY);

  localStorage.removeItem(
    ENERGY_KEY
  );

  localStorage.removeItem(
    SETTINGS_KEY
  );

  localStorage.removeItem(
    SELECTED_CATEGORY_KEY
  );

  clearLogsFromCloud();
}