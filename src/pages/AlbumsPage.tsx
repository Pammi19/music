import { useEffect, useState } from 'react';
import { Disc3, Plus, Search } from 'lucide-react';
import type { Album } from '../types';
import { getAllAlbums } from '../services/api';
import AlbumCard from '../components/AlbumCard';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setAlbums(await getAllAlbums()); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = query.trim()
    ? albums.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.artist.name.toLowerCase().includes(query.toLowerCase())
      )
    : albums;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight">
            <Disc3 className="h-7 w-7 text-brand-400" /> Albums
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {albums.length} album{albums.length !== 1 ? 's' : ''} from independent artists
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search albums…"
              className="input pl-10 w-56 py-2.5"
            />
          </div>
          {user?.role === 'artist' && (
            <button
              onClick={() => navigate({ name: 'create-album' })}
              className="btn-primary whitespace-nowrap"
            >
              <Plus className="h-4 w-4" /> New
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-square rounded-2xl" />
              <div className="skeleton mt-3 h-3 w-3/4 rounded-full" />
              <div className="skeleton mt-2 h-2.5 w-1/2 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Disc3 className="mx-auto h-10 w-10 text-ink-700 mb-3" />
          <p className="text-ink-400">
            {query ? `No albums matching "${query}"` : 'No albums published yet.'}
          </p>
          {user?.role === 'artist' && !query && (
            <button onClick={() => navigate({ name: 'create-album' })} className="btn-primary mt-4 mx-auto">
              <Plus className="h-4 w-4" /> Create your first album
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {filtered.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
