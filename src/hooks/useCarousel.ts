import { useState, useEffect, useCallback, useRef } from 'react';
import { clampIndex, computeDragSnapIndex } from '../utils/carouselMath';
import { soundManager } from '../utils/soundEffects';

export interface UseCarouselOptions {
  total: number;
  isDisabled?: boolean;
  onOpenActive?: () => void;
}

export function useCarousel({ total, isDisabled = false, onOpenActive }: UseCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapBounce, setSnapBounce] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const dragStartRef = useRef<{ x: number; time: number } | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const bounceTimeoutRef = useRef<number | null>(null);

  // Keep activeIndex within valid bounds when total changes (e.g. search filtering)
  useEffect(() => {
    setActiveIndex((prev) => clampIndex(prev, total));
  }, [total]);

  // Detect phone portrait & prefers-reduced-motion
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkViewport);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const triggerSnapFeedback = useCallback(() => {
    soundManager.playPageTick();
    setSnapBounce(true);
    if (bounceTimeoutRef.current) {
      window.clearTimeout(bounceTimeoutRef.current);
    }
    bounceTimeoutRef.current = window.setTimeout(() => {
      setSnapBounce(false);
    }, 240);
  }, []);

  const goToIndex = useCallback(
    (target: number) => {
      if (total <= 0) return;
      const nextIdx = clampIndex(target, total);
      setActiveIndex((prev) => {
        if (prev !== nextIdx) {
          triggerSnapFeedback();
        }
        return nextIdx;
      });
    },
    [total, triggerSnapFeedback]
  );

  const next = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  const prev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const first = useCallback(() => {
    goToIndex(0);
  }, [goToIndex]);

  const last = useCallback(() => {
    goToIndex(total - 1);
  }, [goToIndex, total]);

  // Keyboard navigation: ArrowLeft, ArrowRight, Home, End
  useEffect(() => {
    if (isDisabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        first();
      } else if (e.key === 'End') {
        e.preventDefault();
        last();
      } else if (e.key === 'Enter' && onOpenActive) {
        // Only trigger if focus is on the carousel listbox itself
        if (target?.getAttribute('role') === 'listbox') {
          e.preventDefault();
          onOpenActive();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDisabled, next, prev, first, last, onOpenActive]);

  // Wheel / Trackpad support
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isDisabled || total <= 1) return;
      const now = performance.now();
      if (now - lastWheelTimeRef.current < 220) return;

      const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(dominantDelta) < 18) return;

      lastWheelTimeRef.current = now;
      if (dominantDelta > 0) {
        next();
      } else {
        prev();
      }
    },
    [isDisabled, total, next, prev]
  );

  // Pointer drag / swipe with inertia
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isDisabled || e.button !== 0) return;
      dragStartRef.current = { x: e.clientX, time: performance.now() };
      setIsDragging(true);
      setDragOffsetPx(0);
    },
    [isDisabled]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      setDragOffsetPx(deltaX);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const deltaX = e.clientX - dragStartRef.current.x;
      const elapsedSec = Math.max(0.016, (performance.now() - dragStartRef.current.time) / 1000);
      const velocityX = deltaX / elapsedSec;

      dragStartRef.current = null;
      setIsDragging(false);
      setDragOffsetPx(0);

      // Only snap if user dragged meaningfully (> 16px)
      if (Math.abs(deltaX) > 16) {
        const snappedIndex = computeDragSnapIndex(activeIndex, deltaX, velocityX, total);
        goToIndex(snappedIndex);
      }
    },
    [isDragging, activeIndex, total, goToIndex]
  );

  return {
    activeIndex,
    setActiveIndex: goToIndex,
    next,
    prev,
    first,
    last,
    dragOffsetPx,
    isDragging,
    snapBounce,
    isMobile,
    prefersReducedMotion,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
