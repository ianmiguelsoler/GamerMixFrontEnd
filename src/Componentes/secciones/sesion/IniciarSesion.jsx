import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";

const IniciarSesion = () => {
  // Obtenemos las funciones necesarias desde el contexto.
  const { actualizarDato, iniciarSesion } = useContext(contextoSesion);
  const navigate = useNavigate(); // Hook para redireccionar.

  // Estado para controlar la visibilidad de la contraseña.
  const [showPassword, setShowPassword] = useState(false);

  // Maneja el proceso de inicio de sesión.
  const handleLogin = async () => {
    const result = await iniciarSesion();

    if (result.success) {
      // Muestra un mensaje de éxito si el inicio de sesión fue exitoso.
      Swal.fire({
        title: "Inicio de Sesión Exitoso",
        text: "Has iniciado sesión correctamente.",
        icon: "success",
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        toast: true,
      });

      navigate("/productos"); // Redirigir a la página de productos tras iniciar sesión.
    } else {
      // Muestra un mensaje de error si ocurrió algún problema.
      Swal.fire({
        title: "Error al Iniciar Sesión",
        text: result.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Detecta cuando se presiona la tecla "Enter" para enviar el formulario.
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita el comportamiento por defecto.
      handleLogin(); // Llama a la función de inicio de sesión.
    }
  };

  // Alterna la visibilidad de la contraseña entre texto y asteriscos.
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <motion.div
      className="bg-white p-8 rounded shadow-md w-full max-w-sm relative"
      initial={{ opacity: 0 }} // Comienza con opacidad 0.
      animate={{ opacity: 1 }} // Cambia a opacidad 1.
      transition={{ duration: 1 }} // Transición suave de 1 segundo.
    >
      {/* Título del formulario */}
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <form onKeyDown={handleKeyDown}>
        {/* Campo de correo electrónico */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 ml-2"
            htmlFor="email"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              onChange={(e) => actualizarDato(e)} // Actualiza el estado del formulario.
            />
            <Email
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            />
          </div>
        </div>
        {/* Campo de contraseña */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 ml-2"
            htmlFor="password"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? "text" : "password"} // Alterna el tipo de input.
              name="password"
              placeholder="******************"
              onChange={(e) => actualizarDato(e)} // Actualiza el estado del formulario.
            />
            {showPassword ? (
              <VisibilityOff
                onClick={togglePasswordVisibility} // Alterna visibilidad de la contraseña.
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "gray",
                }}
              />
            ) : (
              <Visibility
                onClick={togglePasswordVisibility} // Alterna visibilidad de la contraseña.
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "gray",
                }}
              />
            )}
          </div>
        </div>
      </form>
      {/* Botón para iniciar sesión */}
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleLogin}
        >
          Iniciar Sesión
        </button>
      </div>
    </motion.div>
  );
};

export default IniciarSesion;
