import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import "./ColeccionFiltros.css";
import { contextoJugar } from "../../../contextos/ProveedorJugar.jsx";

const ColeccionFiltros = () => {
  const { t } = useTranslation("coleccion");
  const { filtrarGaleria } = useContext(contextoJugar);
  const [filtros, setFiltros] = useState({
    nombre: "",
    skin: "",
    descripcion: "",
    soloDesbloqueadas: false,
  });

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;

    const nuevosFiltros = {
      ...filtros,
      [name]: nuevoValor,
    };

    setFiltros(nuevosFiltros);
    filtrarGaleria(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosIniciales = {
      nombre: "",
      skin: "",
      descripcion: "",
      soloDesbloqueadas: false,
    };
    setFiltros(filtrosIniciales);
    filtrarGaleria(filtrosIniciales);
  };

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
          <input
            type="text"
            name="nombre"
            placeholder={t("namePlaceholder")}
            value={filtros.nombre}
            onChange={manejarCambio}
          />
        </div>
        <div className="coleccion__campo">
          <ShinyText
            text={t("collectionLabel")}
            disabled={false}
            speed={3}
            className="coleccion__filtros__texto"
          />
          <input
            type="text"
            name="skin"
            placeholder={t("collectionPlaceholder")}
            value={filtros.skin}
            onChange={manejarCambio}
          />
        </div>
        <div className="coleccion__campo">
          <ShinyText
            text={t("descriptionLabel")}
            disabled={false}
            speed={3}
            className="coleccion__filtros__texto"
          />
          <input
            type="text"
            name="descripcion"
            placeholder={t("descriptionPlaceholder")}
            value={filtros.descripcion}
            onChange={manejarCambio}
          />
        </div>
      </div>

      <div className="coleccion__acciones">
        <label className="coleccion__checkbox-label custom-checkbox">
          <input
            type="checkbox"
            name="soloDesbloqueadas"
            checked={filtros.soloDesbloqueadas}
            onChange={manejarCambio}
          />
          <span className="checkmark"></span>
          <span>{t("onlyUnlocked")}</span>
        </label>

        <button className="boton-pixel" onClick={limpiarFiltros}>
          🧹 {t("clearFilters")}
        </button>
      </div>
    </div>
  );
};

export default ColeccionFiltros;
