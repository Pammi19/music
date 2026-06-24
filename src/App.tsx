import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import SongsPage from './pages/SongsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import CreateAlbumPage from './pages/CreateAlbumPage';
import UploadMusicPage from './pages/UploadMusicPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function Routes() {
  const { route } = useRouter();

  const isAuthPage = route.name === 'login' || route.name === 'register';

  let page: React.ReactNode;
  switch (route.name) {
    case 'login':
      page = <LoginPage />;
      break;
    case 'register':
      page = <RegisterPage />;
      break;
    case 'albums':
      page = <AlbumsPage />;
      break;
    case 'album':
      page = <AlbumDetailPage id={route.id} />;
      break;
    case 'songs':
      page = <SongsPage />;
      break;
    case 'create-album':
      page = <CreateAlbumPage />;
      break;
    case 'upload-music':
      page = <UploadMusicPage />;
      break;
    default:
      page = <HomePage />;
  }

  if (isAuthPage) {
    return <main className="min-h-screen">{page}</main>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-28">{page}</main>
      <PlayerBar />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider>
          <PlayerProvider>
            <Routes />
          </PlayerProvider>
        </RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
