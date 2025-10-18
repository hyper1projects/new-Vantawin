import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const images = [
  "/images/Group 1000005763.png",
  "/images/Group 1000005763.png", // Duplicating the image to show carousel functionality
  "/images/Group 1000005763.png",
];

const ImageCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((src, index) => (
            <div className="flex-none min-w-0 w-full" key={index}>
              <img
                src={src}
                alt={`Carousel image ${index + 1}`}
                className="block w-full h-auto object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 text-vanta-neon-blue hover:bg-white/20 p-2 rounded-full shadow-md backdrop-blur-sm"
        onClick={scrollPrev}
        disabled={!emblaApi?.canScrollPrev()}
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 text-vanta-neon-blue hover:bg-white/20 p-2 rounded-full shadow-md backdrop-blur-sm"
        onClick={scrollNext}
        disabled={!emblaApi?.canScrollNext()}
      >
        <ChevronRight size={24} />
      </Button>
    </div>
  );
};

export default ImageCarousel;