import React, { useContext } from "react";
import { contextoLogros } from "../../../contextos/ProveedorMezclasLogros.jsx";
import { contextoSesion } from "../../../contextos/ProveedorSesion.jsx";
import { useTranslation } from "react-i18next";
import Logro from "./logro/logro.jsx";
import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";
import "./logros.css";
import ShinyText from "../../../bibliotecas/ShinyText.jsx";
import { motion } from "framer-motion";
import FuzzyText from "../../../bibliotecas/FuzzyText.jsx";

const Logros = () => {
  const { logrosUsuario, cargandoLogros, errorLogros, totalLogros } =
    useContext(contextoLogros);
  const { usuario } = useContext(contextoSesion);
  const { t } = useTranslation("logros");

  if (cargandoLogros) return <p>{t("loading")}</p>;
  if (errorLogros)
    return (
      <p>
        {t("error")}: {errorLogros}
      </p>
    );

  return (
    <>
      <RandomSkinBackground />

      <div className="logros p-6 space-y-4">
        {usuario?.nombre_usuario && (
          <div className="logros__cabecera">
            <ShinyText
              text={`🎖️ ${t("yourAchievements")} (${
                logrosUsuario.length
              } / ${totalLogros})`}
              disabled={false}
              speed={3}
              className="logros__titulo"
            />
            
            <div className="logros__usuario-nombre">
              <span>{usuario.nombre_usuario}</span>
            </div>
          </div>
        )}

        <div className="logros__separador" />
        <div className="logros__scrollable">
          {logrosUsuario.length === 0 ? (
            <p>{t("noAchievements")}</p>
          ) : (
            logrosUsuario.map((logro, index) => (
              <motion.div
                key={logro.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Logro
                  logro={logro}
                  fecha={logro.fecha_obtenido}
                  puntos={logro.puntos}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Logros;
