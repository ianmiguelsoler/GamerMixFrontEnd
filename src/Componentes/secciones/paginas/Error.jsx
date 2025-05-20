import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import { createSwapy } from "swapy";
import { useTranslation } from "react-i18next";

import FuzzyText from "../../../bibliotecas/FuzzyText.jsx";
import RandomSkinBackground from "../../../bibliotecas/RandomSkinBackground.jsx";
import "./Error.css";

const Error = () => {
  const swapyInstance = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation("error");

  useEffect(() => {
    if (containerRef.current) {
      swapyInstance.current = createSwapy(containerRef.current);
    }

    return () => {
      swapyInstance.current?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="error-container">
      <RandomSkinBackground />
      <div className="error-overlay" />
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="error-card"
      >
        <FuzzyText
          fontSize="clamp(3rem, 9vw, 6rem)"
          fontWeight={900}
          color="#ffffff"
          enableHover={true}
          baseIntensity={0.2}
          hoverIntensity={0.5}
        >
          {t("title")}
        </FuzzyText>

        <p className="error-description">{t("description")}</p>

        <Button
          icon="pi pi-home"
          label={t("backToHome")}
          className="error-button"
          onClick={() => (window.location.href = "/")}
        />
      </motion.div>
    </div>
  );
};

export default Error;
