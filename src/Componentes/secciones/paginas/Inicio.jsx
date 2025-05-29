import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Ballpit from "../../../bibliotecas/Ballpit.jsx";
import StarBorder from "../../../bibliotecas/StarBorder.jsx";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";
import "./inicio.css";

import videoInicio from "../../../assets/videos/VídeoInicioComoJugar.mp4";
import sonidoInicio from "../../../assets/ultimoLogroObtenido.mp3";

const Inicio = () => {
  const { t } = useTranslation("inicio");
  const navegar = useNavigate();
  const audioRef = useRef(new Audio(sonidoInicio));

  const manejarComienzo = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setTimeout(() => {
      navegar("/iniciarsesion");
    }, 300);
  };

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
            <span className="inicio__emoji">🎮</span>
            <ShinyText
              className="inicio__text"
              text={t("title")}
              speed="2s"
              color="yellow"
            />
          </h1>

          <video className="inicio__video" autoPlay muted loop playsInline>
            <source src={videoInicio} type="video/mp4" />
            {t("videoFallback")}
          </video>

          <div className="television-vintage">
            <div className="pantalla-vintage pixelated">
              <ul className="lista-vintage">
                {t("features", { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <span className="click-mouse" />

          <a
            href="https://ianmiguelsoler.github.io/GamerMixFrontEnd/guia-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="inicio__guia"
          >
            {t("guide")}
          </a>

          <StarBorder
            as="button"
            className="boton-pixel mt-4"
            color="indigo"
            speed="1.8s"
            onClick={manejarComienzo}
          >
            {t("start")}
          </StarBorder>
        </motion.div>
      </div>
    </>
  );
};

export default Inicio;
