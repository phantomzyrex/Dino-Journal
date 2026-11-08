import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Compass,
  Gauge,
  Scale,
  Ruler,
  Clock,
  MapPin,
} from 'lucide-react';
import type { DinoPage } from '../data/dinos';
import { DinoHero, DinosaurCutoutArtwork } from './DinoHero';

export interface DetailViewProps {
  dino: DinoPage;
  activeIndex: number;
  totalCount: number;
  prefersReducedMotion: boolean;
  onClose: () => void;
  onPrevDino: () => void;
  onNextDino: () => void;
}

const GEOLOGICAL_ERAS = [
  {
    period: 'Triassic' as const,
    range: '252 – 201 MYA',
    epochs: ['Early Triassic', 'Middle Triassic', 'Late Triassic (Carnian / Norian)'],
    summary:
      'Pangaea supercontinent climate; emergence of the earliest agile dinosauromorphs and theropods.',
  },
  {
    period: 'Jurassic' as const,
    range: '201 – 145 MYA',
    epochs: ['Early Jurassic', 'Middle Jurassic', 'Late Jurassic (Kimmeridgian / Tithonian)'],
    summary:
      'Breakup of Pangaea creates humid conifer corridors dominated by colossal sauropods and plated thyreophorans.',
  },
  {
    period: 'Cretaceous' as const,
    range: '145 – 66 MYA',
    epochs: ['Early Cretaceous', 'Cenomanian / Campanian', 'Late Maastrichtian'],
    summary:
      'High sea levels and flowering plants foster horned ceratopsians, crested hadrosaurs, and giant tyrannosaurids.',
  },
];

/**
 * Animated numeric counter for Quick Facts section.
 */
const AnimatedStatCounter: React.FC<{
  target: number;
  suffix: string;
  decimals?: number;
  prefersReducedMotion: boolean;
}> = ({ target, suffix, decimals = 1, prefersReducedMotion }) => {
  const [val, setVal] = useState(prefersReducedMotion ? target : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVal(target);
      return;
    }
    let frameId: number;
    const duration = 750;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, prefersReducedMotion]);

  return (
    <span>
      {decimals === 0 ? Math.round(val) : val.toFixed(decimals)} {suffix}
    </span>
  );
};

