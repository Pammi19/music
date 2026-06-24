import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Route =
  | { name: 'home' }
  | { name: 'albums' }
  | { name: 'album'; id: string }
  | { name: 'songs' }
  | { name: 'create-album' }
  | { name: 'upload-music' }
  | { name: 'login' }
  | { name: 'register' };

interface RouterValue {
  route: Route;
  navigate: (r: Route) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  const [name, id] = h.split('/');
  switch (name) {
    case 'albums':
      return { name: 'albums' };
    case 'album':
      return { name: 'album', id };
    case 'songs':
      return { name: 'songs' };
    case 'create-album':
      return { name: 'create-album' };
    case 'upload-music':
      return { name: 'upload-music' };
    case 'login':
      return { name: 'login' };
    case 'register':
      return { name: 'register' };
    default:
      return { name: 'home' };
  }
}

function toHash(r: Route): string {
  switch (r.name) {
    case 'album':
      return `#/album/${r.id}`;
    case 'create-album':
      return '#/create-album';
    case 'upload-music':
      return '#/upload-music';
    case 'login':
      return '#/login';
    case 'register':
      return '#/register';
    case 'albums':
      return '#/albums';
    case 'songs':
      return '#/songs';
    default:
      return '#/';
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((r: Route) => {
    window.location.hash = toHash(r);
  }, []);

  const value = useMemo<RouterValue>(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
