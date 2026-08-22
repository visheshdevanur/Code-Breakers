import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, MapPin, Users, Package, Heart, Phone, Radio, AlertTriangle, ChevronRight, Activity, Truck, Sun, Moon, Shield, Globe, Zap, BarChart3, Clock } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';
import { useTheme } from '../../lib/ThemeContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalPop = seedCamps.reduce((s, c) => s + c.current_population, 0);
  const criticalCount = seedCamps.filter(c => { const s = calculatePriorityScore(c, seedResources); return getStatus(s).status === 'critical'; }).length;

  const stats = [
    { value: seedCamps.length, label: 'Active Camps', icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { value: totalPop.toLocaleString(), label: 'People Affected', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { value: criticalCount, label: 'Critical Zones', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { value: '₹21K', label: 'Donations', icon: Heart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const quickActions = [
    { label: 'Emergency SOS', icon: Phone, gradient: 'from-red-600 to-red-700', shadow: 'shadow-red-600/20' },
    { label: 'Report Incident', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { label: 'Find Shelter', icon: Shield, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
    { label: 'Live Updates', icon: Activity, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
    { label: 'Donate Now', icon: Heart, gradient: 'from-pink-500 to-rose-600', shadow: 'shadow-pink-500/20' },
    { label: 'Track Relief', icon: Truck, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
  ];

  const features = [
    { icon: Zap, title: 'AI-Powered Routing', desc: 'Intelligent resource allocation using WHO standards and real-time data.' },
    { icon: Globe, title: 'Real-Time Tracking', desc: 'Live camp monitoring, vehicle tracking, and supply chain visibility.' },
    { icon: BarChart3, title: 'Predictive Analytics', desc: 'Forecast shortages 72 hours before they become critical.' },
    { icon: Shield, title: 'Verified Access', desc: 'Multi-level approval ensures only trusted personnel operate.' },
  ];

  const topCamps = seedCamps.slice(0, 4).map(camp => {
    const score = calculatePriorityScore(camp, seedResources);
    const st = getStatus(score);
    const food = seedResources.find(r => r.camp_id === camp.id && r.resource_type === 'food');
    return { ...camp, st, foodDays: food ? getDaysRemaining(food) : 0 };
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ═══ NAV ═══ */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container-app flex items-center justify-between py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight" style={{ color: 'var(--text-1)' }}>ReliefChain</span>
              <span className="text-[9px] block -mt-0.5 font-medium tracking-wider uppercase" style={{ color: 'var(--text-4)' }}>Disaster Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggle} className="p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all" style={{ color: 'var(--text-3)' }} aria-label="Toggle theme">
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <button onClick={() => navigate('/signin')} className="text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[var(--bg-hover)] transition-all hidden sm:block" style={{ color: 'var(--text-2)' }}>Sign In</button>
            <button onClick={() => navigate('/signup')} className="btn-red !py-2 !px-5 !text-[13px] !rounded-xl">Join Now</button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-red-600/[0.03] blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/[0.03] blur-[120px] translate-x-1/3 translate-y-1/3" />
        
        <div className="container-app relative pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 anim-pulse-red" style={{ background: 'var(--accent-soft)', borderColor: 'rgba(220,38,38,0.2)' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase" style={{ color: 'var(--accent)' }}>Live Emergency Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight max-w-2xl" style={{ color: 'var(--text-1)' }}>
              Be Prepared.<br />Stay Aware.<br />
              <span className="gradient-text">Stay Safe.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg max-w-lg leading-relaxed" style={{ color: 'var(--text-3)' }}>
              Coordinating disaster relief across Kerala. Track supplies, find shelters, donate resources — all powered by AI intelligence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/signup')} className="btn-red !py-3.5 !px-7 !text-sm group">
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/signin')} className="btn-dark !py-3.5 !px-7 !text-sm">
                Login / Sign In
              </button>
            </div>
            <p className="mt-3 text-xs" style={{ color: 'var(--text-4)' }}>Together, we can save lives.</p>
          </div>
        </div>
      </section>

      {/* ═══ QUICK ACTIONS ═══ */}
      <section className="container-app pb-12 -mt-2">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--text-4)' }}>Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((a, i) => (
            <button key={a.label} className="group flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border)] transition-all anim-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.gradient} flex items-center justify-center shadow-lg ${a.shadow} group-hover:scale-110 transition-transform`}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[11px] font-semibold leading-tight text-center" style={{ color: 'var(--text-2)' }}>{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ ALERT BANNER ═══ */}
      <section className="container-app pb-8">
        <div className="rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 anim-up" style={{ background: 'var(--accent-soft)', border: '1px solid rgba(220,38,38,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0 anim-pulse-red">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>Severe Flood Warning</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Heavy rainfall expected. {criticalCount} camp(s) in critical state. Avoid low-lying areas.</div>
            </div>
          </div>
          <button className="text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap" style={{ background: 'var(--accent)', color: '#fff' }}>View Details</button>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="container-app pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div key={s.label} className="dark-card p-5 flex items-center gap-4 anim-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`icon-box ${s.bg} ${s.color} !w-11 !h-11 !rounded-xl`}><s.icon className="w-5 h-5" /></div>
              <div>
                <div className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-1)' }}>{s.value}</div>
                <div className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ACTIVE CAMPS ═══ */}
      <section className="container-app pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-1)' }}>Active Relief Camps</h2>
          <button className="text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--accent)' }}>
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topCamps.map((camp, i) => (
            <div key={camp.id} className="dark-card p-5 anim-up group" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${camp.st.status === 'critical' ? 'bg-red-500 animate-pulse' : camp.st.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{camp.name}</div>
                    <div className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-4)' }}>
                      <MapPin className="w-3 h-3" /> {camp.village} · {camp.current_population} people
                    </div>
                  </div>
                </div>
                <span className={`badge border text-[10px] ${camp.st.status === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : camp.st.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                  {camp.st.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px] font-medium" style={{ color: 'var(--text-4)' }}>Food</div>
                  <div className={`text-sm font-bold ${camp.foodDays < 1 ? 'text-red-500' : camp.foodDays < 2 ? 'text-amber-500' : 'text-emerald-500'}`}>{camp.foodDays}d</div>
                </div>
                <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-2)' }}>
                  <div className="text-[10px] font-medium" style={{ color: 'var(--text-4)' }}>Priority</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>{camp.st.score || '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="container-app py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: 'var(--text-1)' }}>Built for Real Emergencies</h2>
            <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: 'var(--text-3)' }}>Not a prototype. A production-grade disaster response coordination platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={f.title} className="dark-card p-6 text-center group anim-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="icon-box bg-red-500/10 !w-14 !h-14 !rounded-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-1)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center">
              <ShieldAlert className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--text-3)' }}>ReliefChain © 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>
            <span>Made for Kerala Flood Relief</span>
            <span>·</span>
            <span>Built with ❤️ by Code Breakers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
