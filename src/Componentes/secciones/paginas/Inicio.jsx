import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaShoppingCart, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";

const Inicio = () => {
  const navigate = useNavigate();
  const { sesionIniciada } = useContext(contextoSesion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 min-h-screen flex flex-col items-center p-6"
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center flex items-center gap-2">
        <FaShoppingCart className="text-green-500" /> Bienvenido a tu Lista de la Compra
      </h2>

      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-4xl flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            Esta aplicación te permite gestionar tu lista de la compra de manera
            fácil y eficiente. Está desarrollada con <strong>React</strong> y
            utiliza <strong>Supabase</strong> como backend para ofrecer una
            experiencia fluida y en tiempo real. Con esta herramienta podrás
            añadir, editar y eliminar elementos de tu lista, y mantener todo
            organizado desde cualquier dispositivo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Extensiones instaladas
          </h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <strong>Tailwind CSS:</strong> Biblioteca de utilidades CSS para
              un diseño rápido y eficiente.
            </li>
            <li>
              <strong>Framer Motion:</strong> Animaciones fluidas e interactivas
              para mejorar la experiencia de usuario.
            </li>
            <li>
              <strong>Material Icons:</strong> Iconos modernos y listos para
              usar.
            </li>
            <li>
              <strong>PrimeReact:</strong> Biblioteca con una amplia gama de
              componentes para aplicaciones profesionales.
            </li>
            <li>
              <strong>SweetAlert2:</strong> Alertas personalizables y atractivas
              para notificaciones.
            </li>
            <li>
              <strong>Swapy:</strong> Implementación intuitiva de
              funcionalidades drag-and-drop.
            </li>
          </ul>
        </motion.div>

        {!sesionIniciada && (
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
              onClick={() => navigate('/login')}
            >
              <FaSignInAlt /> Inicia sesión
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Inicio;
