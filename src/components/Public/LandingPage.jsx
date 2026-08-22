import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Users, Heart, Truck, Eye, ArrowRight, Package, Globe, Zap, ChevronDown, Activity, BarChart3, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { seedCamps, seedResources, seedDonations, seedItemDonations, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';
import DisasterMap from '../Map/DisasterMap';

/* ─── Animated Counter ─────────────────────────────────────────────────── */
function Counter({ end, duration = 1500, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Stat Card ────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, value, label, color, delay = 0 }) {
  const colors = {
    blue: 'from-blue-500/15 to-blue-600/5 border-blue-500/20',
    red: 'from-red-500/15 to-red-600/5 border-red-500/20',
    amber: 'from-amber-500/15 to-amber-600/5 border-amber-500/20',
    green: 'from-green-500/15 to-green-600/5 border-green-500/20',
    cyan: 'from-cyan-500/15 to-cyan-600/5 border-cyan-500/20',
    purple: 'from-purple-500/15 to-purple-600/5 border-purple-500/20',
  };
  const iconColors = { blue: 'text-blue-400', red: 'text-red-400', amber: 'text-amber-400', green: 'text-green-400', cyan: 'text-cyan-400', purple: 'text-purple-400' };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl border p-5 sm:p-6 animate-slide-up card-hover`} style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${iconColors[color]}`} />
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white animate-count-up">{value}</div>
      <div className="text-xs sm:text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );
}

