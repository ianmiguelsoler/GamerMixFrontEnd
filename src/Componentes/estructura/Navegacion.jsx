import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Login, ShoppingCart, Person, ListAlt as ListAltIcon } from "@mui/icons-material";
import CerrarSesion from "../secciones/sesion/CerrarSesion.jsx";

const Navegacion = () => {
  // const { usuario, sesionIniciada } = useContext(contextoSesion);
  return (
    <motion.nav
      className="bg-green-500 p-3 shadow-lg flex flex-col items-center h-screen w-48 fixed left-0 top-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-white text-2xl font-bold mb-8">
        Lista de la Compra
      </div>
      <div className="text-white text-lg mb-4">
        {sesionIniciada && usuario?.username
          ? `Hola, ${usuario.username}`
          : "No has iniciado sesión"}
      </div>
      <div className="flex flex-col space-y-8 w-full">
        <Link
          className="text-white flex flex-col items-center hover:text-gray-300 transition duration-300 border-b border-white pb-4"
          to="/"
        >
          <Home fontSize="large" />
          <span className="mt-2 text-sm">Inicio</span>
        </Link>
        {!sesionIniciada ? (
          <Link
            className="text-white flex flex-col items-center hover:text-gray-300 transition duration-300 border-b border-white pb-4"
            to="/login"
          >
            <Login fontSize="large" />
            <span className="mt-2 text-sm">Login</span>
          </Link>
        ) : (
          <>
            <Link
              className="text-white flex flex-col items-center hover:text-gray-300 transition duration-300 border-b border-white pb-4"
              to="/perfil"
            >
              <Person fontSize="large" />
              <span className="mt-2 text-sm">Perfil</span>
            </Link>
            <CerrarSesion />
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navegacion;