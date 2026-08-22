import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { signIn, getProfile } from '../../lib/supabase';

export default function AdminLoginPage({ onAuth }) {
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
      if (profile?.role !== 'admin') {
        setError('Access denied. This login is only for administrators.');
        setLoading(false);
        return;
      }
      onAuth?.(data.user, profile);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 anim-up">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/25 anim-pulse-red">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-neutral-600 text-sm mt-1">ReliefChain Control Room</p>
        </div>

        <form onSubmit={handleSubmit} className="dark-card p-6 space-y-4 anim-up d1">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="text-xs text-neutral-500 font-medium block mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input !pl-11" placeholder="admin@reliefchain.org" />
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-500 font-medium block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input !pl-11" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-red w-full !py-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Access Control Room</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        <p className="text-center text-[11px] text-neutral-700 mt-4">Authorized personnel only.</p>
      </div>
    </div>
  );
}
