import { createContext, useContext, useEffect, useRef, useState } from "react";
import click from "../assets/audio/click-sound.mp3";
import select from "../assets/audio/select-sound.mp3";
import popup from "../assets/audio/popup-sound.mp3";
import talk from "../assets/audio/talk-sound.mp3";

const AdministradorDeSonido = createContext();
export const useSound = () => useContext(AdministradorDeSonido);

const sounds = {
  click,
  select,
  popup,
  talk,
};

export const AdministradorDeSonidoProvider = ({ children }) => {
  const [volumen, setVolumen] = useState(0.4);
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const talkRef = useRef(null);
  const talkTimeout = useRef(null);

  const playSound = (type) => {
    if (!sonidoActivo || !sounds[type]) return;

    if (type === "talk") {
      // Si ya hay un audio cargado y no ha terminado
      if (talkRef.current) {
        if (!talkRef.current.ended) {
          talkRef.current.play().catch(() => {});
        }
        clearTimeout(talkTimeout.current);

        // Detener si no se vuelve a pulsar después de 300ms
        talkTimeout.current = setTimeout(() => {
          talkRef.current.pause();
        }, 300);
        return;
      }

      // Crear nuevo audio
      const audio = new Audio(sounds[type]);
      talkRef.current = audio;
      audio.volume = volumen;
      audio.playbackRate = 0.95 + Math.random() * 0.1;

      audio.play().catch(() => {});

      // Pausar después de 300ms si no se escribe más
      talkTimeout.current = setTimeout(() => {
        audio.pause();
      }, 300);

      // Reiniciar el ciclo si se termina
      audio.onended = () => {
        talkRef.current = null;
        clearTimeout(talkTimeout.current);
      };

      return;
    }

    const audio = new Audio(sounds[type]);
    audio.volume = volumen;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const handleClick = () => playSound("click");
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [sonidoActivo, volumen]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const target = e.target;
      const isInput = ["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;
      if (isInput) playSound("talk");
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [sonidoActivo, volumen]);

  return (
    <AdministradorDeSonido.Provider
      value={{ playSound, volumen, setVolumen, sonidoActivo, setSonidoActivo }}
    >
      {children}
    </AdministradorDeSonido.Provider>
  );
};

// Componente visual opcional (control de sonido)
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
