import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import Errores from "../Errores.jsx";

const CrearCuenta = () => {
  // Obtenemos funciones y valores del contexto.
  const { actualizarDato, errorUsuario, crearCuenta } = useContext(contextoSesion);

  // Estado para controlar la visibilidad de la contraseña.
  const [showPassword, setShowPassword] = useState(false);

  // Maneja el proceso de registro del usuario.
  const handleRegister = async () => {
    await crearCuenta(); // Llama a la función de crear cuenta del contexto.

    if (!errorUsuario) {
      // Muestra un mensaje de éxito si no hay errores.
      Swal.fire({
        title: "Registrarse",
        text: "¡Registro completado con éxito!",
        icon: "success",
        confirmButtonText: "Aceptar",
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } else {
      // Muestra un mensaje de error si ocurre algún problema.
      Swal.fire({
        title: "Error",
        text: errorUsuario,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Alterna la visibilidad de la contraseña.
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Maneja el evento de presionar la tecla "Enter".
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento por defecto del formulario.
      handleRegister(); // Llama al proceso de registro.
    }
  };

  return (
    <>
      <motion.div
        className="bg-white p-8 rounded shadow-md w-full max-w-sm relative"
        // Animación de entrada para el formulario.
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Título del formulario */}
        <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
        
        <form onKeyDown={handleKeyDown}>
          {/* Campo para el nombre de usuario */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 ml-2"
              htmlFor="username"
            >
              Nombre de usuario
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Su nombre de usuario"
                name="username"
                onChange={(e) => actualizarDato(e)} // Actualiza el estado del contexto.
              />
              <Person
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
          </div>

          {/* Campo para el correo electrónico */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 ml-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Su correo electrónico"
                name="email"
                onChange={(e) => actualizarDato(e)} // Actualiza el estado del contexto.
              />
              <Email
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            </div>
          </div>

          {/* Campo para la contraseña */}
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
                type={showPassword ? "text" : "password"} // Cambia el tipo según el estado.
                placeholder="******************"
                name="password"
                onChange={(e) => actualizarDato(e)} // Actualiza el estado del contexto.
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
                  }}
                />
              )}
            </div>
          </div>
        </form>

        {/* Botón para completar el registro */}
        <div className="absolute bottom-4 right-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleRegister} // Llama al proceso de registro.
          >
            Registrarse
          </button>
        </div>

        {/* Muestra errores si los hay */}
        {errorUsuario && <Errores>{errorUsuario}</Errores>}
      </motion.div>
    </>
  );
};

export default CrearCuenta;
