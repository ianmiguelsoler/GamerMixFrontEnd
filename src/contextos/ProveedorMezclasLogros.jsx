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

  // Cargar logros del usuario
  useEffect(() => {
    const obtenerLogros = async () => {
      try {
        setCargandoLogros(true);
        let logrosConDetalle = [];

        if (usuario?.id) {
          const { data: dataUsuario, error: errorUsuario } = await supabaseConexion
            .from("logros_usuarios")
            .select(`
              fecha_obtenido,
              logros (
                id,
                nombre_logro,
                descripcion,
                puntos,
                image_url,
                created_at
              )
            `)
            .eq("id_usuario", usuario.id);

          if (errorUsuario) throw errorUsuario;

          logrosConDetalle = dataUsuario.map((registro) => ({
            ...registro.logros,
            fecha_obtenido: registro.fecha_obtenido,
          }));
        }

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
        console.error("Error al cargar galería del usuario:", err.message);
      }
    };

    cargarGaleriaUsuario();
  }, [usuario]);

  // Marcar combinaciones obtenidas
  useEffect(() => {
    const combinacionesMarcadas = combinacionesDisponibles.map((combo) => ({
      ...combo,
      obtenida: galeriaUsuario.includes(combo.id),
    }));
    setCombinacionesConEstado(combinacionesMarcadas);
  }, [combinacionesDisponibles, galeriaUsuario]);

  // Cargar elementos y skins
  useEffect(() => {
    const cargarElementosYSkins = async () => {
      try {
        const [{ data: dataItems, error: errorItems }, { data: dataSkins, error: errorSkins }] = await Promise.all([
          supabaseConexion.from("elementos").select("id, nombre_elemento, image_url"),
          supabaseConexion.from("skins").select("id, nombre_skin, image_url"),
        ]);

        if (errorItems) throw errorItems;
        if (errorSkins) throw errorSkins;

        setItems(dataItems);
        setSkins(dataSkins);
      } catch (err) {
        console.error("Error al cargar elementos y skins:", err.message);
      }
    };

    cargarElementosYSkins();
  }, []);

  // Lógica principal: verificar y guardar combinación
  const verificarYGuardarCombinacion = async (idElemento, idSkin) => {
    setGuardandoCombinacion(true);
    setErrorCombinacion(null);
    setCombinacionExitosa(null);
    setDatosCombinacionExitosa(null);

    try {
      if (!usuario?.id) throw new Error("Usuario no autenticado");

      const combinacion = combinacionesDisponibles.find(
        (combo) =>
          combo.id_elemento === idElemento && combo.id_skin === idSkin
      );

      if (!combinacion) {
        Swal.fire({
          icon: "error",
          title: "¡Combinación inválida!",
          text: "Esa combinación no se puede conseguir porque no existe. Prueba con otra.",
        });

        await comprobarLogros({
          usuarioId: usuario.id,
          mezclasTotales,
          fallo: true,
          combinacionId: null,
          combinacionesDisponibles,
        });

        return false;
      }

      if (galeriaUsuario.includes(combinacion.id)) {
        Swal.fire({
          icon: "info",
          title: "¡Ya la tienes!",
          text: "Ya has hecho esta combinación, cabeza pixel.",
        });
        return false;
      }

      const { error: errorInsertar } = await supabaseConexion
        .from("galeria")
        .insert([
          {
            id_usuario: usuario.id,
            id_combinacion: combinacion.id,
          },
        ]);

      if (errorInsertar && errorInsertar.code !== "23505") {
        throw errorInsertar;
      }

      setCombinacionExitosa(combinacion.id);
      const nuevaGaleria = [...galeriaUsuario, combinacion.id];
      setGaleriaUsuario(nuevaGaleria);
      setMezclasHechas(nuevaGaleria.length);

      const datosCombinacion = {
        nombre: combinacion.nombre_combinacion,
        descripcion: combinacion.descripcion,
        image_url: combinacion.image_url,
      };

      setDatosCombinacionExitosa(datosCombinacion);

      Swal.fire({
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

      return datosCombinacion;
    } catch (err) {
      setErrorCombinacion(err.message);
      return false;
    } finally {
      setGuardandoCombinacion(false);
    }
  };

  const datosAExportar = {
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
  };

  return (
    <contextoLogros.Provider value={datosAExportar}>
      {children}
    </contextoLogros.Provider>
  );
};

export default ProveedorMezclasLogros;
export { contextoLogros };
