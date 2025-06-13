import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Header from '../components/Header';
import Queue from '../components/Queue';
import WishlistModal from '../components/WishlistModal';
import { useGame } from '../context/GameContext';

const QueuePage = () => {
  const [showWishlist, setShowWishlist] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetUserData } = useGame();
  
  const selectedPlatforms = location.state?.selectedPlatforms || ['PlayStation 2', 'PlayStation 3'];

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your preferences and data?')) {
      resetUserData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#2b2b2b] flex flex-col">
      <Header onWishlistClick={() => setShowWishlist(true)} />
      
      <div className="bg-[#1a1a1a] px-6 py-3 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-voltaire"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Menu
        </button>
        
        <div className="text-white font-voltaire">
          Platforms: {selectedPlatforms.join(', ')}
        </div>
        
        <button
          onClick={handleReset}
          className="text-red-400 hover:text-red-300 transition-colors font-voltaire"
        >
          Reset Data
        </button>
      </div>

      <Queue selectedPlatforms={selectedPlatforms} />

      <WishlistModal 
        isOpen={showWishlist} 
        onClose={() => setShowWishlist(false)} 
      />
    </div>
  );
};

export default QueuePage; 