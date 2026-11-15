
import { useState } from 'react';
import { MotionConfig } from 'motion/react';
import { AudioControl } from './components/AudioControl';
import { StoryProgress } from './components/ui/StoryProgress';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import { IntroScene } from './scenes/IntroScene';
import { FirstLetterScene } from './scenes/FirstLetterScene';
import { MemoryBoxScene } from './scenes/MemoryBoxScene';
import { MemoryScene } from './scenes/MemoryScene';
import { LoveHeartsScene } from './scenes/LoveHeartsScene';
import { StoryInterludeScene } from './scenes/StoryInterludeScene';
import { BirthdayCakeScene } from './scenes/BirthdayCakeScene';
import { FinalLetterScene } from './scenes/FinalLetterScene';

export function App() {
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

        <AudioControl />

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

          <MemoryBoxScene
            replayKey={replayKey}
            onEnterScrapbook={() => goToScene('memories')}
          />

          <MemoryScene onContinue={() => goToScene('love-hearts')} />

          <LoveHeartsScene
            replayKey={replayKey}
            onContinue={() => goToScene('interlude')}
          />

          <StoryInterludeScene onContinue={() => goToScene('birthday')} />

          <BirthdayCakeScene
            replayKey={replayKey}
            onContinue={() => goToScene('final-letter')}
          />

          <FinalLetterScene
            replayKey={replayKey}
            onRestart={handleRestart}
          />
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
