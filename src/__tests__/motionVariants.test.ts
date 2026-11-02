import { describe, it, expect } from 'vitest';
import {
  luxuryEase,
  gentleEase,
  pageTransitionVariants,
  fadeInVariants,
  fadeInUpVariants,
  fadeInDownVariants,
  staggerContainerVariants,
  staggerItemVariants,
  modalVariants,
  imageRevealVariants,
  reducedMotionVariants,
} from '../components/animations/motionVariants';

describe('Luxury Motion Design System', () => {
  it('defines refined luxury easing curves', () => {
    expect(luxuryEase).toEqual([0.22, 1, 0.36, 1]);
    expect(gentleEase).toEqual([0.16, 1, 0.3, 1]);
  });

  it('provides complete page transition variants with subtle vertical displacement', () => {
    expect(pageTransitionVariants).toBeDefined();
    expect(pageTransitionVariants.initial).toEqual({ opacity: 0, y: 14 });
    expect(pageTransitionVariants.animate).toMatchObject({
      opacity: 1,
      y: 0,
    });
    expect(pageTransitionVariants.exit).toEqual({
      opacity: 0,
      y: -8,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1],
      },
    });
  });

  it('properly configures stagger container variants', () => {
    expect(staggerContainerVariants).toBeDefined();
    expect(staggerContainerVariants.hidden).toEqual({ opacity: 0 });
    const visibleVariant = typeof staggerContainerVariants.visible === 'function'
      ? staggerContainerVariants.visible({ staggerChildren: 0.12, delayChildren: 0.05 })
      : staggerContainerVariants.visible;

    expect(visibleVariant).toMatchObject({
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    });
  });

  it('properly configures stagger item variants with subtle lift', () => {
    expect(staggerItemVariants.hidden).toEqual({ opacity: 0, y: 22 });
    const itemVisible = typeof staggerItemVariants.visible === 'function'
      ? staggerItemVariants.visible({ duration: 0.55 })
      : staggerItemVariants.visible;
    expect(itemVisible).toMatchObject({
      opacity: 1,
      y: 0,
    });
  });

  it('provides accessible reduced-motion fallback variants', () => {
    expect(reducedMotionVariants.hidden).toEqual({ opacity: 0 });
    expect(reducedMotionVariants.visible).toEqual({
      opacity: 1,
      transition: { duration: 0.01 },
    });
  });
});
