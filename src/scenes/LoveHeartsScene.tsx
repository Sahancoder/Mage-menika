import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, Heart, X } from 'lucide-react';
import { loveMessages, type LoveMessage } from '../data/loveMessages';
import { storyContent } from '../data/storyContent';
import { PressedFlower } from '../components/ui/VintageDecorations';

interface LoveHeartsSceneProps {
  onContinue: () => void;
  replayKey: number;
}

export function LoveHeartsScene({ onContinue, replayKey }: LoveHeartsSceneProps) {
  const [selectedNote, setSelectedNote] = useState<LoveMessage | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelectedNote(null);
    setOpenedIds([]);
  }, [replayKey]);

  useEffect(() => {
    if (!selectedNote) return;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNote(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNote]);

  const openHeart = (item: LoveMessage) => {
    window.dispatchEvent(new CustomEvent('story-sound', { detail: 'note' }));
    setSelectedNote(item);
    setOpenedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
  };

  return (
    <section
      id="love-hearts"
      className="story-scene surface-parchment relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      aria-labelledby="love-hearts-title"
    >
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="font-display-en text-xs uppercase tracking-[0.26em] text-[#764d45]/80 mb-2">
          {storyContent.loveHearts.eyebrow}
        </p>
        <h2
          id="love-hearts-title"
          className="text-2xl sm:text-4xl font-semibold text-[#462d30] leading-snug mb-3"
        >
          {storyContent.loveHearts.title}
        </h2>
        <p className="text-sm sm:text-base text-[#764d45]/90 max-w-lg mx-auto mb-12">
          {storyContent.loveHearts.hint}
        </p>

        {/* 10 Interactive Hearts */}
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 max-w-2xl mx-auto"
          role="group"
          aria-label="ආදර සටහන්"
        >
          {loveMessages.map((item, idx) => {
            const isOpened = openedIds.includes(item.id);
            const isSelected = selectedNote?.id === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => openHeart(item)}
                whileHover={{ scale: 1.07, y: -3 }}
                whileTap={{ scale: 0.96 }}
                animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
                aria-label={`${item.title} අරින්න`}
                aria-pressed={isOpened}
                className={`group relative flex flex-col items-center justify-center rounded-2xl p-4 sm:p-5 border transition-colors cursor-pointer min-h-[108px] ${
                  isOpened
                    ? 'bg-[#fff9f0]/95 border-[#c89983] shadow-md'
                    : 'bg-[#fff9f0]/65 border-[#a67c52]/30 shadow-sm hover:bg-[#fff9f0]'
                }`}
              >
                <Heart
                  size={34}
                  aria-hidden="true"
                  className={`transition-colors duration-300 ${
                    isOpened
                      ? 'fill-[#b85d64] text-[#8b3b44]'
                      : 'fill-[#e5b6aa]/75 text-[#8b3b44] group-hover:fill-[#c87d84]'
                  }`}
                />
                <span className="mt-2.5 text-xs font-sinhala-sans text-[#764d45]">
                  {item.title}
                </span>
                {isOpened && (
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 text-[10px] text-[#8b3b44]"
                  >
                    ✓
                  </span>
                )}
                <span className="sr-only">#{idx + 1}</span>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-6 text-xs sm:text-sm text-[#764d45]/80 font-sinhala-sans" aria-live="polite">
          කියවූ සටහන්: {openedIds.length} / {loveMessages.length}
        </p>

        <div className="mt-12">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('story-sound', { detail: 'paper' }));
              onContinue();
            }}
            className="vintage-btn"
          >
            <span>{storyContent.loveHearts.continueLabel}</span>
            <ArrowDown size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Vintage Note Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="love-note-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2f2020]/70 backdrop-blur-xs p-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="parchment-sheet relative max-w-md w-full rounded-md px-7 py-9 text-center"
            >
              {/* Decorative rose petals / flower */}
              <PressedFlower
                variant="rose"
                className="mx-auto mb-3 w-16 h-16 opacity-90"
              />

              <button
                ref={closeRef}
                type="button"
                onClick={() => setSelectedNote(null)}
                aria-label={storyContent.loveHearts.closeNoteLabel}
                className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full text-[#764d45] hover:bg-[#a67c52]/15 cursor-pointer"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p
                id="love-note-title"
                className="font-sinhala-sans text-xs uppercase tracking-widest text-[#764d45]/75 mb-3"
              >
                {selectedNote.title}
              </p>

              <p className="text-lg sm:text-xl text-[#462d30] leading-[1.95] font-medium">
                “{selectedNote.message}”
              </p>

              <div className="mt-7">
                <button
                  type="button"
                  onClick={() => setSelectedNote(null)}
                  className="vintage-btn !min-h-[42px] !px-5 !py-2 text-sm"
                >
                  {storyContent.loveHearts.closeNoteLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

