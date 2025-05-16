import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./Coleccion.css";
import ColeccionImagenes from "./ColeccionImagenes.jsx";
import ColeccionFiltros from "./ColeccionFiltros.jsx";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import { contextoJugar } from "../../../contextos/ProveedorJugar.jsx";

const Coleccion = () => {
  const { t } = useTranslation("coleccion");
  const { usuario } = useContext(contextoSesion);
  const { galeriaFiltrada, cargando, error } = useContext(contextoJugar);

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">{t("noAccess")}</p>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="coleccion">
      <h1 className="coleccion__titulo">
        Colección de {usuario.nombre_usuario || "usuario"}
      </h1>
      <ColeccionFiltros />
      <div className="coleccion__separador"></div>
      <div className="coleccion__scrollable">
        <ColeccionImagenes skins={galeriaFiltrada} />
      </div>
    </section>
  );
};

export default Coleccion;
