// import React from 'react';
// import styles from './ResponsiveImage.module.css';
// import images from '../../assets/image-manifest.json'
// interface ResponsiveImageProps {
//   src: string; // Original image path from JSON
//   alt: string;
//   className?: string;
//   priority?: boolean; // For above-fold images
// }


// // Helper to generate responsive image paths
// const getResponsivePaths = (originalSrc: string) => {
//   const base = originalSrc.replace(/\.[^.]+$/, '');
//   const extension = originalSrc.split('.').pop();
//   return {
//     small: `${base}_small.${extension}`,
//     medium: `${base}_medium.${extension}`,
//     large: `${base}_large.${extension}`
//   };
// };

// const imageData = images; // Assuming images is the imported JSON object

// const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
//   src, 
//   alt, 
//   className, 
//   priority = false 
// }) => {
//   const { small, medium, large } = getResponsivePaths(src);
  
//   return (
//     <picture className={`${styles.imageWrapper} ${className}`}>
//       {/* Mobile-first: small by default */}
//       <source srcSet={large} media="(min-width: 1201px)" />
//       <source srcSet={medium} media="(min-width: 769px)" />
//       <source srcSet={small} media="(max-width: 768px)" />
      
//       <img
//         src={large}
//         alt={alt}
//         loading={priority ? "eager" : "lazy"}
//         className={styles.responsiveImage}
//         decoding="async"
//       />
//     </picture>
//   );
// };

// export default ResponsiveImage;


// import React from 'react';
// import styles from './ResponsiveImage.module.css';

// interface ResponsiveImageProps {
//   src: string;
//   alt: string;
//   className?: string;
//   priority?: boolean;
// }

// // const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
// //   src, 
// //   alt, 
// //   className = '', 
// //   priority = false 
// // }) => {
// //   return (
// //     <img
// //       src={src}
// //       alt={alt}
// //       loading={priority ? "eager" : "lazy"}
// //       className={`${styles.responsiveImage} ${className}`}
// //     />
// //   );
// // };

// // export default ResponsiveImage;

// const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt , className}) => {
//   const getImagePaths = (originalSrc: string) => {
//     const base = originalSrc.replace(/\.[^.]+$/, '');
//     return {
//       small: {
//         webp: `${base}_small.webp`,
//         jpg: `${base}_small.jpg`
//       },
//       medium: {
//         webp: `${base}_medium.webp`,
//         jpg: `${base}_medium.jpg`
//       },
//       large: {
//         webp: `${base}_large.webp`,
//         jpg: `${base}_large.jpg`
//       }
//     };
//   };

//   const paths = getImagePaths(src);

//   return (
//     <picture>
//       {/* WebP for modern browsers */}
//       <source 
//         type="image/webp"
//         media="(max-width: 480px)" 
//         srcSet={paths.small.webp} 
//       />
//       <source 
//         type="image/webp"
//         media="(max-width: 768px)" 
//         srcSet={paths.medium.webp} 
//       />
//       <source 
//         type="image/webp"
//         srcSet={paths.large.webp} 
//       />
      
//       {/* JPEG fallback for old browsers */}
//       <source 
//         media="(max-width: 480px)" 
//         srcSet={paths.small.jpg} 
//       />
//       <source 
//         media="(max-width: 768px)" 
//         srcSet={paths.medium.jpg} 
//       />
      
//       <img src={paths.large.jpg} alt={alt} loading="lazy" className={`${styles.responsiveImage} ${className}`}/>
//     </picture>
//   );
// };
// export default ResponsiveImage;

// import React from 'react';

// interface ResponsiveImageProps {
//   basePath: string; // e.g., "/download-images/my-food-pic" (NO extension)
//   alt: string;
//   className?: string;
//   priority?: boolean; // set true for LCP (Largest Contentful Paint) images
// }

// const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
//   basePath, 
//   alt, 
//   className,
//   priority = false 
// }) => {
//   // 1. Define the mapped sources based on your Node script logic
//   // format: path_suffix.ext width-descriptor
//   const srcSetWebP = `
//     ${basePath}_small.webp 600w,
//     ${basePath}_medium.webp 800w,
//     ${basePath}_large.webp 1200w
//   `;

//   const srcSetJpeg = `
//     ${basePath}_small.jpg 600w,
//     ${basePath}_medium.jpg 800w,
//     ${basePath}_large.jpg 1200w
//   `;

//   // 2. Define sizes to tell browser which one to pick
//   // "If screen is < 640px, assume image takes up 100vw. Otherwise..."
//   const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

//   return (
//     <picture>
//       {/* Browser prefers WebP if supported */}
//       <source type="image/webp" srcSet={srcSetWebP} sizes={sizes} />
      
//       {/* Fallback to JPEG */}
//       <img 
//         src={`${basePath}_medium.jpg`} // Default fallback
//         srcSet={srcSetJpeg}
//         sizes={sizes}
//         alt={alt}
//         className={`w-full h-full object-cover ${className}`} // object-cover handles the cropping visually!
//         loading={priority ? "eager" : "lazy"}
//         decoding="async"
//       />
//     </picture>
//   );
// };

// export default ResponsiveImage;

import React from 'react';
import styles from './ResponsiveImage.module.css';

interface ResponsiveImageProps {
  src: string; // This is the path like "/download-images/food.jpg"
  alt: string;
  className?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, className }) => {
  // 1. GUARD CLAUSE: If data isn't ready, don't render anything
  if (!src) return null; 

  const getImagePaths = (originalSrc: string) => {
    // Remove extension safely
    const base = originalSrc.replace(/\.[^/.]+$/, "");
    
    // Check console to ensure paths look right: "/download-images/food_small.webp"
    // console.log("Base path:", base); 

    return {
      small: { webp: `${base}_small.webp`, jpg: `${base}_small.jpg` },
      medium: { webp: `${base}_medium.webp`, jpg: `${base}_medium.jpg` },
      large: { webp: `${base}_large.webp`, jpg: `${base}_large.jpg` }
    };
  };

  const paths = getImagePaths(src);

  return (
    <picture className={styles.imageWrapper}>
      {/* --- WEBP SOURCES --- */}
      <source type="image/webp" media="(max-width: 480px)" srcSet={paths.small.webp} />
      <source type="image/webp" media="(max-width: 768px)" srcSet={paths.medium.webp} />
      <source type="image/webp" srcSet={paths.large.webp} />
      
      {/* --- JPEG FALLBACKS --- */}
      <source media="(max-width: 480px)" srcSet={paths.small.jpg} />
      <source media="(max-width: 768px)" srcSet={paths.medium.jpg} />
      
      {/* --- MAIN IMAGE --- */}
      {/* Use the large JPG as default src so older browsers still see a high-res image */}
      <img 
        src={paths.large.jpg} 
        alt={alt} 
        loading="lazy" 
        className={`${styles.responsiveImage} ${className || ''}`}
      />
    </picture>
  );
};

export default ResponsiveImage;