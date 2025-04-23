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
} from "@mui/icons-material";
import logoGamerMix from "../../assets/logoGamerMix.png";
import "./Navegacion.css";

const Navegacion = () => {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const usuarioPrueba = { username: "Ian Miguel" };

  const cerrarMenu = (accion) => {
    setMenuAbierto(false);
    if (accion) accion();
  };

  return (
    <>
      {/* Botón hamburguesa (visible solo en móvil) */}
      <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
  {menuAbierto ? <CloseIcon /> : <MenuIcon />}
</button>


      {/* Fondo oscuro (solo móvil) */}
      {menuAbierto && window.innerWidth <= 768 && (
        <div className="navegacion-overlay" onClick={() => setMenuAbierto(false)} />
      )}

      {/* Menú de navegación */}
      <nav className={`navegacion ${menuAbierto ? "navegacion--abierta" : ""}`}>
        {/* Logo */}
        <div className="navegacion__logo">
          <img src={logoGamerMix} alt="Logo GamerMix" className="navegacion__logo-img" />
        </div>

        {/* Íconos */}
        <div className="navegacion__menu flex flex-col flex-grow items-center justify-center gap-10">
          <Link className="navegacion__icono" to="/" onClick={() => cerrarMenu()}>
            <Home fontSize="large" />
          </Link>

          {!sesionIniciada ? (
            <button
              className="navegacion__icono"
              onClick={() => cerrarMenu(() => setSesionIniciada(true))}
            >
              <Login fontSize="large" />
            </button>
          ) : (
            <>
              <Link className="navegacion__icono" to="/perfil" onClick={() => cerrarMenu()}>
                <Person fontSize="large" />
              </Link>
              <Link className="navegacion__icono" to="/gestionusuarios" onClick={() => cerrarMenu()}>
                <AdminPanelSettings fontSize="large" />
              </Link>
              <button
                className="navegacion__icono"
                onClick={() => cerrarMenu(() => setSesionIniciada(false))}
              >
                <Logout fontSize="large" />
              </button>
            </>
          )}
        </div>

        {/* Mensaje del usuario */}
        <div className="navegacion__mensaje">
          {sesionIniciada ? `Hola, ${usuarioPrueba.username}` : "No has iniciado sesión"}
        </div>
      </nav>
    </>
  );
};

export default Navegacion;
