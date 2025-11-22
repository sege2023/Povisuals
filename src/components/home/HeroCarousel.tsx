import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import useCarousel from '../../hooks/useCarousel';
import useCarousel from '@/hooks/useCarousel';
import ResponsiveImage from '../shared/ResponsiveImage';
import styles from './HeroCarousel.module.css';
import imageManifest from '../../assets/images-manifest.json';

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const HeroCarousel: React.FC = () => {
  const imageList: string[] = Object.values(imageManifest).flat();

  const { currentIndex, goToSlide } = useCarousel({
    totalSlides: imageList.length,
    interval: 3000
  });

  return (
    <div className={styles.mainContainer}>
      <div className={styles.carouselWrapper}>
        <div className={styles.carousel}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              className={styles.carouselSlide}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.8 }}
            >
              <ResponsiveImage
                src={imageList[currentIndex]}
                alt={`Hero image ${currentIndex + 1}`}
                // priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* <div className={styles.indicators}>
            {imageList.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  currentIndex === index ? styles.active : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;