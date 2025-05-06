import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarBorder from "../../../bibliotecas/StarBorder.jsx";
import { mostrarModalIdioma } from "../../../bibliotecas/funciones/funciones.js";
import "./Perfil.css";
import DecryptedText from "../../../bibliotecas/DecryptedText.jsx";
import Ballpit from "../../../bibliotecas/Ballpit.jsx";
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
      <div className="ballpit-background">
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
      <div className="perfil-card">
        <div className="perfil-contenido">
          <div className="perfil-avatar">
            <img src="https://i.pravatar.cc/150" alt={t("title")} />
          </div>

          <div className="perfil-info">
            <DecryptedText
              text={usuario.username}
              speed={70}
              maxIterations={15}
              sequential={true}
              revealDirection="center"
              className="perfil-titulo pixelated"
              parentClassName="perfil-decrypt-container"
              encryptedClassName="perfil-encrypted"
            />

            <p>
              <span className="perfil-label">{t("email")}</span>{" "}
              <DecryptedText
                text={usuario.email}
                speed={60}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
                className="perfil-texto"
                parentClassName="perfil-decrypt-container"
                encryptedClassName="perfil-encrypted"
              />
            </p>

            <p>
              <span className="perfil-label">{t("role")}</span>{" "}
              <DecryptedText
                text={usuario.rol || "Usuario"}
                speed={60}
                maxIterations={10}
                sequential={true}
                revealDirection="start"
                className="perfil-texto"
                parentClassName="perfil-decrypt-container"
                encryptedClassName="perfil-encrypted"
              />
            </p>
          </div>
        </div>

        <div className="perfil-detalles">
          <p className="perfil-creacion">
            <span className="perfil-label">{t("creation")}</span>{" "}
            <DecryptedText
              text={new Date(usuario.createdAt).toLocaleDateString()}
              speed={50}
              maxIterations={8}
              sequential={true}
              revealDirection="end"
              className="perfil-texto"
              parentClassName="perfil-decrypt-container"
              encryptedClassName="perfil-encrypted"
            />
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
