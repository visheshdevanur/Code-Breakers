import { AlertTriangle, MapPin } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { detectForgottenZones } from '../../lib/aiEngine';

export default function ForgottenZones({ camps = seedCamps, resources = seedResources }) {
  const forgotten = detectForgottenZones(camps, resources);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">🚨 Forgotten Zones — Zero Supplies</h3>
        {forgotten.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{forgotten.length}</span>}
      </div>
      {forgotten.length === 0 ? (
        <div className="p-6 text-center text-slate-400">✅ No forgotten zones detected. All camps have supplies.</div>
      ) : (
        <div className="divide-y divide-slate-700">
          {forgotten.map(camp => (
            <div key={camp.id} className="p-4 hover:bg-slate-700/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{camp.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {camp.village} • Pop: {camp.current_population}
                  </div>
                  <div className="mt-2 space-y-1">
                    {camp.reasons.map((r, i) => (
                      <div key={i} className="text-xs text-red-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {r}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {camp.resources.map(r => (
                      <span key={r.resource_type} className={`text-xs px-2 py-0.5 rounded-full ${r.quantity <= 0 ? 'bg-red-500/20 text-red-400' : getDaysRemaining(r) < 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                        {r.resource_type}: {getDaysRemaining(r)}d
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="p-4">
            <button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-2 rounded-lg transition-colors text-sm">
              📋 Generate Emergency Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
