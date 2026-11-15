import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Original, deterministic synthesis. No samples, downloads, or dependencies.
const output = new URL('../public/audio/', import.meta.url);
const sampleRate = 22050;
const tau = Math.PI * 2;

function envelope(time, duration, attack = 0.02, release = 0.2) {
  if (time < 0 || time >= duration) return 0;
  return Math.min(1, time / attack) * Math.min(1, (duration - time) / release);
}

function tone(frequency, time) {
  return Math.sin(tau * frequency * time) + 0.18 * Math.sin(tau * frequency * 2 * time);
}

function randomNoise(seed) {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state / 0x100000000) * 2 - 1;
  };
}

async function writeWav(name, samples) {
  const dataBytes = samples.length * 2;
  const wav = Buffer.alloc(44 + dataBytes);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + dataBytes, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); // PCM
  wav.writeUInt16LE(1, 22); // Mono
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(dataBytes, 40);
  for (let i = 0; i < samples.length; i++) {
    const value = Math.max(-1, Math.min(1, samples[i]));
    wav.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  await writeFile(new URL(`${name}.wav`, output), wav);
  console.log(`${name}.wav: ${(samples.length / sampleRate).toFixed(2)}s, ${wav.length} bytes`);
}

function render(duration, sample) {
  return Float64Array.from({ length: Math.round(duration * sampleRate) }, (_, index) => sample(index / sampleRate));
}

function music() {
  // Eight bars at 60 BPM: a quiet Cmaj7–Am7–Fmaj7–Gsus2 progression.
  const duration = 32;
  const samples = new Float64Array(duration * sampleRate);
  const chords = [
    [130.8128, 164.8138, 195.9977, 246.9417],
    [110, 130.8128, 164.8138, 195.9977],
    [87.3071, 130.8128, 164.8138, 220],
    [97.9989, 146.8324, 195.9977, 220],
  ];
  const melody = [523.2511, 493.8833, 391.9954, 329.6276, 440, 391.9954, 293.6648, 391.9954];
  const addNote = (start, length, frequency, gain, attack) => {
    for (let i = 0; i < Math.round(length * sampleRate); i++) {
      const time = i / sampleRate;
      const amplitude = envelope(time, length, attack, Math.min(1.4, length / 2));
      // Wrap the tail into the beginning so the loop has no cut-off reverb.
      const index = (Math.round(start * sampleRate) + i) % samples.length;
      samples[index] += gain * amplitude * tone(frequency, time) * Math.exp(-time * 0.24);
    }
  };
  for (let bar = 0; bar < 8; bar++) {
    const chord = chords[Math.floor(bar / 2)];
    chord.forEach((frequency, index) => addNote(bar * 4 + index * 0.08, 5, frequency, 0.035, 0.3));
    for (let beat = 0; beat < 4; beat++) {
      addNote(bar * 4 + beat, 2.8, chord[(beat + bar) % chord.length] * 2, 0.055, 0.025);
    }
    addNote(bar * 4 + 0.5, 3.4, melody[bar], 0.045, 0.06);
  }
  return samples;
}

function rustle(duration, seed, flutter, gain) {
  const noise = randomNoise(seed);
  let filtered = 0;
  return render(duration, (time) => {
    const white = noise();
    filtered += 0.12 * (white - filtered);
    const texture = white - filtered;
    const motion = 0.3 + 0.7 * Math.sin(Math.PI * flutter * time) ** 2;
    return gain * texture * motion * envelope(time, duration, 0.04, 0.14);
  });
}

await mkdir(output, { recursive: true });
await writeWav('music', music());
await writeWav('envelope', rustle(0.65, 17, 5, 0.22));
await writeWav('paper', rustle(0.9, 83, 8, 0.16));
await writeWav('note', render(0.65, (time) =>
  0.25 * tone(659.2551, time) * Math.exp(-time * 7) * envelope(time, 0.65, 0.008, 0.16)));
await writeWav('chime', render(1.8, (time) => {
  const notes = [523.2511, 659.2551, 783.9909];
  return notes.reduce((sum, frequency, index) => {
    const local = time - index * 0.16;
    if (local < 0) return sum;
    return sum + 0.13 * tone(frequency, local) * Math.exp(-local * 3.5)
      * envelope(local, 1.8 - index * 0.16, 0.008, 0.3);
  }, 0);
}));
console.log(`Generated original PCM audio in ${fileURLToPath(output)}`);
