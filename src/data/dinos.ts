export type DinoPeriod = 'Triassic' | 'Jurassic' | 'Cretaceous';
export type DinoDiet = 'Carnivore' | 'Herbivore' | 'Piscivore' | 'Omnivore';
export type SceneType =
  | 'volcanic'
  | 'savannah'
  | 'desert'
  | 'canopy'
  | 'ridge'
  | 'delta'
  | 'basalt'
  | 'canyon'
  | 'lagoon'
  | 'coastal'
  | 'floodplain'
  | 'badlands';

export interface DinoColorTheme {
  id: string;
  name: string;
  /** Layer 1 background sky/environment gradient */
  skyGradient: string;
  /** Subtle lower vignette gradient for WCAG AA text contrast */
  scrimGradient: string;
  /** Primary accent hex color */
  accentHex: string;
  /** Secondary highlight hex color */
  secondaryHex: string;
  /** Dinosaur illustration primary body fill */
  dinoPrimaryHex: string;
  /** Dinosaur illustration secondary shading fill */
  dinoSecondaryHex: string;
  /** Dinosaur illustration rim/highlight color */
  dinoHighlightHex: string;
}

export interface DinoPage {
  id: string;
  catalogNumber: string;
  name: string;
  nickname: string;
  scientificName: string;
  period: DinoPeriod;
  subEpoch: string;
  eraRangeMya: string;
  /** Million years ago numeric midpoint for geological timeline placement (252 to 66 MYA) */
  myaMidpoint: number;
  diet: DinoDiet;
  lengthMeters: number;
  lengthLabel: string;
  heightMeters: number;
  weightTons: number;
  weightLabel: string;
  speedKmh: number;
  speedLabel: string;
  biteForceN?: string;
  shortDescription: string;
  habitatTitle: string;
  habitatDescription: string;
  discoveryLocation: string;
  discoveryYear: number;
  fieldNotes: string[];
  theme: DinoColorTheme;
  sceneType: SceneType;
  /**
   * External redirect URL when clicking this dinosaur page.
   * Add or update links here for additional dinosaurs.
   */
  externalUrl?: string;
  /**
   * Optional transparent PNG/WebP cutout URL.
   */
  imageUrl?: string;
  speciesKey: string;
}

