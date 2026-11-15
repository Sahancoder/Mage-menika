import { Fragment, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { getOrderedMemories, type MemoryPhoto } from '../data/memories';
import { storyContent } from '../data/storyContent';
import { ScrapbookPhotoCard } from '../components/scrapbook/ScrapbookPhotoCard';
import { PhotoLightbox } from '../components/scrapbook/PhotoLightbox';
import { HeartParticles } from '../components/effects/HeartParticles';
import { PressedFlower } from '../components/ui/VintageDecorations';

interface MemorySceneProps {
  onContinue: () => void;
}

type ScrapbookSpread =
  | { type: 'single'; items: Array<{ photo: MemoryPhoto; index: number }>; variant: 'polaroid' | 'full' }
  | { type: 'pair'; items: Array<{ photo: MemoryPhoto; index: number }> };

function buildSpreads(photos: MemoryPhoto[]): ScrapbookSpread[] {
  const spreads: ScrapbookSpread[] = [];
  let i = 0;

  while (i < photos.length) {
    const current = photos[i];
    const next = photos[i + 1];

    if (current.layout === 'paired' && next && next.layout === 'paired') {
      spreads.push({
        type: 'pair',
        items: [
          { photo: current, index: i },
          { photo: next, index: i + 1 },
        ],
      });
      i += 2;
    } else {
      spreads.push({
        type: 'single',
        items: [{ photo: current, index: i }],
        variant: current.layout === 'full' ? 'full' : 'polaroid',
      });
      i += 1;
    }
  }

  return spreads;
}

export function MemoryScene({ onContinue }: MemorySceneProps) {
  const orderedPhotos = useMemo(() => getOrderedMemories(), []);
  const spreads = useMemo(() => buildSpreads(orderedPhotos), [orderedPhotos]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrapbook } = storyContent;

  return (
    <section
      id="memories"
      className="story-scene surface-parchment relative py-20 sm:py-28 px-4 sm:px-8 overflow-hidden"
      aria-labelledby="memories-title"
    >
      <HeartParticles density="low" tone="rose" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Scrapbook Header */}
        <header className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
          <p className="font-display-en text-xs uppercase tracking-[0.26em] text-[#764d45]/80 mb-2">
            {scrapbook.eyebrow}
          </p>
          <h2
            id="memories-title"
            className="text-3xl sm:text-5xl font-semibold text-[#462d30] mb-4"
          >
            {scrapbook.title}
          </h2>
          <p className="text-base sm:text-lg text-[#764d45]/90 leading-relaxed">
            {scrapbook.subtitle}
          </p>
        </header>

        {/* Continuous Scrapbook Sequence */}
        <div className="space-y-16 sm:space-y-24">
          {spreads.map((spread, spreadIdx) => {
            const showTransition =
              spreadIdx > 0 &&
              spreadIdx % 4 === 0 &&
              scrapbook.transitionMessages.length > 0;
            const transitionText =
              scrapbook.transitionMessages[
                Math.floor(spreadIdx / 4 - 1) % scrapbook.transitionMessages.length
              ];

            return (
              <Fragment key={spread.items[0].photo.id}>
                {showTransition && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.7 }}
                    className="relative py-6 px-4 text-center max-w-lg mx-auto"
                  >
                    <PressedFlower
                      variant="rose"
                      className="mx-auto mb-3 w-12 h-12 opacity-75"
                    />
                    <p className="text-lg sm:text-xl text-[#764d45] italic leading-relaxed">
                      “{transitionText}”
                    </p>
                  </motion.div>
                )}

                {spread.type === 'pair' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-center">
                    {spread.items.map(({ photo, index }) => (
                      <ScrapbookPhotoCard
                        key={photo.id}
                        photo={photo}
                        index={index}
                        variant="paired"
                        onOpen={(idx) => {
                          setLightboxIndex(idx);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <ScrapbookPhotoCard
                      photo={spread.items[0].photo}
                      index={spread.items[0].index}
                      variant={spread.variant}
                      onOpen={(idx) => {
                        setLightboxIndex(idx);
                      }}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Continue to Love Hearts */}
        <div className="mt-20 sm:mt-24 text-center">
          <button
            type="button"
            onClick={() => {
              onContinue();
            }}
            className="vintage-btn"
          >
            <span>{scrapbook.continueLabel}</span>
            <ArrowDown size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <PhotoLightbox
        photos={orderedPhotos}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
      />
    </section>
  );
}

