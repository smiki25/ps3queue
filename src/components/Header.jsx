import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onWishlistClick }) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#480e0e] text-white flex items-center justify-between px-3 sm:px-4 md:px-6">
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-voltaire font-black tracking-wide sm:tracking-wider transform scale-x-105 sm:scale-x-110 cursor-pointer hover:text-gray-200 transition-colors flex-shrink min-w-0 leading-none"
        onClick={() => navigate('/')}
      >
        EXTREMEN GAMING
      </h1>
      <button 
        onClick={onWishlistClick}
        className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-voltaire font-black tracking-wide transform scale-x-105 hover:text-gray-200 active:text-gray-200 transition-colors touch-manipulation flex-shrink-0 ml-2"
      >
        WISHLIST
      </button>
    </header>
  );
};

export default Header; 