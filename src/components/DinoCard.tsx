import React from 'react';
import { motion } from 'motion/react';
import type { DinoPage } from '../data/dinos';
import type { Card3DTransform } from '../utils/carouselMath';
import { DinoHero } from './DinoHero';

export interface DinoCardProps {
  dino: DinoPage;
  index: number;
  transform3D: Card3DTransform;
  isCenter: boolean;
  isDetailOpen?: boolean;
  snapBounce: boolean;
  dragOffsetPx: number;
  prefersReducedMotion: boolean;
  onSelectCard: (index: number) => void;
  onOpenDetail: (dino: DinoPage) => void;
  onInspectSpecs?: (dino: DinoPage) => void;
}

export const DinoCard: React.FC<DinoCardProps> = ({
  dino,
  index,
  transform3D,
  isCenter,
  isDetailOpen = false,
  snapBounce,
  dragOffsetPx,
  prefersReducedMotion,
  onSelectCard,
  onOpenDetail,
  onInspectSpecs,
}) => {
  const { offset, absOffset, rotateY, translateX, translateZ, scale, brightness, opacity, zIndex } =
    transform3D;

  // Apply live horizontal drag influence subtly to the 3D stack
  const dragXInfluence = isCenter ? dragOffsetPx * 0.45 : dragOffsetPx * 0.18;
  const dragRotateInfluence = isCenter ? Math.max(-18, Math.min(18, -dragOffsetPx * 0.06)) : 0;

  // Light haptic-style feedback on snap (1 -> 1.02 -> 1)
  const baseScale = isCenter && snapBounce ? scale * 1.02 : scale;

  // When a card is opened full-screen, non-center cards fade and recede
  const targetOpacity = isDetailOpen && !isCenter ? 0 : opacity;
  const targetZ = isDetailOpen && !isCenter ? translateZ - 220 : translateZ;
  const targetScale = isDetailOpen && !isCenter ? baseScale * 0.88 : baseScale;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCenter) {
      onOpenDetail(dino);
    } else {
      onSelectCard(index);
    }
  };

  return (
    <motion.div
      role="option"
      aria-selected={isCenter}
      aria-label={
        isCenter
          ? dino.externalUrl
            ? `${dino.name} (${dino.period}, ${dino.diet}) — Open ${dino.externalUrl}`
            : `${dino.name} (${dino.period}, ${dino.diet}) — Open full page`
          : `Go to page ${index + 1}: ${dino.name}`
      }
      tabIndex={isCenter ? 0 : -1}
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              x: translateX + 180,
              rotateY: rotateY - 25,
              scale: scale * 0.9,
            }
      }
      animate={{
        opacity: targetOpacity,
        x: translateX + dragXInfluence,
        z: targetZ,
        rotateY: rotateY + dragRotateInfluence,
        scale: targetScale,
        filter: `brightness(${brightness})`,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 220,
              damping: 28,
              mass: 0.9,
            }
      }
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isCenter) {
            onOpenDetail(dino);
          } else {
            onSelectCard(index);
          }
        }
      }}
      style={{
        zIndex,
        willChange: 'transform, opacity, filter',
        transformStyle: 'preserve-3d',
      }}
      className="absolute w-[72vw] max-w-[340px] aspect-[3/4] sm:w-[460px] sm:max-w-[520px] sm:aspect-[1.1/1] rounded-[16px] overflow-hidden card-inner-highlight select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
    >
      {/* Page Spine Highlight along folded edge for book-like realism */}
      {offset !== 0 && (
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 w-3 z-20 pointer-events-none ${
            offset < 0
              ? 'right-0 bg-gradient-to-l from-white/30 to-transparent'
              : 'left-0 bg-gradient-to-r from-white/30 to-transparent'
          }`}
        />
      )}

      {/* Hero Content: Full compact layout on center card, image slice on side cards */}
      <DinoHero
        dino={dino}
        variant={absOffset === 0 ? 'card' : 'slice'}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Top-right Page Badge & Specs Trigger on Center Card */}
      {isCenter && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {dino.externalUrl && onInspectSpecs && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspectSpecs(dino);
              }}
              className="glass-pill px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white/90 hover:text-white hover:bg-white/25 transition-colors cursor-pointer"
            >
              Specs
            </button>
          )}
          <span className="glass-pill px-2.5 py-1 rounded-lg text-[11px] font-mono text-white/90 tabular-nums pointer-events-none">
            Page {index + 1}
          </span>
        </div>
      )}
    </motion.div>
  );
};
