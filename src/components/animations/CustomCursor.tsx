import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Mouse positions
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing outer ring
  const springConfig = { damping: 26, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on precise pointer devices (desktops/laptops with a mouse/trackpad)
    if (typeof window === 'undefined') return;

    const hasTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (hasTouch || shouldReduceMotion) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Check if hovering over clickable / interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-hover], .cursor-pointer'
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible, shouldReduceMotion]);

  if (isTouchDevice || shouldReduceMotion || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Central pinpoint bronze dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-bronze mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 6 : 5,
          height: isHovered ? 6 : 5,
          opacity: 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing smooth luxury ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border border-bronze/60"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 42 : 26,
          height: isHovered ? 42 : 26,
          backgroundColor: isHovered ? 'rgba(167, 128, 88, 0.08)' : 'transparent',
          borderColor: isHovered ? 'rgba(167, 128, 88, 0.85)' : 'rgba(167, 128, 88, 0.45)',
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
};
