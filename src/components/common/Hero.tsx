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
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${getImageUrl(item.backdrop_path, 'original')})`,
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#14141499] to-[#14141422]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-20 sm:pb-32">
        <div className="max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fadeSlideUp">
            {title}
          </h1>
          <p className="text-lg text-gray-200 mb-6 animate-fadeSlideUp animation-delay-200">
            {truncatedOverview}
          </p>
          <div className="flex flex-wrap gap-4 animate-fadeSlideUp animation-delay-400">
            <Link 
              to={detailsPath} 
              className="bg-white text-black font-semibold rounded px-6 py-2 hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Play size={20} fill="black" />
              Play
            </Link>
            <Link 
              to={detailsPath}
              className="bg-gray-600/80 text-white font-semibold rounded px-6 py-2 hover:bg-gray-700/80 transition flex items-center gap-2"
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