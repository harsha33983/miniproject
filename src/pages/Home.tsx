import { useEffect, useState } from 'react';
import Hero from '../components/common/Hero';
import ContentRow from '../components/movies/ContentRow';
import LoadingScreen from '../components/common/LoadingScreen';
import { fetchTrending, fetchMovies, fetchTVShows } from '../services/api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroContent, setHeroContent] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          trendingData, 
          popularMoviesData, 
          topRatedMoviesData,
          popularTVData,
          topRatedTVData,
          upcomingMoviesData
        ] = await Promise.all([
          fetchTrending('all', 'day'),
          fetchMovies('popular'),
          fetchMovies('top_rated'),
          fetchTVShows('popular'),
          fetchTVShows('top_rated'),
          fetchMovies('upcoming')
        ]);
        
        // Set states with fetched data
        setTrending(trendingData.results);
        setPopularMovies(popularMoviesData.results);
        setTopRatedMovies(topRatedMoviesData.results);
        setPopularTVShows(popularTVData.results);
        setTopRatedTVShows(topRatedTVData.results);
        setUpcomingMovies(upcomingMoviesData.results);
        
        // Set hero content (randomly select from trending)
        if (trendingData.results && trendingData.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * 5); // Pick from top 5
          setHeroContent(trendingData.results[randomIndex]);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  if (loading) return <LoadingScreen />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#E50914]">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#E50914] text-white px-6 py-2 rounded hover:bg-[#f6121d] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      {heroContent && <Hero item={heroContent} type={heroContent.media_type === 'tv' ? 'tv' : 'movie'} />}
      
      {/* Content Rows */}
      <div className="pt-4 pb-16">
        {trending.length > 0 && (
          <ContentRow title="Trending Now" items={trending} />
        )}
        
        {popularMovies.length > 0 && (
          <ContentRow title="Popular Movies" items={popularMovies} type="movie" />
        )}
        
        {popularTVShows.length > 0 && (
          <ContentRow title="Popular TV Shows" items={popularTVShows} type="tv" />
        )}
        
        {topRatedMovies.length > 0 && (
          <ContentRow title="Top Rated Movies" items={topRatedMovies} type="movie" />
        )}
        
        {upcomingMovies.length > 0 && (
          <ContentRow title="Upcoming Movies" items={upcomingMovies} type="movie" />
        )}
        
        {topRatedTVShows.length > 0 && (
          <ContentRow title="Top Rated TV Shows" items={topRatedTVShows} type="tv" />
        )}
      </div>
    </div>
  );
};

export default Home;