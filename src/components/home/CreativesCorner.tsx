import React from 'react';
import styles from './CreativesCorner.module.css';
import ResponsiveImage from '../shared/ResponsiveImage';
import FadeUp from '../animation/FadeUp';
import { StaggerContainer, StaggerItem } from '../animation/StaggerChildren';
import imageManifest from '../../assets/images-manifest.json';
import { motion } from 'framer-motion';
const CreativesCorner: React.FC = () => {
  // Get first 4 images for demonstration
  // imageManifest is keyed by gallery categories; flatten the arrays and take the first 4 images
  const creativeImages = (Object.values(imageManifest) as string[][]).flat().slice(0, 4);

  return (
    <FadeUp className={styles.sectionContainer}>
      <div className={styles.sectionContent}>
        <h2 className={styles.header}>Creatives Corner</h2>
        
        <StaggerContainer className={styles.grid}>
          {creativeImages.map((src, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className={styles.gridItem}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className={styles.imageWrapper}>
                  <ResponsiveImage 
                    src={src} 
                    alt={`Creative work ${index + 1}`}
                  />
                  <div className={styles.imageOverlay} />
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </FadeUp>
  );
};

export default CreativesCorner;