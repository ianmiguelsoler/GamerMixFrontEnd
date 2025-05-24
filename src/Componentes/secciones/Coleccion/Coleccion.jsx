import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Coleccion.css";
import ColeccionImagenes from "./ColeccionImagenes.jsx";
import ColeccionFiltros from "./ColeccionFiltros.jsx";
import ModalDetalleCombinacion from "./modalDetalleCombinacion/ModalDetalleCombinacion.jsx";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import { contextoJugar } from "../../../contextos/ProveedorJugar.jsx";

const Coleccion = () => {
  const { t } = useTranslation("coleccion");
  const { usuario } = useContext(contextoSesion);
  const { galeriaFiltrada, cargando, error, obtenerGaleria } = useContext(contextoJugar);

  const yaCargado = useRef(false); // <-- NUEVO: evitar múltiples cargas

  const [modalAbierta, setModalAbierta] = useState(false);
  const [skinSeleccionada, setSkinSeleccionada] = useState(null);

  const abrirModal = (skin) => {
    setSkinSeleccionada(skin);
    setModalAbierta(true);
  };

  const cerrarModal = () => {
    setModalAbierta(false);
    setSkinSeleccionada(null);
  };

  useEffect(() => {
    if (usuario?.id && !yaCargado.current) {
      obtenerGaleria();
      yaCargado.current = true;
    }
  }, [usuario, obtenerGaleria]);

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
        <ColeccionImagenes skins={galeriaFiltrada} onClickSkin={abrirModal} />
      </div>

      {modalAbierta && skinSeleccionada && (
        <ModalDetalleCombinacion
          combinacion={skinSeleccionada}
          onClose={cerrarModal}
        />
      )}
    </section>
  );
};

export default Coleccion;
