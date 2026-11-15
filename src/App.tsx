import { Suspense, lazy, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { useBackgroundMusic } from './hooks/useAudio';
import { StoryProgress } from './components/ui/StoryProgress';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import { IntroScene } from './scenes/IntroScene';
import { FirstLetterScene } from './scenes/FirstLetterScene';

const MemoryBoxScene = lazy(() =>
  import('./scenes/MemoryBoxScene').then((m) => ({ default: m.MemoryBoxScene })),
);
const MemoryScene = lazy(() =>
  import('./scenes/MemoryScene').then((m) => ({ default: m.MemoryScene })),
);
const LoveHeartsScene = lazy(() =>
  import('./scenes/LoveHeartsScene').then((m) => ({ default: m.LoveHeartsScene })),
);
const StoryInterludeScene = lazy(() =>
  import('./scenes/StoryInterludeScene').then((m) => ({ default: m.StoryInterludeScene })),
);
const BirthdayCakeScene = lazy(() =>
  import('./scenes/BirthdayCakeScene').then((m) => ({ default: m.BirthdayCakeScene })),
);
const FinalLetterScene = lazy(() =>
  import('./scenes/FinalLetterScene').then((m) => ({ default: m.FinalLetterScene })),
);

function SceneFallback() {
  return <div className="min-h-[35dvh] w-full" aria-hidden="true" />;
}

export function App() {
  useBackgroundMusic();
  const [replayKey, setReplayKey] = useState(0);
  const {
    activeScene,
    scrollProgress,
    goToScene,
    goNext,
    goPrev,
    resetProgress,
  } = useStoryNavigation();

  const handleRestart = () => {
    setReplayKey((prev) => prev + 1);
    resetProgress();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#2F2020]">
        <a
          href="#first-letter"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-[#fff9f0] focus:px-4 focus:py-2 focus:text-sm focus:text-[#462d30] focus:shadow-lg"
        >
          ප්‍රධාන කතාවට යන්න
        </a>

        <StoryProgress
          activeScene={activeScene}
          scrollProgress={scrollProgress}
          onSelectScene={goToScene}
          onPrev={goPrev}
          onNext={goNext}
        />

        <main>
          <IntroScene
            replayKey={replayKey}
            onOpenComplete={() => goToScene('first-letter')}
          />

          <FirstLetterScene onContinue={() => goToScene('memory-box')} />

          <Suspense fallback={<SceneFallback />}>
            <MemoryBoxScene
              replayKey={replayKey}
              onEnterScrapbook={() => goToScene('memories')}
            />
          </Suspense>

          <Suspense fallback={<SceneFallback />}>
            <MemoryScene onContinue={() => goToScene('love-hearts')} />
          </Suspense>

          <Suspense fallback={<SceneFallback />}>
            <LoveHeartsScene
              replayKey={replayKey}
              onContinue={() => goToScene('interlude')}
            />
          </Suspense>

          <Suspense fallback={<SceneFallback />}>
            <StoryInterludeScene onContinue={() => goToScene('birthday')} />
          </Suspense>

          <Suspense fallback={<SceneFallback />}>
            <BirthdayCakeScene
              replayKey={replayKey}
              onContinue={() => goToScene('final-letter')}
            />
          </Suspense>

          <Suspense fallback={<SceneFallback />}>
            <FinalLetterScene
              replayKey={replayKey}
              onRestart={handleRestart}
            />
          </Suspense>
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
