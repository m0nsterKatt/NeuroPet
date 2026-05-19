import { useNavigate } from "react-router-dom";
import { categories } from "../utils/activities";
import { saveSelectedCategory } from "../utils/storage";

import "../assets/styles/Activity.css";

export default function Activity() {
  const navigate = useNavigate();

  const handleSelectCategory = (category) => {
    saveSelectedCategory(category);
    navigate("/activityCategory");
  };

  return (
    <main className="activity-page">
      <button
        onClick={() => navigate("/")}
        className="back-button"
      >
        ← Inicio
      </button>

      <h1 className="activity-title">
        Elige una categoría
      </h1>

      <div className="categories-container">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelectCategory(category)}
            className="category-button"
          >
            {category.name}
          </button>
        ))}
      </div>
    </main>
  );
}