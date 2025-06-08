import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, resetPassword, currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Background image array
  const backgroundImages = [
    'https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc88b/a3873901-5b7c-46eb-b9fa-12fea5197bd3/IN-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg',
    'https://wallpapers.com/images/featured/movie-9pvmdtvz4cb0xl37.jpg',
    'https://tse2.mm.bing.net/th?id=OIP.bEg5qhr8v2P59Odw5SpEsgHaHa&pid=Api&P=0&h=180'
  ];
  const [currentBg, setCurrentBg] = useState(0);

  // Change background every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      let errorMessage = 'Failed to log in';
      
      // Handle specific Firebase error codes
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (err: any) {
      let errorMessage = 'Failed to send password reset email';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-28 overflow-hidden">
      {/* Background image banner with overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentBg ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative z-10 w-full max-w-md bg-white/10 dark:bg-black/75 rounded-xl p-8 sm:p-10 backdrop-blur-lg border border-white/20 dark:border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">Sign In</h1>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2 backdrop-blur-sm">
            <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}
        
        {/* Password reset confirmation */}
        {resetSent && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-green-200">
              Password reset link sent to your email. Check your inbox.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent placeholder-gray-300 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent pr-12 placeholder-gray-300 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-[42px] text-gray-300 hover:text-white transition-colors duration-200"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] text-white py-3 rounded-lg font-medium hover:bg-[#f6121d] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gray-300 hover:text-white transition-colors duration-200 underline"
              disabled={loading}
            >
              Forgot password?
            </button>
            
            <div className="text-gray-300">
              New to Streamflix?{' '}
              <Link to="/signup" className="text-white hover:text-[#E50914] transition-colors duration-200 underline font-medium">
                Sign up now
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;