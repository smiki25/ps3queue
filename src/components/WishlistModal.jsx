import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useGame } from '../context/GameContext';

const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, getGameById, resetUserData } = useGame();
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const loadWishlistGames = async () => {
      if (!isOpen || wishlist.length === 0) {
        setWishlistGames([]);
        return;
      }

      setLoading(true);
      try {
        const games = await Promise.all(
          wishlist.map(async (id) => {
            try {
              const game = await getGameById(id);
              return game;
            } catch (error) {
              console.error(`Failed to load game ${id}:`, error);
              return null;
            }
          })
        );
        setWishlistGames(games.filter(Boolean));
      } catch (error) {
        console.error('Failed to load wishlist games:', error);
        setWishlistGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistGames();
  }, [isOpen, wishlist, getGameById]);

  const handleRemoveFromWishlist = (gameId) => {
    removeFromWishlist(gameId);
    setWishlistGames(prev => prev.filter(game => game.id !== gameId));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your preferences and data?')) {
      resetUserData();
      onClose();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-[#302D2D] w-full max-w-4xl max-h-[90vh] md:max-h-[80vh] rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#480e0e] p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-voltaire font-black tracking-wider transform scale-x-110 text-white">
                WISHLIST
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 active:text-gray-300 transition-colors touch-manipulation p-1"
              >
                <XMarkIcon className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </div>

            <div className="bg-[#480e0e] px-4 md:px-6 pb-4 flex justify-center">
              <button
                onClick={handleReset}
                className="text-red-400 hover:text-red-300 active:text-red-300 transition-colors font-voltaire text-sm md:text-base"
              >
                Reset All Data
              </button>
            </div>

            <div className="p-4 md:p-6">
              {loading ? (
                <div className="text-center py-8 md:py-12">
                  <div className="w-8 h-8 border-2 border-t-white border-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 font-voltaire text-sm md:text-base">Loading wishlist...</p>
                </div>
              ) : wishlistGames.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <p className="text-lg md:text-xl text-gray-400 font-voltaire">
                    Your wishlist is empty
                  </p>
                  <p className="text-gray-500 mt-2 text-sm md:text-base">
                    Add games to your wishlist while browsing the queue
                  </p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4 max-h-[60vh] md:max-h-[50vh] overflow-y-auto">
                  {wishlistGames.map(game => (
                    <div
                      key={game.id}
                      className="flex items-center bg-[#1a1a1a] p-3 md:p-4 rounded-lg"
                    >
                      <div className="w-16 h-20 md:w-20 md:h-28 flex-shrink-0 mr-3 md:mr-4">
                        <img
                          src={game.images?.[0] || '/placeholder-game.jpg'}
                          alt={game.title}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM2NjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      </div>

                      <div className="flex-1 text-white min-w-0">
                        <h3 className="text-base md:text-lg lg:text-xl font-voltaire font-bold mb-1 truncate">
                          {game.title}
                        </h3>
                        <p className="text-gray-400 mb-2 text-xs md:text-sm">
                          {game.platform} • {game.releaseDate}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {game.genres?.slice(0, isMobile ? 2 : 3).map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#480e0e] text-xs rounded"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>

                      {game.rating && (
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm mr-2 md:mr-4 flex-shrink-0 ${
                          game.rating === 'S' ? 'bg-purple-700 text-white' :
                          game.rating === 'A' ? 'bg-green-600 text-white' :
                          game.rating === 'B' ? 'bg-yellow-500 text-black' :
                          game.rating === 'C' ? 'bg-orange-600 text-white' :
                          game.rating === 'D' ? 'bg-red-600 text-white' :
                          game.rating === 'E' ? 'bg-red-800 text-white' :
                          game.rating === 'F' ? 'bg-gray-900 text-white' :
                          'bg-blue-400 text-white'
                        }`}>
                          {game.rating}
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveFromWishlist(game.id)}
                        className="text-red-400 hover:text-red-300 active:text-red-300 transition-colors touch-manipulation p-1 flex-shrink-0"
                        title="Remove from wishlist"
                      >
                        <XMarkIcon className="h-5 w-5 md:h-6 md:w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistModal; 