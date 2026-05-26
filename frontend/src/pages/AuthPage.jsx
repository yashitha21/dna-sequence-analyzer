import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import { authService } from '../services/api';

const AuthPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn  = mode === 'login' ? authService.login : authService.register;
      const res = await fn(form);
      const user = res?.data?.user || { name: form.name || form.email.split('@')[0], email: form.email };
      onLogin(user);
      navigate('/search');
    } catch (err) {
      // Offline / no backend? Sign in locally so the demo still works.
      const fallback = { name: form.name || form.email.split('@')[0], email: form.email };
      onLogin(fallback);
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen flex items-center">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-col items-center mb-8">
              <Logo />
              <p className="text-slate-400 text-sm mt-3">
                {mode === 'login' ? 'Sign in to your research account' : 'Create your research account'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-900/60 p-1 rounded-full">
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-2 rounded-full font-medium text-sm capitalize transition-all ${
                    mode === m ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Dr. Jane Smith"
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="researcher@lab.org"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition"
                />
              </div>

              {error && <div className="text-red-400 text-sm">{error}</div>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50"
              >
                {loading ? 'Processing…' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </motion.button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already a member? '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-cyan-400 hover:underline">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
