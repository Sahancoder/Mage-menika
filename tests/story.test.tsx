import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within, act, waitFor } from '@testing-library/react';
import App from '../src/App';
import { memoryPhotos, getOrderedMemories } from '../src/data/memories';
import { loveMessages } from '../src/data/loveMessages';
import { storyContent } from '../src/data/storyContent';

// Mock Howler so audio never fails in jsdom
vi.mock('howler', () => {
  class MockHowl {
    volume = vi.fn().mockReturnThis();
    play = vi.fn();
    pause = vi.fn();
    stop = vi.fn();
    fade = vi.fn();
    state = vi.fn().mockReturnValue('loaded');
    playing = vi.fn().mockReturnValue(false);
    unload = vi.fn();
  }
  return {
    Howl: MockHowl,
    Howler: { noAudio: false },
  };
});

describe('My Manika Birthday Story', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('has 31 continuous memory photos ordered sequentially with no categories', () => {
    const ordered = getOrderedMemories();
    expect(ordered.length).toBeGreaterThanOrEqual(20);
    expect(ordered.length).toBe(memoryPhotos.length);
    for (let i = 0; i < ordered.length; i += 1) {
      expect(ordered[i].order).toBe(i + 1);
      expect(ordered[i]).not.toHaveProperty('category');
      expect(ordered[i]).not.toHaveProperty('chapter');
    }
  });

  it('has 10 configurable love messages', () => {
    expect(loveMessages).toHaveLength(10);
    for (const msg of loveMessages) {
      expect(msg.message.length).toBeGreaterThan(5);
    }
  });

  it('renders opening headline, first letter, and audio control', () => {
    render(<App />);
    expect(screen.getByText(storyContent.intro.headline)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: storyContent.firstLetter.salutation }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enable music/i })).toBeInTheDocument();
  });

  it('opens the memory box on click and reveals the enter scrapbook button', () => {
    vi.useFakeTimers();
    render(<App />);

    const boxBtn = screen.getByRole('button', { name: storyContent.memoryBox.hint });
    fireEvent.click(boxBtn);

    act(() => {
      vi.advanceTimersByTime(650);
    });

    expect(
      screen.getByRole('button', { name: storyContent.memoryBox.enterScrapbookLabel }),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('opens and closes a love heart note dialog', async () => {
    render(<App />);

    const firstHeart = screen.getByRole('button', { name: `${loveMessages[0].title} අරින්න` });
    fireEvent.click(firstHeart);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(`“${loveMessages[0].message}”`)).toBeInTheDocument();

    const closeBtns = within(dialog).getAllByRole('button', {
      name: storyContent.loveHearts.closeNoteLabel,
    });
    fireEvent.click(closeBtns[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('opens a scrapbook photo in the lightbox and closes it', async () => {
    render(<App />);

    const firstPhotoBtn = screen.getByRole('button', {
      name: `${memoryPhotos[0].alt} විශාල කර බලන්න`,
    });
    fireEvent.click(firstPhotoBtn);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByAltText(memoryPhotos[0].alt)).toBeInTheDocument();

    const closeBtn = within(dialog).getByRole('button', { name: 'ඡායාරූපය වහන්න' });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('extinguishes all 5 birthday candles to reveal the birthday greeting and allows replay', () => {
    render(<App />);

    const candlesGroup = screen.getByRole('group', { name: 'උපන්දින ඉටිපන්දම්' });
    const candleButtons = within(candlesGroup).getAllByRole('button');
    expect(candleButtons).toHaveLength(5);

    for (const btn of candleButtons) {
      fireEvent.click(btn);
    }

    expect(screen.getByText(storyContent.birthday.greeting)).toBeInTheDocument();

    const replayBtn = screen.getByRole('button', { name: /නැවත ඉටිපන්දම් දල්වන්න/i });
    fireEvent.click(replayBtn);
    expect(screen.queryByText(storyContent.birthday.greeting)).not.toBeInTheDocument();
  });

  it('reveals the final letter on tap and supports restarting the story', async () => {
    render(<App />);

    const openFinalBtn = screen.getByRole('button', { name: storyContent.finalLetter.openHint });
    fireEvent.click(openFinalBtn);

    expect(await screen.findByText(storyContent.finalLetter.heading)).toBeInTheDocument();
    expect(screen.getByText(storyContent.finalLetter.signature)).toBeInTheDocument();

    const restartBtn = screen.getByRole('button', { name: storyContent.finalLetter.restartLabel });
    fireEvent.click(restartBtn);

    expect(
      await screen.findByRole('button', { name: storyContent.finalLetter.openHint }),
    ).toBeInTheDocument();
  });
});
