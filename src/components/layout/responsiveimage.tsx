const ResponsiveImage = ({ src, alt, className }) => {
  // Function to generate different image sizes from your local path
  const generateImageSizes = (imagePath) => {
    // Remove the file extension
    const pathWithoutExt = imagePath.replace(/\.[^/.]+$/, "");
    const extension = imagePath.split('.').pop().toLowerCase();
    
    return {
      // For local development/static hosting
      small: `${pathWithoutExt}_small.${extension}`,      // 600x400
      medium: `${pathWithoutExt}_medium.${extension}`,    // 800x600  
      large: `${pathWithoutExt}_large.${extension}`,      // 1200x800
      original: imagePath // fallback to original
    };
  };