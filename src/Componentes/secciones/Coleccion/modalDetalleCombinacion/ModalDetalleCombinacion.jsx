import React, { useState } from "react";
import TiltedCard from "../../../../bibliotecas/TiltedCard.jsx";
import ShinyText from "../../../../bibliotecas/ShinyText.jsx";
import "./ModalDetalleCombinacion.css";

const ModalDetalleCombinacion = ({ combinacion, onClose }) => {
  const [descripcionHover, setDescripcionHover] = useState("");
  const [descripcionFijada, setDescripcionFijada] = useState("");

  if (!combinacion) return null;

  const { nombre_combinacion, descripcion, image_url, skin, elemento } = combinacion;

  const mostrarDescripcion = (texto) => {
    if (!descripcionFijada) setDescripcionHover(texto);
  };

  const fijarDescripcion = (texto) => {
    setDescripcionFijada(texto);
    setDescripcionHover(texto);
  };

  const limpiarHover = () => {
    if (!descripcionFijada) setDescripcionHover("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">{nombre_combinacion}</div>

        <div className="modal-contenido-principal">
          <p className="modal-descripcion">
            <img
              src={image_url}
              alt={nombre_combinacion}
              className="modal-imagen-grande"
            />
            {descripcion}
          </p>
        </div>

        <div className="modal-combinacion-abajo">
          <div
            onMouseEnter={() => mostrarDescripcion(elemento?.descripcion)}
            onMouseLeave={limpiarHover}
            onClick={() => fijarDescripcion(elemento?.descripcion)}
          >
            <TiltedCard
              imageSrc={elemento?.image_url}
              altText={elemento?.nombre_elemento}
              containerHeight="160px"
              containerWidth="120px"
              imageHeight="160px"
              imageWidth="120px"
              showTooltip={false}
              showMobileWarning={false}
            />
          </div>

          <span className="modal-simbolo-mas">+</span>

          <div
            onMouseEnter={() => mostrarDescripcion(skin?.descripcion)}
            onMouseLeave={limpiarHover}
            onClick={() => fijarDescripcion(skin?.descripcion)}
          >
            <TiltedCard
              imageSrc={skin?.image_url}
              altText={skin?.nombre_skin}
              containerHeight="160px"
              containerWidth="120px"
              imageHeight="160px"
              imageWidth="120px"
              showTooltip={false}
              showMobileWarning={false}
            />
          </div>
        </div>

        <div className="descripcion-hover">
          {descripcionHover && (
            <ShinyText
              text={descripcionHover}
              disabled={false}
              speed={3}
              className="descripcion-hover-shiny"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleCombinacion;
