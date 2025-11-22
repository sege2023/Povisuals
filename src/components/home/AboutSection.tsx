import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AboutSection.module.css';
import ResponsiveImage from '../shared/ResponsiveImage';
import FadeUp from '../animation/FadeUp';
import { CrossfadeGroup } from '../animation/CrossfadeGroup';
import { Crossfade } from '../animation/Crossfade';
import image1 from '../../../public/downloaded-images/IMG_1814.jpg'
import image2 from '../../../public/downloaded-images/IMG_9841.1.jpeg'

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
};

const crossfade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

const AboutSection: React.FC = () => {
  const [activeLink, setActiveLink] = useState<'about' | 'portfolio'>('about');
  
  // Placeholder image URLs - replace with actual paths from manifest
  const aboutImage = image1;
//   const portfolioImage = '/downloaded-images/portfolio-showcase.JPG';
const portfolioImage = image2;

  return (
    <FadeUp 
      className={styles.sectionContainer}
    //   {...fadeUp}
    //   viewport={{ once: true, margin: "-100px" }}
    >
      <div className={styles.sectionContent}>
        <h2 className={styles.header}>Capturing Moments, Creating Legacy</h2>
        <p className={styles.description}>
          With over a decade of experience, POVisuals specializes in portrait and 
          landscape photography that tells unique visual stories. His work has been 
          featured in National Geographic and displayed in galleries worldwide.
        </p>

        <div className={styles.imageContainer}>
          <CrossfadeGroup >
            <Crossfade
              key={activeLink}
              className={styles.imageWrapper}
              {...crossfade}
            >
              <ResponsiveImage 
                src={activeLink === 'about' ? aboutImage : portfolioImage}
                alt={activeLink === 'about' 
                  ? "Povisual portrait" 
                  : "Portfolio highlights"}
                // priority
              />
            </Crossfade>
          </CrossfadeGroup>
        </div>

        <div className={styles.linksContainer}>
          <div className={styles.linksWrapper}>
            <div className={styles.connectorLine} />
            <motion.div 
              className={styles.indicatorLine} 
              animate={{ 
                left: activeLink === 'about' ? '0%' : '50%',
                width: '50%'
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            
            <button
              className={styles.link}
              onMouseEnter={() => setActiveLink('about')}
              onClick={() => setActiveLink('about')}
            >
              ABOUT ME
            </button>
            
            <div className={styles.divider} />
            
            <button
              className={styles.link}
              onMouseEnter={() => setActiveLink('portfolio')}
              onClick={() => setActiveLink('portfolio')}
            >
              MY PORTFOLIO
            </button>
          </div>
        </div>
      </div>
    </FadeUp>
  );
};

export default AboutSection;