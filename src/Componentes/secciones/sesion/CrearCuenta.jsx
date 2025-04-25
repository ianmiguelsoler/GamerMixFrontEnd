import React, { useState } from "react";
import { motion } from "framer-motion";
import { Email, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";

const CrearCuenta = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegister = () => {
    Swal.fire({
      title: "Registrarse",
      text: "¡Registro simulado con éxito!",
      icon: "success",
      confirmButtonText: "Aceptar",
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      toast: true,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRegister();
    }
  };

  return (
    <>
      <motion.div
        className="bg-white p-8 rounded shadow-md w-full max-w-sm relative"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>

        <form onKeyDown={handleKeyDown}>
          {/* Nombre de usuario */}
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

          {/* Email */}
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

          {/* Contraseña */}
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
                type={showPassword ? "text" : "password"}
                placeholder="******************"
                name="password"
              />
              {showPassword ? (
                <VisibilityOff
                  onClick={togglePasswordVisibility}
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
                  onClick={togglePasswordVisibility}
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

        {/* Botón */}
        <div className="absolute bottom-4 right-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleRegister}
          >
            Registrarse
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default CrearCuenta;
