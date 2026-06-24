import type { Album, AuthResponse, Role, Song, User } from '../types';

/**
 * Real API client for the Express/MongoDB backend.
 *
 * Auth: the backend sets an httpOnly cookie AND returns the token in the body.
 * We store the token in localStorage and send it as "Authorization: Bearer <token>"
 * on every authenticated request. credentials:'include' is also sent so the cookie
 * path works when the frontend and backend share the same origin (proxied via Vite).
 *
 * Routes (proxied to http://localhost:5000 via vite.config proxy):
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/logout
 *   GET  /api/albums          (auth required)
 *   POST /api/albums          (artist, multipart: coverImage file)
 *   GET  /api/albums/:id      (auth required)
 *   GET  /api/music           (auth required)
 *   POST /api/music           (artist, multipart: coverImage + audioUrl files)
 *   GET  /api/music/:id       (auth required)
 */

const BASE = import.meta.env.VITE_API_URL;
const SESSION_KEY = 'rs_session';

// ---------- Token helpers ----------
function saveSession(user: User, token: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

function getToken(): string | null {
  return getSession()?.token ?? null;
}

// ---------- Base fetch helpers ----------
function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {
      // ignore parse error
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  });
  return handleResponse<T>(res);
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

async function postForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: authHeaders(), // do NOT set Content-Type — browser sets it with boundary
    body: form,
  });
  return handleResponse<T>(res);
}

// ---------- AUTH ----------
interface RawAuthResponse {
  success: true;
  user: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: Role;
    createdAt?: string;
  };
  token: string;
}

function normaliseUser(raw: RawAuthResponse['user']): User {
  return {
    id: raw._id ?? raw.id ?? '',
    name: raw.name,
    email: raw.email,
    role: raw.role,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<AuthResponse> {
  const raw = await postJson<RawAuthResponse>('/auth/register', input);
  const user = normaliseUser(raw.user);
  saveSession(user, raw.token);
  return { success: true, user, token: raw.token };
}

export async function login(input: {
  name?: string;
  email?: string;
  password: string;
}): Promise<AuthResponse> {
  const raw = await postJson<RawAuthResponse>('/auth/login', input);
  const user = normaliseUser(raw.user);
  saveSession(user, raw.token);
  return { success: true, user, token: raw.token };
}

export async function logout(): Promise<void> {
  try {
    await postJson('/auth/logout', {});
  } finally {
    clearSession();
  }
}

// ---------- Raw shapes from backend ----------
interface RawArtist { _id: string; name: string }
interface RawAlbum {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  artist: RawArtist;
  songs: RawSong[];
  createdAt: string;
}
interface RawSong {
  _id: string;
  title: string;
  genre: string;
  audioUrl: string;
  coverImage: string;
  album: { _id: string; title: string } | null;
  artist: RawArtist;
  createdAt: string;
}

function normaliseSong(s: RawSong): Song {
  return {
    _id: s._id,
    title: s.title,
    genre: s.genre,
    audioUrl: s.audioUrl,
    coverImage: s.coverImage,
    album: s.album ?? null,
    artist: s.artist,
    createdAt: s.createdAt,
  };
}

function normaliseAlbum(a: RawAlbum): Album {
  return {
    _id: a._id,
    title: a.title,
    description: a.description,
    coverImage: a.coverImage,
    artist: a.artist,
    songs: (a.songs ?? []).map(normaliseSong),
    createdAt: a.createdAt,
  };
}

// ---------- ALBUMS ----------
interface AlbumsResponse { success: true; albums: RawAlbum[]; count: number }

export async function getAllAlbums(): Promise<Album[]> {
  const res = await get<AlbumsResponse>('/albums');
  return res.albums.map(normaliseAlbum);
}

export async function getAlbumById(id: string): Promise<Album> {
  const raw = await get<RawAlbum>(`/albums/${id}`);
  return normaliseAlbum(raw);
}

export async function createAlbum(input: {
  title: string;
  description: string;
  coverImageFile: File | null;
  coverImageUrl: string; // fallback when no file chosen
}): Promise<Album> {
  const form = new FormData();
  form.append('title', input.title);
  form.append('description', input.description);

  if (input.coverImageFile) {
    form.append('coverImage', input.coverImageFile);
  } else {
    // Fetch the stock URL and send it as a file so Multer gets a real file buffer
    const blob = await fetch(input.coverImageUrl).then((r) => r.blob());
    form.append('coverImage', blob, 'cover.jpg');
  }

  const res = await postForm<{ success: true; album: RawAlbum }>('/albums', form);
  return normaliseAlbum(res.album);
}

// Filter albums by artist client-side (no dedicated backend route)
export async function getAlbumsByArtist(artistId: string): Promise<Album[]> {
  const all = await getAllAlbums();
  return all.filter((a) => a.artist._id === artistId);
}

// ---------- MUSIC ----------
interface MusicResponse { success: true; music: RawSong[]; count: number }

export async function getAllMusic(): Promise<Song[]> {
  const res = await get<MusicResponse>('/music');
  return res.music.map(normaliseSong);
}

export async function getMusicById(id: string): Promise<Song> {
  const raw = await get<RawSong>(`/music/${id}`);
  return normaliseSong(raw);
}
export function getSession(): { user: User; token: string } | null {
  try {
    const raw = localStorage.getItem('rs_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export async function createMusic(input: {
  title: string;
  genre: string;
  coverImageFile: File | null;
  coverImageUrl: string;
  audioFile: File | null;
  albumId?: string;
}): Promise<Song> {
  const form = new FormData();
  form.append('title', input.title);
  form.append('genre', input.genre);
  if (input.albumId) form.append('album', input.albumId);

  if (input.coverImageFile) {
    form.append('coverImage', input.coverImageFile);
  } else {
    const blob = await fetch(input.coverImageUrl).then((r) => r.blob());
    form.append('coverImage', blob, 'cover.jpg');
  }

  if (input.audioFile) {
    // field name in the route is "audioUrl" (music.routes.js upload.fields config)
    form.append('audioUrl', input.audioFile);
  } else {
    // Send an empty placeholder so Multer doesn't error on missing field
    form.append('audioUrl', new Blob([], { type: 'audio/mpeg' }), 'empty.mp3');
  }

  const res = await postForm<{ success: true; music: RawSong }>('/music', form);
  return normaliseSong(res.music);
}
