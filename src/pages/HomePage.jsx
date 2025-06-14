import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import WishlistModal from '../components/WishlistModal';

const HomePage = () => {
  const [selectedConsoles, setSelectedConsoles] = useState(['PlayStation 2', 'PlayStation 3']);
  const [showWishlist, setShowWishlist] = useState(false);
  const navigate = useNavigate();

  const handleStartQueue = () => {
    if (selectedConsoles.length > 0) {
      navigate('/queue', { state: { selectedPlatforms: selectedConsoles } });
    }
  };

  const handleConsoleToggle = (console) => {
    setSelectedConsoles(prev => 
      prev.includes(console) 
        ? prev.filter(c => c !== console)
        : [...prev, console]
    );
  };

  const consoles = [
    { id: 'PlayStation 2', name: 'PLAYSTATION 2', shortName: 'PS2' },
    { id: 'PlayStation 3', name: 'PLAYSTATION 3', shortName: 'PS3' }
  ];

  return (
    <div className="min-h-screen bg-[#302D2D] flex flex-col">
      <Header onWishlistClick={() => setShowWishlist(true)} />
      
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl w-full"
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-7xl font-voltaire font-black text-white mb-4 tracking-wider transform scale-x-110"
          >
            EXTREMEN GAMING
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl font-voltaire font-black text-white mb-8 tracking-widest transform scale-x-125"
          >
            QUEUE
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl text-gray-300 font-voltaire mb-12 leading-relaxed"
          >
            Extreme queue for the PS2, PS3
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-12"
          >
            <h3 className="text-3xl font-voltaire font-black text-white mb-6 tracking-wider">
              PICK CONSOLES
            </h3>
            
            <div className="flex justify-center gap-6">
              {consoles.map((console) => (
                <motion.button
                  key={console.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleConsoleToggle(console.id)}
                  className={`relative px-8 py-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedConsoles.includes(console.id)
                      ? 'bg-[#480e0e] border-[#480e0e] text-white shadow-lg shadow-[#480e0e]/50'
                      : 'bg-transparent border-gray-600 text-gray-300 hover:border-[#480e0e] hover:text-white'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-voltaire font-black tracking-wider mb-2">
                      {console.shortName}
                    </div>
                    <div className="text-sm font-voltaire opacity-80">
                      {console.name}
                    </div>
                  </div>
                  
                  {selectedConsoles.includes(console.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(72, 14, 14, 0.8)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartQueue}
              disabled={selectedConsoles.length === 0}
              className={`px-16 py-6 rounded-lg font-voltaire font-black text-3xl tracking-wider transition-all duration-300 ${
                selectedConsoles.length > 0
                  ? 'bg-[#480e0e] text-white hover:bg-[#5a1010] shadow-lg shadow-[#480e0e]/50'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedConsoles.length > 0 ? 'START' : 'SELECT CONSOLE'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <WishlistModal 
        isOpen={showWishlist} 
        onClose={() => setShowWishlist(false)} 
      />
    </div>
  );
};

export default HomePage; 