import { useState } from 'react';
import { Heart, DollarSign, Package, CheckCircle2, Circle, Truck, MapPin } from 'lucide-react';
import { seedDonations, seedItemDonations } from '../../lib/seedData';

const moneySteps = ['donated', 'allocated', 'converted', 'dispatched', 'delivered'];
const itemSteps = ['registered', 'collected', 'sorted', 'matched', 'dispatched', 'delivered'];

function StepTracker({ steps, currentStatus }) {
  const currentIdx = steps.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 mt-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          {i <= currentIdx ? (
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          ) : (
            <Circle className="w-4 h-4 text-slate-600" />
          )}
          {i < steps.length - 1 && (
            <div className={`w-4 h-0.5 ${i < currentIdx ? 'bg-green-400' : 'bg-slate-600'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function DonationTracker() {
  const [tab, setTab] = useState('money');

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white mb-3">📍 Donation Tracker</h3>
        <div className="flex gap-2">
          <button onClick={() => setTab('money')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'money' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            💰 Money ({seedDonations.length})
          </button>
          <button onClick={() => setTab('items')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'items' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}>
            👕 Items ({seedItemDonations.length})
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {tab === 'money' ? seedDonations.map(d => (
          <div key={d.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="font-bold text-white">₹{d.amount.toLocaleString()}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${d.status === 'delivered' ? 'bg-green-500/20 text-green-400' : d.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {d.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-slate-300">By: {d.donor_name}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {d.allocated_camp} • {d.resource_quantity} {d.resource_type} {d.resource_type === 'food' ? 'kits' : ''}
            </div>
            <StepTracker steps={moneySteps} currentStatus={d.status} />
            <div className="mt-1 flex gap-1 flex-wrap">
              {moneySteps.map((s, i) => (
                <span key={s} className={`text-[10px] ${moneySteps.indexOf(d.status) >= i ? 'text-green-400' : 'text-slate-500'}`}>
                  {s}{i < moneySteps.length - 1 ? ' →' : ''}
                </span>
              ))}
            </div>
          </div>
        )) : seedItemDonations.map(d => (
          <div key={d.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">{d.quantity} {d.item_category}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${d.status === 'delivered' ? 'bg-green-500/20 text-green-400' : d.status === 'dispatched' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {d.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-slate-300">By: {d.donor_name} • {d.condition}</div>
            <div className="text-xs text-slate-400 mt-1">{d.description}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> → {d.allocated_camp}
            </div>
            <StepTracker steps={itemSteps} currentStatus={d.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
