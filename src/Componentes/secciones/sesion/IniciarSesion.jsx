import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./IniciarSesion.css";
// Componentes de la biblioteca
import Ballpit from "../../../bibliotecas/Ballpit.jsx";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";

import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";

const IniciarSesion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("login");

  const handleLogin = () => {
    Swal.fire({
      title: t("connected"),
      text: t("successMessage"),
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
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <RandomSkinBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="gameboy-body">
          {/* Decoración izquierda */}
          <div className="decoration-side left">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>

          {/* Decoración derecha */}
          <div className="decoration-side right">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>

          <div className="gameboy-screen">
            {/* Ballpit de fondo */}
            <div className="gameboy-ballpit">
              <Ballpit
                count={200}
                gravity={1.5}
                friction={0.9}
                wallBounce={0.95}
                followCursor={false}
                colors={["#6fa8dc", "#a64dff", "#ff6666", "#f0f0f0", "#0f380f"]}
                ambientColor={0xffffff}
                ambientIntensity={0.8}
                lightIntensity={100}
                minSize={0.3}
                maxSize={0.8}
              />
            </div>

            {/* Contenido */}
            <div className="gameboy-content">
              <h2 className="screen-title">GamerMix</h2>
              <form onKeyDown={handleKeyDown}>
                <input
                  type="text"
                  placeholder={t("username")}
                  className="gameboy-input"
                />
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password")}
                    className="gameboy-input"
                  />
                  <div className="toggle-icon">
                    {showPassword ? (
                      <VisibilityOff onClick={() => setShowPassword(false)} />
                    ) : (
                      <Visibility onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Botones */}
          <div className="gameboy-buttons">
            <div className="dpad">
              <div className="up" />
              <div className="left" />
              <div className="center" />
              <div className="right" />
              <div className="down" />
            </div>

            <div className="btn-group">
              <button className="btn-a" onClick={handleLogin}>
                A
              </button>
              <label className="form-label">
                <ShinyText
                  text={t("pressAtoLogin")}
                  disabled={false}
                  speed={3}
                  className="custom-label"
                />
              </label>
            </div>

            <div className="btn-group">
              <div className="btn-b">B</div>
              <label className="form-label">
                <ShinyText
                  text={t("pressBtoCancel")}
                  disabled={false}
                  speed={3}
                  className="custom-label"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IniciarSesion;
