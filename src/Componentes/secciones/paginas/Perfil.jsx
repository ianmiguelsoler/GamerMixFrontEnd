import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import StarBorder from "../../../bibliotecas/StarBorder.jsx";

const Perfil = () => {
  const navegar = useNavigate();

  const usuario = {
    username: "gamer123",
    email: "gamer@example.com",
    rol: "Administrador",
    createdAt: "2024-02-15T12:00:00Z",
  };

  const mostrarNotificacion = () => {
    Swal.fire({
      title: "Próximamente",
      text: "La funcionalidad para editar el perfil estará disponible en el futuro.",
      icon: "info",
      confirmButtonText: "Entendido",
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
        <p className="text-gray-700 text-lg">
          No tienes acceso a esta página. Por favor, inicia sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-gray-700">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-10 w-96 border border-gray-600 transform transition-all hover:scale-105 hover:shadow-cyan-500/50">
        
        {/* Imagen del perfil */}
        <div className="flex justify-center mb-6">
          <img
            src="https://i.pravatar.cc/100"
            alt="Avatar de usuario"
            className="w-24 h-24 rounded-full border-4 border-cyan-400 shadow-lg"
          />
        </div>

        {/* Título con la fuente retro */}
        <h1 className="text-xl text-center text-cyan-300 mb-6 tracking-wide pixelated">
          PERFIL DEL USUARIO
        </h1>

        {/* Información del usuario con la fuente retro */}
        <div className="text-sm text-gray-300 mb-6 space-y-3 p-4 bg-gray-700 rounded-lg shadow-md font-pixel">
          <p>
            <strong className="text-cyan-400">Usuario:</strong> {usuario.username}
          </p>
          <p>
            <strong className="text-cyan-400">Email:</strong> {usuario.email}
          </p>
          <p>
            <strong className="text-cyan-400">Rol:</strong> {usuario.rol || "Usuario"}
          </p>
          <p>
            <strong className="text-cyan-400">Creación:</strong>{" "}
            {new Date(usuario.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Botones con React Bits y efectos retro */}
        <div className="text-center space-y-4">
          <StarBorder
            as="button"
            className="w-full py-3 text-sm tracking-wide font-semibold rounded transition duration-300 shadow-md hover:shadow-cyan-500/40 pixelated"
            color="cyan"
            speed="2s"
            onClick={mostrarNotificacion}
          >
            ✨ EDITAR PERFIL
          </StarBorder>

          <StarBorder
            as="button"
            className="w-full py-3 text-sm tracking-wide font-semibold rounded transition duration-300 shadow-md hover:shadow-blue-500/40 pixelated"
            color="blue"
            speed="2s"
            onClick={irARecuperarContrasena}
          >
            🔑 RECUPERAR CONTRASEÑA
          </StarBorder>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
