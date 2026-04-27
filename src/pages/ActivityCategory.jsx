import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveLog } from "../utils/storage";

export default function ActivityCategory() {
  const navigate = useNavigate();

  const savedCategory = localStorage.getItem("neuropet_selected_category");
  const initialCategory = savedCategory ? JSON.parse(savedCategory) : null;

  const [category, setCategory] = useState(initialCategory);
  const [selected, setSelected] = useState(null);
  const [hours, setHours] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [newValue, setNewValue] = useState("");

  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityValue, setNewActivityValue] = useState("");

  if (!category) {
    return (
      <main style={{ padding: "1.5rem" }}>
        <button onClick={() => navigate("/activity")} className="back-button">
          ← Volver a categorías
        </button>
      </main>
    );
  }

  const handleSaveLog = () => {
    const duration = parseFloat(hours);

    if (!selected || Number.isNaN(duration) || duration <= 0) return;

    const impact = selected.value * duration;

    saveLog({
      category: category.name,
      activity: selected.name,
      emoji: selected.emoji,
      duration,
      impact,
      date: new Date().toLocaleString("es-ES"),
    });

    setShowModal(false);
    setSelected(null);
    setHours("");
    navigate("/");
  };

  const handleEditValue = (index) => {
    const parsed = parseFloat(newValue);

    if (Number.isNaN(parsed)) return;

    const updatedItems = [...category.items];
    updatedItems[index] = {
      ...updatedItems[index],
      value: parsed,
    };

    const updatedCategory = {
      ...category,
      items: updatedItems,
    };

    setCategory(updatedCategory);
    localStorage.setItem(
      "neuropet_selected_category",
      JSON.stringify(updatedCategory)
    );

    setEditingIndex(null);
    setNewValue("");
  };

  const handleAddActivity = () => {
    const parsed = parseFloat(newActivityValue);

    if (!newActivityName.trim() || Number.isNaN(parsed)) return;

    const updatedCategory = {
      ...category,
      items: [
        ...category.items,
        {
          name: newActivityName.trim(),
          emoji: "✨",
          value: parsed,
        },
      ],
    };

    setCategory(updatedCategory);
    localStorage.setItem(
      "neuropet_selected_category",
      JSON.stringify(updatedCategory)
    );

    setNewActivityName("");
    setNewActivityValue("");
  };

  return (
    <main
      style={{
        padding: "1.5rem",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <button onClick={() => navigate("/activity")} className="back-button">
        ← Volver a categorías
      </button>

      <h1
        style={{
          background: "#fcd5ce",
          textAlign: "center",
          fontWeight: "bold",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid #ff4c2d",
          margin: "6rem auto 1.5rem auto",
        }}
      >
        {category.name}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          marginTop: "1.5rem",
        }}
      >
        {category.items.map((item, index) => (
          <div key={item.name}>
            <div
              className="activity-item"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                background: "#edfeff",
                border: "1px solid #0cc0d0",
                padding: "0.9rem 1rem",
                borderRadius: "14px",
              }}
            >
              <div
                className="activity-info"
                onClick={() => {
                  setSelected(item);
                  setShowModal(true);
                }}
                style={{
                  flex: 1,
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "1rem",
                  lineHeight: 1.4,
                }}
              >
                {item.emoji} {item.name} ({item.value}%/h)
              </div>

              <button
                className="activity-menu"
                onClick={() => {
                  if (editingIndex === index) {
                    setEditingIndex(null);
                    setNewValue("");
                  } else {
                    setEditingIndex(index);
                    setNewValue(String(item.value));
                  }
                }}
                aria-label={`Editar ${item.name}`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "1.8rem",
                  lineHeight: 1,
                  color: "#6b7280",
                  padding: "0.2rem 0.45rem",
                  borderRadius: "10px",
                  flexShrink: 0,
                }}
              >
                ⋮
              </button>
            </div>

            {editingIndex === index && (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #ddd",
                  borderRadius: "14px",
                  padding: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <p style={{ marginTop: 0, marginBottom: "0.75rem" }}>
                  Modificar porcentaje por hora
                </p>

                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Ej: -10 o 8"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    marginBottom: "0.75rem",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />

                <button
                  onClick={() => handleEditValue(index)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "#d9c8ff",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Guardar cambio
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
          Añadir nueva actividad
        </h2>

        <input
          type="text"
          placeholder="Nombre de la actividad"
          value={newActivityName}
          onChange={(e) => setNewActivityName(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "0.75rem",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="number"
          placeholder="% por hora"
          value={newActivityValue}
          onChange={(e) => setNewActivityValue(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "0.75rem",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleAddActivity}
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            border: "none",
            background: "#d9c8ff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Añadir nueva actividad
        </button>
      </div>

      {showModal && selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "360px",
              borderRadius: "18px",
              padding: "1.25rem",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {selected.emoji} {selected.name}
            </h3>

            <p style={{ fontSize: "0.95rem", marginBottom: "1rem" }}>
              Introduce cuánto tiempo has hecho esta actividad. Para media hora
              pon <strong>0.5</strong>, para una hora pon <strong>1</strong>, y
              para una hora y media pon <strong>1.5</strong>.
            </p>

            <input
              type="number"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Ej: 0.5"
              style={{
                width: "100%",
                padding: "0.75rem",
                marginBottom: "1rem",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleSaveLog}
                style={{
                  flex: 1,
                  padding: "0.8rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "#d9c8ff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Guardar
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelected(null);
                  setHours("");
                }}
                style={{
                  flex: 1,
                  padding: "0.8rem",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}