import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, MapPin, Users, Heart, AlertTriangle, ChevronRight, Activity, Sun, Moon, Shield, Globe, Zap, BarChart3, Phone, ExternalLink, Truck, CheckCircle2 } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';
import { useTheme } from '../../lib/ThemeContext';

export default function LandingPage() {
  const nav = useNavigate();
  const { isDark, toggle } = useTheme();
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);

  const totalPop = seedCamps.reduce((s, c) => s + c.current_population, 0);
  const critical = seedCamps.filter(c => getStatus(calculatePriorityScore(c, seedResources)).status === 'critical').length;
  const sc = s => ({ critical: 'var(--danger)', warning: 'var(--amber)', stable: 'var(--green)', watch: 'var(--amber)' }[s] || 'var(--text-3)');
  const sb = s => ({ critical: 'var(--danger-soft)', warning: 'var(--amber-soft)', stable: 'var(--green-soft)', watch: 'var(--amber-soft)' }[s] || 'var(--bg-2)');

  const camps = seedCamps.slice(0, 4).map(c => {
    const score = calculatePriorityScore(c, seedResources);
    const st = getStatus(score);
    const food = seedResources.find(r => r.camp_id === c.id && r.resource_type === 'food');
    return { ...c, st, fd: food ? getDaysRemaining(food) : 0 };
  });

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* NAV */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-[56px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>ReliefChain</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg" style={{ color: 'var(--text-3)' }}>{isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
            <button onClick={() => nav('/signin')} className="text-[13px] font-medium px-4 py-2 rounded-lg hidden sm:block" style={{ color: 'var(--text-2)' }}>Sign In</button>
            <button onClick={() => nav('/signup')} className="btn-red !py-2 !px-5 !text-[13px]">Get Started</button>
          </div>
        </div>
      </nav>

      {/* ═══ SECTION 1: HERO — Full viewport ═══ */}
      <section className="relative overflow-hidden min-h-[calc(100vh-56px)] flex items-center">
        <div className="absolute inset-0 grid-pattern" />
        <div className="container-app relative py-20">
          <div className={`max-w-2xl transition-all duration-700 ${m ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{ background: 'var(--danger-soft)', border: '1px solid rgba(244,63,94,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full anim-pulse-red" style={{ background: 'var(--danger)' }} />
              <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--danger)' }}>Live Emergency Active</span>
            </div>

            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-black tracking-[-0.03em] leading-[1.06]" style={{ color: 'var(--text-1)' }}>
              Disaster Relief,<br />
              <span className="gradient-text">Intelligently Coordinated.</span>
            </h1>

            <p className="text-[16px] sm:text-[18px] leading-[1.75] max-w-lg mt-8" style={{ color: 'var(--text-3)' }}>
              Track supplies, coordinate shelters, and allocate resources across Kerala's flood relief operations — powered by AI intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-12">
              <button onClick={() => nav('/signup')} className="btn-red !py-3.5 !px-8 !text-[15px] group">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => nav('/signin')} className="btn-dark !py-3.5 !px-8 !text-[15px]">
                Sign In
              </button>
            </div>

            <div className="flex items-center gap-6 mt-12" style={{ color: 'var(--text-4)' }}>
              <div className="flex items-center gap-2 text-[12px]"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> AI-Powered</div>
              <div className="flex items-center gap-2 text-[12px]"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Real-Time</div>
              <div className="flex items-center gap-2 text-[12px]"><CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: STATS ═══ */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-10" style={{ color: 'var(--text-4)' }}>Current Situation</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { v: seedCamps.length, l: 'Active Camps', icon: MapPin, c: 'var(--blue)' },
              { v: totalPop.toLocaleString(), l: 'People Affected', icon: Users, c: 'var(--violet)' },
              { v: critical, l: 'Critical Alerts', icon: AlertTriangle, c: 'var(--danger)' },
              { v: '₹21K', l: 'Donations Raised', icon: Heart, c: 'var(--green)' },
            ].map((s, i) => (
              <div key={s.l} className="dark-card p-7 anim-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="icon-box !w-12 !h-12 !rounded-xl mb-5" style={{ background: 'var(--accent-soft)' }}>
                  <s.icon className="w-5 h-5" style={{ color: s.c }} />
                </div>
                <div className="text-[36px] font-black tracking-tight leading-none" style={{ color: 'var(--text-1)' }}>{s.v}</div>
                <div className="text-[13px] font-medium mt-2" style={{ color: 'var(--text-3)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: ALERT ═══ */}
      <section>
        <div className="container-app pb-24">
          <div className="dark-card p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5" style={{ borderColor: 'rgba(244,63,94,0.15)' }}>
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--danger-soft)' }}>
                <AlertTriangle className="w-6 h-6" style={{ color: 'var(--danger)' }} />
              </div>
              <div>
                <div className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>Severe Flood Warning — Kerala</div>
                <div className="text-[13px] mt-1" style={{ color: 'var(--text-3)' }}>Heavy rainfall expected. {critical} camp(s) critically low on supplies. Avoid low-lying areas.</div>
              </div>
            </div>
            <button className="btn-red !py-2.5 !px-6 !text-[13px] whitespace-nowrap">View Details <ExternalLink className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: QUICK ACTIONS ═══ */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-24">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-4)' }}>Quick Actions</p>
          <h2 className="text-[24px] sm:text-[28px] font-bold mb-10" style={{ color: 'var(--text-1)' }}>What do you need?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { l: 'Emergency SOS', icon: Phone, d: 'Send distress signal' },
              { l: 'Report Incident', icon: AlertTriangle, d: 'Log a new event' },
              { l: 'Find Shelter', icon: Shield, d: 'Locate nearest camp' },
              { l: 'Live Tracking', icon: Activity, d: 'Real-time updates' },
              { l: 'Donate Now', icon: Heart, d: 'Contribute supplies' },
              { l: 'Track Relief', icon: Truck, d: 'Follow deliveries' },
            ].map((a, i) => (
              <button key={a.l} className="dark-card p-6 text-left group anim-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="icon-box !w-12 !h-12 !rounded-xl mb-5 group-hover:scale-110 transition-transform" style={{ background: 'var(--accent-soft)' }}>
                  <a.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="text-[14px] font-semibold" style={{ color: 'var(--text-1)' }}>{a.l}</div>
                <div className="text-[12px] mt-1.5" style={{ color: 'var(--text-4)' }}>{a.d}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: CAMPS ═══ */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-4)' }}>Operations</p>
              <h2 className="text-[24px] sm:text-[28px] font-bold" style={{ color: 'var(--text-1)' }}>Active Relief Camps</h2>
            </div>
            <button className="text-[13px] font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--accent)' }}>View All <ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {camps.map((c, i) => (
              <div key={c.id} className="dark-card p-6 anim-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[15px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</div>
                    <div className="text-[12px] flex items-center gap-1.5 mt-2" style={{ color: 'var(--text-4)' }}><MapPin className="w-3.5 h-3.5" /> {c.village}</div>
                  </div>
                  <span className="badge" style={{ background: sb(c.st.status), color: sc(c.st.status) }}>{c.st.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-[11px] font-medium mb-1" style={{ color: 'var(--text-4)' }}>Population</div>
                    <div className="text-[22px] font-black" style={{ color: 'var(--text-1)' }}>{c.current_population}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-medium mb-1" style={{ color: 'var(--text-4)' }}>Food Left</div>
                    <div className="text-[22px] font-black" style={{ color: sc(c.fd < 1 ? 'critical' : c.fd < 2 ? 'warning' : 'stable') }}>{c.fd}d</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: FEATURES ═══ */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-28">
          <div className="text-center mb-16">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-4)' }}>Why ReliefChain</p>
            <h2 className="text-[30px] sm:text-[40px] font-black tracking-tight" style={{ color: 'var(--text-1)' }}>Built for Real Emergencies</h2>
            <p className="text-[15px] max-w-lg mx-auto mt-4" style={{ color: 'var(--text-3)' }}>Production-grade disaster coordination — not a prototype.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, t: 'AI-Powered Allocation', d: 'WHO-standard algorithms prioritize resource distribution automatically across all active camps.' },
              { icon: Globe, t: 'Real-Time Visibility', d: 'Track every camp, vehicle, and supply unit live on a single unified command dashboard.' },
              { icon: BarChart3, t: 'Predictive Alerts', d: 'Get 72-hour shortage forecasts before situations escalate into full emergencies.' },
              { icon: Shield, t: 'Verified Access', d: 'Multi-level admin + NGO approval ensures only vetted personnel can operate.' },
            ].map((f, i) => (
              <div key={f.t} className="dark-card p-8 anim-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="icon-box !w-14 !h-14 !rounded-2xl mb-6" style={{ background: 'var(--accent-soft)' }}>
                  <f.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-[16px] font-bold mb-3" style={{ color: 'var(--text-1)' }}>{f.t}</h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: 'var(--text-3)' }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: CTA ═══ */}
      <section style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-28 text-center">
          <h2 className="text-[28px] sm:text-[36px] font-black tracking-tight" style={{ color: 'var(--text-1)' }}>Ready to make a difference?</h2>
          <p className="text-[15px] max-w-md mx-auto mt-4 mb-10" style={{ color: 'var(--text-3)' }}>Join the platform. Donate, volunteer, coordinate — every action saves lives.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => nav('/signup')} className="btn-red !py-3.5 !px-8 !text-[15px] group">Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
            <button onClick={() => nav('/signin')} className="btn-dark !py-3.5 !px-8 !text-[15px]">Sign In</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container-app py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}><ShieldAlert className="w-3 h-3 text-white" /></div>
            <span className="text-[12px] font-semibold" style={{ color: 'var(--text-3)' }}>ReliefChain © 2026</span>
          </div>
          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>Built with care by Code Breakers · Kerala Flood Relief</span>
        </div>
      </footer>
    </div>
  );
}
