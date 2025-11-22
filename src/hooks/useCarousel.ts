import { useState, useEffect } from 'react';

interface UseCarouselProps {
  totalSlides: number;
  interval?: number;
}

const useCarousel = ({ 
  totalSlides, 
  interval = 4000 
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, totalSlides, interval]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  return {
    currentIndex,
    nextSlide,
    goToSlide,
    handlePause,
    handleResume
  };
};

export default useCarousel;