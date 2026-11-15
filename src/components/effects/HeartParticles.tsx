import { useEffect, useState } from 'react';
import './heartParticles.css';

interface HeartParticlesProps {
  density?: 'low' | 'medium';
  tone?: 'warm' | 'rose';
  className?: string;
}

interface ParticleSpec {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
}

const PARTICLES: ParticleSpec[] = [
  { id: 1, left: '6%', size: 12, duration: 13, delay: 0, opacity: 0.28, drift: 18 },
  { id: 2, left: '14%', size: 16, duration: 16, delay: 2.4, opacity: 0.22, drift: -16 },
  { id: 3, left: '23%', size: 10, duration: 12, delay: 5.1, opacity: 0.3, drift: 12 },
  { id: 4, left: '32%', size: 14, duration: 15, delay: 1.5, opacity: 0.24, drift: -20 },
  { id: 5, left: '41%', size: 11, duration: 14, delay: 6.8, opacity: 0.26, drift: 14 },
  { id: 6, left: '52%', size: 17, duration: 17, delay: 3.2, opacity: 0.2, drift: -14 },
  { id: 7, left: '61%', size: 12, duration: 13.5, delay: 0.8, opacity: 0.28, drift: 16 },
  { id: 8, left: '70%', size: 15, duration: 15.5, delay: 4.5, opacity: 0.24, drift: -18 },
  { id: 9, left: '79%', size: 10, duration: 12.5, delay: 2.0, opacity: 0.3, drift: 10 },
  { id: 10, left: '88%', size: 14, duration: 16.5, delay: 5.8, opacity: 0.22, drift: -15 },
  { id: 11, left: '94%', size: 11, duration: 14.2, delay: 1.1, opacity: 0.26, drift: 12 },
  { id: 12, left: '18%', size: 13, duration: 18, delay: 7.4, opacity: 0.2, drift: -12 },
  { id: 13, left: '47%', size: 10, duration: 13.8, delay: 8.2, opacity: 0.25, drift: 15 },
  { id: 14, left: '66%', size: 15, duration: 17.2, delay: 9.0, opacity: 0.2, drift: -17 },
];

export function HeartParticles({
  density = 'medium',
  tone = 'rose',
  className = '',
}: HeartParticlesProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const maxCount = isMobile
    ? density === 'low'
      ? 5
      : 7
    : density === 'low'
      ? 8
      : PARTICLES.length;

  const activeParticles = PARTICLES.slice(0, maxCount);
  const fill = tone === 'warm' ? '#e5b6aa' : '#c88388';

  return (
    <div
      className={`heart-particles ${className}`}
      aria-hidden="true"
    >
      {activeParticles.map((p) => (
        <span
          key={p.id}
          className="heart-particle"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 24 24" className="w-full h-full" focusable="false">
            <path
              fill={fill}
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
