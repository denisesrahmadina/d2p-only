import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AnimatedNavigationButtonProps {
  onClick: () => void | Promise<void>;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  showLoadingState?: boolean;
  ariaLabel?: string;
}

const AnimatedNavigationButton: React.FC<AnimatedNavigationButtonProps> = ({
  onClick,
  label = 'Go to APBA Overview',
  icon,
  variant = 'primary',
  size = 'lg',
  className = '',
  disabled = false,
  loading: externalLoading = false,
  showLoadingState = true,
  ariaLabel
}) => {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;
  const isDisabled = disabled || isLoading;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    }
  }, []);

  const getVariantClasses = () => {
    if (isDisabled) {
      return 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed border-gray-400 dark:border-gray-600';
    }

    switch (variant) {
      case 'primary':
        return isDarkMode
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-purple-500 hover:border-purple-400'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500 hover:border-blue-400';
      case 'secondary':
        return isDarkMode
          ? 'bg-slate-800/70 hover:bg-slate-700/80 text-purple-300 border-purple-700/50 hover:border-purple-600/60'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 hover:border-gray-400';
      case 'success':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500 hover:border-emerald-400';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm min-h-[36px]';
      case 'md':
        return 'px-6 py-3 text-base min-h-[44px]';
      case 'lg':
        return 'px-8 py-4 text-lg min-h-[52px]';
      default:
        return 'px-6 py-3 text-base min-h-[44px]';
    }
  };

  const handleClick = async () => {
    if (isDisabled) return;

    setIsPressed(true);

    if (showLoadingState) {
      setInternalLoading(true);
    }

    try {
      const result = onClick();
      if (result instanceof Promise) {
        await result;
      }

      setTimeout(() => {
        setIsPressed(false);
        if (showLoadingState) {
          setInternalLoading(false);
        }
      }, 150);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsPressed(false);
      setInternalLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isDisabled}
      aria-label={ariaLabel || label}
      aria-busy={isLoading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
        relative
        rounded-xl
        font-semibold
        shadow-lg
        border-2
        backdrop-blur-sm
        transition-all
        duration-300
        ease-out
        transform
        hover:scale-105
        hover:shadow-2xl
        active:scale-95
        focus:outline-none
        focus:ring-4
        focus:ring-purple-500/50
        dark:focus:ring-purple-400/50
        overflow-hidden
        group
        ${isPressed ? 'scale-95' : ''}
        ${isDisabled ? 'opacity-60 pointer-events-none' : ''}
      `}
      style={{
        willChange: 'transform, opacity',
        animation: isPressed ? 'pulse 0.3s ease-in-out' : 'none'
      }}
    >
      {/* Animated background gradient shimmer */}
      {!isDisabled && (
        <div
          className={`
            absolute inset-0
            bg-gradient-to-r from-white/0 via-white/20 to-white/0
            transform
            -skew-x-12
            transition-transform
            duration-700
            ease-out
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `}
        />
      )}

      {/* Button content */}
      <div className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <Loader2
            className="h-5 w-5 animate-spin"
            aria-hidden="true"
          />
        ) : icon ? (
          <span
            className={`
              transition-transform
              duration-300
              ease-out
              ${isHovered && !isDisabled ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}
            `}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}

        <span className="font-bold tracking-wide">
          {isLoading ? 'Loading...' : label}
        </span>

        {!isLoading && (
          <ArrowRight
            className={`
              h-5 w-5
              transition-all
              duration-300
              ease-out
              ${isHovered && !isDisabled ? 'translate-x-2 scale-110' : 'translate-x-0 scale-100'}
            `}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Ripple effect on click */}
      {isPressed && !isDisabled && (
        <span
          className="absolute inset-0 animate-ping opacity-75 rounded-xl bg-white/30 pointer-events-none"
          style={{ animationDuration: '0.5s' }}
          aria-hidden="true"
        />
      )}

      {/* Bottom glow effect */}
      {!isDisabled && (
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-1
            bg-gradient-to-r from-transparent via-white to-transparent
            opacity-0
            transition-opacity
            duration-300
            ${isHovered ? 'opacity-50' : 'opacity-0'}
          `}
          aria-hidden="true"
        />
      )}

      {/* Accessibility: Hidden loading announcement */}
      {isLoading && (
        <span className="sr-only">Loading, please wait</span>
      )}
    </button>
  );
};

export default AnimatedNavigationButton;
