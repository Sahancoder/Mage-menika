import { useEffect } from 'react';
import { Howl, Howler } from 'howler';

const MUSIC_SRC = '/audio/Alex%20Warren%20-%20Ordinary%20(Official%20Video).mp3';
const MUSIC_VOLUME = 0.3;
const FADE_MS = 1200;

// Real user activations. pointerdown/touchstart do NOT unlock audio on touch devices.
const GESTURE_EVENTS = ['click', 'touchend', 'pointerup', 'keydown'] as const;

/**
 * Background music: starts as soon as the site opens (or on the visitor's first
 * tap/click/key if the browser blocks autoplay) and loops until the site is closed.
 * There is no on/off control and no sound effects.
 */
export function useBackgroundMusic() {
  useEffect(() => {
    if (Howler.noAudio) return;

    let disposed = false;
    let soundId: number | undefined;

    const music = new Howl({
      src: [MUSIC_SRC],
      html5: true,
      loop: true,
      volume: 0,
      onplay: () => unbind(),
      onplayerror: () => {
        // Autoplay was blocked: wait for the first real gesture (listeners stay bound).
        music.pause();
        bind();
      },
    });

    const start = () => {
      if (disposed || document.hidden) return;
      if (soundId !== undefined && music.playing(soundId)) return;
      // Reuse ONE sound id so repeated calls never create overlapping copies.
      soundId = soundId === undefined ? music.play() : music.play(soundId);
      music.volume(0, soundId);
      music.fade(0, MUSIC_VOLUME, FADE_MS, soundId);
    };

    function onGesture() {
      start();
    }
    function bind() {
      for (const evt of GESTURE_EVENTS) window.addEventListener(evt, onGesture, true);
    }
    function unbind() {
      for (const evt of GESTURE_EVENTS) window.removeEventListener(evt, onGesture, true);
    }

    const onVisibility = () => {
      if (document.hidden) music.pause();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    bind();
    start();

    return () => {
      disposed = true;
      unbind();
      document.removeEventListener('visibilitychange', onVisibility);
      music.unload();
    };
  }, []);
}
