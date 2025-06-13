import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useGame } from '../context/GameContext';

const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist, getGameById } = useGame();
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(false);

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
            className="bg-[#2b2b2b] w-full max-w-4xl max-h-[80vh] rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#480e0e] p-6 flex justify-between items-center">
              <h2 className="text-4xl font-voltaire font-black tracking-wider transform scale-x-110 text-white">WISHLIST</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-t-white border-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 font-voltaire">Loading wishlist...</p>
                </div>
              ) : wishlistGames.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400 font-voltaire">
                    Your wishlist is empty
                  </p>
                  <p className="text-gray-500 mt-2">
                    Add games to your wishlist while browsing the queue
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                  {wishlistGames.map(game => (
                    <div
                      key={game.id}
                      className="flex items-center bg-[#1a1a1a] p-4 rounded-lg"
                    >
                      <div className="w-20 h-28 flex-shrink-0 mr-4">
                        <img
                          src={game.images?.[0] || '/placeholder-game.jpg'}
                          alt={game.title}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM2NjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      </div>

                      <div className="flex-1 text-white">
                        <h3 className="text-xl font-voltaire font-bold mb-1">
                          {game.title}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          {game.platform} • {game.releaseDate}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {game.genres?.slice(0, 3).map((genre, index) => (
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
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                          game.rating === 'S' ? 'bg-purple-700 text-white' :
                          game.rating === 'A' ? 'bg-green-600 text-white' :
                          game.rating === 'B' ? 'bg-yellow-500 text-black' :
                          game.rating === 'C' ? 'bg-orange-600 text-white' :
                          game.rating === 'D' ? 'bg-red-600 text-white' :
                          game.rating === 'E' ? 'bg-red-800 text-white' :
                          game.rating === 'F' ? 'bg-gray-900 text-white' :
                          'bg-blue-400'
                        }`}>
                          {game.rating}
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveFromWishlist(game.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Remove from wishlist"
                      >
                        <XMarkIcon className="h-6 w-6" />
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