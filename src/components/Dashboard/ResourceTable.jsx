import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';

export default function ResourceTable({ camps = seedCamps, resources = seedResources, onCampClick }) {
  const [expandedId, setExpandedId] = useState(null);

  const campData = camps.map(camp => {
    const res = resources.filter(r => r.camp_id === camp.id);
    const food = res.find(r => r.resource_type === 'food');
    const water = res.find(r => r.resource_type === 'water');
    const medicine = res.find(r => r.resource_type === 'medicine');
    const score = calculatePriorityScore(camp, resources);
    const st = getStatus(score);
    return { ...camp, food: food ? getDaysRemaining(food) : 0, water: water ? getDaysRemaining(water) : 0, medicine: medicine ? getDaysRemaining(medicine) : 0, shelterPct: camp.total_capacity > 0 ? Math.round((camp.current_population / camp.total_capacity) * 100) : 0, score, st };
  }).sort((a, b) => b.score - a.score);

  const dayColor = (d) => d < 1 ? 'text-red-400 font-bold' : d < 2 ? 'text-amber-400' : d < 3 ? 'text-yellow-400' : 'text-green-400';
  const dayBg = (d) => d < 1 ? 'bg-red-500/10' : d < 2 ? 'bg-amber-500/10' : d < 3 ? 'bg-yellow-500/10' : 'bg-green-500/10';

  return (
    <div className="bg-[var(--surface-2)] rounded-2xl border border-slate-800/50 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-800/50">
        <h3 className="text-base sm:text-lg font-bold text-white">Resource Overview</h3>
        <p className="text-xs text-slate-500 mt-0.5">All camps sorted by priority score</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-800/50">
              <th className="px-5 py-3 font-medium">Camp</th>
              <th className="px-4 py-3 text-right font-medium">Pop.</th>
              <th className="px-4 py-3 text-right font-medium">🍚 Food</th>
              <th className="px-4 py-3 text-right font-medium">💧 Water</th>
              <th className="px-4 py-3 text-right font-medium">💊 Med</th>
              <th className="px-4 py-3 text-right font-medium">🏠 Use</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {campData.map((camp, i) => (
              <tr key={camp.id}
                className="border-b border-slate-800/30 hover:bg-slate-800/30 cursor-pointer transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => onCampClick?.(camp)}>
                <td className="px-5 py-3">
                  <div className="font-medium text-white text-sm">{camp.name.replace(' Relief Camp', '')}</div>
                  <div className="text-xs text-slate-500">{camp.village}</div>
                </td>
                <td className="px-4 py-3 text-right text-white font-medium">{camp.current_population}</td>
                <td className={`px-4 py-3 text-right ${dayColor(camp.food)}`}>{camp.food}d</td>
                <td className={`px-4 py-3 text-right ${dayColor(camp.water)}`}>{camp.water}d</td>
                <td className={`px-4 py-3 text-right ${dayColor(camp.medicine)}`}>{camp.medicine}d</td>
                <td className="px-4 py-3 text-right">
                  <span className={camp.shelterPct > 90 ? 'text-red-400' : camp.shelterPct > 70 ? 'text-amber-400' : 'text-green-400'}>
                    {camp.shelterPct}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold border ${camp.st.bg} ${camp.st.text} ${camp.st.border}`}>
                    {camp.st.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-white text-sm">{camp.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-800/30">
        {campData.map((camp, i) => (
          <div key={camp.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            <button
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
              onClick={() => setExpandedId(expandedId === camp.id ? null : camp.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-8 rounded-full flex-shrink-0`} style={{ background: camp.st.color }} />
                <div className="min-w-0">
                  <div className="font-medium text-white text-sm truncate">{camp.name.replace(' Relief Camp', '')}</div>
                  <div className="text-xs text-slate-500">{camp.village} • {camp.current_population} people</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${camp.st.bg} ${camp.st.text}`}>
                  {camp.st.status.toUpperCase()}
                </span>
                {expandedId === camp.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </button>
            {expandedId === camp.id && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-2 animate-fade-in">
                {[
                  { label: '🍚 Food', value: `${camp.food}d`, days: camp.food },
                  { label: '💧 Water', value: `${camp.water}d`, days: camp.water },
                  { label: '💊 Medicine', value: `${camp.medicine}d`, days: camp.medicine },
                  { label: '🏠 Shelter', value: `${camp.shelterPct}%`, days: camp.shelterPct > 90 ? 0 : 5 },
                ].map(r => (
                  <div key={r.label} className={`${dayBg(r.days)} rounded-xl p-3 text-center`}>
                    <div className="text-xs text-slate-400">{r.label}</div>
                    <div className={`text-lg font-bold ${dayColor(r.days)}`}>{r.value}</div>
                  </div>
                ))}
                <div className="col-span-2 text-center">
                  <span className="text-xs text-slate-500">Priority Score: </span>
                  <span className="text-sm font-mono font-bold text-white">{camp.score}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
