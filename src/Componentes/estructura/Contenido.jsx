import React from "react";
import "./Contenido.css";
import { useTranslation } from "react-i18next";

const Contenido = ({ children }) => {
  const { t } = useTranslation("contenido"); // Puedes usar otro namespace si prefieres

  return (
    <>
      <div className="contenido__topbar">
        <div className="contenido__actions">
          <button className="boton-secundario">{t("login")}</button>
          <button className="boton-principal">{t("register")}</button>
        </div>
      </div>

      <article id="contenido_principal">{children}</article>
    </>
  );
};

export default Contenido;
