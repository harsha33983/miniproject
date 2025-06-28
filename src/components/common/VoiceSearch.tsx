import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ 
  onResult, 
  onError, 
  className = '', 
  disabled = false 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      // Handle results
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        if (finalTranscript) {
          onResult(finalTranscript.trim());
          setIsListening(false);
          setTranscript('');
        }
      };

      // Handle errors
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
        
        let errorMessage = 'Voice recognition failed';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Voice recognition was cancelled.';
            break;
          default:
            errorMessage = `Voice recognition error: ${event.error}`;
        }
        
        if (onError) {
          onError(errorMessage);
        }
      };

      // Handle end of recognition
      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      // Handle start of recognition
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
          }
        }, 10000);
      };
    } else {
      setIsSupported(false);
      console.warn('Speech Recognition API not supported in this browser');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onResult, onError, isListening]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current || disabled) return;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      if (onError) {
        onError('Failed to start voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:ring-offset-2 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
        title={isListening ? 'Stop voice search' : 'Start voice search'}
        aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
      >
        {isListening ? (
          <div className="relative">
            <MicOff size={16} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        ) : (
          <Mic size={16} />
        )}
      </button>

      {/* Visual feedback for listening state */}
      {isListening && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50 animate-fadeSlideUp">
          <div className="flex items-center gap-2">
            <Volume2 size={12} className="animate-pulse" />
            <span>
              {transcript ? `"${transcript}"` : 'Listening...'}
            </span>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
        </div>
      )}

      {/* Audio wave animation when listening */}
      {isListening && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
          <div className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: '8px', animationDelay: '0ms' }}></div>
          <div className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: '12px', animationDelay: '150ms' }}></div>
          <div className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: '16px', animationDelay: '300ms' }}></div>
          <div className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: '12px', animationDelay: '450ms' }}></div>
          <div className="w-1 bg-red-500 rounded-full animate-pulse" style={{ height: '8px', animationDelay: '600ms' }}></div>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;