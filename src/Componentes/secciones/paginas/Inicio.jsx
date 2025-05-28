import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Ballpit from "../../../bibliotecas/Ballpit.jsx";
import StarBorder from "../../../bibliotecas/StarBorder.jsx";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";
import "./inicio.css";

// Importa el video directamente
import videoInicio from "../../../assets/videos/VídeoInicioComoJugar.mp4";

const Inicio = () => {
  const navegar = useNavigate();

  return (
    <>
      <RandomSkinBackground />

      <div className="ballpit-background-inicio">
        <Ballpit
          count={100}
          gravity={1.5}
          colors={["#a64dff", "#3b82f6", "#0ff", "#f472b6", "#0f172a"]}
        />
      </div>

      <div className="inicio__fondo">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center z-10 relative text-center p-6"
        >
          <h1 className="inicio__titulo pixelated mb-6">
            <ShinyText text="🎮 Bienvenido a GamerMix" speed="2s" color="yellow" />
          </h1>

          <video
            className="inicio__video"
            controls
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoInicio} type="video/mp4" />
            Tu navegador no soporta la reproducción de videos.
          </video>

          <ul className="inicio__lista mt-8 mb-6">
            <li>
              <StarBorder color="cyan" speed="1.5s">
                🔄 Combina skins con objetos únicos
              </StarBorder>
            </li>
            <li>
              <StarBorder color="purple" speed="2s">
                🎮 Usa drag & drop para experimentar
              </StarBorder>
            </li>
            <li>
              <StarBorder color="blue" speed="2s">
                🧠 Descubre combinaciones secretas
              </StarBorder>
            </li>
            <li>
              <StarBorder color="pink" speed="2s">
                🏅 Desbloquea logros al jugar
              </StarBorder>
            </li>
            <li>
              <StarBorder color="lime" speed="2s">
                💾 Guarda tus mezclas favoritas
              </StarBorder>
            </li>
          </ul>

          <a
            href="https://ianmiguelsoler.github.io/GamerMixFrontEnd/guia-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="inicio__guia"
          >
            📘 Leer guía de usuario
          </a>

          <StarBorder
            as="button"
            className="boton-pixel mt-4"
            color="indigo"
            speed="1.8s"
            onClick={() => navegar("/zona-de-mezcla")}
          >
            🚀 ¡Comienza tu aventura!
          </StarBorder>
        </motion.div>
      </div>
    </>
  );
};

export default Inicio;
