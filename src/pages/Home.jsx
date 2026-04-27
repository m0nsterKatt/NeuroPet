import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnergy, getSettings } from "../utils/storage";
import "../assets/styles/Home.css";

const petMap = {
  0: "/images/pets/pet_0.gif",
  20: "/images/pets/pet_20.gif",
  40: "/images/pets/pet_40.gif",
  60: "/images/pets/pet_60.gif",
  80: "/images/pets/pet_80.gif",
  100: "/images/pets/pet_100.gif",
};

const phrasesByState = {
  100: [
    "Estoy genial hoy.",
    "Tengo energía para muchas cositas.",
    "Vamos con calma, pero vamos bien.",
    "Nivel de energía: desbloqueando logros ocultos.",
    "Disfruta el subidón sin romperte.",
    "Energía alta también necesita pausa.",
  ],
  80: [
    "Voy bastante bien.",
    "Todavía tengo energía guardada.",
    "Puedo seguir un poquito más.",
    "Me siento bien, pero no me sobrecargues.",
    "Aún tengo energía para cosas divertidas.",
    "Todavía puedo hacer cosas, pero con moderación.",
  ],
  60: [
    "Estoy más o menos estable.",
    "Voy tirando.",
    "Necesito que no me saturen mucho.",
    "Me vendría bien un descanso pronto.",
    "Puedo seguir, pero no me sobrecargues.",
    "Aún puedo hacer cosas, pero con cuidado.",
  ],
  40: [
    "Empiezo a cansarme.",
    "Me vendría bien bajar el ritmo.",
    "Necesito un poco de espacio.",
    "No me satures, porfa.",
    "Estoy llegando a mi límite.",
    "Una cosa. Solo una.",
  ],
  20: [
    "Estoy bastante agotadito.",
    "Necesito ayuda o descanso.",
    "Demasiadas cosas a la vez no, porfa.",
    "No me satures más.",
    "Estoy al límite, necesito un respiro.",
    "Solo puedo hacer una cosa a la vez ahora.",
  ],
  0: [
    "No me queda energía.",
    "Necesito parar ya.",
    "Ahora mismo toca cuidarme.",
    "No puedo hacer nada más, necesito descansar.",
    "Estoy agotado, por favor no me satures.",
    "Necesito un descanso urgente.",
  ],
};

function getPetLevel(energy) {
  if (energy >= 100) return 100;
  if (energy >= 80) return 80;
  if (energy >= 60) return 60;
  if (energy >= 40) return 40;
  if (energy >= 20) return 20;
  return 0;
}

function getCookiesByEnergy(energy) {
  const cookies = [];
  const fullCookies = Math.floor(energy / 20);
  const remainder = energy % 20;

  for (let i = 0; i < fullCookies; i++) {
    cookies.push("full");
  }

  if (cookies.length < 5 && remainder >= 10) {
    cookies.push("half");
  }

  while (cookies.length < 5) {
    cookies.push("empty");
  }

  return cookies;
}

function getCookieImage(type) {
  if (type === "full") return "/images/icons/energy/cookie_full.png";
  if (type === "half") return "/images/icons/energy/cookie_half.png";
  return "/images/icons/energy/cookie_empty.png";
}

function getRandomPhrase(level) {
  const phrases = phrasesByState[level];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export default function Home() {
  const navigate = useNavigate();
  const [energy, setEnergy] = useState(getEnergy());
  const [settings, setSettings] = useState(getSettings());

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
  const petImage = petMap[petLevel];

  const [phrase, setPhrase] = useState("");
  const [showPhrase, setShowPhrase] = useState(false);

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
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
          <button
            onClick={() => navigate("/settings")}
            style={{
              background: "#d8f3dc",
              color: "#2d6a4f",
              border: "1px solid #2f7a51",
              borderRadius: "12px",
              padding: "0.45rem 0.9rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              alignSelf: "flex-start",
            }}
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