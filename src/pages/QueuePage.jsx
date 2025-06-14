import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Queue from '../components/Queue';
import WishlistModal from '../components/WishlistModal';

const QueuePage = () => {
  const [showWishlist, setShowWishlist] = useState(false);
  const location = useLocation();
  
  const selectedPlatforms = location.state?.selectedPlatforms || ['PlayStation 2', 'PlayStation 3'];

  return (
    <div className="min-h-screen bg-[#302D2D] flex flex-col">
      <Header onWishlistClick={() => setShowWishlist(true)} />
      
      <div className="bg-[#302D2D] px-6 py-3 flex justify-between items-center">
        <div className="text-white font-voltaire">
          Selected Platforms: {selectedPlatforms.join(', ')}
        </div>
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