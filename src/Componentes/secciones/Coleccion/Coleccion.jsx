import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./Coleccion.css";
import ColeccionImagenes from "./ColeccionImagenes.jsx";
import ColeccionFiltros from "./ColeccionFiltros.jsx";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";

const TOTAL_SKINS = 12;
const skinsDesbloqueadas = [1, 2, 4, 7, 10];

const todasLasSkins = Array.from({ length: TOTAL_SKINS }, (_, i) => {
  const id = i + 1;
  return {
    id,
    nombre: `Skin ${id}`,
    imagen: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_${i}.jpg`,
    alt: `Splash art de la Skin ${id}`,
    caption: `Ahri Skin #${id}`,
    overlay: `Ahri edición ${id}`,
    desbloqueada: skinsDesbloqueadas.includes(id),
  };
});

const Coleccion = () => {
  const { t } = useTranslation("coleccion");
  const { usuario } = useContext(contextoSesion);

   // Bloquear acceso si no hay usuario
  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">{t("noAccess")}</p>
      </div>
    );
  }

  return (
    <section className="coleccion">
      <h1 className="coleccion__titulo">{t("title")}</h1>
      <ColeccionFiltros />
      <div className="coleccion__separador"></div>
      <div className="coleccion__scrollable">
        <ColeccionImagenes skins={todasLasSkins} />
      </div>
    </section>
  );
};

export default Coleccion;
