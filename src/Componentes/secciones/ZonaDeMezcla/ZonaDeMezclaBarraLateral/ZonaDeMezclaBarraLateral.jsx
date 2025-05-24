import React from "react";
import "./ZonaDeMezclaBarraLateral.css";
import { useDraggable } from "@dnd-kit/core";

const IconoDraggable = ({ icono }) => {
  const draggableId = `barra-${icono.tipo}-${icono.id}`;
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: draggableId,
    data: { icono, source: "barra" }, // <- marcamos que viene de la barra
  });

  return (
    <div
      className="icono-contenedor"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <img
        src={icono.url}
        alt={icono.nombre_elemento || icono.nombre_skin || "icono"}
        className="icono-lol"
      />
    </div>
  );
};

const ZonaDeMezclaBarraLateral = ({ iconos }) => {
  return (
    <div className="barra-lateral">
      {iconos.map((icono) => (
        <IconoDraggable key={`barra-${icono.tipo}-${icono.id}`} icono={icono} />
      ))}
    </div>
  );
};

export default ZonaDeMezclaBarraLateral;
