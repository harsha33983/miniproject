import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Film, Tv, Search, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `Hi${currentUser ? ` ${currentUser.email?.split('@')[0]}` : ''}! 👋 I'm your Streamflix AI assistant. I can help you discover movies, TV shows, get recommendations, and answer questions about content. What would you like to explore today?`,
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          'Recommend action movies',
          'What\'s trending now?',
          'Best sci-fi TV shows',
          'Movies like Inception',
          'Top rated comedies'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentUser]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Simulate AI responses
  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];

    // Movie recommendations
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion')) {
      if (lowerMessage.includes('action')) {
        response = '🎬 Here are some amazing action movies I recommend:\n\n• John Wick series - Stylish action with Keanu Reeves\n• Mad Max: Fury Road - Post-apocalyptic masterpiece\n• The Dark Knight - Batman at his finest\n• Mission: Impossible series - Tom Cruise\'s stunts are incredible\n• Avengers: Endgame - Epic superhero conclusion\n\nWould you like more specific recommendations or details about any of these?';
        suggestions = ['Tell me about John Wick', 'More superhero movies', 'Recent action films', 'Action TV shows'];
      } else if (lowerMessage.includes('comedy')) {
        response = '😂 Get ready to laugh with these comedy gems:\n\n• The Grand Budapest Hotel - Wes Anderson\'s whimsical masterpiece\n• Superbad - Coming-of-age comedy gold\n• Knives Out - Mystery-comedy perfection\n• The Nice Guys - Buddy cop comedy\n• Brooklyn Nine-Nine - Hilarious police sitcom\n\nWhat type of comedy mood are you in?';
        suggestions = ['Romantic comedies', 'Stand-up specials', 'Comedy TV series', 'Classic comedies'];
      } else if (lowerMessage.includes('horror')) {
        response = '👻 Prepare to be scared with these horror picks:\n\n• Hereditary - Psychological horror masterpiece\n• Get Out - Social thriller brilliance\n• The Conjuring - Classic supernatural scares\n• A Quiet Place - Innovative silent horror\n• Stranger Things - Nostalgic horror series\n\nHow scary do you want to go?';
        suggestions = ['Psychological thrillers', 'Classic horror', 'Horror comedies', 'Supernatural shows'];
      } else {
        response = '🎭 I\'d love to give you personalized recommendations! What genre interests you most?\n\n• Action & Adventure\n• Comedy & Romance\n• Drama & Thriller\n• Horror & Supernatural\n• Sci-Fi & Fantasy\n• Documentary & True Crime\n\nOr tell me about a movie you loved, and I\'ll find similar ones!';
        suggestions = ['Action movies', 'Romantic comedies', 'Sci-fi shows', 'True crime docs', 'Movies like Inception'];
      }
    }
    // Trending content
    else if (lowerMessage.includes('trending') || lowerMessage.includes('popular') || lowerMessage.includes('hot')) {
      response = '🔥 Here\'s what\'s trending on Streamflix right now:\n\n📺 TV Shows:\n• Wednesday - Addams Family spin-off\n• House of the Dragon - Game of Thrones prequel\n• Stranger Things - Final season excitement\n• The Bear - Culinary comedy-drama\n\n🎬 Movies:\n• Top Gun: Maverick - Tom Cruise returns\n• Everything Everywhere All at Once - Multiverse madness\n• The Batman - Dark Knight detective story\n• Dune - Epic sci-fi adventure\n\nWant details about any of these?';
      suggestions = ['Tell me about Wednesday', 'More trending shows', 'New releases', 'Award winners'];
    }
    // Specific movie/show queries
    else if (lowerMessage.includes('like') && (lowerMessage.includes('inception') || lowerMessage.includes('interstellar'))) {
      response = '🧠 If you loved Inception, you\'ll enjoy these mind-bending films:\n\n• Interstellar - Space-time epic by Nolan\n• The Matrix - Reality-questioning classic\n• Shutter Island - Psychological thriller\n• Memento - Reverse narrative genius\n• Westworld - AI consciousness series\n• Dark - German time-travel series\n\nThese all feature complex narratives and reality-bending concepts!';
      suggestions = ['More Christopher Nolan films', 'Time travel movies', 'Psychological thrillers', 'Sci-fi series'];
    }
    // TV show recommendations
    else if (lowerMessage.includes('tv') || lowerMessage.includes('series') || lowerMessage.includes('show')) {
      if (lowerMessage.includes('sci-fi') || lowerMessage.includes('science fiction')) {
        response = '🚀 Amazing sci-fi TV shows to binge:\n\n• Stranger Things - 80s nostalgia meets supernatural\n• The Expanse - Realistic space politics\n• Black Mirror - Technology\'s dark side\n• Westworld - AI and consciousness\n• Star Trek: Strange New Worlds - Classic Trek returns\n• Severance - Workplace psychological thriller\n\nWhich type of sci-fi appeals to you most?';
        suggestions = ['Space operas', 'Dystopian futures', 'Time travel shows', 'Alien encounters'];
      } else {
        response = '📺 Here are some must-watch TV series across genres:\n\n🎭 Drama: Breaking Bad, Better Call Saul, The Crown\n😂 Comedy: The Office, Parks & Rec, Ted Lasso\n🔍 Mystery: Sherlock, True Detective, Mindhunter\n⚔️ Fantasy: Game of Thrones, The Witcher, House of the Dragon\n🚀 Sci-Fi: Stranger Things, The Expanse, Black Mirror\n\nWhat genre catches your interest?';
        suggestions = ['Crime dramas', 'Fantasy epics', 'Comedy series', 'Limited series'];
      }
    }
    // Help and features
    else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      response = '🤖 I\'m here to enhance your Streamflix experience! Here\'s what I can help with:\n\n🎬 Movie & TV Recommendations\n• Personalized suggestions based on your taste\n• Genre-specific recommendations\n• Movies similar to ones you love\n\n🔍 Content Discovery\n• What\'s trending and popular\n• New releases and upcoming content\n• Award-winning films and shows\n\n📊 Information & Details\n• Plot summaries and cast info\n• Ratings and reviews\n• Where to watch specific content\n\n💡 Smart Suggestions\n• Mood-based recommendations\n• Binge-worthy series\n• Hidden gems you might have missed\n\nJust ask me anything about movies or TV shows!';
      suggestions = ['Recommend something new', 'What\'s trending?', 'Find hidden gems', 'Mood-based picks'];
    }
    // Default response
    else {
      response = '🤔 I\'m not sure about that specific query, but I\'d love to help you discover great content! Here are some things I can assist with:\n\n• Movie and TV show recommendations\n• Information about trending content\n• Finding shows similar to ones you love\n• Genre-specific suggestions\n• Cast and crew details\n\nWhat would you like to explore?';
      suggestions = ['Surprise me with a recommendation', 'What\'s new this week?', 'Best movies of 2024', 'Underrated gems'];
    }

    return {
      id: Date.now().toString(),
      text: response,
      isBot: true,
      timestamp: new Date(),
      suggestions
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 animate-scaleIn transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E50914] to-[#f6121d] text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold">Streamflix AI</h3>
            <p className="text-xs opacity-90">Your entertainment assistant</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isBot 
                  ? 'bg-gradient-to-r from-[#E50914] to-[#f6121d] text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {message.isBot ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                message.isBot
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'bg-[#E50914] text-white'
              } transition-colors duration-300`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E50914] to-[#f6121d] text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 transition-colors duration-300">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about movies, shows, or get recommendations..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 bg-[#E50914] hover:bg-[#f6121d] disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;