import React from "react";
import "./ZonaDeMezclaBarraLateral.css";

const ZonaDeMezclaBarraLateral = ({ iconos }) => {
  return (
    <div className="barra-lateral">
      {iconos.map((url, index) => (
        <div key={index} className="icono-contenedor">
          <img
            src={url}
            alt={`icono-${index}`}
            className="icono-lol"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("skinURL", url)}
          />
          {index < iconos.length - 1 && <div className="separador" />}
        </div>
      ))}
    </div>
  );
};

export default ZonaDeMezclaBarraLateral;
