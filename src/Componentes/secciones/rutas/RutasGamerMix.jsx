import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "../paginas/Inicio.jsx";
import Perfil from "../paginas/Perfil.jsx";
import Error from "../paginas/Error.jsx";
import GestionUsuarios from "../GestionUsuarios/GestionUsuarios.jsx";
import CrearCuenta from "../sesion/CrearCuenta.jsx";
import IniciarSesion from "../sesion/IniciarSesion.jsx";
import Coleccion from "../Coleccion/Coleccion.jsx";
import ZonaDeMezcla from "../ZonaDeMezcla/ZonaDeMezcla.jsx";
import CambiarPassword from "../sesion/recuperacionYEdicion/CambiarPassword.jsx";

const RutasGamerMix = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/gestionusuarios" element={<GestionUsuarios />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/crearcuenta" element={<CrearCuenta />} />
        <Route path="/iniciarsesion" element={<IniciarSesion />} />
        <Route path="/coleccion" element={<Coleccion />} />
        <Route path="/jugar" element={<ZonaDeMezcla />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} /> 
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default RutasGamerMix;
