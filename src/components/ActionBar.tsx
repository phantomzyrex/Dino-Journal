import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Share2,
  FileText,
  Plus,
  ArrowUpDown,
  ArrowLeft,
  ArrowRight,
  Download,
  Printer,
  Check,
  X,
  Send,
} from 'lucide-react';
import type { DinoPage } from '../data/dinos';
import type { SortOption } from '../utils/carouselMath';

export interface ActionBarProps {
  activeDino: DinoPage | undefined;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onMovePageLeft: () => void;
  onMovePageRight: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onOpenAddModal: () => void;
  onAddFieldNote: (dinoId: string, note: string) => void;
  onUpdateExternalUrl?: (dinoId: string, url: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  activeDino,
  sortBy,
  onSortByChange,
  onMovePageLeft,
  onMovePageRight,
  canMoveLeft,
  canMoveRight,
  onOpenAddModal,
  onAddFieldNote,
  onUpdateExternalUrl,
  soundEnabled,
  onToggleSound,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [moreOpen]);

  // Export current dinosaur card as a high-res PNG image via HTML5 Canvas
  const handleExportPng = () => {
    if (!activeDino) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sky background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 900);
    grad.addColorStop(0, activeDino.theme.dinoPrimaryHex);
    grad.addColorStop(0.6, activeDino.theme.dinoSecondaryHex);
    grad.addColorStop(1, activeDino.theme.accentHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 900);

