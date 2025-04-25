import React, { useState } from "react";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./IniciarSesion.css";

const IniciarSesion = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    Swal.fire({
      title: "¡Conectado!",
      text: "Inicio de sesión exitoso (GameBoy Style)",
      icon: "success",
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="gameboy-body">
      <div className="gameboy-screen">
        <h2 className="screen-title">GamerMix</h2>
        <form onKeyDown={handleKeyDown}>
          <input type="text" placeholder="Usuario" className="gameboy-input" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="gameboy-input"
          />
          <div className="toggle-icon">
            {showPassword ? (
              <VisibilityOff onClick={() => setShowPassword(false)} />
            ) : (
              <Visibility onClick={() => setShowPassword(true)} />
            )}
          </div>
        </form>
        <button className="btn-a" onClick={handleLogin}>
          A (Entrar)
        </button>
      </div>
      <div className="gameboy-buttons">
        <div className="btn-b">B</div>
        <div className="dpad">
          <div className="up" />
          <div className="left" />
          <div className="right" />
          <div className="down" />
        </div>
      </div>
    </div>
  );
};

export default IniciarSesion;
