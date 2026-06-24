import { useState } from 'react';
import { Music2, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/RouterContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      push('success', `Welcome back, ${u.name}`);
      navigate({ name: 'home' });
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-500/[0.07] blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent-500/[0.05] blur-[130px]" />
      </div>

      <div className="w-full max-w-[420px] animate-scale-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 border border-brand-500/25 shadow-glow">
              <Music2 className="h-8 w-8 text-brand-400" />
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-brand-500/5 blur-lg" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-400">Sign in to continue to Resonance</p>
        </div>

        <div className="card p-7 sm:p-9 shadow-card-lg">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-300 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-300 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
                  aria-label="Toggle password visibility"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-ink-400">
            New here?{' '}
            <button
              type="button"
              onClick={() => navigate({ name: 'register' })}
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
