import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, Tv, LogOut, Menu, X, User, Sun, Moon, Play, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import VoiceSearch from './VoiceSearch';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [showVoiceError, setShowVoiceError] = useState(false);
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme, systemPreference } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    if (transcript.trim()) {
      setSearchQuery(transcript);
      // Auto-submit the search after a short delay
      setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(transcript.trim())}`);
        setSearchQuery('');
        setShowMobileMenu(false);
      }, 500);
    }
  };

  const handleVoiceError = (error: string) => {
    setVoiceError(error);
    setShowVoiceError(true);
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      setShowVoiceError(false);
    }, 5000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Enhanced theme toggle component
  const ThemeToggle = ({ isMobile = false }) => (
    <div className="flex items-center gap-2">
      {!isMobile && (
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block">
          {theme === systemPreference ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      )}
      <button
        onClick={toggleTheme}
        className={`theme-toggle ${
          theme === 'dark' 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gray-200 hover:bg-gray-300'
        } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Current: ${theme} mode${theme === systemPreference ? ' (matches system)' : ''}`}
      >
        <span className={`theme-toggle-slider ${theme === 'dark' ? 'dark' : ''}`}>
          {theme === 'dark' ? (
            <Moon size={12} className="text-gray-700" />
          ) : (
            <Sun size={12} className="text-yellow-600" />
          )}
        </span>
      </button>
    </div>
  );

  return (
    <>
      <header 
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled || showMobileMenu 
            ? 'bg-white/95 dark:bg-[#141414]/95 backdrop-blur-md shadow-lg' 
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="text-[#E50914] font-bold text-2xl md:text-3xl flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center shadow-lg">
              <Play size={20} fill="white" className="ml-0.5" />
            </div>
            <span className="bg-gradient-to-r from-[#E50914] to-[#f6121d] bg-clip-text text-transparent">
              STREAMFLIX
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-[#E50914] transition-colors duration-200 font-medium ${
                location.pathname === '/' 
                  ? 'text-[#E50914]' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={`hover:text-[#E50914] transition-colors duration-200 flex items-center gap-1 font-medium ${
                location.pathname === '/movies' 
                  ? 'text-[#E50914]' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Film size={16} />
              Movies
            </Link>
            <Link 
              to="/tv" 
              className={`hover:text-[#E50914] transition-colors duration-200 flex items-center gap-1 font-medium ${
                location.pathname === '/tv' 
                  ? 'text-[#E50914]' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Tv size={16} />
              TV Shows
            </Link>

            {/* Enhanced search form with voice search */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent text-gray-900 dark:text-white w-[180px] transition-all duration-200 focus:w-[220px] placeholder-gray-500 dark:placeholder-gray-400"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                
                {/* Voice search button */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <VoiceSearch
                    onResult={handleVoiceResult}
                    onError={handleVoiceError}
                    disabled={false}
                  />
                </div>
              </div>
            </form>

            <ThemeToggle />

            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile"
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-[#E50914] transition-colors duration-200 font-medium"
                >
                  <User size={16} />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-[#E50914] transition-colors duration-200 font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#E50914] text-white px-6 py-2 rounded-full hover:bg-[#f6121d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </nav>

          <button 
            className="md:hidden text-gray-700 dark:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="md:hidden bg-white dark:bg-[#141414] border-t border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-4 space-y-4">
              {/* Mobile search form with voice search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent text-gray-900 dark:text-white w-full placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  
                  {/* Voice search button for mobile */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <VoiceSearch
                      onResult={handleVoiceResult}
                      onError={handleVoiceError}
                      disabled={false}
                    />
                  </div>
                </div>
              </form>
              
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className={`hover:text-[#E50914] transition-colors duration-200 font-medium py-2 ${
                    location.pathname === '/' 
                      ? 'text-[#E50914]' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/movies" 
                  className={`hover:text-[#E50914] transition-colors duration-200 flex items-center gap-2 font-medium py-2 ${
                    location.pathname === '/movies' 
                      ? 'text-[#E50914]' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Film size={16} />
                  Movies
                </Link>
                <Link 
                  to="/tv" 
                  className={`hover:text-[#E50914] transition-colors duration-200 flex items-center gap-2 font-medium py-2 ${
                    location.pathname === '/tv' 
                      ? 'text-[#E50914]' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Tv size={16} />
                  TV Shows
                </Link>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
                  <ThemeToggle isMobile={true} />
                </div>
                
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#E50914] transition-colors duration-200 font-medium py-2"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#E50914] transition-colors duration-200 font-medium py-2 w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="bg-[#E50914] text-white px-6 py-3 rounded-full hover:bg-[#f6121d] transition-all duration-200 text-center font-medium shadow-lg"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Voice Error Toast */}
      {showVoiceError && (
        <div className="fixed top-24 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fadeSlideUp max-w-sm">
          <div className="flex items-start gap-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Voice Search Error</p>
              <p className="text-xs opacity-90 mt-1">{voiceError}</p>
            </div>
            <button
              onClick={() => setShowVoiceError(false)}
              className="ml-2 text-white/80 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;