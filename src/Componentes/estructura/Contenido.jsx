import React from "react";
import "./Contenido.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Contenido = ({ children }) => {
  const { t } = useTranslation("contenido");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/iniciarsesion");
  };

  const handleRegister = () => {
    navigate("/crearcuenta");
  };

  return (
    <>
      <div className="contenido__topbar">
        <div className="contenido__actions">
          <button className="boton-secundario" onClick={handleLogin}>
            {t("login")}
          </button>
          <button className="boton-principal" onClick={handleRegister}>
            {t("register")}
          </button>
        </div>
      </div>

      <article id="contenido_principal">{children}</article>
    </>
  );
};

export default Contenido;
