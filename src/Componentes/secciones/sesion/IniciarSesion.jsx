import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./IniciarSesion.css";

import Ballpit from "../../../bibliotecas/Ballpit.jsx";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import { mostrarNotificacion } from "../../../bibliotecas/notificacionesUsuario/notificacionesUsuario.js";

const IniciarSesion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("login");
  const {
    actualizarDato,
    iniciarSesion,
    restablecerPassword,
    datosSesion,
    errorUsuario,
  } = useContext(contextoSesion);

  const handleLogin = async () => {
    const resultado = await iniciarSesion();

    if (resultado.success) {
      mostrarNotificacion({
        title: t("connected"),
        text: t("successMessage"),
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 4000,
      });
    } else {
      mostrarNotificacion({
        title: t("errorTitle"),
        text: resultado.message || t("errorMessage"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleForgotPassword = async () => {
    if (!datosSesion.email) {
      mostrarNotificacion({
        title: t("forgotPasswordEmptyTitle"),
        text: t("forgotPasswordEmptyText"),
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const resultado = await restablecerPassword();

    if (!resultado.success) {
      mostrarNotificacion({
        title: t("forgotPasswordErrorTitle"),
        text: resultado.error || t("forgotPasswordErrorText"),
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      mostrarNotificacion({
        title: t("forgotPasswordSuccessTitle"),
        text: t("forgotPasswordSuccessText"),
        icon: "info",
        toast: true,
        position: "top",
        timer: 5000,
      });
    }
  };

  return (
    <div className="gamboy-div-principal-contenido">
      <RandomSkinBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="gameboy-body">
          <div className="gameboy-screen">
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

            <div className="gameboy-content">
              <h2 className="screen-title">GamerMix</h2>
              <form onKeyDown={handleKeyDown}>
                <input
                  type="email"
                  name="email"
                  placeholder={t("email")}
                  className="gameboy-input"
                  onChange={actualizarDato}
                />
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("password")}
                    className="gameboy-input"
                    onChange={actualizarDato}
                  />
                  <div className="toggle-icon">
                    {showPassword ? (
                      <VisibilityOff onClick={() => setShowPassword(false)} />
                    ) : (
                      <Visibility onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="forgot-password-text"
                  onClick={handleForgotPassword}
                >
                  {t("forgotPassword")}
                </button>
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
