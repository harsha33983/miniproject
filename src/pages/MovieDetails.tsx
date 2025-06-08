import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, ChevronLeft, Youtube } from 'lucide-react';
import { fetchMovieDetails, getImageUrl, searchYouTubeMovie } from '../services/api';
import ContentRow from '../components/movies/ContentRow';
import LoadingScreen from '../components/common/LoadingScreen';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullMovieId, setFullMovieId] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        setMovie(data);
        
        // Search for full movie on YouTube
        const movieId = await searchYouTubeMovie(
          data.title,
          data.release_date?.split('-')[0]
        );
        setFullMovieId(movieId);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Close trailer when navigating away
  useEffect(() => {
    return () => setShowTrailer(false);
  }, []);

  if (loading) return <LoadingScreen />;

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#141414]">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-[#E50914]">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'Movie not found'}</p>
          <Link 
            to="/"
            className="bg-[#E50914] text-white px-6 py-2 rounded hover:bg-[#f6121d] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format runtime
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get trailer if available
  const trailer = movie.videos?.results?.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-[#141414] transition-colors duration-300">
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fadeSlideUp">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              Close
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin"
              title={`${movie.title} Trailer`}
            ></iframe>
          </div>
        </div>
      )}

      {/* Back button */}
      <Link 
        to="/"
        className="fixed top-20 left-4 z-40 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft size={24} className="text-white" />
      </Link>

      {/* Hero section with backdrop */}
      <div className="relative min-h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#141414] via-gray-50/50 dark:via-[#14141499] to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 dark:from-[#141414] to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative pt-32 container mx-auto px-4 z-10 flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-none animate-fadeSlideUp">
            <img 
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="rounded-lg shadow-2xl w-56 h-auto mx-auto lg:mx-0 transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Details */}
          <div className="flex-1 animate-fadeSlideUp animation-delay-200">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900 dark:text-white">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-4">{movie.tagline}</p>
            )}

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
              {/* Rating */}
              {movie.vote_average && (
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
                  <span>{(movie.vote_average / 10 * 5).toFixed(1)}/5</span>
                </div>
              )}

              {/* Release date */}
              {movie.release_date && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}

              {/* Runtime */}
              {movie.runtime && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              {/* Genres */}
              {movie.genres && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: any) => (
                    <span 
                      key={genre.id}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded-md text-xs hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              {fullMovieId ? (
                <a 
                  href={`https://www.youtube.com/watch?v=${fullMovieId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#E50914] text-white px-6 py-3 rounded hover:bg-[#f6121d] transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                  <Play size={20} fill="white" />
                  Watch Movie
                </a>
              ) : (
                <button 
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 cursor-not-allowed opacity-50"
                  disabled
                >
                  <Play size={20} fill="white" />
                  Not Available
                </button>
              )}
              
              {trailer && (
                <button 
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-800 text-white px-6 py-3 rounded hover:bg-red-700 transition-all duration-200 flex items-center gap-2 hover:scale-105"
                >
                  <Youtube size={20} />
                  Watch Trailer
                </button>
              )}
            </div>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Cast</h2>
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                  {movie.credits.cast.slice(0, 10).map((person: any) => (
                    <div key={person.id} className="flex-none w-24 group">
                      <div className="relative overflow-hidden rounded-md mb-2">
                        {person.profile_path ? (
                          <img 
                            src={getImageUrl(person.profile_path, 'w185')}
                            alt={person.name}
                            className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=185&background=374151&color=ffffff&format=png`;
                            }}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-md">
                            <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                              {person.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{person.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div className="mt-12 animate-fadeSlideUp animation-delay-400">
          <ContentRow title="Similar Movies" items={movie.similar.results} type="movie" />
        </div>
      )}

      {/* Recommendations */}
      {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
        <div className="mt-8 animate-fadeSlideUp animation-delay-600">
          <ContentRow title="Recommended" items={movie.recommendations.results} />
        </div>
      )}
    </div>
  );
};

export default MovieDetails;