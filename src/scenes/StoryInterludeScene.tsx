import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import { storyContent } from '../data/storyContent';
import { HeartParticles } from '../components/effects/HeartParticles';
import { PressedFlower } from '../components/ui/VintageDecorations';

interface StoryInterludeSceneProps {
  onContinue: () => void;
}

export function StoryInterludeScene({ onContinue }: StoryInterludeSceneProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.interlude-flower-left', {
          y: -36,
          rotation: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
        gsap.to('.interlude-flower-right', {
          y: 32,
          rotation: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      });
    }, rootRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="interlude"
      className="story-scene surface-desk relative py-28 sm:py-36 px-5 flex items-center justify-center overflow-hidden"
      aria-labelledby="interlude-heading"
    >
      <HeartParticles density="medium" tone="warm" />

      <PressedFlower
        variant="lavender"
        className="interlude-flower-left hidden sm:block absolute left-8 top-16 w-24 h-40 opacity-50"
      />
      <PressedFlower
        variant="rose"
        className="interlude-flower-right hidden sm:block absolute right-10 bottom-16 w-28 h-28 opacity-55"
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="font-display-en text-xs uppercase tracking-[0.26em] text-[#e5b6aa]/80 mb-5"
        >
          {storyContent.interlude.eyebrow}
        </motion.p>

        <h2 id="interlude-heading" className="sr-only">
          {storyContent.interlude.lines.join(' ')}
        </h2>

        <div className="space-y-4">
          {storyContent.interlude.lines.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.85, delay: index * 0.28, ease: 'easeOut' }}
              className="text-2xl sm:text-4xl font-semibold text-[#fff9f0] leading-relaxed"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.85, delay: 0.65 }}
          className="mt-8 text-base sm:text-xl text-[#e5b6aa] leading-relaxed"
        >
          {storyContent.interlude.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-12"
        >
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('story-sound', { detail: 'paper' }));
              onContinue();
            }}
            className="vintage-btn vintage-btn--dark"
          >
            <span>{storyContent.interlude.continueLabel}</span>
            <ArrowDown size={18} aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
