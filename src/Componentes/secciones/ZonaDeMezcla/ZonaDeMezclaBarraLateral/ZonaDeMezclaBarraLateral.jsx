import React, { useRef } from "react";
import "./ZonaDeMezclaBarraLateral.css";
import { useDraggable } from "@dnd-kit/core";

const IconoDraggable = ({ icono }) => {
  const draggableId = `barra-${icono.tipo}-${icono.id}`;
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: draggableId,
    data: { icono, source: "barra" },
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
  const scrollRef = useRef(null);

  const scrollIzquierda = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 100;
    }
  };

  const scrollDerecha = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 100;
    }
  };

  return (
    <div className="zona-barra-con-flechas">
      <button className="flecha-izquierda solo-movil" onClick={scrollIzquierda}>
        ◀
      </button>
      <div className="barra-lateral" ref={scrollRef}>
        {iconos.map((icono) => (
          <IconoDraggable key={`barra-${icono.tipo}-${icono.id}`} icono={icono} />
        ))}
      </div>
      <button className="flecha-derecha solo-movil" onClick={scrollDerecha}>
        ▶
      </button>
    </div>
  );
};

export default ZonaDeMezclaBarraLateral;
