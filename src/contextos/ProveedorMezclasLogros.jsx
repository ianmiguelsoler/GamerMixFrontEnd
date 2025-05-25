import React, { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabaseConexion } from "../config/supabase";
import { contextoSesion } from "./ProveedorSesion.jsx";
import { useTranslation } from "react-i18next";
import usaLogros from "../hooks/usaLogros.js";

const contextoLogros = createContext();

const ProveedorMezclasLogros = ({ children }) => {
  const { usuario } = useContext(contextoSesion);
  const { i18n } = useTranslation();

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

  const { comprobarLogros } = usaLogros();

  const obtenerLogros = async () => {
      try {
        setCargandoLogros(true);
        if (!usuario?.id) return;

        const idioma = i18n.language;
        const campoNombre = idioma === "en" ? "nombre_logro_en" : "nombre_logro";
        const campoDescripcion = idioma === "en" ? "descripcion_en" : "descripcion";

        const { data, error } = await supabaseConexion
          .from("logros_usuarios")
          .select(`
            fecha_obtenido,
            logros (
              id,
              ${campoNombre},
              ${campoDescripcion},
              puntos,
              image_url,
              created_at
            )
          `)
          .eq("id_usuario", usuario.id);

        if (error) throw error;

        const logrosConDetalle = data.map((registro) => ({
          id: registro.logros.id,
          nombre_logro: registro.logros[campoNombre],
          descripcion: registro.logros[campoDescripcion],
          puntos: registro.logros.puntos,
          image_url: registro.logros.image_url,
          created_at: registro.logros.created_at,
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

  useEffect(() => { obtenerLogros(); }, [usuario, i18n.language]);

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
          galeriaUsuario,
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

      console.log("Combinación guardada:", combinacion);
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
        galeriaUsuario: nuevaGaleria,
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
