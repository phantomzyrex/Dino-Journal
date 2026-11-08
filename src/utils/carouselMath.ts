import type { DinoDiet, DinoPage, DinoPeriod } from '../data/dinos';

export type SortOption = 'journal' | 'name' | 'period' | 'length-desc' | 'weight-desc';

export interface Card3DTransform {
  offset: number;
  absOffset: number;
  isVisible: boolean;
  rotateY: number;
  translateX: number;
  translateZ: number;
  scale: number;
  brightness: number;
  opacity: number;
  zIndex: number;
}

/**
 * Computes the exact 3D cover-flow transform for a card at `offset = cardIndex - activeIndex`.
 * Matches the specification:
 * - Center card (offset = 0): scale 1, rotateY(0), translateX(0), translateZ(0)
 * - Side cards (offset = n):
 *   rotateY(±55° on tablet/desktop, ±60° on phone portrait; left +55°, right -55°)
 *   translateX(sign(n) * 190px + n * 38px) (scaled proportionally for phone portrait)
 *   translateZ(-|n| * 90px)
 *   scale(1 - |n| * 0.04)
 * - Render window: center ±7 cards
 */
export function computeCard3DTransform(offset: number, isMobile = false): Card3DTransform {
  const absOffset = Math.abs(offset);
  const isVisible = absOffset <= 7;

  if (offset === 0) {
    return {
      offset: 0,
      absOffset: 0,
      isVisible: true,
      rotateY: 0,
      translateX: 0,
      translateZ: 0,
      scale: 1,
      brightness: 1,
      opacity: 1,
      zIndex: 50,
    };
  }

  const sign = Math.sign(offset);
  const baseAngle = isMobile ? 60 : 55;
  // Left cards (offset < 0) rotate +55°, right cards (offset > 0) rotate -55°
  const rotateY = sign < 0 ? baseAngle : -baseAngle;

  const baseSpread = isMobile ? 118 : 190;
  const stepSpread = isMobile ? 24 : 38;
  const translateX = sign * baseSpread + offset * stepSpread;

  const translateZ = -absOffset * 90;
  const scale = Math.max(0.65, Number((1 - absOffset * 0.04).toFixed(4)));
  const brightness = Math.max(0.38, Number((0.75 - (absOffset - 1) * 0.055).toFixed(4)));
  const opacity = absOffset > 7 ? 0 : absOffset === 7 ? 0.55 : 1;
  const zIndex = Math.max(1, 50 - absOffset);

  return {
    offset,
    absOffset,
    isVisible,
    rotateY,
    translateX,
    translateZ,
    scale,
    brightness,
    opacity,
    zIndex,
  };
}

/**
 * Clamps a page index safely within [0, max - 1].
 */
export function clampIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(total - 1, Math.round(index)));
}

/**
 * Computes the target snapped index after a horizontal drag gesture with inertia.
 */
export function computeDragSnapIndex(
  currentIndex: number,
  dragDeltaX: number,
  velocityX: number,
  total: number
): number {
  if (total <= 0) return 0;
  // Dragging left (negative deltaX) advances to positive index offsets
  const projectedOffsetPx = -(dragDeltaX + velocityX * 0.18);
  const stepThresholdPx = 85;
  const indexDelta = Math.round(projectedOffsetPx / stepThresholdPx);
  return clampIndex(currentIndex + indexDelta, total);
}

const PERIOD_CHRONOLOGY: Record<DinoPeriod, number> = {
  Triassic: 1,
  Jurassic: 2,
  Cretaceous: 3,
};

/**
 * Filters and sorts the dinosaur journal pages by query, period, diet, and sort order.
 */
export function filterAndSortDinos(
  dinos: DinoPage[],
  searchQuery: string,
  periodFilter: DinoPeriod | 'All',
  dietFilter: DinoDiet | 'All',
  sortBy: SortOption
): DinoPage[] {
  const q = searchQuery.trim().toLowerCase();

  const filtered = dinos.filter((dino) => {
    if (periodFilter !== 'All' && dino.period !== periodFilter) {
      return false;
    }
    if (dietFilter !== 'All' && dino.diet !== dietFilter) {
      return false;
    }
    if (!q) return true;
    return (
      dino.name.toLowerCase().includes(q) ||
      dino.nickname.toLowerCase().includes(q) ||
      dino.scientificName.toLowerCase().includes(q) ||
      dino.period.toLowerCase().includes(q) ||
      dino.diet.toLowerCase().includes(q) ||
      dino.catalogNumber.toLowerCase().includes(q)
    );
  });

  if (sortBy === 'journal') {
    return filtered;
  }

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'period':
        return (
          PERIOD_CHRONOLOGY[a.period] - PERIOD_CHRONOLOGY[b.period] ||
          b.myaMidpoint - a.myaMidpoint
        );
      case 'length-desc':
        return b.lengthMeters - a.lengthMeters;
      case 'weight-desc':
        return b.weightTons - a.weightTons;
      default:
        return 0;
    }
  });
}

export interface NewDinoFormInput {
  name: string;
  nickname: string;
  period: DinoPeriod;
  diet: DinoDiet;
  lengthMeters: string;
  weightTons: string;
  speedKmh: string;
  shortDescription: string;
  themeId: string;
  imageUrl?: string;
  externalUrl?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof NewDinoFormInput, string>>;
}

/**
 * Validates user input for creating a new dinosaur page.
 * Never silently substitutes fallback values when required fields are empty or invalid.
 */
export function validateNewDinoInput(input: NewDinoFormInput): ValidationResult {
  const errors: Partial<Record<keyof NewDinoFormInput, string>> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please enter a dinosaur name (at least 2 characters).';
  }
  if (!input.nickname || input.nickname.trim().length < 2) {
    errors.nickname = 'Please enter a descriptive title or nickname.';
  }
  const lengthVal = Number(input.lengthMeters);
  if (!input.lengthMeters.trim() || Number.isNaN(lengthVal) || lengthVal <= 0 || lengthVal > 60) {
    errors.lengthMeters = 'Enter a valid length between 0.1 and 60 meters.';
  }
  const weightVal = Number(input.weightTons);
  if (!input.weightTons.trim() || Number.isNaN(weightVal) || weightVal <= 0 || weightVal > 120) {
    errors.weightTons = 'Enter a valid weight between 0.001 and 120 tons.';
  }
  const speedVal = Number(input.speedKmh);
  if (!input.speedKmh.trim() || Number.isNaN(speedVal) || speedVal <= 0 || speedVal > 160) {
    errors.speedKmh = 'Enter a valid top speed between 1 and 160 km/h.';
  }
  if (!input.shortDescription || input.shortDescription.trim().length < 10) {
    errors.shortDescription = 'Please write a short paleontological summary (min 10 chars).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