export const PRESET_THEMES: Record<string, DinoColorTheme> = {
  coastal: {
    id: 'coastal',
    name: 'Abyssal Pelagic Azure',
    skyGradient: 'linear-gradient(155deg, #091E3A 0%, #134074 48%, #2978A0 82%, #76C7E8 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(6, 15, 30, 0.92) 0%, rgba(6, 15, 30, 0.45) 45%, transparent 100%)',
    accentHex: '#38BDF8',
    secondaryHex: '#BAE6FD',
    dinoPrimaryHex: '#0F294D',
    dinoSecondaryHex: '#1F518C',
    dinoHighlightHex: '#7DD3FC',
  },
  delta: {
    id: 'delta',
    name: 'Tethys Trench Teal',
    skyGradient: 'linear-gradient(155deg, #08242E 0%, #134E5E 48%, #288391 80%, #71B280 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(7, 19, 25, 0.92) 0%, rgba(7, 19, 25, 0.45) 45%, transparent 100%)',
    accentHex: '#06B6D4',
    secondaryHex: '#67E8F9',
    dinoPrimaryHex: '#102E3B',
    dinoSecondaryHex: '#21586B',
    dinoHighlightHex: '#22D3EE',
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Ember',
    skyGradient: 'linear-gradient(155deg, #4A1C17 0%, #8C331E 45%, #D96B27 85%, #F2A649 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(24, 10, 10, 0.92) 0%, rgba(24, 10, 10, 0.45) 45%, transparent 100%)',
    accentHex: '#F97316',
    secondaryHex: '#FDBA74',
    dinoPrimaryHex: '#3B1D16',
    dinoSecondaryHex: '#6E2D1B',
    dinoHighlightHex: '#F59E0B',
  },
  canyon: {
    id: 'canyon',
    name: 'Patagonian Terra Crimson',
    skyGradient: 'linear-gradient(155deg, #33131E 0%, #6E2332 48%, #A84438 82%, #DF7F52 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(25, 9, 15, 0.92) 0%, rgba(25, 9, 15, 0.45) 45%, transparent 100%)',
    accentHex: '#F43F5E',
    secondaryHex: '#FDA4AF',
    dinoPrimaryHex: '#3D1722',
    dinoSecondaryHex: '#7A2A3B',
    dinoHighlightHex: '#FB7185',
  },
  savannah: {
    id: 'savannah',
    name: 'Amber Savannah',
    skyGradient: 'linear-gradient(155deg, #2A2415 0%, #6B5322 48%, #B88B32 84%, #E6C165 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(22, 18, 10, 0.92) 0%, rgba(22, 18, 10, 0.45) 45%, transparent 100%)',
    accentHex: '#EAB308',
    secondaryHex: '#FDE047',
    dinoPrimaryHex: '#332917',
    dinoSecondaryHex: '#5C4824',
    dinoHighlightHex: '#FACC15',
  },
  basalt: {
    id: 'basalt',
    name: 'Basalt & Copper',
    skyGradient: 'linear-gradient(155deg, #1F2430 0%, #3A4254 48%, #6D5B50 82%, #B58463 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(15, 18, 24, 0.92) 0%, rgba(15, 18, 24, 0.45) 45%, transparent 100%)',
    accentHex: '#F59E0B',
    secondaryHex: '#FCD34D',
    dinoPrimaryHex: '#252B38',
    dinoSecondaryHex: '#4A5264',
    dinoHighlightHex: '#FBBF24',
  },
  canopy: {
    id: 'canopy',
    name: 'Misty Canopy',
    skyGradient: 'linear-gradient(155deg, #0F2E2A 0%, #1C594B 48%, #348C70 84%, #76C893 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(8, 24, 21, 0.92) 0%, rgba(8, 24, 21, 0.45) 45%, transparent 100%)',
    accentHex: '#10B981',
    secondaryHex: '#6EE7B7',
    dinoPrimaryHex: '#12352E',
    dinoSecondaryHex: '#235E4E',
    dinoHighlightHex: '#34D399',
  },
  desert: {
    id: 'desert',
    name: 'Gobi Dusk',
    skyGradient: 'linear-gradient(155deg, #2D1B38 0%, #6E3247 45%, #B85A40 82%, #E89954 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(24, 13, 29, 0.92) 0%, rgba(24, 13, 29, 0.45) 45%, transparent 100%)',
    accentHex: '#FB7185',
    secondaryHex: '#FDBA74',
    dinoPrimaryHex: '#3A1F2D',
    dinoSecondaryHex: '#733746',
    dinoHighlightHex: '#FB923C',
  },
  ridge: {
    id: 'ridge',
    name: 'Moss & Ochre Ridge',
    skyGradient: 'linear-gradient(155deg, #1E2D24 0%, #3E593C 48%, #7E7F3E 82%, #C9A959 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(14, 22, 17, 0.92) 0%, rgba(14, 22, 17, 0.45) 45%, transparent 100%)',
    accentHex: '#84CC16',
    secondaryHex: '#BEF264',
    dinoPrimaryHex: '#223324',
    dinoSecondaryHex: '#465E3A',
    dinoHighlightHex: '#A3E635',
  },
  lagoon: {
    id: 'lagoon',
    name: 'Lagoon Indigo & Coral',
    skyGradient: 'linear-gradient(155deg, #1A1F4A 0%, #2E3D7E 48%, #5465A8 80%, #9E94C7 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(13, 16, 38, 0.92) 0%, rgba(13, 16, 38, 0.45) 45%, transparent 100%)',
    accentHex: '#818CF8',
    secondaryHex: '#C7D2FE',
    dinoPrimaryHex: '#1F2552',
    dinoSecondaryHex: '#3C4A8F',
    dinoHighlightHex: '#A5B4FC',
  },
  floodplain: {
    id: 'floodplain',
    name: 'Golden Fern Basin',
    skyGradient: 'linear-gradient(155deg, #262314 0%, #4E4A22 48%, #877E36 82%, #C9BC61 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(19, 17, 10, 0.92) 0%, rgba(19, 17, 10, 0.45) 45%, transparent 100%)',
    accentHex: '#CA8A04',
    secondaryHex: '#FEF08A',
    dinoPrimaryHex: '#2E2B18',
    dinoSecondaryHex: '#59542A',
    dinoHighlightHex: '#EAB308',
  },
  badlands: {
    id: 'badlands',
    name: 'Obsidian Badlands',
    skyGradient: 'linear-gradient(155deg, #241529 0%, #522344 48%, #8F384D 82%, #CC6B5A 100%)',
    scrimGradient: 'linear-gradient(to top, rgba(18, 10, 20, 0.92) 0%, rgba(18, 10, 20, 0.45) 45%, transparent 100%)',
    accentHex: '#EC4899',
    secondaryHex: '#F9A8D4',
    dinoPrimaryHex: '#2E1B33',
    dinoSecondaryHex: '#612A4F',
    dinoHighlightHex: '#F472B6',
  },
};

