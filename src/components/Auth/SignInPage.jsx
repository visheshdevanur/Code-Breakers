import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';
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
      if (profile?.role === 'admin') navigate('/admin');
      else if (profile?.role === 'coordinator') navigate('/coordinator');
      else if (profile?.role === 'ngo') navigate('/ngo');
      else if (profile?.role === 'driver') navigate('/driver');
      else navigate('/donor');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-1">Sign in to your ReliefChain account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl border border-slate-700 p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
          )}
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-center text-sm text-slate-400">
            Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
