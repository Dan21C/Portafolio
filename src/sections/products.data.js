/* Centralized product + asset configuration for the Products (APX) section.
   Swap the paths below once real photography exists — nothing else needs to change.

   Order here drives both the DOM/tab order and the mobile carousel sequence.
   HoloFrame opens (signature, hero slot) and Levitate closes (premium, hero slot) —
   Data Intelligence and Software Studio sit right after the opener, in the two
   medium/center slots, so they read as core pillars instead of an afterthought.

   objectPosition: drives the card image's CSS transform-origin (not object-position —
   the cards crop via a scaled-up transform, not native object-fit slack), as "X% Y%".
   Tuned per product against the actual source photo so the subject lands roughly
   centered in the visible crop instead of pushed toward an edge — X for photos where
   the subject isn't horizontally centered (imagine-ai), Y for how high/low it sits. */

const asset = (filename) => `/Assets/Products/${filename}.png`;

export const productBackground = {
  poster: '/Assets/Products/products-bg-final.png',
  video: '/Assets/Animation/products-bg.mp4',
};

export const products = [
  {
    id: 'holo-frame',
    name: 'HoloFrame',
    description: 'Contenido holográfico controlado por gestos.',
    image: asset('apx-holoframe'),
    objectPosition: '50% 41%',
    layout: 'hero-left',
  },
  {
    id: 'data-intelligence',
    name: 'Data Intelligence',
    description: 'Datos de experiencias convertidos en decisiones.',
    image: asset('apx-data-intelligence'),
    objectPosition: '50% 23%',
    layout: 'medium',
  },
  {
    id: 'software-studio',
    name: 'Software Studio',
    description: 'Plataformas y sistemas construidos a la medida.',
    image: asset('apx-software-studio'),
    objectPosition: '50% 12%',
    layout: 'medium',
  },
  {
    id: 'reflex-matrix',
    name: 'Reflex Matrix',
    description: 'Arena interactiva de velocidad y reflejos.',
    image: asset('apx-reflex-matrix'),
    objectPosition: '50% 35%',
    layout: 'small',
  },
  {
    id: 'vector-maze',
    name: 'Vector Maze',
    description: 'Desafío phygital de precisión y control.',
    image: asset('apx-vector-maze'),
    objectPosition: '50% 0%',
    layout: 'small',
  },
  {
    id: 'touch-duel',
    name: 'Touch Duel',
    description: 'Mesa multitáctil para retos cara a cara.',
    image: asset('apx-touch-duel'),
    objectPosition: '50% 0%',
    layout: 'small',
  },
  {
    id: 'imagine-ai',
    name: 'Imagine AI',
    description: 'Experiencias generativas que convierten ideas en contenido.',
    image: asset('apx-imagine-ai'),
    /* Source photo is a wide shot: kiosk on the left, person on the right.
       Anchor left of center so the crop keeps the kiosk screen, not the gap
       between the two subjects. */
    objectPosition: '32% 0%',
    layout: 'small',
  },
  {
    id: 'levitate',
    name: 'Levitate',
    description: 'Exhibición magnética para productos protagonistas.',
    image: asset('apx-levitate'),
    objectPosition: '50% 33%',
    layout: 'hero-right',
  },
];

/* Very small per-card parallax offsets (px), applied on scroll. Kept subtle on purpose. */
export const parallaxOffsets = {
  'holo-frame': -8,
  'data-intelligence': 8,
  'software-studio': -6,
  'reflex-matrix': 6,
  'vector-maze': -4,
  'touch-duel': 5,
  'imagine-ai': -5,
  'levitate': 7,
};
