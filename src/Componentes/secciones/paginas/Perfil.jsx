import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarBorder from "../../../bibliotecas/StarBorder.jsx";
import { mostrarModalIdioma } from "../../../bibliotecas/funciones/funciones.js"; 
import "./Perfil.css";

const Perfil = () => {
  const navegar = useNavigate();
  const { t } = useTranslation("perfil");

  const usuario = {
    username: "gamer123",
    email: "gamer@example.com",
    rol: "Administrador",
    createdAt: "2024-02-15T12:00:00Z",
  };

  const mostrarNotificacion = () => {
    Swal.fire({
      title: t("toastTitle"),
      text: t("toastMessage"),
      icon: "info",
      confirmButtonText: "OK",
      showConfirmButton: false,
      timer: 2500,
      position: "top-end",
      toast: true,
    });
  };

  const irARecuperarContrasena = () => {
    navegar("/recuperar-contraseña");
  };

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">{t("noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-contenido">
          <div className="perfil-avatar">
            <img src="https://i.pravatar.cc/150" alt={t("title")} />
          </div>

          <div className="perfil-info">
            <h1 className="perfil-titulo pixelated">{usuario.username}</h1>
            <p>
              <span className="perfil-label">{t("email")}</span> {usuario.email}
            </p>
            <p>
              <span className="perfil-label">{t("role")}</span>{" "}
              {usuario.rol || "Usuario"}
            </p>
          </div>
        </div>

        <div className="perfil-detalles">
          <p className="perfil-creacion">
            <span className="perfil-label">{t("creation")}</span>{" "}
            {new Date(usuario.createdAt).toLocaleDateString()}
          </p>

          <div className="perfil-botones">
            <StarBorder
              as="button"
              className="boton-pixel boton-editar"
              color="cyan"
              speed="2s"
              onClick={mostrarNotificacion}
            >
              {t("editButton")}
            </StarBorder>

            <StarBorder
              as="button"
              className="boton-pixel boton-idioma"
              color="blue"
              speed="2s"
              onClick={mostrarModalIdioma}
            >
              {t("changeLanguageButton")}
            </StarBorder>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
