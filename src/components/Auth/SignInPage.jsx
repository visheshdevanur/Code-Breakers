import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signIn, getProfile } from '../../lib/supabase';

export default function SignInPage({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signIn(email, password);
      const profile = await getProfile(data.user.id);
      onAuth?.(data.user, profile);
      navigate(profile?.role === 'admin' ? '/admin' : `/${profile?.role || 'donor'}`);
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8 anim-up">
          <Link to="/" className="inline-block mb-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-600/20">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-neutral-500 mt-1 text-sm">Sign in to ReliefChain</p>
        </div>

        <form onSubmit={handleSubmit} className="dark-card !hover:transform-none p-6 sm:p-8 space-y-5 anim-up d1">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input !pl-11" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input !pl-11" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-red w-full !py-3.5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-center text-sm text-neutral-500">
            New here? <Link to="/signup" className="text-red-400 hover:text-red-300 font-medium">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
