import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import InfoIcon from "@mui/icons-material/Info";
import "./ZonaDeMezcla.css";

import { useTranslation } from "react-i18next";
import ZonaDeMezclaBarraLateral from "./ZonaDeMezclaBarraLateral/ZonaDeMezclaBarraLateral.jsx";
import ZonaDeMezclaTablero from "./ZonaDeMezclaTablero/ZonaDeMezclaTablero.jsx";

const ZonaDeMezcla = () => {
  const { t } = useTranslation("zonaDeMezcla");

  const [mezclasHechas, setMezclasHechas] = useState(0);
  const [mezclasTotales, setMezclasTotales] = useState(10);
  const [iconos, setIconos] = useState([]);
  const [mezclasActivas, setMezclasActivas] = useState([]);

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
        const versionsRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await versionsRes.json();
        const latestVersion = versions[0];

        const championsRes = await fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
        );
        const championsData = await championsRes.json();
        const championKeys = Object.keys(championsData.data);

        const seleccionados = championKeys.sort(() => 0.5 - Math.random()).slice(0, 20);

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

  return (
    <div className="zona-de-mezcla">
      <ZonaDeMezclaTablero
        mezclasActivas={mezclasActivas}
        setMezclasActivas={setMezclasActivas}
        zonaRef={zonaRef}
        mostrarInfo={mostrarInfo}
        mezclasHechas={mezclasHechas}
        mezclasTotales={mezclasTotales}
        markerText={t("markerText", {
          hechas: mezclasHechas,
          totales: mezclasTotales,
        })}
      />
      <ZonaDeMezclaBarraLateral iconos={iconos} />
    </div>
  );
};

export default ZonaDeMezcla;
