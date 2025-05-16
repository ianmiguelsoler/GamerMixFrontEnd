import React from "react";
import TiltedCard from "../../../bibliotecas/TiltedCard";
import "./ColeccionImagenes.css";

const ColeccionImagenes = ({ skins }) => {
  return (
    <div className="coleccion__grid">
      {skins.map((skin) => (
        <div key={skin.id} className="coleccion__cuadro">
          {skin.desbloqueada ? (
            <TiltedCard
              imageSrc={skin.image_url}
              altText={skin.nombre_combinacion}
              captionText={skin.nombre_combinacion}
              containerHeight="300px"
              containerWidth="200px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <>
                  <p className="tilted-card-demo-text subtitulo">{skin.skin?.nombre_skin}</p>
                </>
              }
            />
          ) : (
            <div className="coleccion__placeholder">
              <span className="candado">🔒</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ColeccionImagenes;
