// এই ফাইল ছবি কেটে ভাগ করার স্ক্রিপ্ট থেকে তৈরি (মাপগুলো মূল ছবির পিক্সেলে)
export const CANVAS = { w: 1233, h: 1276 };
export const HEAD_PIVOT = { x: 620, y: 650 };

export type Layer = { file: string; x: number; y: number; w: number; h: number; px?: number; py?: number };

export const LAYERS: Record<'tail' | 'body' | 'bodyOpen' | 'legs' | 'head' | 'eyeL' | 'eyeR' | 'tassel', Layer> = {
  tail: { file: 'tail-clean.png', x: 839, y: 843, w: 261, h: 297, px: 850, py: 1085 },
  body: { file: 'body.webp', x: 35, y: 640, w: 1184, h: 610 },
  bodyOpen: { file: 'body-open-arms-clean.png', x: 140, y: 510, w: 960, h: 720 },
  legs: { file: 'body-legs-clean.png', x: 35, y: 1080, w: 1184, h: 170 },
  head: { file: 'head-clean.png', x: 0, y: 0, w: 1221, h: 665 },
  eyeL: { file: 'eyeL-clean.png', x: 411, y: 342, w: 185, h: 169, px: 503, py: 426 },
  eyeR: { file: 'eyeR-clean.png', x: 680, y: 307, w: 173, h: 157, px: 766, py: 385 },
  tassel: { file: 'tassel-clean.png', x: 143, y: 126, w: 190, h: 391, px: 305, py: 140 },
};
