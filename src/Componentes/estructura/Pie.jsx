import React from "react";
import "./Pie.css";
import { useTranslation } from "react-i18next";

const Pie = () => {
  const { t } = useTranslation("footer");

  return (
    <footer id="pie">
      <p>{t("rights")}</p>
    </footer>
  );
};

export default Pie;
