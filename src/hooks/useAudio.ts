import { useCallback, useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';

export type SoundEffect = 'envelope' | 'paper' | 'note' | 'chime';

const EFFECTS: SoundEffect[] = ['envelope', 'paper', 'note', 'chime'];
const PREFERENCE_KEY = 'story-audio-enabled';
const MUSIC_VOLUME = 0.22;
const FADE_MS = 600;

function readPreference(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(PREFERENCE_KEY) === 'true';
  } catch {
    return false;
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
  // A persisted preference is never permission to start a new session.
  const [authorized, setAuthorized] = useState(false);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const enabled = preferred && authorized;
  const enabledRef = useRef(false);
  const authorizedRef = useRef(false);
  const sessionRef = useRef<AudioSession | null>(null);

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

    const session: AudioSession = {
      music: null,
      effects: {},
      failedEffects: new Set(),
      startMusic: () => {
        if (disposed || !enabledRef.current || !authorizedRef.current || document.hidden) return;
        const music = session.music;
        if (!music || music.state() !== 'loaded' || music.playing()) return;
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
        onloaderror: () => reportError('Music could not be loaded. You can continue without sound.', true),
        onplayerror: () => {
          if (disposed) return;
          enabledRef.current = false;
          setAuthorized(false);
          session.music?.pause();
          reportError('Playback was blocked. Click Enable music to try again.');
        },
      });
      sounds.push(session.music);
      for (const effect of EFFECTS) {
        const sound = new Howl({
          src: [`/audio/${effect}.wav`],
          volume: effect === 'chime' ? 0.25 : 0.35,
          onloaderror: () => {
            session.failedEffects.add(effect);
            reportError(`The ${effect} sound could not be loaded. The story will continue without it.`);
          },
          onplayerror: () => reportError(`The ${effect} sound could not play. The story will continue without it.`),
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
      } else {
        session.startMusic();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      disposed = true;
      clearTimeout(session.pauseTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (sessionRef.current === session) sessionRef.current = null;
      // Only unload this hook's sounds, never another consumer's Howler audio.
      for (const sound of sounds) sound.unload();
    };
  }, []);

  const toggle = useCallback(() => {
    const session = sessionRef.current;
    const music = session?.music;
    if (!session || !music || !available) return;
    // When supported, reject programmatic calls outside an active user gesture.
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
    // Do not queue effects while loading: late playback would be out of context.
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
