import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { storyContent } from "../data/storyContent";
import "../styles/cake.css";

const CANDLES = ["පළමු", "දෙවන", "තුන්වන", "සිව්වන", "පස්වන"];

function FrostingRose({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={`cake-rose${small ? " cake-rose--small" : ""}`}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path className="cake-rose__leaf" d="M23 46C9 50 4 39 5 34c12-2 19 2 22 9M40 43c5-13 15-15 20-11-1 13-9 20-20 17" />
      <path className="cake-rose__outer" d="M32 8c7-6 16 0 17 7 11 0 15 11 9 19 5 9-3 19-12 18-5 10-19 11-25 2C9 57 2 45 7 36-1 27 6 16 17 17c1-8 8-12 15-9Z" />
      <path className="cake-rose__inner" d="M18 24c8-14 29-8 30 5 8 9-2 22-13 19-13 5-26-9-17-18 3-9 17-11 23-3 7 9-8 18-13 10-4-6 5-11 9-6" />
    </svg>
  );
}

export function BirthdayCakeScene({
  replayKey,
  onContinue,
}: {
  replayKey: number;
  onContinue?: () => void;
}) {
  // A story replay remounts all local state, effects, and decorative animation.
  return <BirthdayCake key={replayKey} onContinue={onContinue} />;
}

function BirthdayCake({ onContinue }: { onContinue?: () => void }) {
  const root = useRef<HTMLElement>(null);
  const extinguished = useRef(new Set<number>());
  const [off, setOff] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const complete = off.length === CANDLES.length;

  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out", duration: 1 },
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            end: "center 58%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .from(".cake-stand", { y: 35, opacity: 0 })
          .from(".cake-platter", { y: 24, scaleX: 0.85, opacity: 0 }, 0.2)
          .from(".cake-tier--bottom", { y: -45, opacity: 0 }, 0.45)
          .from(".cake-tier--top", { y: -60, opacity: 0 }, 0.8)
          .from(".cake-rose", { scale: 0, stagger: 0.06 }, 1.1)
          .from(".cake-candles", { y: -28 }, 1.25);
      });
    }, root);
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  function extinguish(index: number) {
    if (extinguished.current.has(index)) return;
    extinguished.current.add(index);
    setOff([...extinguished.current]);
  }

  function replay() {
    extinguished.current.clear();
    setOff([]);
    setRound((value) => value + 1);
  }

  return (
    <section
      ref={root}
      id="birthday"
      className="story-scene birthday-scene"
      data-scene="birthday"
      lang="si"
      aria-labelledby="birthday-title"
    >
      <div className="birthday-scene__intro">
        <p className="eyebrow" lang="en">{storyContent.birthday.eyebrow}</p>
        <h2 id="birthday-title" className="scene-title">{storyContent.birthday.title}</h2>
        <p id="birthday-instructions" className="subtle birthday-scene__instructions">
          {storyContent.birthday.instructions}
        </p>
      </div>

      <div className="birthday-cake-stage" data-complete={complete}>
        <span className="birthday-cake-halo" aria-hidden="true" />
        <span className="birthday-cake-spark birthday-cake-spark--one" aria-hidden="true">✧</span>
        <span className="birthday-cake-spark birthday-cake-spark--two" aria-hidden="true">✧</span>
        <div className="cake-stand" aria-hidden="true">
          <div className="cake-stand__stem" />
          <div className="cake-stand__foot" />
        </div>
        <div className="cake-platter" aria-hidden="true" />

        <div className="cake-tier cake-tier--bottom" aria-hidden="true">
          <div className="cake-tier__top" />
          <div className="cake-piping cake-piping--top" />
          <svg className="cake-swags" viewBox="0 0 360 90" preserveAspectRatio="none" focusable="false">
            <path d="M0 12Q45 88 90 12Q135 88 180 12Q225 88 270 12Q315 88 360 12" />
            <path d="M0 23Q45 99 90 23Q135 99 180 23Q225 99 270 23Q315 99 360 23" />
          </svg>
          <div className="cake-rose-row">
            <FrostingRose small /><FrostingRose /><FrostingRose small /><FrostingRose /><FrostingRose small />
          </div>
          <div className="cake-piping cake-piping--bottom" />
        </div>

        <div className="cake-tier cake-tier--top" aria-hidden="true">
          <div className="cake-tier__top" />
          <div className="cake-piping cake-piping--top" />
          <div className="cake-medallion"><span>♡</span></div>
          <div className="cake-top-roses"><FrostingRose small /><FrostingRose small /></div>
          <div className="cake-piping cake-piping--bottom" />
        </div>

        <div className="cake-candles" role="group" aria-label="උපන්දින ඉටිපන්දම්" aria-describedby="birthday-instructions">
          {CANDLES.map((name, index) => {
            const isOff = off.includes(index);
            return (
              <button
                key={`${round}-${index}`}
                type="button"
                className="cake-candle"
                data-extinguished={isOff}
                aria-label={`${name} ඉටිපන්දම ${isOff ? "නිවී ඇත" : "නිවන්න"}`}
                aria-pressed={isOff}
                aria-disabled={isOff}
                onClick={() => extinguish(index)}
              >
                <span className="cake-candle__flame" aria-hidden="true" />
                <span className="cake-candle__smoke" aria-hidden="true" />
                <span className="cake-candle__wick" aria-hidden="true" />
                <span className="cake-candle__wax" aria-hidden="true" />
                <span className="cake-candle__number" aria-hidden="true">{index + 1}</span>
              </button>
            );
          })}
        </div>

        {complete && (
          <div key={round} className="birthday-petals" aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => <i key={index} />)}
          </div>
        )}
      </div>

      <div className="birthday-scene__ending">
        <p className="subtle birthday-scene__count" aria-live="polite" aria-atomic="true" lang="si">
          නිවූ ඉටිපන්දම්: {off.length} / {CANDLES.length}
        </p>
        <div className="birthday-scene__wish" role="status" aria-live="polite" aria-atomic="true" lang="si">
          {complete && <h3 className="scene-title birthday-scene__greeting">{storyContent.birthday.greeting}</h3>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
          <button type="button" className="action birthday-scene__replay" onClick={replay} lang="si">
            {storyContent.birthday.replayLabel} <span aria-hidden="true">↺</span>
          </button>
          {complete && onContinue && (
            <button
              type="button"
              className="vintage-btn"
              onClick={() => {
                onContinue();
              }}
              lang="si"
            >
              <span>{storyContent.birthday.continueLabel}</span>
              <ArrowDown size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
