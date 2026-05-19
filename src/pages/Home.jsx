import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnergy, getSettings } from "../utils/storage";

import {
  getPetLevel,
  getCookiesByEnergy,
  getCookieImage,
  getRandomPhrase,
  getPetImage,
} from "../services/energyService";

import "../assets/styles/Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [energy, setEnergy] = useState(getEnergy());
  const [settings, setSettings] = useState(getSettings());

  const [phrase, setPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      setEnergy(getEnergy());
      setSettings(getSettings());
    };

    refreshData();
    window.addEventListener("focus", refreshData);

    return () => {
      window.removeEventListener("focus", refreshData);
    };
  }, []);

  const petLevel = useMemo(() => getPetLevel(energy), [energy]);
  const cookieStates = useMemo(() => getCookiesByEnergy(energy), [energy]);
  const petImage = useMemo(() => getPetImage(energy), [energy]);

  useEffect(() => {
    let interval;
    let timeout;

    const showPhraseNow = () => {
      setPhrase(getRandomPhrase(petLevel));
      setShowPhrase(true);

      timeout = setTimeout(() => {
        setShowPhrase(false);
      }, 5000);
    };

    showPhraseNow();

    interval = setInterval(() => {
      showPhraseNow();
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [petLevel]);

  useEffect(() => {
    if (energy !== 0) return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(
      'Te recomiendo que vayas al apartado "Necesito ayuda"'
    );

    message.lang = "es-ES";
    message.rate = 0.9;

    window.speechSynthesis.speak(message);
  }, [energy]);

  return (
    <main className="home-page">
      <section className="home-card">
        <div className="home-top-bar">
          <button
            className="settings-button"
            onClick={() => navigate("/settings")}
          >
            Configuración
          </button>
        </div>

        <div className="cookies-wrapper">
          {cookieStates.map((cookie, i) => (
            <img
              key={i}
              src={getCookieImage(cookie)}
              alt="estado energía"
              className="cookie-icon"
            />
          ))}
        </div>

        <div className="pet-section">
          <div className="pet-tooltip-wrapper">
            <img src={petImage} alt="mascota" className="pet-image" />

            <span
              className={`pet-tooltip ${
                settings.showExactEnergy ? "pet-tooltip-visible" : ""
              }`}
            >
              {energy}%
            </span>
          </div>

          <div className={`pet-speech ${showPhrase ? "visible" : ""}`}>
            {phrase}
          </div>
        </div>

        <div className="buttons-section">
          <button
            className="primary-button"
            onClick={() => navigate("/activity")}
          >
            Añadir actividad
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/help")}
          >
            Necesito ayuda
          </button>
        </div>
      </section>
    </main>
  );
}