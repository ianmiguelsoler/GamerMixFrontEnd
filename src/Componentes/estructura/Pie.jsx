import React from "react";
import "./Pie.css";
import Ballpit from "../../bibliotecas/Ballpit.jsx";

const Pie = () => {
  return (
    <footer id="pie">
      <p>© 2025 - Todos los derechos reservados Ian Miguel Soler</p>
      <div
        style={{
          bottom: 0,
          left: 0,
          width: "100%",
          height: "250px",
          overflow: "hidden",
        }}
      >
        <Ballpit
          count={100}
          gravity={0.5}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
          colors={["#3b82f6", "#a855f7", "#d1d5db"]} // Azul, Violeta, Gris claro
          ambientColor={16777215}
          ambientIntensity={1}
          lightIntensity={200}
          minSize={0.5}
          maxSize={1}
          size0={1}
          maxVelocity={0.15}
          maxX={5}
          maxY={5}
          maxZ={2}
        />
      </div>
    </footer>
  );
};

export default Pie;
