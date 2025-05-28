import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Navegación.
import esNavegacion from "./locales/es/navegacion/navegacion.js";
import enNavegacion from "./locales/en/navegacion/navegacion.js";

// Footer.
import esFooter from "./locales/es/footer/footer.js";
import enFooter from "./locales/en/footer/footer.js";

// Contenido.
import esContenido from "./locales/es/contenido/contenido.js";
import enContenido from "./locales/en/contenido/contenido.js";

// Login.
import esLogin from "./locales/es/login/login.js";
import enLogin from "./locales/en/login/login.js";

// Registro
import esRegistro from "./locales/es/Registro/registro.js";
import enRegistro from "./locales/en/Registro/registro.js";

// Colección
import esColeccion from "./locales/es/coleccion/coleccion.js";
import enColeccion from "./locales/en/coleccion/coleccion.js";

// Perfil
import esPerfil from "./locales/es/perfil/perfil.js";
import enPerfil from "./locales/en/perfil/perfil.js";

// Zona de Mezcla
import esZonaDeMezcla from "./locales/es/zonaDeMezcla/zonaDeMezcla.js";
import enZonaDeMezcla from "./locales/en/zonaDeMezcla/zonaDeMezcla.js";

// Gestión de Usuarios
import esGestionUsuarios from "./locales/es/gestionUsuarios/gestionUsuarios.js";
import enGestionUsuarios from "./locales/en/gestionUsuarios/gestionUsuarios.js";

// Cambiar Contraseña
import esCambiarPassword from "./locales/es/cambiarPassword/cambiarPassword.js";
import enCambiarPassword from "./locales/en/cambiarPassword/cambiarPassword.js";

// Logros
import esLogros from "./locales/es/logros/logros.js";
import enLogros from "./locales/en/logros/logros.js";

// Error
import esError from "./locales/es/error/error.js";
import enError from "./locales/en/error/error.js";

// Inicio
import esInicio from "./locales/es/inicio/inicio.js";
import enInicio from "./locales/en/inicio/inicio.js";
const resources = {
  es: {
    navegacion: esNavegacion,
    footer: esFooter,
    contenido: esContenido,
    login: esLogin,
    registro: esRegistro,
    coleccion: esColeccion,
    perfil: esPerfil,
    zonaDeMezcla: esZonaDeMezcla,
    gestionUsuarios: esGestionUsuarios,
    cambiarPassword: esCambiarPassword,
    logros: esLogros, 
    error: esError,
    inicio: esInicio,
  },
  en: {
    navegacion: enNavegacion,
    footer: enFooter,
    contenido: enContenido,
    login: enLogin,
    registro: enRegistro,
    coleccion: enColeccion,
    perfil: enPerfil,
    zonaDeMezcla: enZonaDeMezcla,
    gestionUsuarios: enGestionUsuarios,
    cambiarPassword: enCambiarPassword,
    logros: enLogros, 
    error: enError,
    inicio: enInicio
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    ns: [
      "navegacion",
      "footer",
      "contenido",
      "login",
      "registro",
      "coleccion",
      "perfil",
      "zonaDeMezcla",
      "gestionUsuarios",
      "cambiarPassword",
      "logros",
      "error" 
    ],
    defaultNS: "navegacion",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
