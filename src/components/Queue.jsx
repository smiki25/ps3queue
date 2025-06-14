import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from './GameCard';
import { useGame } from '../context/GameContext';
import { expandGameCache } from '../utils/gameEngine';

const Queue = ({ selectedPlatforms = [] }) => {
  const { getQueue, recordInteraction, addToWishlist, isInWishlist, resetUserData } = useGame();
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayedGame, setDisplayedGame] = useState(null);
  const isExpandingRef = useRef(false);

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

  // Smart cache expansion - check if we need more games
  const checkAndExpandCache = useCallback(async () => {
    if (isExpandingRef.current || selectedPlatforms.length === 0 || currentQueue.length === 0) return;
    
    const remainingGames = currentQueue.length - currentIndex;
    
    // Expand cache when we have less than 10 games remaining
    if (remainingGames < 10) {
      isExpandingRef.current = true;
      try {
        console.log('Expanding cache due to low game count...');
        await expandGameCache(selectedPlatforms, currentIndex);
        
        // Refresh queue with expanded cache
        const newQueue = await getQueue(selectedPlatforms);
        if (newQueue.length > currentQueue.length) {
          setCurrentQueue(newQueue);
          console.log(`Queue expanded to ${newQueue.length} games`);
        }
      } catch (error) {
        console.error('Failed to expand cache:', error);
      } finally {
        isExpandingRef.current = false;
      }
    }
  }, [currentQueue.length, currentIndex, selectedPlatforms, getQueue]);

  useEffect(() => {
    checkAndExpandCache();
  }, [checkAndExpandCache]);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2b2b2b] text-white px-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-voltaire mb-4">No Platforms Selected</h2>
          <p className="text-lg md:text-xl text-gray-300">
            Please go back and select at least one console to continue.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2b2b2b] text-white px-4">
        <div className="w-16 h-16 border-4 border-t-white border-gray-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg md:text-xl font-voltaire">Loading Games...</p>
        <p className="text-sm text-gray-400 mt-2 text-center">Fetching from RAWG API...</p>
      </div>
    );
  }

  if (error) {
    const isApiKeyError = error.includes('API key');
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2b2b2b] text-white px-4">
        <div className="text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-voltaire mb-4 text-red-400">
            {isApiKeyError ? 'API Key Required' : 'Error Loading Games'}
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">{error}</p>
          
          {isApiKeyError ? (
            <div className="bg-[#1a1a1a] p-4 md:p-6 rounded mb-6 text-left">
              <h3 className="text-lg md:text-xl font-voltaire mb-3 text-yellow-400">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm md:text-base">
                <li>Visit <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">rawg.io/apidocs</a></li>
                <li>Sign up for a free account (no credit card required)</li>
                <li>Copy your API key from the dashboard</li>
                <li>Create a <code className="bg-gray-700 px-2 py-1 rounded text-xs">.env</code> file in your project root</li>
                <li>Add: <code className="bg-gray-700 px-2 py-1 rounded text-xs break-all">REACT_APP_RAWG_KEY=your_api_key_here</code></li>
                <li>Restart the development server</li>
              </ol>
            </div>
          ) : (
            <button
              onClick={() => loadQueue()}
              className="bg-[#480e0e] hover:bg-[#5a1010] text-white font-voltaire font-bold px-6 py-3 text-base md:text-lg transition-colors rounded"
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#2b2b2b] text-white px-4">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-voltaire mb-4">No More Games!</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            You've seen all available games for your selected platforms.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleReset}
              className="bg-[#480e0e] hover:bg-[#5a1010] text-white font-voltaire font-bold px-6 md:px-8 py-3 text-base md:text-lg transition-colors block mx-auto rounded"
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
    <div className="min-h-screen bg-[#2b2b2b] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 relative overflow-y-auto">
        <div className="w-full max-w-4xl lg:max-w-7xl mb-4 md:mb-6 flex-shrink-0">
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

        {/* Mobile: Stack buttons vertically, Desktop: Horizontal */}
        <div className="w-full max-w-4xl lg:max-w-7xl flex flex-col md:flex-row justify-between gap-3 md:gap-4 flex-shrink-0">
          <button
            onClick={() => handleAction('rejected')}
            disabled={isProcessing}
            className={`w-full md:flex-1 bg-[#480e0e] hover:bg-[#5a1010] active:bg-[#5a1010] text-white font-voltaire font-bold py-4 md:py-6 text-xl md:text-3xl transition-colors rounded-lg touch-manipulation ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Hell nah
          </button>
          
          <button
            onClick={handleWishlist}
            disabled={isProcessing}
            className={`w-full md:flex-1 font-voltaire font-bold py-4 md:py-6 text-xl md:text-3xl transition-colors rounded-lg touch-manipulation ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isInWishlist(displayedGame.id)
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-700 text-white'
                : 'bg-white hover:bg-gray-200 active:bg-gray-200 text-black'
            }`}
          >
            {isInWishlist(displayedGame.id) ? 'In Wishlist' : 'Add to wishlist'}
          </button>
          
          <button
            onClick={() => handleAction('skipped')}
            disabled={isProcessing}
            className={`w-full md:flex-1 bg-[#480e0e] hover:bg-[#5a1010] active:bg-[#5a1010] text-white font-voltaire font-bold py-4 md:py-6 text-xl md:text-3xl transition-colors rounded-lg touch-manipulation ${
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
            <div className="bg-[#1a1a1a] px-8 md:px-12 py-6 md:py-8 rounded-xl flex flex-col items-center space-y-4 border-2 border-[#480e0e] shadow-2xl mx-4">
              <div className="w-12 h-12 border-4 border-t-white border-[#480e0e] rounded-full animate-spin"></div>
              <span className="text-white font-voltaire text-xl md:text-2xl font-bold">Processing...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Queue;
