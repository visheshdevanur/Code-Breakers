import { getStatus, calculateDailyNeeds } from '../../lib/aiEngine';

const SAFE_DAYS = 3;
const resIcons = { food: '🍚', water: '💧', medicine: '💊', shelter: '🏠' };
const resUnits = { food: 'kits', water: 'liters', medicine: 'packs', shelter: 'beds' };

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
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden animate-slide-in">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white">📊 AI Analysis — {formData.camp_name}</h3>
        <p className="text-xs text-slate-400 mt-1">Based on WHO/Sphere humanitarian standards</p>
      </div>
      <div className="p-4 space-y-3">
        {analysis.map(a => (
          <div key={a.type} className={`rounded-lg border p-4 ${a.status.bg} ${a.status.border}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">{resIcons[a.type]} {a.type.toUpperCase()}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.status.bg} ${a.status.text}`}>{a.status.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-400">Time Left</div>
                <div className={`font-bold ${a.status.text}`}>
                  {a.hoursRemaining < 24 ? `${a.hoursRemaining}h` : `${a.daysRemaining}d`}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Daily Need</div>
                <div className="font-bold text-white">{a.dailyNeed.toLocaleString()} {resUnits[a.type]}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Deficit (3-day)</div>
                <div className="font-bold text-white">{a.deficit > 0 ? a.deficit.toLocaleString() : '—'} {a.deficit > 0 ? resUnits[a.type] : ''}</div>
              </div>
            </div>
            {a.deficit > 0 && (
              <div className="mt-2 text-xs text-green-400 font-medium">✓ Request Auto-Generated</div>
            )}
          </div>
        ))}

        {formData.urgent_need && (
          <div className="bg-amber-500/10 border border-amber-500 rounded-lg p-3">
            <div className="text-xs text-amber-400 font-bold mb-1">⚡ Special Request</div>
            <div className="text-sm text-amber-200">{formData.urgent_need}</div>
            <div className="text-xs text-amber-400 mt-1">⚑ Flagged for Manual Review</div>
          </div>
        )}

        <div className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-slate-300">✅ {requestCount} request(s) auto-generated</span>
          <button onClick={() => onSubmitAll?.(analysis)} className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm">
            Submit All Requests
          </button>
        </div>
      </div>
    </div>
  );
}
