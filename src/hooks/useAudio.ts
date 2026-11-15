import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

export type SoundEffect = 'envelope' | 'paper' | 'note' | 'chime';

const EFFECTS: SoundEffect[] = ['envelope', 'paper', 'note', 'chime'];
const PREFERENCE_KEY = 'story-audio-enabled';
const MUSIC_VOLUME = 0.28;
const FADE_MS = 600;

function readPreference(): boolean {
  try {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem(PREFERENCE_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

function isSoundEffect(value: unknown): value is SoundEffect {
  return typeof value === 'string' && EFFECTS.includes(value as SoundEffect);
}

type AudioSession = {
  music: Howl | null;
  effects: Partial<Record<SoundEffect, Howl>>;
  failedEffects: Set<SoundEffect>;
  pauseTimer?: ReturnType<typeof setTimeout>;
  startMusic: () => void;
};

export function useAudio() {
  const [preferred, setPreferred] = useState(readPreference);
  const [authorized, setAuthorized] = useState(() => readPreference());
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const enabled = preferred && authorized;
  const enabledRef = useRef(enabled);
  const authorizedRef = useRef(authorized);
  const sessionRef = useRef<AudioSession | null>(null);

  enabledRef.current = enabled;
  authorizedRef.current = authorized;

  useEffect(() => {
    let disposed = false;
    const sounds: Howl[] = [];
    const reportError = (message: string, fatal = false) => {
      if (disposed) return;
      setError(message);
      if (fatal) {
        enabledRef.current = false;
        setAuthorized(false);
        setAvailable(false);
      }
    };

    if (Howler.noAudio) {
      reportError('Audio is not supported by this browser. You can continue without sound.', true);
      return;
    }

    let gestureBound = false;
    const unlockOnGesture = () => {
      if (disposed || !enabledRef.current) return;
      setAuthorized(true);
      authorizedRef.current = true;
      setError(null);
      session.startMusic();
    };

    const bindFirstGesture = () => {
      if (gestureBound || disposed) return;
      gestureBound = true;
      const cleanupGesture = () => {
        window.removeEventListener('pointerdown', onGesture);
        window.removeEventListener('touchstart', onGesture);
        window.removeEventListener('keydown', onGesture);
      };
      const onGesture = () => {
        cleanupGesture();
        gestureBound = false;
        unlockOnGesture();
      };
      window.addEventListener('pointerdown', onGesture, { once: true, passive: true });
      window.addEventListener('touchstart', onGesture, { once: true, passive: true });
      window.addEventListener('keydown', onGesture, { once: true });
    };

    const session: AudioSession = {
      music: null,
      effects: {},
      failedEffects: new Set(),
      startMusic: () => {
        if (disposed || !enabledRef.current || !authorizedRef.current || document.hidden) return;
        const music = session.music;
        if (!music || music.playing()) return;
        if (music.state() === 'unloaded') return;
        clearTimeout(session.pauseTimer);
        music.volume(0);
        music.play();
        music.fade(0, MUSIC_VOLUME, FADE_MS);
      },
    };

    try {
      session.music = new Howl({
        src: [
          '/audio/Alex%20Warren%20-%20Ordinary%20(Official%20Video).mp3',
          '/audio/music.wav',
        ],
        html5: true,
        loop: true,
        volume: 0,
        onload: () => session.startMusic(),
        onplay: () => {
          if (!disposed) setError(null);
        },
        onloaderror: () => reportError('Music could not be loaded. You can continue without sound.', true),
        onplayerror: () => {
          if (disposed) return;
          session.music?.pause();
          // Browser blocked autoplay before gesture: start automatically on first tap/click/key.
          bindFirstGesture();
        },
      });
      sounds.push(session.music);

      // Attempt immediate playback if browser permits autoplay on open
      if (enabledRef.current) {
        bindFirstGesture();
        session.startMusic();
      }

      for (const effect of EFFECTS) {
        const sound = new Howl({
          src: [`/audio/${effect}.wav`],
          volume: effect === 'chime' ? 0.25 : 0.35,
          onloaderror: () => {
            session.failedEffects.add(effect);
          },
        });
        session.effects[effect] = sound;
        sounds.push(sound);
      }
      sessionRef.current = session;
    } catch {
      reportError('Audio could not be initialized. You can continue without sound.', true);
    }

    const onVisibilityChange = () => {
      clearTimeout(session.pauseTimer);
      if (document.hidden) {
        session.music?.pause();
        for (const sound of Object.values(session.effects)) sound.stop();
      } else if (enabledRef.current) {
        session.startMusic();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      clearTimeout(session.pauseTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (sessionRef.current === session) sessionRef.current = null;
      for (const sound of sounds) sound.unload();
    };
  }, []);

  const toggle = useCallback(() => {
    const session = sessionRef.current;
    const music = session?.music;
    if (!session || !music || !available) return;
    if (navigator.userActivation?.isActive === false) return;
    const next = !enabledRef.current;
    authorizedRef.current = true;
    enabledRef.current = next;
    setAuthorized(true);
    setPreferred(next);
    setError(null);
    try {
      window.localStorage.setItem(PREFERENCE_KEY, String(next));
    } catch {
      // Storage can be unavailable in private browsing or sandboxed embeds.
    }
    clearTimeout(session.pauseTimer);
    if (next) {
      session.startMusic();
    } else {
      for (const sound of Object.values(session.effects)) sound.stop();
      if (music.playing()) {
        music.fade(music.volume(), 0, FADE_MS);
        session.pauseTimer = setTimeout(() => music.pause(), FADE_MS);
      }
    }
  }, [available]);

  const play = useCallback((effect: SoundEffect) => {
    const session = sessionRef.current;
    if (!isSoundEffect(effect) || !session || !enabledRef.current || !authorizedRef.current || document.hidden) return;
    const sound = session.effects[effect];
    if (!sound || session.failedEffects.has(effect) || sound.state() !== 'loaded') return;
    sound.stop();
    sound.play();
  }, []);

  useEffect(() => {
    const onStorySound = (event: Event) => {
      const detail: unknown = (event as CustomEvent<unknown>).detail;
      const effect = typeof detail === 'object' && detail !== null && 'effect' in detail
        ? detail.effect
        : detail;
      if (isSoundEffect(effect)) play(effect);
    };
    window.addEventListener('story-sound', onStorySound);
    return () => window.removeEventListener('story-sound', onStorySound);
  }, [play]);

  return { enabled, toggle, play, available, error };
}
