import React, { useContext } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";

const Perfil = () => {
  // const { usuario } = useContext(contextoSesion); // Obtiene los datos del usuario desde el contexto.
  const navegar = useNavigate(); // Hook para redireccionar.
  const usuario = {
    username: "gamer123",
    email: "",
    rol: "Administrador",
  }; // Usuario simulado para pruebas.
  // Muestra una notificación indicando que la funcionalidad de edición no está disponible aún.
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

  // Redirige a la página de recuperación de contraseña.
  // Actualmente no implementa lógica adicional.
  const irARecuperarContrasena = () => {
    navegar("/recuperar-contraseña");
  };

  // Si no hay un usuario autenticado, muestra un mensaje indicando que no se tiene acceso.
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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        {/* Título del perfil */}
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
          Perfil del Usuario
        </h1>
        {/* Información del usuario */}
        <div className="text-lg text-gray-800 mb-4 space-y-2">
          <p>
            <strong>Nombre de usuario:</strong> {usuario.username}
          </p>
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Rol:</strong> {usuario.rol || "Usuario"} {/* Rol por defecto */}
          </p>
          <p>
            <strong>Fecha de creación:</strong>{" "}
            {new Date(usuario.createdAt).toLocaleDateString()} {/* Formato legible */}
          </p>
        </div>
        {/* Botones de acción */}
        <div className="text-center space-y-4">
          {/* Botón para editar perfil */}
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            onClick={mostrarNotificacion} // Llama a la notificación de funcionalidad futura.
          >
            Editar Perfil
          </button>
          {/* Botón para recuperar contraseña */}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={irARecuperarContrasena} // Redirige a la página de recuperación.
          >
            Recuperar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
