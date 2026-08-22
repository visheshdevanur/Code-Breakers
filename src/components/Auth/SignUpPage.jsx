import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, User, Phone, MapPin, Building2, FileText, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { signUp } from '../../lib/supabase';

const roleOptions = [
  { value: 'donor', label: '💰 Donor / Citizen', desc: 'Donate money or items, track your impact' },
  { value: 'ngo', label: '🏥 NGO / Government', desc: 'Dispatch supplies, coordinate relief' },
  { value: 'driver', label: '🚛 Volunteer Driver', desc: 'Transport supplies to camps' },
  { value: 'coordinator', label: '👤 Camp Coordinator', desc: 'Manage a relief camp on the ground' },
];

export default function SignUpPage({ onAuth }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', city: '', password: '', confirm_password: '',
    // NGO fields
    organization_name: '', organization_type: '', registration_number: '', document_url: '',
    // Driver fields
    vehicle_type: '', vehicle_number: '', driving_license: '', carrying_capacity: '', can_access_flooded: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const metadata = {
        full_name: form.full_name, phone: form.phone, city: form.city, role,
        ...(role === 'ngo' && { organization_name: form.organization_name, organization_type: form.organization_type, registration_number: form.registration_number, document_url: form.document_url }),
        ...(role === 'driver' && { vehicle_type: form.vehicle_type, vehicle_number: form.vehicle_number, driving_license: form.driving_license, carrying_capacity: +form.carrying_capacity || 0, can_access_flooded: form.can_access_flooded }),
      };
      const data = await signUp(form.email, form.password, metadata);
      onAuth?.(data.user, metadata);
      navigate(role === 'coordinator' ? '/coordinator' : role === 'ngo' ? '/ngo' : role === 'driver' ? '/driver' : '/donor');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center icon-box bg-red-500/10 mb-4">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Join ReliefChain</h1>
          <p className="text-neutral-400 mt-2">Choose your role and start helping today</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-3 justify-center mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full transition-all ${step >= s ? 'bg-red-500 scale-110 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-white/[0.04]'}`} />
          ))}
          {role === 'ngo' || role === 'driver' ? <div className={`w-3 h-3 rounded-full transition-all ${step >= 3 ? 'bg-red-500 scale-110 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-white/[0.04]'}`} /> : null}
        </div>

        <form onSubmit={handleSubmit} className="dark-card p-6 sm:p-8 space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-12 px-4 py-3 text-sm">{error}</div>}

          {/* STEP 1: Choose Role */}
          {step === 1 && (
            <div className="anim-in">
              <label className="text-sm text-neutral-300 font-medium block mb-3">How do you want to help?</label>
              <div className="space-y-3">
                {roleOptions.map((r, i) => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={`w-full text-left px-5 py-4 rounded-16 border transition-all anim-up d${i + 1} ${role === r.value ? 'bg-red-500/10 border-red-500/50 text-white shadow-[0_0_15px_rgba(220,38,38,0.15)]' : 'bg-white/[0.02] border-white/[0.04] text-neutral-400 hover:bg-white/[0.04]'}`}>
                    <div className={`font-semibold ${role === r.value ? 'text-white' : 'text-neutral-200'}`}>{r.label}</div>
                    <div className="text-sm mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
              <button type="button" disabled={!role} onClick={() => setStep(2)}
                className="btn-red w-full mt-6 py-3.5 flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Basic Details */}
          {step === 2 && (
            <div className="anim-in space-y-5">
              <div className="text-center mb-4">
                <span className="badge bg-red-500/10 text-red-500 border-red-500/20">
                  Signing up as {roleOptions.find(r => r.value === role)?.label}
                </span>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="text" value={form.full_name} onChange={set('full_name')} required placeholder="Enter your full name" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" className="input !pl-11" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-300 font-medium block mb-2">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input type="tel" value={form.phone} onChange={set('phone')} required placeholder="+91..." className="input !pl-11" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-neutral-300 font-medium block mb-2">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input type="text" value={form.city} onChange={set('city')} required placeholder="Kochi" className="input !pl-11" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="password" value={form.password} onChange={set('password')} required placeholder="Min 6 characters" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="password" value={form.confirm_password} onChange={set('confirm_password')} required placeholder="••••••••" className="input !pl-11" />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-dark flex-1">Back</button>
                {(role === 'ngo' || role === 'driver') ? (
                  <button type="button" onClick={() => setStep(3)} className="btn-red flex-[2] flex items-center justify-center gap-2">
                    Next Details <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-red flex-[2]">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Role-specific details */}
          {step === 3 && role === 'ngo' && (
            <div className="anim-in space-y-5">
              <h3 className="text-xl font-bold text-white mb-6">🏥 Organization Details</h3>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Organization Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="text" value={form.organization_name} onChange={set('organization_name')} required placeholder="Red Cross Kerala" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Organization Type *</label>
                <select value={form.organization_type} onChange={set('organization_type')} required className="input">
                  <option value="">Select type...</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government Body</option>
                  <option value="international">International Organization</option>
                  <option value="religious">Religious/Charitable Trust</option>
                  <option value="corporate_csr">Corporate CSR</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Registration Number *</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="text" value={form.registration_number} onChange={set('registration_number')} required placeholder="NGO/REG/12345" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Document / Certificate URL</label>
                <input type="url" value={form.document_url} onChange={set('document_url')} placeholder="https://..." className="input" />
                <p className="text-xs text-neutral-500 mt-2">Upload your registration certificate to a drive and paste the link</p>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-dark flex-1">Back</button>
                <button type="submit" disabled={loading} className="btn-red flex-[2]">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && role === 'driver' && (
            <div className="anim-in space-y-5">
              <h3 className="text-xl font-bold text-white mb-6">🚛 Vehicle & License Details</h3>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Vehicle Type *</label>
                <select value={form.vehicle_type} onChange={set('vehicle_type')} required className="input">
                  <option value="">Select type...</option>
                  <option value="truck">Truck</option>
                  <option value="auto">Auto Rickshaw</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="boat">Boat</option>
                  <option value="bike">Bike</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Vehicle Number *</label>
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="text" value={form.vehicle_number} onChange={set('vehicle_number')} required placeholder="KL-07-AB-1234" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Driving License Number *</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input type="text" value={form.driving_license} onChange={set('driving_license')} required placeholder="DL-XXXXXX" className="input !pl-11" />
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium block mb-2">Carrying Capacity (in kits/items)</label>
                <input type="number" value={form.carrying_capacity} onChange={set('carrying_capacity')} placeholder="500" className="input" />
              </div>
              <label className="flex items-center gap-4 cursor-pointer bg-white/[0.02] border border-white/[0.04] p-4 rounded-12 hover:bg-white/[0.04] transition-colors">
                <input type="checkbox" checked={form.can_access_flooded} onChange={set('can_access_flooded')} className="w-5 h-5 rounded border-white/[0.1] bg-white/[0.05] text-red-500 focus:ring-red-500 focus:ring-offset-0" />
                <div>
                  <span className="text-sm text-white font-medium">Can access flooded roads?</span>
                  <p className="text-xs text-neutral-400 mt-1">e.g., boat or raised vehicle</p>
                </div>
              </label>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-dark flex-1">Back</button>
                <button type="submit" disabled={loading} className="btn-red flex-[2]">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-neutral-400 mt-6 pt-6 border-t border-white/[0.04]">
            Already have an account? <Link to="/signin" className="text-red-500 hover:text-red-400 font-medium ml-1">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
