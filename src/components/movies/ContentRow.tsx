import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';

interface ContentRowProps {
  title: string;
  items: any[];
  type?: 'movie' | 'tv';
}

const ContentRow: React.FC<ContentRowProps> = ({ title, items, type = 'movie' }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  // Handle scroll to show/hide arrows based on scroll position
  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current && !isScrolling) {
      setIsScrolling(true);
      const scrollAmount = direction === 'left' ? -rowRef.current.clientWidth * 0.75 : rowRef.current.clientWidth * 0.75;
      
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Reset the scrolling state after animation completes
      setTimeout(() => {
        setIsScrolling(false);
        handleScroll();
      }, 500);
    }
  };

  return (
    <div className="mb-8 relative group">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">{title}</h2>
      
      {/* Navigation arrows */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-10 h-full w-12 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
      )}
      
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-10 h-full w-12 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      )}
      
      {/* Content row */}
      <div 
        ref={rowRef}
        className="flex overflow-x-auto scrollbar-hide pb-4 px-4 md:px-8 gap-3"
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <ContentCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default ContentRow;