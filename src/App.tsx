import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { INITIAL_DINOS, type DinoDiet, type DinoPage, type DinoPeriod } from './data/dinos';
import { filterAndSortDinos, type SortOption } from './utils/carouselMath';
import { useCarousel } from './hooks/useCarousel';
import { soundManager } from './utils/soundEffects';
import { TopBar } from './components/TopBar';
import { Carousel3D } from './components/Carousel3D';
import { ActionBar } from './components/ActionBar';
import { DetailView } from './components/DetailView';
import { AddDinoModal } from './components/AddDinoModal';

export default function App() {
  const [dinos, setDinos] = useState<DinoPage[]>(INITIAL_DINOS);
  const [journalTitle, setJournalTitle] = useState('Dinosaur Wiki');
  const [viewMode, setViewMode] = useState<'book' | 'grid'>('book');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<DinoPeriod | 'All'>('All');
  const [dietFilter, setDietFilter] = useState<DinoDiet | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('journal');
  const [openedDinoId, setOpenedDinoId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotionOverride, setReducedMotionOverride] = useState(false);

  const filteredDinos = useMemo(
    () => filterAndSortDinos(dinos, searchQuery, periodFilter, dietFilter, sortBy),
    [dinos, searchQuery, periodFilter, dietFilter, sortBy]
  );

  const isOverlayOpen = Boolean(openedDinoId) || addModalOpen;

  const {
    activeIndex,
    setActiveIndex,
    next,
    prev,
    dragOffsetPx,
    snapBounce,
    isMobile,
    prefersReducedMotion: systemReducedMotion,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCarousel({
    total: filteredDinos.length,
    isDisabled: isOverlayOpen || viewMode === 'grid',
    onOpenActive: () => {
      const current = filteredDinos[activeIndex];
      if (current) {
        handleOpenDetail(current);
      }
    },
  });

  const effectiveReducedMotion = systemReducedMotion || reducedMotionOverride;
  const activeDino = filteredDinos[activeIndex];

  const openedDino = useMemo(
    () => (openedDinoId ? filteredDinos.find((d) => d.id === openedDinoId) || null : null),
    [openedDinoId, filteredDinos]
  );

  const handleOpenDetail = useCallback((dino: DinoPage) => {
    soundManager.playDinoRoar(dino.weightTons > 5 ? 0.85 : 1.25);
    if (dino.externalUrl && dino.externalUrl.trim()) {
      window.location.href = dino.externalUrl.trim();
      return;
    }
    setOpenedDinoId(dino.id);
  }, []);

  const handleInspectSpecs = useCallback((dino: DinoPage) => {
    soundManager.playDinoRoar(dino.weightTons > 5 ? 0.85 : 1.25);
    setOpenedDinoId(dino.id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setOpenedDinoId(null);
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prevState) => {
      const nextState = !prevState;
      soundManager.enabled = nextState;
      if (nextState) {
        soundManager.playPageTick();
      }
      return nextState;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setPeriodFilter('All');
    setDietFilter('All');
    setSortBy('journal');
  }, []);

  // Reorder pages in default journal order
  const handleMovePageLeft = useCallback(() => {
    if (!activeDino || sortBy !== 'journal') return;
    const rawIdx = dinos.findIndex((d) => d.id === activeDino.id);
    if (rawIdx <= 0) return;

    const updated = [...dinos];
    const [moved] = updated.splice(rawIdx, 1);
    updated.splice(rawIdx - 1, 0, moved);
    setDinos(updated);
    setActiveIndex(Math.max(0, activeIndex - 1));
  }, [activeDino, sortBy, dinos, activeIndex, setActiveIndex]);

  const handleMovePageRight = useCallback(() => {
    if (!activeDino || sortBy !== 'journal') return;
    const rawIdx = dinos.findIndex((d) => d.id === activeDino.id);
    if (rawIdx < 0 || rawIdx >= dinos.length - 1) return;

    const updated = [...dinos];
    const [moved] = updated.splice(rawIdx, 1);
    updated.splice(rawIdx + 1, 0, moved);
    setDinos(updated);
    setActiveIndex(Math.min(filteredDinos.length - 1, activeIndex + 1));
  }, [activeDino, sortBy, dinos, filteredDinos.length, activeIndex, setActiveIndex]);

  const handleAddFieldNote = useCallback((dinoId: string, note: string) => {
    setDinos((prevList) =>
      prevList.map((d) =>
        d.id === dinoId ? { ...d, fieldNotes: [...d.fieldNotes, note] } : d
      )
    );
  }, []);

  const handleUpdateExternalUrl = useCallback((dinoId: string, url: string) => {
    setDinos((prevList) =>
      prevList.map((d) =>
        d.id === dinoId ? { ...d, externalUrl: url.trim() ? url.trim() : undefined } : d
      )
    );
  }, []);

  const handleAddDino = useCallback(
    (newDino: DinoPage) => {
      setSearchQuery('');
      setPeriodFilter('All');
      setDietFilter('All');
      setSortBy('journal');
      setViewMode('book');
      setDinos((prevList) => {
        const nextList = [...prevList, newDino];
        window.setTimeout(() => {
          setActiveIndex(nextList.length - 1);
        }, 30);
        return nextList;
      });
    },
    [setActiveIndex]
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden select-none">
      {/* Subtle Noise Texture & Radial Vignette Overlay */}
      <div aria-hidden="true" className="fixed inset-0 bg-noise pointer-events-none z-0" />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, transparent 45%, rgba(12, 16, 34, 0.55) 100%)',
        }}
      />

      {/* Top Bar (slides up smoothly when a page is opened full-screen) */}
      <motion.div
        animate={{
          y: openedDino ? -90 : 0,
          opacity: openedDino ? 0 : 1,
        }}
        transition={{ duration: effectiveReducedMotion ? 0 : 0.45, ease: 'easeInOut' }}
        className="relative z-30"
      >
        <TopBar
          journalTitle={journalTitle}
          onJournalTitleChange={setJournalTitle}
          pageCount={filteredDinos.length}
          totalUnfilteredCount={dinos.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          searchOpen={searchOpen}
          onSearchOpenChange={setSearchOpen}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          periodFilter={periodFilter}
          onPeriodFilterChange={setPeriodFilter}
          dietFilter={dietFilter}
          onDietFilterChange={setDietFilter}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          reducedMotionOverride={reducedMotionOverride}
          onToggleReducedMotion={() => setReducedMotionOverride((v) => !v)}
          onResetFilters={handleResetFilters}
        />
      </motion.div>

      {/* Main 3D Cover-Flow Carousel or Thumbnail Grid */}
      <main className="relative z-20 flex-1 flex flex-col justify-center">
        <Carousel3D
          dinos={filteredDinos}
          activeIndex={activeIndex}
          isDetailOpen={Boolean(openedDino)}
          onSelectIndex={setActiveIndex}
          onOpenDetail={handleOpenDetail}
          onInspectSpecs={handleInspectSpecs}
          onPrev={prev}
          onNext={next}
          dragOffsetPx={dragOffsetPx}
          snapBounce={snapBounce}
          isMobile={isMobile}
          prefersReducedMotion={effectiveReducedMotion}
          viewMode={viewMode}
          onSwitchToBookAndSelect={(idx) => {
            setViewMode('book');
            setActiveIndex(idx);
          }}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Bottom Floating Action Bar (slides down smoothly when full-screen detail is open) */}
      <motion.div
        animate={{
          y: openedDino ? 90 : 0,
          opacity: openedDino ? 0 : 1,
        }}
        transition={{ duration: effectiveReducedMotion ? 0 : 0.45, ease: 'easeInOut' }}
        className="relative z-30"
      >
        <ActionBar
          activeDino={activeDino}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onMovePageLeft={handleMovePageLeft}
          onMovePageRight={handleMovePageRight}
          canMoveLeft={activeIndex > 0}
          canMoveRight={activeIndex < filteredDinos.length - 1}
          onOpenAddModal={() => setAddModalOpen(true)}
          onAddFieldNote={handleAddFieldNote}
          onUpdateExternalUrl={handleUpdateExternalUrl}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      </motion.div>

      {/* Full-Screen Opened Dinosaur Page Experience */}
      <AnimatePresence>
        {openedDino && (
          <DetailView
            key={openedDino.id}
            dino={openedDino}
            activeIndex={activeIndex}
            totalCount={filteredDinos.length}
            prefersReducedMotion={effectiveReducedMotion}
            onClose={handleCloseDetail}
            onPrevDino={() => {
              if (activeIndex > 0) {
                const prevDino = filteredDinos[activeIndex - 1];
                setActiveIndex(activeIndex - 1);
                if (prevDino) setOpenedDinoId(prevDino.id);
              }
            }}
            onNextDino={() => {
              if (activeIndex < filteredDinos.length - 1) {
                const nextDino = filteredDinos[activeIndex + 1];
                setActiveIndex(activeIndex + 1);
                if (nextDino) setOpenedDinoId(nextDino.id);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Add New Dinosaur Modal */}
      <AddDinoModal
        isOpen={addModalOpen}
        nextCatalogIndex={dinos.length + 1}
        onClose={() => setAddModalOpen(false)}
        onAddDino={handleAddDino}
      />
    </div>
  );
}
