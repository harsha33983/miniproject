import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const BACKDROP_SIZE = 'original';
export const POSTER_SIZE = 'w500';
export const PROFILE_SIZE = 'w185';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

// YouTube search function
export const searchYouTubeMovie = async (title: string, year?: string) => {
  try {
    const query = `${title} ${year || ''} full movie`;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        videoDuration: 'long',
        maxResults: 5,
        key: import.meta.env.VITE_YOUTUBE_API_KEY
      }
    });
    
    // Filter results to find potential full movies (longer duration)
    const videos = response.data.items || [];
    if (videos.length > 0) {
      // Return the first result's video ID
      return videos[0].id.videoId;
    }
    return null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
};

// API endpoints
export const fetchTrending = async (mediaType = 'all', timeWindow = 'week') => {
  const response = await api.get(`/trending/${mediaType}/${timeWindow}`);
  return response.data;
};

export const fetchMovies = async (category = 'popular', page = 1) => {
  const response = await api.get(`/movie/${category}`, {
    params: { page }
  });
  return response.data;
};

export const fetchTVShows = async (category = 'popular', page = 1) => {
  const response = await api.get(`/tv/${category}`, {
    params: { page }
  });
  return response.data;
};

export const fetchMovieDetails = async (id: string) => {
  const response = await api.get(`/movie/${id}`, {
    params: {
      append_to_response: 'videos,credits,similar,recommendations'
    }
  });
  return response.data;
};

export const fetchTVDetails = async (id: string) => {
  const response = await api.get(`/tv/${id}`, {
    params: {
      append_to_response: 'videos,credits,similar,recommendations'
    }
  });
  return response.data;
};

export const searchContent = async (query: string, page = 1) => {
  const response = await api.get('/search/multi', {
    params: {
      query,
      page
    }
  });
  return response.data;
};

export const getImageUrl = (path: string | null, size = POSTER_SIZE) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export default api;