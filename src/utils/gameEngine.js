import { getGamesByMultiplePlatforms, hasRawgKey, getSuggested } from './api';

// Enhanced caching system
let gameCache = new Map();
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours instead of 10 minutes
const STORAGE_KEY = 'ps3queue_game_cache';
const STORAGE_TIMESTAMP_KEY = 'ps3queue_cache_timestamp';

// Cache for collaborative filtering suggestions
let collaborativeCache = new Map();
const COLLABORATIVE_CACHE_KEY = 'ps3queue_collaborative_cache';

// Load cache from localStorage on startup
function loadCacheFromStorage() {
  try {
    const storedCache = localStorage.getItem(STORAGE_KEY);
    const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    
    if (storedCache && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp);
      const now = Date.now();
      
      // Check if cache is still valid (24 hours)
      if (now - timestamp < CACHE_DURATION) {
        const cacheData = JSON.parse(storedCache);
        gameCache = new Map(Object.entries(cacheData));
        cacheTimestamp = timestamp;
        console.log('Loaded game cache from localStorage');
        
        // Load collaborative cache
        const collaborativeData = localStorage.getItem(COLLABORATIVE_CACHE_KEY);
        if (collaborativeData) {
          collaborativeCache = new Map(Object.entries(JSON.parse(collaborativeData)));
          console.log('Loaded collaborative filtering cache');
        }
        
        return true;
      }
    }
  } catch (error) {
    console.warn('Failed to load cache from storage:', error);
  }
  return false;
}

// Save cache to localStorage
function saveCacheToStorage() {
  try {
    const cacheObject = Object.fromEntries(gameCache);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObject));
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, cacheTimestamp.toString());
    
    // Save collaborative cache
    const collaborativeObject = Object.fromEntries(collaborativeCache);
    localStorage.setItem(COLLABORATIVE_CACHE_KEY, JSON.stringify(collaborativeObject));
  } catch (error) {
    console.warn('Failed to save cache to storage:', error);
  }
}

// Initialize cache from storage
loadCacheFromStorage();

export function computeContentSimilarity(gameA, gameB) {
  const featuresA = new Set([...gameA.genres, ...gameA.tags]);
  const featuresB = new Set([...gameB.genres, ...gameB.tags]);

  const intersection = new Set([...featuresA].filter(x => featuresB.has(x)));
  const union = new Set([...featuresA, ...featuresB]);

  return intersection.size / union.size;
}

