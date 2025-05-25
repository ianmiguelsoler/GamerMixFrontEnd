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
const ID_SKIN_LEGENDARIA = "1c960cdd-1637-4d3f-9bc0-d967c5616332";
const LOGROS_IDS = {
  primera: "40816c06-42af-4210-9326-0da782bd78ba",
  cinco: "4e9c212c-975a-4250-b7b1-324c9292f61f",
  diez: "573656e3-5b63-43c5-a236-dfa6c7ff85b9",
  fallo: "8fceb245-0e17-4e5d-853c-01a43734247f",
  todas: "a837f0d5-b80b-4b52-ad65-f356288dfa5e",
  skinLegendaria: "b36b9ee5-bef8-4008-8179-2702ac6929ef",
  mundoPoro: LOGRO_MUNDO_PORO,
};

const usaLogros = () => {
  const mostrandoLogro = useRef(false);
  const colaLogros = useRef([]);
  const logrosObtenidos = useRef(new Set());

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
    });

    mostrandoLogro.current = false;
    queueMicrotask(procesarCola);
  };

  const mostrarLogro = (logro) => {
    if (!logrosObtenidos.current.has(logro.id)) {
      colaLogros.current.push(logro);
      logrosObtenidos.current.add(logro.id);
      procesarCola();
    }
  };

  const comprobarLogros = async ({
    usuarioId,
    mezclasTotales,
    fallo = false,
    combinacionId = null,
    combinacionesDisponibles,
  }) => {
    try {
      const { data: yaTiene, error: errorTiene } = await supabaseConexion
        .from("logros_usuarios")
        .select("id_logro")
        .eq("id_usuario", usuarioId);

      if (errorTiene) throw errorTiene;

      const idsLogrosUsuario = yaTiene.map((l) => l.id_logro);
      const insertarYMostrar = async (idLogro) => {
        if (idsLogrosUsuario.includes(idLogro)) return;

        const { data: logroData, error: errorLogro } = await supabaseConexion
          .from("logros")
          .select("*")
          .eq("id", idLogro)
          .single();

        if (errorLogro) throw errorLogro;

        await supabaseConexion
          .from("logros_usuarios")
          .insert({ id_usuario: usuarioId, id_logro: idLogro });

        mostrarLogro(logroData);
      };

      // Condiciones
      if (fallo) await insertarYMostrar(LOGROS_IDS.fallo);
      if (mezclasTotales >= 1) await insertarYMostrar(LOGROS_IDS.primera);
      if (mezclasTotales >= 5) await insertarYMostrar(LOGROS_IDS.cinco);
      if (mezclasTotales >= 10) await insertarYMostrar(LOGROS_IDS.diez);
      if (
        combinacionesDisponibles.every((c) =>
          c.obtenida || c.id === combinacionId
        )
      )
        await insertarYMostrar(LOGROS_IDS.todas);

      const combo = combinacionesDisponibles.find(
        (c) => c.id === combinacionId
      );

      if (combo?.id_skin?.toString() === ID_SKIN_LEGENDARIA)
        await insertarYMostrar(LOGROS_IDS.skinLegendaria);

      const idsUsuario = combinacionesDisponibles
        .filter((c) => c.obtenida || c.id === combinacionId)
        .map((c) => c.id);

      const tieneTodosPoro = COMBINACIONES_MUNDO_PORO.every((id) =>
        idsUsuario.includes(id)
      );

      if (tieneTodosPoro) await insertarYMostrar(LOGROS_IDS.mundoPoro);
    } catch (err) {
      console.error("Error comprobando logros:", err.message);
    }
  };

  return { comprobarLogros };
};

export default usaLogros;
