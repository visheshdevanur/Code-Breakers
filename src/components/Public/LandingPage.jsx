import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, MapPin, Users, Heart, AlertTriangle, ChevronRight, Activity, Truck, Sun, Moon, Shield, Globe, Zap, BarChart3, Phone, ExternalLink } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';
import { useTheme } from '../../lib/ThemeContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalPop = seedCamps.reduce((s, c) => s + c.current_population, 0);
  const criticalCount = seedCamps.filter(c => getStatus(calculatePriorityScore(c, seedResources)).status === 'critical').length;

  const stats = [
    { value: seedCamps.length, label: 'Active Camps', icon: MapPin, color: 'var(--blue)' },
    { value: totalPop.toLocaleString(), label: 'People Affected', icon: Users, color: 'var(--violet)' },
    { value: criticalCount, label: 'Critical Alerts', icon: AlertTriangle, color: 'var(--danger)' },
    { value: '₹21K', label: 'Donations', icon: Heart, color: 'var(--green)' },
  ];

  const actions = [
    { label: 'Emergency SOS', icon: Phone, desc: 'Send distress signal' },
    { label: 'Report Incident', icon: AlertTriangle, desc: 'Log a new event' },
    { label: 'Find Shelter', icon: Shield, desc: 'Locate nearest camp' },
    { label: 'Live Tracking', icon: Activity, desc: 'Real-time updates' },
    { label: 'Donate', icon: Heart, desc: 'Contribute supplies' },
    { label: 'Relief Map', icon: Globe, desc: 'View all operations' },
  ];

  const features = [
    { icon: Zap, title: 'AI-Powered Allocation', desc: 'WHO-standard algorithms prioritize resource distribution automatically.' },
    { icon: Globe, title: 'Real-Time Visibility', desc: 'Track every camp, vehicle, and supply unit on a single dashboard.' },
    { icon: BarChart3, title: 'Predictive Alerts', desc: 'Get 72-hour shortage forecasts before situations become critical.' },
    { icon: Shield, title: 'Verified Access', desc: 'Multi-level admin and NGO approval for all operational roles.' },
  ];

  const topCamps = seedCamps.slice(0, 4).map(camp => {
    const score = calculatePriorityScore(camp, seedResources);
    const st = getStatus(score);
    const food = seedResources.find(r => r.camp_id === camp.id && r.resource_type === 'food');
    return { ...camp, st, foodDays: food ? getDaysRemaining(food) : 0 };
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* NAV */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>ReliefChain</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-3)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => navigate('/signin')} className="text-sm font-medium px-3 py-1.5 rounded-lg hidden sm:block" style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Sign In</button>
            <button onClick={() => navigate('/signup')} className="btn-red !py-2 !px-4 !text-[13px] !rounded-lg">Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="container-app relative pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className={`max-w-2xl transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full anim-pulse-red" style={{ background: 'var(--danger)' }} />
              <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--danger)' }}>Live Emergency Active</span>
            </div>

            <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-black leading-[1.05] tracking-[-0.03em]" style={{ color: 'var(--text-1)' }}>
              Disaster Relief,<br />
              <span className="gradient-text">Intelligently Coordinated.</span>
            </h1>

            <p className="mt-6 text-[16px] sm:text-[18px] leading-relaxed max-w-lg" style={{ color: 'var(--text-3)' }}>
              Track supplies, coordinate shelters, and allocate resources across Kerala's flood relief operations — powered by AI.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/signup')} className="btn-red !py-3 !px-6 group">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => navigate('/signin')} className="btn-dark !py-3 !px-6">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-app pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={s.label} className="dark-card p-5 anim-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="icon-box !w-10 !h-10 !rounded-lg" style={{ background: 'var(--accent-soft)' }}>
                  <s.icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-[28px] font-black tracking-tight leading-none" style={{ color: 'var(--text-1)' }}>{s.value}</div>
              <div className="text-[12px] font-medium mt-1" style={{ color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ALERT */}
      <section className="container-app pb-12">
        <div className="dark-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 anim-up" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--danger-soft)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)' }} />
            </div>
            <div>
              <div className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>Severe Flood Warning — Kerala</div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-3)' }}>Heavy rainfall expected. {criticalCount} camp(s) critically low on supplies.</div>
            </div>
          </div>
          <button className="btn-red !py-2 !px-4 !text-[12px] !rounded-lg whitespace-nowrap">
            View Details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="container-app pb-16">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--text-4)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {actions.map((a, i) => (
            <button key={a.label} className="dark-card p-4 text-left group anim-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="icon-box !w-10 !h-10 !rounded-lg mb-3" style={{ background: 'var(--accent-soft)' }}>
                <a.icon className="w-[18px] h-[18px]" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{a.label}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* CAMPS */}
      <section className="container-app pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold" style={{ color: 'var(--text-1)' }}>Active Relief Camps</h2>
          <button className="text-[12px] font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topCamps.map((camp, i) => {
            const statusColors = { critical: 'var(--danger)', warning: 'var(--amber)', stable: 'var(--green)', watch: 'var(--amber)' };
            const statusBg = { critical: 'var(--danger-soft)', warning: 'var(--amber-soft)', stable: 'var(--green-soft)', watch: 'var(--amber-soft)' };
            return (
              <div key={camp.id} className="dark-card p-5 anim-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[14px] font-semibold" style={{ color: 'var(--text-1)' }}>{camp.name}</div>
                    <div className="text-[11px] flex items-center gap-1 mt-1" style={{ color: 'var(--text-4)' }}>
                      <MapPin className="w-3 h-3" /> {camp.village}
                    </div>
                  </div>
                  <span className="badge" style={{ background: statusBg[camp.st.status], color: statusColors[camp.st.status] }}>{camp.st.label}</span>
                </div>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-[11px]" style={{ color: 'var(--text-4)' }}>Population</div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{camp.current_population}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px]" style={{ color: 'var(--text-4)' }}>Food Left</div>
                    <div className="text-[15px] font-bold" style={{ color: camp.foodDays < 1 ? 'var(--danger)' : camp.foodDays < 2 ? 'var(--amber)' : 'var(--green)' }}>{camp.foodDays}d</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-20">
          <div className="text-center mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight" style={{ color: 'var(--text-1)' }}>Built for Real Emergencies</h2>
            <p className="mt-3 text-[15px] max-w-md mx-auto" style={{ color: 'var(--text-3)' }}>Production-grade coordination, not a hackathon toy.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {features.map((f, i) => (
              <div key={f.title} className="dark-card p-6 anim-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="icon-box !w-11 !h-11 !rounded-lg mb-4" style={{ background: 'var(--accent-soft)' }}>
                  <f.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-[14px] font-bold mb-1.5" style={{ color: 'var(--text-1)' }}>{f.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <ShieldAlert className="w-3 h-3 text-white" />
            </div>
            <span className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>ReliefChain © 2026</span>
          </div>
          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>Built with care by Code Breakers · Kerala Flood Relief</span>
        </div>
      </footer>
    </div>
  );
}
