import React, { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabaseConexion } from "../config/supabase";
import { contextoSesion } from "./ProveedorSesion.jsx";
import usaLogros from "../hooks/usaLogros.js";

const contextoLogros = createContext();

const ProveedorMezclasLogros = ({ children }) => {
  const { usuario } = useContext(contextoSesion);
  const { comprobarLogros } = usaLogros();

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

  // Cargar logros
  useEffect(() => {
    const obtenerLogros = async () => {
      try {
        setCargandoLogros(true);
        if (!usuario?.id) return;

        const { data, error } = await supabaseConexion
          .from("logros_usuarios")
          .select(`
            fecha_obtenido,
            logros (
              id, nombre_logro, descripcion, puntos, image_url, created_at
            )
          `)
          .eq("id_usuario", usuario.id);

        if (error) throw error;

        const logrosConDetalle = data.map((registro) => ({
          ...registro.logros,
          fecha_obtenido: registro.fecha_obtenido,
        }));

        const { count, error: errorTotal } = await supabaseConexion
          .from("logros")
          .select("*", { count: "exact", head: true });

        if (errorTotal) throw errorTotal;

        setLogrosUsuario(logrosConDetalle);
        setTotalLogros(count);
      } catch (err) {
        setErrorLogros(err.message);
      } finally {
        setCargandoLogros(false);
      }
    };

    obtenerLogros();
  }, [usuario]);

  // Cargar combinaciones disponibles
  useEffect(() => {
    const cargarCombinaciones = async () => {
      try {
        const { data, error } = await supabaseConexion
          .from("combinaciones")
          .select("id, id_elemento, id_skin, nombre_combinacion, descripcion, image_url");

        if (error) throw error;
        setCombinacionesDisponibles(data);
        setMezclasTotales(data.length);
      } catch (err) {
        console.error("Error al cargar combinaciones:", err.message);
      }
    };

    cargarCombinaciones();
  }, []);

  // Cargar galería del usuario
  useEffect(() => {
    const cargarGaleriaUsuario = async () => {
      if (!usuario?.id) return;
      try {
        const { data, error } = await supabaseConexion
          .from("galeria")
          .select("id_combinacion")
          .eq("id_usuario", usuario.id);

        if (error) throw error;
        const ids = data.map((g) => g.id_combinacion);
        setGaleriaUsuario(ids);
        setMezclasHechas(ids.length);
      } catch (err) {
        console.error("Error al cargar galería:", err.message);
      }
    };

    cargarGaleriaUsuario();
  }, [usuario]);

  // Marcar combinaciones obtenidas
  useEffect(() => {
    const marcadas = combinacionesDisponibles.map((combo) => ({
      ...combo,
      obtenida: galeriaUsuario.includes(combo.id),
    }));
    setCombinacionesConEstado(marcadas);
  }, [combinacionesDisponibles, galeriaUsuario]);

  // Cargar elementos y skins
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [{ data: items, error: e1 }, { data: skins, error: e2 }] = await Promise.all([
          supabaseConexion.from("elementos").select("id, nombre_elemento, image_url"),
          supabaseConexion.from("skins").select("id, nombre_skin, image_url"),
        ]);

        if (e1) throw e1;
        if (e2) throw e2;

        setItems(items);
        setSkins(skins);
      } catch (err) {
        console.error("Error al cargar datos:", err.message);
      }
    };

    cargarDatos();
  }, []);

  // Verificar y guardar una combinación
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
        Swal.fire({
          icon: "error",
          title: "¡Combinación inválida!",
          text: "Esa combinación no se puede conseguir porque no existe.",
        });

        setTimeout(() => {
          comprobarLogros({
            usuarioId: usuario.id,
            mezclasTotales,
            fallo: true,
            combinacionId: null,
            combinacionesDisponibles,
          });
        }, 2100);

        return false;
      }

      if (galeriaUsuario.includes(combinacion.id)) {
        Swal.fire({
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

      const datos = {
        nombre: combinacion.nombre_combinacion,
        descripcion: combinacion.descripcion,
        image_url: combinacion.image_url,
      };

      setDatosCombinacionExitosa(datos);

      await Swal.fire({
        icon: "success",
        title: "¡Combinación guardada!",
        text: "La combinación se ha añadido a tu colección.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        comprobarLogros({
          usuarioId: usuario.id,
          mezclasTotales: nuevaGaleria.length,
          fallo: false,
          combinacionId: combinacion.id,
          combinacionesDisponibles,
        });
      }, 500); // esperamos 0.5s tras Swal para evitar pisarlo

      return datos;
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
