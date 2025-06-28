import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { getImageUrl } from '../../services/api';

interface ContentCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path?: string;
    vote_average?: number;
    media_type?: string;
  };
  type?: 'movie' | 'tv';
}

const ContentCard: React.FC<ContentCardProps> = ({ item, type = 'movie' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  const title = item.title || item.name || '';
  const mediaType = item.media_type || type;
  const rating = item.vote_average ? (item.vote_average / 10) * 5 : 0;
  
  // Skip rendering if no poster and title
  if (!item.poster_path && !title) {
    return null;
  }

  const handleClick = () => {
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div 
      className="relative flex-none w-[160px] sm:w-[200px] transition-transform duration-300 ease-out transform hover:scale-105 z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div 
        className={`relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
          isHovered ? 'shadow-xl shadow-black/50 dark:shadow-black/70' : ''
        }`}
      >
        {/* Poster image with fallback */}
        {!imageError && item.poster_path ? (
          <img 
            src={getImageUrl(item.poster_path, 'w500')}
            alt={title}
            className="w-full h-auto object-cover transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300">
            <div className="text-center p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 break-words line-clamp-3 transition-colors duration-300">{title}</p>
            </div>
          </div>
        )}

        {/* Hover overlay with enhanced theme support */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/85 dark:bg-black/90 p-3 flex flex-col justify-between transition-all duration-300">
            <div>
              <h3 className="text-sm font-semibold line-clamp-2 text-white">{title}</h3>
              
              {/* Rating */}
              {item.vote_average && item.vote_average > 0 && (
                <div className="flex items-center mt-2">
                  <Star size={14} className="text-yellow-400 mr-1" fill="currentColor" />
                  <span className="text-xs text-gray-200">{rating.toFixed(1)}/5</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-around">
              <button 
                className="bg-white hover:bg-gray-100 text-black rounded-full p-1.5 transition-all duration-200 transform hover:scale-110 shadow-lg"
                aria-label="Play"
              >
                <Play size={16} fill="currentColor" />
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1.5 transition-all duration-200 transform hover:scale-110 shadow-lg"
                aria-label="More information"
              >
                <Info size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Title shown only on mobile where hover doesn't work well */}
      <div className="sm:hidden mt-1">
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate transition-colors duration-300">{title}</p>
      </div>
    </div>
  );
};

export default ContentCard;