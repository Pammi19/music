export type Role = 'user' | 'artist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Album {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  artist: { _id: string; name: string };
  songs: Song[];
  createdAt: string;
}

export interface Song {
  _id: string;
  title: string;
  genre: string;
  audioUrl: string;
  coverImage: string;
  album: { _id: string; title: string } | null;
  artist: { _id: string; name: string };
  createdAt: string;
}

export interface AuthResponse {
  success: true;
  user: User;
  token: string;
}
