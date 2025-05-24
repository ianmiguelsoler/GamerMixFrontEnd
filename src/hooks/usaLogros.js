import { useRef } from "react";
import Swal from "sweetalert2";
import { supabaseConexion } from "../config/supabase";

// ID del logro especial "Mundo Poro"
const LOGRO_MUNDO_PORO = "8d17e480-57d1-4cc7-bd7d-4ca4f739dd9f";
const COMBINACIONES_MUNDO_PORO = [
  "58b75c04-6661-49a3-86fc-46586c33206b",
  "bcf41b0b-bc63-4d62-8404-de5f2979c4c4",
  "b5b778a4-a1a9-4948-92e8-bb3c2db8ada6",
];

const usaLogros = () => {
  const mostrandoLogro = useRef(false);
  const colaLogros = useRef([]);

  /**
   * Muestra un popup de logro desbloqueado.
   * Si hay logros en cola, los procesa uno a uno.
   */
  const mostrarLogro = async (logro) => {
    colaLogros.current.push(logro);

    const procesarCola = async () => {
      if (mostrandoLogro.current || colaLogros.current.length === 0) return;

      mostrandoLogro.current = true;
      const siguiente = colaLogros.current.shift();

      await Swal.fire({
        position: "top-end",
        html: `
          <div class="swal-logro-contenedor">
            <div class="swal-logro-texto">
              <h3>${siguiente.nombre_logro}</h3>
              <p>${siguiente.descripcion}</p>
            </div>
            <img src="${siguiente.image_url}" alt="logro" class="swal-logro-imagen logro-animado" />
          </div>
        `,
        showConfirmButton: false,
        timer: 4000,
        toast: true,
        background: "#fff",
        didOpen: () => {
          const img = document.querySelector(".swal-logro-imagen");
          if (img) img.classList.add("logro-animado");
        },
      });

      mostrandoLogro.current = false;
      queueMicrotask(procesarCola); // Sigue con el siguiente
    };

    queueMicrotask(procesarCola);
  };

  /**
   * Comprueba si se ha desbloqueado algún logro nuevo.
   * @param {Object} opciones - Datos de contexto de la mezcla actual
   */
  const comprobarLogros = async ({
    usuarioId,
    mezclasTotales,
    fallo,
    combinacionId,
    combinacionesDisponibles,
  }) => {
    if (!usuarioId) return;

    // Obtener logros ya obtenidos por el usuario
    const { data: logrosActuales, error: errorActuales } = await supabaseConexion
      .from("logros_usuarios")
      .select("id_logro")
      .eq("id_usuario", usuarioId);

    const idsActuales = logrosActuales?.map((l) => l.id_logro) || [];

    // Obtener todos los logros
    const { data: todosLogros, error: errorLogros } = await supabaseConexion
      .from("logros")
      .select("id, nombre_logro, descripcion, puntos, image_url");

    if (errorActuales || errorLogros) return;

    // Detectar logros que se cumplen ahora
    const logrosADetectar = todosLogros.filter((logro) => {
      if (idsActuales.includes(logro.id)) return false;

      switch (logro.id) {
        case "013ef474-d753-40a3-835f-b5af462b9c6e": // Primera combinación
          return mezclasTotales === 1;
        case "4e9c212c-975a-4250-b7b1-324c9292f61f": // 5 combinaciones
          return mezclasTotales === 5;
        case "573656e3-5b63-43c5-a236-dfa6c7ff85b9": // 10 combinaciones
          return mezclasTotales === 10;
        case "8fceb245-0e17-4e5d-853c-01a43734247f": // Mezcla fallida
          return fallo === true;
        case "a837f0d5-b80b-4b52-ad65-f356288dfa5e": // Todas las combinaciones
          return mezclasTotales === combinacionesDisponibles?.length;
        case "b36b9ee5-bef8-4008-8179-2702ac6929ef": // Skin Vander (actualiza si tienes el ID real)
          return combinacionId === "ID_COMBINACION_SKIN_VANDER";
        case LOGRO_MUNDO_PORO: // Logro especial por 3 combinaciones específicas
          return COMBINACIONES_MUNDO_PORO.every((id) =>
            combinacionesDisponibles.some(
              (c) => c.id === id && idsActuales.includes(c.id)
            )
          );
        default:
          return false;
      }
    });

    // Insertar y mostrar logros desbloqueados
    for (const logro of logrosADetectar) {
      const { error } = await supabaseConexion.from("logros_usuarios").insert([
        {
          id_usuario: usuarioId,
          id_logro: logro.id,
        },
      ]);

      if (error) {
        console.warn("Error al guardar el logro:", error.message);
        continue;
      }

      await mostrarLogro(logro);
    }
  };

  return { comprobarLogros };
};

export default usaLogros;
