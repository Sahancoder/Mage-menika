import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { storyContent } from '../data/storyContent';
import { getOrderedMemories } from '../data/memories';

interface MemoryBoxSceneProps {
  onEnterScrapbook: () => void;
  replayKey: number;
}

export function MemoryBoxScene({ onEnterScrapbook, replayKey }: MemoryBoxSceneProps) {
  const [boxState, setBoxState] = useState<'closed' | 'opening' | 'open'>('closed');
  const firstPhoto = getOrderedMemories()[0];

  useEffect(() => {
    setBoxState('closed');
  }, [replayKey]);

  const handleOpenBox = () => {
    if (boxState !== 'closed') return;
    window.dispatchEvent(new CustomEvent('story-sound', { detail: 'paper' }));
    setBoxState('opening');

    window.setTimeout(() => {
      setBoxState('open');
      window.dispatchEvent(new CustomEvent('story-sound', { detail: 'note' }));
    }, 520);
  };

  return (
    <section
      id="memory-box"
      className="story-scene surface-desk relative py-24 sm:py-32 px-5 flex flex-col items-center justify-center overflow-hidden"
      aria-labelledby="memory-box-title"
    >
      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center">
        <p className="font-display-en text-xs uppercase tracking-[0.26em] text-[#e5b6aa]/80 mb-2">
          {storyContent.memoryBox.eyebrow}
        </p>
        <h2
          id="memory-box-title"
          className="text-2xl sm:text-4xl font-semibold text-[#fff9f0] mb-10"
        >
          {storyContent.memoryBox.label}
        </h2>

        {/* Antique Keepsake Box */}
        <div className="relative w-[min(86vw,22rem)] h-64 sm:h-72 flex items-end justify-center">
          {/* Rising Photo from inside the box */}
          {firstPhoto && (
            <motion.div
              initial={{ y: 40, scale: 0.72, opacity: 0, rotate: -4 }}
              animate={
                boxState === 'open'
                  ? { y: -62, scale: 1.06, opacity: 1, rotate: -2 }
                  : boxState === 'opening'
                    ? { y: 12, scale: 0.85, opacity: 0.6, rotate: -3 }
                    : { y: 40, scale: 0.72, opacity: 0, rotate: -4 }
              }
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-16 z-20 w-44 sm:w-52 bg-[#fff9f0] p-2.5 pb-7 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.55)] border border-[#c89983]/40 pointer-events-none"
            >
              <div className="w-full max-h-40 overflow-hidden bg-[#f4e8d3] flex items-center justify-center">
                <img
                  src={firstPhoto.src}
                  alt={firstPhoto.alt}
                  className="w-full h-auto max-h-40 object-contain"
                />
              </div>
              <p className="mt-2 text-[11px] text-[#764d45] font-sinhala-sans text-center">
                {storyContent.memoryBox.label}
              </p>
            </motion.div>
          )}

          {/* Box Button */}
          <button
            type="button"
            onClick={handleOpenBox}
            disabled={boxState !== 'closed'}
            aria-label={storyContent.memoryBox.hint}
            className="group relative w-full h-44 sm:h-48 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e5b6aa] focus-visible:outline-offset-8 disabled:cursor-default bg-transparent border-0 p-0"
          >
            {/* Box Interior Shadow */}
            <div className="absolute inset-x-3 top-2 h-12 rounded-t-md bg-[#1c1111] shadow-inner" />

            {/* Box Lid */}
            <motion.div
              style={{ transformOrigin: 'top center' }}
              animate={
                boxState === 'closed'
                  ? { y: 0, rotateX: 0 }
                  : { y: -38, rotateX: -58, opacity: 0.9 }
              }
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-0 h-14 z-30 rounded-md bg-gradient-to-b from-[#6a4347] to-[#4e2f33] border border-[#c89983]/50 shadow-lg flex items-center justify-center"
            >
              {/* Horizontal Dusty Rose Ribbon on lid */}
              <span
                aria-hidden="true"
                className="w-full h-3.5 bg-[#e5b6aa]/85 shadow-sm"
              />
            </motion.div>

            {/* Box Base */}
            <div className="absolute inset-x-2 bottom-0 top-10 z-20 rounded-b-lg bg-gradient-to-b from-[#5a383c] via-[#462d30] to-[#362224] border border-[#a67c52]/45 shadow-[0_24px_44px_rgba(0,0,0,0.65)] flex flex-col items-center justify-center px-6">
              {/* Vertical Dusty Rose Ribbon */}
              <motion.span
                aria-hidden="true"
                animate={boxState === 'closed' ? { opacity: 0.9 } : { opacity: 0.25 }}
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-5 bg-gradient-to-r from-[#d49f93] via-[#e5b6aa] to-[#d49f93] shadow"
              />

              {/* Old-Paper Label */}
              <div className="relative z-10 px-5 py-2.5 rounded-sm bg-[#f4e8d3] border border-[#a67c52]/60 shadow-md">
                <span className="block text-sm sm:text-base font-semibold text-[#462d30]">
                  {storyContent.memoryBox.label}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Prompt or Continue Button */}
        <div className="mt-10 min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
          {boxState !== 'open' ? (
            <p className="text-sm sm:text-base text-[#e5b6aa] font-sinhala-sans">
              {storyContent.memoryBox.hint}
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center gap-4"
            >
              <p className="text-base sm:text-lg text-[#f4e8d3]/90">
                {storyContent.memoryBox.openingLine}
              </p>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('story-sound', { detail: 'paper' }));
                  onEnterScrapbook();
                }}
                className="vintage-btn"
              >
                <span>{storyContent.memoryBox.enterScrapbookLabel}</span>
                <ArrowDown size={18} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
