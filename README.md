# මගේ මැණික වෙනුවෙන්... ❤️ (A Little Book of Us)

A cinematic, vintage love-letter birthday website built with React, TypeScript, Vite, Tailwind CSS, Motion, GSAP ScrollTrigger, and Howler.js.

## Features

1. **Opening Candlelit Envelope** (`IntroScene`) — Tap to break the deep-rose wax seal, open the flap, and slide out the letter.
2. **First Love Letter** (`FirstLetterScene`) — Textured parchment letter with sequential Sinhala paragraph reveals and animated handwritten underlines.
3. **Antique Memory Box** (`MemoryBoxScene`) — Interactive keepsake box that opens to reveal the first memory.
4. **Continuous Memory Scrapbook** (`MemoryScene`) — One continuous, category-free sequence of 31 photographs alternating between polaroids, paired spreads, and full-bleed memories, with tap-to-zoom lightbox and mobile swipe.
5. **10 Interactive Love Hearts** (`LoveHeartsScene`) — Each heart opens a customizable Sinhala note.
6. **Romantic Story Interlude** (`StoryInterludeScene`) — Gentle parallax & anticipation before the birthday celebration.
7. **Scroll-Assembled Birthday Cake & Candles** (`BirthdayCakeScene`) — Progressive scroll-driven cake assembly, 5 tap-to-extinguish candles (no microphone needed), falling rose petals, and replay.
8. **Final Sealed Letter & Optional Gift Media** (`FinalLetterScene`) — Sealed surprise letter with optional final photo, voice note, video, hidden gift note, and full story restart.
9. **Optional Music & Sound Effects** (`useAudio`) — Original bundled `.wav` music and sound effects with persistent on/off preference and graceful fallback.

---

## Local Development

```bash
npm install
npm run dev
```

Run checks:

```bash
npm run lint
npm run build
npm test
```

---

## Photo Replacement & Ordering Guide

All photographs are configured in a single typed array in [`src/data/memories.ts`](src/data/memories.ts):

- Place your images inside `public/images/memories/` (WebP, AVIF, or JPEG recommended).
- Update `RAW_MEMORY_FILES` or `memoryPhotos` in `src/data/memories.ts`.
- To **reorder** photos, change their `order` value (or their position in `RAW_MEMORY_FILES`).
- To **add optional captions, dates, or longer messages**, add `caption`, `date`, or `message` to any `MemoryPhoto` object.
- **No categories or chapters** are used — all photos flow as one continuous book.

---

## Personalization Guide

- **Letters, Titles & Final Surprise**: Edit [`src/data/storyContent.ts`](src/data/storyContent.ts).
  - Uncomment `finalPhotoSrc`, `voiceNoteSrc`, or `videoSrc` in `storyContent.finalLetter` after placing the corresponding files in `public/`.
- **10 Love Heart Notes**: Edit [`src/data/loveMessages.ts`](src/data/loveMessages.ts).
- **Audio**: Replace any `.wav` file in `public/audio/` (`music.wav`, `envelope.wav`, `paper.wav`, `note.wav`, `chime.wav`) if desired.

---

## Deploying to Vercel (Free Hobby Plan)

1. Push this repository to GitHub, GitLab, or Bitbucket (or use the Vercel CLI).
2. Import the project in [Vercel](https://vercel.com/new).
3. Vercel automatically detects Vite (`vercel.json` is preconfigured):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy** — no backend, database, or paid API keys are required.
