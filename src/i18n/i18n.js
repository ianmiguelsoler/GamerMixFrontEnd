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

const resources = {
  es: {
    navegacion: esNavegacion,
    footer: esFooter,
    contenido: esContenido,
    login: esLogin,
    registro: esRegistro,
    coleccion: esColeccion,
  },
  en: {
    navegacion: enNavegacion,
    footer: enFooter,
    contenido: enContenido,
    login: enLogin,
    registro: enRegistro,
    coleccion: enColeccion,
  },
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    ns: ["navegacion", "footer", "contenido", "login", "registro", "coleccion"],
    defaultNS: "navegacion",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
