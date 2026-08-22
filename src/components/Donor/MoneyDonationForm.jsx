import { useState } from 'react';
import { Apple, Droplets, Pill, Sparkles, Heart } from 'lucide-react';
import { seedCamps } from '../../lib/seedData';
import { CONVERSION_RATES } from '../../lib/aiEngine';

export default function MoneyDonationForm({ camps = seedCamps, onDonate }) {
  const [amount, setAmount] = useState('');
  const [resource, setResource] = useState('any');
  const [campPref, setCampPref] = useState('ai');
  const [showSuccess, setShowSuccess] = useState(false);

  const quickAmounts = [500, 1000, 2000, 5000];
  const resOptions = [
    { value: 'any', label: 'Any (Let AI Decide)', icon: Sparkles },
    { value: 'food', label: 'Food Kits', icon: Apple },
    { value: 'water', label: 'Water', icon: Droplets },
    { value: 'medicine', label: 'Medicine', icon: Pill },
  ];

  const handleSubmit = () => {
    if (!amount || +amount <= 0) return;
    setShowSuccess(true);
    onDonate?.({ amount: +amount, resource, campPref });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resType = resource === 'any' ? 'food' : resource;
  const unitsEstimate = amount ? Math.floor(+amount / CONVERSION_RATES[resType]) : 0;

  if (showSuccess) {
    return (
      <div className="dark-card border border-red-500/30 p-8 text-center anim-up">
        <div className="icon-box mx-auto mb-4 bg-red-500/10 text-red-500">
          <Heart className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Donation Successful!</h3>
        <p className="text-neutral-400">₹{(+amount).toLocaleString()} → {unitsEstimate} {resType} {resType === 'food' ? 'kits' : resType === 'water' ? 'liters' : 'packs'}</p>
        <p className="text-neutral-500 text-sm mt-2">AI is allocating to the most critical camp...</p>
      </div>
    );
  }

  return (
    <div className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" /> Donate Money
        </h3>
      </div>
      <div className="p-5 space-y-5">
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-2">Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="input text-xl font-bold" />
          <div className="flex gap-2 mt-3">
            {quickAmounts.map(a => (
              <button key={a} onClick={() => setAmount(a)} className={`px-4 py-2 rounded-[14px] text-sm font-medium transition-all ${+amount === a ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'btn-dark'}`}>
                ₹{a.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        {amount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-[16px] p-4 text-sm text-red-400 anim-up">
            ≈ {unitsEstimate} {resType} {resType === 'food' ? 'kits' : resType === 'water' ? 'liters' : 'packs'} (@ ₹{CONVERSION_RATES[resType]}/{resType === 'water' ? 'liter' : 'unit'})
          </div>
        )}
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-2">Preferred Resource</label>
          <div className="grid grid-cols-2 gap-3">
            {resOptions.map(o => (
              <button key={o.value} onClick={() => setResource(o.value)} className={`flex items-center gap-2 p-3 rounded-[14px] text-sm transition-all border ${resource === o.value ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'btn-dark'}`}>
                <o.icon className="w-4 h-4" /> {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-2">Camp Preference</label>
          <select value={campPref} onChange={e => setCampPref(e.target.value)} className="input">
            <option value="ai">Most Critical (AI Decides)</option>
            {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={handleSubmit} disabled={!amount || +amount <= 0} className="btn-red w-full py-3 flex items-center justify-center gap-2 mt-2">
          Simulate Payment (₹{amount ? (+amount).toLocaleString() : '0'})
        </button>
      </div>
    </div>
  );
}
