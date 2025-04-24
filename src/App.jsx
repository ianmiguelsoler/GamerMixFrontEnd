import Navegacion from "./Componentes/estructura/Navegacion.jsx";
import Cabecera from "./Componentes/estructura/Cabecera.jsx";
import Contenido from "./Componentes/estructura/Contenido.jsx";
import Pie from "./Componentes/estructura/Pie.jsx";
import RutasGamerMix from "./Componentes/secciones/rutas/RutasGamerMix.jsx";
import ProveedorSesion from "./contextos/ProveedorSesion.jsx";
import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './i18n/i18n.js';

function App() {
  return (
    <div className="app flex">
      <Navegacion />
      <div className="ml-[80px] p-6 flex-1"> 
        <ProveedorSesion>
          <Cabecera />
          <Contenido>
            <RutasGamerMix />
          </Contenido>
          <Pie />
        </ProveedorSesion>
      </div>
    </div>
  );
}

export default App;
