import { useEffect, useState } from 'react';
import { Upload, Loader2, ImagePlus, Music as MusicIcon, Check, FileAudio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/RouterContext';
import { createMusic, getAlbumsByArtist } from '../services/api';
import type { Album } from '../types';

const GENRES = ['Electronic', 'Indie', 'Ambient', 'Synthwave', 'Lo-fi', 'Hip-Hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'Folk', 'R&B'];

const SUGGESTED_COVERS = [
  'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3784221/pexels-photo-3784221.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function UploadMusicPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const { navigate } = useRouter();

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState(SUGGESTED_COVERS[0]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [albumId, setAlbumId] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAlbums, setFetchingAlbums] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try { setAlbums(await getAlbumsByArtist(user.id)); }
      finally { setFetchingAlbums(false); }
    })();
  }, [user]);

  if (!user || user.role !== 'artist') {
    return (
      <div className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center animate-fade-in">
        <div className="card p-12">
          <MusicIcon className="mx-auto h-12 w-12 text-ink-700 mb-4" />
          <h1 className="text-xl font-bold mb-2">Artists only</h1>
          <p className="text-sm text-ink-400 mb-6">You need an artist account to upload music.</p>
          <button onClick={() => navigate({ name: 'register' })} className="btn-primary mx-auto">Become an artist</button>
        </div>
      </div>
    );
  }

  const handleImage = (file?: File) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { push('error', 'Image too large (max 4MB)'); return; }
    setCoverImageFile(file);
    setCoverImageUrl(URL.createObjectURL(file));
  };

  const handleAudio = (file?: File) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { push('error', 'Audio too large (max 20MB)'); return; }
    setAudioFile(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { push('error', 'Please give your track a title'); return; }
    setLoading(true);
    try {
      const song = await createMusic({
        title,
        genre: genre || 'Electronic',
        coverImageFile,
        coverImageUrl,
        audioFile,
        albumId: albumId || undefined,
      });
      push('success', `"${song.title}" uploaded`);
      navigate({ name: 'songs' });
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="flex items-center gap-2.5 text-3xl font-bold tracking-tight">
          <Upload className="h-7 w-7 text-brand-400" /> Upload Music
        </h1>
        <p className="mt-1 text-sm text-ink-400">Publish a new track to your listeners.</p>
      </div>

      <form onSubmit={submit} className="card p-6 sm:p-8 space-y-6">
        {/* Cover */}
        <div>
          <label className="mb-3 block text-xs font-semibold text-ink-300 uppercase tracking-wide">Cover art</label>
          <div className="flex gap-5 items-start">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl bg-ink-950 border border-white/10 shadow-card">
              <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
              <label className="absolute inset-0 flex flex-col items-center justify-center gap-1 cursor-pointer bg-black/0 hover:bg-black/50 text-white/0 hover:text-white/90 transition-all duration-200 group">
                <ImagePlus className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
              </label>
            </div>
            <div className="flex-1 space-y-3">
              <label className="btn-ghost cursor-pointer w-fit text-sm">
                <ImagePlus className="h-4 w-4" /> Upload image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
              </label>
              <div>
                <p className="text-[11px] text-ink-500 mb-2">Or pick a stock photo</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {SUGGESTED_COVERS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => { setCoverImageUrl(url); setCoverImageFile(null); }}
                      className={`relative aspect-square overflow-hidden rounded-xl transition-all ${
                        coverImageUrl === url && !coverImageFile
                          ? 'ring-2 ring-brand-500 ring-offset-1 ring-offset-ink-900'
                          : 'ring-1 ring-white/[0.06] hover:ring-white/20 hover:scale-105'
                      }`}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      {coverImageUrl === url && !coverImageFile && (
                        <span className="absolute inset-0 flex items-center justify-center bg-brand-500/40">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio upload */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-300 uppercase tracking-wide">
            Audio file <span className="normal-case text-ink-600 font-normal">(required)</span>
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-white/15 bg-ink-950/40 px-4 py-10 text-center transition-all hover:border-brand-500/50 hover:bg-brand-500/[0.04]">
            {audioFile ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 border border-brand-500/25">
                  <FileAudio className="h-6 w-6 text-brand-400" />
                </div>
                <p className="text-sm font-semibold text-ink-100">{audioFile.name}</p>
                <p className="text-xs text-ink-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB · click to replace</p>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.08]">
                  <Upload className="h-6 w-6 text-ink-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-200">Drop your track or <span className="text-brand-400">browse</span></p>
                  <p className="text-xs text-ink-500 mt-1">MP3, WAV, M4A · max 20 MB</p>
                </div>
              </>
            )}
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudio(e.target.files?.[0])} />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-300 uppercase tracking-wide">Track title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Tide"
              className="input"
              maxLength={80}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-300 uppercase tracking-wide">Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className="input">
              <option value="">Select genre…</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink-300 uppercase tracking-wide">
            Album <span className="normal-case text-ink-600 font-normal">(optional)</span>
          </label>
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="input"
            disabled={fetchingAlbums}
          >
            <option value="">Standalone track</option>
            {albums.map((a) => <option key={a._id} value={a._id}>{a.title}</option>)}
          </select>
          {albums.length === 0 && !fetchingAlbums && (
            <p className="mt-1.5 text-[11px] text-ink-500">
              No albums yet.{' '}
              <button type="button" onClick={() => navigate({ name: 'create-album' })} className="text-brand-400 hover:text-brand-300">
                Create one first
              </button>
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
            : <><Upload className="h-4 w-4" /> Upload Track</>}
        </button>
      </form>
    </div>
  );
}
