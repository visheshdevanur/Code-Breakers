import { AlertTriangle, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { detectForgottenZones } from '../../lib/aiEngine';

export default function ForgottenZones({ camps = seedCamps, resources = seedResources }) {
  const forgotten = detectForgottenZones(camps, resources);

  return (
    <div className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Forgotten Zones
        </h3>
        {forgotten.length > 0 && <span className="badge bg-red-500/10 text-red-500 border border-red-500/20">{forgotten.length}</span>}
      </div>
      
      {forgotten.length === 0 ? (
        <div className="p-6 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-neutral-600" />
          <span className="text-sm">No forgotten zones detected. All camps have supplies.</span>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {forgotten.map((camp, i) => (
            <div key={camp.id} className="p-5 hover:bg-white/[0.02] transition-colors anim-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-4">
                <div className="icon-box bg-red-500/10 text-red-500 flex-shrink-0 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{camp.name}</div>
                  <div className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {camp.village} • Pop: {camp.current_population}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {camp.reasons.map((r, idx) => (
                      <div key={idx} className="text-xs text-red-400/90 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-red-500" /> {r}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {camp.resources.map(r => {
                      const days = getDaysRemaining(r);
                      const isZero = r.quantity <= 0;
                      const isLow = days < 1;
                      
                      return (
                        <span key={r.resource_type} className={`badge ${isZero ? 'bg-red-500/10 text-red-400 border border-red-500/20' : isLow ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/[0.04] text-neutral-400 border border-white/[0.04]'}`}>
                          {r.resource_type}: {days}d
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="p-5">
            <button className="btn-red w-full flex items-center justify-center gap-2 text-sm">
              <FileText className="w-4 h-4" /> Generate Emergency Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
