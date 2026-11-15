import { useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import type { MemoryPhoto } from '../../data/memories';
import { PaperClip, PhotoCorner } from '../ui/VintageDecorations';

interface ScrapbookPhotoCardProps {
  photo: MemoryPhoto;
  index: number;
  variant: 'polaroid' | 'full' | 'paired';
  onOpen: (index: number) => void;
}

const ROTATIONS = [-2.2, 1.8, -1.4, 2.1, -1.7, 1.2];

export function ScrapbookPhotoCard({
  photo,
  index,
  variant,
  onOpen,
}: ScrapbookPhotoCardProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20, rotate: rotation * 1.15 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative mx-auto w-full ${
        variant === 'polaroid'
          ? 'max-w-[22rem]'
          : variant === 'full'
            ? 'max-w-2xl'
            : 'max-w-sm'
      }`}
    >
      {/* Occasional paper clip on every 4th photo */}
      {index % 4 === 0 && (
        <PaperClip className="absolute -top-6 right-8 w-6 h-12 z-20 rotate-6 opacity-85" />
      )}

      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`${photo.alt} විශාල කර බලන්න`}
        className="relative block w-full text-left bg-[#fff9f0] p-3 sm:p-4 pb-8 sm:pb-10 rounded-[3px] border border-[#c89983]/35 shadow-[0_16px_34px_-10px_rgba(47,32,32,0.3)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_42px_-10px_rgba(47,32,32,0.36)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#462d30] focus-visible:outline-offset-4"
      >
        {/* Vintage Photo Corners */}
        <PhotoCorner position="tl" />
        <PhotoCorner position="tr" />
        <PhotoCorner position="bl" />
        <PhotoCorner position="br" />

        <div className="relative w-full overflow-hidden bg-[#eadbc5]/55 flex items-center justify-center">
          {!failed ? (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              style={{ objectPosition: photo.focalPoint ?? 'center top' }}
              className={`w-full h-auto max-h-[68dvh] object-contain block mx-auto transition-all duration-700 ease-out group-hover:scale-[1.02] ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#764d45]/75 bg-[#f4e8d3]">
              <span className="text-2xl mb-2" aria-hidden="true">♡</span>
              <span className="text-sm font-sinhala-sans">{photo.alt}</span>
            </div>
          )}

          {/* Subtle warm vignette */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_24px_rgba(47,32,32,0.16)]"
          />

          {/* Subtle zoom icon */}
          <span
            aria-hidden="true"
            className="absolute bottom-2.5 right-2.5 grid h-8 w-8 place-items-center rounded-full bg-[#2f2020]/65 text-[#fff9f0] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Maximize2 size={14} />
          </span>
        </div>

        {/* Optional caption / date / slot number */}
        <figcaption className="mt-3 flex items-baseline justify-between gap-2 px-1 text-[#764d45]">
          <span className="text-sm sm:text-base font-medium leading-snug">
            {photo.caption ?? ''}
          </span>
          <span className="ml-auto shrink-0 font-display-en text-xs tracking-widest opacity-65">
            {photo.date ?? `#${String(photo.order).padStart(2, '0')}`}
          </span>
        </figcaption>

        {photo.message && (
          <p className="mt-1.5 px-1 text-xs sm:text-sm text-[#764d45]/85 leading-relaxed">
            {photo.message}
          </p>
        )}
      </button>
    </motion.figure>
  );
}
