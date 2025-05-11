import React, { useContext } from "react";
import "./Contenido.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { contextoSesion } from "../../contextos/ProveedorSesion.jsx";

const Contenido = ({ children }) => {
  const { t } = useTranslation("contenido");
  const navigate = useNavigate();
  const { sesionIniciada } = useContext(contextoSesion);

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
          {!sesionIniciada && (
            <>
              <button className="boton-secundario" onClick={handleLogin}>
                {t("login")}
              </button>
              <button className="boton-principal" onClick={handleRegister}>
                {t("register")}
              </button>
            </>
          )}
        </div>
      </div>

      <article id="contenido_principal">{children}</article>
    </>
  );
};

export default Contenido;
