import axios from 'axios';

const RAWG_KEY = process.env.REACT_APP_RAWG_KEY;
const BASE_URL = 'https://api.rawg.io/api';
const PAGE_SIZE = 40;

const api = axios.create({ baseURL: BASE_URL });

const PLATFORM_IDS = {
  'PlayStation 1': 10,
  'PlayStation 2': 15,
  'PlayStation 3': 16,
  'PlayStation Vita': 19
};

const transformGameData = (rawgGame) => {
  return {
    id: rawgGame.id.toString(),
    title: rawgGame.name,
    releaseDate: rawgGame.released ? new Date(rawgGame.released).getFullYear().toString() : 'Unknown',
    platform: rawgGame.platforms?.map(p => p.platform.name).find(name => 
      name.includes('PlayStation 2') || name.includes('PlayStation 3') || 
      name.includes('PS2') || name.includes('PS3')
    ) || rawgGame.platforms?.[0]?.platform?.name || 'PlayStation',
    developer: rawgGame.developers?.[0]?.name || 'Unknown',
    description: rawgGame.description_raw || rawgGame.description || 'No description available.',
    genres: rawgGame.genres?.map(g => g.name) || [],
    tags: rawgGame.tags?.slice(0, 8).map(t => t.name) || [],
    rating: getGameRating(rawgGame.metacritic, rawgGame.rating),
    images: [
      rawgGame.background_image,
      ...(rawgGame.short_screenshots?.map(s => s.image) || [])
    ].filter(Boolean)
  };
};

const getGameRating = (metacritic, rating) => {
  if (metacritic >= 90) return 'S';
  if (metacritic >= 80 || rating >= 4.5) return 'A';
  if (metacritic >= 70 || rating >= 3.5) return 'B';
  if (metacritic >= 60 || rating >= 2.5) return 'C';
  if (metacritic >= 50 || rating >= 1.5) return 'E';
  if (metacritic >= 40 || rating >= 1.0) return 'D';
  return 'F';
};

export const getGamesByPlatform = async (platformName, page = 1) => {
  if (!RAWG_KEY) {
    throw new Error('RAWG API key missing. Please add REACT_APP_RAWG_KEY to your .env file. Get your free API key from https://rawg.io/apidocs');
  }

  const platformId = PLATFORM_IDS[platformName];
  if (!platformId) {
    throw new Error(`Unknown platform: ${platformName}. Supported platforms: ${Object.keys(PLATFORM_IDS).join(', ')}`);
  }

  try {
    const { data } = await api.get('/games', {
      params: {
        key: RAWG_KEY,
        platforms: platformId,
        ordering: 'random',
        page,
        page_size: PAGE_SIZE,
      },
    });
    
    return data.results.map(transformGameData);
  } catch (err) {
    console.error('RAWG fetch failed:', err);
    throw new Error(`Failed to fetch games for ${platformName}: ${err.message}`);
  }
};

export const getGamesByMultiplePlatforms = async (platformNames, page = 1) => {
  if (!RAWG_KEY) {
    throw new Error('RAWG API key missing. Please add REACT_APP_RAWG_KEY to your .env file. Get your free API key from https://rawg.io/apidocs');
  }

  const platformIds = platformNames
    .map(name => PLATFORM_IDS[name])
    .filter(Boolean);

  if (platformIds.length === 0) {
    throw new Error(`No valid platforms found. Supported platforms: ${Object.keys(PLATFORM_IDS).join(', ')}`);
  }

  try {
    console.log(`Fetching games for platforms: ${platformNames.join(', ')}, page: ${page}`);
    const { data } = await api.get('/games', {
      params: {
        key: RAWG_KEY,
        platforms: platformIds.join(','),
        ordering: 'random',
        page,
        page_size: PAGE_SIZE,
      },
    });
    
    console.log(`Fetched ${data.results.length} games from RAWG API`);
    return data.results.map(transformGameData);
  } catch (err) {
    console.error('RAWG fetch failed:', err);
    if (err.response?.status === 401) {
      throw new Error('Invalid RAWG API key. Please check your REACT_APP_RAWG_KEY in .env file');
    } else if (err.response?.status === 429) {
      throw new Error('RAWG API rate limit exceeded. Please wait a moment and try again');
    } else {
      throw new Error(`Failed to fetch games: ${err.message}`);
    }
  }
};

export const getGameDetails = async (gameId) => {
  if (!RAWG_KEY) {
    throw new Error('RAWG API key missing. Please add REACT_APP_RAWG_KEY to your .env file');
  }
  
  try {
    const { data } = await api.get(`/games/${gameId}`, {
      params: { key: RAWG_KEY },
    });
    return transformGameData(data);
  } catch (err) {
    console.error('RAWG detail fetch failed', err);
    throw new Error(`Failed to fetch game details for ID ${gameId}: ${err.message}`);
  }
};

export const getGameScreenshots = async (gameId) => {
  if (!RAWG_KEY) {
    throw new Error('RAWG API key missing. Please add REACT_APP_RAWG_KEY to your .env file');
  }
  
  try {
    const { data } = await api.get(`/games/${gameId}/screenshots`, {
      params: { key: RAWG_KEY },
    });
    return data.results.map(screenshot => screenshot.image);
  } catch (err) {
    console.error('RAWG screenshots fetch failed', err);
    throw new Error(`Failed to fetch screenshots for game ID ${gameId}: ${err.message}`);
  }
};

let genreCache = null;
export const getGenreCache = async () => {
  if (genreCache) return genreCache;
  const stored = localStorage.getItem('rawgGenreCache');
  if (stored) {
    genreCache = JSON.parse(stored);
    return genreCache;
  }
  try {
    const { data } = await api.get('/genres', { params: { key: RAWG_KEY, page_size: 40 } });
    genreCache = {};
    data.results.forEach((g) => {
      genreCache[g.name] = g.id;
    });
    localStorage.setItem('rawgGenreCache', JSON.stringify(genreCache));
  } catch (e) {
    console.error('Failed to fetch RAWG genres', e);
    genreCache = {};
  }
  return genreCache;
};

export const getGamesByGenres = async (platformNames, genreIds, page = 1) => {
  if (!RAWG_KEY) return [];

  const platformIds = platformNames
    .map(name => PLATFORM_IDS[name])
    .filter(Boolean);

  if (platformIds.length === 0) return [];

  try {
    const { data } = await api.get('/games', {
      params: {
        key: RAWG_KEY,
        platforms: platformIds.join(','),
        genres: genreIds.join(','),
        ordering: 'random',
        page,
        page_size: PAGE_SIZE,
      },
    });
    return data.results.map(transformGameData);
  } catch (err) {
    console.error('RAWG genre fetch failed', err);
    return [];
  }
};

export const hasRawgKey = !!RAWG_KEY;

export const getSuggested = async (gameId) => {
  if (!RAWG_KEY) return [];
  try {
    const { data } = await api.get(`/games/${gameId}/suggested`, {
      params: { key: RAWG_KEY, page_size: 20 },
    });
    return data.results.map(transformGameData);
  } catch (err) {
    console.error('RAWG suggested fetch failed', err);
    return [];
  }
}; 