/* ─── Feature Card ─────────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, emoji, title, desc, color, role, delay = 0 }) {
  const iconBg = { green: 'bg-green-500/10', purple: 'bg-purple-500/10', amber: 'bg-amber-500/10', blue: 'bg-blue-500/10' };
  const iconText = { green: 'text-green-400', purple: 'text-purple-400', amber: 'text-amber-400', blue: 'text-blue-400' };
  const roleBg = { green: 'text-green-400', purple: 'text-purple-400', amber: 'text-amber-400', blue: 'text-blue-400' };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-8 card-hover animate-slide-up group" style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${iconBg[color]} flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform`}>
        {Icon ? <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${iconText[color]}`} /> : <span className="text-2xl">{emoji}</span>}
      </div>
      <span className={`text-[10px] sm:text-xs font-bold ${roleBg[color]} uppercase tracking-widest`}>{role}</span>
      <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Main Landing Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const totalPop = seedCamps.reduce((s, c) => s + c.current_population, 0);
  const criticals = seedCamps.filter(c => calculatePriorityScore(c, seedResources) > 18).length;
  const totalDonations = seedDonations.reduce((s, d) => s + d.amount, 0);
  const totalItems = seedItemDonations.reduce((s, d) => s + d.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--surface-0)]">
      {/* ─── Navbar ──────────────────────────────────────────────────── */}
      <nav className="glass sticky top-0 z-50 border-b border-slate-800/50">
        <div className="container-app py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-shadow">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">ReliefChain</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/signin" className="text-slate-300 hover:text-white px-3 sm:px-4 py-2 text-sm font-medium transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container-app py-16 sm:py-20 lg:py-28 relative">
          <div className="max-w-3xl">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-4 py-2 rounded-full mb-6 sm:mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              LIVE DISASTER RESPONSE ACTIVE
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-slide-up">
              Don't Manage Supplies.{' '}
              <span className="gradient-text">Manage Information.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-2xl animate-slide-up stagger-2">
              During Kerala Floods, ₹3,000 crores poured in — yet people died waiting. 
              Not because we lacked supplies, but because{' '}
              <strong className="text-white">nobody knew where they were</strong>. 
              ReliefChain fixes the coordination crisis with AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up stagger-3">
              <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                Start Helping Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#live-map" className="bg-slate-800/80 hover:bg-slate-700/80 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-medium transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" /> View Live Map
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden lg:flex justify-center pb-8 animate-float">
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </div>
      </section>

      {/* ─── Live Stats ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 border-y border-slate-800/50">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon={MapPin} value={<Counter end={seedCamps.length} />} label="Active Relief Camps" color="blue" delay={0} />
            <StatCard icon={Users} value={<Counter end={totalPop} />} label="People Affected" color="red" delay={100} />
            <StatCard icon={Activity} value={<Counter end={criticals} />} label="Critical Camps" color="amber" delay={200} />
            <StatCard icon={Heart} value={<><Counter end={totalDonations / 1000} prefix="₹" suffix="K" /></>} label="Donations Received" color="green" delay={300} />
          </div>
        </div>
      </section>

      {/* ─── How You Can Help ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="container-app">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">How You Can Help</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">Join as a donor, NGO, or volunteer driver. Every role is critical in saving lives during disasters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard icon={Heart} title="Donate" desc="Give money or physical items — clothes, food, blankets, medicine. Track every rupee and every item to delivery." color="green" role="Citizen / Donor" delay={0} />
            <FeatureCard icon={Globe} title="Coordinate Relief" desc="NGOs and government agencies can dispatch supplies, see where help is needed, and avoid duplication." color="purple" role="NGO / Government" delay={100} />
            <FeatureCard icon={Truck} title="Volunteer Transport" desc="Register your vehicle and deliver supplies to camps in need. AI assigns optimal routes." color="amber" role="Volunteer Driver" delay={200} />
          </div>
          <div className="text-center mt-8 sm:mt-12 animate-slide-up">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95">
              Sign Up to Help <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI Features ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-900/50 border-y border-slate-800/50">
        <div className="container-app">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Zap className="w-3 h-3" /> POWERED BY AI
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">6 Coordination Failures. All Solved.</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">ReliefChain solves the coordination failures that cost lives in every disaster.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: Eye, title: 'Live Visibility', desc: 'Real-time map shows which camps have what resources — no more guessing.', color: 'blue' },
              { icon: Zap, title: 'AI Recommendations', desc: 'Auto-generates transfer suggestions from surplus to critical camps instantly.', color: 'cyan' },
              { icon: Shield, title: 'Duplication Detection', desc: 'Catches when 2 NGOs are sending supplies to the same camp.', color: 'amber' },
              { icon: Activity, title: 'Forgotten Zone Alerts', desc: 'Detects camps that received ZERO supplies and nobody noticed.', color: 'red' },
              { icon: Truck, title: 'Transport Tracking', desc: 'Assigns vehicles, tracks routes, and confirms delivery — end to end.', color: 'purple' },
              { icon: BarChart3, title: 'Full Transparency', desc: 'Every rupee donated and every blanket given — tracked from source to delivery.', color: 'green' },
            ].map((f, i) => {
              const colors = { blue: 'border-blue-500/20 bg-blue-500/5', cyan: 'border-cyan-500/20 bg-cyan-500/5', amber: 'border-amber-500/20 bg-amber-500/5', red: 'border-red-500/20 bg-red-500/5', purple: 'border-purple-500/20 bg-purple-500/5', green: 'border-green-500/20 bg-green-500/5' };
              const iconColors = { blue: 'text-blue-400', cyan: 'text-cyan-400', amber: 'text-amber-400', red: 'text-red-400', purple: 'text-purple-400', green: 'text-green-400' };
              return (
                <div key={f.title} className={`${colors[f.color]} border rounded-xl p-5 flex gap-4 items-start card-hover animate-slide-up`} style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex-shrink-0 mt-0.5">
                    <f.icon className={`w-5 h-5 ${iconColors[f.color]}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{f.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Live Map ────────────────────────────────────────────────── */}
      <section id="live-map" className="py-16 sm:py-24">
        <div className="container-app">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Live Disaster Map</h2>
            <p className="text-slate-400 text-sm sm:text-base">Real-time status of all relief camps. Click any marker for details.</p>
          </div>
          <div className="h-[350px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/20">
            <DisasterMap />
          </div>
        </div>
      </section>

      {/* ─── Donation Ticker ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-900/50 border-y border-slate-800/50">
        <div className="container-app max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">Recent Contributions</h2>
          <div className="space-y-2 sm:space-y-3">
            {[...seedDonations.map(d => ({ name: d.donor_name, text: `₹${d.amount.toLocaleString()} • ${d.resource_type}`, camp: d.allocated_camp, type: 'money' })),
              ...seedItemDonations.map(d => ({ name: d.donor_name, text: `${d.quantity} ${d.item_category}`, camp: d.allocated_camp, type: 'item' }))
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 bg-slate-800/50 rounded-xl px-4 sm:px-5 py-3 border border-slate-700/50 animate-slide-up card-hover" style={{ animationDelay: `${i * 60}ms` }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${d.type === 'money' ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                  {d.type === 'money' ? <Heart className="w-4 h-4 text-green-400" /> : <Package className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-white text-sm">{d.name}</span>
                  <span className="text-slate-400 text-sm ml-2 hidden sm:inline">{d.text}</span>
                  <span className="text-slate-400 text-xs ml-2 sm:hidden">{d.text}</span>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">→ {d.camp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="container-app">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 text-sm sm:text-base">10 numbers. That's all a coordinator enters. AI does the rest.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '01', title: 'Report', desc: 'Camp coordinator enters population + stock levels via a simple 10-field form.', icon: '📋' },
              { step: '02', title: 'Analyze', desc: 'AI calculates needs using WHO standards, detects shortages and surpluses.', icon: '🤖' },
              { step: '03', title: 'Coordinate', desc: 'System generates transfer recommendations and assigns volunteer drivers.', icon: '🚛' },
              { step: '04', title: 'Deliver', desc: 'Supplies reach the right camps. Every item tracked from source to delivery.', icon: '✅' },
            ].map((s, i) => (
              <div key={s.step} className="relative animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 text-center card-hover h-full">
                  <div className="text-3xl sm:text-4xl mb-4">{s.icon}</div>
                  <div className="text-xs font-bold text-blue-400 mb-2">STEP {s.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="bg-gradient-to-br from-blue-500/10 via-slate-800/50 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Save Lives?</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto text-sm sm:text-base">Join ReliefChain today. Whether you donate ₹100 or drive a truck — every action counts.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 inline-flex items-center justify-center gap-2">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/signin" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-medium transition-colors border border-slate-700 inline-flex items-center justify-center gap-2">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="py-8 sm:py-12 border-t border-slate-800/50">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">ReliefChain</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 text-center">"The real disaster isn't lack of resources — it's lack of coordination."</p>
            <div className="flex gap-4">
              <Link to="/signin" className="text-xs text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="text-xs text-slate-400 hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
