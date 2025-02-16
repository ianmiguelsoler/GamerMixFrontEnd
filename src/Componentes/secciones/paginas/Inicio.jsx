import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaGamepad } from "react-icons/fa";
import { createSwapy } from "swapy";
import "./inicio.css";

const champions = [
  {
    id: 1,
    name: "Ahri",
    description: "Una maga encantadora con gran movilidad y daño explosivo.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg",
  },
  {
    id: 2,
    name: "Yasuo",
    description: "Un espadachín ágil con un alto dominio del viento y daño crítico.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg",
  },
  {
    id: 3,
    name: "Jinx",
    description: "Una tiradora caótica con explosivos y muchas balas.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg",
  },
  {
    id: 4,
    name: "Darius",
    description: "Un guerrero brutal con un enorme hacha y gran daño físico.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg",
  },
  {
    id: 5,
    name: "Lux",
    description: "Una maga brillante con control de luz y grandes efectos visuales.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg",
  },
  {
    id: 6,
    name: "Ekko",
    description: "Un genio que manipula el tiempo con un ingenioso dispositivo.",
    image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ekko_0.jpg",
  }
];

const Inicio = () => {
  useEffect(() => {
    const container = document.querySelector(".swapy-container");
    if (container) {
      createSwapy(container, {
        animation: "dynamic",
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="inicio__fondo min-h-screen flex flex-col items-center p-6"
    >
      <h2 className="inicio__titulo">
        <FaGamepad className="text-yellow-400" /> Bienvenido a GamerMix
      </h2>

      <p className="inicio__descripcion">
        Esta aplicación te permitirá combinar skins con elementos y probar cómo se ven juntos. 
        Puedes arrastrar y soltar los campeones para experimentar con diferentes combinaciones.
      </p>

      <div className="swapy-container inicio__columnas">
        {champions.map((champion) => (
          <div key={champion.id} className="swapy-slot inicio__columna" data-swapy-slot={champion.id}>
            <div className="swapy-item cursor-grab active:scale-95" data-swapy-item={champion.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center text-center"
              >
                <div className="inicio__imagen-container">
                  <img src={champion.image} alt={champion.name} className="inicio__terminal" />
                </div>
                <h3 className="inicio__nombre">{champion.name}</h3>
                <p className="inicio__texto">{champion.description}</p>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Inicio;
