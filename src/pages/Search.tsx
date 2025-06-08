import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchContent, getImageUrl } from '../services/api';
import LoadingScreen from '../components/common/LoadingScreen';
import ContentCard from '../components/movies/ContentCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        setPage(1); // Reset page to 1 when query changes
        
        const data = await searchContent(query);
        setResults(data.results || []);
        setTotalPages(data.total_pages || 0);
      } catch (err) {
        console.error('Error searching content:', err);
        setError('Failed to search content');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const loadMoreResults = async () => {
    if (page >= totalPages) return;
    
    try {
      const nextPage = page + 1;
      const data = await searchContent(query, nextPage);
      setResults((prevResults) => [...prevResults, ...(data.results || [])]);
      setPage(nextPage);
    } catch (err) {
      console.error('Error loading more results:', err);
    }
  };

  if (loading && page === 1) return <LoadingScreen />;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-gray-400 mb-8">
          {query ? `Showing results for "${query}"` : 'Enter a search term above'}
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded p-4 mb-8">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              Use the search bar above to find movies and TV shows
            </p>
          </div>
        )}

        {query && results.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No results found for "{query}"
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {results.map((item: any) => (
              <div key={`${item.id}-${item.media_type}`} className="flex justify-center">
                <ContentCard 
                  item={item} 
                  type={item.media_type === 'tv' ? 'tv' : 'movie'} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Load more button */}
        {results.length > 0 && page < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMoreResults}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;