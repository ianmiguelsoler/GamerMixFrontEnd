// contextos/AdministradorDeSonido.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import click from "../assets/click-sound.mp3";
import select from "../assets/select-sound.mp3";
import popup from "../assets/popup-sound.mp3";

const AdministradorDeSonido = createContext();
export const useSound = () => useContext(AdministradorDeSonido);

const sounds = {
  click,
  select,
  popup,
};

export const AdministradorDeSonidoProvider = ({ children }) => {
  const audioRefs = useRef({});
  const [volumen, setVolumen] = useState(0.4);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  const playSound = (type) => {
    if (!sonidoActivo || !sounds[type]) return;
    const audio = new Audio(sounds[type]);
    audio.volume = volumen;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const handleClick = () => playSound("click");
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sonidoActivo, volumen]);

  return (
    <AdministradorDeSonido.Provider value={{ playSound, volumen, setVolumen, sonidoActivo, setSonidoActivo }}>
      {children}
    </AdministradorDeSonido.Provider>
  );
};

// Componente visual de control de sonido como botón de icono
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

export const BotonSonido = () => {
  const { sonidoActivo, setSonidoActivo } = useSound();

  return (
    <button
      className="navegacion__icono"
      onClick={() => setSonidoActivo(!sonidoActivo)}
      title={sonidoActivo ? "Silenciar sonido" : "Activar sonido"}
    >
      {sonidoActivo ? <VolumeUpIcon fontSize="large" /> : <VolumeOffIcon fontSize="large" />}
      <span className="navegacion__texto">Sonido</span>
    </button>
  );
};

export default AdministradorDeSonidoProvider;
