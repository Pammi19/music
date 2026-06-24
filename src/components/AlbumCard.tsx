import { Play, Pause } from 'lucide-react';
import type { Album } from '../types';
import { useRouter } from '../context/RouterContext';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumCard({ album }: { album: Album }) {
  const { navigate } = useRouter();
  const { playQueue, current, isPlaying } = usePlayer();

  const isAlbumPlaying = isPlaying && album.songs.some((s) => s._id === current?._id);

  return (
    <div
      onClick={() => navigate({ name: 'album', id: album._id })}
      className="group cursor-pointer animate-fade-in"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-900 shadow-card ring-1 ring-white/[0.05]">
        <img
          src={album.coverImage}
          alt={album.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Playing indicator */}
        {isAlbumPlaying && (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-brand-500/90 px-2 py-0.5 flex items-center gap-1.5 backdrop-blur-sm">
            <div className="playing-bar scale-75">
              <span /><span /><span />
            </div>
            <span className="text-[10px] font-semibold text-white">Playing</span>
          </div>
        )}

        {/* Play button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playQueue(album.songs.length ? album.songs : []);
          }}
          className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-brand-500 text-white opacity-0 shadow-glow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-brand-400 active:scale-95"
          aria-label={isAlbumPlaying ? 'Pause album' : 'Play album'}
        >
          {isAlbumPlaying
            ? <Pause className="h-5 w-5 fill-current" />
            : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="truncate text-sm font-semibold text-ink-100 group-hover:text-white transition-colors">
          {album.title}
        </h3>
        <p className="truncate text-xs text-ink-500 mt-0.5">{album.artist.name}</p>
        {album.songs.length > 0 && (
          <p className="text-[10px] text-ink-600 mt-0.5">{album.songs.length} song{album.songs.length !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
}
