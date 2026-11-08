import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import type { DinoPage } from '../data/dinos';

export interface DinoHeroProps {
  dino: DinoPage;
  variant: 'card' | 'grid' | 'slice' | 'fullscreen';
  prefersReducedMotion?: boolean;
  onExploreClick?: () => void;
}

/**
 * Renders distinct, multi-layered transparent anatomical SVG dinosaur cutouts
 * for all 12 species (or custom transparent PNG/WebP when `dino.imageUrl` is set).
 * Note: To replace with external transparent PNG/WebP cutouts, set `imageUrl` on any
 * entry in `src/data/dinos.ts`.
 */
export const DinosaurCutoutArtwork: React.FC<{
  dino: DinoPage;
  className?: string;
}> = ({ dino, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (dino.imageUrl && !imgFailed) {
    return (
      <img
        src={dino.imageUrl}
        alt={dino.name}
        width={640}
        height={480}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`object-contain drop-shadow-[0_24px_28px_rgba(0,0,0,0.65)] select-none pointer-events-none ${className}`}
      />
    );
  }

  const gradId = `dino-body-${dino.id}`;
  const bellyGradId = `dino-belly-${dino.id}`;
  const rimGradId = `dino-rim-${dino.id}`;
  const shadowGradId = `dino-shadow-${dino.id}`;
  const { dinoPrimaryHex, dinoSecondaryHex, dinoHighlightHex, accentHex } = dino.theme;

  const renderSpeciesPaths = () => {
    switch (dino.speciesKey) {
      case 'shastasaurus':
        return (
          <g>
            {/* Far Anterior Hydrofoil Flipper & Rear Pelvic Fin */}
            <path
              d="M342 268 Q376 332 418 368 Q364 360 318 292 Z"
              fill={`url(#${shadowGradId})`}
            />
            <path
              d="M174 268 Q152 314 128 338 Q148 296 156 262 Z"
              fill={`url(#${shadowGradId})`}
            />
            {/* Crescent Vertical Caudal Tail Fluke */}
            <path
              d="M72 222 Q28 142 14 96 Q48 162 94 218 Q46 286 18 352 Q36 292 72 222 Z"
              fill={`url(#${gradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="2.5"
            />
            {/* Dorsal Fin */}
            <path
              d="M238 176 Q262 114 304 102 Q292 152 288 180 Z"
              fill={`url(#${gradId})`}
            />
            {/* Colossal Streamlined Fusiform Ichthyosaur Body & Tapering Rostrum */}
            <path
              d="M68 220 Q186 154 334 166 Q436 176 558 214 L574 224 L468 228 L554 242 Q438 256 348 274 Q202 292 68 228 Z"
              fill={`url(#${gradId})`}
            />
            {/* Bioluminescent Pelagic Counter-Shading */}
            <path
              d="M96 232 Q232 280 356 266 Q432 252 518 238 L458 226 Q346 244 218 238 Z"
              fill={`url(#${bellyGradId})`}
              opacity={0.82}
            />
            {/* Giant Deep-Sea Scleral Ring Eye */}
            <circle cx="446" cy="204" r="10.5" fill={dinoHighlightHex} />
            <circle cx="447" cy="204" r="5.5" fill="#060B16" />
            <circle cx="444" cy="201" r="2.2" fill="#FFFFFF" />
            {/* Rim Light Along Dorsal Crest */}
            <path
              d="M84 212 Q212 158 352 170 Q442 180 546 212"
              stroke={`url(#${rimGradId})`}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Swept-Back Near Pectoral Hydrofoil Flipper */}
            <path
              d="M348 242 Q328 334 276 392 Q364 358 394 256 Z"
              fill={`url(#${gradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="2.5"
            />
            {/* Near Pelvic Fin */}
            <path
              d="M196 254 Q174 316 144 348 Q198 326 218 260 Z"
              fill={`url(#${gradId})`}
            />
          </g>
        );

      case 'mosasaurus':
        return (
          <g>
            {/* Far Paddle Flippers */}
            <path
              d="M352 266 L396 346 L362 356 L326 276 Z"
              fill={`url(#${shadowGradId})`}
            />
            <path
              d="M204 268 L178 338 L152 332 L182 264 Z"
              fill={`url(#${shadowGradId})`}
            />
            {/* Powerful Bilobed Hypocercal Shark-Like Tail Fluke */}
            <path
              d="M16 208 Q68 152 126 198 Q168 222 198 226 L194 268 Q132 272 64 316 Q42 264 16 208 Z"
              fill={`url(#${gradId})`}
            />
            {/* Dorsal Ridge Crest Scales */}
            <path
              d="M138 202 L146 186 L156 204 L166 186 L176 204 L188 184 L198 202 L212 182 L224 200 L240 180 L254 198 L270 178 L286 196 L304 178 L320 196"
              stroke={dinoHighlightHex}
              strokeWidth="3.5"
              strokeLinejoin="round"
              fill="none"
              opacity={0.75}
            />
            {/* Muscular Serpentine Marine Reptile Torso & Heavy Conical Skull */}
            <path
              d="M178 222 Q278 176 388 188 L438 164 L568 186 L562 206 L456 206 L554 238 L432 244 Q378 272 288 278 Q224 278 178 264 Z"
              fill={`url(#${gradId})`}
            />
            {/* Ventral Counter-Shading */}
            <path
              d="M188 256 Q292 274 398 248 L386 226 Q288 248 192 238 Z"
              fill={`url(#${bellyGradId})`}
              opacity={0.76}
            />
            {/* Conical Maxillary, Dentary & Pterygoid Teeth */}
            <path
              d="M466 206 L472 216 L480 206 L488 217 L496 206 L504 217 L512 206 L520 216 L528 206 L536 215 L544 206"
              stroke="#FFFBEB"
              strokeWidth="3"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M472 232 L478 222 L486 232 L494 222 L502 232 L510 222 L518 232 L526 222"
              stroke="#FDE68A"
              strokeWidth="2.5"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Apex Marine Reptile Eye */}
            <circle cx="448" cy="184" r="6" fill={dinoHighlightHex} />
            <circle cx="449" cy="184" r="2.5" fill="#090D16" />
            {/* Near Webbed Hydrofoil Paddle Limbs */}
            <path
              d="M348 244 Q332 322 292 368 Q358 352 384 260 Z"
              fill={`url(#${gradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="2.5"
            />
            <path
              d="M218 252 Q196 314 166 348 Q216 334 242 260 Z"
              fill={`url(#${gradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="2"
            />
          </g>
        );

      case 'trex':
        return (
          <g>
            {/* Far Hindleg in deep shadow */}
            <path
              d="M262 292 Q245 335 248 375 L226 415 L264 418 L278 380 Q288 345 292 302 Z"
              fill={`url(#${shadowGradId})`}
            />
            {/* Heavy Counter-Balanced Tail */}
            <path
              d="M14 258 Q105 232 238 225 L258 292 Q132 292 14 258 Z"
              fill={`url(#${gradId})`}
            />
            {/* Muscular Torso & S-Curved Neck */}
            <path
              d="M210 228 Q295 204 352 152 Q382 118 402 86 L458 118 Q440 182 392 244 Q338 308 235 298 Z"
              fill={`url(#${gradId})`}
            />
            {/* Ribcage & Ventral Counter-Shading */}
            <path
              d="M115 272 Q245 295 345 268 Q392 238 424 168 L398 162 Q358 238 242 268 Z"
              fill={`url(#${bellyGradId})`}
              opacity={0.78}
            />
            {/* Dorsal Scales & Transverse Muscle Stripes */}
            <path
              d="M160 238 L166 262 M195 230 L204 260 M232 222 L242 258 M270 212 L282 252 M308 196 L322 238 M342 172 L358 214"
              stroke={dinoPrimaryHex}
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity={0.55}
            />
            {/* Massive Fenestrated Skull & Heavy Lower Jaw */}
            <path
              d="M388 92 Q442 58 532 76 Q558 88 552 118 L466 124 L538 146 Q522 172 454 162 L402 134 Z"
              fill={`url(#${gradId})`}
            />
            {/* Brow Ridge & Nasal Bosses */}
            <path
              d="M418 76 Q468 62 534 78"
              stroke={dinoHighlightHex}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Serrated Maxillary & Dentary Teeth */}
            <path
              d="M468 122 L474 134 L480 122 L487 136 L494 122 L501 135 L509 121 L516 134 L524 120 L531 132 L538 119"
              stroke="#FFFBEB"
              strokeWidth="3.2"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M475 142 L481 132 L487 143 L494 133 L501 144 L508 134 L516 145"
              stroke="#FDE68A"
              strokeWidth="2.5"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Predator Eye with Scleral Ring */}
            <circle cx="444" cy="94" r="6" fill={dinoHighlightHex} />
            <circle cx="445" cy="94" r="2.4" fill="#090D16" />
            <circle cx="443" cy="92" r="1.2" fill="#FFFFFF" />
            {/* Rim Light Along Back */}
            <path
              d="M45 252 Q185 225 325 174 Q372 132 400 88"
              stroke={`url(#${rimGradId})`}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Two-Fingered Forelimb */}
            <path
              d="M380 220 L414 248 L404 264 M414 248 L425 256"
              stroke={dinoSecondaryHex}
              strokeWidth="8.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Near Muscular Hindleg & Three-Toed Talons */}
            <path
              d="M258 252 Q324 278 314 344 L292 404 L336 418 L268 418 L274 348 Q246 312 258 252 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M328 418 L342 420 M312 418 L324 421"
              stroke="#FFFBEB"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        );

      case 'triceratops':
        return (
          <g>
            {/* Heavy Tail */}
            <path
              d="M38 315 Q112 278 178 258 L188 322 Q112 332 38 315 Z"
              fill={`url(#${gradId})`}
            />
            {/* Far Legs */}
            <path d="M182 302 L164 418 L200 418 L218 312 Z" fill={`url(#${shadowGradId})`} />
            <path d="M322 308 L314 418 L348 418 L358 312 Z" fill={`url(#${shadowGradId})`} />
            {/* Massive Barrel Torso */}
            <path
              d="M152 242 Q255 178 378 222 L388 338 Q265 358 162 322 Z"
              fill={`url(#${gradId})`}
            />
            {/* Ventral Shading & Skin Folds */}
            <path
              d="M175 315 Q275 348 375 325 L370 295 Q275 318 182 292 Z"
              fill={`url(#${bellyGradId})`}
              opacity={0.65}
            />
            {/* Near Muscular Forelimb & Hindlimb */}
            <path d="M206 288 L192 420 L234 420 L250 308 Z" fill={`url(#${gradId})`} />
            <path d="M344 290 L352 420 L392 420 L384 290 Z" fill={`url(#${gradId})`} />
            {/* Iconic Parietal-Squamosal Bone Frill */}
            <path
              d="M350 212 Q334 96 426 104 Q482 120 456 238 Z"
              fill={`url(#${gradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="3.5"
            />
            {/* Frill Eye-Spots / Vascular Patterning */}
            <ellipse cx="408" cy="156" rx="22" ry="14" fill={dinoHighlightHex} opacity={0.28} />
            {/* Epoccipital Marginal Spikes */}
            <circle cx="364" cy="138" r="7.5" fill={dinoHighlightHex} />
            <circle cx="392" cy="112" r="8.5" fill={dinoHighlightHex} />
            <circle cx="428" cy="114" r="8.5" fill={dinoHighlightHex} />
            <circle cx="454" cy="142" r="7.5" fill={dinoHighlightHex} />
            <circle cx="462" cy="176" r="6.5" fill={dinoHighlightHex} />
            {/* Armored Skull & Rhamphotheca Beak */}
            <path
              d="M392 186 L518 242 L540 286 L476 298 L382 266 Z"
              fill={`url(#${gradId})`}
            />
            {/* Twin Keratinous Brow Horns & Nasal Horn */}
            <path d="M422 178 Q508 140 576 122 Q518 168 434 200 Z" fill="#FEF3C7" />
            <path d="M408 192 Q488 158 548 144 Q498 182 420 208 Z" fill="#FDE68A" />
            <path d="M506 240 L536 208 L522 256 Z" fill="#FEF3C7" />
            <circle cx="438" cy="220" r="5.5" fill={dinoHighlightHex} />
            <circle cx="439" cy="220" r="2.2" fill="#090D16" />
          </g>
        );

      case 'velociraptor':
        return (
          <g>
            {/* Stiffened Feathered Tail Rod */}
            <path
              d="M22 222 Q142 232 246 254 L240 282 Q132 260 22 222 Z"
              fill={`url(#${gradId})`}
            />
            {/* Caudal Feather Fan */}
            <path
              d="M14 218 Q65 190 122 214 Q68 250 14 218 Z"
              fill={dinoHighlightHex}
              opacity={0.9}
            />
            {/* Agile Predatory Torso & Neck */}
            <path
              d="M222 248 Q308 232 374 166 Q404 126 424 94 L456 110 Q436 164 396 220 Q334 296 232 286 Z"
              fill={`url(#${gradId})`}
            />
            {/* Narrow Snout & Pennaceous Occipital Crest */}
            <path
              d="M414 96 L446 68 L438 90 L466 74 L452 96 L538 104 L528 124 L456 124 L518 138 L442 135 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M468 122 L474 128 L480 122 L486 128 L492 122 L498 128"
              stroke="#FFFBEB"
              strokeWidth="2.2"
              fill="none"
            />
            <circle cx="458" cy="105" r="4.8" fill={dinoHighlightHex} />
            <circle cx="459" cy="105" r="2" fill="#090D16" />
            {/* Pennaceous Wing Forelimb */}
            <path
              d="M350 212 L430 242 Q402 292 330 270 Z"
              fill={`url(#${bellyGradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="2.5"
            />
            {/* Sprinting Hindlegs with Hyper-Extensible Sickle Claw */}
            <path
              d="M262 268 L232 356 L282 416 L316 416 L264 356 L294 274 Z"
              fill={`url(#${shadowGradId})`}
            />
            <path
              d="M284 264 L326 334 L356 396 L390 380 Q380 354 362 364 L346 324 L314 264 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M364 384 Q398 350 412 392 Q386 386 364 384 Z"
              fill="#FFFBEB"
            />
          </g>
        );

      case 'brachiosaurus':
        return (
          <g>
            {/* Sweeping Sauropod Tail */}
            <path
              d="M32 386 Q114 354 184 308 L206 356 Q124 392 32 386 Z"
              fill={`url(#${gradId})`}
            />
            {/* High-Shouldered Giraffe-Like Torso */}
            <path
              d="M172 304 Q264 242 346 212 L370 336 Q264 362 184 356 Z"
              fill={`url(#${gradId})`}
            />
            {/* Columnar Limbs (Forelimbs longer than Hindlimbs) */}
            <path d="M186 334 L176 430 L212 430 L222 340 Z" fill={`url(#${shadowGradId})`} />
            <path d="M214 340 L206 435 L242 435 L250 340 Z" fill={`url(#${gradId})`} />
            <path d="M314 304 L310 432 L344 432 L348 304 Z" fill={`url(#${shadowGradId})`} />
            <path d="M338 294 L344 435 L382 435 L372 284 Z" fill={`url(#${gradId})`} />
            {/* Towering Crane Neck & Nasal Arch Crest */}
            <path
              d="M310 234 Q354 142 386 38 L424 46 Q398 158 366 266 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M384 42 Q406 16 434 28 L466 44 L458 64 L396 62 Z"
              fill={`url(#${gradId})`}
            />
            <circle cx="424" cy="42" r="4.5" fill={dinoHighlightHex} />
            <path
              d="M320 224 Q364 134 390 42"
              stroke={`url(#${rimGradId})`}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'stegosaurus':
        return (
          <g>
            {/* Alternating Double Row of Vascularized Kite Plates */}
            <polygon points="152,245 168,192 196,228" fill={dinoHighlightHex} opacity={0.85} />
            <polygon points="192,224 220,152 254,206" fill={accentHex} />
            <polygon points="246,204 282,126 320,196" fill={dinoHighlightHex} />
            <polygon points="306,196 346,138 378,210" fill={accentHex} />
            <polygon points="366,210 398,166 420,230" fill={dinoHighlightHex} opacity={0.9} />
            <polygon points="412,230 436,202 450,254" fill={accentHex} opacity={0.85} />
            {/* Arched Back, Low Neck & Thagomizer Tail */}
            <path
              d="M52 315 Q134 264 244 200 Q346 186 436 254 L498 284 L492 308 L422 295 Q314 346 184 335 Q114 332 52 315 Z"
              fill={`url(#${gradId})`}
            />
            {/* Four Lethal Thagomizer Spikes */}
            <path
              d="M50 312 L18 272 M68 308 L36 264 M58 318 L24 336 M74 316 L44 338"
              stroke="#FEF3C7"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            {/* Limbs */}
            <path d="M214 304 L200 422 L242 422 L256 312 Z" fill={`url(#${gradId})`} />
            <path d="M252 310 L244 418 L278 418 L286 314 Z" fill={`url(#${shadowGradId})`} />
            <path d="M368 294 L362 422 L398 422 L404 302 Z" fill={`url(#${gradId})`} />
            <circle cx="468" cy="284" r="4.5" fill={dinoHighlightHex} />
          </g>
        );

      case 'spinosaurus':
        return (
          <g>
            {/* Towering 1.8m Dorsal Neural Spine Sail */}
            <path
              d="M192 245 Q222 104 298 92 Q370 88 404 214 Z"
              fill={`url(#${bellyGradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="3.5"
            />
            <path
              d="M234 235 L242 138 M272 230 L278 104 M310 228 L316 98 M348 228 L352 116 M378 224 L380 154"
              stroke={dinoPrimaryHex}
              strokeWidth="4.5"
              opacity={0.68}
            />
            {/* Tadpole-Like Finned Propulsion Tail */}
            <path
              d="M14 254 Q94 210 198 236 L198 296 Q94 318 14 254 Z"
              fill={`url(#${gradId})`}
            />
            {/* Semi-Aquatic Torso & Rosette-Tipped Crocodilian Jaws */}
            <path
              d="M184 234 Q304 204 398 204 Q436 184 458 142 L566 156 L560 176 L468 174 L550 192 L452 195 Q422 256 374 288 Q274 312 188 296 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M478 174 L484 182 L492 174 L498 183 L508 174 L516 182 L526 174 L534 183"
              stroke="#FFFBEB"
              strokeWidth="2.8"
              fill="none"
            />
            <circle cx="468" cy="154" r="4.8" fill={dinoHighlightHex} />
            <path d="M256 282 L240 418 L282 418 L298 288 Z" fill={`url(#${gradId})`} />
            <path d="M302 284 L312 412 L346 412 L332 284 Z" fill={`url(#${shadowGradId})`} />
            <path
              d="M392 252 L428 306 L408 324"
              stroke={dinoSecondaryHex}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'ankylosaurus':
        return (
          <g>
            {/* Rigid Tail Handle & Heavy Osseous Tail Club */}
            <path d="M52 294 L176 284 L176 316 L52 308 Z" fill={`url(#${gradId})`} />
            <ellipse cx="46" cy="302" rx="36" ry="24" fill={dinoHighlightHex} />
            <ellipse cx="42" cy="300" rx="26" ry="16" fill={`url(#${gradId})`} />
            {/* Low Fused Osteoderm Carapace */}
            <path
              d="M160 274 Q274 182 420 254 L436 326 Q294 350 160 326 Z"
              fill={`url(#${gradId})`}
            />
            {/* Keeled Dorsal Armor Spikes */}
            <polygon points="194,252 212,216 230,242" fill={dinoHighlightHex} />
            <polygon points="242,232 262,194 284,224" fill={dinoHighlightHex} />
            <polygon points="294,220 318,188 340,220" fill={dinoHighlightHex} />
            <polygon points="352,226 376,198 394,236" fill={dinoHighlightHex} />
            {/* Armored Skull with Pyramidal Squamosal Horns */}
            <path d="M414 264 L500 282 L494 322 L418 318 Z" fill={`url(#${gradId})`} />
            <polygon points="422,264 448,236 456,270" fill="#FEF3C7" />
            <circle cx="462" cy="288" r="4.5" fill={dinoHighlightHex} />
            <path d="M196 314 L186 418 L228 418 L236 318 Z" fill={`url(#${gradId})`} />
            <path d="M358 314 L354 418 L396 418 L396 314 Z" fill={`url(#${gradId})`} />
          </g>
        );

      case 'allosaurus':
        return (
          <g>
            <path
              d="M22 254 Q134 236 242 234 L252 288 Q134 286 22 254 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M224 234 Q314 210 378 156 Q402 124 418 96 L456 116 Q432 182 384 246 Q324 304 238 292 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M404 100 L438 70 L448 86 L530 94 L526 122 L458 124 L520 148 L434 142 Z"
              fill={`url(#${gradId})`}
            />
            <polygon points="432,86 446,58 460,84" fill={dinoHighlightHex} />
            <path
              d="M464 122 L470 130 L478 122 L484 130 L492 122 L500 130 L508 122"
              stroke="#FFFBEB"
              strokeWidth="2.6"
              fill="none"
            />
            <circle cx="448" cy="96" r="4.8" fill="#FFFBEB" />
            <path
              d="M374 214 L418 248 L434 238 M418 248 L428 264"
              stroke={dinoHighlightHex}
              strokeWidth="7.5"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M254 274 L234 416 L272 416 L288 282 Z" fill={`url(#${shadowGradId})`} />
            <path
              d="M274 268 L302 348 L284 418 L328 418 L338 342 L312 268 Z"
              fill={`url(#${gradId})`}
            />
          </g>
        );

      case 'parasaurolophus':
        return (
          <g>
            <path
              d="M22 288 Q124 250 224 236 L236 302 Q124 316 22 288 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M206 236 Q304 206 368 180 Q394 140 404 90 L438 100 Q432 168 398 238 Q338 318 222 306 Z"
              fill={`url(#${gradId})`}
            />
            {/* Hollow Sweeping Acoustic Cranial Crest */}
            <path
              d="M412 88 Q342 38 286 46 Q348 72 402 106 Z"
              fill={dinoHighlightHex}
            />
            <path d="M398 90 L490 106 L486 128 L408 124 Z" fill={`url(#${gradId})`} />
            <circle cx="428" cy="102" r="4.8" fill="#FFFBEB" />
            <path d="M244 292 L228 420 L268 420 L282 295 Z" fill={`url(#${shadowGradId})`} />
            <path d="M274 284 L292 422 L332 422 L314 284 Z" fill={`url(#${gradId})`} />
            <path
              d="M372 248 L398 336 L384 346"
              stroke={dinoSecondaryHex}
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'pteranodon':
        return (
          <g>
            <path
              d="M264 214 Q194 92 72 52 Q154 164 244 236 Z"
              fill={`url(#${shadowGradId})`}
            />
            <path
              d="M274 224 Q366 88 562 54 Q466 198 314 268 Z"
              fill={`url(#${gradId})`}
              stroke={dinoHighlightHex}
              strokeWidth="3.5"
            />
            <path
              d="M242 214 L140 176 L234 238 L294 258 L438 298 L306 232 Z"
              fill={dinoHighlightHex}
            />
            <circle cx="298" cy="242" r="4.8" fill="#090D16" />
          </g>
        );

      case 'diplodocus':
        return (
          <g>
            <path
              d="M8 278 Q104 268 204 244 L216 286 Q104 296 8 278 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M194 242 Q274 206 356 238 L362 316 Q274 326 202 306 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M342 244 Q436 214 538 174 L576 182 L572 198 L534 196 Q442 246 352 292 Z"
              fill={`url(#${gradId})`}
            />
            <circle cx="548" cy="184" r="4" fill={dinoHighlightHex} />
            <path d="M212 294 L204 422 L236 422 L242 298 Z" fill={`url(#${gradId})`} />
            <path d="M244 298 L242 418 L268 418 L272 300 Z" fill={`url(#${shadowGradId})`} />
            <path d="M322 294 L322 422 L352 422 L352 294 Z" fill={`url(#${gradId})`} />
          </g>
        );

      case 'carnotaurus':
      default:
        return (
          <g>
            <path
              d="M22 248 Q134 230 246 226 L256 292 Q134 288 22 248 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M232 226 Q324 204 386 160 Q408 126 418 90 L466 106 Q452 178 402 246 Q338 308 242 296 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M412 94 L496 96 L498 138 L442 138 L488 154 L424 148 Z"
              fill={`url(#${gradId})`}
            />
            <polygon points="422,96 406,54 438,84" fill={dinoHighlightHex} />
            <polygon points="438,94 434,52 458,86" fill="#FEF3C7" />
            <circle cx="452" cy="112" r="4.8" fill={dinoHighlightHex} />
            <circle cx="244" cy="242" r="4.2" fill={dinoHighlightHex} opacity={0.85} />
            <circle cx="284" cy="232" r="4.8" fill={dinoHighlightHex} opacity={0.85} />
            <circle cx="324" cy="218" r="4.8" fill={dinoHighlightHex} opacity={0.85} />
            <circle cx="364" cy="198" r="4.2" fill={dinoHighlightHex} opacity={0.85} />
            <path
              d="M388 232 L412 248"
              stroke={dinoHighlightHex}
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            <path d="M258 278 L234 418 L274 418 L292 285 Z" fill={`url(#${shadowGradId})`} />
            <path
              d="M282 272 L312 348 L294 422 L338 422 L348 342 L318 272 Z"
              fill={`url(#${gradId})`}
            />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 600 450"
      className={`overflow-visible drop-shadow-[0_24px_28px_rgba(0,0,0,0.65)] select-none pointer-events-none ${className}`}
      aria-label={`${dino.name} anatomical illustration`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={dinoSecondaryHex} />
          <stop offset="55%" stopColor={dinoPrimaryHex} />
          <stop offset="100%" stopColor="#090D16" />
        </linearGradient>
        <linearGradient id={shadowGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dinoPrimaryHex} />
          <stop offset="100%" stopColor="#05070C" />
        </linearGradient>
        <linearGradient id={bellyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={dinoHighlightHex} stopOpacity="0.88" />
          <stop offset="100%" stopColor={dinoSecondaryHex} stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={rimGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={dinoHighlightHex} stopOpacity="0.2" />
          <stop offset="50%" stopColor={dinoHighlightHex} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      {/* Ground contact shadow under dinosaur feet */}
      <ellipse cx="300" cy="422" rx="158" ry="14" fill="rgba(0,0,0,0.48)" />

      {renderSpeciesPaths()}
    </svg>
  );
};

export const DinoHero: React.FC<DinoHeroProps> = ({
  dino,
  variant,
  prefersReducedMotion = false,
  onExploreClick,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || variant === 'slice') return;
      const rect = e.currentTarget.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTilt({
        x: Math.max(-14, Math.min(14, normX * 14)),
        y: Math.max(-14, Math.min(14, normY * 14)),
      });
    },
    [prefersReducedMotion, variant]
  );

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const isSlice = variant === 'slice';
  const isGrid = variant === 'grid';
  const isFullscreen = variant === 'fullscreen';

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: dino.theme.skyGradient }}
    >
      {/* Inner Decorative Frame Border on Center Card that the Dinosaur Overlaps ("Popping Out" Effect) */}
      {variant === 'card' && (
        <div
          aria-hidden="true"
          className="absolute inset-3.5 rounded-[12px] border border-white/15 pointer-events-none z-0"
        />
      )}

      {/* LAYER 1: Environment Sky, Prehistoric Sun Orb & Distant Terrain Silhouette */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out"
        style={{
          transform: prefersReducedMotion
            ? undefined
            : `translate3d(${-tilt.x * 0.35}px, ${-tilt.y * 0.35}px, 0) scale(1.04)`,
        }}
      >
        <div
          className="absolute -top-12 right-10 w-56 h-56 rounded-full opacity-35 blur-2xl"
          style={{ background: dino.theme.secondaryHex }}
        />
        <div
          className="absolute top-12 right-16 w-24 h-24 rounded-full opacity-25"
          style={{
            background: `radial-gradient(circle, #FFF 0%, ${dino.theme.secondaryHex} 70%, transparent 100%)`,
          }}
        />

        <svg
          viewBox="0 0 800 320"
          preserveAspectRatio="none"
          className="absolute bottom-0 inset-x-0 w-full h-3/5 opacity-35"
        >
          <path
            d="M0 240 L110 155 L230 210 L380 120 L520 195 L670 135 L800 190 L800 320 L0 320 Z"
            fill={dino.theme.dinoPrimaryHex}
          />
          <path
            d="M0 265 L165 195 L310 245 L490 175 L645 235 L800 185 L800 320 L0 320 Z"
            fill="#090C15"
            opacity="0.65"
          />
        </svg>
      </div>

      {/* LAYER 2: Giant Outlined Display Taxonomic Plate Behind the Creature */}
      {!isSlice && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[14%] flex flex-col items-center justify-center pointer-events-none overflow-hidden transition-transform duration-200 ease-out"
          style={{
            transform: prefersReducedMotion
              ? undefined
              : `translate3d(${-tilt.x * 0.55}px, ${-tilt.y * 0.45}px, 0)`,
          }}
        >
          <span
            className={`font-extrabold uppercase whitespace-nowrap select-none tracking-[0.08em] leading-none text-white/[0.10] ${
              isFullscreen
                ? 'text-[110px] sm:text-[150px] lg:text-[180px]'
                : isGrid
                  ? 'text-[44px]'
                  : 'text-[76px] sm:text-[118px]'
            }`}
            style={{
              WebkitTextStroke: '1.5px rgba(255,255,255,0.16)',
            }}
          >
            {dino.name}
          </span>
        </div>
      )}

      {/* LAYER 3: Centered Dinosaur Cutout (overlapping the inner frame & breathing loop) */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-transform duration-200 ease-out ${
          isSlice
            ? 'scale-110'
            : isFullscreen
              ? 'pb-16 sm:pb-12'
              : isGrid
                ? 'pb-12 pt-4'
                : 'pb-14 sm:pb-16'
        }`}
        style={{
          transform: prefersReducedMotion
            ? undefined
            : `translate3d(${tilt.x * 0.8}px, ${tilt.y * 0.7}px, 0)`,
        }}
      >
        <motion.div
          animate={
            prefersReducedMotion
              ? { scale: 1 }
              : {
                  scale: [1, 1.015, 1],
                  y: [0, -3, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className={
            isFullscreen
              ? 'w-[92%] max-w-[760px] h-[58%] flex items-center justify-center'
              : isGrid
                ? 'w-[90%] h-[68%] flex items-center justify-center'
                : 'w-[108%] max-w-[540px] h-[75%] -ml-3 flex items-center justify-center'
          }
        >
          <DinosaurCutoutArtwork dino={dino} className="w-full h-full" />
        </motion.div>
      </div>

      {/* LAYER 4: Foreground Ferns, Volcanic Basalt Rocks, Mist & Floating Dust Particles */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-transform duration-200 ease-out"
        style={{
          transform: prefersReducedMotion
            ? undefined
            : `translate3d(${tilt.x * 1.0}px, ${tilt.y * 0.9}px, 0) scale(1.03)`,
        }}
      >
        <svg
          viewBox="0 0 800 220"
          preserveAspectRatio="none"
          className="absolute bottom-0 inset-x-0 w-full h-36 opacity-55"
        >
          <path d="M-20 220 Q30 140 110 115 Q55 165 40 220 Z" fill="#070A12" />
          <path d="M0 220 Q65 155 145 148 Q85 182 65 220 Z" fill={dino.theme.dinoPrimaryHex} />
          <path d="M820 220 Q755 135 675 110 Q735 168 750 220 Z" fill="#070A12" />
          <path d="M640 220 L710 168 L795 182 L810 220 Z" fill="#090D16" />
        </svg>

        {!prefersReducedMotion && !isSlice && !isGrid && (
          <div className="absolute inset-0 overflow-hidden">
            {[
              { left: '16%', top: '28%', size: 4, delay: 0 },
              { left: '78%', top: '22%', size: 5, delay: 1.1 },
              { left: '64%', top: '52%', size: 3, delay: 2.2 },
              { left: '28%', top: '64%', size: 4, delay: 0.7 },
              { left: '48%', top: '32%', size: 3, delay: 1.6 },
            ].map((p, idx) => (
              <motion.span
                key={idx}
                animate={{
                  y: [0, -18, 0],
                  x: [0, 8, 0],
                  opacity: [0.2, 0.65, 0.2],
                }}
                transition={{
                  duration: 5 + idx * 0.7,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute rounded-full bg-white/50 blur-[0.5px]"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* WCAG AA Contrast Gradient Scrim */}
      <div
        className="absolute inset-x-0 bottom-0 h-3/5 z-10 pointer-events-none"
        style={{ background: dino.theme.scrimGradient }}
      />

      {/* OVERLAY: Compact on Card, Clean Thumbnail on Grid, Rich with CTA on Fullscreen */}
      {!isSlice && (
        <div
          className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end ${
            isFullscreen
              ? 'p-6 sm:p-10 lg:p-14 max-w-6xl mx-auto'
              : isGrid
                ? 'p-4'
                : 'p-5 sm:p-7'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm"
              style={{
                backgroundColor: `${dino.theme.accentHex}CC`,
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              {isGrid ? dino.period : `${dino.period} · ${dino.eraRangeMya}`}
            </span>
            <span className="text-[11px] font-mono text-white/75 tracking-wider">
              {dino.catalogNumber}
            </span>
            {dino.externalUrl && !isGrid && (
              <span className="px-2 py-0.5 rounded-md bg-white/15 border border-white/25 text-[10px] font-mono text-white/95 tracking-tight">
                {dino.externalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
              </span>
            )}
          </div>

          <h2
            className={`font-extrabold uppercase tracking-tight text-white drop-shadow-md leading-[1.04] ${
              isFullscreen
                ? 'text-3xl sm:text-5xl lg:text-6xl'
                : isGrid
                  ? 'text-lg sm:text-xl truncate'
                  : 'text-2xl sm:text-3xl lg:text-[34px]'
            }`}
          >
            {dino.name}
          </h2>

          {!isGrid && (
            <p
              className={`text-white/80 font-medium mt-1 ${
                isFullscreen ? 'text-base sm:text-lg max-w-2xl' : 'text-xs sm:text-sm line-clamp-1'
              }`}
            >
              {dino.nickname} — <span className="italic text-white/65">{dino.scientificName}</span>
            </p>
          )}

          {isGrid ? (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-white/80 tabular-nums">
              <span>{dino.lengthLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{dino.weightLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-sans font-medium">{dino.diet}</span>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <div className="glass-pill px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Length</span>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-white tabular-nums">
                    {dino.lengthLabel}
                  </span>
                </div>
                <div className="glass-pill px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Weight</span>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-white tabular-nums">
                    {dino.weightLabel}
                  </span>
                </div>
                <div className="glass-pill px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Diet</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">{dino.diet}</span>
                </div>
              </div>

              {isFullscreen && onExploreClick && (
                <button
                  type="button"
                  onClick={onExploreClick}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-white hover:bg-white/90 active:scale-95 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Specimen</span>
                  <span aria-hidden="true">↓</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