    // Subtle border frame
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 1128, 828);

    // Header catalog info
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '600 22px Outfit, sans-serif';
    ctx.fillText(
      `DINOSAUR WIKI · ${activeDino.catalogNumber} · ${activeDino.period.toUpperCase()} (${activeDino.eraRangeMya})`,
      80,
      105
    );

    // Giant Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 84px Outfit, sans-serif';
    ctx.fillText(activeDino.name.toUpperCase(), 80, 210);

    // Subtitle
    ctx.fillStyle = activeDino.theme.secondaryHex;
    ctx.font = '500 32px Outfit, sans-serif';
    ctx.fillText(`${activeDino.nickname} (${activeDino.scientificName})`, 80, 265);

    // Description
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '400 26px Outfit, sans-serif';
    const words = activeDino.shortDescription.split(' ');
    let line = '';
    let y = 360;
    for (const word of words) {
      const testLine = line + word + ' ';
      if (ctx.measureText(testLine).width > 1000) {
        ctx.fillText(line, 80, y);
        line = word + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, y);

    // Metrics strip at bottom
    const stats = [
      { label: 'LENGTH', value: activeDino.lengthLabel },
      { label: 'WEIGHT', value: activeDino.weightLabel },
      { label: 'TOP SPEED', value: activeDino.speedLabel },
      { label: 'DIET', value: activeDino.diet },
    ];
    stats.forEach((st, i) => {
      const x = 80 + i * 265;
      ctx.fillStyle = 'rgba(15, 19, 38, 0.55)';
      ctx.fillRect(x, 690, 235, 115);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '600 18px Outfit, sans-serif';
      ctx.fillText(st.label, x + 24, 732);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 34px JetBrains Mono, monospace';
      ctx.fillText(st.value, x + 24, 780);
    });

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${activeDino.id}-journal-card.png`;
    a.click();

    setExportStatus('Saved high-res PNG card');
    window.setTimeout(() => setExportStatus(null), 3000);
  };

  const handlePrintPdf = () => {
    window.print();
    setExportStatus('Opened PDF / Print dialog');
    window.setTimeout(() => setExportStatus(null), 3000);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDino || !newNoteText.trim()) return;
    onAddFieldNote(activeDino.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <>
      {/* Bottom Floating Action Bar: 4 circular buttons, centered, 16px gap */}
      <nav
        aria-label="Journal Page Actions"
        className="relative z-30 pb-5 sm:pb-7 pt-1 flex items-center justify-center"
      >
        <div className="flex items-center gap-4" ref={moreRef}>
          {/* 1. "..." More Button (Sort, Reorder pages, Settings) */}
          <div className="relative">
            <button
              type="button"
              aria-label="More Options: Sort and Reorder Pages"
              aria-expanded={moreOpen}
              onClick={() => {
                setMoreOpen((v) => !v);
                setShareOpen(false);
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-button flex items-center justify-center transition-all cursor-pointer active:scale-92 hover:shadow-[0_0_22px_rgba(255,255,255,0.26)] ${
                moreOpen ? 'ring-2 ring-white text-white bg-white/18' : 'text-white/85 hover:text-white'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {moreOpen && (
              <div
                role="dialog"
                aria-label="Sort, Reorder, and Settings"
                className="absolute bottom-15 left-1/2 -translate-x-1/2 w-72 rounded-2xl bg-[#222845]/95 backdrop-blur-2xl border border-white/20 shadow-2xl p-3.5 z-50 text-left"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Sort Journal Pages
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 mb-3">
                  {(
                    [
                      { id: 'journal', label: 'Curator Page Order (Default)' },
                      { id: 'name', label: 'Alphabetical (A–Z)' },
                      { id: 'period', label: 'Chronological Era (Triassic → Cretaceous)' },
                      { id: 'length-desc', label: 'Longest Body Length First' },
                      { id: 'weight-desc', label: 'Heaviest Mass First' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSortByChange(opt.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        sortBy === opt.id
                          ? 'bg-white text-slate-950 font-semibold'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>

                {/* Reorder Current Page */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-2">
                    Reorder Current Page
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!canMoveLeft || sortBy !== 'journal'}
                      onClick={onMovePageLeft}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/18 disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Move Earlier</span>
                    </button>
                    <button
                      type="button"
                      disabled={!canMoveRight || sortBy !== 'journal'}
                      onClick={onMovePageRight}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/18 disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-white cursor-pointer"
                    >
                      <span>Move Later</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Quick Audio Toggle */}
                <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/75">Sound Effects (Roar & Flip)</span>
                  <button
                    type="button"
                    onClick={onToggleSound}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      soundEnabled
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {soundEnabled ? 'Enabled' : 'Muted'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Share / Upload Button (Export current page as Image or PDF) */}
          <button
            type="button"
            aria-label="Share or Export Current Dinosaur Page"
            onClick={() => {
              setShareOpen(true);
              setMoreOpen(false);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-button flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer active:scale-92 hover:shadow-[0_0_22px_rgba(255,255,255,0.26)]"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* 3. Document / Notes Button (Opens side drawer with dinosaur's fact notes) */}
          <button
            type="button"
            aria-label="Open Dinosaur Fact Notes Drawer"
            onClick={() => {
              setNotesDrawerOpen(true);
              setMoreOpen(false);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-button flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer active:scale-92 hover:shadow-[0_0_22px_rgba(255,255,255,0.26)]"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* 4. "+" Add Button (Opens modal to add a new dinosaur page) */}
          <button
            type="button"
            aria-label="Add New Dinosaur Page"
            onClick={() => {
              onOpenAddModal();
              setMoreOpen(false);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-button flex items-center justify-center text-white hover:text-white transition-all cursor-pointer active:scale-92 hover:shadow-[0_0_24px_rgba(255,255,255,0.32)]"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </nav>

      {/* SHARE / EXPORT MODAL */}
      {shareOpen && activeDino && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Export ${activeDino.name} Page`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md"
          onClick={() => setShareOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#232946] border border-white/20 shadow-2xl p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-white/55">
                  Export Specimen Plate
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeDino.name}</h3>
              </div>
              <button
                type="button"
                aria-label="Close Export Modal"
                onClick={() => setShareOpen(false)}
                className="w-9 h-9 rounded-full glass-button flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="p-4 rounded-2xl mb-5 border border-white/15"
              style={{ background: activeDino.theme.skyGradient }}
            >
              <div className="text-xs font-mono text-white/80">{activeDino.catalogNumber}</div>
              <div className="text-lg font-extrabold uppercase tracking-tight text-white mt-0.5">
                {activeDino.name}
              </div>
              <div className="text-xs text-white/80 mt-1">
                {activeDino.period} ({activeDino.eraRangeMya}) · {activeDino.lengthLabel} ·{' '}
                {activeDino.weightLabel}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportPng}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-white/90 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG Card</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/12 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Export / Print PDF</span>
              </button>
            </div>

            {exportStatus && (
              <p className="mt-4 text-center text-xs font-medium text-emerald-300">
                {exportStatus}
              </p>
            )}
          </div>
        </div>
      )}

      {/* FACT NOTES SIDE DRAWER */}
      {notesDrawerOpen && activeDino && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeDino.name} Paleontology Fact Notes`}
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
          onClick={() => setNotesDrawerOpen(false)}
        >
          <aside
            className="w-full max-w-md h-full bg-[#1E243F] border-l border-white/15 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/12">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
                    Field Research Notes · {activeDino.catalogNumber}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">{activeDino.name}</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close Fact Notes Drawer"
                  onClick={() => setNotesDrawerOpen(false)}
                  className="w-9 h-9 rounded-full glass-button flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Discovery Metadata */}
              <dl className="grid grid-cols-2 gap-3 my-4 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs">
                <div>
                  <dt className="text-white/50 uppercase tracking-wider">Formation / Site</dt>
                  <dd className="text-white font-medium mt-0.5">{activeDino.discoveryLocation}</dd>
                </div>
                <div>
                  <dt className="text-white/50 uppercase tracking-wider">First Described</dt>
                  <dd className="text-white font-mono font-semibold mt-0.5 tabular-nums">
                    {activeDino.discoveryYear}
                  </dd>
                </div>
              </dl>

              {/* Redirect Link URL Editor for Any Dinosaur */}
              {onUpdateExternalUrl && (
                <div className="mb-5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/12">
                  <label
                    htmlFor="drawer-external-url"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1.5"
                  >
                    Click Redirect URL
                  </label>
                  <input
                    id="drawer-external-url"
                    type="url"
                    value={activeDino.externalUrl || ''}
                    onChange={(e) => onUpdateExternalUrl(activeDino.id, e.target.value)}
                    placeholder="https://your-dinosaur-link.vercel.app/"
                    className="w-full px-3 py-2 rounded-xl bg-white/8 border border-white/15 text-xs font-mono text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>
              )}

              {/* Summary */}
              <p className="text-sm text-white/80 leading-relaxed mb-5">
                {activeDino.shortDescription}
              </p>

              {/* Curated Fact Notes List */}
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/55 mb-3">
                Verified Specimen Observations ({activeDino.fieldNotes.length})
              </h4>

              <ul className="space-y-2.5 mb-6">
                {activeDino.fieldNotes.map((note, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 text-sm text-white/90 leading-relaxed flex gap-3"
                  >
                    <span className="font-mono text-xs text-amber-300/90 mt-0.5 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add New Field Note Form */}
            <form
              onSubmit={handleNoteSubmit}
              className="pt-4 border-t border-white/12 flex flex-col gap-2.5"
            >
              <label
                htmlFor="new-field-note"
                className="text-xs font-semibold uppercase tracking-wider text-white/60"
              >
                Append Curator Observation
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="new-field-note"
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record a fossil or anatomical note..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <button
                  type="submit"
                  aria-label="Save Field Note"
                  disabled={!newNoteText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-white/90 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </>
  );
};
