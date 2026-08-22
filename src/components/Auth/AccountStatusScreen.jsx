import { Clock, XCircle, Ban, ArrowRight, LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { signOut } from '../../lib/supabase';

export default function AccountStatusScreen({ status, profile, onLogout }) {
  const handleLogout = async () => { await signOut(); onLogout?.(); };

  const screens = {
    admin_pending: {
      icon: <Clock className="w-10 h-10 text-amber-400" />,
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      title: 'Awaiting Admin Approval',
      desc: 'Your account is under review by the administrator. You will be notified once approved.',
      steps: ['Admin reviews your credentials', 'Account is approved', 'Full access granted'],
    },
    ngo_pending: {
      icon: <Building2 className="w-10 h-10 text-blue-400" />,
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      title: 'Awaiting NGO Verification',
      desc: 'Admin has approved you. Now an NGO partner needs to verify your details before you can access the platform.',
      steps: ['✅ Admin approved', 'NGO reviews your profile', 'Full access granted'],
    },
    admin_rejected: {
      icon: <XCircle className="w-10 h-10 text-red-400" />,
      iconBg: 'bg-red-500/10 border-red-500/20',
      title: 'Application Rejected',
      desc: 'Your application was not approved. Please review the reason and resubmit.',
    },
    suspended: {
      icon: <Ban className="w-10 h-10 text-orange-400" />,
      iconBg: 'bg-orange-500/10 border-orange-500/20',
      title: 'Account Suspended',
      desc: 'Your account has been suspended. Contact the admin team for help.',
    },
  };

  const s = screens[status] || screens.admin_pending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-md w-full text-center anim-up">
        <div className={`w-20 h-20 rounded-3xl ${s.iconBg} border flex items-center justify-center mx-auto mb-6`}>
          {s.icon}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{s.title}</h1>
        <p className="text-neutral-500 text-sm leading-relaxed mb-6">{s.desc}</p>

        {profile?.rejection_reason && status === 'admin_rejected' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-left mb-6">
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Reason</div>
            <p className="text-sm text-red-300">{profile.rejection_reason}</p>
          </div>
        )}

        {s.steps && (
          <div className="dark-card p-5 text-left mb-6">
            <div className="text-xs text-neutral-500 font-medium mb-3">Progress</div>
            <div className="space-y-3">
              {s.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.startsWith('✅') ? 'bg-emerald-500/10' : 'bg-white/[0.04]'}`}>
                    {step.startsWith('✅') ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : <span className="text-[10px] font-bold text-neutral-500">{i + 1}</span>}
                  </div>
                  <span className={`text-sm ${step.startsWith('✅') ? 'text-emerald-400' : 'text-neutral-300'}`}>{step.replace('✅ ', '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="btn-dark w-full !py-3">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
