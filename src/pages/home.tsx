import { useEffect, useState } from "react";
import Navbar from "../components/layout/nav";
import imageData from "../assets/image-manifest.json";
import styles from '../styles/carousel.module.css'
import HeroCarousel from "@/components/home/HeroCarousel";
import AboutSection from "@/components/home/AboutSection";
import CreativesCorner from "@/components/home/CreativesCorner";
import Footer from "@/components/layout/footer";
const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = imageData.imageUrls; 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval); 
  }, [images]);

  return (
    <>
      <Navbar />
      {/* <div className = {styles.carouselContainer}>
        <div className = {styles.carouselWrapper}>
            <div className={styles.carousel}>
            {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={`${styles.carouselImage} ${index === currentIndex ? styles.active : ''}`}
            />
          ))}
          </div>
        </div>
      </div> */}
      <HeroCarousel />
      <AboutSection />
      <CreativesCorner />
      <Footer/>
      {/* <img src={images[currentIndex]} alt="Slideshow" /> */}

    </>
  );
};

export default Home;