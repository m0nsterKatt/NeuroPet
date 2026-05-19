export const PET_LEVELS = [0, 20, 40, 60, 80, 100];

export const petMap = {
  0: "/images/pets/pet_0.gif",
  20: "/images/pets/pet_20.gif",
  40: "/images/pets/pet_40.gif",
  60: "/images/pets/pet_60.gif",
  80: "/images/pets/pet_80.gif",
  100: "/images/pets/pet_100.gif",
};

export const phrasesByState = {
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

export function clampEnergy(value) {
  return Math.max(0, Math.min(100, value));
}

export function calculateActivityImpact(activityValue, duration) {
  return activityValue * duration;
}

export function calculateNewEnergy(currentEnergy, impact) {
  return clampEnergy(currentEnergy + impact);
}

export function getPetLevel(energy) {
  if (energy >= 100) return 100;
  if (energy >= 80) return 80;
  if (energy >= 60) return 60;
  if (energy >= 40) return 40;
  if (energy >= 20) return 20;
  return 0;
}

export function getPetImage(energy) {
  const level = getPetLevel(energy);
  return petMap[level];
}

export function getCookiesByEnergy(energy) {
  const cookies = [];
  const safeEnergy = clampEnergy(energy);
  const fullCookies = Math.floor(safeEnergy / 20);
  const remainder = safeEnergy % 20;

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

export function getCookieImage(type) {
  if (type === "full") return "/images/icons/energy/cookie_full.png";
  if (type === "half") return "/images/icons/energy/cookie_half.png";
  return "/images/icons/energy/cookie_empty.png";
}

export function getRandomPhrase(level) {
  const phrases = phrasesByState[level] || phrasesByState[0];
  return phrases[Math.floor(Math.random() * phrases.length)];
}