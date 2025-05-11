import React from "react";
import Navegacion from "./Componentes/estructura/Navegacion.jsx";
import Cabecera from "./Componentes/estructura/Cabecera.jsx";
import Contenido from "./Componentes/estructura/Contenido.jsx";
import Pie from "./Componentes/estructura/Pie.jsx";
import RutasGamerMix from "./Componentes/secciones/rutas/RutasGamerMix.jsx";
import ProveedorSesion from "./contextos/ProveedorSesion.jsx";
import AdministradorDeSonidoProvider from "./contextos/AdministradorDeSonido.jsx";

import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./i18n/i18n.js";

function App() {
  return (
    <ProveedorSesion> 
    <AdministradorDeSonidoProvider>
      <div className="app flex">
          <Navegacion />
          <div className="ml-[80px] p-6 flex-1">
            <Cabecera />
            <Contenido>
              <RutasGamerMix />
            </Contenido>
            <Pie />
          </div>
      </div>
    </AdministradorDeSonidoProvider>
    </ProveedorSesion>
  );
}

export default App;
