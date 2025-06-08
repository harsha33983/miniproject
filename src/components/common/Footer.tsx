import { useState } from 'react';
import { Github, Twitter, Facebook, Instagram, Mail, CheckCircle, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/harshavardhan8059?igsh=MWc5MHYwMjhtOXA0Ng==', label: 'Instagram' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    try {
      setSubscribeStatus('loading');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribeStatus('success');
      setEmail('');
      setErrorMessage('');
      // Reset success status after 3 seconds
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (error) {
      setSubscribeStatus('error');
      setErrorMessage('Failed to subscribe. Please try again later.');
    }
  };

  const renderSectionContent = (section: string) => {
    switch (section) {
      case 'faq':
        return (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-300">How do I create an account?</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Click "Sign Up" in the top right corner and follow the instructions. You'll need a valid email and password.
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300">What payment methods do you accept?</h4>
                <p className="text-gray-400 text-sm mt-1">
                  We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300">Can I cancel anytime?</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Yes, you can cancel through your account settings. Your subscription remains active until the current billing period ends.
                </p>
              </div>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Terms of Service</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-300">Acceptance of Terms</h4>
                <p className="text-gray-400 text-sm mt-1">
                  By using our service, you agree to these terms. If you don't agree, you may not use our service.
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300">User Responsibilities</h4>
                <p className="text-gray-400 text-sm mt-1">
                  You must provide accurate information, maintain account security, and use the service lawfully.
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300">Subscription Policy</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Fees are billed in advance and are non-refundable. You authorize us to charge your payment method.
                </p>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Privacy Policy</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-300">Information We Collect</h4>
                <p className="text-gray-400 text-sm mt-1">
                  We collect information you provide when creating an account, subscribing, or contacting us.
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300">How We Use Information</h4>
                <p className="text-gray-400 text-sm mt-1">
                  We use data to provide services, respond to requests, send updates, and communicate offers.
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-300">Data Security</h4>
                <p className="text-gray-400 text-sm mt-1">
                  We implement security measures, but no Internet transmission is 100% secure.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <footer className="bg-[#141414] dark:bg-gray-900 py-12 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-[#E50914] font-bold text-xl mb-4">STREAMFLIX</h3>
            <p className="text-gray-400 text-sm">
              Your ultimate destination for movies and TV shows. Stream the latest content anytime, anywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv" className="text-gray-400 hover:text-white transition">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => toggleSection('faq')}
                  className="flex items-center justify-between w-full text-gray-400 hover:text-white transition"
                >
                  <span>FAQ</span>
                  {expandedSection === 'faq' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'faq' && renderSectionContent('faq')}
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                  <Mail size={16} />
                  <a href="mailto:h0458572@gmail.com.com">h0458572@gmail.com</a>
                </div>
              </li>
              <li className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <Phone size={16} />
                <a href="tel:+91 9704257475">+91 9704257475</a>
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('terms')}
                  className="flex items-center justify-between w-full text-gray-400 hover:text-white transition mt-2"
                >
                  <span>Terms of Service</span>
                  {expandedSection === 'terms' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'terms' && renderSectionContent('terms')}
              </li>
              <li>
                <button 
                  onClick={() => toggleSection('privacy')}
                  className="flex items-center justify-between w-full text-gray-400 hover:text-white transition"
                >
                  <span>Privacy Policy</span>
                  {expandedSection === 'privacy' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedSection === 'privacy' && renderSectionContent('privacy')}
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 text-white px-4 py-2 rounded flex-grow text-sm focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                  className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#f6121d] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribeStatus === 'loading' ? (
                    'Subscribing...'
                  ) : subscribeStatus === 'success' ? (
                    <>
                      <CheckCircle size={16} />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span className="hidden sm:inline">Subscribe</span>
                    </>
                  )}
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              {subscribeStatus === 'success' && (
                <p className="text-green-500 text-sm">Successfully subscribed to newsletter!</p>
              )}
              <p className="text-gray-500 text-xs">
                Subscribe to our newsletter for updates and exclusive offers
              </p>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-8 mb-6">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition"
              aria-label={label}
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-800 pt-6">
          <p>&copy; {currentYear} Streamflix. All rights reserved.</p>
          <p className="mt-1">
            Developed by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E50914] hover:underline"
            >
              HARSHA  VARDHAN
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;