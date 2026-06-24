import { useEffect, useState } from 'react';
import { Music, Search } from 'lucide-react';
import type { Song } from '../types';
import { getAllMusic } from '../services/api';
import SongRow from '../components/SongRow';

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setSongs(await getAllMusic()); }
      finally { setLoading(false); }
    })();
  }, []);

  const genres = [...new Set(songs.map((s) => s.genre).filter(Boolean))].sort();

  const filtered = songs.filter((s) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || s.title.toLowerCase().includes(q) || s.artist.name.toLowerCase().includes(q);
    const matchG = !genre || s.genre === genre;
    return matchQ && matchG;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight">
            <Music className="h-7 w-7 text-brand-400" /> Tracks
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {songs.length} track{songs.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tracks…"
              className="input pl-10 w-48 py-2.5"
            />
          </div>
          {genres.length > 0 && (
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="input py-2.5 pr-8 w-36"
            >
              <option value="">All genres</option>
              {genres.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Genre pill filters */}
      {genres.length > 0 && !loading && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setGenre('')}
            className={`chip transition-all ${genre === '' ? 'bg-brand-500/15 border border-brand-500/30 text-brand-300' : 'bg-white/[0.05] border border-white/[0.07] text-ink-400 hover:text-ink-200'}`}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre((cur) => cur === g ? '' : g)}
              className={`chip transition-all capitalize ${genre === g ? 'bg-brand-500/15 border border-brand-500/30 text-brand-300' : 'bg-white/[0.05] border border-white/[0.07] text-ink-400 hover:text-ink-200'}`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-14 text-center">
          <Music className="mx-auto h-10 w-10 text-ink-700 mb-3" />
          <p className="text-ink-400">
            {query || genre ? 'No tracks match your filters.' : 'No tracks uploaded yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((song, i) => (
            <SongRow key={song._id} song={song} queue={filtered} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
