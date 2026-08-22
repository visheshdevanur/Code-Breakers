import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Users, Heart, ArrowRight, Eye, Globe, Truck, Zap, Shield, Activity, BarChart3, AlertTriangle, Phone, Map, Bell, Home, Package, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { seedCamps, seedResources, seedDonations, seedItemDonations } from '../../lib/seedData';
import { calculatePriorityScore } from '../../lib/aiEngine';
import DisasterMap from '../Map/DisasterMap';

function Counter({ end, dur = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0; const s = Math.max(1, Math.ceil(end / (dur / 16)));
    const t = setInterval(() => { v += s; if (v >= end) { setN(end); clearInterval(t); } else setN(v); }, 16);
    return () => clearInterval(t);
  }, [end]);
  return <>{n.toLocaleString()}</>;
}

export default function LandingPage() {
  const totalPop = seedCamps.reduce((s, c) => s + c.current_population, 0);
  const criticals = seedCamps.filter(c => calculatePriorityScore(c, seedResources) > 18).length;
  const totalDonations = seedDonations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>

      {/* ══ NAV ══ */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container-app flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-none">ReliefChain</span>
              <span className="text-[9px] text-neutral-500 hidden sm:block">Disaster Coordination Intelligence</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/signin" className="hidden sm:block text-neutral-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors">Sign In</Link>
            <Link to="/signup" className="btn-red !py-2.5 !px-5 !text-sm !rounded-xl">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/[0.04] rounded-full blur-[120px]" />
        </div>
        <div className="container-app relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2 mb-8 anim-up">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-red-500 opacity-75" /><span className="relative h-2 w-2 rounded-full bg-red-500" /></span>
              <span className="text-red-400 text-xs font-semibold tracking-wide">LIVE EMERGENCY ACTIVE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-6 anim-up d1">
              <span className="text-white">Be Prepared.</span><br />
              <span className="text-white">Stay Aware.</span><br />
              <span className="gradient-text">Stay Safe.</span>
            </h1>
            <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed anim-up d2">
              Coordinating disaster relief across Kerala. Track supplies, find shelters, donate resources — all powered by AI intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start anim-up d3">
              <Link to="/signup" className="btn-red !py-4 !px-8 !text-base !rounded-2xl">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/signin" className="btn-dark !py-4 !px-8 !text-base !rounded-2xl">
                Login / Sign In
              </Link>
            </div>
            <p className="text-neutral-600 text-sm mt-4 anim-up d4">Together, we can save lives.</p>
          </div>
        </div>
      </section>

      {/* ══ QUICK ACTIONS GRID ══ */}
      <section className="py-12 sm:py-16">
        <div className="container-app">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-6 anim-up">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {[
              { icon: <AlertTriangle className="w-6 h-6 text-white" />, label: 'Emergency\nSOS', bg: 'bg-red-600', href: '/signup' },
              { icon: <Bell className="w-6 h-6 text-white" />, label: 'Report\nIncident', bg: 'bg-orange-600', href: '/signup' },
              { icon: <Home className="w-6 h-6 text-white" />, label: 'Find\nShelter', bg: 'bg-green-600', href: '#live-map' },
              { icon: <Activity className="w-6 h-6 text-white" />, label: 'Live\nUpdates', bg: 'bg-blue-600', href: '#stats' },
              { icon: <Map className="w-6 h-6 text-white" />, label: 'Disaster\nMap', bg: 'bg-purple-600', href: '#live-map' },
              { icon: <Phone className="w-6 h-6 text-white" />, label: 'Emergency\nContacts', bg: 'bg-teal-600', href: '/signup' },
            ].map((a, i) => (
              <a key={i} href={a.href || '#'} className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-white/[0.03] transition-colors anim-up group" style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`icon-box !w-14 !h-14 !rounded-2xl ${a.bg} shadow-lg group-hover:scale-110 transition-transform`}>{a.icon}</div>
                <span className="text-[11px] sm:text-xs text-neutral-400 text-center font-medium leading-tight whitespace-pre-line">{a.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ALERT BANNER ══ */}
      <section className="px-4 sm:px-0 mb-8">
        <div className="container-app">
          <div className="bg-gradient-to-r from-red-600/20 via-red-600/10 to-transparent border border-red-600/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 anim-up">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0 anim-pulse-red">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="min-w-0">
              <div className="text-red-400 font-bold text-sm">Severe Flood Warning</div>
              <p className="text-neutral-400 text-xs mt-0.5 truncate">Heavy rainfall expected. {criticals} camp(s) in critical state. Avoid low-lying areas.</p>
            </div>
            <Link to="/signup" className="badge bg-red-600/20 text-red-400 border border-red-600/30 flex-shrink-0 hidden sm:block">View Details</Link>
          </div>
        </div>
      </section>

      {/* ══ LIVE STATS ══ */}
      <section id="stats" className="py-8 sm:py-12">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <MapPin className="w-5 h-5 text-blue-400" />, val: seedCamps.length, label: 'Active Camps', iconBg: 'bg-blue-500/10' },
              { icon: <Users className="w-5 h-5 text-red-400" />, val: totalPop, label: 'People Affected', iconBg: 'bg-red-500/10' },
              { icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, val: criticals, label: 'Critical Camps', iconBg: 'bg-amber-500/10' },
              { icon: <Heart className="w-5 h-5 text-emerald-400" />, val: Math.round(totalDonations / 1000), label: 'Donations (₹K)', iconBg: 'bg-emerald-500/10' },
            ].map((s, i) => (
              <div key={i} className="dark-card p-5 anim-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`icon-box !w-10 !h-10 !rounded-xl ${s.iconBg} mb-3`}>{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white"><Counter end={s.val} /></div>
                <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ACTIVE CAMPS (Shelter Cards like reference) ══ */}
      <section className="py-12 sm:py-16">
        <div className="container-app">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">Active Relief Camps</h2>
            <a href="#live-map" className="text-xs text-red-400 font-semibold hover:text-red-300 transition-colors">View All →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seedCamps.slice(0, 6).map((camp, i) => {
              const score = calculatePriorityScore(camp, seedResources);
              const isCrit = score > 18;
              const isWarn = score > 12;
              const res = seedResources.filter(r => r.camp_id === camp.id);
              return (
                <div key={camp.id} className="dark-card p-5 anim-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`icon-box !w-10 !h-10 !rounded-xl ${isCrit ? 'bg-red-500/10' : isWarn ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                        <Home className={`w-5 h-5 ${isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{camp.name.replace(' Relief Camp', '')}</div>
                        <div className="text-[11px] text-neutral-500">{camp.village} · {camp.current_population} people</div>
                      </div>
                    </div>
                    <span className={`badge ${isCrit ? 'bg-red-500/15 text-red-400 border border-red-500/25' : isWarn ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'}`}>
                      {isCrit ? 'Critical' : isWarn ? 'Warning' : 'Stable'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                    {res.map(r => {
                      const icons = { food: '🍚', water: '💧', medicine: '💊', shelter: '🏠' };
                      return (
                        <div key={r.resource_type} className="flex items-center gap-1 bg-white/[0.03] rounded-lg px-2 py-1">
                          <span className="text-xs">{icons[r.resource_type]}</span>
                          <span className="text-[10px] text-neutral-400 font-medium">{Math.round(r.quantity)}</span>
                        </div>
                      );
                    })}
                    <Link to="/signup" className="ml-auto w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
                      <Navigation className="w-3.5 h-3.5 text-blue-400" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ HOW YOU CAN HELP ══ */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How You Can Help</h2>
            <p className="text-neutral-500 max-w-md mx-auto text-sm">Join the relief effort. Every role saves lives.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="dark-card p-7 anim-up">
              <div className="icon-box !w-14 !h-14 !rounded-2xl bg-emerald-500/10 mb-5"><Heart className="w-7 h-7 text-emerald-400" /></div>
              <div className="text-[10px] font-bold text-emerald-400 tracking-[0.15em] mb-1">CITIZEN / DONOR</div>
              <h3 className="text-lg font-bold text-white mb-2">Donate</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Give money or items — clothes, food, blankets, medicine. Track every rupee to delivery.</p>
            </div>
            <div className="dark-card p-7 anim-up d1">
              <div className="icon-box !w-14 !h-14 !rounded-2xl bg-violet-500/10 mb-5"><Globe className="w-7 h-7 text-violet-400" /></div>
              <div className="text-[10px] font-bold text-violet-400 tracking-[0.15em] mb-1">NGO / GOVERNMENT</div>
              <h3 className="text-lg font-bold text-white mb-2">Coordinate</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Dispatch supplies, see real-time needs, and avoid sending duplicate resources.</p>
            </div>
            <div className="dark-card p-7 anim-up d2">
              <div className="icon-box !w-14 !h-14 !rounded-2xl bg-amber-500/10 mb-5"><Truck className="w-7 h-7 text-amber-400" /></div>
              <div className="text-[10px] font-bold text-amber-400 tracking-[0.15em] mb-1">VOLUNTEER DRIVER</div>
              <h3 className="text-lg font-bold text-white mb-2">Transport</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Register your vehicle and deliver supplies. AI assigns the most efficient routes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AI FEATURES ══ */}
      <section className="py-16 sm:py-20 border-y border-white/[0.04]">
        <div className="container-app">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400 text-xs font-semibold">AI-POWERED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Intelligent Relief Coordination</h2>
            <p className="text-neutral-500 max-w-md mx-auto text-sm">6 coordination failures that cost lives. All solved.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: <Eye className="w-5 h-5 text-blue-400" />, bg: 'bg-blue-500/10', t: 'Live Visibility', d: 'Real-time map of which camps have what resources.' },
              { icon: <Zap className="w-5 h-5 text-red-400" />, bg: 'bg-red-500/10', t: 'AI Redistribution', d: 'Auto-generates transfers from surplus to critical.' },
              { icon: <Shield className="w-5 h-5 text-amber-400" />, bg: 'bg-amber-500/10', t: 'Duplication Detection', d: 'Catches when 2 NGOs send to the same camp.' },
              { icon: <Activity className="w-5 h-5 text-orange-400" />, bg: 'bg-orange-500/10', t: 'Forgotten Zones', d: 'Detects camps that received ZERO supplies.' },
              { icon: <Truck className="w-5 h-5 text-violet-400" />, bg: 'bg-violet-500/10', t: 'Transport Tracking', d: 'Assigns vehicles, tracks routes, confirms delivery.' },
              { icon: <BarChart3 className="w-5 h-5 text-emerald-400" />, bg: 'bg-emerald-500/10', t: 'Full Transparency', d: 'Every rupee tracked from source to delivery.' },
            ].map((f, i) => (
              <div key={i} className="dark-card p-5 flex gap-4 items-start anim-up" style={{ animationDelay: `${i * 70}ms` }}>
                <div className={`icon-box !w-10 !h-10 !rounded-xl ${f.bg} flex-shrink-0`}>{f.icon}</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{f.t}</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIVE MAP ══ */}
      <section id="live-map" className="py-16 sm:py-24">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Disaster Map</h2>
            <p className="text-neutral-500 text-sm">Click any marker for real-time camp details.</p>
          </div>
          <div className="h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/40">
            <DisasterMap />
          </div>
        </div>
      </section>

      {/* ══ RECENT DONATIONS ══ */}
      <section className="py-12 sm:py-16 border-t border-white/[0.04]">
        <div className="container-app max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Contributions</h2>
            <Link to="/signup" className="text-xs text-red-400 font-semibold">Donate Now →</Link>
          </div>
          <div className="space-y-2">
            {[...seedDonations.map(d => ({ n: d.donor_name, t: `₹${d.amount.toLocaleString()} · ${d.resource_type}`, c: d.allocated_camp, m: true })),
              ...seedItemDonations.slice(0, 3).map(d => ({ n: d.donor_name, t: `${d.quantity} ${d.item_category}`, c: d.allocated_camp, m: false }))
            ].map((d, i) => (
              <div key={i} className="dark-card !rounded-xl px-4 py-3 flex items-center gap-3 anim-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`icon-box !w-9 !h-9 !rounded-lg ${d.m ? 'bg-emerald-500/10' : 'bg-violet-500/10'}`}>
                  {d.m ? <Heart className="w-4 h-4 text-emerald-400" /> : <Package className="w-4 h-4 text-violet-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-white text-sm">{d.n}</span>
                  <span className="text-neutral-500 text-sm ml-2">{d.t}</span>
                </div>
                <span className="text-[10px] text-neutral-600 hidden sm:block">→ {d.c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM FEATURES BAR (like reference) ══ */}
      <section className="py-10 border-t border-white/[0.04]">
        <div className="container-app">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: <Bell className="w-5 h-5 text-red-400" />, t: 'Real-time Alerts', d: 'Stay informed about emergencies' },
              { icon: <AlertTriangle className="w-5 h-5 text-orange-400" />, t: 'Quick SOS', d: 'Send SOS and get help instantly' },
              { icon: <Map className="w-5 h-5 text-blue-400" />, t: 'Live Map', d: 'Track disasters in real-time' },
              { icon: <Home className="w-5 h-5 text-green-400" />, t: 'Find Shelters', d: 'Locate safe shelters nearby' },
              { icon: <Globe className="w-5 h-5 text-violet-400" />, t: 'Stay Connected', d: 'Access contacts and resources' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 anim-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="icon-box !w-11 !h-11 !rounded-xl bg-white/[0.04]">{f.icon}</div>
                <div className="text-xs font-semibold text-white">{f.t}</div>
                <div className="text-[10px] text-neutral-600 leading-snug">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-16">
        <div className="container-app">
          <div className="dark-card !rounded-3xl p-8 sm:p-14 text-center bg-gradient-to-br from-red-600/[0.06] to-transparent !border-red-600/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Save Lives?</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto text-sm">Whether you donate ₹100 or drive a truck — every action matters.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="btn-red !py-3.5 !px-8 !rounded-2xl">Get Started <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/signin" className="btn-dark !py-3.5 !px-8 !rounded-2xl">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-8 border-t border-white/[0.04]">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center"><ShieldAlert className="w-3.5 h-3.5 text-white" /></div>
            <span className="font-bold text-white text-sm">ReliefChain</span>
          </div>
          <p className="text-[11px] text-neutral-700 text-center">Together, we can save lives. · Built for Hackathon 2026</p>
          <div className="flex gap-4">
            <Link to="/signin" className="text-xs text-neutral-600 hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="text-xs text-neutral-600 hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
