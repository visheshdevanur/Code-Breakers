import { getStatus, calculateDailyNeeds } from '../../lib/aiEngine';
import { Apple, Droplets, Pill, Home, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const SAFE_DAYS = 3;

export default function AIAnalysisResult({ formData, onSubmitAll }) {
  if (!formData) return null;

  const camp = {
    current_population: formData.current_population,
    children_count: formData.children_count,
    elderly_count: formData.elderly_count,
    pregnant_count: formData.pregnant_count,
    injured_count: formData.injured_count,
  };

  const needs = calculateDailyNeeds(camp);
  const stock = { food: formData.food, water: formData.water, medicine: formData.medicine, shelter: formData.shelter };

  const resIcons = { 
    food: <Apple className="w-5 h-5" />, 
    water: <Droplets className="w-5 h-5" />, 
    medicine: <Pill className="w-5 h-5" />, 
    shelter: <Home className="w-5 h-5" /> 
  };
  const resUnits = { food: 'kits', water: 'liters', medicine: 'packs', shelter: 'beds' };

  const analysis = Object.entries(needs).map(([type, dailyNeed]) => {
    const current = stock[type] || 0;
    const safeStock = dailyNeed * SAFE_DAYS;
    const deficit = Math.max(0, safeStock - current);
    const hoursRemaining = dailyNeed > 0 ? +((current / dailyNeed) * 24).toFixed(1) : 999;
    const daysRemaining = +(hoursRemaining / 24).toFixed(1);
    const score = hoursRemaining < 6 ? 25 : hoursRemaining < 24 ? 15 : hoursRemaining < 48 ? 8 : 3;
    return { type, dailyNeed, current, safeStock, deficit, hoursRemaining, daysRemaining, status: getStatus(score) };
  });

  const requestCount = analysis.filter(a => a.deficit > 0).length;

  return (
    <div className="dark-card anim-slide overflow-hidden flex flex-col">
      <div className="p-5 border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="icon-box bg-blue-500/10 text-blue-400 w-10 h-10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Analysis <span className="text-neutral-500 font-normal ml-2">| {formData.camp_name}</span></h3>
            <p className="text-xs text-neutral-400 mt-0.5">Based on WHO/Sphere humanitarian standards</p>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {analysis.map((a, i) => (
          <div key={a.type} className={`rounded-16 border p-5 anim-up bg-white/[0.02] ${a.status.border}`} style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-neutral-400 p-2 rounded-12 bg-white/[0.04]`}>{resIcons[a.type]}</span>
                <span className="font-bold text-white uppercase tracking-wider text-sm">{a.type}</span>
              </div>
              <span className={`badge ${a.status.bg} ${a.status.text}`}>{a.status.label}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/[0.02] p-3 rounded-12 border border-white/[0.02]">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Time Left</div>
                <div className={`text-lg font-bold ${a.hoursRemaining < 24 ? 'text-red-400' : 'text-neutral-200'}`}>
                  {a.hoursRemaining < 24 ? `${a.hoursRemaining}h` : `${a.daysRemaining}d`}
                </div>
              </div>
              <div className="bg-white/[0.02] p-3 rounded-12 border border-white/[0.02]">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Daily Need</div>
                <div className="text-lg font-bold text-white">
                  {a.dailyNeed.toLocaleString()} <span className="text-xs text-neutral-500 font-medium">{resUnits[a.type]}</span>
                </div>
              </div>
              <div className="bg-white/[0.02] p-3 rounded-12 border border-white/[0.02]">
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Deficit (3d)</div>
                <div className="text-lg font-bold text-white">
                  {a.deficit > 0 ? a.deficit.toLocaleString() : '0'} <span className="text-xs text-neutral-500 font-medium">{a.deficit > 0 ? resUnits[a.type] : ''}</span>
                </div>
              </div>
            </div>
            
            {a.deficit > 0 && (
              <div className="mt-4 pt-3 border-t border-white/[0.04] text-xs text-blue-400 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Request Auto-Generated
              </div>
            )}
          </div>
        ))}

        {formData.urgent_need && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-16 p-4 mt-2">
            <div className="text-xs text-amber-400 font-bold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Special Request
            </div>
            <div className="text-sm text-amber-100/80 leading-relaxed mb-3">{formData.urgent_need}</div>
            <div className="text-[10px] uppercase tracking-wider text-amber-400/70 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> Flagged for Manual Review
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] rounded-16 p-4 border border-white/[0.04]">
          <span className="text-sm font-medium text-neutral-300 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
              {requestCount}
            </div>
            Requests Ready
          </span>
          <button onClick={() => onSubmitAll?.(analysis)} className="btn-red px-6 py-2.5 text-sm font-medium">
            Submit All Requests
          </button>
        </div>
      </div>
    </div>
  );
}
