import { useNavigate } from "react-router-dom";
import { getLogs } from "../utils/storage";

export default function History() {
  const navigate = useNavigate();
  const logs = getLogs();

  return (
    <main
      style={{
        paddingTop: "5rem",
        padding: "1.5rem",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/settings")}
        className="back-button"
      >
        ← Configuración
      </button>

      <h1
        style={{
          background: "#d9f99d",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "6rem",
          padding: "1rem",
          borderRadius: "12px",
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Historial
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginTop: "1.5rem",
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              background: "#edfeff",
              border: "1px solid #0cc0d0",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            No hay actividades guardadas todavía.
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                background: "#edfeff",
                border: "1px solid #0cc0d0",
                borderRadius: "14px",
                padding: "1rem",
              }}
            >
              <div style={{ fontWeight: "700", marginBottom: "0.4rem" }}>
                {log.emoji ? `${log.emoji} — ${log.activity}` : log.activity}
              </div>

              <div style={{ fontSize: "0.95rem", color: "#444" }}>
                Duración: {log.duration ?? 0} h
              </div>

              <div style={{ fontSize: "0.95rem", color: "#444" }}>
                Impacto: {log.impact > 0 ? "+" : ""}
                {log.impact}%
              </div>

              <div style={{ fontSize: "0.95rem", color: "#444" }}>
                Fecha: {log.date || "Sin fecha"}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}