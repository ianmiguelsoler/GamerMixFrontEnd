import i18n                   from "i18next";
import { initReactI18next }   from "react-i18next";
import LanguageDetector       from "i18next-browser-languagedetector";

// Navegación.
import esNavegacion           from "./locales/es/navegacion/navegacion.js";
import enNavegacion           from "./locales/en/navegacion/navegacion.js";

// Footer.
import esFooter               from "./locales/es/footer/footer.js";
import enFooter               from "./locales/en/footer/footer.js";

// Contenido.
import esContenido            from "./locales/es/contenido/contenido.js";
import enContenido            from "./locales/en/contenido/contenido.js";


// Configura los recursos agrupados por idioma y namespace.
const resources = {
  es: {
    navegacion: esNavegacion,
    footer: esFooter,
    contenido: esContenido,
  },
  en: {
    navegacion: enNavegacion,
    footer: enFooter,
    contenido: enContenido,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es",
    ns: ["navegacion", "footer", "contenido"],
    defaultNS: "navegacion",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
