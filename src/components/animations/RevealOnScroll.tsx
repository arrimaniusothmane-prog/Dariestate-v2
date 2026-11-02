import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { luxuryEase } from './motionVariants';

export interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  delay?: number;
  duration?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  className = '',
  viewportMargin = '-60px',
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 28 };
      case 'down':
        return { opacity: 0, y: -24 };
      case 'left':
        return { opacity: 0, x: -28 };
      case 'right':
        return { opacity: 0, x: 28 };
      case 'scale':
        return { opacity: 0, scale: 0.95 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  const getTarget = () => {
    switch (direction) {
      case 'scale':
        return { opacity: 1, scale: 1 };
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'fade':
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getTarget()}
      viewport={{ once, margin: viewportMargin }}
      transition={{
        duration,
        delay,
        ease: luxuryEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