// Enhanced collaborative filtering function
export async function getCollaborativeRecommendations(likedGameIds, allGames) {
  if (likedGameIds.length === 0) return [];
  
  const recommendations = new Map();
  
  for (const gameId of likedGameIds) {
    // Check cache first
    if (collaborativeCache.has(gameId)) {
      const cachedSuggestions = collaborativeCache.get(gameId);
      cachedSuggestions.forEach(suggestion => {
        const current = recommendations.get(suggestion.id) || { ...suggestion, score: 0 };
        current.score += 1; // Weight by number of liked games that suggest this
        recommendations.set(suggestion.id, current);
      });
      continue;
    }
    
    // Fetch suggestions from API
    try {
      const suggestions = await getSuggested(gameId);
      
      // Filter to only PS2/PS3 games (removed rating filter to include all weird games)
      const filteredSuggestions = suggestions.filter(game => {
        const platform = game.platform || '';
        const isPS2PS3 = platform.includes('PlayStation 2') || platform.includes('PlayStation 3');
        return isPS2PS3; // Include all games regardless of rating
      });
      
      // Cache the suggestions
      collaborativeCache.set(gameId, filteredSuggestions);
      
      // Add to recommendations
      filteredSuggestions.forEach(suggestion => {
        const current = recommendations.get(suggestion.id) || { ...suggestion, score: 0 };
        current.score += 1;
        recommendations.set(suggestion.id, current);
      });
      
    } catch (error) {
      console.error(`Failed to get suggestions for game ${gameId}:`, error);
    }
  }
  
  // Convert to array and sort by collaborative score
  return Array.from(recommendations.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Return top 20 collaborative recommendations
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

export function getGameScore(game, preferenceVector = {}, likedGames = [], collaborativeRecommendations = []) {
  let affinity = 0;
  let contentSimilarity = 0;
  let developerAffinity = 0;
  let platformAffinity = 0;
  let collaborativeScore = 0;
  let hiddenGemBonus = 0;

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

  // Collaborative filtering score
  const collaborativeMatch = collaborativeRecommendations.find(rec => rec.id === game.id);
  if (collaborativeMatch) {
    collaborativeScore = collaborativeMatch.score * 0.4; // Strong weight for collaborative filtering
  }

  // Weird game bonus - give slight bonus to unusual games (both high and low rated)
  const rating = parseFloat(game.rating) || 0;
  if (rating > 0) {
    // Give bonus to both very low rated (weird/cult) and very high rated (acclaimed weird) games
    if (rating < 2.5 || rating > 4.5) {
      hiddenGemBonus = 0.3; // Bonus for potentially weird/unusual games
    } else if (rating < 3.5) {
      hiddenGemBonus = 0.1; // Small bonus for moderately low-rated games
    }
  }

  // Bonus for older games (PS2/PS3 era focus)
  const gameYear = parseInt(game.releaseDate) || 2000;
  const eraBonus = (gameYear >= 2000 && gameYear <= 2013) ? 0.3 : 0;

  // Much higher randomization for discovering weird games
  const explorationNoise = Math.random() * 2.0; // Massive randomization boost
  const chaosBonus = Math.random() * 1.5; // Additional chaos factor

  const finalScore =
    explorationNoise * 0.4 +           // High randomization (most important for variety)
    chaosBonus * 0.25 +                // Additional chaos for weird discoveries
    hiddenGemBonus * 0.15 +            // Weird game bonus (both high and low rated)
    collaborativeScore * 0.08 +        // Reduced collaborative filtering
    contentSimilarity * 0.05 +         // Reduced content similarity
    affinity * 0.03 +                  // Reduced user preferences
    eraBonus * 0.02 +                  // Era bonus
    developerAffinity * 0.01 +         // Developer affinity
    platformAffinity * 0.01;           // Platform affinity

  return Math.max(0, finalScore);
}

// Enhanced incremental fetching system
async function fetchGamesData(selectedPlatforms, forceRefresh = false) {
  const cacheKey = selectedPlatforms.sort().join(',');
  const now = Date.now();

  // Check if we have valid cached data
  if (!forceRefresh && gameCache.has(cacheKey) && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    console.log('Using cached game data');
    return gameCache.get(cacheKey);
  }

  if (!hasRawgKey) {
    throw new Error('RAWG API key is required. Please add REACT_APP_RAWG_KEY to your .env file. Get your free API key from https://rawg.io/apidocs');
  }

  try {
    console.log('Fetching games from RAWG API...');
    
    // Fetch more pages for better variety and weird game discovery
    const initialPages = 8; // Increased for more diverse game pool
    const promises = [];
    
    for (let page = 1; page <= initialPages; page++) {
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
    
    // Save to localStorage
    saveCacheToStorage();

    return uniqueGames;
  } catch (error) {
    console.error('Failed to fetch games from RAWG API:', error);
    
    // Don't clear cache on error, use stale data if available
    if (gameCache.has(cacheKey)) {
      console.log('Using stale cached data due to API error');
      return gameCache.get(cacheKey);
    }
    
    throw error;
  }
}

// Add function to expand cache when needed
export async function expandGameCache(selectedPlatforms, currentGameCount) {
  const cacheKey = selectedPlatforms.sort().join(',');
  const cached = gameCache.get(cacheKey) || [];
  
  // Only fetch more if we're running low on games
  if (cached.length - currentGameCount > 20) {
    return cached; // We have enough games
  }
  
  try {
    console.log('Expanding game cache...');
    const nextPages = [9, 10, 11, 12]; // Fetch more additional pages for variety
    const promises = nextPages.map(page => 
      getGamesByMultiplePlatforms(selectedPlatforms, page)
    );
    
    const results = await Promise.all(promises);
    const newGames = results.flat();
    
    const allGames = [...cached, ...newGames];
    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    );
    
    gameCache.set(cacheKey, uniqueGames);
    saveCacheToStorage();
    
    console.log(`Expanded cache to ${uniqueGames.length} games`);
    return uniqueGames;
  } catch (error) {
    console.error('Failed to expand cache:', error);
    return cached; // Return existing cache on error
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
  
  // Shuffle the games first for maximum randomness
  availableGames = availableGames.sort(() => Math.random() - 0.5);
  
  if (Object.keys(preferenceVector).length > 0 || likedGames.length > 0) {
    const likedGameObjects = likedGames.map(id => 
      allGames.find(g => g.id === id)
    ).filter(Boolean);

    // Get collaborative recommendations for weird game discovery
    const collaborativeRecommendations = await getCollaborativeRecommendations(likedGames, allGames);
    console.log(`Found ${collaborativeRecommendations.length} collaborative recommendations`);

    availableGames = availableGames.map(game => ({
      ...game,
      score: getGameScore(game, preferenceVector, likedGameObjects, collaborativeRecommendations)
    })).sort((a, b) => b.score - a.score);
    
    // Add additional shuffle to top 50% to prevent same order
    const topHalf = Math.floor(availableGames.length * 0.5);
    const topGames = availableGames.slice(0, topHalf).sort(() => Math.random() - 0.5);
    const bottomGames = availableGames.slice(topHalf);
    availableGames = [...topGames, ...bottomGames];
  } else {
    // For new users, use heavy randomization with light scoring
    availableGames = availableGames
      .map(game => ({
        ...game,
        score: getGameScore(game, {}, [], [])
      }))
      .sort((a, b) => b.score - a.score)
      .sort(() => Math.random() - 0.5); // Additional shuffle for new users
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
  collaborativeCache.clear();
  cacheTimestamp = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  localStorage.removeItem(COLLABORATIVE_CACHE_KEY);
}

// Clear cache on startup only if explicitly needed
// Don't auto-clear on import 