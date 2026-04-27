import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSettings,
  saveSettings,
  clearLogs,
  resetAppData,
} from "../utils/storage";

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    autoRecovery: false,
    showExactEnergy: true,
    autoOpenHelp: false,
    breathingCycles: 5,
  });

  useEffect(() => {
    const saved = getSettings();

    setSettings({
      autoRecovery: saved.autoRecovery ?? false,
      showExactEnergy: saved.showExactEnergy ?? true,
      autoOpenHelp: saved.autoOpenHelp ?? false,
      breathingCycles: saved.breathingCycles ?? 5,
    });
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

  const handleSave = () => {
    saveSettings(settings);
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
    <main
      style={{
        paddingTop: "5rem",
        padding: "1.5rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <button onClick={() => navigate("/")} className="back-button">
        ← Inicio
      </button>

      <h1
        style={{
          background: "#d8f3dc",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "6rem",
          padding: "1rem",
          borderRadius: "12px",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
          color: "#2d6a4f",
        }}
      >
        Configuración
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <div
          style={{
            background: "#edfeff",
            border: "1px solid #0cc0d0",
            borderRadius: "14px",
            padding: "1rem",
          }}
        >
          <h2 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
            Recuperación automática
          </h2>

          <label style={{ display: "flex", gap: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.autoRecovery}
              onChange={() => handleChange("autoRecovery")}
            />
            Activar recuperación automática de energía
          </label>

          <p style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>
            Recupera 5% de energía por hora.
          </p>
        </div>

        <div
          style={{
            background: "#edfeff",
            border: "1px solid #0cc0d0",
            borderRadius: "14px",
            padding: "1rem",
          }}
        >
          <h2 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
            Visualización
          </h2>

          <label style={{ display: "flex", gap: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.showExactEnergy}
              onChange={() => handleChange("showExactEnergy")}
            />
            Mostrar porcentaje exacto de energía
          </label>
        </div>

        <div
          style={{
            background: "#edfeff",
            border: "1px solid #0cc0d0",
            borderRadius: "14px",
            padding: "1rem",
          }}
        >
          <h2 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
            Ayuda automática
          </h2>

          <label style={{ display: "flex", gap: "0.6rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={settings.autoOpenHelp}
              onChange={() => handleChange("autoOpenHelp")}
            />
            Abrir ayuda automáticamente al llegar a 0%
          </label>
        </div>

        <div
          style={{
            background: "#edfeff",
            border: "1px solid #0cc0d0",
            borderRadius: "14px",
            padding: "1rem",
          }}
        >
          <h2 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
            Respiración
          </h2>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            Ciclos de respiración

            <select
              value={settings.breathingCycles}
              onChange={(e) => handleCyclesChange(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "10px",
                border: "1px solid #0cc0d0",
                cursor: "pointer",
              }}
            >
              <option value="3">3 ciclos (rápido)</option>
              <option value="5">5 ciclos (recomendado)</option>
              <option value="10">10 ciclos (profundo)</option>
            </select>
          </label>
        </div>

        <div
          style={{
            background: "#edfeff",
            border: "1px solid #0cc0d0",
            borderRadius: "14px",
            padding: "1rem",
          }}
        >
          <h2 style={{ margin: "0 0 0.75rem 0", fontSize: "1.1rem" }}>
            Historial
          </h2>

          <p style={{ fontSize: "0.95rem" }}>
            Guarda actividades, energía y duración.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button
              onClick={() => navigate("/history")}
              style={{
                background: "#d9f99d",
                borderRadius: "12px",
                padding: "0.6rem 1rem",
                cursor: "pointer",
              }}
            >
              Ver historial
            </button>

            <button
              onClick={handleClearHistory}
              style={{
                background: "#fee2e2",
                borderRadius: "12px",
                padding: "0.6rem 1rem",
                cursor: "pointer",
              }}
            >
              Borrar historial
            </button>
          </div>
        </div>

        <div
          style={{
            background: "#fff1f2",
            border: "1px solid #fda4af",
            borderRadius: "14px",
            padding: "1rem",
          }}
        >
          <h2 style={{ color: "#9f1239" }}>Borrar todo</h2>

          <button
            onClick={handleClearAll}
            style={{
              background: "#fda4af",
              borderRadius: "12px",
              padding: "0.6rem 1rem",
              cursor: "pointer",
              color: "#410000",
            }}
          >
            Resetear app
          </button>
        </div>

        <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "0.5rem",
  }}
>
  <button
    onClick={handleSave}
    style={{
      background: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: "12px",
      padding: "0.6rem 1rem",
      cursor: "pointer",
      fontWeight: "600",
      width: "auto",
    }}
  >
    Guardar
  </button>
</div>
      </div>
    </main>
  );
}