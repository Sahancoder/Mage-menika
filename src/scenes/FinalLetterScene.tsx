import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Gift, RotateCcw } from 'lucide-react';
import { storyContent, type FinalSurpriseConfig } from '../data/storyContent';
import { HeartParticles } from '../components/effects/HeartParticles';
import { PressedFlower, VintageStamp, WaxSeal } from '../components/ui/VintageDecorations';

interface FinalLetterSceneProps {
  onRestart: () => void;
  replayKey: number;
}

export function FinalLetterScene({ onRestart, replayKey }: FinalLetterSceneProps) {
  const [opened, setOpened] = useState(false);
  const [giftRevealed, setGiftRevealed] = useState(false);
  const finalLetter: FinalSurpriseConfig = storyContent.finalLetter;

  useEffect(() => {
    setOpened(false);
    setGiftRevealed(false);
  }, [replayKey]);

  const handleOpenFinal = () => {
    if (opened) return;
    setOpened(true);
  };

  return (
    <section
      id="final-letter"
      className="story-scene surface-desk relative min-h-[90dvh] py-24 sm:py-32 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden"
      aria-labelledby="final-letter-heading"
    >
      <HeartParticles density="medium" tone="warm" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <p className="font-display-en text-xs uppercase tracking-[0.26em] text-[#e5b6aa]/80 mb-3">
          {finalLetter.eyebrow}
        </p>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="sealed"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center"
            >
              <h2
                id="final-letter-heading"
                className="text-2xl sm:text-4xl font-semibold text-[#fff9f0] leading-relaxed mb-10"
              >
                {finalLetter.sealedPrompt}
              </h2>

              <motion.button
                type="button"
                onClick={handleOpenFinal}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={finalLetter.openHint}
                className="relative w-[min(88vw,21rem)] aspect-[1.45/1] rounded-lg bg-[#f4e8d3] border border-[#c89983]/60 shadow-[0_24px_48px_rgba(0,0,0,0.65)] flex flex-col items-center justify-center p-6 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e5b6aa] focus-visible:outline-offset-6"
              >
                <div className="w-full flex justify-end mb-auto">
                  <VintageStamp label="FOREVER" year="♥" className="!w-12 !h-14" />
                </div>
                <div className="my-auto">
                  <WaxSeal text="♥" size={68} />
                </div>
                <p className="mt-auto text-sm text-[#764d45] font-medium">
                  {storyContent.siteTitle}
                </p>
              </motion.button>

              <p className="mt-7 text-sm sm:text-base text-[#e5b6aa] font-sinhala-sans">
                {finalLetter.openHint}
              </p>
            </motion.div>
          ) : (
            <motion.article
              key="revealed"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="parchment-sheet relative rounded-md px-6 py-10 sm:px-12 sm:py-14 text-left"
            >
              <PressedFlower
                variant="rose"
                className="hidden sm:block absolute -top-8 -right-8 w-24 h-24 opacity-90 rotate-12"
              />

              <h2
                id="final-letter-heading"
                className="text-2xl sm:text-3xl font-semibold text-[#462d30] text-center mb-8"
              >
                {finalLetter.heading}
              </h2>

              <div className="space-y-5 text-base sm:text-lg text-[#462d30]/92 leading-[2]">
                {finalLetter.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              {/* Optional Final Photograph */}
              {finalLetter.finalPhotoSrc && (
                <figure className="mt-8 mx-auto max-w-sm bg-[#fff9f0] p-3 pb-6 rounded-sm shadow-md border border-[#c89983]/40 -rotate-1">
                  <img
                    src={finalLetter.finalPhotoSrc}
                    alt={finalLetter.finalPhotoAlt ?? 'අපේ අවසාන ඡායාරූපය'}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {finalLetter.finalPhotoCaption && (
                    <figcaption className="mt-2.5 text-center text-sm text-[#764d45]">
                      {finalLetter.finalPhotoCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {/* Optional Voice Note */}
              {finalLetter.voiceNoteSrc && (
                <div className="mt-7 rounded-md bg-[#f4e8d3]/80 border border-[#a67c52]/30 p-4 text-center">
                  <p className="text-sm font-medium text-[#462d30] mb-2">
                    {finalLetter.voiceNoteLabel ?? 'පුංචි හඬ පණිවිඩයක්'}
                  </p>
                  <audio controls preload="none" className="w-full max-w-sm mx-auto">
                    <source src={finalLetter.voiceNoteSrc} />
                  </audio>
                </div>
              )}

              {/* Optional Video */}
              {finalLetter.videoSrc && (
                <div className="mt-7 rounded-md overflow-hidden border border-[#a67c52]/35 bg-[#2f2020]">
                  <video controls preload="none" className="w-full max-h-80 object-contain">
                    <source src={finalLetter.videoSrc} />
                  </video>
                </div>
              )}

              {/* Optional Hidden Gift Message */}
              {finalLetter.hiddenGiftMessage && (
                <div className="mt-8 text-center">
                  {!giftRevealed ? (
                    <button
                      type="button"
                      onClick={() => {
                        setGiftRevealed(true);
                      }}
                      className="vintage-btn !min-h-[42px] !px-5 !py-2 text-sm"
                    >
                      <Gift size={16} aria-hidden="true" />
                      <span>පුංචි තෑගි සටහන බලන්න</span>
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-md bg-[#f4e8d3]/90 border border-dashed border-[#a67c52]/60 px-5 py-4 text-sm sm:text-base text-[#462d30]"
                    >
                      {finalLetter.hiddenGiftMessage}
                    </motion.div>
                  )}
                </div>
              )}

              {finalLetter.signature && (
                <p className="mt-8 text-right text-base sm:text-lg font-medium text-[#764d45]">
                  {finalLetter.signature}
                </p>
              )}

              <div className="mt-10 pt-6 border-t border-[#a67c52]/25 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    onRestart();
                  }}
                  className="vintage-btn"
                >
                  <RotateCcw size={17} aria-hidden="true" />
                  <span>{finalLetter.restartLabel}</span>
                </button>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

