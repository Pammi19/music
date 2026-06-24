import { useEffect, useState } from 'react';
import { Play, TrendingUp, Disc3, ChevronRight, Sparkles, Music2 } from 'lucide-react';
import type { Album, Song } from '../types';
import { getAllAlbums, getAllMusic ,getSession} from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import AlbumCard from '../components/AlbumCard';
import SongRow from '../components/SongRow';

export default function HomePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayer();
  const { navigate } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
     const session = getSession();

  if (!session?.token) {
    setLoading(false);
    return;
  }
    (async () => {
      setLoading(true);
      try {
        const [a, s] = await Promise.all([getAllAlbums(), getAllMusic()]);
        if (active) { setAlbums(a); setSongs(s); }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const featured = albums[0];
  const trending = songs.slice(0, 6);
  const recentAlbums = albums.slice(0, 8);

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 space-y-14">
      {/* ── Hero ─────────────────────────────────── */}
      {loading ? (
        <div className="skeleton h-80 sm:h-96 rounded-3xl" />
      ) : featured ? (
        <section className="relative overflow-hidden rounded-3xl animate-fade-in">
          {/* Background */}
          <div className="absolute inset-0">
            <img src={featured.coverImage} alt="" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-ink-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
          </div>

          {/* Soft brand glow */}
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-brand-500/10 blur-[100px]" />

          <div className="relative max-w-2xl px-8 py-12 sm:px-14 sm:py-16">
            <span className="inline-flex mb-5 border chip bg-brand-500/15 border-brand-500/25 text-brand-300">
              <Sparkles className="w-3 h-3" /> Featured Album
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-3">
              {featured.title}
            </h1>
            <p className="mb-1 font-medium text-ink-300">{featured.artist.name}</p>
            <p className="max-w-md mb-8 text-sm text-ink-400 line-clamp-2">{featured.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => playQueue(featured.songs.length ? featured.songs : [])}
                className="btn-primary"
                disabled={!featured.songs.length}
              >
                <Play className="w-4 h-4 fill-current" /> Play Album
              </button>
              <button
                onClick={() => navigate({ name: 'album', id: featured._id })}
                className="btn-ghost"
              >
                View Album <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500/10 via-ink-900 to-ink-950 border border-white/[0.06] px-8 py-16 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-brand-500/10 blur-[60px]" />
          <Music2 className="w-12 h-12 mx-auto mb-4 text-brand-500/40" />
          <h1 className="mb-2 text-3xl font-bold">Welcome to Resonance</h1>
          <p className="max-w-md mx-auto mb-6 text-ink-400">
            A music platform for independent artists. Sign up as an artist to publish your tracks.
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate({ name: 'login' })} className="btn-ghost">Sign in</button>
            <button onClick={() => navigate({ name: 'register' })} className="btn-primary">Join free</button>
          </div>
        </section>
      )}

      {/* ── Sign-up CTA ───────────────────────────── */}
      {!user && !loading && albums.length > 0 && (
        <section className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in border-brand-500/10 bg-gradient-to-r from-brand-500/[0.06] to-transparent">
          <div>
            <h2 className="mb-1 text-lg font-bold">Ready to dive in?</h2>
            <p className="text-sm text-ink-400">Create an account to start streaming, or sign up as an artist to publish music.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => navigate({ name: 'login' })} className="text-sm btn-ghost">Sign in</button>
            <button onClick={() => navigate({ name: 'register' })} className="text-sm btn-primary">Join free</button>
          </div>
        </section>
      )}

      {/* ── Trending tracks ───────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">
            <TrendingUp className="w-5 h-5 text-accent-400" /> Trending Now
          </h2>
          {songs.length > 6 && (
            <button onClick={() => navigate({ name: 'songs' })} className="flex items-center gap-1 text-sm font-medium transition-colors text-ink-400 hover:text-white">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 skeleton rounded-2xl" />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <div className="p-10 text-center card">
            <p className="text-sm text-ink-500">No tracks yet.</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((song, i) => (
              <SongRow key={song._id} song={song} queue={trending} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── New releases ─────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">
            <Disc3 className="w-5 h-5 text-brand-400" /> New Releases
          </h2>
          {albums.length > 8 && (
            <button onClick={() => navigate({ name: 'albums' })} className="flex items-center gap-1 text-sm font-medium transition-colors text-ink-400 hover:text-white">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton aspect-square rounded-2xl" />
                <div className="w-3/4 h-3 mt-3 rounded-full skeleton" />
              </div>
            ))}
          </div>
        ) : recentAlbums.length === 0 ? (
          <div className="p-10 text-center card">
            <p className="text-sm text-ink-500">No albums yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {recentAlbums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
