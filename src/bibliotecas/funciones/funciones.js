// funciones.js
import Swal from "sweetalert2";
import i18n from "../../i18n/i18n.js";



const generarUuidAleatorio = () => {
  return crypto.randomUUID();
};

const cambiarIdioma = (lang) => {
  import("i18next").then((i18nModule) => {
    const i18n = i18nModule.default;
    i18n.changeLanguage(lang);
  });
};


const mostrarModalIdioma = () => {
  Swal.fire({
    title: "🌍 Cambiar idioma",
    html: `
      <div style="display: flex; justify-content: center; gap: 40px; align-items: center; padding-top: 10px; flex-wrap: wrap;">
        <div id="btn-es" style="cursor: pointer; text-align: center; transition: transform 0.3s ease;" 
             onmouseover="this.style.transform='scale(1.1)'" 
             onmouseout="this.style.transform='scale(1)'">
          <img src="https://flagcdn.com/w80/es.png" alt="Español" style="width: 90px; border-radius: 6px; box-shadow: 0 0 10px rgba(0,0,0,0.2);" />
          <p style="margin-top: 8px; font-weight: 600;">Español</p>
        </div>
        <div id="btn-en" style="cursor: pointer; text-align: center; transition: transform 0.3s ease;" 
             onmouseover="this.style.transform='scale(1.1)'" 
             onmouseout="this.style.transform='scale(1)'">
          <img src="https://flagcdn.com/w80/gb.png" alt="English" style="width: 90px; border-radius: 6px; box-shadow: 0 0 10px rgba(0,0,0,0.2);" />
          <p style="margin-top: 8px; font-weight: 600;">English</p>
        </div>
      </div>
    `,
    showConfirmButton: false,
    didOpen: () => {
      document.getElementById("btn-es").addEventListener("click", () => {
        i18n.changeLanguage("es");
        Swal.close();
      });
      document.getElementById("btn-en").addEventListener("click", () => {
        i18n.changeLanguage("en");
        Swal.close();
      });
    },
  });
};

export {
  generarUuidAleatorio,
  mostrarModalIdioma,
  cambiarIdioma,
};
