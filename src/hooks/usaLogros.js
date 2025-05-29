// src/hooks/usaLogros.js
import { useRef } from "react";
import Swal from "sweetalert2";
import { supabaseConexion } from "../config/supabase";

import audioLogro from "../assets/obtencionDeLogros.mp3";
import audioUltimoLogro from "../assets/ultimoLogroObtenido.mp3";

const LOGRO_MUNDO_PORO = "8d17e480-57d1-4cc7-bd7d-4ca47739cd9f";
const COMBINACIONES_MUNDO_PORO = [
  "58b75c04-6661-49a3-86fc-46586c33206b",
  "bcf41b0b-bc63-4d62-8404-de5f2979c4c4",
  "b5b778a4-a1a9-4948-92e8-bb3c2db8ada6",
];
const ID_SKIN_LEGENDARIA = "1c960cdd-1637-4d3f-9bc0-d967c5616332";
const LOGRO_CAMBIO_IMAGEN = "dd63391e-1872-4dee-b25b-d7bdc39cc7ac";

const LOGROS_IDS = {
  primera: "40816c06-42af-4210-9326-0da782bd78ba",
  cinco: "4e9c212c-975a-4250-b7b1-324c9292f617",
  diez: "573656e3-5b63-43c5-a236-d8fac7ff85b9",
  fallo: "8fceb245-0e17-4e5d-853c-01a437314247",
  todas: "a837f0d5-b80b-4b52-adc5-f356828dfa5e",
  skinLegendaria: "b36b9ee5-bef8-4008-8179-270a26c692ef",
  mundoPoro: LOGRO_MUNDO_PORO,
  cambioImagen: LOGRO_CAMBIO_IMAGEN,
};

const usaLogros = (sonidoActivo = true) => {
  const mostrandoLogro = useRef(false);
  const colaLogros = useRef([]);
  const logrosObtenidos = useRef(new Set());

  const audioRefNormal = useRef(new Audio(audioLogro));
  const audioRefFinal = useRef(new Audio(audioUltimoLogro));

  const mostrarVariosLogros = async (logros) => {
    if (!logros || logros.length === 0) return;

    const html = logros
      .map(
        (logro) => `
        <div class="swal-logro-contenedor">
          <div class="swal-logro-texto">
            <h3>${logro.nombre_logro}</h3>
            <p>${logro.descripcion}</p>
          </div>
          <img src="${logro.image_url}" alt="logro" class="swal-logro-imagen logro-animado" />
        </div>
      `
      )
      .join("<hr style='margin: 1rem 0; border: none; border-top: 1px dashed #ccc;'>");

    colaLogros.current.push({ html, total: logros.length });

    if (mostrandoLogro.current) return;

    mostrandoLogro.current = true;

    while (colaLogros.current.length > 0) {
      const { html: siguienteHtml, total } = colaLogros.current.shift();

      const totalLogros = Object.values(LOGROS_IDS).length;
      const logrosActuales = logrosObtenidos.current.size;
      const seraUltimo = logrosActuales + total >= totalLogros;

      if (sonidoActivo) {
        if (seraUltimo) {
          audioRefFinal.current.play();
        } else {
          audioRefNormal.current.play();
        }
      }

      await Swal.fire({
        position: "top-end",
        html: siguienteHtml,
        showConfirmButton: false,
        timer: 5000,
        toast: true,
        background: "#fff",
      });
    }

    mostrandoLogro.current = false;
  };

  const comprobarLogros = async ({
    usuarioId,
    mezclasTotales,
    fallo = false,
    combinacionId = null,
    combinacionesDisponibles = [],
    galeriaUsuario = [],
    cambioImagenPerfil = false,
  }) => {
    try {
      const { data: yaTiene } = await supabaseConexion
        .from("logros_usuarios")
        .select("id_logro")
        .eq("id_usuario", usuarioId);

      const idsLogrosUsuario = yaTiene.map((l) => l.id_logro);
      idsLogrosUsuario.forEach((id) => logrosObtenidos.current.add(id));

      const logrosNuevos = [];
      const promesas = [];

      const intentarAgregarLogro = async (idLogro) => {
        if (logrosObtenidos.current.has(idLogro)) return;

        const { data: logroData } = await supabaseConexion
          .from("logros")
          .select("*")
          .eq("id", idLogro)
          .single();

        if (!logroData) return;

        await supabaseConexion
          .from("logros_usuarios")
          .insert({ id_usuario: usuarioId, id_logro: idLogro });

        logrosNuevos.push(logroData);
        logrosObtenidos.current.add(idLogro);
      };

      if (fallo) promesas.push(intentarAgregarLogro(LOGROS_IDS.fallo));
      if (mezclasTotales >= 1) promesas.push(intentarAgregarLogro(LOGROS_IDS.primera));
      if (mezclasTotales >= 5) promesas.push(intentarAgregarLogro(LOGROS_IDS.cinco));
      if (mezclasTotales >= 10) promesas.push(intentarAgregarLogro(LOGROS_IDS.diez));

     if (combinacionId && galeriaUsuario.length > 0 && combinacionesDisponibles.length > 0) {
      const idsUsuario = [...galeriaUsuario, combinacionId].filter(Boolean);
      const idsTodas = combinacionesDisponibles.map((c) => c.id);
      if (idsTodas.every((id) => idsUsuario.includes(id))) {
        promesas.push(intentarAgregarLogro(LOGROS_IDS.todas));
      }
    }


      const combo = combinacionesDisponibles.find((c) => c.id === combinacionId);
      if (combo?.id === ID_SKIN_LEGENDARIA) {
        promesas.push(intentarAgregarLogro(LOGROS_IDS.skinLegendaria));
      }

      const idsUsuarioPoro = [...galeriaUsuario, combinacionId].filter(Boolean);
      const tieneTodosPoro = COMBINACIONES_MUNDO_PORO.every((id) =>
        idsUsuarioPoro.includes(id)
      );
      if (tieneTodosPoro) {
        promesas.push(intentarAgregarLogro(LOGROS_IDS.mundoPoro));
      }

      if (cambioImagenPerfil) {
        promesas.push(intentarAgregarLogro(LOGROS_IDS.cambioImagen));
      }

      await Promise.all(promesas);

      if (logrosNuevos.length > 0) {
        await mostrarVariosLogros(logrosNuevos);
      }
    } catch (err) {
      console.error("🚨 Error comprobando logros:", err.message);
    }
  };

  return {
    comprobarLogros,
  };
};

export default usaLogros;
