import React from 'react';

interface LoadingScreenProps {
  /** 
   * Color of the loading spinner 
   * @default '#E50914' (Netflix red)
   */
  spinnerColor?: string;
  /** 
   * Background color of the loading screen 
   * @default '#141414' (dark gray)
   */
  backgroundColor?: string;
  /** 
   * Text to display below the spinner 
   * @default 'Loading...'
   */
  text?: string;
  /** 
   * Color of the text 
   * @default 'text-gray-300'
   */
  textColor?: string;
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
  backgroundColor = '#141414',
  text = 'Loading...',
  textColor = 'text-gray-300',
  size = 64,
  thickness = 4,
  className = '',
}) => {
  return (
    <div 
      className={`min-h-screen flex items-center justify-center ${className}`}
      style={{ backgroundColor }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center">
        <div 
          className="animate-spin rounded-full"
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
          <p className={`mt-4 ${textColor}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;