import { useState, useEffect } from 'react';
import { Music2, Home, Disc3, Music, Upload, Plus, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { route, navigate } = useRouter();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isArtist = user?.role === 'artist';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'home' as const, label: 'Home', icon: Home },
    { name: 'albums' as const, label: 'Albums', icon: Disc3 },
    { name: 'songs' as const, label: 'Tracks', icon: Music },
  ];

  const handleLogout = async () => {
    await logout();
    push('info', 'Logged out');
    navigate({ name: 'home' });
    setOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/[0.08] bg-ink-950/90 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-brand-500/20 border border-brand-500/40 rounded-xl group-hover:bg-brand-500/30 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/30 to-transparent" />
                <Music2 className="relative h-4.5 w-4.5 text-brand-400" />
              </div>
              <span className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-white to-ink-300 bg-clip-text text-transparent">
                Resonance
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-0.5">
              {links.map((l) => {
                const active = route.name === l.name;
                return (
                  <button
                    key={l.name}
                    onClick={() => navigate({ name: l.name })}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      active ? 'text-white' : 'text-ink-400 hover:text-ink-100'
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-white/[0.08]" />
                    )}
                    <span className="relative">{l.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {isArtist && (
                  <>
                    <button
                      onClick={() => navigate({ name: 'create-album' })}
                      className="btn-ghost text-xs px-3 py-2"
                    >
                      <Plus className="h-3.5 w-3.5" /> Album
                    </button>
                    <button
                      onClick={() => navigate({ name: 'upload-music' })}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </button>
                  </>
                )}
                <div className="ml-1 flex items-center gap-1 rounded-full bg-white/[0.06] border border-white/[0.08] py-1 pl-1 pr-2 hover:bg-white/[0.09] transition-colors cursor-pointer">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white shadow-glow">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="px-1 leading-tight">
                    <p className="text-xs font-semibold text-ink-100 max-w-[88px] truncate">{user.name}</p>
                    <p className="text-[10px] text-ink-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-ink-500 ml-0.5" />
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-icon"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate({ name: 'login' })} className="btn-ghost text-sm">
                  Sign in
                </button>
                <button onClick={() => navigate({ name: 'register' })} className="btn-primary text-sm">
                  Get started
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden rounded-xl p-2 text-ink-300 hover:bg-white/8 transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-ink-950/98 backdrop-blur-2xl animate-fade-in">
          <div className="px-4 pt-4 pb-8 space-y-1">
            {links.map((l) => {
              const active = route.name === l.name;
              return (
                <button
                  key={l.name}
                  onClick={() => { navigate({ name: l.name }); setOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20'
                      : 'text-ink-300 hover:bg-white/5 hover:text-ink-100'
                  }`}
                >
                  <l.icon className={`h-4 w-4 ${active ? 'text-brand-400' : 'text-ink-500'}`} />
                  {l.label}
                </button>
              );
            })}

            {user && isArtist && (
              <div className="pt-4 border-t border-white/[0.06] space-y-1">
                <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                  Artist Studio
                </p>
                <button
                  onClick={() => { navigate({ name: 'create-album' }); setOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-ink-100 transition-all"
                >
                  <Plus className="h-4 w-4 text-ink-500" /> Create Album
                </button>
                <button
                  onClick={() => { navigate({ name: 'upload-music' }); setOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-ink-100 transition-all"
                >
                  <Upload className="h-4 w-4 text-ink-500" /> Upload Music
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.06]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-100">{user.name}</p>
                      <p className="text-xs text-ink-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn-ghost w-full">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button onClick={() => { navigate({ name: 'login' }); setOpen(false); }} className="btn-ghost w-full">Sign in</button>
                  <button onClick={() => { navigate({ name: 'register' }); setOpen(false); }} className="btn-primary w-full">Get started</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
