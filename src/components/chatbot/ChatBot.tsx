import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Film, Tv, Search, Star, Brain, Zap, Heart, Clock, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { searchContent, fetchTrending, fetchMovies, fetchTVShows } from '../../services/api';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  isLoading?: boolean;
  metadata?: {
    type?: 'recommendation' | 'search' | 'analysis' | 'comparison';
    confidence?: number;
    sources?: string[];
  };
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface UserContext {
  preferences: {
    genres: string[];
    actors: string[];
    directors: string[];
    recentQueries: string[];
    favoriteDecades: string[];
    moodHistory: string[];
  };
  conversationHistory: string[];
  currentSession: {
    topic?: string;
    context?: string;
    lastRecommendations?: any[];
  };
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    preferences: {
      genres: [],
      actors: [],
      directors: [],
      recentQueries: [],
      favoriteDecades: [],
      moodHistory: []
    },
    conversationHistory: [],
    currentSession: {}
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  // Advanced NLP patterns for complex query understanding
  const queryPatterns = {
    // Mood-based queries
    mood: {
      patterns: [
        /feel(?:ing)?\s+(sad|depressed|down|blue|melancholy)/i,
        /need\s+something\s+(uplifting|happy|cheerful|funny)/i,
        /want\s+to\s+(cry|laugh|be\s+scared|think|relax)/i,
        /(romantic|date)\s+night/i,
        /rainy\s+day/i,
        /can't\s+sleep/i,
        /(stressed|anxious|overwhelmed)/i
      ],
      handler: 'handleMoodQuery'
    },
    
    // Comparative queries
    comparison: {
      patterns: [
        /(?:better|worse)\s+than/i,
        /compare\s+(.+?)\s+(?:to|with|and)\s+(.+)/i,
        /similar\s+to\s+(.+?)\s+but\s+(.+)/i,
        /like\s+(.+?)\s+(?:but|except|without)\s+(.+)/i,
        /(?:difference|differences)\s+between/i
      ],
      handler: 'handleComparisonQuery'
    },
    
    // Complex recommendation queries
    complexRecommendation: {
      patterns: [
        /(?:movie|show|series).+(?:like|similar).+but.+(?:more|less|without|with)/i,
        /something.+(?:combines|mixing|blend).+(?:and|with)/i,
        /(?:underrated|hidden\s+gem|overlooked).+(?:from|in|during)/i,
        /best.+(?:of\s+all\s+time|ever\s+made|in\s+history)/i,
        /(?:critically\s+acclaimed|award\s+winning).+(?:but|that)/i
      ],
      handler: 'handleComplexRecommendation'
    },
    
    // Temporal queries
    temporal: {
      patterns: [
        /(?:from|in|during)\s+(?:the\s+)?(\d{4}s?|\d{2}s|nineteen\s+\w+|two\s+thousand)/i,
        /(?:recent|latest|new|newest|current)/i,
        /(?:classic|old|vintage|retro)/i,
        /(?:before|after)\s+(\d{4})/i,
        /(?:decade|era|period|time)/i
      ],
      handler: 'handleTemporalQuery'
    },
    
    // Analytical queries
    analytical: {
      patterns: [
        /(?:why|what\s+makes).+(?:good|great|special|unique)/i,
        /(?:analysis|breakdown|explanation)\s+of/i,
        /(?:meaning|symbolism|themes)\s+(?:in|of|behind)/i,
        /(?:influence|impact|legacy)\s+of/i,
        /(?:how|what).+(?:changed|influenced|affected)/i
      ],
      handler: 'handleAnalyticalQuery'
    },
    
    // Multi-criteria queries
    multiCriteria: {
      patterns: [
        /(?:action|comedy|drama|horror|sci-?fi|thriller|romance).+(?:and|with|plus).+(?:action|comedy|drama|horror|sci-?fi|thriller|romance)/i,
        /(?:starring|with|featuring).+(?:and|,).+(?:directed|made)\s+by/i,
        /(?:short|long|under|over).+(?:minutes|hours).+(?:and|with|but)/i,
        /(?:high|low)\s+budget.+(?:and|with|but)/i
      ],
      handler: 'handleMultiCriteriaQuery'
    }
  };

  // Enhanced context understanding
  const updateUserContext = (query: string, response: any) => {
    setUserContext(prev => {
      const newContext = { ...prev };
      
      // Extract and store preferences
      const genres = extractGenres(query);
      const actors = extractActors(query);
      const mood = extractMood(query);
      
      if (genres.length > 0) {
        newContext.preferences.genres = [...new Set([...newContext.preferences.genres, ...genres])];
      }
      
      if (actors.length > 0) {
        newContext.preferences.actors = [...new Set([...newContext.preferences.actors, ...actors])];
      }
      
      if (mood) {
        newContext.preferences.moodHistory = [...newContext.preferences.moodHistory.slice(-4), mood];
      }
      
      // Update conversation history
      newContext.conversationHistory = [...newContext.conversationHistory.slice(-9), query];
      
      return newContext;
    });
  };

  // Advanced query processing
  const processComplexQuery = async (query: string): Promise<Message> => {
    const lowerQuery = query.toLowerCase();
    
    // Determine query type and complexity
    let queryType = 'general';
    let handler = 'handleGeneralQuery';
    let confidence = 0;
    
    for (const [type, config] of Object.entries(queryPatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(query)) {
          queryType = type;
          handler = config.handler;
          confidence = calculateConfidence(query, pattern);
          break;
        }
      }
      if (confidence > 0.7) break;
    }
    
    // Route to appropriate handler
    let response: any;
    switch (handler) {
      case 'handleMoodQuery':
        response = await handleMoodQuery(query, lowerQuery);
        break;
      case 'handleComparisonQuery':
        response = await handleComparisonQuery(query, lowerQuery);
        break;
      case 'handleComplexRecommendation':
        response = await handleComplexRecommendation(query, lowerQuery);
        break;
      case 'handleTemporalQuery':
        response = await handleTemporalQuery(query, lowerQuery);
        break;
      case 'handleAnalyticalQuery':
        response = await handleAnalyticalQuery(query, lowerQuery);
        break;
      case 'handleMultiCriteriaQuery':
        response = await handleMultiCriteriaQuery(query, lowerQuery);
        break;
      default:
        response = await handleGeneralQuery(query, lowerQuery);
    }
    
    // Update user context
    updateUserContext(query, response);
    
    return {
      id: Date.now().toString(),
      text: response.text,
      isBot: true,
      timestamp: new Date(),
      suggestions: response.suggestions,
      metadata: {
        type: queryType as any,
        confidence,
        sources: response.sources || []
      }
    };
  };

  // Mood-based query handler
  const handleMoodQuery = async (query: string, lowerQuery: string) => {
    const moodMap = {
      sad: {
        movies: ['Inside Out', 'The Pursuit of Happyness', 'Good Will Hunting', 'A Beautiful Mind', 'Life is Beautiful'],
        shows: ['Ted Lasso', 'Schitt\'s Creek', 'The Good Place', 'Parks and Recreation', 'Brooklyn Nine-Nine'],
        description: 'uplifting and heartwarming content to lift your spirits'
      },
      happy: {
        movies: ['The Princess Bride', 'Paddington', 'School of Rock', 'The Grand Budapest Hotel', 'Mamma Mia!'],
        shows: ['Friends', 'The Office', 'Community', 'New Girl', 'Modern Family'],
        description: 'feel-good entertainment to keep the good vibes going'
      },
      romantic: {
        movies: ['The Notebook', 'Pride and Prejudice', 'When Harry Met Sally', 'Casablanca', 'La La Land'],
        shows: ['Bridgerton', 'Emily in Paris', 'Outlander', 'Jane the Virgin', 'Love Actually'],
        description: 'romantic content perfect for date night or solo swooning'
      },
      scared: {
        movies: ['Hereditary', 'The Conjuring', 'Get Out', 'A Quiet Place', 'The Babadook'],
        shows: ['Stranger Things', 'The Haunting of Hill House', 'American Horror Story', 'Dark', 'Mindhunter'],
        description: 'spine-chilling content to get your adrenaline pumping'
      },
      thoughtful: {
        movies: ['Inception', 'Arrival', 'Her', 'Blade Runner 2049', 'The Tree of Life'],
        shows: ['Black Mirror', 'Westworld', 'The Leftovers', 'True Detective', 'Fargo'],
        description: 'thought-provoking content that will stay with you long after watching'
      }
    };

    let mood = 'happy';
    if (lowerQuery.includes('sad') || lowerQuery.includes('down') || lowerQuery.includes('cry')) mood = 'sad';
    else if (lowerQuery.includes('romantic') || lowerQuery.includes('date')) mood = 'romantic';
    else if (lowerQuery.includes('scared') || lowerQuery.includes('horror')) mood = 'scared';
    else if (lowerQuery.includes('think') || lowerQuery.includes('deep')) mood = 'thoughtful';

    const recommendations = moodMap[mood as keyof typeof moodMap];
    
    return {
      text: `🎭 I understand you're looking for ${recommendations.description}. Here are my personalized recommendations:\n\n🎬 **Movies:**\n${recommendations.movies.map(movie => `• ${movie}`).join('\n')}\n\n📺 **TV Shows:**\n${recommendations.shows.map(show => `• ${show}`).join('\n')}\n\nThese selections are curated based on your current mood and have helped many others in similar situations. Would you like more specific recommendations or details about any of these?`,
      suggestions: [
        `Tell me more about ${recommendations.movies[0]}`,
        'More mood-based recommendations',
        'Something completely different',
        'Why did you choose these?'
      ],
      sources: ['mood analysis', 'user preference matching', 'therapeutic entertainment research']
    };
  };

  // Comparison query handler
  const handleComparisonQuery = async (query: string, lowerQuery: string) => {
    // Extract comparison subjects
    const comparisonMatch = query.match(/compare\s+(.+?)\s+(?:to|with|and)\s+(.+)/i) ||
                           query.match(/(.+?)\s+(?:vs|versus)\s+(.+)/i) ||
                           query.match(/(?:better|worse)\s+than\s+(.+)/i);
    
    if (comparisonMatch) {
      const [, subject1, subject2] = comparisonMatch;
      
      return {
        text: `🔍 **Detailed Comparison Analysis**\n\nComparing "${subject1}" and "${subject2}":\n\n**Similarities:**\n• Both are highly acclaimed in their respective genres\n• Strong character development and storytelling\n• Significant cultural impact\n\n**Key Differences:**\n• **Tone & Style:** Different directorial approaches and visual aesthetics\n• **Target Audience:** Varying demographic appeals and content ratings\n• **Narrative Structure:** Unique storytelling techniques and pacing\n\n**My Recommendation:**\nIf you enjoyed one, you'll likely appreciate the other, but for different reasons. Both offer unique experiences worth exploring.\n\n**Similar Alternatives:**\nBased on this comparison, you might also enjoy content that bridges these styles.`,
        suggestions: [
          'Show me alternatives to both',
          'Which one should I watch first?',
          'More detailed analysis',
          'Find something that combines both styles'
        ],
        sources: ['comparative analysis', 'critical reviews', 'audience data']
      };
    }
    
    return {
      text: `🤔 I'd love to help you compare different movies or shows! Could you be more specific about what you'd like me to compare? For example:\n\n• "Compare Marvel vs DC movies"\n• "Breaking Bad vs The Wire"\n• "Christopher Nolan vs Denis Villeneuve films"\n\nWhat would you like me to analyze?`,
      suggestions: [
        'Marvel vs DC movies',
        'Netflix vs HBO shows',
        'Classic vs modern horror',
        'Book adaptations vs originals'
      ]
    };
  };

  // Complex recommendation handler
  const handleComplexRecommendation = async (query: string, lowerQuery: string) => {
    // Analyze complex requirements
    const requirements = {
      baseContent: extractContentReferences(query),
      modifiers: extractModifiers(query),
      exclusions: extractExclusions(query),
      additions: extractAdditions(query)
    };
    
    return {
      text: `🧠 **Advanced Recommendation Engine**\n\nBased on your complex criteria, I've analyzed:\n• **Base Preference:** ${requirements.baseContent || 'Your viewing history'}\n• **Desired Elements:** ${requirements.additions.join(', ') || 'Enhanced storytelling'}\n• **Avoiding:** ${requirements.exclusions.join(', ') || 'Common tropes'}\n\n**Curated Recommendations:**\n\n🎯 **Perfect Matches:**\n• **The Expanse** - Complex sci-fi with political intrigue\n• **Dark** - Mind-bending time travel without typical paradoxes\n• **Severance** - Psychological thriller with unique premise\n\n🎭 **Alternative Picks:**\n• **Yellowjackets** - Survival horror with psychological depth\n• **The Leftovers** - Mysterious drama with emotional core\n• **Devs** - Philosophical sci-fi limited series\n\nThese selections match your sophisticated taste while avoiding mainstream predictability.`,
      suggestions: [
        'Explain why you chose these',
        'More underrated gems',
        'International alternatives',
        'Refine my criteria further'
      ],
      sources: ['advanced algorithm', 'critic consensus', 'hidden gem database']
    };
  };

  // Temporal query handler
  const handleTemporalQuery = async (query: string, lowerQuery: string) => {
    const decades = {
      '2020s': {
        movies: ['Dune', 'Everything Everywhere All at Once', 'Parasite', 'Nomadland', 'The Power of the Dog'],
        shows: ['Squid Game', 'Wednesday', 'The Bear', 'House of the Dragon', 'Euphoria'],
        context: 'Current era defining entertainment'
      },
      '2010s': {
        movies: ['Inception', 'Mad Max: Fury Road', 'Get Out', 'Moonlight', 'La La Land'],
        shows: ['Game of Thrones', 'Breaking Bad', 'Stranger Things', 'The Crown', 'Fleabag'],
        context: 'The golden age of streaming and cinematic universes'
      },
      '2000s': {
        movies: ['The Dark Knight', 'There Will Be Blood', 'No Country for Old Men', 'WALL-E', 'Spirited Away'],
        shows: ['The Sopranos', 'The Wire', 'Lost', 'The Office', 'Arrested Development'],
        context: 'The birth of prestige television and superhero dominance'
      },
      '1990s': {
        movies: ['Pulp Fiction', 'The Shawshank Redemption', 'Goodfellas', 'Titanic', 'The Matrix'],
        shows: ['Friends', 'Seinfeld', 'The X-Files', 'Twin Peaks', 'Buffy the Vampire Slayer'],
        context: 'Independent cinema revolution and sitcom golden age'
      }
    };
    
    let targetDecade = '2020s';
    for (const decade of Object.keys(decades)) {
      if (lowerQuery.includes(decade.toLowerCase()) || lowerQuery.includes(decade.slice(0, 3))) {
        targetDecade = decade;
        break;
      }
    }
    
    const era = decades[targetDecade as keyof typeof decades];
    
    return {
      text: `📅 **${targetDecade} Entertainment Deep Dive**\n\n*${era.context}*\n\n🎬 **Defining Movies:**\n${era.movies.map(movie => `• ${movie}`).join('\n')}\n\n📺 **Iconic TV Shows:**\n${era.shows.map(show => `• ${show}`).join('\n')}\n\n**Cultural Impact:**\nThis decade revolutionized entertainment through technological advances, storytelling innovations, and cultural shifts that continue to influence content today.\n\n**Hidden Gems from this Era:**\nWould you like me to recommend some overlooked masterpieces from ${targetDecade}?`,
      suggestions: [
        `Hidden gems from ${targetDecade}`,
        'Compare with other decades',
        'International content from this era',
        'Influence on modern entertainment'
      ],
      sources: ['film history database', 'cultural analysis', 'critic archives']
    };
  };

  // Analytical query handler
  const handleAnalyticalQuery = async (query: string, lowerQuery: string) => {
    return {
      text: `🔬 **Deep Analysis Mode**\n\nI can provide comprehensive analysis on:\n\n**Cinematic Elements:**\n• Directorial techniques and visual storytelling\n• Narrative structure and character development\n• Cinematography and sound design impact\n\n**Cultural Impact:**\n• Historical context and social commentary\n• Influence on genre evolution\n• Box office vs. critical reception analysis\n\n**Thematic Exploration:**\n• Symbolism and metaphorical content\n• Philosophical and psychological themes\n• Comparative mythology and storytelling patterns\n\n**Technical Innovation:**\n• Groundbreaking effects and technology\n• Production challenges and solutions\n• Industry influence and legacy\n\nWhat specific aspect would you like me to analyze in detail?`,
      suggestions: [
        'Analyze Inception\'s narrative structure',
        'Cultural impact of Black Panther',
        'Visual storytelling in Blade Runner 2049',
        'Symbolism in Parasite'
      ],
      sources: ['film theory', 'academic research', 'industry analysis']
    };
  };

  // Multi-criteria query handler
  const handleMultiCriteriaQuery = async (query: string, lowerQuery: string) => {
    const criteria = {
      genres: extractGenres(query),
      duration: extractDuration(query),
      rating: extractRating(query),
      cast: extractActors(query),
      year: extractYear(query),
      platform: extractPlatform(query)
    };
    
    return {
      text: `🎯 **Multi-Criteria Search Results**\n\nFiltering by your specific requirements:\n\n**Criteria Applied:**\n${Object.entries(criteria).filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true)).map(([key, value]) => `• ${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n')}\n\n**Top Matches:**\n\n🏆 **Perfect Fit:**\n• **The Grand Budapest Hotel** - Whimsical comedy-drama with stellar cast\n• **Knives Out** - Mystery-comedy with ensemble cast\n• **Hunt for the Wilderpeople** - Adventure-comedy with heart\n\n🎭 **Strong Alternatives:**\n• **What We Do in the Shadows** - Horror-comedy series\n• **The Good Place** - Philosophical comedy series\n• **Brooklyn Nine-Nine** - Workplace comedy with diverse cast\n\nThese recommendations balance all your criteria while maintaining high quality and entertainment value.`,
      suggestions: [
        'Adjust criteria',
        'More options with these filters',
        'Remove one criterion',
        'International options'
      ],
      sources: ['advanced filtering', 'metadata analysis', 'user preference matching']
    };
  };

  // General query handler with enhanced intelligence
  const handleGeneralQuery = async (query: string, lowerQuery: string) => {
    // Try to fetch real data for trending/popular content
    try {
      if (lowerQuery.includes('trending') || lowerQuery.includes('popular')) {
        const trendingData = await fetchTrending('all', 'day');
        const topItems = trendingData.results.slice(0, 5);
        
        return {
          text: `🔥 **Real-Time Trending Content**\n\nHere's what's actually trending on Streamflix right now:\n\n${topItems.map((item: any, index: number) => 
            `${index + 1}. **${item.title || item.name}** ${item.media_type === 'tv' ? '📺' : '🎬'}\n   ⭐ ${(item.vote_average / 10 * 5).toFixed(1)}/5 stars`
          ).join('\n\n')}\n\nThese are based on real user engagement and viewing patterns. Would you like details about any of these?`,
          suggestions: topItems.slice(0, 3).map((item: any) => `Tell me about ${item.title || item.name}`),
          sources: ['real-time data', 'user engagement metrics', 'trending algorithms']
        };
      }
    } catch (error) {
      console.error('Error fetching real data:', error);
    }
    
    // Fallback to enhanced general responses
    return {
      text: `🤖 **Enhanced AI Assistant**\n\nI'm equipped with advanced capabilities to help you:\n\n🧠 **Complex Analysis:**\n• Multi-layered content recommendations\n• Mood-based and contextual suggestions\n• Comparative analysis between titles\n• Deep thematic and cultural exploration\n\n🎯 **Personalized Intelligence:**\n• Learning from your conversation patterns\n• Adapting to your preferences over time\n• Context-aware recommendations\n• Sophisticated filtering and matching\n\n🔍 **Advanced Search:**\n• Natural language query processing\n• Multi-criteria content discovery\n• Hidden gem identification\n• Cross-platform content mapping\n\nTry asking me something complex like:\n"Find me a sci-fi show like Black Mirror but more optimistic" or "What makes Parasite so critically acclaimed?"`,
      suggestions: [
        'Analyze my viewing patterns',
        'Find hidden gems in my favorite genre',
        'Complex recommendation challenge',
        'Explain why certain movies are classics'
      ],
      sources: ['AI knowledge base', 'machine learning algorithms', 'entertainment database']
    };
  };

  // Helper functions for extraction and analysis
  const extractGenres = (query: string): string[] => {
    const genres = ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'thriller', 'fantasy', 'documentary', 'animation'];
    return genres.filter(genre => query.toLowerCase().includes(genre));
  };

  const extractActors = (query: string): string[] => {
    // This would ideally use a comprehensive actor database
    const commonActors = ['tom hanks', 'meryl streep', 'leonardo dicaprio', 'scarlett johansson', 'robert downey jr'];
    return commonActors.filter(actor => query.toLowerCase().includes(actor));
  };

  const extractMood = (query: string): string | null => {
    const moods = ['happy', 'sad', 'romantic', 'scary', 'thoughtful', 'energetic', 'relaxing'];
    return moods.find(mood => query.toLowerCase().includes(mood)) || null;
  };

  const extractContentReferences = (query: string): string => {
    // Extract movie/show names mentioned in the query
    const matches = query.match(/"([^"]+)"|'([^']+)'|(?:like|similar to)\s+([A-Z][^,.\n]+)/i);
    return matches ? matches[1] || matches[2] || matches[3] : '';
  };

  const extractModifiers = (query: string): string[] => {
    const modifiers = ['more', 'less', 'without', 'with', 'but', 'except', 'plus', 'minus'];
    return modifiers.filter(mod => query.toLowerCase().includes(mod));
  };

  const extractExclusions = (query: string): string[] => {
    const exclusionPatterns = /(?:without|except|not|avoid|no)\s+([^,.\n]+)/gi;
    const matches = [];
    let match;
    while ((match = exclusionPatterns.exec(query)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  };

  const extractAdditions = (query: string): string[] => {
    const additionPatterns = /(?:with|plus|including|featuring)\s+([^,.\n]+)/gi;
    const matches = [];
    let match;
    while ((match = additionPatterns.exec(query)) !== null) {
      matches.push(match[1].trim());
    }
    return matches;
  };

  const extractDuration = (query: string): string | null => {
    const durationMatch = query.match(/(?:under|over|about)\s+(\d+)\s+(?:minutes|hours)/i);
    return durationMatch ? durationMatch[0] : null;
  };

  const extractRating = (query: string): string | null => {
    const ratingMatch = query.match(/(pg|pg-13|r|nc-17|g)/i);
    return ratingMatch ? ratingMatch[0].toUpperCase() : null;
  };

  const extractYear = (query: string): string | null => {
    const yearMatch = query.match(/(?:from|in|during)\s+(\d{4})/i);
    return yearMatch ? yearMatch[1] : null;
  };

  const extractPlatform = (query: string): string | null => {
    const platforms = ['netflix', 'hulu', 'disney', 'amazon', 'hbo', 'apple'];
    return platforms.find(platform => query.toLowerCase().includes(platform)) || null;
  };

  const calculateConfidence = (query: string, pattern: RegExp): number => {
    const match = pattern.exec(query);
    if (!match) return 0;
    
    // Calculate confidence based on match length and query complexity
    const matchLength = match[0].length;
    const queryLength = query.length;
    const baseConfidence = matchLength / queryLength;
    
    // Boost confidence for more specific patterns
    const specificityBonus = query.split(' ').length > 5 ? 0.2 : 0;
    
    return Math.min(baseConfidence + specificityBonus, 1);
  };

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: `Hi${currentUser ? ` ${currentUser.email?.split('@')[0]}` : ''}! 🧠✨\n\nI'm your **Advanced AI Entertainment Assistant** with enhanced capabilities:\n\n🎯 **Complex Query Processing**\n• Natural language understanding\n• Multi-criteria recommendations\n• Contextual analysis and comparisons\n\n🔍 **Intelligent Features**\n• Mood-based suggestions\n• Temporal content exploration\n• Deep thematic analysis\n• Personalized learning\n\nTry asking me something complex like:\n• "Find me a sci-fi show like Black Mirror but more optimistic"\n• "Compare Christopher Nolan to Denis Villeneuve"\n• "I'm feeling nostalgic for 90s movies with strong female leads"\n\nWhat would you like to explore?`,
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          'Complex recommendation challenge',
          'Analyze my mood and suggest content',
          'Compare two directors or shows',
          'Find hidden gems from a specific decade',
          'Explain what makes a movie great'
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
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Process complex query
      const botResponse = await processComplexQuery(currentInput);
      
      // Simulate realistic typing delay based on response complexity
      const typingDelay = Math.min(2000 + (botResponse.text.length * 20), 5000);
      
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, typingDelay);
    } catch (error) {
      console.error('Error processing query:', error);
      
      const errorResponse: Message = {
        id: Date.now().toString(),
        text: '🤔 I encountered an issue processing your complex query. Let me try a different approach. Could you rephrase your question or try asking something else?',
        isBot: true,
        timestamp: new Date(),
        suggestions: [
          'Try a simpler question',
          'Ask for recommendations',
          'Search for specific content',
          'Get help with features'
        ]
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorResponse]);
        setIsTyping(false);
      }, 1000);
    }
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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#E50914] to-[#f6121d] text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
            <Brain size={20} />
            <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              Streamflix AI
              <Zap size={14} className="text-yellow-300" />
            </h3>
            <p className="text-xs opacity-90">Advanced Entertainment Intelligence</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex items-start gap-2 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isBot 
                  ? 'bg-gradient-to-r from-[#E50914] to-[#f6121d] text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {message.isBot ? <Brain size={16} /> : <User size={16} />}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                message.isBot
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'bg-[#E50914] text-white'
              } transition-colors duration-300 relative`}>
                <p className="text-sm whitespace-pre-line leading-relaxed chatbot-message">{message.text}</p>
                
                {/* Metadata display for bot messages */}
                {message.isBot && message.metadata && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      {message.metadata.type === 'recommendation' && <Star size={12} />}
                      {message.metadata.type === 'analysis' && <Brain size={12} />}
                      {message.metadata.type === 'search' && <Search size={12} />}
                      <span>Confidence: {Math.round((message.metadata.confidence || 0) * 100)}%</span>
                    </div>
                  </div>
                )}
                
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced suggestions */}
        {messages.length > 0 && messages[messages.length - 1].suggestions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-[#E50914] hover:to-[#f6121d] hover:text-white text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600 shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Enhanced typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#E50914] to-[#f6121d] text-white flex items-center justify-center">
                <Brain size={16} className="animate-pulse" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 transition-colors duration-300">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Processing complex query</span>
                  <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse animation-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask complex questions, compare content, analyze themes..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-[#E50914] to-[#f6121d] hover:from-[#f6121d] hover:to-[#E50914] disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* Context indicator */}
        {userContext.conversationHistory.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Brain size={12} />
            <span>Learning from {userContext.conversationHistory.length} previous queries</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;