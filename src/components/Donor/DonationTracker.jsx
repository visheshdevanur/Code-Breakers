import { useState } from 'react';
import { Heart, DollarSign, Package, CheckCircle2, Circle, Truck, MapPin } from 'lucide-react';
import { seedDonations, seedItemDonations } from '../../lib/seedData';

const moneySteps = ['donated', 'allocated', 'converted', 'dispatched', 'delivered'];
const itemSteps = ['registered', 'collected', 'sorted', 'matched', 'dispatched', 'delivered'];

function StepTracker({ steps, currentStatus }) {
  const currentIdx = steps.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          {i <= currentIdx ? (
            <CheckCircle2 className="w-4 h-4 text-red-500" />
          ) : (
            <Circle className="w-4 h-4 text-white/[0.1]" />
          )}
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-1 rounded-full ${i < currentIdx ? 'bg-red-500' : 'bg-white/[0.05]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function DonationTracker() {
  const [tab, setTab] = useState('money');

  return (
    <div className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04]">
        <h3 className="text-lg font-bold text-white mb-4">Donation Tracker</h3>
        <div className="flex gap-2">
          <button onClick={() => setTab('money')} className={`px-4 py-2 rounded-[14px] text-sm font-medium transition-all ${tab === 'money' ? 'bg-red-500/10 text-red-400' : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'}`}>
            Money ({seedDonations.length})
          </button>
          <button onClick={() => setTab('items')} className={`px-4 py-2 rounded-[14px] text-sm font-medium transition-all ${tab === 'items' ? 'bg-red-500/10 text-red-400' : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'}`}>
            Items ({seedItemDonations.length})
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
        {tab === 'money' ? seedDonations.map((d, i) => (
          <div key={d.id} className="bg-white/[0.02] border border-white/[0.04] rounded-[16px] p-5 anim-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="icon-box w-10 h-10 bg-red-500/10 text-red-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">₹{d.amount.toLocaleString()}</div>
                  <div className="text-sm text-neutral-400">By: {d.donor_name}</div>
                </div>
              </div>
              <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">
                {d.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-2 bg-white/[0.02] p-2 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" /> {d.allocated_camp} • {d.resource_quantity} {d.resource_type} {d.resource_type === 'food' ? 'kits' : ''}
            </div>
            <StepTracker steps={moneySteps} currentStatus={d.status} />
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {moneySteps.map((s, idx) => (
                <span key={s} className={`text-[10px] font-medium ${moneySteps.indexOf(d.status) >= idx ? 'text-red-400' : 'text-neutral-600'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}{idx < moneySteps.length - 1 ? ' →' : ''}
                </span>
              ))}
            </div>
          </div>
        )) : seedItemDonations.map((d, i) => (
          <div key={d.id} className="bg-white/[0.02] border border-white/[0.04] rounded-[16px] p-5 anim-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="icon-box w-10 h-10 bg-red-500/10 text-red-500">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{d.quantity} {d.item_category}</div>
                  <div className="text-sm text-neutral-400">By: {d.donor_name}</div>
                </div>
              </div>
              <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">
                {d.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-2 bg-white/[0.02] p-3 rounded-lg">
              <div className="font-medium text-neutral-300 mb-1">{d.condition.replace('_', ' ')}</div>
              {d.description}
            </div>
            <div className="text-xs text-neutral-400 flex items-center gap-1.5 mt-2">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" /> Dest: {d.allocated_camp}
            </div>
            <StepTracker steps={itemSteps} currentStatus={d.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
