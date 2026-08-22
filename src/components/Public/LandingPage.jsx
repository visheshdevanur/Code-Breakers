import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Users, Heart, ArrowRight, Eye, Globe, Truck, Zap, Shield, Activity, BarChart3, ChevronDown, CheckCircle2 } from 'lucide-react';
import { seedCamps, seedResources, seedDonations, seedItemDonations } from '../../lib/seedData';
import { calculatePriorityScore } from '../../lib/aiEngine';
import DisasterMap from '../Map/DisasterMap';

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));
    const id = setInterval(() => { start += step; if (start >= value) { setDisplay(value); clearInterval(id); } else setDisplay(start); }, 16);
    return () => clearInterval(id);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

export default function LandingPage() {
  const totalPop = seedCamps.reduce((s, c) => s + c.current_population, 0);
  const criticals = seedCamps.filter(c => calculatePriorityScore(c, seedResources) > 18).length;
  const totalDonations = seedDonations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen bg-gray-950">

      {/* ═══ NAVBAR ═══ */}
      <nav className="glass sticky top-0 z-50">
        <div className="container-app flex items-center justify-between py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-shadow">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white block leading-none">ReliefChain</span>
              <span className="text-[9px] text-slate-500 leading-none hidden sm:block">Coordination Intelligence</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/signin" className="hidden sm:inline-flex text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-white/5">Sign In</Link>
            <Link to="/signup" className="btn-primary !py-2.5 !px-5 text-sm">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="container-app relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8 anim-fade">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative h-2 w-2 rounded-full bg-red-500" /></span>
              <span className="text-red-400 text-xs font-semibold tracking-wide">LIVE DISASTER RESPONSE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] mb-6 anim-slide">
              <span className="text-white">Don't Manage Supplies.</span><br />
              <span className="gradient-text">Manage Information.</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed anim-slide delay-1">
              During Kerala Floods, ₹3,000 crores poured in — yet people died.
              Not from lack of supplies, but because <span className="text-white font-medium">nobody knew where they were</span>.
              ReliefChain fixes the coordination crisis with AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 anim-slide delay-2">
              <Link to="/signup" className="btn-primary !py-4 !px-8 !text-base">
                Start Helping Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#live-map" className="btn-secondary !py-4 !px-8 !text-base">
                <Eye className="w-5 h-5" /> View Live Map
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-12 sm:py-16 border-y border-slate-800/60">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <MapPin className="w-5 h-5 text-blue-400" />, value: seedCamps.length, label: 'Active Relief Camps', bg: 'bg-blue-500/[0.08]', border: 'border-blue-500/20' },
              { icon: <Users className="w-5 h-5 text-red-400" />, value: totalPop, label: 'People Affected', bg: 'bg-red-500/[0.08]', border: 'border-red-500/20' },
              { icon: <Activity className="w-5 h-5 text-amber-400" />, value: criticals, label: 'Critical Camps', bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/20' },
              { icon: <Heart className="w-5 h-5 text-emerald-400" />, value: Math.round(totalDonations / 1000), label: 'Donations (₹K)', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/20' },
            ].map((s, i) => (
              <div key={s.label} className={`${s.bg} ${s.border} border rounded-2xl p-5 sm:p-6 anim-slide`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mb-3">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-white"><AnimatedNumber value={s.value} /></div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW YOU CAN HELP ═══ */}
      <section className="py-20 sm:py-28">
        <div className="container-app">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How You Can Help</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Join as a donor, NGO, or volunteer. Every role saves lives.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: <Heart className="w-7 h-7 text-emerald-400" />, title: 'Donate', desc: 'Give money or physical items — clothes, food, blankets, medicine. Track every rupee to delivery.', role: 'CITIZEN / DONOR', accent: 'border-emerald-500/20 hover:border-emerald-500/40', roleColor: 'text-emerald-400' },
              { icon: <Globe className="w-7 h-7 text-violet-400" />, title: 'Coordinate Relief', desc: 'NGOs and government agencies dispatch supplies, see needs, and avoid sending duplicates.', role: 'NGO / GOVERNMENT', accent: 'border-violet-500/20 hover:border-violet-500/40', roleColor: 'text-violet-400' },
              { icon: <Truck className="w-7 h-7 text-amber-400" />, title: 'Volunteer Transport', desc: 'Register your vehicle and deliver supplies to camps in need. AI assigns optimal routes.', role: 'VOLUNTEER DRIVER', accent: 'border-amber-500/20 hover:border-amber-500/40', roleColor: 'text-amber-400' },
            ].map((f, i) => (
              <div key={f.title} className={`bg-slate-900/50 border ${f.accent} rounded-2xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 group anim-slide`} style={{ animationDelay: `${i * 120}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">{f.icon}</div>
                <div className={`text-[10px] font-bold ${f.roleColor} tracking-[0.15em] mb-2`}>{f.role}</div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-14">
            <Link to="/signup" className="btn-primary !py-3.5 !px-8">Sign Up to Help <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ═══ AI FEATURES ═══ */}
      <section className="py-20 sm:py-28 bg-slate-900/40 border-y border-slate-800/50">
        <div className="container-app">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-400 text-xs font-semibold">AI-POWERED</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">6 Coordination Failures. All Solved.</h2>
            <p className="text-slate-500 max-w-lg mx-auto">ReliefChain tackles the systemic issues that cost lives in every disaster.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: <Eye className="w-5 h-5 text-blue-400" />, title: 'Live Visibility', desc: 'Real-time map of which camps have what resources.' },
              { icon: <Zap className="w-5 h-5 text-cyan-400" />, title: 'AI Redistribution', desc: 'Auto-generates transfer suggestions: surplus → critical.' },
              { icon: <Shield className="w-5 h-5 text-amber-400" />, title: 'Duplication Detection', desc: 'Catches when 2 NGOs send to the same camp.' },
              { icon: <Activity className="w-5 h-5 text-red-400" />, title: 'Forgotten Zones', desc: 'Detects camps that received ZERO supplies.' },
              { icon: <Truck className="w-5 h-5 text-violet-400" />, title: 'Transport Tracking', desc: 'Assigns vehicles, tracks routes, confirms delivery.' },
              { icon: <BarChart3 className="w-5 h-5 text-emerald-400" />, title: 'Full Transparency', desc: 'Every rupee and blanket tracked source to delivery.' },
            ].map((f, i) => (
              <div key={f.title} className="bg-slate-800/30 border border-slate-700/40 rounded-xl p-5 flex gap-4 items-start hover:bg-slate-800/50 hover:border-slate-700/60 transition-all anim-fade" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">{f.icon}</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 sm:py-28">
        <div className="container-app">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-500">4 steps. 10 inputs. AI handles the rest.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: '01', icon: '📋', title: 'Report', desc: 'Camp coordinator enters population + stock levels in a 10-field form.' },
              { num: '02', icon: '🤖', title: 'Analyze', desc: 'AI calculates needs using WHO standards, detects shortages & surpluses.' },
              { num: '03', icon: '🚛', title: 'Coordinate', desc: 'System generates transfers and assigns volunteer drivers automatically.' },
              { num: '04', icon: '✅', title: 'Deliver', desc: 'Supplies reach the right camps. Every item tracked end to end.' },
            ].map((s, i) => (
              <div key={s.num} className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 sm:p-7 text-center hover:-translate-y-1 hover:border-slate-700/60 transition-all anim-slide" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-blue-400 tracking-widest mb-2">STEP {s.num}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIVE MAP ═══ */}
      <section id="live-map" className="py-20 sm:py-28 bg-slate-900/40 border-y border-slate-800/50">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Live Disaster Map</h2>
            <p className="text-slate-500">Real-time status of all relief camps. Click any marker.</p>
          </div>
          <div className="h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/30">
            <DisasterMap />
          </div>
        </div>
      </section>

      {/* ═══ DONATIONS TICKER ═══ */}
      <section className="py-16 sm:py-20">
        <div className="container-app max-w-3xl">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Recent Contributions</h2>
          <div className="space-y-2">
            {[...seedDonations.map(d => ({ name: d.donor_name, text: `₹${d.amount.toLocaleString()} · ${d.resource_type}`, camp: d.allocated_camp, money: true })),
              ...seedItemDonations.map(d => ({ name: d.donor_name, text: `${d.quantity} ${d.item_category}`, camp: d.allocated_camp, money: false }))
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 bg-slate-800/40 border border-slate-700/30 rounded-xl px-4 sm:px-5 py-3 hover:bg-slate-800/60 transition-colors anim-fade" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.money ? 'bg-emerald-500/10' : 'bg-violet-500/10'}`}>
                  {d.money ? <Heart className="w-4 h-4 text-emerald-400" /> : <Truck className="w-4 h-4 text-violet-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-white text-sm">{d.name}</span>
                  <span className="text-slate-500 text-sm ml-2">{d.text}</span>
                </div>
                <span className="text-[11px] text-slate-600 flex-shrink-0 hidden sm:block">→ {d.camp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="bg-gradient-to-br from-blue-500/[0.07] to-cyan-500/[0.05] border border-blue-500/15 rounded-3xl p-8 sm:p-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Save Lives?</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Whether you donate ₹100 or drive a truck — every action counts.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="btn-primary !py-3.5 !px-8">Create Free Account <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/signin" className="btn-secondary !py-3.5 !px-8">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t border-slate-800/50">
        <div className="container-app flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">ReliefChain</span>
          </div>
          <p className="text-xs text-slate-600 text-center">"The real disaster isn't lack of resources — it's lack of coordination."</p>
          <div className="flex gap-4">
            <Link to="/signin" className="text-xs text-slate-500 hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="text-xs text-slate-500 hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
