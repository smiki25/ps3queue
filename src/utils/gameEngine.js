import { getGamesByMultiplePlatforms, hasRawgKey } from './api';

let gameCache = new Map();
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000;
export function computeContentSimilarity(gameA, gameB) {
  const featuresA = new Set([...gameA.genres, ...gameA.tags]);
  const featuresB = new Set([...gameB.genres, ...gameB.tags]);

  const intersection = new Set([...featuresA].filter(x => featuresB.has(x)));
  const union = new Set([...featuresA, ...featuresB]);

  return intersection.size / union.size;
}

export function updatePreferenceVector(action, game, currentVector = {}) {
  const weightDelta = {
    wishlisted: 1.5,
    skipped: -0.1,
    rejected: -1.2,
  }[action] || 0;

  const newVector = { ...currentVector };

  for (const tag of [...game.genres, ...game.tags]) {
    newVector[tag] = (newVector[tag] || 0) + weightDelta;
  }

  if (game.developer) {
    const devKey = `dev_${game.developer}`;
    newVector[devKey] = (newVector[devKey] || 0) + (weightDelta * 0.3);
  }

  if (game.platform) {
    const platformKey = `platform_${game.platform}`;
    newVector[platformKey] = (newVector[platformKey] || 0) + (weightDelta * 0.2);
  }

  return newVector;
}

export function getGameScore(game, preferenceVector = {}, likedGames = []) {
  let affinity = 0;
  let contentSimilarity = 0;
  let developerAffinity = 0;
  let platformAffinity = 0;

  for (const tag of [...game.genres, ...game.tags]) {
    affinity += (preferenceVector[tag] || 0);
  }

  if (game.developer) {
    developerAffinity = preferenceVector[`dev_${game.developer}`] || 0;
  }

  if (game.platform) {
    platformAffinity = preferenceVector[`platform_${game.platform}`] || 0;
  }
  if (likedGames.length > 0) {
    const similarities = likedGames.map(likedGame => 
      computeContentSimilarity(game, likedGame)
    );
    contentSimilarity = Math.max(...similarities);
  }

  const explorationNoise = Math.random() * 0.3;
  const currentYear = new Date().getFullYear();
  const gameYear = parseInt(game.releaseDate) || 2000;
  const recencyBonus = Math.max(0, (gameYear - 1990) / (currentYear - 1990)) * 0.1;

  const finalScore =
    contentSimilarity * 0.3 +
    affinity * 0.2 +
    developerAffinity * 0.1 +
    platformAffinity * 0.05 +
    recencyBonus * 0.05 +
    explorationNoise * 0.3;

  return Math.max(0, finalScore);
}

async function fetchGamesData(selectedPlatforms) {
  const cacheKey = selectedPlatforms.sort().join(',');
  const now = Date.now();

  if (gameCache.has(cacheKey) && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('Using cached game data');
    return gameCache.get(cacheKey);
  }
  if (!hasRawgKey) {
    throw new Error('RAWG API key is required. Please add REACT_APP_RAWG_KEY to your .env file. Get your free API key from https://rawg.io/apidocs');
  }

  try {
    console.log('Fetching games from RAWG API...');
    const promises = [];
    for (let page = 1; page <= 5; page++) {
      promises.push(getGamesByMultiplePlatforms(selectedPlatforms, page));
    }

    const results = await Promise.all(promises);
    const allGames = results.flat();

    if (allGames.length === 0) {
      throw new Error('No games found for the selected platforms. Please try different platform selections.');
    }

    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    );

    console.log(`Successfully fetched ${uniqueGames.length} unique games from RAWG API`);

    gameCache.set(cacheKey, uniqueGames);
    cacheTimestamp = now;

    return uniqueGames;
  } catch (error) {
    console.error('Failed to fetch games from RAWG API:', error);
    
    gameCache.delete(cacheKey);
    
    throw error;
  }
}

export async function getFilteredQueue(selectedPlatforms, userState = {}) {
  const { 
    preferenceVector = {}, 
    seenGameIds = new Set(), 
    rejectedGameIds = new Set(),
    likedGames = []
  } = userState;

  const allGames = await fetchGamesData(selectedPlatforms);

  let availableGames = allGames.filter(game => 
    !seenGameIds.has(game.id) &&
    !rejectedGameIds.has(game.id)
  );
  if (Object.keys(preferenceVector).length > 0 || likedGames.length > 0) {
    const likedGameObjects = likedGames.map(id => 
      allGames.find(g => g.id === id)
    ).filter(Boolean);

    availableGames = availableGames.map(game => ({
      ...game,
      score: getGameScore(game, preferenceVector, likedGameObjects)
    })).sort((a, b) => b.score - a.score);
  } else {
    availableGames = availableGames.sort(() => Math.random() - 0.5);
  }

  return availableGames;
}

export async function getAllGames(selectedPlatforms = ['PlayStation 2', 'PlayStation 3']) {
  return await fetchGamesData(selectedPlatforms);
}

export async function getGameById(id, selectedPlatforms = ['PlayStation 2', 'PlayStation 3']) {
  const allGames = await fetchGamesData(selectedPlatforms);
  return allGames.find(game => game.id === id);
}

export function clearGameCache() {
  gameCache.clear();
  cacheTimestamp = null;
}

clearGameCache(); 