import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '../context/FavoritesContext';

const GameModal = ({ game, onClose }) => {
  const { addFavorite, isFavorite } = useFavorites();

  const handleAdd = () => {
    if (!game) return;
    if (!isFavorite(game.id)) {
      addFavorite(game);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-dark-space p-8 w-full max-w-lg relative text-white font-voltaire"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-light-gray hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl mb-4 uppercase">Add to Wishlist?</h2>
            <p className="mb-6">Do you want to add <span className="font-bold">{game?.title}</span> to your wishlist?</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="bg-maroon px-6 py-2 text-white hover:bg-maroon/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-neon-blue px-6 py-2 text-black font-bold hover:bg-neon-blue/80 transition-colors flex items-center gap-2"
              >
                <StarIcon className="h-5 w-5" /> Add
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModal; 