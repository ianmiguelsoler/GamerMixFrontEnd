import React from "react";
import './Logro.css';

const Logro = ({ logro, fecha, puntos, alt }) => {
  return (
    <div className="logro-card">
      <img src={logro.image_url} alt={alt || logro.nombre_logro} className="logro-img" />
      <div className="logro-info">
        <h2 className="logro-nombre">{logro.nombre_logro}</h2>
        <p className="logro-descripcion">{logro.descripcion}</p>
        <p className="logro-fecha">Obtenido el: {new Date(fecha).toLocaleDateString()}</p>
        <p className="logro-puntos">+{puntos} puntos</p>
      </div>
    </div>
  );
};

export default Logro;
