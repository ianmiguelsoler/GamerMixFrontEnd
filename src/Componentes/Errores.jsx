import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./Errores.css"; // Archivo CSS opcional para personalizar estilos (no es estrictamente necesario).

const Errores = ({ children }) => {
  // Utiliza el hook useEffect para mostrar un mensaje cuando "children" cambia.
  useEffect(() => {
    if (children) {
      // Muestra un mensaje de error utilizando SweetAlert2.
      Swal.fire({
        position: "top-end", // Posición en la parte superior derecha de la pantalla.
        icon: "error", // Ícono de error.
        title: "Error", // Título del mensaje.
        text: children, // Texto del error pasado como "children".
        showConfirmButton: false, // Sin botón de confirmación.
        timer: 5000, // El mensaje desaparece automáticamente después de 5 segundos.
        toast: true, // Estilo de notificación tipo "toast".
      });
    }
  }, [children]); // Se ejecuta cada vez que "children" cambia.

  return null; // Este componente no renderiza nada directamente en el DOM.
};

export default Errores;
