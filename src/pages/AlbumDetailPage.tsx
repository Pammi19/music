import { useEffect, useState } from 'react';
import { ArrowLeft, Play, Pause, Disc3, Music as MusicIcon, User, Clock, Plus } from 'lucide-react';
import type { Album } from '../types';
import { getAlbumById } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { useRouter } from '../context/RouterContext';
import SongRow from '../components/SongRow';
import { timeAgo } from '../utils/format';

export default function AlbumDetailPage({ id }: { id: string }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();
  const { current, isPlaying, playQueue, toggle } = usePlayer();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const a = await getAlbumById(id);
        if (active) setAlbum(a);
      } catch {
        if (active) setAlbum(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const songs = album?.songs ?? [];
  const isPlayingAlbum = isPlaying && songs.some((s) => s._id === current?._id);

  const toggleAlbum = () => {
    if (isPlayingAlbum) toggle();
    else playQueue(songs);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="skeleton h-5 w-28 rounded-full mb-8" />
        <div className="flex gap-8">
          <div className="skeleton h-52 w-52 shrink-0 rounded-2xl" />
          <div className="flex-1 space-y-4 pt-4">
            <div className="skeleton h-5 w-24 rounded-full" />
            <div className="skeleton h-10 w-2/3 rounded-xl" />
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-1/2 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-24 text-center">
        <Disc3 className="mx-auto h-12 w-12 text-ink-700 mb-4" />
        <h2 className="text-xl font-bold mb-2">Album not found</h2>
        <p className="text-ink-400 mb-6">This album may have been removed or the link is invalid.</p>
        <button onClick={() => navigate({ name: 'albums' })} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Back to albums
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Full-bleed hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={album.coverImage} alt="" className="h-full w-full object-cover blur-xl scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/80 to-ink-950" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-10">
          <button
            onClick={() => navigate({ name: 'albums' })}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ink-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Albums
          </button>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
            <div className="relative shrink-0">
              <img
                src={album.coverImage}
                alt={album.title}
                className="h-48 w-48 sm:h-60 sm:w-60 rounded-2xl object-cover shadow-card-lg ring-1 ring-white/10"
              />
              {isPlayingAlbum && (
                <div className="absolute -bottom-2 -right-2 rounded-full bg-brand-500 p-1.5 shadow-glow-lg">
                  <div className="playing-bar scale-90">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end pb-1">
              <span className="chip bg-white/[0.08] text-ink-300 w-fit mb-3">
                <Disc3 className="h-3 w-3" /> Album
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
                {album.title}
              </h1>
              {album.description && (
                <p className="text-ink-300 max-w-xl mb-4 text-sm leading-relaxed line-clamp-3">
                  {album.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-ink-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-ink-500" /> {album.artist.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <MusicIcon className="h-3.5 w-3.5 text-ink-500" />
                  {songs.length} song{songs.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-ink-500" />
                  {timeAgo(album.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={toggleAlbum}
              disabled={songs.length === 0}
              className="btn-primary"
            >
              {isPlayingAlbum
                ? <><Pause className="h-4 w-4 fill-current" /> Pause</>
                : <><Play className="h-4 w-4 fill-current" /> Play</>}
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title text-base">
            <MusicIcon className="h-4 w-4 text-ink-500" /> Tracklist
          </h2>
          <span className="text-xs text-ink-600">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
        </div>
        {songs.length === 0 ? (
          <div className="card p-12 text-center">
            <MusicIcon className="mx-auto h-9 w-9 text-ink-700 mb-3" />
            <p className="text-sm text-ink-400 mb-4">No songs in this album yet.</p>
            <button onClick={() => navigate({ name: 'upload-music' })} className="btn-ghost mx-auto text-sm">
              <Plus className="h-3.5 w-3.5" /> Upload a song
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <SongRow key={song._id} song={song} queue={songs} index={i} showArt={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
