import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { MemoryPhoto } from '../../data/memories';

interface PhotoLightboxProps {
  photos: MemoryPhoto[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}

export function PhotoLightbox({
  photos,
  activeIndex,
  onClose,
  onChangeIndex,
}: PhotoLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isOpen = activeIndex !== null && photos[activeIndex] !== undefined;
  const current = isOpen ? photos[activeIndex] : null;

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    closeButtonRef.current?.focus();

    // Preload next & previous images for smooth swiping
    const adjacent = [photos[activeIndex + 1], photos[activeIndex - 1]].filter(Boolean);
    for (const item of adjacent) {
      const img = new Image();
      img.src = item.src;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && activeIndex < photos.length - 1) {
        onChangeIndex(activeIndex + 1);
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        onChangeIndex(activeIndex - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, activeIndex, photos, onClose, onChangeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || activeIndex === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;
    touchStartX.current = null;

    if (Math.abs(diff) < 42) return;
    if (diff > 0 && activeIndex < photos.length - 1) {
      onChangeIndex(activeIndex + 1);
    } else if (diff < 0 && activeIndex > 0) {
      onChangeIndex(activeIndex - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && current && activeIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1c1111]/90 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="ඡායාරූපය වහන්න"
            className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-[#c89983]/45 bg-[#2f2020]/85 text-[#fff9f0] hover:bg-[#462d30] cursor-pointer"
          >
            <X size={20} aria-hidden="true" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (activeIndex > 0) onChangeIndex(activeIndex - 1);
            }}
            disabled={activeIndex <= 0}
            aria-label="පෙර ඡායාරූපය"
            className="hidden sm:grid h-12 w-12 place-items-center rounded-full border border-[#c89983]/40 bg-[#2f2020]/75 text-[#fff9f0] mr-4 hover:bg-[#462d30] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <motion.div
            key={current.id}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[#fff9f0] p-3 sm:p-5 pb-6 rounded-sm shadow-2xl border border-[#c89983]/40"
          >
            <div className="relative max-h-[70dvh] w-full overflow-hidden bg-[#f4e8d3] flex items-center justify-center">
              <img
                src={current.src}
                alt={current.alt}
                className="max-h-[70dvh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-[#462d30] px-1">
              <div>
                {current.caption && (
                  <p className="text-base sm:text-lg font-medium">{current.caption}</p>
                )}
                {current.message && (
                  <p className="text-sm text-[#764d45] mt-1">{current.message}</p>
                )}
              </div>
              <span className="ml-auto shrink-0 font-display-en text-xs tracking-widest text-[#764d45]/80">
                {activeIndex + 1} / {photos.length}
              </span>
            </div>

            {/* Mobile navigation row */}
            <div className="mt-4 flex sm:hidden items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => activeIndex > 0 && onChangeIndex(activeIndex - 1)}
                disabled={activeIndex <= 0}
                className="vintage-btn !min-h-[40px] !px-4 !py-1.5 text-xs disabled:opacity-35"
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>පෙර</span>
              </button>
              <button
                type="button"
                onClick={() => activeIndex < photos.length - 1 && onChangeIndex(activeIndex + 1)}
                disabled={activeIndex >= photos.length - 1}
                className="vintage-btn !min-h-[40px] !px-4 !py-1.5 text-xs disabled:opacity-35"
              >
                <span>ඊළඟ</span>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (activeIndex < photos.length - 1) onChangeIndex(activeIndex + 1);
            }}
            disabled={activeIndex >= photos.length - 1}
            aria-label="ඊළඟ ඡායාරූපය"
            className="hidden sm:grid h-12 w-12 place-items-center rounded-full border border-[#c89983]/40 bg-[#2f2020]/75 text-[#fff9f0] ml-4 hover:bg-[#462d30] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

