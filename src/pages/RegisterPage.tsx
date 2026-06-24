import { useState } from 'react';
import { Music2, Mail, Lock, User as UserIcon, Loader2, ArrowRight, Headphones, Mic2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from '../context/RouterContext';
import type { Role } from '../types';

export default function RegisterPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<Role>('user');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await register(name, email, password, role);
      push('success', `Welcome to Resonance, ${u.name}!`);
      navigate({ name: 'home' });
    } catch (err) {
      push('error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-500/[0.07] blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-accent-500/[0.04] blur-[130px]" />
      </div>

      <div className="w-full max-w-[440px] animate-scale-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 border border-brand-500/25 shadow-glow">
              <Music2 className="h-8 w-8 text-brand-400" />
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-brand-500/5 blur-lg" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Join Resonance</h1>
          <p className="mt-1.5 text-sm text-ink-400">Create your account to get started</p>
        </div>

        <div className="card p-7 sm:p-9 shadow-card-lg">
          <form onSubmit={submit} className="space-y-5">
            {/* Account type */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-300 uppercase tracking-wide">I want to</label>
              <div className="grid grid-cols-2 gap-2.5">
                {([
                  { value: 'user', label: 'Listen', desc: 'Browse & stream music', icon: Headphones },
                  { value: 'artist', label: 'Create', desc: 'Upload & publish music', icon: Mic2 },
                ] as const).map((opt) => {
                  const active = role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRole(opt.value)}
                      className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? 'border-brand-500/50 bg-brand-500/10 shadow-glow'
                          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.05]'
                      }`}
                    >
                      <opt.icon className={`h-5 w-5 mb-2 ${active ? 'text-brand-400' : 'text-ink-500'}`} />
                      <p className={`text-sm font-semibold ${active ? 'text-brand-300' : 'text-ink-200'}`}>{opt.label}</p>
                      <p className="text-[11px] leading-tight text-ink-500 mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-300 uppercase tracking-wide">Display name</label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input pl-10"
                />
              </div>
            </div>

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
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 4 characters"
                  className="input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-ink-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate({ name: 'login' })}
              className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
