import { Pause, Play, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, ChevronUp, Music2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatDuration } from '../utils/format';
import { useState } from 'react';

export default function PlayerBar() {
  const { current, isPlaying, progress, duration, toggle, next, prev, seek, shuffle, toggleShuffle, repeat, cycleRepeat } = usePlayer();
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cur = current ? progress * (duration || 0) : 0;
  const vol = muted ? 0 : volume;

  if (!current) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-ink-950/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-center gap-2 px-4 text-sm text-ink-600">
          <Music2 className="h-4 w-4" />
          <span>Select a track to start playing</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${expanded ? 'bg-ink-900 border-t border-white/[0.1]' : 'border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-2xl'}`}>
      {/* Top progress strip */}
      <div
        className="relative h-1 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seek((e.clientX - rect.left) / rect.width);
        }}
      >
        <div className="absolute inset-0 bg-white/[0.06] group-hover:bg-white/[0.09] transition-colors" />
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-brand-400 shadow-glow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${progress * 100}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:px-6 py-3">
        {/* Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-60 sm:flex-none">
          <div className="relative shrink-0">
            <img
              src={current.coverImage}
              alt=""
              className={`h-11 w-11 rounded-lg object-cover shadow-card ring-1 ring-white/10 ${isPlaying ? 'animate-pulse-ring' : ''}`}
            />
            {isPlaying && (
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 shadow-glow">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-100 leading-tight">{current.title}</p>
            <p className="truncate text-xs text-ink-400 mt-0.5">{current.artist.name}</p>
          </div>
        </div>

        {/* Center controls */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleShuffle}
              className={`hidden sm:flex btn-icon ${shuffle ? 'text-brand-400' : 'text-ink-500 hover:text-ink-300'}`}
              aria-label="Shuffle"
            >
              <Shuffle className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={prev}
              className="btn-icon text-ink-300 hover:text-white"
              aria-label="Previous"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={toggle}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-950 hover:bg-brand-100 active:scale-95 transition-all shadow-card"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying
                ? <Pause className="h-5 w-5 fill-current" />
                : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={next}
              className="btn-icon text-ink-300 hover:text-white"
              aria-label="Next"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={cycleRepeat}
              className={`hidden sm:flex btn-icon ${repeat !== 'off' ? 'text-brand-400' : 'text-ink-500 hover:text-ink-300'}`}
              aria-label="Repeat"
            >
              {repeat === 'one' ? <Repeat1 className="h-3.5 w-3.5" /> : <Repeat className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="hidden sm:flex w-full max-w-sm items-center gap-2.5 text-[11px] text-ink-500">
            <span className="tabular-nums w-9 text-right">{formatDuration(cur)}</span>
            <input
              type="range"
              min={0} max={1} step={0.001}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="flex-1"
              style={{
                background: `linear-gradient(to right, #1fab7f ${progress * 100}%, rgba(255,255,255,0.08) ${progress * 100}%)`,
              }}
              aria-label="Seek"
            />
            <span className="tabular-nums w-9">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Volume + expand */}
        <div className="hidden sm:flex w-52 items-center justify-end gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="btn-icon"
            aria-label="Toggle mute"
          >
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={vol}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
            className="w-20"
            style={{
              background: `linear-gradient(to right, #aeb6c6 ${vol * 100}%, rgba(255,255,255,0.08) ${vol * 100}%)`,
            }}
            aria-label="Volume"
          />
          <button
            onClick={() => setExpanded((e) => !e)}
            className="btn-icon text-ink-500 hover:text-ink-200"
            aria-label="Expand player"
          >
            <ChevronUp className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile: playing indicator + expand */}
        <div className="sm:hidden flex items-center gap-2">
          {isPlaying && (
            <div className="playing-bar">
              <span /><span /><span />
            </div>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="btn-icon text-ink-500"
          >
            <ChevronUp className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded panel – mobile seek + controls */}
      {expanded && (
        <div className="sm:hidden px-6 pb-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 text-xs text-ink-500">
            <span className="tabular-nums">{formatDuration(cur)}</span>
            <input
              type="range"
              min={0} max={1} step={0.001}
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="flex-1"
              style={{
                background: `linear-gradient(to right, #1fab7f ${progress * 100}%, rgba(255,255,255,0.08) ${progress * 100}%)`,
              }}
            />
            <span className="tabular-nums">{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={toggleShuffle} className={`btn-icon ${shuffle ? 'text-brand-400' : 'text-ink-500'}`}>
              <Shuffle className="h-4 w-4" />
            </button>
            <button onClick={cycleRepeat} className={`btn-icon ${repeat !== 'off' ? 'text-brand-400' : 'text-ink-500'}`}>
              {repeat === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </button>
            <button onClick={() => setMuted((m) => !m)} className="btn-icon">
              {muted ? <VolumeX className="h-4 w-4 text-ink-400" /> : <Volume2 className="h-4 w-4 text-ink-400" />}
            </button>
            <input
              type="range"
              min={0} max={1} step={0.01}
              value={vol}
              onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
              className="w-24"
              style={{ background: `linear-gradient(to right, #aeb6c6 ${vol * 100}%, rgba(255,255,255,0.08) ${vol * 100}%)` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
