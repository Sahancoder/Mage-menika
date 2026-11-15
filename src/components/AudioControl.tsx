import { Music2, VolumeX } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

export function AudioControl() {
  const { enabled, toggle, available, error } = useAudio();
  const label = enabled ? 'Disable music' : 'Enable music';

  return (
    <div className="audio-control">
      <button
        type="button"
        className="audio-toggle"
        onClick={toggle}
        aria-label={label}
        aria-pressed={enabled}
        disabled={!available}
        title={label}
      >
        {enabled ? <Music2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
        <span>{enabled ? 'Music on' : 'Music off'}</span>
      </button>
      <span className="audio-status" role="status" aria-live="polite" aria-atomic="true">
        {error ?? (!available ? 'Audio unavailable. The story works without sound.' : '')}
      </span>
    </div>
  );
}
