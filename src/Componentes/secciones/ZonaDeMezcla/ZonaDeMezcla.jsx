import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import InfoIcon from "@mui/icons-material/Info";
import "./ZonaDeMezcla.css";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import { useTranslation } from "react-i18next";
import ZonaDeMezclaBarraLateral from "./ZonaDeMezclaBarraLateral/ZonaDeMezclaBarraLateral.jsx";

const ZonaDeMezcla = () => {
  const { t } = useTranslation("zonaDeMezcla");

  const [mezclasHechas, setMezclasHechas] = useState(0); // Cambia a 0 para ver el popup
  const [mezclasTotales, setMezclasTotales] = useState(10);
  const [iconos, setIconos] = useState([]);
  const [mezclasActivas, setMezclasActivas] = useState([]); // [{url, x, y}]

  const zonaRef = useRef(null);

  const mostrarInfo = () => {
    Swal.fire({
      title: t("popupTitle"),
      html: `
        <p style="font-size: 14px;">${t("popupText1")}</p>
        <p style="font-size: 14px;">${t("popupText2")}</p>
      `,
      icon: "info",
      confirmButtonText: t("understood"),
      confirmButtonColor: "#9e79ff",
      background: "#1e1e1e",
      color: "#ffffff",
    });
  };

  useEffect(() => {
    if (mezclasHechas === 0) {
      mostrarInfo();
    }
  }, [mezclasHechas]);

  useEffect(() => {
    const cargarIconos = async () => {
      try {
        const versionsRes = await fetch(
          "https://ddragon.leagueoflegends.com/api/versions.json"
        );
        const versions = await versionsRes.json();
        const latestVersion = versions[0];

        const championsRes = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
        );
        const championsData = await championsRes.json();
        const championKeys = Object.keys(championsData.data);

        const seleccionados = championKeys
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);

        const urls = seleccionados.map(
          (champ) =>
            `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ}.png`
        );

        setIconos(urls);
      } catch (error) {
        console.error("Error al cargar iconos:", error);
      }
    };

    cargarIconos();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    const url = e.dataTransfer.getData("skinURL");

    const rect = zonaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (url) {
      setMezclasActivas((prev) => [...prev, { url, x, y }]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="zona-de-mezcla">
      <div className="zona-central">
        <div className="zona-cabecera">
          <button
            className="info-boton"
            onClick={mostrarInfo}
            title="Información"
          >
            <InfoIcon />
          </button>
          <div
            className={`marcador-mezclas ${
              mezclasHechas >= mezclasTotales ? "completo" : "normal"
            }`}
          >
            <ShinyText
              text={t("markerText", {
                hechas: mezclasHechas,
                totales: mezclasTotales,
              })}
              disabled={false}
              speed={3}
              className="custom-class"
            />
          </div>
        </div>

        <div
          className="zona-soltar"
          ref={zonaRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {mezclasActivas.length === 0 ? (
            <p className="zona-indicacion">Arrastra aquí tus skins...</p>
          ) : (
            mezclasActivas.map((mezcla, index) => (
              <img
                key={index}
                src={mezcla.url}
                alt={`mezcla-${index}`}
                className="mezcla-preview"
                style={{
                  position: "absolute",
                  left: mezcla.x,
                  top: mezcla.y,
                }}
              />
            ))
          )}
        </div>
      </div>

      <ZonaDeMezclaBarraLateral iconos={iconos} />
    </div>
  );
};

export default ZonaDeMezcla;
