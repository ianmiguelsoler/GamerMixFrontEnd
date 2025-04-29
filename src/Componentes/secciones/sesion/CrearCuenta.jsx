import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Email, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import "./CrearCuenta.css";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import TextPressure from "../../../bibliotecas/TextPressure.jsx";

const CrearCuenta = () => {
  const { t } = useTranslation("registro");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = () => {
    Swal.fire({
      title: t("title"),
      text: t("successMessage"),
      icon: "success",
      confirmButtonText: "Aceptar",
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRegister();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="crear-cuenta-container"
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
            {" "}
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
              placeholder={t("usernamePlaceholder")}
              className="form-input"
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
              placeholder={t("emailPlaceholder")}
              className="form-input"
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
              placeholder={t("passwordPlaceholder")}
              className="form-input"
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
      >
        {t("registerButton")}
      </motion.button>
    </motion.div>
  );
};

export default CrearCuenta;
