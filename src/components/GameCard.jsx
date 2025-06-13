import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import { getGameDetails } from '../utils/api';

const GameCard = ({ game }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [detailedGame, setDetailedGame] = useState(game);

  useEffect(() => {
    const fetchDetailedDescription = async () => {
      if (!game || (game.description && game.description !== 'No description available.')) return;
      
      try {
        const detailed = await getGameDetails(game.id);
        if (detailed && detailed.description && detailed.description !== 'No description available.') {
          setDetailedGame(prev => ({
            ...prev,
            description: detailed.description
          }));
        }
      } catch (error) {
        console.error('Failed to fetch detailed description:', error);
      }
    };

    fetchDetailedDescription();
  }, [game]);

  if (!game) {
    return (
      <div className="w-full h-[500px] bg-gray-800 flex items-center justify-center text-gray-400">
        No game data available
      </div>
    );
  }

  const { title, releaseDate, platform, developer, genres = [], rating, images = [] } = detailedGame;
  const description = detailedGame.description;
  
  const shouldTruncate = description && description.length > 250;
  const displayDescription = shouldTruncate && !showFullDescription 
    ? `${description.slice(0, 250)}...` 
    : description;

  return (
    <div className="w-full flex bg-[#2b2b2b] min-h-[500px]">
      <div className="w-[60%] pr-6">
        <Carousel images={images} />
      </div>

      <div className="w-[40%] text-white flex flex-col">
        <div className="bg-[#480e0e] p-4 mb-4">
          <h2 className="text-3xl font-voltaire font-bold uppercase">{title}</h2>
        </div>

        <div className="bg-[#480e0e] p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="space-y-2 text-lg">
              {releaseDate && (
                <p><span className="text-gray-300">Release Date:</span> {releaseDate}</p>
              )}
              {platform && (
                <p><span className="text-gray-300">Platform:</span> {platform}</p>
              )}
              {developer && (
                <p><span className="text-gray-300">Developer:</span> {developer}</p>
              )}
            </div>

            {rating && (
              <div className="flex items-center">
                <span className="text-gray-300 mr-2">Rating:</span>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  rating === 'S' ? 'bg-purple-700 text-white' :
                  rating === 'A' ? 'bg-green-600 text-white' :
                  rating === 'B' ? 'bg-yellow-500 text-black' :
                  rating === 'C' ? 'bg-orange-600 text-white' :
                  rating === 'D' ? 'bg-red-600 text-white' :
                  rating === 'E' ? 'bg-red-800 text-white' :
                  rating === 'F' ? 'bg-gray-900 text-white' :
                  'bg-blue-400'
                }`}>
                  {rating}
                </div>
              </div>
            )}

            {description && (
              <div className="space-y-2">
                <p className="text-gray-300 font-semibold">Description:</p>
                <div className="leading-relaxed text-gray-100">
                  {displayDescription || 'No description available.'}
                </div>
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  >
                    {showFullDescription ? 'Show less' : 'See more'}
                  </button>
                )}
              </div>
            )}
          </div>

          {genres.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-gray-300 font-semibold">Genres:</p>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-[#480e0e] font-voltaire text-sm rounded font-bold"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard; 