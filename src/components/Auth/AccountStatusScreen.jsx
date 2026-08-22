import { Clock, XCircle, Ban, ShieldAlert, ArrowRight, LogOut } from 'lucide-react';
import { signOut } from '../../lib/supabase';

export default function AccountStatusScreen({ status, rejectionReason, onLogout }) {
  const handleLogout = async () => {
    await signOut();
    onLogout?.();
  };

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-md w-full text-center anim-up">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Application Under Review</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6">
            Your account request has been submitted successfully. An administrator will review your credentials and approve your access shortly.
          </p>
          <div className="dark-card p-5 text-left mb-6">
            <div className="text-xs text-neutral-500 font-medium mb-3">What happens next?</div>
            <div className="space-y-3">
              {['Admin reviews your documents', 'You receive approval notification', 'Full dashboard access is granted'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-amber-400">{i + 1}</span>
                  </div>
                  <span className="text-sm text-neutral-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleLogout} className="btn-dark w-full !py-3">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-md w-full text-center anim-up">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Application Rejected</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-4">
            Your application was not approved. Please review the reason below and resubmit.
          </p>
          {rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-left mb-6">
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Reason</div>
              <p className="text-sm text-red-300">{rejectionReason}</p>
            </div>
          )}
          <div className="space-y-2">
            <button onClick={handleLogout} className="btn-red w-full !py-3">
              <ArrowRight className="w-4 h-4" /> Edit & Resubmit
            </button>
            <button onClick={handleLogout} className="btn-dark w-full !py-3">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'suspended') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-md w-full text-center anim-up">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
            <Ban className="w-10 h-10 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Suspended</h1>
          <p className="text-neutral-500 text-sm leading-relaxed mb-6">
            Your account has been temporarily suspended by an administrator. Please contact the admin team for assistance.
          </p>
          <button onClick={handleLogout} className="btn-dark w-full !py-3">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return null;
}
