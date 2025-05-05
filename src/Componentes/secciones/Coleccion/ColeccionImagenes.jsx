import React from "react";
import TiltedCard from "../../../bibliotecas/TiltedCard";
import "./ColeccionImagenes.css";

const ColeccionImagenes = ({ skins }) => {
  return (
    <div className="coleccion__grid">
      {skins.map((skin) =>
        skin.desbloqueada ? (
          <div key={skin.id} className="coleccion__cuadro">
            <TiltedCard
              imageSrc={skin.imagen}
              altText={`Skin ${skin.id}`}
              captionText={`Skin ${skin.id}`}
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
                <p className="tilted-card-demo-text">Skin {skin.id}</p>
              }
            />
          </div>
        ) : (
          <div key={skin.id} className="coleccion__cuadro">
            <div className="coleccion__locked">
              <span className="candado">🔒</span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ColeccionImagenes;
