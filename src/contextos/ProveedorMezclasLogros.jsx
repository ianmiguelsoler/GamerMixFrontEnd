import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { supabaseConexion } from "../config/supabase";
import { contextoSesion } from "./ProveedorSesion.jsx";

const contextoLogros = createContext();

const LOGRO_MUNDO_PORO = "8d17e480-57d1-4cc7-bd7d-4ca47739cd9f";
const COMBINACIONES_MUNDO_PORO = [
  "58b75c04-6661-49a3-86fc-46586c33206b",
  "bcf41b0b-bc63-4d62-8404-de5f2979c4c4",
  "b5b778a4-a1a9-4948-92e8-bb3c2db8ada6",
];
const ID_SKIN_LEGENDARIA = "1c960cdd-1637-4d3f-9bc0-d967c5616332";
const LOGROS_IDS = {
  primera: "40816c06-42af-4210-9326-0da782bd78ba",
  cinco: "4e9c212c-975a-4250-b7b1-324c9292f617",
  diez: "573656e3-5b63-43c5-a236-d8fac7ff85b9",
  fallo: "8fceb245-0e17-4e5d-853c-01a437314247",
  todas: "a837f0d5-b80b-4b52-adc5-f356828dfa5e",
  skinLegendaria: "b36b9ee5-bef8-4008-8179-270a26c692ef",
  mundoPoro: LOGRO_MUNDO_PORO,
};

const ProveedorMezclasLogros = ({ children }) => {
  const { usuario } = useContext(contextoSesion);

  const [logrosUsuario, setLogrosUsuario] = useState([]);
  const [totalLogros, setTotalLogros] = useState(0);
  const [cargandoLogros, setCargandoLogros] = useState(true);
  const [errorLogros, setErrorLogros] = useState(null);

  const [combinacionesDisponibles, setCombinacionesDisponibles] = useState([]);
  const [combinacionesConEstado, setCombinacionesConEstado] = useState([]);
  const [galeriaUsuario, setGaleriaUsuario] = useState([]);
  const [mezclasHechas, setMezclasHechas] = useState(0);
  const [mezclasTotales, setMezclasTotales] = useState(0);

  const [guardandoCombinacion, setGuardandoCombinacion] = useState(false);
  const [errorCombinacion, setErrorCombinacion] = useState(null);
  const [combinacionExitosa, setCombinacionExitosa] = useState(null);
  const [datosCombinacionExitosa, setDatosCombinacionExitosa] = useState(null);

  const [skins, setSkins] = useState([]);
  const [items, setItems] = useState([]);

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

    await Swal.fire({
      position: "top-end",
      html,
      showConfirmButton: false,
      timer: 5000 + logros.length * 1000,
      toast: true,
      background: "#fff",
    });
  };

