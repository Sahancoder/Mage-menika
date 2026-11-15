export function PressedFlower({
  className = '',
  variant = 'rose',
}: {
  className?: string;
  variant?: 'rose' | 'lavender';
}) {
  if (variant === 'lavender') {
    return (
      <svg
        viewBox="0 0 80 140"
        className={`pointer-events-none select-none ${className}`}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M40 132 C39 95, 42 58, 40 16"
          stroke="#7f8266"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M40 96 C26 88, 22 78, 30 74 C36 78, 39 86, 40 96Z" fill="#8b8e70" opacity="0.78" />
        <path d="M40 84 C54 76, 58 66, 50 62 C44 66, 41 74, 40 84Z" fill="#8b8e70" opacity="0.78" />
        {[20, 32, 44, 56, 68].map((y, i) => (
          <g key={y} opacity={0.86 - i * 0.04}>
            <ellipse cx={33} cy={y} rx="5" ry="7" transform={`rotate(-24 33 ${y})`} fill="#c89983" />
            <ellipse cx={47} cy={y + 4} rx="5" ry="7" transform={`rotate(24 47 ${y + 4})`} fill="#e5b6aa" />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 110 110"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M16 94 C35 76, 52 58, 66 44"
        stroke="#7b8265"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M36 74 C22 72, 18 60, 26 56 C34 58, 37 66, 36 74Z" fill="#879070" opacity="0.82" />
      <path d="M48 62 C52 48, 64 46, 66 54 C62 61, 55 64, 48 62Z" fill="#879070" opacity="0.82" />
      <g transform="translate(68 38)">
        <circle cx="0" cy="-14" r="11" fill="#e5b6aa" opacity="0.88" />
        <circle cx="13" cy="-4" r="11" fill="#dba398" opacity="0.86" />
        <circle cx="8" cy="11" r="11" fill="#e5b6aa" opacity="0.88" />
        <circle cx="-8" cy="11" r="11" fill="#d3968c" opacity="0.85" />
        <circle cx="-13" cy="-4" r="11" fill="#e5b6aa" opacity="0.88" />
        <circle cx="0" cy="0" r="6.5" fill="#c89983" />
        <circle cx="0" cy="0" r="3" fill="#764d45" opacity="0.7" />
      </g>
    </svg>
  );
}

export function VintageStamp({
  label = 'LOVE POST',
  year = '11 · 15',
  className = '',
}: {
  label?: string;
  year?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`inline-flex flex-col items-center justify-center w-16 h-20 px-1.5 py-2 border border-dashed border-[#a67c52]/65 bg-[#f4e8d3]/90 text-[#764d45] shadow-sm select-none ${className}`}
      style={{
        outline: '3px dotted rgba(244, 232, 211, 0.95)',
        outlineOffset: '-2px',
      }}
    >
      <span className="text-[8px] tracking-[0.18em] font-display-en uppercase opacity-80">
        {label}
      </span>
      <svg viewBox="0 0 24 24" className="w-6 h-6 my-1 fill-[#9b5b60]/85">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="text-[9px] font-display-en tracking-widest opacity-75">{year}</span>
    </div>
  );
}

export function WaxSeal({
  text = '♥',
  broken = false,
  className = '',
  size = 68,
}: {
  text?: string;
  broken?: boolean;
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-500 ${
        broken ? 'scale-90 opacity-85' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_6px_12px_rgba(47,32,32,0.45)]">
        <defs>
          <radialGradient id="waxGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#b85d64" />
            <stop offset="55%" stopColor="#8b3b44" />
            <stop offset="100%" stopColor="#5b2229" />
          </radialGradient>
        </defs>
        <path
          d="M50 5 C62 4, 73 10, 81 18 C90 26, 95 38, 94 50 C95 63, 88 75, 79 83 C70 91, 59 95, 47 94 C35 95, 24 89, 16 80 C8 71, 5 59, 6 47 C5 34, 12 22, 21 15 C30 8, 40 5, 50 5Z"
          fill="url(#waxGrad)"
        />
        <circle
          cx="50"
          cy="50"
          r="33"
          fill="none"
          stroke="rgba(255, 249, 240, 0.28)"
          strokeWidth="1.5"
        />
        {broken && (
          <path
            d="M46 14 L52 38 L43 53 L56 71 L49 88"
            stroke="#2f2020"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[#fff9f0]/90 font-semibold tracking-wide"
        style={{ fontSize: size * 0.22 }}
      >
        {text}
      </span>
    </div>
  );
}

export function PhotoCorner({
  position,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
}) {
  const posClasses: Record<'tl' | 'tr' | 'bl' | 'br', string> = {
    tl: '-top-1.5 -left-1.5',
    tr: '-top-1.5 -right-1.5 rotate-90',
    br: '-bottom-1.5 -right-1.5 rotate-180',
    bl: '-bottom-1.5 -left-1.5 -rotate-90',
  };

  return (
    <svg
      viewBox="0 0 28 28"
      aria-hidden="true"
      className={`pointer-events-none absolute w-5 h-5 ${posClasses[position]} drop-shadow-sm`}
    >
      <path d="M0 0 L28 0 L0 28 Z" fill="#462d30" opacity="0.84" />
      <path d="M2 2 L20 2 L2 20 Z" fill="#764d45" opacity="0.55" />
    </svg>
  );
}

export function PaperClip({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 84"
      aria-hidden="true"
      className={`pointer-events-none select-none drop-shadow ${className}`}
    >
      <path
        d="M12 24 L12 64 C12 73, 24 73, 24 64 L24 16 C24 6, 8 6, 8 16 L8 58 C8 65, 18 65, 18 58 L18 24"
        fill="none"
        stroke="#b58d63"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
