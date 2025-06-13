import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (game) => {
    setFavorites((prev) => (prev.some((g) => g.id === game.id) ? prev : [...prev, game]));
  };

  const removeFavorite = (gameId) => {
    setFavorites((prev) => prev.filter((g) => g.id !== gameId));
  };

  const isFavorite = (gameId) => favorites.some((g) => g.id === gameId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
