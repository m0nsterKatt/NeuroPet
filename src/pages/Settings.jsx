import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  getProfile,
  signOut,
} from "../services/authService";

import {
  getSettings,
  saveSettings,
  clearLogs,
  resetAppData,
} from "../utils/storage";

import {
  loadSettingsFromCloud,
  saveSettingsToCloud,
} from "../services/settingsApi";

import "../assets/styles/Settings.css";

const DEFAULT_SETTINGS = {
  autoRecovery: false,
  showExactEnergy: true,
  autoOpenHelp: false,
  breathingCycles: 5,
};

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    async function loadData() {
      const savedLocal = getSettings();

      setSettings({
        autoRecovery: savedLocal.autoRecovery ?? false,
        showExactEnergy: savedLocal.showExactEnergy ?? true,
        autoOpenHelp: savedLocal.autoOpenHelp ?? false,
        breathingCycles: savedLocal.breathingCycles ?? 5,
      });

      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const { data } = await getProfile(currentUser.id);
        setProfile(data);

        const cloudSettings = await loadSettingsFromCloud();

        if (cloudSettings) {
          setSettings(cloudSettings);
          saveSettings(cloudSettings);
        }
      }
    }

    loadData();
  }, []);

  const handleChange = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCyclesChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      breathingCycles: Number(value),
    }));
  };

  const handleSave = async () => {
    saveSettings(settings);

    const error = await saveSettingsToCloud(settings);

    if (error) {
      alert("Configuración guardada solo en este dispositivo");
      return;
    }

    alert("Configuración guardada");
  };

  const handleClearHistory = () => {
    clearLogs();
    alert("Historial borrado");
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "¿Seguro que quieres borrar todos los datos?"
    );

    if (!confirmed) return;

    resetAppData();
    setSettings(getSettings());

    alert("Todos los datos han sido borrados");
    navigate("/");
  };

  return (
    <main className="settings-page">
      <button
        onClick={() => navigate("/")}
        className="back-button"
      >
        ← Inicio
      </button>

      <h1 className="settings-title">
        Configuración
      </h1>

      <div className="settings-container">
        <div className="profile-card">
          <img
            src="/images/avatar_stock.webp"
            alt="avatar usuario"
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2 className="profile-name">
              {user
                ? profile?.username || user.email
                : "Sesión"}
            </h2>

            <p className="profile-status">
              {user
                ? "Sesión iniciada"
                : "No has iniciado sesión"}
            </p>
          </div>

          {user ? (
            <button
              onClick={async () => {
                await signOut();
                setUser(null);
                setProfile(null);
              }}
              className="logout-button"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="login-button"
            >
              Iniciar sesión
            </button>
          )}
        </div>

        <SettingCard title="Recuperación automática">
          <label className="settings-label">
            <input
              type="checkbox"
              checked={settings.autoRecovery}
              onChange={() => handleChange("autoRecovery")}
            />
            Activar recuperación automática de energía
          </label>

          <p className="settings-description">
            Recupera 5% de energía por hora.
          </p>
        </SettingCard>

        <SettingCard title="Visualización">
          <label className="settings-label">
            <input
              type="checkbox"
              checked={settings.showExactEnergy}
              onChange={() => handleChange("showExactEnergy")}
            />
            Mostrar porcentaje exacto de energía
          </label>
        </SettingCard>

        <SettingCard title="Ayuda automática">
          <label className="settings-label">
            <input
              type="checkbox"
              checked={settings.autoOpenHelp}
              onChange={() => handleChange("autoOpenHelp")}
            />
            Abrir ayuda automáticamente al llegar a 0%
          </label>
        </SettingCard>

        <SettingCard title="Respiración">
          <label className="settings-select-label">
            Ciclos de respiración

            <select
              value={settings.breathingCycles}
              onChange={(e) =>
                handleCyclesChange(e.target.value)
              }
              className="settings-select"
            >
              <option value="3">
                3 ciclos (rápido)
              </option>

              <option value="5">
                5 ciclos (recomendado)
              </option>

              <option value="10">
                10 ciclos (profundo)
              </option>
            </select>
          </label>
        </SettingCard>

        <SettingCard title="Historial">
          <p className="settings-description">
            Guarda actividades, energía y duración.
          </p>

          <div className="history-buttons">
            <button
              onClick={() => navigate("/history")}
              className="history-button"
            >
              Ver historial
            </button>

            <button
              onClick={handleClearHistory}
              className="danger-button"
            >
              Borrar historial
            </button>
          </div>
        </SettingCard>

        <div className="reset-card">
          <h2 className="reset-title">
            Borrar todo
          </h2>

          <button
            onClick={handleClearAll}
            className="reset-button"
          >
            Resetear app
          </button>
        </div>

        <div className="save-container">
          <button
            onClick={handleSave}
            className="save-settings-button"
          >
            Guardar
          </button>
        </div>
      </div>
    </main>
  );
}

function SettingCard({ title, children }) {
  return (
    <div className="setting-card">
      <h2 className="setting-card-title">
        {title}
      </h2>

      {children}
    </div>
  );
}