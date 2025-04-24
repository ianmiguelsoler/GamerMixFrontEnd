import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importa cada archivo de traducción (namespace)
import esNavegacion from "./locales/es/navegacion/navegacion.js";
import enNavegacion from "./locales/en/navegacion/navegacion.js";

// Configura los recursos agrupados por idioma y namespace
const resources = {
  es: {
    navegacion: esNavegacion,
  },
  en: {
    navegacion: enNavegacion,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "es", // Idioma por defecto
    ns: ["navegacion"], // Lista de namespaces
    defaultNS: "navegacion", // Namespace por defecto
    interpolation: {
      escapeValue: false, // react ya escapa los valores
    },
  });

export default i18n;
