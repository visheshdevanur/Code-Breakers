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
      <div className="bg-slate-800 rounded-xl border border-green-500 p-8 text-center animate-slide-in">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Donation Successful!</h3>
        <p className="text-slate-300">₹{(+amount).toLocaleString()} → {unitsEstimate} {resType} {resType === 'food' ? 'kits' : resType === 'water' ? 'liters' : 'packs'}</p>
        <p className="text-slate-400 text-sm mt-2">AI is allocating to the most critical camp...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Heart className="w-5 h-5 text-red-400" /> Donate Money</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">Amount (₹)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="w-full bg-slate-700 text-white text-xl rounded-lg px-4 py-3 border border-slate-600 font-bold" />
          <div className="flex gap-2 mt-2">
            {quickAmounts.map(a => (
              <button key={a} onClick={() => setAmount(a)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${+amount === a ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                ₹{a.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        {amount > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
            ≈ {unitsEstimate} {resType} {resType === 'food' ? 'kits' : resType === 'water' ? 'liters' : 'packs'} (@ ₹{CONVERSION_RATES[resType]}/{resType === 'water' ? 'liter' : 'unit'})
          </div>
        )}
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">Preferred Resource</label>
          <div className="grid grid-cols-2 gap-2">
            {resOptions.map(o => (
              <button key={o.value} onClick={() => setResource(o.value)} className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-colors ${resource === o.value ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-700 border-slate-600 text-slate-300'} border`}>
                <o.icon className="w-4 h-4" /> {o.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">Camp Preference</label>
          <select value={campPref} onChange={e => setCampPref(e.target.value)} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600">
            <option value="ai">🤖 Most Critical (AI Decides)</option>
            {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={handleSubmit} disabled={!amount || +amount <= 0} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-sm">
          💳 Simulate Payment (₹{amount ? (+amount).toLocaleString() : '0'})
        </button>
      </div>
    </div>
  );
}
