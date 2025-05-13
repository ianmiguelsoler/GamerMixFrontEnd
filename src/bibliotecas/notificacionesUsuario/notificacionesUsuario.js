import Swal from "sweetalert2";

/**
 * Muestra una notificación con SweetAlert2
 * @param {Object} opciones
 * @param {string} opciones.title - Título del modal
 * @param {string} opciones.text - Texto del contenido
 * @param {"success" | "error" | "info" | "warning" | "question"} [opciones.icon] - Icono del modal
 * @param {string} [opciones.confirmButtonText] - Texto del botón de confirmación
 * @param {boolean} [opciones.showCancelButton] - Mostrar botón de cancelar
 * @param {string} [opciones.cancelButtonText] - Texto del botón de cancelar
 * @param {boolean} [opciones.showDenyButton] - Mostrar botón de denegar
 * @param {string} [opciones.denyButtonText] - Texto del botón de denegar
 * @param {boolean} [opciones.toast] - Modo toast
 * @param {number} [opciones.timer] - Tiempo en milisegundos
 * @param {string} [opciones.position] - Posición (solo si toast)
 * @param {Function} [opciones.onConfirm] - Función a ejecutar al confirmar
 * @param {Function} [opciones.onDeny] - Función a ejecutar al denegar
 */
export const mostrarNotificacion = async (opciones) => {
  const {
    title,
    text,
    icon = "info",
    confirmButtonText = "OK",
    showCancelButton = false,
    cancelButtonText = "Cancelar",
    showDenyButton = false,
    denyButtonText = "No",
    toast = false,
    timer,
    position = "center",
    onConfirm,
    onDeny,
  } = opciones;

  const resultado = await Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    showCancelButton,
    cancelButtonText,
    showDenyButton,
    denyButtonText,
    toast,
    timer,
    position,
    showConfirmButton: !toast,
  });

  if (resultado.isConfirmed && typeof onConfirm === "function") {
    onConfirm();
  } else if (resultado.isDenied && typeof onDeny === "function") {
    onDeny();
  }
};
