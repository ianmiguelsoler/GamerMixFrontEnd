import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Login,
  Person,
  AdminPanelSettings,
  Logout,
} from "@mui/icons-material";
import logoGamerMix from "../../assets/logoGamerMix.png";
import "./Navegacion.css";

const Navegacion = () => {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const usuarioPrueba = { username: "Ian Miguel" };

  return (
    <motion.nav
      className="navegacion"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo en la parte superior */}
      <div className="navegacion__logo">
        <img
          src={logoGamerMix}
          alt="Logo GamerMix"
          className="navegacion__logo-img"
        />
      </div>

      <div className="navegacion__menu flex flex-col flex-grow items-center justify-center gap-10">
        <Link className="navegacion__icono" to="/">
          <Home fontSize="large" />
        </Link>

        {!sesionIniciada ? (
          <button
            className="navegacion__icono"
            onClick={() => setSesionIniciada(true)}
          >
            <Login fontSize="large" />
          </button>
        ) : (
          <>
            <Link className="navegacion__icono" to="/perfil">
              <Person fontSize="large" />
            </Link>

            <Link className="navegacion__icono" to="/gestionusuarios">
              <AdminPanelSettings fontSize="large" />
            </Link>

            <button
              className="navegacion__icono"
              onClick={() => setSesionIniciada(false)}
            >
              <Logout fontSize="large" />
            </button>
          </>
        )}
      </div>

      <div className="navegacion__mensaje">
        {sesionIniciada
          ? `Hola, ${usuarioPrueba.username}`
          : "No has iniciado sesión"}
      </div>
    </motion.nav>
  );
};

export default Navegacion;
