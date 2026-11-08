import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCard3DTransform,
  clampIndex,
  computeDragSnapIndex,
  filterAndSortDinos,
  validateNewDinoInput,
} from './carouselMath';
import { INITIAL_DINOS } from '../data/dinos';

test('computeCard3DTransform returns flat centered transform for offset 0', () => {
  const center = computeCard3DTransform(0, false);
  assert.equal(center.rotateY, 0);
  assert.equal(center.translateX, 0);
  assert.equal(center.translateZ, 0);
  assert.equal(center.scale, 1);
  assert.equal(center.brightness, 1);
  assert.equal(center.isVisible, true);
});

test('computeCard3DTransform folds left cards +55 deg and right cards -55 deg on tablet/desktop', () => {
  const left1 = computeCard3DTransform(-1, false);
  const right1 = computeCard3DTransform(1, false);

  assert.equal(left1.rotateY, 55);
  assert.equal(right1.rotateY, -55);

  // offset = 1 -> 1 * 38 + 190 = 228; offset = -1 -> -1 * 38 - 190 = -228
  assert.equal(right1.translateX, 228);
  assert.equal(left1.translateX, -228);

  assert.equal(right1.translateZ, -90);
  assert.equal(left1.translateZ, -90);

  assert.equal(right1.scale, 0.96);
  assert.equal(right1.brightness, 0.75);
});

test('computeCard3DTransform uses 60 deg angle on mobile and caps visibility at +-7 cards', () => {
  const mobileLeft = computeCard3DTransform(-2, true);
  assert.equal(mobileLeft.rotateY, 60);
  assert.equal(mobileLeft.isVisible, true);

  const farCard = computeCard3DTransform(8, false);
  assert.equal(farCard.isVisible, false);
});

test('computeDragSnapIndex snaps with drag distance and inertia and clamps within bounds', () => {
  // Swiping left (negative deltaX) moves to next card(s)
  assert.equal(computeDragSnapIndex(0, -110, -200, 12), 2);
  // Swiping right at index 0 clamps at 0
  assert.equal(computeDragSnapIndex(0, 150, 300, 12), 0);
  // Swiping left at last card clamps at 11
  assert.equal(computeDragSnapIndex(11, -200, -400, 12), 11);
});

test('filterAndSortDinos filters by name, period, and diet accurately and preserves the 7 external redirect links', () => {
  // Verify the first 7 dinosaurs and their exact redirect URLs
  assert.equal(INITIAL_DINOS[0].id, 'shastasaurus');
  assert.equal(INITIAL_DINOS[0].externalUrl, 'https://shastasaurus.vercel.app/');
  assert.equal(INITIAL_DINOS[1].id, 'mosasaurus');
  assert.equal(INITIAL_DINOS[1].externalUrl, 'https://marinereptile.vercel.app/');
  assert.equal(INITIAL_DINOS[2].id, 'tyrannosaurus-rex');
  assert.equal(INITIAL_DINOS[2].externalUrl, 'https://theropod.vercel.app/');
  assert.equal(INITIAL_DINOS[3].externalUrl, 'https://patagonian.vercel.app/');
  assert.equal(INITIAL_DINOS[4].externalUrl, 'https://patagotitans.vercel.app/');
  assert.equal(INITIAL_DINOS[5].externalUrl, 'https://dreadnoughtuss.vercel.app/');
  assert.equal(INITIAL_DINOS[6].externalUrl, 'https://bruhathkayosaurus.vercel.app/');

  const cretaceousOnly = filterAndSortDinos(INITIAL_DINOS, '', 'Cretaceous', 'All', 'journal');
  assert.ok(cretaceousOnly.length >= 9);
  assert.ok(cretaceousOnly.every((d) => d.period === 'Cretaceous'));

  const searchRaptor = filterAndSortDinos(INITIAL_DINOS, 'velociraptor', 'All', 'All', 'journal');
  assert.equal(searchRaptor.length, 1);
  assert.equal(searchRaptor[0].id, 'velociraptor');

  const sortedByLength = filterAndSortDinos(INITIAL_DINOS, '', 'All', 'All', 'length-desc');
  assert.equal(sortedByLength[0].id, 'bruhathkayosaurus');
  assert.ok(sortedByLength[0].lengthMeters >= sortedByLength[1].lengthMeters);
});

test('validateNewDinoInput rejects empty fields and accepts valid dinosaur data', () => {
  const invalid = validateNewDinoInput({
    name: '',
    nickname: '',
    period: 'Cretaceous',
    diet: 'Carnivore',
    lengthMeters: '-5',
    weightTons: 'abc',
    speedKmh: '',
    shortDescription: 'Too short',
    themeId: 'volcanic',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.lengthMeters);
  assert.ok(invalid.errors.weightTons);
  assert.ok(invalid.errors.speedKmh);
  assert.ok(invalid.errors.shortDescription);

  const valid = validateNewDinoInput({
    name: 'Giganotosaurus',
    nickname: 'Southern Giant',
    period: 'Cretaceous',
    diet: 'Carnivore',
    lengthMeters: '13.2',
    weightTons: '8.2',
    speedKmh: '32',
    shortDescription: 'Massive carcharodontosaurid apex predator from Late Cretaceous Patagonia.',
    themeId: 'volcanic',
  });
  assert.equal(valid.valid, true);
});
