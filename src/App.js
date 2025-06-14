import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import QueuePage from './pages/QueuePage';

function App() {
  return (
    <GameProvider>
      <div className="font-voltaire bg-[#302D2D] min-h-screen text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/queue" element={<QueuePage />} />
        </Routes>
      </div>
    </GameProvider>
  );
}

export default App;
