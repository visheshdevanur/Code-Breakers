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

  const getDayColor = (d) => d < 1 ? 'text-red-400' : d < 2 ? 'text-amber-400' : d < 3 ? 'text-yellow-400' : 'text-green-400';
  
  const getStatusClass = (status) => {
    if (status === 'critical') return 'status-critical';
    if (status === 'warning') return 'status-warning';
    return 'status-stable';
  };

  return (
    <div className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04]">
        <h3 className="text-lg font-medium text-white">Resource Overview</h3>
        <p className="text-sm text-neutral-500 mt-1">All camps sorted by priority score</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-neutral-500 border-b border-white/[0.04] bg-white/[0.02]">
              <th className="px-5 py-4 font-medium uppercase tracking-wider">Camp</th>
              <th className="px-4 py-4 text-right font-medium uppercase tracking-wider">Pop.</th>
              <th className="px-4 py-4 text-right font-medium uppercase tracking-wider">Food</th>
              <th className="px-4 py-4 text-right font-medium uppercase tracking-wider">Water</th>
              <th className="px-4 py-4 text-right font-medium uppercase tracking-wider">Med</th>
              <th className="px-4 py-4 text-right font-medium uppercase tracking-wider">Shelter</th>
              <th className="px-4 py-4 text-center font-medium uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-right font-medium uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {campData.map((camp, i) => (
              <tr key={camp.id}
                className="hover:bg-white/[0.02] cursor-pointer transition-colors anim-up"
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => onCampClick?.(camp)}>
                <td className="px-5 py-4">
                  <div className="font-medium text-white">{camp.name.replace(' Relief Camp', '')}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{camp.village}</div>
                </td>
                <td className="px-4 py-4 text-right text-neutral-400">{camp.current_population}</td>
                <td className={`px-4 py-4 text-right font-medium ${getDayColor(camp.food)}`}>{camp.food}d</td>
                <td className={`px-4 py-4 text-right font-medium ${getDayColor(camp.water)}`}>{camp.water}d</td>
                <td className={`px-4 py-4 text-right font-medium ${getDayColor(camp.medicine)}`}>{camp.medicine}d</td>
                <td className="px-4 py-4 text-right">
                  <span className={camp.shelterPct > 90 ? 'text-red-400' : camp.shelterPct > 70 ? 'text-amber-400' : 'text-green-400'}>
                    {camp.shelterPct}%
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`badge ${getStatusClass(camp.st.status)}`}>
                    {camp.st.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-mono font-medium text-white">{camp.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/[0.04]">
        {campData.map((camp, i) => (
          <div key={camp.id} className="anim-up" style={{ animationDelay: `${i * 40}ms` }}>
            <button
              className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedId(expandedId === camp.id ? null : camp.id)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{camp.name.replace(' Relief Camp', '')}</div>
                  <div className="text-xs text-neutral-500 mt-1">{camp.village} • {camp.current_population} people</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`badge ${getStatusClass(camp.st.status)}`}>
                  {camp.st.status.toUpperCase()}
                </span>
                {expandedId === camp.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
              </div>
            </button>
            {expandedId === camp.id && (
              <div className="px-5 pb-5 grid grid-cols-2 gap-3 anim-in">
                {[
                  { label: 'Food', value: `${camp.food}d`, days: camp.food },
                  { label: 'Water', value: `${camp.water}d`, days: camp.water },
                  { label: 'Medicine', value: `${camp.medicine}d`, days: camp.medicine },
                  { label: 'Shelter', value: `${camp.shelterPct}%`, days: camp.shelterPct > 90 ? 0 : 5 },
                ].map(r => (
                  <div key={r.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <div className="text-xs text-neutral-500">{r.label}</div>
                    <div className={`text-lg font-medium mt-1 ${getDayColor(r.days)}`}>{r.value}</div>
                  </div>
                ))}
                <div className="col-span-2 text-center mt-2">
                  <span className="text-xs text-neutral-500">Priority Score: </span>
                  <span className="text-sm font-mono font-medium text-white">{camp.score}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
