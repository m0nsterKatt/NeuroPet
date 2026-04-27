import { useNavigate } from "react-router-dom";
import { categories } from "../utils/activities";

export default function Activity() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        paddingTop: "5rem",
        padding: "1.5rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="back-button"
      >
        ← Inicio
      </button>

      <h1
        style={{
          background: "#fcd5ce",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "6rem",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid #ff4c2d",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Elige una categoría
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          marginTop: "1.5rem",
          textAlign: "center",
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              localStorage.setItem(
                "neuropet_selected_category",
                JSON.stringify(category)
              );
              navigate("/activityCategory");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              width: "100%",
              maxWidth: "700px",
              padding: "0.9rem 1rem",
              borderRadius: "14px",
              border: "1px solid #0cc0d0",
              background: "#edfeff",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </main>
  );
}