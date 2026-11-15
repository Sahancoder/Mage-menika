import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { storyContent } from '../data/storyContent';
import { HeartParticles } from '../components/effects/HeartParticles';
import { VintageStamp, WaxSeal } from '../components/ui/VintageDecorations';

interface IntroSceneProps {
  onOpenComplete: () => void;
  replayKey: number;
}

const DUST_MOTES = [
  { id: 1, x: '18%', y: '24%', size: 3, delay: 0 },
  { id: 2, x: '76%', y: '28%', size: 2.5, delay: 1.2 },
  { id: 3, x: '32%', y: '66%', size: 3.5, delay: 2.1 },
  { id: 4, x: '68%', y: '72%', size: 2, delay: 0.7 },
  { id: 5, x: '48%', y: '18%', size: 2.5, delay: 1.8 },
  { id: 6, x: '84%', y: '56%', size: 3, delay: 2.8 },
];

export function IntroScene({ onOpenComplete, replayKey }: IntroSceneProps) {
  const [stage, setStage] = useState<'idle' | 'breaking' | 'opened'>('idle');
  const [deskLit, setDeskLit] = useState(false);

  useEffect(() => {
    setStage('idle');
    const timer = window.setTimeout(() => setDeskLit(true), 120);
    return () => window.clearTimeout(timer);
  }, [replayKey]);

  const handleOpenEnvelope = () => {
    if (stage !== 'idle') return;
    window.dispatchEvent(new CustomEvent('story-sound', { detail: 'envelope' }));
    setStage('breaking');

    window.setTimeout(() => {
      setStage('opened');
      window.dispatchEvent(new CustomEvent('story-sound', { detail: 'paper' }));
    }, 450);

    window.setTimeout(() => {
      onOpenComplete();
    }, 1550);
  };

  return (
    <section
      id="intro"
      className="story-scene relative min-h-[100dvh] flex flex-col items-center justify-center px-5 pt-20 pb-16 sm:py-16 overflow-hidden surface-desk"
      aria-labelledby="intro-headline"
    >
      {/* Candlelight desk reveal */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-[1800ms] ease-out ${
          deskLit ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(236, 174, 120, 0.22) 0%, rgba(166, 124, 82, 0.08) 38%, rgba(20, 12, 12, 0.78) 85%)',
        }}
      />

      {/* Subtle wooden desk grain lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(12deg, transparent 0 28px, rgba(166, 124, 82, 0.14) 28px 29px)',
        }}
      />

      {/* Floating dust motes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {DUST_MOTES.map((mote) => (
          <motion.span
            key={mote.id}
            className="absolute rounded-full bg-[#fff3dc]/50 blur-[0.5px]"
            style={{ left: mote.x, top: mote.y, width: mote.size, height: mote.size }}
            animate={{ y: [-8, 10, -8], opacity: [0.2, 0.65, 0.2] }}
            transition={{ duration: 6.5, repeat: Infinity, delay: mote.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <HeartParticles density="low" tone="warm" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center max-w-xl w-full"
      >
        <p className="font-display-en text-xs sm:text-sm uppercase tracking-[0.26em] text-[#e5b6aa]/85 mb-3">
          {storyContent.intro.eyebrow}
        </p>

        <h1
          id="intro-headline"
          className="text-2xl sm:text-4xl font-semibold text-[#fff9f0] leading-relaxed mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
        >
          {storyContent.intro.headline}
        </h1>

        {/* Interactive Vintage Envelope */}
        <motion.button
          type="button"
          onClick={handleOpenEnvelope}
          disabled={stage !== 'idle'}
          aria-label={storyContent.intro.tapHint}
          whileHover={stage === 'idle' ? { y: -4, scale: 1.015 } : undefined}
          whileTap={stage === 'idle' ? { scale: 0.985 } : undefined}
          animate={
            stage === 'opened'
              ? { scale: 1.08, y: -14, opacity: 0.92 }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="group relative w-[min(90vw,23rem)] aspect-[1.45/1] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#e5b6aa] focus-visible:outline-offset-8 disabled:cursor-default bg-transparent border-0 p-0 text-left"
        >
          {/* Ambient candle glow behind envelope */}
          <span
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-[#e5b6aa]/12 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-75"
          />

          {/* Envelope Back */}
          <div className="relative w-full h-full rounded-lg bg-[#e8d7bd] border border-[#b58e69]/60 shadow-[0_26px_55px_-12px_rgba(0,0,0,0.72)] overflow-visible">
            {/* Rising Letter Sheet inside envelope */}
            <motion.div
              aria-hidden="true"
              initial={{ y: 8, opacity: 0.9 }}
              animate={
                stage === 'opened'
                  ? { y: -76, opacity: 1, scale: 1.03 }
                  : stage === 'breaking'
                    ? { y: -12, opacity: 1 }
                    : { y: 8, opacity: 0.92 }
              }
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-4 top-3 bottom-4 rounded-sm bg-[#fff9f0] border border-[#c89983]/45 shadow-md p-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 w-2/3">
                  <div className="h-2 w-24 rounded bg-[#764d45]/25" />
                  <div className="h-1.5 w-full rounded bg-[#764d45]/12" />
                  <div className="h-1.5 w-4/5 rounded bg-[#764d45]/12" />
                </div>
                <VintageStamp className="!w-10 !h-12 !p-1 scale-90" />
              </div>
              <p className="text-xs text-[#764d45]/75 text-right">
                {storyContent.firstLetter.salutation}
              </p>
            </motion.div>

            {/* Envelope Front Pocket */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
            >
              <svg viewBox="0 0 360 248" className="w-full h-full" preserveAspectRatio="none">
                <path
                  d="M0 248 L0 30 L180 144 L360 30 L360 248 Z"
                  fill="#f4e8d3"
                  stroke="#c89983"
                  strokeWidth="1.2"
                />
                <path
                  d="M0 248 L180 128 L360 248 Z"
                  fill="#ecdac0"
                  stroke="#c89983"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Top Envelope Flap */}
            <motion.div
              aria-hidden="true"
              style={{ transformOrigin: 'top center' }}
              animate={
                stage === 'opened'
                  ? { rotateX: 170, zIndex: 0 }
                  : stage === 'breaking'
                    ? { rotateX: 25 }
                    : { rotateX: 0 }
              }
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 inset-x-0 h-[56%] z-20 pointer-events-none"
            >
              <svg viewBox="0 0 360 140" className="w-full h-full drop-shadow-md" preserveAspectRatio="none">
                <path
                  d="M0 0 L360 0 L180 132 Z"
                  fill="#f7ebd8"
                  stroke="#c89983"
                  strokeWidth="1.4"
                />
              </svg>
            </motion.div>

            {/* Deep Rose Wax Seal */}
            <motion.div
              animate={
                stage === 'opened'
                  ? { y: -26, opacity: 0, scale: 0.85 }
                  : stage === 'breaking'
                    ? { scale: 1.08, rotate: -6 }
                    : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.45 }}
              className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
              <WaxSeal
                text={storyContent.intro.sealText}
                broken={stage !== 'idle'}
                size={74}
              />
            </motion.div>
          </div>
        </motion.button>

        {/* Tap-to-open hint */}
        <motion.p
          animate={{ opacity: stage === 'idle' ? [0.55, 1, 0.55] : 0 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-8 text-sm sm:text-base text-[#e5b6aa] font-sinhala-sans"
        >
          {storyContent.intro.tapHint}
        </motion.p>
      </motion.div>
    </section>
  );
}
