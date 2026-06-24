import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Song } from '../types';

interface PlayerContextValue {
  queue: Song[];
  current: Song | null;
  index: number;
  isPlaying: boolean;
  progress: number; // 0..1
  duration: number; // seconds
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  play: (song: Song, queue?: Song[]) => void;
  playQueue: (songs: Song[], startIndex?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (fraction: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  clear: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const DEMO_TRACK = 'https://cdn.pixabay.com/audio/2023/01/16/audio_8f6d8a6b6e.mp3';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');

  const current = queue[index] ?? null;

  // init audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onTime = () => {
      if (!audio.duration) return;
      setProgress(audio.currentTime / audio.duration);
      setDuration(audio.duration);
    };
    const onEnded = () => {
      // handled via state
      setProgress(1);
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // load source when current changes (fall back to a demo audio so playback works)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    const src = current.audioUrl || DEMO_TRACK;
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
      setProgress(0);
    }
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [current]);

  // keep play state in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying, current]);

  const play = useCallback((song: Song, newQueue?: Song[]) => {
    const q = newQueue && newQueue.length ? newQueue : [song];
    setQueue(q);
    const i = Math.max(0, q.findIndex((s) => s._id === song._id));
    setIndex(i);
    setIsPlaying(true);
  }, []);

  const playQueue = useCallback((songs: Song[], startIndex = 0) => {
    if (!songs.length) return;
    setQueue(songs);
    setIndex(Math.min(startIndex, songs.length - 1));
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (!current) return;
    setIsPlaying((p) => !p);
  }, [current]);

  const next = useCallback(() => {
    setQueue((q) => {
      if (!q.length) return q;
      let ni = index + 1;
      if (shuffle) ni = Math.floor(Math.random() * q.length);
      if (ni >= q.length) {
        if (repeat === 'all') ni = 0;
        else {
          setIsPlaying(false);
          return q;
        }
      }
      setIndex(ni);
      setIsPlaying(true);
      return q;
    });
  }, [index, shuffle, repeat]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setIndex((i) => {
      const ni = i <= 0 ? 0 : i - 1;
      setIsPlaying(true);
      return ni;
    });
  }, []);

  const seek = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
    setProgress(fraction);
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const cycleRepeat = useCallback(
    () => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')),
    []
  );
  const clear = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setQueue([]);
    setIndex(0);
    setIsPlaying(false);
  }, []);

  // auto-advance on end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      next();
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [next, repeat]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      queue,
      current,
      index,
      isPlaying,
      progress,
      duration,
      shuffle,
      repeat,
      play,
      playQueue,
      toggle,
      next,
      prev,
      seek,
      toggleShuffle,
      cycleRepeat,
      clear,
    }),
    [queue, current, index, isPlaying, progress, duration, shuffle, repeat, play, playQueue, toggle, next, prev, seek, toggleShuffle, cycleRepeat, clear]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
