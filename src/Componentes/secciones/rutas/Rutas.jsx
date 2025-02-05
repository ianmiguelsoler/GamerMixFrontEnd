import React from "react";
import { Routes, Route } from "react-router-dom";

const RutasUT06 = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default RutasUT06;
