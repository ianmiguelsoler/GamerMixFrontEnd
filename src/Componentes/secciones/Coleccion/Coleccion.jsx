import React from "react";
import { useTranslation } from "react-i18next";
import "./Coleccion.css";
import ColeccionImagenes from "./ColeccionImagenes.jsx";

const TOTAL_SKINS = 12;

// Simulamos que el usuario tiene estas 5 skins
const skinsDesbloqueadas = [1, 2, 4, 7, 10];

// Creamos el array con toda la info para las cards
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

  return (
    <section className="coleccion">
      <h1 className="coleccion__titulo">{t("title")}</h1>

      {/* Filtros de búsqueda */}
      <div className="coleccion__filtros-bloque">
        <span className="coleccion__filtros-label">{t("filtersTitle")}</span>
        <div className="coleccion__filtros">
          <div className="coleccion__campo">
            <label>{t("nameLabel")}</label>
            <input type="text" placeholder={t("namePlaceholder")} />
          </div>
          <div className="coleccion__campo">
            <label>{t("collectionLabel")}</label>
            <input type="text" placeholder={t("collectionPlaceholder")} />
          </div>
          <div className="coleccion__campo">
            <label>{t("mixIdLabel")}</label>
            <input type="text" placeholder={t("mixIdPlaceholder")} />
          </div>
          <div className="coleccion__campo">
            <label>{t("descriptionLabel")}</label>
            <input type="text" placeholder={t("descriptionPlaceholder")} />
          </div>
        </div>
      </div>

      {/* Mosaico de skins con scroll interno */}
      <div className="coleccion__scrollable">
        <ColeccionImagenes skins={todasLasSkins} />
      </div>
    </section>
  );
};

export default Coleccion;
