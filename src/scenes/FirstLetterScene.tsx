import { Fragment } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { storyContent } from '../data/storyContent';
import { PressedFlower, VintageStamp } from '../components/ui/VintageDecorations';

interface FirstLetterSceneProps {
  onContinue: () => void;
}

function renderWithUnderline(text: string, phrases: readonly string[], delayBase: number) {
  const match = phrases.find((phrase) => text.includes(phrase));
  if (!match) return text;

  const idx = text.indexOf(match);
  const before = text.slice(0, idx);
  const after = text.slice(idx + match.length);

  return (
    <Fragment>
      {before}
      <span className="relative inline-block font-medium text-[#462d30]">
        {match}
        <motion.svg
          viewBox="0 0 180 14"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute left-0 -bottom-1 w-full h-2.5 pointer-events-none"
        >
          <motion.path
            d="M2 10 Q45 3, 92 8 T178 6"
            fill="none"
            stroke="#c89983"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.85, delay: delayBase + 0.25, ease: 'easeOut' }}
          />
        </motion.svg>
      </span>
      {after}
    </Fragment>
  );
}

export function FirstLetterScene({ onContinue }: FirstLetterSceneProps) {
  const { firstLetter } = storyContent;

  const handleContinue = () => {
    window.dispatchEvent(new CustomEvent('story-sound', { detail: 'paper' }));
    onContinue();
  };

  return (
    <section
      id="first-letter"
      className="story-scene surface-parchment py-20 sm:py-28 px-4 sm:px-6 flex items-center justify-center overflow-hidden"
      aria-labelledby="first-letter-salutation"
    >
      <div className="relative w-full max-w-2xl">
        {/* Decorative pressed flower behind corner */}
        <PressedFlower
          variant="lavender"
          className="hidden sm:block absolute -left-14 -top-10 w-24 h-36 opacity-80 -rotate-12 z-0"
        />
        <PressedFlower
          variant="rose"
          className="absolute -right-6 -bottom-8 w-24 h-24 sm:w-28 sm:h-28 opacity-85 rotate-12 z-20"
        />

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="parchment-sheet relative z-10 rounded-md px-6 py-10 sm:px-12 sm:py-14"
        >
          {/* Letterhead */}
          <div className="flex items-start justify-between gap-4 border-b border-[#a67c52]/25 pb-5 mb-7">
            <div>
              <p className="font-display-en text-[11px] uppercase tracking-[0.22em] text-[#764d45]/75">
                {firstLetter.eyebrow}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#764d45]/85 font-sinhala-sans">
                {firstLetter.dateLabel}
              </p>
            </div>
            <VintageStamp label="MANIKA" year="♥" className="rotate-3 shrink-0" />
          </div>

          <h2
            id="first-letter-salutation"
            className="text-xl sm:text-2xl font-semibold text-[#462d30] mb-6"
          >
            {firstLetter.salutation}
          </h2>

          <div className="space-y-5 text-base sm:text-lg text-[#462d30]/92 leading-[2]">
            {firstLetter.paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.65, delay: index * 0.14, ease: 'easeOut' }}
              >
                {renderWithUnderline(paragraph, firstLetter.underlinePhrases, index * 0.14)}
              </motion.p>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, delay: firstLetter.paragraphs.length * 0.14 }}
              className="pt-2 text-lg sm:text-xl font-medium text-[#764d45]"
            >
              {firstLetter.closingQuestion}
            </motion.p>
          </div>

          <div className="mt-10 pt-6 border-t border-[#a67c52]/20 flex justify-center sm:justify-end">
            <button
              type="button"
              onClick={handleContinue}
              className="vintage-btn"
            >
              <span>{firstLetter.continueLabel}</span>
              <ArrowDown size={18} aria-hidden="true" />
            </button>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
