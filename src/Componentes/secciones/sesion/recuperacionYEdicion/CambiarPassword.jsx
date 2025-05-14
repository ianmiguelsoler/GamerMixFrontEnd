import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Ballpit from "../../../../bibliotecas/Ballpit.jsx";
import ShinyText from "../../../../bibliotecas/ShinyText.jsx";
import RandomSkinBackground from "../../../../bibliotecas/RandomSkinBackground.jsx";
import { contextoSesion } from "../../../../contextos/ProveedorSesion.jsx";
import { supabaseConexion } from "../../../../config/supabase.js";
import { mostrarNotificacion } from "../../../../bibliotecas/notificacionesUsuario/notificacionesUsuario.js";
import "./CambiarPassword.css";

const CambiarPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [repeatPassword, setRepeatPassword] = useState("");
  const { t } = useTranslation("cambiarPassword");
  const { actualizarDato, cambiarPassword, errorUsuario, limpiarError, datosSesion } =
    useContext(contextoSesion);
  const navigate = useNavigate();

  useEffect(() => {
    limpiarError();

    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      window.location.hash = "#/cambiar-password";
      setTimeout(() => {
        mostrarNotificacion({
          title: t("magicWelcomeTitle"),
          text: t("magicWelcomeText"),
          icon: "info",
          toast: true,
          position: "top-end",
          timer: 4500,
        });
      }, 300);
    }
  }, []);

  const handleSubmit = async () => {
    const newPassword = datosSesion.password;


    if (!newPassword || newPassword.length < 6) {
      mostrarNotificacion({
        title: t("passwordWeakTitle"),
        text: t("errorPasswordLength"),
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (newPassword !== repeatPassword) {
      mostrarNotificacion({
        title: t("passwordMismatchTitle"),
        text: t("passwordMismatch"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // ⚠️ Forzar recuperación de sesión
    await supabaseConexion.auth.refreshSession();
    const { data: sessionData } = await supabaseConexion.auth.getSession();

    if (!sessionData?.session?.user) {
      mostrarNotificacion({
        title: "Error",
        text: t("sessionMissing"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const resultado = await cambiarPassword();

    if (resultado?.success) {
      mostrarNotificacion({
        title: t("successMessage"),
        text: t("successMessage"),
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 4000,
      });

      setTimeout(() => {
        navigate("/perfil");
      }, 1000);
    } else {
      mostrarNotificacion({
        title: "Error",
        text: errorUsuario || t("errorMessage"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
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
                count={150}
                gravity={1.2}
                friction={0.95}
                wallBounce={0.8}
                followCursor={false}
                colors={["#ff66cc", "#66ccff", "#f0f0f0", "#ffcc00", "#3b82f6"]}
              />
            </div>

            <div className="gameboy-content">
              <h2 className="screen-title">{t("title")}</h2>
              <p className="screen-subtitle">{t("subtitle")}</p>
              <form onKeyDown={handleKeyDown}>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("passwordPlaceholder")}
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
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="repeatPassword"
                    placeholder={t("repeatPasswordPlaceholder")}
                    className="gameboy-input"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="gameboy-buttons">
            <div className="dpad">
              <div className="up" />
              <div className="left" />
              <div className="center" />
              <div className="right" />
              <div className="down" />
            </div>

            <div className="btn-group">
              <button className="btn-a" onClick={handleSubmit}>
                A
              </button>
              <label className="form-label">
                <ShinyText
                  text={t("confirmButton")}
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
                  text={t("shortcutHint")}
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

export default CambiarPassword;
