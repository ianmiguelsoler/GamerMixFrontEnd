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
import { mostrarNotificacion } from "../../../bibliotecas/notificacionesUsuario/notificacionesUsuario.js"; 

const CrearCuenta = () => {
  const { t } = useTranslation("registro");
  const { actualizarDato, errorUsuario, crearCuenta, datosSesion } =
    useContext(contextoSesion);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

const handleRegister = async () => {
  const { email, password, nombre_usuario } = datosSesion;

  // 🟡 Alerta: Campos vacíos
  if (!email || !password || !nombre_usuario) {
    return mostrarNotificacion({
      title: t("errorTitle"),
      text: t("missingFields"),
      icon: "warning",
      confirmButtonText: "Aceptar",
    });
  }

  // 🔴 Alerta: Email inválido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return mostrarNotificacion({
      title: t("errorTitle"),
      text: t("invalidEmail"),
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }

  // 🔴 Alerta: Contraseña débil
  if (password.length < 6) {
    return mostrarNotificacion({
      title: t("errorTitle"),
      text: t("weakPassword"),
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  }

  setLoading(true);

  const resultado = await crearCuenta();

  setLoading(false);

  // 🔵 Alerta: Registro exitoso
  if (resultado.success) {
    return mostrarNotificacion({
      title: t("registrationSuccessTitle"),
      text: t("registrationSuccessMessage"),
      icon: "info",
      toast: true,
      timer: 4000,
      position: "top",
    });
  }

  // 🔴 Alerta: Error al registrar
  return mostrarNotificacion({
    title: t("errorTitle"),
    text: t(resultado.error) || t("errorMessage"),
    icon: "error",
    confirmButtonText: "Aceptar",
    customClass: {
      popup: "z-top-alert",
    },
  });
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
              <ShinyText
                text={t("username")}
                disabled={false}
                speed={3}
                className="custom-class"
              />
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
              <ShinyText
                text={t("email")}
                disabled={false}
                speed={3}
                className="custom-class"
              />
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
              <ShinyText
                text={t("password")}
                disabled={false}
                speed={3}
                className="custom-class"
              />
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
                <VisibilityOff
                  onClick={togglePasswordVisibility}
                  className="form-icon clickable"
                />
              ) : (
                <Visibility
                  onClick={togglePasswordVisibility}
                  className="form-icon clickable"
                />
              )}
            </div>
          </div>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          className="form-button"
          disabled={loading}
        >
          {loading ? t("registering") || "Registrando..." : t("registerButton")}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CrearCuenta;
