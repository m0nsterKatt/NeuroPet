import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  getProfile,
  signOut,
  createProfileIfMissing,
} from "../services/authService";

import { useEnergy } from "../context/energyContext";

import "../assets/styles/Settings.css";

const DEFAULT_SETTINGS = {
  autoRecovery: false,
  showExactEnergy: true,
  autoOpenHelp: false,
  breathingCycles: 5,
  darkMode: false,
};

export default function Settings() {
  const navigate = useNavigate();

  const {
    settings: cloudSettings,
    updateSettings,
    clearLogs,
  } = useEnergy();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    async function loadUserData() {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      if (currentUser) {
        const { data } = await getProfile(currentUser.id);

        if (data) {
          setProfile(data);
        } else {
          const createdProfile =
            await createProfileIfMissing(
              currentUser.id,
              currentUser.email
            );

          setProfile(createdProfile.data);
        }
      }
    }

    loadUserData();
  }, []);

  useEffect(() => {
    setSettings({
      autoRecovery:
        cloudSettings?.autoRecovery ?? false,

      showExactEnergy:
        cloudSettings?.showExactEnergy ?? true,

      autoOpenHelp:
        cloudSettings?.autoOpenHelp ?? false,

      breathingCycles:
        cloudSettings?.breathingCycles ?? 5,

      darkMode:
        cloudSettings?.darkMode ?? false,
    });
  }, [cloudSettings]);

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [settings.darkMode]);

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
    await updateSettings(settings);

    alert("Configuración guardada");
  };

  const handleClearHistory = async () => {
    await clearLogs();

    alert("Historial borrado");
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "¿Seguro que quieres borrar todos los datos? Por ahora se borrará el historial, pero no la cuenta."
    );

    if (!confirmed) return;

    await clearLogs();

    await updateSettings(DEFAULT_SETTINGS);

    setSettings(DEFAULT_SETTINGS);

    document.body.classList.remove("dark-mode");

    alert("Datos reiniciados");

    navigate("/");
  };

  return (
    <main className="settings-page">

      <div className="settings-top">
        <button
          onClick={() => navigate("/")}
          className="back-button"
        >
          ← Inicio
        </button>
      </div>

      <div className="settings-center">

        <div className="settings-panel">

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

                    navigate("/login");
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

            <SettingCard title="Apariencia">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() =>
                    handleChange("darkMode")
                  }
                />

                <span>
                  Activar tema oscuro
                </span>
              </label>

              <p className="settings-description">
                Reduce la fatiga visual y la
                sobrecarga sensorial.
              </p>
            </SettingCard>

            <SettingCard title="Recuperación automática">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={settings.autoRecovery}
                  onChange={() =>
                    handleChange("autoRecovery")
                  }
                />

                <span>
                  Activar recuperación automática
                  de energía
                </span>
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
                  onChange={() =>
                    handleChange("showExactEnergy")
                  }
                />

                <span>
                  Mostrar porcentaje exacto de
                  energía
                </span>
              </label>
            </SettingCard>

            <SettingCard title="Ayuda automática">
              <label className="settings-label">
                <input
                  type="checkbox"
                  checked={settings.autoOpenHelp}
                  onChange={() =>
                    handleChange("autoOpenHelp")
                  }
                />

                <span>
                  Abrir ayuda automáticamente al
                  llegar a 0%
                </span>
              </label>
            </SettingCard>

            <SettingCard title="Respiración">
              <label className="settings-select-label">
                Ciclos de respiración

                <select
                  value={settings.breathingCycles}
                  onChange={(e) =>
                    handleCyclesChange(
                      e.target.value
                    )
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
                Guarda actividades, energía y
                duración.
              </p>

              <div className="history-buttons">
                <button
                  onClick={() =>
                    navigate("/history")
                  }
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