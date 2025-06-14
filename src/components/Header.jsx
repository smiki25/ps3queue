import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ onWishlistClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="h-16 bg-[#480e0e] text-white flex items-center justify-between px-6">
      <h1
        className="text-5xl font-voltaire font-black tracking-wider transform scale-x-110"
        onClick={() => navigate('/')}
      >
        EXTREMEN GAMING
      </h1>
      <button 
        onClick={onWishlistClick}
        className="text-2xl font-voltaire font-black tracking-wide transform scale-x-105 hover:text-gray-200 transition-colors"
      >
        WISHLIST
      </button>
    </header>
  );
};

export default Header; 