export const DetailView: React.FC<DetailViewProps> = ({
  dino,
  activeIndex,
  totalCount,
  prefersReducedMotion,
  onClose,
  onPrevDino,
  onNextDino,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const quickFactsRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<HTMLElement | null>(null);
  const scaleRef = useRef<HTMLElement | null>(null);
  const habitatRef = useRef<HTMLElement | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const [habitatTilt, setHabitatTilt] = useState({ x: 0, y: 0 });

  const scrollToSection = useCallback(
    (ref: React.RefObject<HTMLElement | null>) => {
      ref.current?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion]
  );

  // Horizontal swipe left/right inside the opened view switches to previous/next dinosaur
  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!swipeStartRef.current) return;
    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;
    swipeStartRef.current = null;

    if (Math.abs(dx) > 95 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      if (dx < 0 && activeIndex < totalCount - 1) {
        onNextDino();
      } else if (dx > 0 && activeIndex > 0) {
        onPrevDino();
      }
    }
  };

  const handleHabitatPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setHabitatTilt({
      x: Math.max(-14, Math.min(14, nx * 14)),
      y: Math.max(-14, Math.min(14, ny * 14)),
    });
  };

  // Max references for animated stat bars
  const lengthPct = Math.min(100, Math.round((dino.lengthMeters / 28) * 100));
  const weightPct = Math.min(100, Math.round((dino.weightTons / 60) * 100));
  const speedPct = Math.min(100, Math.round((dino.speedKmh / 110) * 100));

  // SVG Size Comparison scale math (dynamic vertical ceiling: 6m for standard dinos, 15m for tall sauropods)
  const scaleMaxMeters = Math.max(16, Math.ceil(dino.lengthMeters + 4));
  const maxGridHeightM = dino.heightMeters > 5.5 ? 15 : 6;
  const gridSteps = dino.heightMeters > 5.5 ? [3, 6, 9, 12, 15] : [1, 2, 3, 4, 5];
  const chartPixelHeight = 265;
  const humanHeightM = 1.8;
  const busLengthM = 12.0;
  const busHeightM = 3.2;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${dino.name} Full-Screen Experience`}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 z-50 bg-[#14182B] text-white flex flex-col overflow-hidden"
    >
      {/* Floating Top Navigation Overlay ("Back to Journal" + Section Jump + Prev/Next Switcher) */}
      <div className="fixed top-4 inset-x-0 z-50 max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-2 pointer-events-none">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto glass-pill px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white hover:bg-white/20 active:scale-95 transition-all flex items-center gap-2 shadow-xl cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>

        {/* Quick Section Anchor Pills on Desktop */}
        <div className="hidden lg:flex pointer-events-auto items-center gap-1 p-1 rounded-full glass-pill">
          {[
            { label: '01 Hero', ref: heroRef },
            { label: '02 Facts', ref: quickFactsRef },
            { label: '03 Timeline', ref: timelineRef },
            { label: '04 Scale', ref: scaleRef },
            { label: '05 Habitat', ref: habitatRef },
          ].map((sec) => (
            <button
              key={sec.label}
              type="button"
              onClick={() => scrollToSection(sec.ref)}
              className="px-3 py-1 rounded-full text-xs font-medium text-white/75 hover:text-white hover:bg-white/12 transition-colors cursor-pointer whitespace-nowrap"
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous Dinosaur in Journal"
            disabled={activeIndex <= 0}
            onClick={onPrevDino}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-pill flex items-center justify-center text-white/85 hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-white/90 tabular-nums whitespace-nowrap">
            {activeIndex + 1} / {totalCount}
          </span>
          <button
            type="button"
            aria-label="Next Dinosaur in Journal"
            disabled={activeIndex >= totalCount - 1}
            onClick={onNextDino}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-pill flex items-center justify-center text-white/85 hover:text-white disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Vertically Scrolling Snap Container */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {/* SECTION 1: FULL-SCREEN PARALLAX HERO */}
        <section
          ref={heroRef}
          aria-label="1. Dinosaur Hero Overview"
          className="relative w-full h-screen min-h-[600px] snap-start shrink-0"
        >
          <DinoHero
            dino={dino}
            variant="fullscreen"
            prefersReducedMotion={prefersReducedMotion}
            onExploreClick={() => scrollToSection(quickFactsRef)}
          />
        </section>

        {/* SECTION 2: QUICK FACTS & ANIMATED STAT COUNTERS / BARS */}
        <section
          ref={quickFactsRef}
          aria-label="2. Quick Facts and Biomechanical Metrics"
          className="relative w-full min-h-screen snap-start flex items-center justify-center px-6 sm:px-12 py-20 bg-[#171C33] border-t border-white/10"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10">
              <div>
                <span
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: dino.theme.secondaryHex }}
                >
                  02 · Biomechanical Telemetry
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                  Quick Facts & Anatomical Specs
                </h3>
              </div>
              <p className="text-sm text-white/65 max-w-md">{dino.shortDescription}</p>
            </div>

            {/* Animated Stat Counters & Bars Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
              {/* Length Bar Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <Ruler className="w-4 h-4 shrink-0" style={{ color: dino.theme.accentHex }} />
                      Total Body Length
                    </span>
                    <span className="font-mono whitespace-nowrap">Max ~28m</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-white mt-3 tabular-nums">
                    <AnimatedStatCounter
                      target={dino.lengthMeters}
                      suffix="m"
                      decimals={1}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  </div>
                  <p className="text-xs text-white/55 mt-1">
                    Estimated hip/head height: {dino.heightMeters} m
                  </p>
                </div>

                <div className="mt-6">
                  <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lengthPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dino.theme.accentHex }}
                    />
                  </div>
                </div>
              </div>

              {/* Weight Bar Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <Scale className="w-4 h-4 shrink-0" style={{ color: dino.theme.accentHex }} />
                      Estimated Body Mass
                    </span>
                    <span className="font-mono whitespace-nowrap">Max ~60t</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-white mt-3 tabular-nums">
                    {dino.weightTons < 1 ? (
                      <AnimatedStatCounter
                        target={Math.round(dino.weightTons * 1000)}
                        suffix="kg"
                        decimals={0}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    ) : (
                      <AnimatedStatCounter
                        target={dino.weightTons}
                        suffix="t"
                        decimals={1}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    )}
                  </div>
                  <p className="text-xs text-white/55 mt-1">Primary trophic guild: {dino.diet}</p>
                </div>

                <div className="mt-6">
                  <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(6, weightPct)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dino.theme.secondaryHex }}
                    />
                  </div>
                </div>
              </div>

              {/* Speed Bar Card */}
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <Gauge className="w-4 h-4 shrink-0" style={{ color: dino.theme.accentHex }} />
                      Peak Sprint Speed
                    </span>
                    <span className="font-mono whitespace-nowrap">Max ~110 km/h</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-white mt-3 tabular-nums">
                    <AnimatedStatCounter
                      target={dino.speedKmh}
                      suffix="km/h"
                      decimals={0}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  </div>
                  <p className="text-xs text-white/55 mt-1">
                    {dino.biteForceN
                      ? `Estimated bite force: ${dino.biteForceN}`
                      : `Discovered in ${dino.discoveryYear}`}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${speedPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: dino.theme.dinoHighlightHex }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Curated Field Notes Strip */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {dino.fieldNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 text-sm text-white/80 leading-relaxed"
                >
                  <span
                    className="font-mono text-xs font-semibold block mb-1.5"
                    style={{ color: dino.theme.secondaryHex }}
                  >
                    NOTE 0{idx + 1}
                  </span>
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: HORIZONTAL GEOLOGICAL TIMELINE STRIP */}
        <section
          ref={timelineRef}
          aria-label="3. Geological Era Timeline"
          className="relative w-full min-h-screen snap-start flex items-center justify-center px-6 sm:px-12 py-20 bg-[#13172B] border-t border-white/10"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="mb-10">
              <span
                className="text-xs font-mono uppercase tracking-widest flex items-center gap-2"
                style={{ color: dino.theme.secondaryHex }}
              >
                <Clock className="w-3.5 h-3.5" />
                03 · Mesozoic Stratigraphy (252 – 66 MYA)
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                Geological Timeline Position
              </h3>
              <p className="text-sm text-white/65 mt-1">
                {dino.name} thrived during the <strong className="text-white">{dino.subEpoch}</strong>{' '}
                epoch of the <strong className="text-white">{dino.period} Period</strong> (
                {dino.eraRangeMya}).
              </p>
            </div>

            {/* Horizontal Era Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {GEOLOGICAL_ERAS.map((era) => {
                const isActiveEra = era.period === dino.period;
                return (
                  <div
                    key={era.period}
                    className={`relative p-6 rounded-2xl transition-all border ${
                      isActiveEra
                        ? 'bg-white/[0.09] border-white/40 shadow-2xl'
                        : 'bg-white/[0.03] border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-white/70">
                        {era.range}
                      </span>
                      {isActiveEra && (
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase text-slate-950"
                          style={{ backgroundColor: dino.theme.secondaryHex }}
                        >
                          Active Era · {dino.eraRangeMya}
                        </span>
                      )}
                    </div>

                    <h4 className="text-2xl font-bold text-white mt-2">{era.period} Period</h4>
                    <p className="text-xs text-white/70 leading-relaxed mt-2">{era.summary}</p>

                    <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5">
                      {era.epochs.map((ep) => (
                        <div
                          key={ep}
                          className="text-xs font-mono text-white/65 flex items-center justify-between"
                        >
                          <span>{ep}</span>
                          {isActiveEra &&
                            ep.includes(dino.subEpoch.split(' ')[1] || dino.subEpoch) && (
                              <span style={{ color: dino.theme.secondaryHex }}>
                                ● Specimen Stratum
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Linear Million-Years-Ago Ruler */}
            <div className="mt-10 p-6 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="flex justify-between text-xs font-mono text-white/55 mb-2">
                <span>252 MYA (Permian–Triassic Boundary)</span>
                <span>150 MYA</span>
                <span>66 MYA (K–Pg Extinction)</span>
              </div>
              <div className="relative h-4 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 w-4 rounded-full shadow-lg"
                  style={{
                    left: `${Math.max(4, Math.min(94, ((252 - dino.myaMidpoint) / (252 - 66)) * 100))}%`,
                    backgroundColor: dino.theme.accentHex,
                  }}
                />
              </div>
              <div className="mt-2 text-right text-xs font-mono text-white/80">
                Stratum Marker: ~{dino.myaMidpoint} Million Years Ago
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SVG SIZE COMPARISON (DINOSAUR VS HUMAN & CITY BUS) */}
        <section
          ref={scaleRef}
          aria-label="4. Size Comparison Diagram"
          className="relative w-full min-h-screen snap-start flex items-center justify-center px-6 sm:px-12 py-20 bg-[#171C33] border-t border-white/10"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="mb-8">
              <span
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: dino.theme.secondaryHex }}
              >
                04 · Comparative Morphometrics
              </span>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                Scale Comparison: {dino.name} vs. Human & Transit Bus
              </h3>
              <p className="text-sm text-white/65 mt-1">
                Rendered on a calibrated metric grid comparing {dino.name} ({dino.lengthLabel}{' '}
                length, {dino.heightMeters} m height) against an adult human (1.8 m) and a standard
                city bus (12.0 m).
              </p>
            </div>

            {/* Calibrated SVG Scale Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#101426] border border-white/15 overflow-hidden">
              <div className="relative w-full h-[300px] sm:h-[340px] flex items-end border-b-2 border-white/30 pb-1">
                {/* Horizontal Meter Grid Lines */}
                {gridSteps.map((meter) => (
                  <div
                    key={meter}
                    className="absolute inset-x-0 border-t border-dashed border-white/10 flex items-center"
                    style={{ bottom: `${(meter / maxGridHeightM) * 85}%` }}
                  >
                    <span className="text-[10px] font-mono text-white/40 pl-2 -mt-4">
                      {meter}m
                    </span>
                  </div>
                ))}

                <div className="relative z-10 w-full h-full flex items-end justify-around gap-4 px-4">
                  {/* 1. Human Silhouette (1.8m) */}
                  <div className="flex flex-col items-center">
                    <svg
                      viewBox="0 0 60 180"
                      className="w-10 sm:w-14 text-white/85"
                      style={{
                        height: `${Math.max(24, (humanHeightM / maxGridHeightM) * chartPixelHeight)}px`,
                      }}
                      aria-label="Adult human 1.8m silhouette"
                    >
                      <circle cx="30" cy="20" r="14" fill="currentColor" />
                      <path
                        d="M14 42 C14 38 46 38 46 42 L50 105 L40 105 L38 62 L35 178 L22 178 L22 112 L18 112 L10 105 Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-[11px] font-mono text-white/75 mt-2">
                      Human (1.8 m)
                    </span>
                  </div>

                  {/* 2. Dinosaur Silhouette */}
                  <div className="flex flex-col items-center flex-1 max-w-[480px]">
                    <div
                      className="w-full flex items-end justify-center"
                      style={{
                        height: `${Math.min(285, Math.max(76, (dino.heightMeters / maxGridHeightM) * chartPixelHeight))}px`,
                      }}
                    >
                      <DinosaurCutoutArtwork dino={dino} className="w-full h-full" />
                    </div>
                    <span
                      className="text-xs font-mono font-semibold mt-2"
                      style={{ color: dino.theme.secondaryHex }}
                    >
                      {dino.name} ({dino.lengthLabel} × {dino.heightMeters} m)
                    </span>
                  </div>

                  {/* 3. Standard City Bus Silhouette (12m x 3.2m) */}
                  <div className="flex flex-col items-center">
                    <svg
                      viewBox="0 0 360 110"
                      className="w-44 sm:w-64 text-white/35"
                      style={{
                        height: `${Math.max(52, (busHeightM / maxGridHeightM) * chartPixelHeight)}px`,
                      }}
                      aria-label="Standard city bus 12m silhouette"
                    >
                      <rect x="6" y="10" width="348" height="80" rx="14" fill="currentColor" />
                      <rect x="24" y="24" width="60" height="34" rx="4" fill="#101426" />
                      <rect x="96" y="24" width="60" height="34" rx="4" fill="#101426" />
                      <rect x="168" y="24" width="60" height="34" rx="4" fill="#101426" />
                      <rect x="240" y="24" width="60" height="34" rx="4" fill="#101426" />
                      <rect x="312" y="22" width="32" height="44" rx="4" fill="#101426" />
                      <circle cx="78" cy="92" r="16" fill="#FFFFFF" opacity="0.5" />
                      <circle cx="282" cy="92" r="16" fill="#FFFFFF" opacity="0.5" />
                    </svg>
                    <span className="text-[11px] font-mono text-white/65 mt-2">
                      City Bus ({busLengthM} m × {busHeightM} m)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: PALEO-HABITAT PARALLAX SCENE & PROVENANCE */}
        <section
          ref={habitatRef}
          onPointerMove={handleHabitatPointerMove}
          onPointerLeave={() => setHabitatTilt({ x: 0, y: 0 })}
          aria-label="5. Paleo-Habitat and Fossil Provenance"
          className="relative w-full min-h-screen snap-start flex items-center justify-center px-6 sm:px-12 py-20 overflow-hidden border-t border-white/10"
          style={{ background: dino.theme.skyGradient }}
        >
          {/* Interactive Parallax Habitat Background Layers */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out"
            style={{
              transform: prefersReducedMotion
                ? undefined
                : `translate3d(${-habitatTilt.x * 0.6}px, ${-habitatTilt.y * 0.5}px, 0) scale(1.05)`,
            }}
          >
            <svg
              viewBox="0 0 1200 500"
              preserveAspectRatio="none"
              className="absolute bottom-0 inset-x-0 w-full h-3/4 opacity-45"
            >
              <path
                d="M0 360 L180 210 L390 310 L620 175 L880 295 L1060 190 L1200 280 L1200 500 L0 500 Z"
                fill={dino.theme.dinoPrimaryHex}
              />
              <path
                d="M0 410 L260 280 L510 370 L790 250 L1020 350 L1200 290 L1200 500 L0 500 Z"
                fill="#070A12"
                opacity="0.78"
              />
            </svg>
          </div>

          <div className="absolute inset-0 bg-black/38 pointer-events-none" />

          <div
            className="relative z-10 w-full max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#14182B]/85 backdrop-blur-xl border border-white/20 shadow-2xl transition-transform duration-200 ease-out"
            style={{
              transform: prefersReducedMotion
                ? undefined
                : `translate3d(${habitatTilt.x * 0.45}px, ${habitatTilt.y * 0.45}px, 0)`,
            }}
          >
            <span
              className="text-xs font-mono uppercase tracking-widest flex items-center gap-2"
              style={{ color: dino.theme.secondaryHex }}
            >
              <Compass className="w-4 h-4" />
              05 · Paleo-Ecology & Fossil Provenance
            </span>

            <h3 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              {dino.habitatTitle}
            </h3>

            <p className="text-base sm:text-lg text-white/85 leading-relaxed mt-4">
              {dino.habitatDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15">
              <div>
                <div className="text-xs font-mono uppercase text-white/55 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Type Locality
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {dino.discoveryLocation}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-white/55">First Described</div>
                <div className="text-sm font-mono font-semibold text-white mt-1 tabular-nums">
                  {dino.discoveryYear} CE
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-white/55">Binomial Taxon</div>
                <div className="text-sm italic font-medium text-white mt-1">
                  {dino.scientificName}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-white/90 transition-colors cursor-pointer"
              >
                Return to 3D Cover-Flow
              </button>

              <div className="flex items-center gap-2 text-xs text-white/70">
                <span>Swipe or use</span>
                <button
                  type="button"
                  disabled={activeIndex <= 0}
                  onClick={onPrevDino}
                  className="underline hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <span>/</span>
                <button
                  type="button"
                  disabled={activeIndex >= totalCount - 1}
                  onClick={onNextDino}
                  className="underline hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  Next Page
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
