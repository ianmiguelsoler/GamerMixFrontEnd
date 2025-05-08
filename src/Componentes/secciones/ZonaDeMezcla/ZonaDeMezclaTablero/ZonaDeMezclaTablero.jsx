import React, { useRef } from "react";
import "./ZonaDeMezclaTablero.css"; 
import ShinyText from "../../../../bibliotecas/ShinyText.jsx";
import InfoIcon from "@mui/icons-material/Info";

const ZonaDeMezclaTablero = ({
  mezclasActivas,
  setMezclasActivas,
  zonaRef,
  mostrarInfo,
  mezclasHechas,
  mezclasTotales,
  markerText,
}) => {
  const arrastrandoIndex = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const url = e.dataTransfer.getData("skinURL");

    const rect = zonaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (url) {
      setMezclasActivas((prev) => [...prev, { url, x, y }]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleMouseDown = (index, e) => {
    arrastrandoIndex.current = index;
    const zona = zonaRef.current;

    const moveHandler = (eMove) => {
      if (arrastrandoIndex.current === null) return;

      const rect = zona.getBoundingClientRect();
      const x = eMove.clientX - rect.left;
      const y = eMove.clientY - rect.top;

      setMezclasActivas((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], x, y };
        return updated;
      });
    };

    const upHandler = () => {
      arrastrandoIndex.current = null;
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
  };

  return (
    <div className="zona-central">
      <div className="zona-cabecera">
        <button className="info-boton" onClick={mostrarInfo} title="Información">
          <InfoIcon />
        </button>
        <div className={`marcador-mezclas ${mezclasHechas >= mezclasTotales ? "completo" : "normal"}`}>
          <ShinyText
            text={markerText}
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </div>
      </div>

      <div className="zona-soltar" ref={zonaRef} onDrop={handleDrop} onDragOver={handleDragOver}>
        {mezclasActivas.length === 0 ? (
          <p className="zona-indicacion">Arrastra aquí tus skins...</p>
        ) : (
          mezclasActivas.map((mezcla, index) => (
            <img
              key={index}
              src={mezcla.url}
              alt={`mezcla-${index}`}
              className="mezcla-preview"
              style={{ left: mezcla.x, top: mezcla.y }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ZonaDeMezclaTablero;
