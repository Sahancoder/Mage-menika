export interface MemoryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  date?: string;
  message?: string;
  order: number;
  focalPoint?: string;
  layout?: 'polaroid' | 'full' | 'paired';
}

const RAW_MEMORY_FILES: Array<{
  src: string;
  layout: MemoryPhoto['layout'];
}> = [
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.09.59.jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.09.59 (1).jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.09.59 (2).jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.00.jpeg', layout: 'full' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.00 (1).jpeg', layout: 'polaroid' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.10.04 (2).jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.01.jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.01 (1).jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.01 (2).jpeg', layout: 'full' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.02.jpeg', layout: 'polaroid' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.11.07.jpeg', layout: 'paired' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.11.13.jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.02 (1).jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.03.jpeg', layout: 'full' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.04.jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.04 (1).jpeg', layout: 'paired' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.12.21.jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.05.jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.06.jpeg', layout: 'full' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.37.42.jpeg', layout: 'paired' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.37.43.jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.10.07.jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.11.08.jpeg', layout: 'polaroid' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.37.43 (1).jpeg', layout: 'paired' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.37.43 (2).jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.37.44.jpeg', layout: 'full' },
  { src: '/images/places we visited/WhatsApp Image 2026-11-15 at 20.37.44 (1).jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.37.56.jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.37.56 (1).jpeg', layout: 'paired' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.37.57.jpeg', layout: 'polaroid' },
  { src: '/images/memories/WhatsApp Image 2026-11-15 at 20.37.57 (1).jpeg', layout: 'full' },
];

/**
 * Single continuous memory sequence.
 * No categories, chapters, or invented personal dates/captions.
 * Add, remove, reorder, or customize optional captions/dates here without editing UI components.
 */
export const memoryPhotos: MemoryPhoto[] = RAW_MEMORY_FILES.map((item, index) => {
  const slot = String(index + 1).padStart(2, '0');
  return {
    id: `memory-${slot}`,
    src: encodeURI(item.src),
    alt: `අපේ මතකය ${slot}`,
    order: index + 1,
    focalPoint: 'center',
    layout: item.layout,
  };
});

export function getOrderedMemories(photos: MemoryPhoto[] = memoryPhotos): MemoryPhoto[] {
  return [...photos].sort((a, b) => a.order - b.order);
}
