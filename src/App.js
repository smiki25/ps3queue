import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { FavoritesProvider } from './context/FavoritesContext';
import HomePage from './pages/HomePage';
import QueuePage from './pages/QueuePage';
import './index.css';

function App() {
  return (
    <GameProvider>
      <FavoritesProvider>
        <div className="font-voltaire bg-[#2b2b2b] min-h-screen text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/queue" element={<QueuePage />} />
          </Routes>
        </div>
      </FavoritesProvider>
    </GameProvider>
  );
}

export default App;
