import { useCallback, useEffect, useState } from 'react';

export const STORY_SCENES = [
  { id: 'intro', label: 'ලියුම' },
  { id: 'first-letter', label: 'පළමු ලියුම' },
  { id: 'memory-box', label: 'මතක පෙට්ටිය' },
  { id: 'memories', label: 'අපේ මතකයන්' },
  { id: 'love-hearts', label: 'ආදර සටහන්' },
  { id: 'interlude', label: 'විශේෂ දවස' },
  { id: 'birthday', label: 'උපන්දින කේක්' },
  { id: 'final-letter', label: 'අවසාන ලියුම' },
] as const;

export type SceneId = (typeof STORY_SCENES)[number]['id'];

const STORAGE_KEY = 'manika-story-scene';

function readSavedScene(): SceneId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && STORY_SCENES.some((scene) => scene.id === saved)) {
      return saved as SceneId;
    }
  } catch {
    // Ignore storage errors in private browsing.
  }
  return 'intro';
}

export function useStoryNavigation() {
  const [activeScene, setActiveScene] = useState<SceneId>(readSavedScene);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const persistScene = useCallback((sceneId: SceneId) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, sceneId);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const goToScene = useCallback(
    (sceneId: SceneId) => {
      setIsTransitioning(true);
      setActiveScene(sceneId);
      persistScene(sceneId);

      const el = document.getElementById(sceneId);
      if (el) {
        const prefersReduced =
          typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start',
        });
      }

      window.setTimeout(() => setIsTransitioning(false), 550);
    },
    [persistScene],
  );

  const goNext = useCallback(() => {
    const idx = STORY_SCENES.findIndex((s) => s.id === activeScene);
    if (idx >= 0 && idx < STORY_SCENES.length - 1) {
      goToScene(STORY_SCENES[idx + 1].id);
    }
  }, [activeScene, goToScene]);

  const goPrev = useCallback(() => {
    const idx = STORY_SCENES.findIndex((s) => s.id === activeScene);
    if (idx > 0) {
      goToScene(STORY_SCENES[idx - 1].id);
    }
  }, [activeScene, goToScene]);

  const resetProgress = useCallback(() => {
    setActiveScene('intro');
    persistScene('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [persistScene]);

  // Track scroll progress & active scene via IntersectionObserver
  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / docHeight)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const observers: IntersectionObserver[] = [];
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.target.id) {
              const id = entry.target.id as SceneId;
              setActiveScene(id);
              persistScene(id);
            }
          }
        },
        { rootMargin: '-35% 0px -45% 0px', threshold: 0.05 },
      );

      for (const scene of STORY_SCENES) {
        const el = document.getElementById(scene.id);
        if (el) observer.observe(el);
      }
      observers.push(observer);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      for (const obs of observers) obs.disconnect();
    };
  }, [persistScene]);

  // Keyboard navigation between scenes with Alt+ArrowDown / Alt+ArrowUp or PageDown / PageUp
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (document.querySelector('[role="dialog"]')) return;

      if (event.altKey && event.key === 'ArrowDown') {
        event.preventDefault();
        goNext();
      } else if (event.altKey && event.key === 'ArrowUp') {
        event.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  return {
    activeScene,
    scrollProgress,
    isTransitioning,
    goToScene,
    goNext,
    goPrev,
    resetProgress,
  };
}
