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
    { value: '₹21K', label: 'Donations Raised', icon: Heart, color: 'var(--green)' },
  ];

  const actions = [
    { label: 'Emergency SOS', icon: Phone, desc: 'Send distress signal' },
    { label: 'Report Incident', icon: AlertTriangle, desc: 'Log a new event' },
    { label: 'Find Shelter', icon: Shield, desc: 'Locate nearest camp' },
    { label: 'Live Tracking', icon: Activity, desc: 'Real-time updates' },
    { label: 'Donate Now', icon: Heart, desc: 'Contribute supplies' },
    { label: 'Relief Map', icon: Globe, desc: 'View all operations' },
  ];

  const features = [
    { icon: Zap, title: 'AI-Powered Allocation', desc: 'WHO-standard algorithms prioritize resource distribution automatically across all camps.' },
    { icon: Globe, title: 'Real-Time Visibility', desc: 'Track every camp, vehicle, and supply unit on a single unified dashboard.' },
    { icon: BarChart3, title: 'Predictive Alerts', desc: 'Get 72-hour shortage forecasts before situations become critical emergencies.' },
    { icon: Shield, title: 'Verified Access', desc: 'Multi-level admin and NGO approval ensures only trusted personnel operate.' },
  ];

  const topCamps = seedCamps.slice(0, 4).map(camp => {
    const score = calculatePriorityScore(camp, seedResources);
    const st = getStatus(score);
    const food = seedResources.find(r => r.camp_id === camp.id && r.resource_type === 'food');
    return { ...camp, st, foodDays: food ? getDaysRemaining(food) : 0 };
  });

  const statusColor = (s) => ({ critical: 'var(--danger)', warning: 'var(--amber)', stable: 'var(--green)', watch: 'var(--amber)' }[s] || 'var(--text-3)');
  const statusBg = (s) => ({ critical: 'var(--danger-soft)', warning: 'var(--amber-soft)', stable: 'var(--green-soft)', watch: 'var(--amber-soft)' }[s] || 'var(--bg-2)');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* ─── NAVBAR ─── */}
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
            <button onClick={() => navigate('/signin')} className="text-[13px] font-medium px-4 py-2 rounded-lg hidden sm:block" style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Sign In</button>
            <button onClick={() => navigate('/signup')} className="btn-red !py-2 !px-5 !text-[13px] !rounded-lg">Get Started</button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="container-app relative" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <div className={`max-w-2xl transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.12)', marginBottom: '28px' }}>
              <span className="w-1.5 h-1.5 rounded-full anim-pulse-red" style={{ background: 'var(--danger)' }} />
              <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--danger)' }}>Live Emergency Active</span>
            </div>

            <h1 className="text-[36px] sm:text-[48px] lg:text-[60px] font-black tracking-[-0.03em]" style={{ color: 'var(--text-1)', lineHeight: 1.08 }}>
              Disaster Relief,<br />
              <span className="gradient-text">Intelligently Coordinated.</span>
            </h1>

            <p className="text-[15px] sm:text-[17px] leading-[1.7] max-w-lg" style={{ color: 'var(--text-3)', marginTop: '24px' }}>
              Track supplies, coordinate shelters, and allocate resources across Kerala's flood relief operations — powered by AI.
            </p>

            <div className="flex flex-wrap items-center gap-4" style={{ marginTop: '40px' }}>
              <button onClick={() => navigate('/signup')} className="btn-red !py-3 !px-7 group">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => navigate('/signin')} className="btn-dark !py-3 !px-7">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="container-app" style={{ paddingBottom: '48px' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, i) => (
            <div key={s.label} className="dark-card anim-up" style={{ padding: '24px', animationDelay: `${i * 60}ms` }}>
              <div className="icon-box !w-10 !h-10 !rounded-lg" style={{ background: 'var(--accent-soft)', marginBottom: '16px' }}>
                <s.icon className="w-[18px] h-[18px]" style={{ color: s.color }} />
              </div>
              <div className="text-[30px] sm:text-[34px] font-black tracking-tight leading-none" style={{ color: 'var(--text-1)' }}>{s.value}</div>
              <div className="text-[12px] font-medium" style={{ color: 'var(--text-3)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ALERT BANNER ─── */}
      <section className="container-app" style={{ paddingBottom: '48px' }}>
        <div className="dark-card flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ padding: '20px 24px', borderColor: 'rgba(239,68,68,0.12)' }}>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--danger-soft)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--danger)' }} />
            </div>
            <div>
              <div className="text-[14px] font-semibold" style={{ color: 'var(--text-1)' }}>Severe Flood Warning — Kerala</div>
              <div className="text-[12px]" style={{ color: 'var(--text-3)', marginTop: '2px' }}>Heavy rainfall expected. {criticalCount} camp(s) critically low on supplies.</div>
            </div>
          </div>
          <button className="btn-red !py-2.5 !px-5 !text-[12px] !rounded-lg whitespace-nowrap">
            View Details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* ─── QUICK ACTIONS ─── */}
      <section className="container-app" style={{ paddingBottom: '64px' }}>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-4)', marginBottom: '20px' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((a, i) => (
            <button key={a.label} className="dark-card text-left group anim-up" style={{ padding: '20px', animationDelay: `${i * 50}ms` }}>
              <div className="icon-box !w-11 !h-11 !rounded-lg" style={{ background: 'var(--accent-soft)', marginBottom: '14px' }}>
                <a.icon className="w-[18px] h-[18px]" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{a.label}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-4)', marginTop: '4px' }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── ACTIVE CAMPS ─── */}
      <section className="container-app" style={{ paddingBottom: '64px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
          <h2 className="text-[18px] font-bold" style={{ color: 'var(--text-1)' }}>Active Relief Camps</h2>
          <button className="text-[12px] font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {topCamps.map((camp, i) => (
            <div key={camp.id} className="dark-card anim-up" style={{ padding: '24px', animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: 'var(--text-1)' }}>{camp.name}</div>
                  <div className="text-[11px] flex items-center gap-1" style={{ color: 'var(--text-4)', marginTop: '6px' }}>
                    <MapPin className="w-3 h-3" /> {camp.village}
                  </div>
                </div>
                <span className="badge" style={{ background: statusBg(camp.st.status), color: statusColor(camp.st.status) }}>{camp.st.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4" style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <div className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>Population</div>
                  <div className="text-[18px] font-bold" style={{ color: 'var(--text-1)', marginTop: '2px' }}>{camp.current_population}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>Food Left</div>
                  <div className="text-[18px] font-bold" style={{ color: statusColor(camp.foodDays < 1 ? 'critical' : camp.foodDays < 2 ? 'warning' : 'stable'), marginTop: '2px' }}>{camp.foodDays}d</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight" style={{ color: 'var(--text-1)' }}>Built for Real Emergencies</h2>
            <p className="text-[14px] sm:text-[15px] max-w-md mx-auto" style={{ color: 'var(--text-3)', marginTop: '12px' }}>Production-grade disaster coordination, not a prototype.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={f.title} className="dark-card anim-up" style={{ padding: '28px', animationDelay: `${i * 60}ms` }}>
                <div className="icon-box !w-12 !h-12 !rounded-xl" style={{ background: 'var(--accent-soft)', marginBottom: '20px' }}>
                  <f.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-[15px] font-bold" style={{ color: 'var(--text-1)', marginBottom: '8px' }}>{f.title}</h3>
                <p className="text-[13px] leading-[1.65]" style={{ color: 'var(--text-3)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-3" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
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
