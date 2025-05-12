import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Person,
  AdminPanelSettings,
  Logout,
  Menu as MenuIcon,
  Close as CloseIcon,
  Backpack,
  SportsEsports,
  Login,
} from "@mui/icons-material";
import logoGamerMix from "../../assets/logoGamerMix.png";
import "./Navegacion.css";
import { useTranslation } from "react-i18next";
import { mostrarModalIdioma } from "../../bibliotecas/funciones/funciones.js";
import StarBorder from "../../bibliotecas/StarBorder.jsx";
import { useSound } from "../../contextos/AdministradorDeSonido.jsx";
import { contextoSesion } from "../../contextos/ProveedorSesion.jsx";

const Navegacion = () => {
  const { t } = useTranslation("navegacion");
  const { sonidoActivo, setSonidoActivo } = useSound();
  const { sesionIniciada, usuario, cerrarSesion } = useContext(contextoSesion);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = (accion) => {
    setMenuAbierto(false);
    if (accion) accion();
  };
  const sesionActiva = Boolean(sesionIniciada && usuario);
  return (
    <>
      <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? <CloseIcon /> : <MenuIcon />}
      </button>

      {menuAbierto && window.innerWidth <= 768 && (
        <div className="navegacion-overlay" onClick={() => setMenuAbierto(false)} />
      )}

      <nav className={`navegacion ${menuAbierto ? "navegacion--abierta" : ""}`}>
        <div className="navegacion__logo">
          <img src={logoGamerMix} alt="Logo GamerMix" className="navegacion__logo-img" />
        </div>

        <div className="navegacion__menu flex flex-col flex-grow items-center justify-center gap-10">
          {/* 🔗 Inicio */}
          <Link className="navegacion__icono" to="/" title={t("home")} onClick={() => cerrarMenu()}>
            <Home fontSize="large" />
            <span className="navegacion__texto">{t("home")}</span>
          </Link>

          {/* 🌍 Idioma */}
          <StarBorder
            as="button"
            className="navegacion__boton-idioma boton-pixel"
            color="blue"
            speed="2s"
            onClick={mostrarModalIdioma}
          >
            🌍 {t("language")}
          </StarBorder>

          {/* 🔊 Sonido */}
          <button
            className={`boton-pixel navegacion__boton-sonido ${sonidoActivo ? "activo" : "inactivo"}`}
            onClick={() => setSonidoActivo(!sonidoActivo)}
            title={sonidoActivo ? t("soundOff") : t("soundOn")}
          >
            {sonidoActivo ? t("soundOn") : t("soundOff")}
          </button>

          {!sesionIniciada ? (
            <Link className="navegacion__icono" to="/iniciarsesion" title={t("login")} onClick={() => cerrarMenu()}>
              <Login fontSize="large" />
              <span className="navegacion__texto">{t("login")}</span>
            </Link>
          ) : (
            <>
              <Link className="navegacion__icono" to="/jugar" title={t("play")} onClick={() => cerrarMenu()}>
                <SportsEsports fontSize="large" />
                <span className="navegacion__texto">{t("play")}</span>
              </Link>

              <Link className="navegacion__icono" to="/perfil" title={t("profile")} onClick={() => cerrarMenu()}>
                <Person fontSize="large" />
                <span className="navegacion__texto">{t("profile")}</span>
              </Link>

              <Link className="navegacion__icono" to="/coleccion" title={t("backpack")} onClick={() => cerrarMenu()}>
                <Backpack fontSize="large" />
                <span className="navegacion__texto">{t("backpack")}</span>
              </Link>

              {usuario?.rol === "admin" && (
                <Link
                  className="navegacion__icono"
                  to="/gestionusuarios"
                  title={t("users")}
                  onClick={() => cerrarMenu()}
                >
                  <AdminPanelSettings fontSize="large" />
                  <span className="navegacion__texto">{t("users")}</span>
                </Link>
              )}

              <button className="navegacion__icono" title={t("logout")} onClick={() => cerrarMenu(cerrarSesion)}>
                <Logout fontSize="large" />
                <span className="navegacion__texto">{t("logout")}</span>
              </button>
            </>
          )}
        </div>

        {/* 🧾 Mensaje inferior */}
        <div className="navegacion__mensaje">
          {sesionIniciada
            ? t("helloUser", { name: usuario.nombre_usuario || "..." })
            : t("notLoggedIn")}
        </div>
      </nav>
    </>
  );
};

export default Navegacion;
