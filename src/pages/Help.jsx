import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const groundingSteps = [
  "5 cosas que puedes ver",
  "4 cosas que puedes tocar",
  "3 cosas que puedes oír",
  "2 cosas que puedes oler",
  "1 cosa que puedes saborear",
];

export default function Help() {
  const navigate = useNavigate();
  const breathingIntervalRef = useRef(null);

  const [mode, setMode] = useState(null);
  const [groundingStep, setGroundingStep] = useState(0);
  const [breathingState, setBreathingState] = useState("Inhala");

  function stopBreathing() {
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }

    setMode(null);
    setBreathingState("Inhala");
  }

  function startGrounding() {
    setMode("grounding");
    setGroundingStep(0);
    speak(groundingSteps[0]);
  }

  function exitGrounding() {
    window.speechSynthesis?.cancel();
    setMode(null);
    setGroundingStep(0);
  }

  function nextGroundingStep() {
    const nextStep = groundingStep + 1;

    if (nextStep >= groundingSteps.length) {
      exitGrounding();
      speak("Si no es suficiente, pide ayuda.");
      return;
    }

    setGroundingStep(nextStep);
    speak(groundingSteps[nextStep]);
  }

  function startBreathing() {
  stopBreathing();

  setMode("breathing");
  setBreathingState("Inhala");
  speak("Inhala");

  let inhale = true;
  let cycles = 0;
  const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
  const maxCycles = savedSettings.breathingCycles || 5;

  breathingIntervalRef.current = setInterval(() => {
    inhale = !inhale;
    const newState = inhale ? "Inhala" : "Exhala";

    setBreathingState(newState);
    speak(newState);

    cycles++;

    if (cycles >= maxCycles * 2) {
      stopBreathing();
    }
  }, 4000);
}

  function speak(text) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(text);
    message.lang = "es-ES";
    message.rate = 0.85;
    message.pitch = 1;

    window.speechSynthesis.speak(message);
  }

  if (mode === "grounding") {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#edfeff",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <button onClick={exitGrounding} className="back-button">
          ← Atrás
        </button>

        <div
          onClick={nextGroundingStep}
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "1rem",
                marginBottom: "1rem",
                opacity: 0.7,
              }}
            >
              Toca la pantalla para continuar
            </p>

            <h1
              style={{
                fontSize: "2rem",
                background: "#fcd5ce",
                padding: "2rem",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              {groundingSteps[groundingStep]}
            </h1>
          </div>
        </div>
      </main>
    );
  }

  if (mode === "breathing") {
  return (
    <main
      style={{
        paddingTop: "5rem",
        padding: "1.5rem",
        minHeight: "100vh",
        background: "#edfeff",
        textAlign: "center",
      }}
    >
      <button onClick={stopBreathing} className="back-button">
        ← Atrás
      </button>

      <div
        style={{
          minHeight: "calc(100vh - 8rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <div
            style={{
              width: "240px",
              height: "240px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}
          >
            <div
              style={{
                width: breathingState === "Inhala" ? "220px" : "140px",
                height: breathingState === "Inhala" ? "220px" : "140px",
                borderRadius: "50%",
                background: "#fcd5ce",
                border: "2px solid #e76f51",
                transition: "all 4s ease-in-out",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <h1 style={{ minHeight: "2.5rem", margin: 0 }}>
            {breathingState}
          </h1>

          <p style={{ opacity: 0.7 }}>
            Sigue el círculo. No tienes que hacer nada más.
          </p>
        </div>
      </div>
    </main>
  );
}

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
          background: "#fcd5ce",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "6rem",
          padding: "1rem",
          borderRadius: "12px",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "600px",
          border: "2px solid #f4a261",
        }}
      >
        Necesito ayuda
      </h1>

      <p
        style={{
          textAlign: "center",
          marginTop: "1rem",
          marginBottom: "3rem",
          fontSize: "1.05rem",
        }}
      >
        Vamos poco a poco. Ahora no toca rendir.
      </p>

      <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
        <button
          onClick={startBreathing}
          style={{
            padding: "1.3rem",
            borderRadius: "16px",
            border: "2px solid #0cc0d0",
            background: "#edfeff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🫁 Respirar
        </button>

        <button
          onClick={startGrounding}
          style={{
            padding: "1.3rem",
            borderRadius: "16px",
            border: "2px solid #0cc0d0",
            background: "#edfeff",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🧍 Grounding
        </button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          background: "#fff7ed",
          border: "1px solid #f4a261",
          borderRadius: "14px",
          padding: "1rem",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Checklist rápida</h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: "0.8rem",
            fontSize: "1.05rem",
          }}
        >
          <li>💧 Beber agua</li>
          <li>🧘 Aislarse en un sitio tranquilo</li>
          <li>🌙 Apagar las luces</li>
          <li>🔇 Reducir el ruido</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          background: "#fcd5ce",
          borderRadius: "14px",
          padding: "1rem",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        🐾 Estoy contigo. Vamos paso a paso.
      </div>
    </main>
  );
}