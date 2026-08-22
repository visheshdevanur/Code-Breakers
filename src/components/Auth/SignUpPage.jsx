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

  const inputCls = "w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none";
  const inputNoCls = "w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Join ReliefChain</h1>
          <p className="text-slate-400 mt-1">Choose your role and start helping today</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 justify-center mb-6">
          {[1, 2].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full transition-all ${step >= s ? 'bg-blue-500 scale-110' : 'bg-slate-700'}`} />
          ))}
          {role === 'ngo' || role === 'driver' ? <div className={`w-3 h-3 rounded-full transition-all ${step >= 3 ? 'bg-blue-500 scale-110' : 'bg-slate-700'}`} /> : null}
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl border border-slate-700 p-8 space-y-5">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}

          {/* STEP 1: Choose Role */}
          {step === 1 && (
            <>
              <label className="text-sm text-slate-300 font-medium block mb-2">How do you want to help?</label>
              <div className="space-y-2">
                {roleOptions.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${role === r.value ? 'bg-blue-500/15 border-blue-500 text-white ring-1 ring-blue-500/50' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'}`}>
                    <div className="font-semibold">{r.label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
              <button type="button" disabled={!role} onClick={() => setStep(2)}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* STEP 2: Basic Details */}
          {step === 2 && (
            <>
              <div className="text-center mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                  Signing up as {roleOptions.find(r => r.value === role)?.label}
                </span>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={form.full_name} onChange={set('full_name')} required placeholder="Enter your full name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="your@email.com" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-1.5">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="tel" value={form.phone} onChange={set('phone')} required placeholder="+91..." className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-300 font-medium block mb-1.5">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={form.city} onChange={set('city')} required placeholder="Kochi" className={inputCls} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" value={form.password} onChange={set('password')} required placeholder="Min 6 characters" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" value={form.confirm_password} onChange={set('confirm_password')} required placeholder="••••••••" className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium transition-colors">Back</button>
                {(role === 'ngo' || role === 'driver') ? (
                  <button type="button" onClick={() => setStep(3)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    Next: {role === 'ngo' ? 'Organization' : 'Vehicle'} Details <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 text-white py-3 rounded-xl font-bold transition-colors">
                    {loading ? 'Creating...' : '✅ Create Account'}
                  </button>
                )}
              </div>
            </>
          )}

          {/* STEP 3: Role-specific details */}
          {step === 3 && role === 'ngo' && (
            <>
              <h3 className="text-lg font-bold text-white">🏥 Organization Details</h3>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Organization Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={form.organization_name} onChange={set('organization_name')} required placeholder="Red Cross Kerala" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Organization Type *</label>
                <select value={form.organization_type} onChange={set('organization_type')} required className={inputNoCls}>
                  <option value="">Select type...</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government Body</option>
                  <option value="international">International Organization</option>
                  <option value="religious">Religious/Charitable Trust</option>
                  <option value="corporate_csr">Corporate CSR</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Registration Number *</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={form.registration_number} onChange={set('registration_number')} required placeholder="NGO/REG/12345" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Document / Certificate URL</label>
                <input type="url" value={form.document_url} onChange={set('document_url')} placeholder="https://..." className={inputNoCls} />
                <p className="text-xs text-slate-500 mt-1">Upload your registration certificate to a drive and paste the link</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium">Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 text-white py-3 rounded-xl font-bold">
                  {loading ? 'Creating...' : '✅ Create Account'}
                </button>
              </div>
            </>
          )}

          {step === 3 && role === 'driver' && (
            <>
              <h3 className="text-lg font-bold text-white">🚛 Vehicle & License Details</h3>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Vehicle Type *</label>
                <select value={form.vehicle_type} onChange={set('vehicle_type')} required className={inputNoCls}>
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
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Vehicle Number *</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={form.vehicle_number} onChange={set('vehicle_number')} required placeholder="KL-07-AB-1234" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Driving License Number *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={form.driving_license} onChange={set('driving_license')} required placeholder="DL-XXXXXX" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium block mb-1.5">Carrying Capacity (in kits/items)</label>
                <input type="number" value={form.carrying_capacity} onChange={set('carrying_capacity')} placeholder="500" className={inputNoCls} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer bg-slate-700/50 p-3 rounded-lg">
                <input type="checkbox" checked={form.can_access_flooded} onChange={set('can_access_flooded')} className="w-4 h-4 rounded accent-blue-500" />
                <div>
                  <span className="text-sm text-white font-medium">Can access flooded roads?</span>
                  <p className="text-xs text-slate-400">e.g., boat or raised vehicle</p>
                </div>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-medium">Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-600 text-white py-3 rounded-xl font-bold">
                  {loading ? 'Creating...' : '✅ Create Account'}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-slate-400">
            Already have an account? <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
