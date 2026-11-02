import { Variants } from 'framer-motion';

// Luxury editorial cubic bezier: gentle acceleration, extended graceful deceleration
export const luxuryEase = [0.22, 1, 0.36, 1] as const;
export const gentleEase = [0.16, 1, 0.3, 1] as const;

export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 14,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: luxuryEase,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      duration: custom.duration ?? 0.5,
      delay: custom.delay ?? 0,
      ease: luxuryEase,
    },
  }),
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration ?? 0.65,
      delay: custom.delay ?? 0,
      ease: luxuryEase,
    },
  }),
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration ?? 0.55,
      delay: custom.delay ?? 0,
      ease: luxuryEase,
    },
  }),
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration ?? 0.6,
      delay: custom.delay ?? 0,
      ease: luxuryEase,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerChildren ?? 0.09,
      delayChildren: custom.delayChildren ?? 0.05,
    },
  }),
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: luxuryEase,
    },
  },
};

export const imageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(4px)',
  },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: custom.duration ?? 0.9,
      delay: custom.delay ?? 0,
      ease: gentleEase,
    },
  }),
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: luxuryEase,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

