import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from './GameCard';
import { useGame } from '../context/GameContext';

const Queue = ({ selectedPlatforms = [] }) => {
  const { getQueue, recordInteraction, addToWishlist, isInWishlist, resetUserData } = useGame();
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayedGame, setDisplayedGame] = useState(null);

  const loadQueue = useCallback(async () => {
    if (selectedPlatforms.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const queue = await getQueue(selectedPlatforms);
      setCurrentQueue(queue);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to load queue:', err);
      setError(err.message || 'Failed to load games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlatforms, getQueue]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    const refreshQueue = async () => {
      if (currentQueue.length - currentIndex <= 2 && selectedPlatforms.length > 0 && !isLoading) {
        try {
          const newQueue = await getQueue(selectedPlatforms);
          if (newQueue.length > 0) {
            const existingIds = new Set(currentQueue.map(g => g.id));
            const newGames = newQueue.filter(g => !existingIds.has(g.id));
            if (newGames.length > 0) {
              setCurrentQueue(prev => [...prev, ...newGames.slice(0, 10)]);
            }
          }
        } catch (err) {
          console.error('Failed to refresh queue:', err);
        }
      }
    };

    refreshQueue();
  }, [currentIndex, selectedPlatforms, getQueue, isLoading]);

  const currentGame = currentQueue[currentIndex];

  React.useEffect(() => {
    if (currentGame && !isProcessing) {
      setDisplayedGame(currentGame);
    }
  }, [currentGame, isProcessing]);

  const handleAction = async (action) => {
    if (!displayedGame || isProcessing) return;

    setIsProcessing(true);
    try {
      await recordInteraction(displayedGame.id, action);

      setCurrentIndex(prev => prev + 1);
      
      setTimeout(() => {
        setIsProcessing(false);
      }, 800);
    } catch (err) {
      console.error('Failed to record interaction:', err);
      setIsProcessing(false);
    }
  };

  const handleWishlist = async () => {
    if (!displayedGame || isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (!isInWishlist(displayedGame.id)) {
        await addToWishlist(displayedGame.id);
      }
      
      setCurrentIndex(prev => prev + 1);
      
      setTimeout(() => {
        setIsProcessing(false);
      }, 800);
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all your preferences and start fresh? This will clear your wishlist and recommendation data.')) {
      resetUserData();
      loadQueue();
    }
  };

  if (selectedPlatforms.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#2b2b2b] text-white">
        <div className="text-center">
          <h2 className="text-3xl font-voltaire mb-4">No Platforms Selected</h2>
          <p className="text-xl text-gray-300">
            Please go back and select at least one console to continue.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#2b2b2b] text-white">
        <div className="w-16 h-16 border-4 border-t-white border-gray-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-voltaire">Loading Games...</p>
        <p className="text-sm text-gray-400 mt-2">Fetching from RAWG API...</p>
      </div>
    );
  }

  if (error) {
    const isApiKeyError = error.includes('API key');
    
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#2b2b2b] text-white">
        <div className="text-center max-w-2xl px-6">
          <h2 className="text-3xl font-voltaire mb-4 text-red-400">
            {isApiKeyError ? 'API Key Required' : 'Error Loading Games'}
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">{error}</p>
          
          {isApiKeyError ? (
            <div className="bg-[#1a1a1a] p-6 rounded mb-6 text-left">
              <h3 className="text-xl font-voltaire mb-3 text-yellow-400">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Visit <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">rawg.io/apidocs</a></li>
                <li>Sign up for a free account (no credit card required)</li>
                <li>Copy your API key from the dashboard</li>
                <li>Create a <code className="bg-gray-700 px-2 py-1 rounded">.env</code> file in your project root</li>
                <li>Add: <code className="bg-gray-700 px-2 py-1 rounded">REACT_APP_RAWG_KEY=your_api_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          ) : (
            <button
              onClick={() => loadQueue()}
              className="bg-[#480e0e] hover:bg-[#5a1010] text-white font-voltaire font-bold px-6 py-3 text-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!displayedGame) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#2b2b2b] text-white">
        <div className="text-center">
          <h2 className="text-3xl font-voltaire mb-4">No More Games!</h2>
          <p className="text-xl text-gray-300 mb-6">
            You've seen all available games for your selected platforms.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleReset}
              className="bg-[#480e0e] hover:bg-[#5a1010] text-white font-voltaire font-bold px-8 py-3 text-lg transition-colors block mx-auto"
            >
              Reset Data & Start Fresh
            </button>
            <p className="text-sm text-gray-400">
              This will clear your preferences and show all games again
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-[#2b2b2b] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start p-6 relative overflow-y-auto">
        <div className="w-full max-w-7xl mb-6 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`game-${displayedGame.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GameCard game={displayedGame} />
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="w-full max-w-7xl flex justify-between gap-4 flex-shrink-0">
          <button
            onClick={() => handleAction('rejected')}
            disabled={isProcessing}
            className={`flex-1 bg-[#480e0e] hover:bg-[#5a1010] text-white font-voltaire font-bold py-6 text-3xl transition-colors rounded ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Hell nah
          </button>
          
          <button
            onClick={handleWishlist}
            disabled={isProcessing}
            className={`flex-1 font-voltaire font-bold py-6 text-3xl transition-colors rounded ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isInWishlist(displayedGame.id)
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-white hover:bg-gray-200 text-black'
            }`}
          >
            {isInWishlist(displayedGame.id) ? 'In Wishlist' : 'Add to wishlist'}
          </button>
          
          <button
            onClick={() => handleAction('skipped')}
            disabled={isProcessing}
            className={`flex-1 bg-[#480e0e] hover:bg-[#5a1010] text-white font-voltaire font-bold py-6 text-3xl transition-colors rounded ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next game
          </button>
        </div>
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-[#2b2b2b] z-10"
          >
            <div className="bg-[#1a1a1a] px-12 py-8 rounded-xl flex flex-col items-center space-y-4 border-2 border-[#480e0e] shadow-2xl">
              <div className="w-12 h-12 border-4 border-t-white border-[#480e0e] rounded-full animate-spin"></div>
              <span className="text-white font-voltaire text-2xl font-bold">Processing...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Queue;
