import { useRef } from "react";
import Swal from "sweetalert2";
import { supabaseConexion } from "../config/supabase";

// IDs especiales
const LOGRO_MUNDO_PORO = "8d17e480-57d1-4cc7-bd7d-4ca4f739dd9f";
const COMBINACIONES_MUNDO_PORO = [
  "58b75c04-6661-49a3-86fc-46586c33206b",
  "bcf41b0b-bc63-4d62-8404-de5f2979c4c4",
  "b5b778a4-a1a9-4948-92e8-bb3c2db8ada6",
];

const usaLogros = () => {
  const mostrandoLogro = useRef(false);
  const colaLogros = useRef([]);

  const mostrarLogro = async (logro) => {
    mostrandoLogro.current = true;

   await Swal.fire({
  position: "top-end",
  html: `
    <div class="swal-logro-contenedor">
      <div class="swal-logro-texto">
        <h3>${logro.nombre_logro}</h3>
        <p>${logro.descripcion}</p>
      </div>
      <img src="${logro.image_url}" alt="logro" class="swal-logro-imagen logro-animado" />
    </div>
  `,
  showConfirmButton: false,
  timer: 4000,
  toast: true,
  background: "#fff",
});


    mostrandoLogro.current = false;

    if (colaLogros.current.length > 0) {
      const siguiente = colaLogros.current.shift();
      await mostrarLogro(siguiente);
    }
  };

  const comprobarLogros = async ({
    usuarioId,
    mezclasTotales,
    fallo,
    combinacionId,
    combinacionesDisponibles,
  }) => {
    if (!usuarioId) return;

    // Traer logros ya obtenidos
    const { data: logrosActuales, error: errorActuales } = await supabaseConexion
      .from("logros_usuarios")
      .select("id_logro")
      .eq("id_usuario", usuarioId);

    const idsActuales = logrosActuales.map((l) => l.id_logro);

    // Traer todos los logros
    const { data: todosLogros, error: errorLogros } = await supabaseConexion
      .from("logros")
      .select("id, nombre_logro, descripcion, puntos, image_url");

    if (errorActuales || errorLogros) return;

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
        case "b36b9ee5-bef8-4008-8179-2702ac6929ef": // Skin Vander
          return combinacionId === "ID_COMBINACION_SKIN_VANDER"; // reemplazar si es necesario
        case LOGRO_MUNDO_PORO:
          return COMBINACIONES_MUNDO_PORO.every((id) =>
            combinacionesDisponibles.some(
              (c) => c.id === id && idsActuales.includes(c.id)
            )
          );
        default:
          return false;
      }
    });

    // Insertar y mostrar logros detectados
    for (const logro of logrosADetectar) {
      const { error } = await supabaseConexion.from("logros_usuarios").insert([
        {
          id_usuario: usuarioId,
          id_logro: logro.id,
        },
      ]);

      if (error) {
        console.warn("Error guardando logro:", error.message);
        continue;
      }

      if (mostrandoLogro.current) {
        colaLogros.current.push(logro);
      } else {
        await mostrarLogro(logro);
      }
    }
  };

  return { comprobarLogros };
};

export default usaLogros;
