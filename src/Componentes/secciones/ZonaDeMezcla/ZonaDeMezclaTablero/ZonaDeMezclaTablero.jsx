import React, { useEffect, useContext, useState } from "react";
import "./ZonaDeMezclaTablero.css";
import ShinyText from "../../../../bibliotecas/ShinyText.jsx";
import InfoIcon from "@mui/icons-material/Info";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { contextoLogros } from "../../../../contextos/ProveedorMezclasLogros.jsx";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("zonaDeMezcla");
  const { setNodeRef } = useDroppable({ id: "zona-soltar" });

  const {
    verificarYGuardarCombinacion,
    mezclasHechas,
    mezclasTotales,
  } = useContext(contextoLogros);

  const [animaciones, setAnimaciones] = useState({});
  const [mostrarCombinacion, setMostrarCombinacion] = useState(null);

  const limpiarTablero = () => setMezclasActivas([]);

  useEffect(() => {
    if (mostrarCombinacion) {
      document.body.classList.add("popup-activo");
    } else {
      document.body.classList.remove("popup-activo");
    }

    return () => {
      document.body.classList.remove("popup-activo");
    };
  }, [mostrarCombinacion]);

  useEffect(() => {
    if (!activeDragItem || !mezclasActivas.length) return;

    const RANGO_COMBINACION = 80;

    const dragged = activeDragItem;
    const overlapped = mezclasActivas.find(
      (m) =>
        m.reactId !== dragged.reactId &&
        Math.abs(m.x - dragged.x) < RANGO_COMBINACION &&
        Math.abs(m.y - dragged.y) < RANGO_COMBINACION
    );

    if (!overlapped) return;

    const skin = [dragged, overlapped].find((m) => m.tipo === "skin");
    const item = [dragged, overlapped].find((m) => m.tipo === "item");

    if (!skin || !item) return;

    const ejecutarComprobacion = async () => {
      const resultado = await verificarYGuardarCombinacion(item.id, skin.id);
      const newAnimations = {};

      if (!resultado) {
        newAnimations[skin.reactId] = "mezcla-error";
        newAnimations[item.reactId] = "mezcla-error";
        setAnimaciones(newAnimations);
        setTimeout(() => setAnimaciones({}), 300);
      } else {
        newAnimations[skin.reactId] = "mezcla-exito";
        newAnimations[item.reactId] = "mezcla-exito";
        setAnimaciones(newAnimations);
        setTimeout(() => setAnimaciones({}), 150);
        setTimeout(() => {
          setMostrarCombinacion({
            nombre: resultado.nombre_combinacion,
            descripcion: resultado.descripcion,
            image_url: resultado.image_url,
          });
        }, 160);
      }
    };

    ejecutarComprobacion();
  }, [mezclasActivas, activeDragItem]);

  return (
    <div className="zona-central">
      <div className="zona-cabecera">
        <button
          className="info-boton"
          onClick={mostrarInfo}
          title={t("tooltipInfo")}
        >
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
          title={t("tooltipClear")}
        >
          <CleaningServicesIcon />
        </button>

        {mezclasActivas.length === 0 ? (
          <p className="zona-indicacion">{t("dropHint")}</p>
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
        <div
          className="popup-combinacion-exitosa"
          onClick={() => setMostrarCombinacion(null)}
        >
          <div className="rayo-luz" />
          <img
            src={mostrarCombinacion.image_url}
            alt="combinacion"
            className="imagen-combinacion"
          />
          <div className="nombre-combinacion">{mostrarCombinacion.nombre}</div>
          <div className="descripcion-combinacion">
            {mostrarCombinacion.descripcion}...{" "}
            <span className="continua-historia">
              {t("continueInCollection")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZonaDeMezclaTablero;
