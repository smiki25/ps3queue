import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

const FavoritesList = ({ show, onClose }) => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="font-orbitron bg-dark-space/90 border-t-2 border-neon-pink shadow-neon-pink w-full max-w-4xl h-3/4 p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold uppercase text-white" style={{textShadow: '0 0 5px #FF00FF'}}>Favorites</h2>
              <button onClick={onClose} className="text-white">
                <XMarkIcon className="w-8 h-8"/>
              </button>
            </div>
            {favorites.length === 0 ? (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-light-gray text-lg">Your favorite games will appear here.</p>
              </div>
            ) : (
              <ul className="space-y-4 overflow-y-auto flex-grow pr-4">
                {favorites.map(game => (
                  <li key={game.id} className="flex items-center bg-dark-space/50 p-3 rounded-lg border border-transparent hover:border-neon-pink/50 transition-colors">
                    <img src={game.boxArt || game.background_image || (game.images && game.images[0]) || (game.short_screenshots && game.short_screenshots[0]?.image)} alt={game.title} className="w-16 h-20 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white uppercase">{game.title}</h3>
                      <p className="text-sm text-light-gray opacity-70">{game.platform}</p>
                    </div>
                    <button onClick={() => removeFavorite(game.id)} className="text-neon-pink hover:scale-125 transition-transform">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FavoritesList; 