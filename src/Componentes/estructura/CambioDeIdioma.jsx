import React from "react";
import { useTranslation } from "react-i18next";

const CambioDeIdioma = () => {
  const { i18n } = useTranslation();

  const cambiarIdioma = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => cambiarIdioma("es")}
        className="px-3 py-1 rounded bg-white text-black hover:bg-gray-300 transition"
      >
        🇪🇸 ES
      </button>
      <button
        onClick={() => cambiarIdioma("en")}
        className="px-3 py-1 rounded bg-white text-black hover:bg-gray-300 transition"
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default CambioDeIdioma;
