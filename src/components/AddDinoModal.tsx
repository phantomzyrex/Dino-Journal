import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import {
  PRESET_THEMES,
  type DinoDiet,
  type DinoPage,
  type DinoPeriod,
  type SceneType,
} from '../data/dinos';
import { validateNewDinoInput, type NewDinoFormInput } from '../utils/carouselMath';

export interface AddDinoModalProps {
  isOpen: boolean;
  nextCatalogIndex: number;
  onClose: () => void;
  onAddDino: (newDino: DinoPage) => void;
}

export const AddDinoModal: React.FC<AddDinoModalProps> = ({
  isOpen,
  nextCatalogIndex,
  onClose,
  onAddDino,
}) => {
  const [form, setForm] = useState<NewDinoFormInput>({
    name: '',
    nickname: '',
    period: 'Cretaceous',
    diet: 'Carnivore',
    lengthMeters: '11.5',
    weightTons: '6.5',
    speedKmh: '30',
    shortDescription: '',
    themeId: 'volcanic',
    imageUrl: '',
    externalUrl: '',
  });

  const [speciesSilhouette, setSpeciesSilhouette] = useState('trex');
  const [errors, setErrors] = useState<Partial<Record<keyof NewDinoFormInput, string>>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateNewDinoInput(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const lengthNum = Number(form.lengthMeters);
    const weightNum = Number(form.weightTons);
    const speedNum = Number(form.speedKmh);
    const selectedTheme = PRESET_THEMES[form.themeId] || PRESET_THEMES.volcanic;

    const myaMap: Record<DinoPeriod, { range: string; midpoint: number; subEpoch: string }> = {
      Triassic: { range: '228–208 MYA', midpoint: 218, subEpoch: 'Late Norian' },
      Jurassic: { range: '155–148 MYA', midpoint: 151, subEpoch: 'Late Jurassic' },
      Cretaceous: { range: '75–66 MYA', midpoint: 70, subEpoch: 'Late Cretaceous' },
    };

    const eraInfo = myaMap[form.period];
    const slug = form.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const newPage: DinoPage = {
      id: `${slug}-${Date.now()}`,
      catalogNumber: `SPEC-${String(nextCatalogIndex).padStart(3, '0')}`,
      name: form.name.trim(),
      nickname: form.nickname.trim(),
      scientificName: `${form.name.trim().split(' ')[0]} sp.`,
      period: form.period,
      subEpoch: eraInfo.subEpoch,
      eraRangeMya: eraInfo.range,
      myaMidpoint: eraInfo.midpoint,
      diet: form.diet,
      lengthMeters: lengthNum,
      lengthLabel: `${lengthNum} m`,
      heightMeters: Number(Math.max(1.2, lengthNum * 0.34).toFixed(1)),
      weightTons: weightNum,
      weightLabel: weightNum < 1 ? `${Math.round(weightNum * 1000)} kg` : `${weightNum} t`,
      speedKmh: speedNum,
      speedLabel: `${speedNum} km/h`,
      shortDescription: form.shortDescription.trim(),
      habitatTitle: `${form.period} Continental Basin`,
      habitatDescription: form.shortDescription.trim(),
      discoveryLocation: 'Field Expedition Entry',
      discoveryYear: new Date().getFullYear(),
      fieldNotes: [
        form.shortDescription.trim(),
        `Cataloged in ${form.period} stratum (${eraInfo.range}) with estimated length of ${lengthNum} m.`,
      ],
      theme: selectedTheme,
      sceneType: (form.themeId as SceneType) || 'volcanic',
      imageUrl: form.imageUrl?.trim() ? form.imageUrl.trim() : undefined,
      externalUrl: form.externalUrl?.trim() ? form.externalUrl.trim() : undefined,
      speciesKey: speciesSilhouette,
    };

    onAddDino(newPage);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add New Dinosaur Page"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-[#212744] border border-white/20 shadow-2xl p-6 sm:p-8 text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/12">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300">
              New Journal Entry · SPEC-{String(nextCatalogIndex).padStart(3, '0')}
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">Add Dinosaur Page</h2>
          </div>
          <button
            type="button"
            aria-label="Close Add Dinosaur Modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-button flex items-center justify-center text-white/75 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {/* Name & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dino-name-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Dinosaur Name *
              </label>
              <input
                id="dino-name-input"
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="e.g. Giganotosaurus"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/45"
              />
              {errors.name && <p className="text-xs text-rose-300 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="dino-nickname-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Epithet / Nickname *
              </label>
              <input
                id="dino-nickname-input"
                type="text"
                value={form.nickname}
                onChange={(e) => {
                  setForm({ ...form, nickname: e.target.value });
                  if (errors.nickname) setErrors({ ...errors, nickname: undefined });
                }}
                placeholder="e.g. Giant Southern Lizard"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/45"
              />
              {errors.nickname && <p className="text-xs text-rose-300 mt-1">{errors.nickname}</p>}
            </div>
          </div>

          {/* Period, Diet & Silhouette Cutout Preset */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="dino-period-select"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Geological Period
              </label>
              <select
                id="dino-period-select"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value as DinoPeriod })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#191E36] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/45"
              >
                <option value="Triassic">Triassic</option>
                <option value="Jurassic">Jurassic</option>
                <option value="Cretaceous">Cretaceous</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dino-diet-select"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Diet Guild
              </label>
              <select
                id="dino-diet-select"
                value={form.diet}
                onChange={(e) => setForm({ ...form, diet: e.target.value as DinoDiet })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#191E36] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/45"
              >
                <option value="Carnivore">Carnivore</option>
                <option value="Herbivore">Herbivore</option>
                <option value="Piscivore">Piscivore</option>
                <option value="Omnivore">Omnivore</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dino-silhouette-select"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Cutout Anatomy
              </label>
              <select
                id="dino-silhouette-select"
                value={speciesSilhouette}
                onChange={(e) => setSpeciesSilhouette(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#191E36] border border-white/15 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/45"
              >
                <option value="trex">Apex Theropod</option>
                <option value="shastasaurus">Giant Ichthyosaur</option>
                <option value="mosasaurus">Apex Mosasaur</option>
                <option value="brachiosaurus">Tall Titanosaur / Sauropod</option>
                <option value="diplodocus">Colossal Long Titanosaur</option>
                <option value="triceratops">Horned Ceratopsian</option>
                <option value="velociraptor">Feathered Dromaeosaur</option>
                <option value="stegosaurus">Plated Stegosaur</option>
                <option value="spinosaurus">Sail-Backed Spinosaur</option>
                <option value="ankylosaurus">Armored Ankylosaur</option>
                <option value="parasaurolophus">Crested Hadrosaur</option>
                <option value="pteranodon">Winged Pterosaur</option>
              </select>
            </div>
          </div>

          {/* Length, Weight, Speed */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="dino-length-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Length (m) *
              </label>
              <input
                id="dino-length-input"
                type="number"
                step="0.1"
                value={form.lengthMeters}
                onChange={(e) => setForm({ ...form, lengthMeters: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/8 border border-white/15 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-white/45"
              />
              {errors.lengthMeters && (
                <p className="text-[11px] text-rose-300 mt-1">{errors.lengthMeters}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="dino-weight-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Weight (t) *
              </label>
              <input
                id="dino-weight-input"
                type="number"
                step="0.1"
                value={form.weightTons}
                onChange={(e) => setForm({ ...form, weightTons: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/8 border border-white/15 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-white/45"
              />
              {errors.weightTons && (
                <p className="text-[11px] text-rose-300 mt-1">{errors.weightTons}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="dino-speed-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5"
              >
                Speed (km/h) *
              </label>
              <input
                id="dino-speed-input"
                type="number"
                step="1"
                value={form.speedKmh}
                onChange={(e) => setForm({ ...form, speedKmh: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/8 border border-white/15 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-white/45"
              />
              {errors.speedKmh && (
                <p className="text-[11px] text-rose-300 mt-1">{errors.speedKmh}</p>
              )}
            </div>
          </div>

          {/* Color Theme Swatches */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              Atmosphere Color Theme
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.values(PRESET_THEMES)
                .slice(0, 6)
                .map((theme) => {
                  const selected = form.themeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setForm({ ...form, themeId: theme.id })}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        selected
                          ? 'border-white ring-2 ring-white/50 bg-white/15'
                          : 'border-white/15 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-full h-5 rounded-md mb-1"
                        style={{ background: theme.skyGradient }}
                      />
                      <span className="block text-[10px] font-medium text-white/85 truncate">
                        {theme.name}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Optional Redirect URL & Custom Transparent Cutout Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="dino-external-url-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1"
              >
                Redirect Link URL (When Clicked)
              </label>
              <input
                id="dino-external-url-input"
                type="url"
                value={form.externalUrl}
                onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                placeholder="e.g. https://theropod.vercel.app/"
                className="w-full px-3.5 py-2 rounded-xl bg-white/8 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/45"
              />
            </div>

            <div>
              <label
                htmlFor="dino-image-input"
                className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1"
              >
                Custom Cutout Image URL (Optional)
              </label>
              <input
                id="dino-image-input"
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="Leave blank for layered SVG cutout"
                className="w-full px-3.5 py-2 rounded-xl bg-white/8 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/45"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label
              htmlFor="dino-desc-input"
              className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1"
            >
              Paleontological Summary *
            </label>
            <textarea
              id="dino-desc-input"
              rows={2}
              value={form.shortDescription}
              onChange={(e) => {
                setForm({ ...form, shortDescription: e.target.value });
                if (errors.shortDescription) setErrors({ ...errors, shortDescription: undefined });
              }}
              placeholder="Describe key anatomical traits, hunting or browsing behavior, and habitat..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/8 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/45"
            />
            {errors.shortDescription && (
              <p className="text-xs text-rose-300 mt-1">{errors.shortDescription}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Dinosaur Page</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
