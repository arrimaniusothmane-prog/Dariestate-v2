import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageTransitionVariants, luxuryEase } from './motionVariants';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  scrollToTop?: boolean;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  scrollToTop = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (scrollToTop && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [scrollToTop]);

  if (shouldReduceMotion) {
    return (
      <div className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
      transition={{ duration: 0.4, ease: luxuryEase }}
    >
      {children}
    </motion.div>
  );
};
