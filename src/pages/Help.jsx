import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/Help.css";

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

    const savedSettings =
      JSON.parse(localStorage.getItem("settings")) || {};

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
      <main className="grounding-page">
        <button
          onClick={exitGrounding}
          className="back-button"
        >
          ← Atrás
        </button>

        <div className="grounding-container">
          <div
            onClick={nextGroundingStep}
            className="grounding-card"
          >
            <p className="grounding-subtitle">
              Haz clic para continuar
            </p>

            <h1 className="grounding-title">
              {groundingSteps[groundingStep]}
            </h1>
          </div>
        </div>
      </main>
    );
  }

  if (mode === "breathing") {
    return (
      <main className="breathing-page">
        <button
          onClick={stopBreathing}
          className="back-button"
        >
          ← Atrás
        </button>

        <div className="breathing-container">
          <div className="breathing-card">
            <div className="breathing-circle-wrapper">
              <div
                className={`breathing-circle ${
                  breathingState === "Inhala"
                    ? "inhale"
                    : "exhale"
                }`}
              />
            </div>

            <h1 className="breathing-title">
              {breathingState}
            </h1>

            <p className="breathing-text">
              Sigue el círculo. No tienes que hacer nada más.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="help-page">
      <button
        onClick={() => navigate("/")}
        className="back-button"
      >
        ← Inicio
      </button>

      <div className="help-panel">
        <h1 className="help-title">
          Necesito ayuda
        </h1>

        <p className="help-subtitle">
          Vamos poco a poco. Ahora no toca rendir.
        </p>

        <div className="help-buttons">
          <button
            onClick={startBreathing}
            className="help-action-button"
          >
            🫁 Respirar
          </button>

          <button
            onClick={startGrounding}
            className="help-action-button"
          >
            🧍 Grounding
          </button>
        </div>

        <div className="checklist-card">
          <h2 className="checklist-title">
            Checklist rápida
          </h2>

          <ul className="checklist-list">
            <li>💧 Beber agua</li>
            <li>🧘 Aislarse en un sitio tranquilo</li>
            <li>🌙 Apagar las luces</li>
            <li>🔇 Reducir el ruido</li>
          </ul>
        </div>

        <div className="support-message">
          🐾 Estoy contigo. Vamos paso a paso.
        </div>
      </div>
    </main>
  );
}