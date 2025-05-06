import React, { useEffect, useState } from "react";
import "./RandomSkinBackground.css";

const RandomSkinBackground = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Generar partículas de fondo
  const generateParticles = (num = 30) => {
    return Array.from({ length: num }, (_, i) => {
      const style = {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${8 + Math.random() * 5}s`,
        animationDelay: `${Math.random() * 5}s`,
        background: `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`,
        width: `${6 + Math.random() * 4}px`,
        height: `${6 + Math.random() * 4}px`,
      };
      return <div className="particle" style={style} key={i}></div>;
    });
  };
  
  useEffect(() => {
    const fetchSkins = async () => {
      try {
        const versionsRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
        const versions = await versionsRes.json();
        const latestVersion = versions[0];

        const championsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const championsData = await championsRes.json();
        const championKeys = Object.keys(championsData.data);

        const selectedChampions = championKeys.sort(() => 0.5 - Math.random()).slice(0, 10);

        const promises = selectedChampions.map(async (champ) => {
          const champDetailRes = await fetch(
            `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion/${champ}.json`
          );
          const champDetailData = await champDetailRes.json();
          const skins = champDetailData.data[champ].skins;
          const randomSkin = skins[Math.floor(Math.random() * skins.length)];
          return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ}_${randomSkin.num}.jpg`;
        });

        const urls = await Promise.all(promises);
        setImages(urls);
      } catch (error) {
        console.error("Error fetching skins:", error);
      }
    };

    fetchSkins();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000); // cambia cada 7 segundos la imagen que hay de fondo

    return () => clearInterval(interval);
  }, [images]);

  return (
    <>
    <div className="animated-background-container">
      {images.map((url, index) => (
        <img
          key={index}
          src={url}
          className={`bg-image ${index === currentIndex ? "visible" : "hidden"}`}
          alt={`Fondo skin ${index}`}
        />
      ))}
    </div>
    <div className="particles-container">
    {generateParticles(40)}
  </div>
  </>
  );
};

export default RandomSkinBackground;
