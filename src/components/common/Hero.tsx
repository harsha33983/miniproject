import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

interface HeroProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string;
    overview: string;
    media_type?: string;
  };
  type?: 'movie' | 'tv';
}

const Hero: React.FC<HeroProps> = ({ item, type = 'movie' }) => {
  const title = item.title || item.name || '';
  const mediaType = item.media_type || type;
  const detailsPath = `/${mediaType}/${item.id}`;
  
  // Trim overview to a reasonable length
  const truncatedOverview = item.overview.length > 200 
    ? `${item.overview.substring(0, 200)}...` 
    : item.overview;

  return (
    <div className="relative w-full h-[80vh] sm:h-[85vh] overflow-hidden">
      {/* Background image with enhanced gradient overlays for both themes */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${getImageUrl(item.backdrop_path, 'original')})`,
        }}
      >
        {/* Enhanced gradient overlays that adapt to theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-gray-50/20 dark:from-[#141414] dark:via-[#141414]/80 dark:to-[#141414]/20 transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/60 to-transparent dark:from-[#141414] dark:via-[#141414]/60 dark:to-transparent transition-colors duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/90 dark:to-[#141414]/90 transition-colors duration-500"></div>
        
        {/* Additional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 transition-colors duration-500"></div>
      </div>

      {/* Content with enhanced theme-aware styling */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-20 sm:pb-32 z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fadeSlideUp text-white drop-shadow-2xl">
            {title}
          </h1>
          <p className="text-lg text-gray-100 dark:text-gray-200 mb-6 animate-fadeSlideUp animation-delay-200 drop-shadow-lg leading-relaxed">
            {truncatedOverview}
          </p>
          <div className="flex flex-wrap gap-4 animate-fadeSlideUp animation-delay-400">
            <Link 
              to={detailsPath} 
              className="bg-white hover:bg-gray-100 text-black font-semibold rounded px-6 py-3 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            >
              <Play size={20} fill="black" />
              Play
            </Link>
            <Link 
              to={detailsPath}
              className="bg-gray-600/90 hover:bg-gray-700/90 dark:bg-gray-700/90 dark:hover:bg-gray-600/90 text-white font-semibold rounded px-6 py-3 transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              <Info size={20} />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;