const comprobarLogros = async ({
  usuarioId,
  mezclasTotales,
  fallo = false,
  combinacionId = null,
  combinacionesDisponibles,
}) => {
  try {
    const { data: yaTiene } = await supabaseConexion
      .from("logros_usuarios")
      .select("id_logro")
      .eq("id_usuario", usuarioId);

    const idsLogrosUsuario = yaTiene.map((l) => l.id_logro);
    const logrosNuevos = [];
    const promesas = [];

    const intentarAgregarLogro = async (idLogro) => {
      if (idsLogrosUsuario.includes(idLogro)) return;

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
    };

    if (fallo) promesas.push(intentarAgregarLogro(LOGROS_IDS.fallo));
    if (mezclasTotales >= 1) promesas.push(intentarAgregarLogro(LOGROS_IDS.primera));
    if (mezclasTotales >= 5) promesas.push(intentarAgregarLogro(LOGROS_IDS.cinco));
    if (mezclasTotales >= 10) promesas.push(intentarAgregarLogro(LOGROS_IDS.diez));

    const todasObtenidas = combinacionesDisponibles.every(
      (c) => c.obtenida || c.id === combinacionId
    );
    if (todasObtenidas) promesas.push(intentarAgregarLogro(LOGROS_IDS.todas));

    const combo = combinacionesDisponibles.find((c) => c.id === combinacionId);
    if (combo?.id_skin?.toString() === ID_SKIN_LEGENDARIA) {
      promesas.push(intentarAgregarLogro(LOGROS_IDS.skinLegendaria));
    }

    const idsUsuario = combinacionesDisponibles
      .filter((c) => c.obtenida || c.id === combinacionId)
      .map((c) => c.id);

    const tieneTodosPoro = COMBINACIONES_MUNDO_PORO.every((id) =>
      idsUsuario.includes(id)
    );
    if (tieneTodosPoro) promesas.push(intentarAgregarLogro(LOGROS_IDS.mundoPoro));

    await Promise.all(promesas);

    if (logrosNuevos.length > 0) {
      await mostrarVariosLogros(logrosNuevos);
    }
  } catch (err) {
    console.error("🚨 Error comprobando logros:", err.message);
  }
};


  const obtenerLogros = async () => {
    try {
      setCargandoLogros(true);
      if (!usuario?.id) return;

      const { data, error } = await supabaseConexion
        .from("logros_usuarios")
        .select(`fecha_obtenido, logros (id, nombre_logro, descripcion, puntos, image_url, created_at)`)
        .eq("id_usuario", usuario.id);

      if (error) throw error;

      const logrosConDetalle = data.map((registro) => ({
        ...registro.logros,
        fecha_obtenido: registro.fecha_obtenido,
      }));

      const { count } = await supabaseConexion
        .from("logros")
        .select("*", { count: "exact", head: true });

      setLogrosUsuario(logrosConDetalle);
      setTotalLogros(count);
    } catch (err) {
      setErrorLogros(err.message);
    } finally {
      setCargandoLogros(false);
    }
  };

  useEffect(() => { obtenerLogros(); }, [usuario]);

  useEffect(() => {
    const cargarCombinaciones = async () => {
      try {
        const { data } = await supabaseConexion
          .from("combinaciones")
          .select("id, id_elemento, id_skin, nombre_combinacion, descripcion, image_url");
        setCombinacionesDisponibles(data);
        setMezclasTotales(data.length);
      } catch (err) {
        console.error("Error al cargar combinaciones:", err.message);
      }
    };
    cargarCombinaciones();
  }, []);

  useEffect(() => {
    const cargarGaleriaUsuario = async () => {
      if (!usuario?.id) return;
      try {
        const { data } = await supabaseConexion
          .from("galeria")
          .select("id_combinacion")
          .eq("id_usuario", usuario.id);

        const ids = data.map((g) => g.id_combinacion);
        setGaleriaUsuario(ids);
        setMezclasHechas(ids.length);
      } catch (err) {
        console.error("Error al cargar galería:", err.message);
      }
    };
    cargarGaleriaUsuario();
  }, [usuario]);

  useEffect(() => {
    const marcadas = combinacionesDisponibles.map((combo) => ({
      ...combo,
      obtenida: galeriaUsuario.includes(combo.id),
    }));
    setCombinacionesConEstado(marcadas);
  }, [combinacionesDisponibles, galeriaUsuario]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [{ data: items }, { data: skins }] = await Promise.all([
          supabaseConexion.from("elementos").select("id, nombre_elemento, image_url"),
          supabaseConexion.from("skins").select("id, nombre_skin, image_url"),
        ]);
        setItems(items);
        setSkins(skins);
      } catch (err) {
        console.error("Error al cargar datos:", err.message);
      }
    };
    cargarDatos();
  }, []);

  const verificarYGuardarCombinacion = async (idElemento, idSkin) => {
    setGuardandoCombinacion(true);
    setErrorCombinacion(null);
    setCombinacionExitosa(null);
    setDatosCombinacionExitosa(null);

    try {
      if (!usuario?.id) throw new Error("Usuario no autenticado");

      const combinacion = combinacionesDisponibles.find(
        (c) => c.id_elemento === idElemento && c.id_skin === idSkin
      );

      if (!combinacion) {
        await Swal.fire({
          icon: "error",
          title: "¡Combinación inválida!",
          text: "Esa combinación no se puede conseguir porque no existe.",
        });

        await comprobarLogros({
          usuarioId: usuario.id,
          mezclasTotales,
          fallo: true,
          combinacionId: null,
          combinacionesDisponibles,
        });

        await obtenerLogros();
        return false;
      }

      if (galeriaUsuario.includes(combinacion.id)) {
        await Swal.fire({
          icon: "info",
          title: "¡Ya la tienes!",
          text: "Ya has hecho esta combinación.",
        });
        return false;
      }

      const { error: errorInsert } = await supabaseConexion
        .from("galeria")
        .insert([{ id_usuario: usuario.id, id_combinacion: combinacion.id }]);

      if (errorInsert && errorInsert.code !== "23505") throw errorInsert;

      setCombinacionExitosa(combinacion.id);
      const nuevaGaleria = [...galeriaUsuario, combinacion.id];
      setGaleriaUsuario(nuevaGaleria);
      setMezclasHechas(nuevaGaleria.length);

      setDatosCombinacionExitosa({
        nombre: combinacion.nombre_combinacion,
        descripcion: combinacion.descripcion,
        image_url: combinacion.image_url,
      });

      await Swal.fire({
        icon: "success",
        title: "¡Combinación guardada!",
        text: "La combinación se ha añadido a tu colección.",
        timer: 2000,
        showConfirmButton: false,
      });

      await comprobarLogros({
        usuarioId: usuario.id,
        mezclasTotales: nuevaGaleria.length,
        fallo: false,
        combinacionId: combinacion.id,
        combinacionesDisponibles,
      });

      await obtenerLogros();
      return combinacion;
    } catch (err) {
      setErrorCombinacion(err.message);
      return false;
    } finally {
      setGuardandoCombinacion(false);
    }
  };

  return (
    <contextoLogros.Provider
      value={{
        logrosUsuario,
        totalLogros,
        cargandoLogros,
        errorLogros,
        combinacionesDisponibles,
        combinacionesConEstado,
        verificarYGuardarCombinacion,
        guardandoCombinacion,
        errorCombinacion,
        combinacionExitosa,
        datosCombinacionExitosa,
        items,
        skins,
        mezclasHechas,
        mezclasTotales,
      }}
    >
      {children}
    </contextoLogros.Provider>
  );
};

export default ProveedorMezclasLogros;
export { contextoLogros };
