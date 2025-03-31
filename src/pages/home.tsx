import { useEffect, useState } from "react";
import Navbar from "@/components/layout/nav";
import styles from "@/styles/home.module.css"

interface DriveImage {
  name: string;
  url: string;
}

const Home = () => {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/api/getImages?t=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        console.log("Received:", data);
        
        if (!Array.isArray(data)) {
          throw new Error("Expected array but got: " + JSON.stringify(data));
        }
        
        setImages(data.filter(img => img.url)); 
      } catch (error) {
        console.error("Fetch failed:", error);
      }finally{
        setLoading(false)
      }
    };
  
    fetchImages();
  }, []);

//   const getImageUrl = (imageUrl: string) => {
//     return `http://localhost:3001${imageUrl}`;
//   };


  return (
    <>
      <Navbar />
      <h1 className="text-blue">Gallery</h1>
      
      {loading ? (
        <p>Loading images...</p>
      ) : images.length > 0 ? (
        <div className={styles.imagegrid}>
          {images.map((img, index) => (
            <div key={index} className={styles.imageContainer}>
                <img
                key={img.url}
                src={`http://localhost:3001${img.url}`}
                alt={img.name}
                // crossOrigin="anonymous"
                className={styles.galleryimage}
                onError={(e) => {
                    console.error("Failed to load:", img.url);
                    e.currentTarget.style.display = 'none';
                }}
            />
            <p className={styles.imageName}>{img.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No images available</p>
      )}
    </>
  );
};

export default Home;