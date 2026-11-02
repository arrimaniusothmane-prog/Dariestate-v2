import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { gentleEase } from './motionVariants';

export interface ImageRevealProps {
  src: string;
  alt?: string;
  aspectRatio?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt = '',
  aspectRatio,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-ivory-200 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Subtle Shimmer Skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-ivory-200 via-white/50 to-ivory-200 animate-pulse" />
      )}

      {shouldReduceMotion ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.8, ease: gentleEase }}
          className={`w-full h-full object-cover ${className}`}
        />
      )}
    </div>
  );
};
