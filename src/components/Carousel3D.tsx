import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DinoPage } from '../data/dinos';
import { computeCard3DTransform } from '../utils/carouselMath';
import { DinoCard } from './DinoCard';
import { DinoHero } from './DinoHero';

export interface Carousel3DProps {
  dinos: DinoPage[];
  activeIndex: number;
  isDetailOpen?: boolean;
  onSelectIndex: (index: number) => void;
  onOpenDetail: (dino: DinoPage) => void;
  onInspectSpecs?: (dino: DinoPage) => void;
  onPrev: () => void;
  onNext: () => void;
  dragOffsetPx: number;
  snapBounce: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  viewMode: 'book' | 'grid';
  onSwitchToBookAndSelect: (index: number) => void;
  onWheel: (e: React.WheelEvent) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onResetFilters: () => void;
}

export const Carousel3D: React.FC<Carousel3DProps> = ({
  dinos,
  activeIndex,
  isDetailOpen = false,
  onSelectIndex,
  onOpenDetail,
  onInspectSpecs,
  onPrev,
  onNext,
  dragOffsetPx,
  snapBounce,
  isMobile,
  prefersReducedMotion,
  viewMode,
  onSwitchToBookAndSelect,
  onWheel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onResetFilters,
}) => {
  if (dinos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-white/[0.06] border border-white/15 backdrop-blur-xl">
          <p className="text-lg font-semibold text-white">No matching dinosaurs found</p>
          <p className="text-sm text-white/65 mt-1.5">
            No pages in your journal match the current search or geological filter.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-white/90 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  // Thumbnail Grid View Mode
  if (viewMode === 'grid') {
    return (
      <div className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-8 py-6 overflow-y-auto">
        <div
          role="listbox"
          aria-label="Dinosaur Journal Thumbnail Grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-24"
        >
          {dinos.map((dino, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <div
                key={dino.id}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => onOpenDetail(dino)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenDetail(dino);
                  }
                }}
                className={`group relative aspect-[1.08/1] rounded-[16px] overflow-hidden card-inner-highlight cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isSelected ? 'ring-2 ring-white' : ''
                }`}
              >
                <DinoHero
                  dino={dino}
                  variant="grid"
                  prefersReducedMotion={prefersReducedMotion}
                />
                <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwitchToBookAndSelect(idx);
                    }}
                    className="pointer-events-auto glass-pill px-2.5 py-0.5 rounded-md text-[11px] font-mono text-white/90 hover:bg-white/25 tabular-nums cursor-pointer"
                    title="Focus in 3D Book View"
                  >
                    #{idx + 1}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(dino);
                    }}
                    className="pointer-events-auto glass-pill px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    {dino.externalUrl ? 'Visit Link ↗' : 'Open Page'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3D Cover-Flow Carousel Mode (Primary)
  return (
    <div
      className="relative flex-1 flex flex-col items-center justify-center w-full max-w-[1100px] mx-auto px-4 select-none overflow-visible"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 3D Perspective Stage */}
      <div
        role="listbox"
        aria-label="Dinosaur Journal Cover-Flow Pages"
        tabIndex={0}
        className="relative w-full h-[400px] sm:h-[460px] lg:h-[490px] flex items-center justify-center perspective-carousel focus:outline-none"
      >
        {dinos.map((dino, index) => {
          const offset = index - activeIndex;
          const transform3D = computeCard3DTransform(offset, isMobile);

          // Render only center ±7 cards for 60fps performance
          if (!transform3D.isVisible) {
            return null;
          }

          return (
            <DinoCard
              key={dino.id}
              dino={dino}
              index={index}
              transform3D={transform3D}
              isCenter={offset === 0}
              isDetailOpen={isDetailOpen}
              snapBounce={snapBounce}
              dragOffsetPx={dragOffsetPx}
              prefersReducedMotion={prefersReducedMotion}
              onSelectCard={onSelectIndex}
              onOpenDetail={onOpenDetail}
              onInspectSpecs={onInspectSpecs}
            />
          );
        })}

        {/* Left & Right Subtle Quick-Step Controls on Tablet/Desktop */}
        {!isDetailOpen && activeIndex > 0 && (
          <button
            type="button"
            aria-label="Previous Dinosaur Page"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="hidden sm:flex absolute left-1 lg:left-2 z-50 w-10 h-10 rounded-full glass-button items-center justify-center text-white/75 hover:text-white active:scale-92 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {!isDetailOpen && activeIndex < dinos.length - 1 && (
          <button
            type="button"
            aria-label="Next Dinosaur Page"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="hidden sm:flex absolute right-1 lg:right-2 z-50 w-10 h-10 rounded-full glass-button items-center justify-center text-white/75 hover:text-white active:scale-92 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Soft, Blurred Elliptical Floor Shadow Under the Card Stack */}
      <div
        aria-hidden="true"
        className="pointer-events-none w-[74%] max-w-[660px] h-10 sm:h-13 -mt-3 rounded-full bg-black/55 blur-2xl opacity-85"
      />
    </div>
  );
};
