import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const Carousel = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!images.length) {
    return (
      <div className="w-full h-[500px] bg-gray-800 flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-[500px] bg-black overflow-hidden">
        <img
          src={images[activeIndex]}
          alt={`Screenshot ${activeIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            }}
            />

            {images.length > 1 && (
              <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
              </>
            )}
            </div>

          {images.length > 1 && (
            <div className="mt-4 bg-[#401010] px-4 py-3">
              <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`flex items-center justify-center flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors ${
                    index === activeIndex 
                    ? 'border-[#480e0e]' 
                    : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OL0E8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}  
    </div>
  );
};

export default Carousel; 