import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Hook para redireccionar si es necesario.
import { ExitToApp } from "@mui/icons-material"; // Ícono para representar el cierre de sesión.
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx"; // Contexto para gestionar la sesión.
import "./CerrarSesion.css"; // Archivo CSS opcional para personalizar estilos del botón.

const CerrarSesion = () => {
  // Extrae la función "cerrarSesion" del contexto.
  const { cerrarSesion } = useContext(contextoSesion);

  return (
    <button
      // Estilos para el botón de cierre de sesión.
      className="bg-gray-900 text-white flex flex-col items-center hover:text-gray-300 hover:scale-105 active:scale-95 transition duration-300 ease-in-out border-b border-white pb-4"
      onClick={cerrarSesion} // Llama a la función para cerrar sesión cuando se hace clic.
    >
      <ExitToApp fontSize="large" /> {/* Ícono de salida */}
      <span className="mt-2 text-sm">Cerrar sesión</span> {/* Etiqueta del botón */}
    </button>
  );
};

export default CerrarSesion;
