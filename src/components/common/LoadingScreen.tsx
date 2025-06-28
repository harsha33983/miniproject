import React from 'react';

interface LoadingScreenProps {
  /** 
   * Color of the loading spinner 
   * @default '#E50914' (Netflix red)
   */
  spinnerColor?: string;
  /** 
   * Text to display below the spinner 
   * @default 'Loading...'
   */
  text?: string;
  /** 
   * Size of the spinner (in pixels) 
   * @default 64
   */
  size?: number;
  /** 
   * Thickness of the spinner (in pixels) 
   * @default 4
   */
  thickness?: number;
  /** 
   * Additional CSS classes for the container 
   */
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  spinnerColor = '#E50914',
  text = 'Loading...',
  size = 64,
  thickness = 4,
  className = '',
}) => {
  return (
    <div 
      className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#141414] transition-colors duration-500 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center">
        <div 
          className="animate-spin rounded-full border-gray-200 dark:border-gray-700 transition-colors duration-300"
          style={{
            width: size,
            height: size,
            borderWidth: thickness,
            borderTopColor: spinnerColor,
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
          }}
        />
        {text && (
          <p className="mt-4 text-gray-600 dark:text-gray-300 transition-colors duration-300 font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;