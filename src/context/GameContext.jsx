import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { updatePreferenceVector, getFilteredQueue, getGameById as engineGetGameById } from '../utils/gameEngine';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [preferenceVector, setPreferenceVector] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('preferenceVector')) || {};
    } catch {
      return {};
    }
  });

  const [seenGameIds, setSeenGameIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('seenGameIds')) || []);
    } catch {
      return new Set();
    }
  });

  const [rejectedGameIds, setRejectedGameIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('rejectedGameIds')) || []);
    } catch {
      return new Set();
    }
  });

  const [likedGames, setLikedGames] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('likedGames')) || [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {
      return [];
    }
  });

  const [interactions, setInteractions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('interactions')) || [];
    } catch {
      return [];
    }
  });

  const [gameCache, setGameCache] = useState(new Map());

  useEffect(() => {
    localStorage.setItem('preferenceVector', JSON.stringify(preferenceVector));
  }, [preferenceVector]);

  useEffect(() => {
    localStorage.setItem('seenGameIds', JSON.stringify(Array.from(seenGameIds)));
  }, [seenGameIds]);

  useEffect(() => {
    localStorage.setItem('rejectedGameIds', JSON.stringify(Array.from(rejectedGameIds)));
  }, [rejectedGameIds]);

  useEffect(() => {
    localStorage.setItem('likedGames', JSON.stringify(likedGames));
  }, [likedGames]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('interactions', JSON.stringify(interactions));
  }, [interactions]);

  const recordInteraction = async (gameId, action) => {
    const interaction = {
      gameId,
      action,
      timestamp: Date.now()
    };

    setInteractions(prev => [...prev, interaction]);
    setSeenGameIds(prev => new Set(prev).add(gameId));

    let game = gameCache.get(gameId);
    if (!game) {
      try {
        game = await engineGetGameById(gameId);
        if (game) {
          setGameCache(prev => new Map(prev).set(gameId, game));
        }
      } catch (error) {
        console.error('Failed to get game for interaction:', error);
        return;
      }
    }

    if (!game) return;

    const newPreferenceVector = updatePreferenceVector(action, game, preferenceVector);
    setPreferenceVector(newPreferenceVector);

    switch (action) {
      case 'wishlisted':
        setWishlist(prev => prev.includes(gameId) ? prev : [...prev, gameId]);
        setLikedGames(prev => prev.includes(gameId) ? prev : [...prev, gameId]);
        break;
      case 'rejected':
        setRejectedGameIds(prev => new Set(prev).add(gameId));
        break;
      case 'skipped':
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const addToWishlist = async (gameId) => {
    await recordInteraction(gameId, 'wishlisted');
  };

  const removeFromWishlist = (gameId) => {
    setWishlist(prev => prev.filter(id => id !== gameId));
    setLikedGames(prev => prev.filter(id => id !== gameId));
  };

  const isInWishlist = (gameId) => {
    return wishlist.includes(gameId);
  };

  const getQueue = useCallback(async (selectedPlatforms) => {
    try {
      const queue = await getFilteredQueue(selectedPlatforms, {
        preferenceVector,
        seenGameIds,
        rejectedGameIds,
        likedGames
      });

      queue.forEach(game => {
        setGameCache(prev => new Map(prev).set(game.id, game));
      });

      return queue;
    } catch (error) {
      console.error('Failed to get queue:', error);
      return [];
    }
  }, [preferenceVector, seenGameIds, rejectedGameIds, likedGames]);

  const resetUserData = () => {
    setPreferenceVector({});
    setSeenGameIds(new Set());
    setRejectedGameIds(new Set());
    setLikedGames([]);
    setWishlist([]);
    setInteractions([]);
    setGameCache(new Map());
    
    localStorage.removeItem('preferenceVector');
    localStorage.removeItem('seenGameIds');
    localStorage.removeItem('rejectedGameIds');
    localStorage.removeItem('likedGames');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('interactions');
  };

  const getGameById = async (id, selectedPlatforms = ['PlayStation 2', 'PlayStation 3']) => {
    if (gameCache.has(id)) {
      return gameCache.get(id);
    }

    try {
      const game = await engineGetGameById(id, selectedPlatforms);
      if (game) {
        setGameCache(prev => new Map(prev).set(id, game));
      }
      return game;
    } catch (error) {
      console.error('Failed to get game by ID:', error);
      return null;
    }
  };

  const value = {
    preferenceVector,
    seenGameIds,
    rejectedGameIds,
    likedGames,
    wishlist,
    interactions,
    
    recordInteraction,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getQueue,
    resetUserData,
    getGameById
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}; 