/**
 * Typed dinosaur catalog array.
 * First 7 entries include direct external redirect URLs (`externalUrl`) as specified;
 * additional URLs can be added to entries 8+ at any time.
 */
export const INITIAL_DINOS: DinoPage[] = [
  // 1. SHASTASAURUS -> https://shastasaurus.vercel.app/
  {
    id: 'shastasaurus',
    catalogNumber: 'SPEC-001',
    name: 'Shastasaurus',
    nickname: 'Colossal Triassic Ichthyosaur',
    scientificName: 'Shastasaurus sikanniensis',
    period: 'Triassic',
    subEpoch: 'Late Norian',
    eraRangeMya: '215–210 MYA',
    myaMidpoint: 212,
    diet: 'Piscivore',
    lengthMeters: 21.0,
    lengthLabel: '21.0 m',
    heightMeters: 4.5,
    weightTons: 68.0,
    weightLabel: '68.0 t',
    speedKmh: 36,
    speedLabel: '36 km/h',
    shortDescription:
      'The largest marine reptile ever discovered, Shastasaurus glided through Late Triassic oceans with a whale-sized fusiform body and toothless suction-feeding jaws.',
    habitatTitle: 'Panthalassic Deep Pelagic Zone',
    habitatDescription:
      'Open pelagic waters of the northeastern Panthalassic Ocean, diving into deep cephalopod-rich thermal layers.',
    discoveryLocation: 'British Columbia, Canada & California, USA',
    discoveryYear: 1895,
    fieldNotes: [
      'Reached up to 21 meters in length, rivaling modern fin whales in body volume.',
      'Short, toothless snout specialized in suction-feeding on soft-bodied cephalopods and fish.',
      'Enormous eyeballs over 25 cm across gathered scarce light in the mesopelagic twilight zone.',
    ],
    theme: PRESET_THEMES.coastal,
    sceneType: 'coastal',
    externalUrl: 'https://shastasaurus.vercel.app/',
    speciesKey: 'shastasaurus',
  },

  // 2. MOSASAURUS -> https://marinereptile.vercel.app/
  {
    id: 'mosasaurus',
    catalogNumber: 'SPEC-002',
    name: 'Mosasaurus',
    nickname: 'Apex Sovereign of the Seas',
    scientificName: 'Mosasaurus hoffmannii',
    period: 'Cretaceous',
    subEpoch: 'Late Maastrichtian',
    eraRangeMya: '70–66 MYA',
    myaMidpoint: 68,
    diet: 'Carnivore',
    lengthMeters: 17.0,
    lengthLabel: '17.0 m',
    heightMeters: 3.8,
    weightTons: 15.0,
    weightLabel: '15.0 t',
    speedKmh: 48,
    speedLabel: '48 km/h',
    biteForceN: '28,000 N',
    shortDescription:
      'A colossal air-breathing marine squamate armed with double-hinged jaws, pterygoid throat teeth, four hydrofoil paddles, and a hypocercal shark-like tail fluke.',
    habitatTitle: 'Western Interior & Tethys Seaways',
    habitatDescription:
      'Warm epicontinental chalk seas and coastal shelves where Mosasaurus ambushed plesiosaurs, giant turtles, and ammonites.',
    discoveryLocation: 'Maastricht, Netherlands',
    discoveryYear: 1764,
    fieldNotes: [
      'Secondary palatal teeth on the roof of the mouth ratcheted large struggling prey directly down the gullet.',
      'Streamlined counter-shaded keeled scales reduced hydrodynamic drag during explosive surface lunges.',
      'Gave birth to live, free-swimming young in the open ocean rather than returning to shore.',
    ],
    theme: PRESET_THEMES.delta,
    sceneType: 'delta',
    externalUrl: 'https://marinereptile.vercel.app/',
    speciesKey: 'mosasaurus',
  },

  // 3. TYRANNOSAURUS REX -> https://theropod.vercel.app/
  {
    id: 'tyrannosaurus-rex',
    catalogNumber: 'SPEC-003',
    name: 'Tyrannosaurus Rex',
    nickname: 'Apex Tyrant Lizard King',
    scientificName: 'Tyrannosaurus rex',
    period: 'Cretaceous',
    subEpoch: 'Late Maastrichtian',
    eraRangeMya: '68–66 MYA',
    myaMidpoint: 67,
    diet: 'Carnivore',
    lengthMeters: 12.4,
    lengthLabel: '12.4 m',
    heightMeters: 4.0,
    weightTons: 8.8,
    weightLabel: '8.8 t',
    speedKmh: 27,
    speedLabel: '27 km/h',
    biteForceN: '35,000 N',
    shortDescription:
      'Built around a massive 1.5-meter skull capable of pulverizing solid bone, Tyrannosaurus rex ruled western North America during the final two million years of the Mesozoic Era.',
    habitatTitle: 'Hell Creek Alluvial Floodplains',
    habitatDescription:
      'Subtropical coastal floodplains crisscrossed by meandering rivers, lush dawn redwood forests, and volcanic ash beds along the retreating Western Interior Seaway.',
    discoveryLocation: 'Montana & South Dakota, USA',
    discoveryYear: 1902,
    fieldNotes: [
      'Binocular forward-facing vision gave T. rex depth perception rivaling modern birds of prey.',
      'CT scans of the olfactory bulbs indicate an extraordinary sense of smell capable of tracking carrion or live prey over several kilometers.',
      'Fused nasal bones absorbed immense torsional stress during bone-crushing bites.',
    ],
    theme: PRESET_THEMES.volcanic,
    sceneType: 'volcanic',
    externalUrl: 'https://theropod.vercel.app/',
    speciesKey: 'trex',
  },

  // 4. PATAGONIAN TITAN (ARGENTINOSAURUS) -> https://patagonian.vercel.app/
  {
    id: 'patagonian-titan',
    catalogNumber: 'SPEC-004',
    name: 'Argentinosaurus',
    nickname: 'Patagonian Earth-Shaker',
    scientificName: 'Argentinosaurus huinculensis',
    period: 'Cretaceous',
    subEpoch: 'Cenomanian',
    eraRangeMya: '96–92 MYA',
    myaMidpoint: 94,
    diet: 'Herbivore',
    lengthMeters: 35.0,
    lengthLabel: '35.0 m',
    heightMeters: 14.5,
    weightTons: 75.0,
    weightLabel: '75.0 t',
    speedKmh: 15,
    speedLabel: '15 km/h',
    shortDescription:
      'A monumental Patagonian titanosaur whose single dorsal vertebra stands over 1.5 meters tall, shaking the floodplains of Late Cretaceous South America.',
    habitatTitle: 'Huincul Formation Alluvial Plains',
    habitatDescription:
      'Vast Patagonian river basins bordered by araucaria forests where giant sauropod herds stripped entire canopies.',
    discoveryLocation: 'Neuquén Province, Patagonia, Argentina',
    discoveryYear: 1987,
    fieldNotes: [
      'Femur bone alone measured 2.5 meters in length with a shaft circumference built to support 75 tons.',
      'Pneumatic air-sac cavities honeycombed the giant vertebrae to lighten the axial skeleton.',
      'Traveled in multi-generational herds across seasonal Patagonian floodplains.',
    ],
    theme: PRESET_THEMES.canyon,
    sceneType: 'canyon',
    externalUrl: 'https://patagonian.vercel.app/',
    speciesKey: 'brachiosaurus',
  },

  // 5. PATAGOTITAN -> https://patagotitans.vercel.app/
  {
    id: 'patagotitan',
    catalogNumber: 'SPEC-005',
    name: 'Patagotitan',
    nickname: 'Titan of Chubut',
    scientificName: 'Patagotitan mayorum',
    period: 'Cretaceous',
    subEpoch: 'Albian',
    eraRangeMya: '101–98 MYA',
    myaMidpoint: 100,
    diet: 'Herbivore',
    lengthMeters: 37.0,
    lengthLabel: '37.0 m',
    heightMeters: 14.0,
    weightTons: 69.0,
    weightLabel: '69.0 t',
    speedKmh: 16,
    speedLabel: '16 km/h',
    shortDescription:
      'Known from six young-adult individuals excavated from a single Patagonian quarry, Patagotitan mayorum is one of the most complete super-massive titanosaurs ever reconstructed.',
    habitatTitle: 'Cerro Barcino Floodplain Forests',
    habitatDescription:
      'Low-relief meandering river floodplains rich in conifers, horsetails, and early flowering angiosperms.',
    discoveryLocation: 'La Flecha Ranch, Chubut, Patagonia',
    discoveryYear: 2014,
    fieldNotes: [
      'Over 130 fossil bones from at least six individuals were preserved across three stacked flood layers.',
      'Its 2.38-meter femur is the longest complete titanosaur thigh bone ever measured.',
      'Hyposphene-hypantrum vertebral articulations locked the lower back for extraordinary load capacity.',
    ],
    theme: PRESET_THEMES.savannah,
    sceneType: 'savannah',
    externalUrl: 'https://patagotitans.vercel.app/',
    speciesKey: 'diplodocus',
  },

  // 6. DREADNOUGHTUS -> https://dreadnoughtuss.vercel.app/
  {
    id: 'dreadnoughtus',
    catalogNumber: 'SPEC-006',
    name: 'Dreadnoughtus',
    nickname: 'Fears Nothing Colossus',
    scientificName: 'Dreadnoughtus schrani',
    period: 'Cretaceous',
    subEpoch: 'Campanian–Maastrichtian',
    eraRangeMya: '77–75 MYA',
    myaMidpoint: 76,
    diet: 'Herbivore',
    lengthMeters: 26.0,
    lengthLabel: '26.0 m',
    heightMeters: 11.5,
    weightTons: 59.0,
    weightLabel: '59.0 t',
    speedKmh: 16,
    speedLabel: '16 km/h',
    shortDescription:
      'With over 70% of its postcranial skeleton preserved in articulation, Dreadnoughtus was impervious to predation as an adult and wielded a muscular 9-meter weaponized tail.',
    habitatTitle: 'Cerro Fortaleza Riverine Flats',
    habitatDescription:
      'Forested river valleys in southern Patagonia subject to sudden avulsion floods and quicksand-like mire deposits.',
    discoveryLocation: 'Santa Cruz Province, Patagonia, Argentina',
    discoveryYear: 2005,
    fieldNotes: [
      'Bone histology shows the 59-ton type specimen was still rapidly growing at the time of its death.',
      'Deeply scarred caudal vertebrae indicate massive muscular attachments for swinging the tail as a defensive flail.',
      'Wide-gauge stance distributed immense body mass stably across soft alluvial ground.',
    ],
    theme: PRESET_THEMES.basalt,
    sceneType: 'basalt',
    externalUrl: 'https://dreadnoughtuss.vercel.app/',
    speciesKey: 'brachiosaurus',
  },

  // 7. BRUHATHKAYOSAURUS -> https://bruhathkayosaurus.vercel.app/
  {
    id: 'bruhathkayosaurus',
    catalogNumber: 'SPEC-007',
    name: 'Bruhathkayosaurus',
    nickname: 'Gondwanan Mega-Titan',
    scientificName: 'Bruhathkayosaurus matleyi',
    period: 'Cretaceous',
    subEpoch: 'Maastrichtian',
    eraRangeMya: '70–66 MYA',
    myaMidpoint: 68,
    diet: 'Herbivore',
    lengthMeters: 37.5,
    lengthLabel: '37.5 m',
    heightMeters: 14.8,
    weightTons: 80.0,
    weightLabel: '80.0 t',
    speedKmh: 14,
    speedLabel: '14 km/h',
    shortDescription:
      'Described from monumental fossilized limb and pelvic elements in southern India, Bruhathkayosaurus represents the upper biomechanical limit of terrestrial animal size.',
    habitatTitle: 'Kallamedu Estuarine Plains',
    habitatDescription:
      'Tropical monsoon floodplains and coastal plains across the drifting Indian subcontinent during the latest Cretaceous.',
    discoveryLocation: 'Tiruchirappalli, Tamil Nadu, India',
    discoveryYear: 1987,
    fieldNotes: [
      'Reported tibia bone measured 2 meters in length—nearly 30% larger than that of Argentinosaurus.',
      'Inhabited the isolated Gondwanan island-continent of India prior to its collision with Eurasia.',
      'Pillar-like limbs operated in near-vertical graviphotic alignment to support upwards of 80 metric tons.',
    ],
    theme: PRESET_THEMES.canopy,
    sceneType: 'canopy',
    externalUrl: 'https://bruhathkayosaurus.vercel.app/',
    speciesKey: 'diplodocus',
  },

  // 8+. ADDITIONAL JOURNAL PAGES (ready for future redirect links)
  {
    id: 'triceratops',
    catalogNumber: 'SPEC-008',
    name: 'Triceratops',
    nickname: 'Three-Horned Shield Bearer',
    scientificName: 'Triceratops horridus',
    period: 'Cretaceous',
    subEpoch: 'Late Maastrichtian',
    eraRangeMya: '68–66 MYA',
    myaMidpoint: 67,
    diet: 'Herbivore',
    lengthMeters: 9.0,
    lengthLabel: '9.0 m',
    heightMeters: 3.0,
    weightTons: 10.5,
    weightLabel: '10.5 t',
    speedKmh: 32,
    speedLabel: '32 km/h',
    biteForceN: '12,000 N',
    shortDescription:
      'Bearing a solid bone neck frill and dual meter-long brow horns, Triceratops was a heavily armored ceratopsian browser that stood its ground against the largest predators.',
    habitatTitle: 'Laramidia Lowland Woodlands',
    habitatDescription:
      'Open fern prairies and cycad thickets bordering seasonal floodplains, where Triceratops sheared fibrous vegetation with self-sharpening dental batteries.',
    discoveryLocation: 'Denver Basin, Colorado, USA',
    discoveryYear: 1887,
    fieldNotes: [
      'The skull alone could exceed 2.5 meters in length—nearly one-third of the entire animal.',
      'Healed puncture lesions on fossilized frills prove active horn-locking combat with Tyrannosaurus rex.',
      'Possessed up to 800 tightly packed teeth arranged in vertical shearing columns.',
    ],
    theme: PRESET_THEMES.floodplain,
    sceneType: 'floodplain',
    speciesKey: 'triceratops',
  },
  {
    id: 'velociraptor',
    catalogNumber: 'SPEC-009',
    name: 'Velociraptor',
    nickname: 'Feathered Dune Stalker',
    scientificName: 'Velociraptor mongoliensis',
    period: 'Cretaceous',
    subEpoch: 'Campanian',
    eraRangeMya: '75–71 MYA',
    myaMidpoint: 73,
    diet: 'Carnivore',
    lengthMeters: 2.0,
    lengthLabel: '2.0 m',
    heightMeters: 0.75,
    weightTons: 0.045,
    weightLabel: '45 kg',
    speedKmh: 64,
    speedLabel: '64 km/h',
    biteForceN: '1,200 N',
    shortDescription:
      'An agile dromaeosaurid covered in pennaceous feathers, armed with a hyper-extensible 6.5 cm sickle claw on each hind foot used to pin struggling desert prey.',
    habitatTitle: 'Djadochta Aeolian Sand Dunes',
    habitatDescription:
      'Arid wind-sculpted red sandstone dunes interspersed with ephemeral oases and scrubby conifers across prehistoric central Asia.',
    discoveryLocation: 'Gobi Desert, Mongolia',
    discoveryYear: 1923,
    fieldNotes: [
      'Quill knobs preserved on the ulna bone confirm full wing-like forelimb plumage.',
      'The famous "Fighting Dinosaurs" specimen preserves a Velociraptor locked in mortal combat with a Protoceratops buried by a collapsing sand dune.',
      'Stiffened tail rods allowed rapid tight-radius turns at high sprint speeds.',
    ],
    theme: PRESET_THEMES.desert,
    sceneType: 'desert',
    speciesKey: 'velociraptor',
  },
  {
    id: 'stegosaurus',
    catalogNumber: 'SPEC-010',
    name: 'Stegosaurus',
    nickname: 'Kite-Plated Sentinel',
    scientificName: 'Stegosaurus stenops',
    period: 'Jurassic',
    subEpoch: 'Late Jurassic',
    eraRangeMya: '155–150 MYA',
    myaMidpoint: 152.5,
    diet: 'Herbivore',
    lengthMeters: 9.0,
    lengthLabel: '9.0 m',
    heightMeters: 4.1,
    weightTons: 5.3,
    weightLabel: '5.3 t',
    speedKmh: 16,
    speedLabel: '16 km/h',
    shortDescription:
      'Instantly recognizable by its double alternating row of 17 vascularized dorsal plates and a lethal four-spiked thagomizer tail used to fend off Jurassic theropods.',
    habitatTitle: 'Semi-Arid Horsetail Savannas',
    habitatDescription:
      'Low-growing carpets of horsetails, ferns, and mosses bordering braided stream channels and rocky uplands.',
    discoveryLocation: 'Morrison Formation, Wyoming, USA',
    discoveryYear: 1877,
    fieldNotes: [
      'Grooves in the bony dorsal plates housed dense blood vessel networks for rapid thermoregulation and flushing display.',
      'Allosaurus vertebrae have been excavated with puncture holes matching the exact geometry of Stegosaurus tail spikes.',
      'Throat was protected by a tight mosaic of pebble-like ossicles (gular armor).',
    ],
    theme: PRESET_THEMES.ridge,
    sceneType: 'ridge',
    speciesKey: 'stegosaurus',
  },
  {
    id: 'spinosaurus',
    catalogNumber: 'SPEC-011',
    name: 'Spinosaurus',
    nickname: 'Sail-Backed River Sovereign',
    scientificName: 'Spinosaurus aegyptiacus',
    period: 'Cretaceous',
    subEpoch: 'Cenomanian',
    eraRangeMya: '99–93.5 MYA',
    myaMidpoint: 96,
    diet: 'Piscivore',
    lengthMeters: 15.0,
    lengthLabel: '15.0 m',
    heightMeters: 4.8,
    weightTons: 7.4,
    weightLabel: '7.4 t',
    speedKmh: 24,
    speedLabel: '24 km/h',
    biteForceN: '20,000 N',
    shortDescription:
      'The longest known terrestrial carnivore, adapted for an amphibious lifestyle with dense bone ballast, conical interlocking teeth, a 1.8m dorsal sail, and a paddle-like finned tail.',
    habitatTitle: 'Kem Kem Mangrove Estuaries',
    habitatDescription:
      'Vast tidal river deltas teeming with giant sawfish, lungfish, and coelacanths cutting through North African coastal swamps.',
    discoveryLocation: 'Bahariya Oasis, Egypt & Morocco',
    discoveryYear: 1912,
    fieldNotes: [
      'Neurovascular pits at the tip of the crocodile-like snout detected underwater water-pressure waves in murky delta currents.',
      'High bone density (osteosclerosis) allowed effortless buoyancy control while stalking giant freshwater fish.',
      'Tall neural spines formed a towering dorsal sail visible across river bends.',
    ],
    theme: PRESET_THEMES.lagoon,
    sceneType: 'lagoon',
    speciesKey: 'spinosaurus',
  },
  {
    id: 'carnotaurus',
    catalogNumber: 'SPEC-012',
    name: 'Carnotaurus',
    nickname: 'Bull-Horned Sprint Predator',
    scientificName: 'Carnotaurus sastrei',
    period: 'Cretaceous',
    subEpoch: 'Maastrichtian',
    eraRangeMya: '71–69 MYA',
    myaMidpoint: 70,
    diet: 'Carnivore',
    lengthMeters: 8.2,
    lengthLabel: '8.2 m',
    heightMeters: 3.0,
    weightTons: 1.8,
    weightLabel: '1.8 t',
    speedKmh: 56,
    speedLabel: '56 km/h',
    biteForceN: '3,350 N',
    shortDescription:
      'An explosive Patagonian abelisaurid with thick bull-like frontal horns, vestigial four-fingered arms, and hypertrophied caudofemoralis tail muscles built for high-velocity sprints.',
    habitatTitle: 'La Colonia Estuarine Badlands',
    habitatDescription:
      'Warm coastal estuaries and volcanic badlands across southern Gondwana.',
    discoveryLocation: 'Chubut Province, Patagonia, Argentina',
    discoveryYear: 1984,
    fieldNotes: [
      'Preserved with extensive skin impressions showing non-overlapping pebble scales studded with conical osteoderm bosses.',
      'Interlocking caudal ribs stiffened the base of the tail, turbocharging the femoral retractor muscles for unmatched acceleration.',
      'Deep, extraordinarily short skull delivered rapid, repetitive snapping bites.',
    ],
    theme: PRESET_THEMES.badlands,
    sceneType: 'badlands',
    speciesKey: 'carnotaurus',
  },
];
