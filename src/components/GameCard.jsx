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
      <div className="w-full h-[300px] md:h-[500px] bg-gray-800 flex items-center justify-center text-gray-400">
        No game data available
      </div>
    );
  }

  const { title, releaseDate, platform, developer, genres = [], rating, images = [] } = detailedGame;
  const description = detailedGame.description;
  
  const shouldTruncate = description && description.length > 200; // Reduced for mobile
  const displayDescription = shouldTruncate && !showFullDescription 
    ? `${description.slice(0, 200)}...` 
    : description;

  return (
    <div className="w-full flex flex-col lg:flex-row bg-[#2b2b2b] min-h-[400px] md:min-h-[500px] rounded-lg overflow-hidden">
      {/* Image Section */}
      <div className="w-full lg:w-[60%] lg:pr-6 mb-4 lg:mb-0">
        <Carousel images={images} />
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-[40%] text-white flex flex-col px-4 lg:px-0">
        {/* Title */}
        <div className="bg-[#480e0e] p-3 md:p-4 mb-3 md:mb-4 rounded-lg lg:rounded-none">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-voltaire font-bold uppercase leading-tight">
            {title}
          </h2>
        </div>

        {/* Main Content */}
        <div className="bg-[#480e0e] p-3 md:p-4 flex-1 flex flex-col justify-between rounded-lg lg:rounded-none">
          <div className="space-y-3">
            {/* Game Info */}
            <div className="space-y-2 text-sm md:text-base lg:text-lg">
              {releaseDate && (
                <p><span className="text-gray-300">Release Date:</span> {releaseDate}</p>
              )}
              {platform && (
                <p><span className="text-gray-300">Platform:</span> {platform}</p>
              )}
              {developer && (
                <p className="break-words"><span className="text-gray-300">Developer:</span> {developer}</p>
              )}
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex items-center">
                <span className="text-gray-300 mr-2 text-sm md:text-base">Rating:</span>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-base md:text-lg ${
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

            {/* Description */}
            {description && (
              <div className="space-y-2">
                <p className="text-gray-300 font-semibold text-sm md:text-base">Description:</p>
                <div className="leading-relaxed text-gray-100 text-sm md:text-base">
                  {displayDescription || 'No description available.'}
                </div>
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-400 hover:text-blue-300 underline transition-colors text-sm md:text-base"
                  >
                    {showFullDescription ? 'Show less' : 'See more'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-gray-300 font-semibold text-sm md:text-base">Genres:</p>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {genres.slice(0, 6).map((genre, index) => ( // Limit genres on mobile
                  <span
                    key={index}
                    className="px-2 md:px-3 py-1 bg-white text-[#480e0e] font-voltaire text-xs md:text-sm rounded font-bold"
                  >
                    {genre}
                  </span>
                ))}
                {genres.length > 6 && (
                  <span className="px-2 md:px-3 py-1 bg-gray-300 text-[#480e0e] font-voltaire text-xs md:text-sm rounded font-bold">
                    +{genres.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard; 