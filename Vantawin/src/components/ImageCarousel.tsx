"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  '/images/carousel/NG-1MCasinoTournament2610.jpeg',
  '/images/carousel/NG-VARPAYOUT.jpg',
  '/assets/Premier-League.jpg',
];

interface ImageCarouselProps {
  className?: string; // Add className prop
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ className }) => { // Destructure className
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className={`relative w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg ${className || ''}`}> {/* Apply className here */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img src={image} alt={`Carousel slide ${index + 1}`} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full focus:outline-none hover:bg-opacity-75 transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full focus:outline-none hover:bg-opacity-75 transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 w-1.5 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'} focus:outline-none`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;