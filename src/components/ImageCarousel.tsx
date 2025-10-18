"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const images = [
  "/images/Group 1000005755.png", // Existing image
  "/images/Group 1000005762.png", // Existing image
  "/public/placeholder.svg", // Generic placeholder
  "https://via.placeholder.com/800x400/007BFF/FFFFFF?text=Image+4",
  "https://via.placeholder.com/800x400/011B47/E0E0E0?text=Image+5",
];

const ImageCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-2xl mx-auto"> {/* Changed max-w-4xl to max-w-2xl */}
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((src, index) => (
            <div className="flex-none min-w-0 w-full" key={index}>
              <img
                src={src}
                alt={`Carousel image ${index + 1}`}
                className="block w-full h-auto object-cover rounded-xl"
                style={{ aspectRatio: '16/9' }} // Maintain aspect ratio
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-vanta-blue-dark text-vanta-neon-blue hover:bg-vanta-accent-dark-blue p-2 rounded-full shadow-md"
        onClick={scrollPrev}
        disabled={!emblaApi?.canScrollPrev()}
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-vanta-blue-dark text-vanta-neon-blue hover:bg-vanta-accent-dark-blue p-2 rounded-full shadow-md"
        onClick={scrollNext}
        disabled={!emblaApi?.canScrollNext()}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
};

export default ImageCarousel;