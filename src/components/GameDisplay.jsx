import React from 'react';

const GameDisplay = ({ game, onWishlist, onHellNah, onNext }) => {
  if (!game) return null;

  const { name, background_image, released, platforms, developers, description_raw, genres } = game;

  return (
    <div className="flex w-full max-w-5xl mx-auto bg-dark-card p-4 rounded-lg">
      <div className="w-1/2">
        <img src={background_image} alt={name} className="w-full h-auto rounded-lg" />
      </div>
      <div className="w-1/2 pl-8 text-off-white">
        <h2 className="text-4xl font-bold">{name}</h2>
        <div className="text-sm mt-2">
          <span>Release Date: {released}</span>
          <span className="ml-4">Platform: {platforms.map(p => p.platform.name).join(', ')}</span>
          <span className="ml-4">Developer: {developers.map(d => d.name).join(', ')}</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="bg-rating-d text-black rounded-full h-8 w-8 flex items-center justify-center font-bold">D</div>
        </div>
        <p className="mt-4 text-sm">{description_raw}</p>
        <div className="mt-4 flex gap-2">
            {genres.map(genre => (
                <span key={genre.id} className="bg-gray-500 text-white px-3 py-1 text-sm rounded-full">{genre.name}</span>
            ))}
        </div>
        <div className="mt-8 flex justify-between">
          <button onClick={onHellNah} className="bg-dark-maroon px-8 py-3 text-xl rounded-md">Hell nah</button>
          <button onClick={onWishlist} className="bg-dark-maroon px-8 py-3 text-xl rounded-md">Add to wishlist</button>
          <button onClick={onNext} className="bg-dark-maroon px-8 py-3 text-xl rounded-md">Next game</button>
        </div>
      </div>
    </div>
  );
};

export default GameDisplay; 