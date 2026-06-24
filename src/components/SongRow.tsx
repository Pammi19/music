import { Play, Pause } from 'lucide-react';
import type { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';

export default function SongRow({
  song,
  queue,
  index,
  showArt = true,
}: {
  song: Song;
  queue?: Song[];
  index?: number;
  showArt?: boolean;
}) {
  const { current, isPlaying, toggle, play } = usePlayer();
  const isCurrent = current?._id === song._id;
  const isCurrentPlaying = isCurrent && isPlaying;

  const onPlay = () => {
    if (isCurrent) toggle();
    else play(song, queue && queue.length ? queue : [song]);
  };

  return (
    <div
      onClick={onPlay}
      className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 cursor-pointer transition-all duration-200 ${
        isCurrent
          ? 'bg-brand-500/10 border border-brand-500/20'
          : 'hover:bg-white/[0.05] border border-transparent hover:border-white/[0.07]'
      }`}
    >
      {/* Track number / play state */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all">
        {isCurrentPlaying ? (
          <div className="playing-bar">
            <span /><span /><span />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <span className={`text-xs font-mono group-hover:opacity-0 transition-opacity ${isCurrent ? 'text-brand-400' : 'text-ink-500'}`}>
              {typeof index === 'number' ? index + 1 : '•'}
            </span>
            <Play className={`absolute h-3.5 w-3.5 fill-current opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent ? 'text-brand-400' : 'text-ink-300'}`} />
          </div>
        )}
      </div>

      {showArt && (
        <div className="relative shrink-0">
          <img
            src={song.coverImage}
            alt=""
            loading="lazy"
            className={`h-10 w-10 rounded-lg object-cover transition-all duration-300 ${isCurrent ? 'ring-1 ring-brand-500/40' : 'ring-1 ring-white/5'}`}
          />
          {isCurrent && !isCurrentPlaying && (
            <div className="absolute inset-0 rounded-lg bg-black/30 flex items-center justify-center">
              <Pause className="h-3 w-3 text-white fill-current" />
            </div>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium leading-tight ${isCurrent ? 'text-brand-300' : 'text-ink-100'}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-ink-500 mt-0.5">{song.artist.name}</p>
      </div>

      {song.genre && (
        <span className="hidden sm:inline chip bg-white/[0.05] border border-white/[0.06] text-ink-400 capitalize text-[11px]">
          {song.genre}
        </span>
      )}
      {song.album && (
        <span className="hidden md:block truncate text-xs text-ink-600 w-28 text-right">
          {song.album.title}
        </span>
      )}
    </div>
  );
}
