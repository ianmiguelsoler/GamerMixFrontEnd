import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import { createSwapy } from "swapy";

const Error = () => {
  const swapyInstance = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      swapyInstance.current = createSwapy(containerRef.current);
    }

    return () => {
      swapyInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-10 bg-white rounded-2xl shadow-lg text-center"
      >
        <h2 className="text-3xl font-bold text-red-500">Error 404</h2>
        <p className="text-gray-600 mt-2">La página que buscas no existe o ha sido movida.</p>
        <Button
          label="Volver al inicio"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={() => window.location.href = "/"}
        />
      </motion.div>
    </div>
  );
};

export default Error;