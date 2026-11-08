import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  LayoutGrid,
  Search,
  MoreHorizontal,
  Pencil,
  Check,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type { DinoDiet, DinoPeriod } from '../data/dinos';

export interface TopBarProps {
  journalTitle: string;
  onJournalTitleChange: (newTitle: string) => void;
  pageCount: number;
  totalUnfilteredCount: number;
  viewMode: 'book' | 'grid';
  onViewModeChange: (mode: 'book' | 'grid') => void;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  periodFilter: DinoPeriod | 'All';
  onPeriodFilterChange: (period: DinoPeriod | 'All') => void;
  dietFilter: DinoDiet | 'All';
  onDietFilterChange: (diet: DinoDiet | 'All') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotionOverride: boolean;
  onToggleReducedMotion: () => void;
  onResetFilters: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  journalTitle,
  onJournalTitleChange,
  pageCount,
  totalUnfilteredCount,
  viewMode,
  onViewModeChange,
  searchOpen,
  onSearchOpenChange,
  searchQuery,
  onSearchQueryChange,
  periodFilter,
  onPeriodFilterChange,
  dietFilter,
  onDietFilterChange,
  soundEnabled,
  onToggleSound,
  reducedMotionOverride,
  onToggleReducedMotion,
  onResetFilters,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(journalTitle);
  const [menuOpen, setMenuOpen] = useState(false);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraftTitle(journalTitle);
  }, [journalTitle]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const commitTitle = () => {
    const trimmed = draftTitle.trim();
    if (trimmed) {
      onJournalTitleChange(trimmed);
    } else {
      setDraftTitle(journalTitle);
    }
    setIsEditingTitle(false);
  };

  const hasActiveFilter =
    searchQuery.trim().length > 0 || periodFilter !== 'All' || dietFilter !== 'All';

  return (
    <header className="relative z-30 w-full max-w-[1160px] mx-auto px-4 sm:px-8 pt-3 sm:pt-4 pb-2 select-none">
      {/* Top-center tiny three-dot drag handle */}
      <div className="flex justify-center mb-2" aria-hidden="true">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04]">
          <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
        </div>
      </div>

      {/* Main Top Bar Row */}
      <div className="flex items-start justify-between gap-4">
        {/* Top-left: Two circular icon buttons (Book view & Grid view) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            aria-label="Book Cover-Flow View"
            aria-pressed={viewMode === 'book'}
            onClick={() => onViewModeChange('book')}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-button flex items-center justify-center transition-all cursor-pointer active:scale-92 ${
              viewMode === 'book'
                ? 'ring-2 ring-white text-white bg-white/18 shadow-[0_0_20px_rgba(255,255,255,0.22)]'
                : 'text-white/65 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            type="button"
            aria-label="Thumbnail Grid View"
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-button flex items-center justify-center transition-all cursor-pointer active:scale-92 ${
              viewMode === 'grid'
                ? 'ring-2 ring-white text-white bg-white/18 shadow-[0_0_20px_rgba(255,255,255,0.22)]'
                : 'text-white/65 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Center Header: Editable Title + Live Page Count */}
        <div className="flex flex-col items-center text-center min-w-0">
          {isEditingTitle ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commitTitle();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={titleInputRef}
                type="text"
                aria-label="Edit Journal Title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setDraftTitle(journalTitle);
                    setIsEditingTitle(false);
                  }
                }}
                maxLength={36}
                className="bg-white/12 border border-white/30 rounded-lg px-3 py-0.5 text-white text-xl sm:text-[26px] font-semibold text-center focus:outline-none focus:ring-2 focus:ring-white/60 w-48 sm:w-64"
              />
              <button
                type="submit"
                aria-label="Save Journal Title"
                className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-emerald-300 hover:text-emerald-200 cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              aria-label={`Edit journal title (${journalTitle})`}
              className="group flex items-center gap-2 px-2.5 py-0.5 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/55 group-hover:text-white transition-colors shrink-0" />
              <h1 className="text-[22px] sm:text-[28px] font-semibold text-white tracking-tight leading-tight truncate max-w-[210px] sm:max-w-[360px]">
                {journalTitle}
              </h1>
            </button>
          )}

          <p className="text-[12px] font-medium text-white/60 tracking-wide mt-0.5 tabular-nums">
            {hasActiveFilter
              ? `${pageCount} of ${totalUnfilteredCount} Pages`
              : `${pageCount} ${pageCount === 1 ? 'Page' : 'Pages'}`}
          </p>
        </div>

        {/* Top-right: Search & Menu Circular Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Toggle Dinosaur Search and Filter"
            aria-expanded={searchOpen}
            onClick={() => onSearchOpenChange(!searchOpen)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-button flex items-center justify-center transition-all cursor-pointer active:scale-92 ${
              searchOpen || hasActiveFilter
                ? 'ring-2 ring-white text-white bg-white/18'
                : 'text-white/75 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            type="button"
            aria-label="Journal Options Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full glass-button flex items-center justify-center transition-all cursor-pointer active:scale-92 ${
              menuOpen ? 'ring-2 ring-white text-white bg-white/18' : 'text-white/75 hover:text-white'
            }`}
          >
            <MoreHorizontal className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Top-right Dropdown Menu */}
          {menuOpen && (
            <div
              role="menu"
              aria-label="Journal Preferences"
              className="absolute right-0 top-13 w-64 rounded-2xl bg-[#232946]/95 backdrop-blur-xl border border-white/20 shadow-2xl p-2 z-50 text-left"
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                Journal Preferences
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onToggleSound();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white/50" />
                  )}
                  <span>Roar & Page Audio</span>
                </span>
                <span className="text-xs font-mono text-white/60">
                  {soundEnabled ? 'On' : 'Muted'}
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onToggleReducedMotion();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Parallax & Breathing</span>
                </span>
                <span className="text-xs font-mono text-white/60">
                  {reducedMotionOverride ? 'Off' : 'Active'}
                </span>
              </button>

              {hasActiveFilter && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onResetFilters();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-amber-300 hover:bg-white/10 transition-colors cursor-pointer mt-1 border-t border-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Active Filters</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Inline Expandable Search & Filter Strip */}
      {searchOpen && (
        <div className="mt-3 p-3 rounded-2xl bg-[#222845]/90 backdrop-blur-xl border border-white/15 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Filter dinosaurs by name, period (Jurassic, Cretaceous), or diet..."
              aria-label="Filter dinosaurs by name, period, or diet"
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search query"
                onClick={() => onSearchQueryChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/15 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Period & Diet Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-white/6 p-1 rounded-xl border border-white/10">
              {(['All', 'Triassic', 'Jurassic', 'Cretaceous'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => onPeriodFilterChange(period)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    periodFilter === period
                      ? 'bg-white text-slate-900 font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-white/6 p-1 rounded-xl border border-white/10">
              {(['All', 'Carnivore', 'Herbivore', 'Piscivore'] as const).map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => onDietFilterChange(diet)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    dietFilter === diet
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
