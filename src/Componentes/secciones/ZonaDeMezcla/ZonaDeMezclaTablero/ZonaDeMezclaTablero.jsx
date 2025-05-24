import React, { useEffect, useContext, useState } from "react";
import "./ZonaDeMezclaTablero.css";
import ShinyText from "../../../../bibliotecas/ShinyText.jsx";
import InfoIcon from "@mui/icons-material/Info";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { contextoLogros } from "../../../../contextos/ProveedorMezclasLogros.jsx";

const DraggableMezcla = ({ mezcla, activeDragId, animacion }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: mezcla.reactId,
    data: { ...mezcla, source: "tablero" },
  });

  const isDragging = mezcla.reactId === activeDragId;

  return (
    <img
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      src={mezcla.url}
      alt={`mezcla-${mezcla.reactId}`}
      className={`mezcla-preview ${animacion}`}
      style={{
        left: mezcla.x,
        top: mezcla.y,
        position: "absolute",
        opacity: isDragging ? 0 : 1,
        touchAction: "none",
      }}
      data-name={mezcla.reactId}
    />
  );
};

const ZonaDeMezclaTablero = ({
  mezclasActivas,
  setMezclasActivas,
  zonaRef,
  mostrarInfo,
  markerText,
  activeDragId,
  activeDragItem,
}) => {
  const { setNodeRef } = useDroppable({ id: "zona-soltar" });

  const {
    combinacionesConEstado,
    verificarYGuardarCombinacion,
    datosCombinacionExitosa,
    mezclasHechas,
    mezclasTotales
  } = useContext(contextoLogros);

  const [animaciones, setAnimaciones] = useState({});
  const [mostrarCombinacion, setMostrarCombinacion] = useState(null);

  const limpiarTablero = () => setMezclasActivas([]);

  useEffect(() => {
    if (!activeDragItem || !mezclasActivas.length) return;

    const dragged = activeDragItem;
    const overlapped = mezclasActivas.find(
      (m) =>
        m.reactId !== dragged.reactId &&
        Math.abs(m.x - dragged.x) < 40 &&
        Math.abs(m.y - dragged.y) < 40
    );

    if (!overlapped) return;

    const skin = [dragged, overlapped].find((m) => m.tipo === "skin");
    const item = [dragged, overlapped].find((m) => m.tipo === "item");

    if (!skin || !item) return;

    const ejecutarComprobacion = async () => {
      const exito = await verificarYGuardarCombinacion(item.id, skin.id);
      const newAnimations = {};

      if (!exito) {
        newAnimations[skin.reactId] = "mezcla-error";
        newAnimations[item.reactId] = "mezcla-error";
        setAnimaciones(newAnimations);
        setTimeout(() => setAnimaciones({}), 3000);
      } else {
        newAnimations[skin.reactId] = "mezcla-exito";
        newAnimations[item.reactId] = "mezcla-exito";
        setAnimaciones(newAnimations);
        setTimeout(() => setAnimaciones({}), 1500);
        setTimeout(() => {
          setMostrarCombinacion(datosCombinacionExitosa);
          setTimeout(() => setMostrarCombinacion(null), 4000);
        }, 1600);
      }
    };

    ejecutarComprobacion();
  }, [mezclasActivas, activeDragItem]);

  return (
    <div className="zona-central">
      <div className="zona-cabecera">
        <button className="info-boton" onClick={mostrarInfo} title="Información">
          <InfoIcon />
        </button>
        <div
          className={`marcador-mezclas ${
            mezclasHechas >= mezclasTotales ? "completo" : "normal"
          }`}
        >
          <ShinyText
            text={markerText}
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </div>
      </div>

      <div
        className="zona-soltar"
        ref={(el) => {
          zonaRef.current = el;
          setNodeRef(el);
        }}
      >
        <button
          className="limpiar-boton"
          onClick={limpiarTablero}
          title="Limpiar tablero"
        >
          <CleaningServicesIcon />
        </button>

        {mezclasActivas.length === 0 ? (
          <p className="zona-indicacion">Arrastra aquí tus skins...</p>
        ) : (
          mezclasActivas.map((mezcla) => (
            <DraggableMezcla
              key={mezcla.reactId}
              mezcla={mezcla}
              activeDragId={activeDragId}
              animacion={animaciones[mezcla.reactId] || ""}
            />
          ))
        )}
      </div>

      {mostrarCombinacion && (
        <div className="popup-combinacion-exitosa">
          <div className="rayo-luz" />
          <img src={mostrarCombinacion.image_url} alt="combinacion" className="imagen-combinacion" />
          <div className="nombre-combinacion">{mostrarCombinacion.nombre}</div>
        </div>
      )}
    </div>
  );
};

export default ZonaDeMezclaTablero;
