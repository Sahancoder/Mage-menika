import { ChevronDown, ChevronUp } from 'lucide-react';
import { STORY_SCENES, type SceneId } from '../../hooks/useStoryNavigation';

interface StoryProgressProps {
  activeScene: SceneId;
  scrollProgress: number;
  onSelectScene: (sceneId: SceneId) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function StoryProgress({
  activeScene,
  scrollProgress,
  onSelectScene,
  onPrev,
  onNext,
}: StoryProgressProps) {
  const activeIndex = STORY_SCENES.findIndex((s) => s.id === activeScene);
  const currentLabel = STORY_SCENES[activeIndex]?.label ?? '';

  return (
    <>
      {/* Delicate top reading-thread progress bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none bg-black/15"
      >
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${Math.round(scrollProgress * 100)}%`,
            background: 'linear-gradient(90deg, var(--rose-gold), var(--dusty-rose), #f7dfd5)',
          }}
        />
      </div>

      {/* Subtle floating bookmark indicator (not a navbar) */}
      <aside
        aria-label="කතාවේ ප්‍රගතිය"
        className="fixed bottom-4 left-4 z-50 hidden sm:flex items-center gap-1.5 rounded-full border border-[#c89983]/35 bg-[#2f2020]/80 px-2.5 py-1.5 text-[#fff9f0] shadow-lg backdrop-blur-md"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={activeIndex <= 0}
          aria-label="පෙර කොටසට"
          className="grid h-7 w-7 place-items-center rounded-full text-[#e5b6aa] transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronUp size={16} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1 px-1" role="group" aria-label="කතාවේ කොටස්">
          {STORY_SCENES.map((scene, idx) => {
            const isActive = scene.id === activeScene;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(scene.id)}
                aria-label={`${idx + 1}. ${scene.label}`}
                aria-current={isActive ? 'step' : undefined}
                title={scene.label}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'w-5 bg-[#e5b6aa]'
                    : 'w-2 bg-[#c89983]/45 hover:bg-[#e5b6aa]/75'
                }`}
              />
            );
          })}
        </div>

        <span className="px-1.5 text-xs text-[#f4e8d3]/90 font-sinhala-sans select-none">
          {currentLabel}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={activeIndex >= STORY_SCENES.length - 1}
          aria-label="ඊළඟ කොටසට"
          className="grid h-7 w-7 place-items-center rounded-full text-[#e5b6aa] transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </aside>
    </>
  );
}

