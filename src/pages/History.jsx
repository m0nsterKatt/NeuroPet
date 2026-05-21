import { useNavigate } from "react-router-dom";
import { useEnergy } from "../context/energyContext";

import "../assets/styles/History.css";

export default function History() {
  const navigate = useNavigate();
  const { logs, loading } = useEnergy();

  return (
    <main className="history-page">

      <div className="history-top">
        <button
          onClick={() => navigate("/settings")}
          className="back-button"
        >
          ← Configuración
        </button>
      </div>

      <div className="history-center">

        <div className="history-panel">

          <h1 className="history-title">
            Historial
          </h1>

          <div className="history-list">
            {loading ? (
              <div className="history-card">
                Cargando historial...
              </div>
            ) : logs.length === 0 ? (
              <div className="history-card">
                No hay actividades guardadas todavía.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={log.id ?? index}
                  className="history-card"
                >
                  <div className="history-activity">
                    {log.emoji
                      ? `${log.emoji} — ${log.activity}`
                      : log.activity}
                  </div>

                  <div className="history-detail">
                    Categoría: {log.category || "Sin categoría"}
                  </div>

                  <div className="history-detail">
                    Duración: {log.duration ?? 0} h
                  </div>

                  <div className="history-detail">
                    Impacto: {log.impact > 0 ? "+" : ""}
                    {log.impact}%
                  </div>

                  <div className="history-detail">
                    Fecha: {log.date || "Sin fecha"}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </main>
  );
}