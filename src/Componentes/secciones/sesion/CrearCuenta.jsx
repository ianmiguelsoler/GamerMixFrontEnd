import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Email, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import "./CrearCuenta.css";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import TextPressure from "../../../bibliotecas/TextPressure.jsx";
import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";

const CrearCuenta = () => {
  const { t } = useTranslation("registro");
  const { actualizarDato, errorUsuario, crearCuenta } = useContext(contextoSesion);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async () => {
    await crearCuenta();

    const recursionError =
      errorUsuario &&
      errorUsuario.includes("infinite recursion detected in policy");

    if (!errorUsuario || recursionError) {
      Swal.fire({
        title: t("registrationSuccessTitle"),
        text: t("registrationSuccessMessage"),
        icon: "info",
        position: "top",
        showConfirmButton: false,
        timer: 4000,
        toast: true,
      });
    } else {
      Swal.fire({
        title: t("errorTitle"),
        text: t("errorMessage"),
        footer: `<small style="color: red;">${errorUsuario}</small>`,
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: {
          popup: "z-top-alert",
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRegister();
    }
  };

  return (
    <div className="contenedor-principal-registro" style={{ height: "65vh" }}>
      <RandomSkinBackground />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="crear-cuenta-container"
        style={{ position: "relative", zIndex: 1, height: "140vh" }}
      >
        <div style={{ position: "relative", height: "200px" }}>
          <TextPressure
            text={t("title")}
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#ff0000"
            minFontSize={36}
          />
        </div>

        <form onKeyDown={handleKeyDown} className="crear-cuenta-form">
          {/* Usuario */}
          <div className="form-row">
            <label className="form-label">
              <ShinyText text={t("username")} disabled={false} speed={3} className="custom-class" />
            </label>
            <div className="form-input-icon">
              <input
                type="text"
                name="nombre_usuario"
                placeholder={t("usernamePlaceholder")}
                className="form-input"
                onChange={actualizarDato}
              />
              <Person className="form-icon" />
            </div>
          </div>

          {/* Email */}
          <div className="form-row">
            <label className="form-label">
              <ShinyText text={t("email")} disabled={false} speed={3} className="custom-class" />
            </label>
            <div className="form-input-icon">
              <input
                type="email"
                name="email"
                placeholder={t("emailPlaceholder")}
                className="form-input"
                onChange={actualizarDato}
              />
              <Email className="form-icon" />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-row">
            <label className="form-label">
              <ShinyText text={t("password")} disabled={false} speed={3} className="custom-class" />
            </label>
            <div className="form-input-icon">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("passwordPlaceholder")}
                className="form-input"
                onChange={actualizarDato}
              />
              {showPassword ? (
                <VisibilityOff onClick={togglePasswordVisibility} className="form-icon clickable" />
              ) : (
                <Visibility onClick={togglePasswordVisibility} className="form-icon clickable" />
              )}
            </div>
          </div>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          className="form-button"
        >
          {t("registerButton")}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CrearCuenta;
