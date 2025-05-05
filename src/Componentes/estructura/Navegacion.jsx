import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Login,
  Person,
  AdminPanelSettings,
  Logout,
  Menu as MenuIcon,
  Close as CloseIcon,
  Backpack,
} from "@mui/icons-material";
import logoGamerMix from "../../assets/logoGamerMix.png";
import "./Navegacion.css";
import { useTranslation } from "react-i18next";

const Navegacion = () => {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const usuarioPrueba = { username: "Ian Miguel" };
  const { t } = useTranslation("navegacion");

  const cerrarMenu = (accion) => {
    setMenuAbierto(false);
    if (accion) accion();
  };

  return (
    <>
      {/* Botón hamburguesa (visible solo en móvil) */}
      <button
        className="menu-toggle"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Fondo oscuro (solo móvil) */}
      {menuAbierto && window.innerWidth <= 768 && (
        <div
          className="navegacion-overlay"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* Menú de navegación */}
      <nav className={`navegacion ${menuAbierto ? "navegacion--abierta" : ""}`}>
        {/* Logo */}
        <div className="navegacion__logo">
          <img
            src={logoGamerMix}
            alt="Logo GamerMix"
            className="navegacion__logo-img"
          />
        </div>

        {/* Íconos */}
        <div className="navegacion__menu flex flex-col flex-grow items-center justify-center gap-10">
          <Link
            className="navegacion__icono"
            to="/"
            title={t("home")}
            onClick={() => cerrarMenu()}
          >
            <Home fontSize="large" />
            <span className="navegacion__texto">{t("home")}</span>
          </Link>

          {!sesionIniciada ? (
            <button
              className="navegacion__icono"
              title={t("login")}
              onClick={() => cerrarMenu(() => setSesionIniciada(true))}
            >
              <Login fontSize="large" />
              <span className="navegacion__texto">{t("login")}</span>
            </button>
          ) : (
            <>
              <Link
                className="navegacion__icono"
                to="/perfil"
                title={t("profile")}
                onClick={() => cerrarMenu()}
              >
                <Person fontSize="large" />
                <span className="navegacion__texto">{t("profile")}</span>
              </Link>
              <Link
                className="navegacion__icono"
                to="/gestionusuarios"
                title={t("users")}
                onClick={() => cerrarMenu()}
              >
                <AdminPanelSettings fontSize="large" />
                <span className="navegacion__texto">{t("users")}</span>
              </Link>
              <Link
                className="navegacion__icono"
                to="/coleccion"
                title={t("backpack")}
                onClick={() => cerrarMenu()}
              >
                <Backpack fontSize="large" />
                <span className="navegacion__texto">{t("backpack")}</span>
              </Link>
              <button
                className="navegacion__icono"
                title={t("logout")}
                onClick={() => cerrarMenu(() => setSesionIniciada(false))}
              >
                <Logout fontSize="large" />
                <span className="navegacion__texto">{t("logout")}</span>
              </button>
            </>
          )}
        </div>

        {/* Mensaje del usuario */}
        <div className="navegacion__mensaje">
          {sesionIniciada
            ? t("helloUser", { name: usuarioPrueba.username })
            : t("notLoggedIn")}
        </div>
      </nav>
    </>
  );
};

export default Navegacion;
