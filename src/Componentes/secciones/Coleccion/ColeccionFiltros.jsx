import React from "react";
import { useTranslation } from "react-i18next";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import "./ColeccionFiltros.css";


const ColeccionFiltros = () => {
  const { t } = useTranslation("coleccion");

  return (
    <div className="coleccion__filtros-bloque">
      <span className="coleccion__filtros-label">{t("filtersTitle")}</span>
      <div className="coleccion__filtros">
        <div className="coleccion__campo">
          <ShinyText
            text={t("nameLabel")}
            disabled={false}
            speed={3}
            className="coleccion__filtros__texto"
          />
          <input type="text" placeholder={t("namePlaceholder")} />
        </div>
        <div className="coleccion__campo">
          <ShinyText
            text={t("collectionLabel")}
            disabled={false}
            speed={3}
            className="coleccion__filtros__texto"
          />
          <input type="text" placeholder={t("collectionPlaceholder")} />
        </div>
        <div className="coleccion__campo">
          <ShinyText
            text={t("mixIdLabel")}
            disabled={false}
            speed={3}
            className="coleccion__filtros__texto"
          />
          <input type="text" placeholder={t("mixIdPlaceholder")} />
        </div>
        <div className="coleccion__campo">
          <ShinyText
            text={t("descriptionLabel")}
            disabled={false}
            speed={3}
            className="coleccion__filtros__texto"
          />
          <input type="text" placeholder={t("descriptionPlaceholder")} />
        </div>
      </div>
    </div>
  );
};

export default ColeccionFiltros;
