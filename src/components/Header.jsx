import React from 'react';

const Header = ({ onWishlistClick }) => {
  return (
    <header className="h-14 md:h-16 bg-[#480e0e] text-white flex items-center justify-between px-4 md:px-6">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-voltaire font-black tracking-wider transform scale-x-110 truncate">
        EXTREMEN GAMING
      </h1>
      <button 
        onClick={onWishlistClick}
        className="text-lg md:text-xl lg:text-2xl font-voltaire font-black tracking-wide transform scale-x-105 hover:text-gray-200 active:text-gray-200 transition-colors touch-manipulation flex-shrink-0"
      >
        WISHLIST
      </button>
    </header>
  );
};

export default Header; 