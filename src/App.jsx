import Navegacion from './Componentes/estructura/Navegacion.jsx';
import Cabecera from './Componentes/estructura/Cabecera.jsx';
import Contenido from './Componentes/estructura/Contenido.jsx';
import Pie from './Componentes/estructura/Pie.jsx';
import RutasGamerMix from './Componentes/secciones/rutas/RutasGamerMix.jsx';
import './App.css'
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


function App() {

  return (
    <>
      <div className="app">
        <div className="ml-[200px] p-6">
          {/* <ProveedorSesion> */}
            <Navegacion />
            <Cabecera />
                <Contenido>
                  <RutasGamerMix />
                </Contenido>
            <Pie />
          {/* </ProveedorSesion> */}
        </div>
      </div>
    </>
  )
}

export default App
