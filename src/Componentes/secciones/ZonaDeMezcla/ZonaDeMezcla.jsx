import React, { useEffect, useState, useRef, useContext } from "react";
import Swal from "sweetalert2";
import InfoIcon from "@mui/icons-material/Info";
import "./ZonaDeMezcla.css";

import { useTranslation } from "react-i18next";
import { contextoLogros } from "../../../contextos/ProveedorMezclasLogros.jsx";
import ZonaDeMezclaBarraLateral from "./ZonaDeMezclaBarraLateral/ZonaDeMezclaBarraLateral.jsx";
import ZonaDeMezclaTablero from "./ZonaDeMezclaTablero/ZonaDeMezclaTablero.jsx";
import { generarUuidAleatorio } from "../../../bibliotecas/funciones/funciones.js";

import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  DragOverlay,
} from "@dnd-kit/core";

const ZonaDeMezcla = () => {
  const { t } = useTranslation("zonaDeMezcla");
  const {
    items,
    skins,
    combinacionesConEstado,
  } = useContext(contextoLogros);

  const [mezclasActivas, setMezclasActivas] = useState([]);
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);

  const zonaRef = useRef(null);

  // 🔧 ACTIVAMOS Pointer + Touch para dispositivos móviles
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // más cómodo en móvil
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const mezclasHechas = combinacionesConEstado.filter(c => c.obtenida).length;
  const mezclasTotales = combinacionesConEstado.length;

  const mostrarInfo = () => {
    Swal.fire({
      title: t("popupTitle"),
      html: `
        <p style="font-size: 14px;">${t("popupText1")}</p>
        <p style="font-size: 14px;">${t("popupText2")}</p>
      `,
      icon: "info",
      confirmButtonText: t("understood"),
      confirmButtonColor: "#9e79ff",
      background: "#1e1e1e",
      color: "#ffffff",
    });
  };

  const handleDragStart = (event) => {
    const icono = event.active.data.current?.icono;
    const source = event.active.data.current?.source;

    setActiveDragId(event.active.id);

    if (source === "barra" && icono) {
      setActiveDragItem(icono);
    } else {
      const mezcla = mezclasActivas.find((m) => m.reactId === event.active.id);
      setActiveDragItem(mezcla || null);
    }
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveDragItem(null);
    setActiveDragId(null);

    if (!over || over.id !== "zona-soltar") return;

    const zona = zonaRef.current.getBoundingClientRect();
    const offsetX = active.rect.current.translated?.left ?? 0;
    const offsetY = active.rect.current.translated?.top ?? 0;

    const x = offsetX - zona.left;
    const y = offsetY - zona.top;

    const source = active.data.current?.source;
    const icono = active.data.current?.icono;

    if (source === "barra" && icono) {
      setMezclasActivas((prev) => [
        ...prev,
        {
          reactId: generarUuidAleatorio(),
          tipo: icono.tipo,
          id: icono.id,
          url: icono.url,
          x,
          y,
        },
      ]);
    } else if (source === "tablero") {
      setMezclasActivas((prev) =>
        prev.map((m) =>
          m.reactId === active.id ? { ...m, x, y } : m
        )
      );
    }
  };

  useEffect(() => {
    if (mezclasHechas === 0) {
      mostrarInfo();
    }
  }, [mezclasHechas]);

  const iconos = [
    ...items.map((item) => ({ ...item, tipo: "item", url: item.image_url })),
    ...skins.map((skin) => ({ ...skin, tipo: "skin", url: skin.image_url })),
  ];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="zona-de-mezcla">
        <ZonaDeMezclaTablero
          mezclasActivas={mezclasActivas}
          setMezclasActivas={setMezclasActivas}
          zonaRef={zonaRef}
          mostrarInfo={mostrarInfo}
          mezclasHechas={mezclasHechas}
          mezclasTotales={mezclasTotales}
          markerText={t("markerText", {
            hechas: mezclasHechas,
            totales: mezclasTotales,
          })}
          activeDragId={activeDragId}
          activeDragItem={activeDragItem}
        />
        <ZonaDeMezclaBarraLateral iconos={iconos} />
      </div>

      <DragOverlay>
        {activeDragItem && (
          <img
            src={activeDragItem.url}
            alt="drag-preview"
            className="mezcla-preview"
            style={{
              transform: "scale(1.1)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default ZonaDeMezcla;
