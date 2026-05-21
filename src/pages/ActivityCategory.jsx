import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSelectedCategory,
  saveSelectedCategory,
} from "../utils/storage";

import { useEnergy } from "../context/energyContext";

import { calculateActivityImpact } from "../services/energyService";

import "../assets/styles/ActivityCategory.css";

export default function ActivityCategory() {
  const navigate = useNavigate();
  const { addLog } = useEnergy();

  const initialCategory = getSelectedCategory();

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
      <main className="activity-category-page">

        <div className="activity-category-top">
          <button
            onClick={() => navigate("/activity")}
            className="back-button"
          >
            ← Volver a categorías
          </button>
        </div>

      </main>
    );
  }

  const handleSaveLog = async () => {
    const duration = parseFloat(hours);

    if (!selected || Number.isNaN(duration) || duration <= 0) return;

    const impact = calculateActivityImpact(selected.value, duration);

    await addLog({
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
    saveSelectedCategory(updatedCategory);

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
    saveSelectedCategory(updatedCategory);

    setNewActivityName("");
    setNewActivityValue("");
  };

  return (
    <main className="activity-category-page">

      <div className="activity-category-top">
        <button
          onClick={() => navigate("/activity")}
          className="back-button"
        >
          ← Volver a categorías
        </button>
      </div>

      <div className="activity-category-center">

        <div className="activity-category-panel">

          <h1 className="category-title">
            {category.name}
          </h1>

          <div className="activity-list">
            {category.items.map((item, index) => (
              <div key={`${item.name}-${index}`}>

                <div className="activity-item">

                  <div
                    className="activity-info"
                    onClick={() => {
                      setSelected(item);
                      setShowModal(true);
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
                  >
                    ⋮
                  </button>

                </div>

                {editingIndex === index && (
                  <div className="edit-panel">

                    <p className="edit-title">
                      Modificar porcentaje por hora
                    </p>

                    <input
                      type="number"
                      value={newValue}
                      onChange={(e) =>
                        setNewValue(e.target.value)
                      }
                      placeholder="Ej: -10 o 8"
                      className="input-field"
                    />

                    <button
                      onClick={() =>
                        handleEditValue(index)
                      }
                      className="save-button"
                    >
                      Guardar cambio
                    </button>

                  </div>
                )}

              </div>
            ))}
          </div>

          <div className="new-activity-section">

            <h2 className="new-activity-title">
              Añadir nueva actividad
            </h2>

            <input
              type="text"
              placeholder="Nombre de la actividad"
              value={newActivityName}
              onChange={(e) =>
                setNewActivityName(e.target.value)
              }
              className="input-field"
            />

            <input
              type="number"
              placeholder="% por hora"
              value={newActivityValue}
              onChange={(e) =>
                setNewActivityValue(e.target.value)
              }
              className="input-field"
            />

            <button
              onClick={handleAddActivity}
              className="save-button"
            >
              Añadir nueva actividad
            </button>

          </div>

        </div>

      </div>

      {showModal && selected && (
        <div className="modal-overlay">

          <div className="modal-content">

            <h3>
              {selected.emoji} {selected.name}
            </h3>

            <p className="modal-text">
              Introduce cuánto tiempo has hecho esta actividad.
              Para media hora pon <strong>0.5</strong>,
              para una hora pon <strong>1</strong>,
              y para una hora y media pon <strong>1.5</strong>.
            </p>

            <input
              type="number"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Ej: 0.5"
              className="input-field"
            />

            <div className="modal-buttons">

              <button
                onClick={handleSaveLog}
                className="save-button modal-button"
              >
                Guardar
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelected(null);
                  setHours("");
                }}
                className="cancel-button modal-button"
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