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

  const dayColor = d => d < 1 ? 'var(--danger)' : d < 2 ? 'var(--amber)' : 'var(--green)';
  const statusCls = s => s === 'critical' ? 'status-critical' : s === 'warning' ? 'status-warning' : 'status-stable';

  return (
    <div className="dark-card overflow-hidden">
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-1)' }}>Resource Overview</h3>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-3)' }}>All camps sorted by priority score</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
              {['Camp', 'Pop.', 'Food', 'Water', 'Med', 'Shelter', 'Status', 'Score'].map((h, i) => (
                <th key={h} className={`text-[11px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-left' : i === 6 ? 'text-center' : 'text-right'}`}
                  style={{ padding: '14px 20px', color: 'var(--text-4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campData.map((camp, i) => (
              <tr key={camp.id} className="anim-up cursor-pointer"
                style={{ animationDelay: `${i * 40}ms`, borderBottom: '1px solid var(--border)' }}
                onClick={() => onCampClick?.(camp)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 20px' }}>
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{camp.name.replace(' Relief Camp', '')}</div>
                  <div className="text-[11px] mt-1" style={{ color: 'var(--text-4)' }}>{camp.village}</div>
                </td>
                <td className="text-right text-[13px]" style={{ padding: '16px 20px', color: 'var(--text-2)' }}>{camp.current_population}</td>
                <td className="text-right text-[13px] font-semibold" style={{ padding: '16px 20px', color: dayColor(camp.food) }}>{camp.food}d</td>
                <td className="text-right text-[13px] font-semibold" style={{ padding: '16px 20px', color: dayColor(camp.water) }}>{camp.water}d</td>
                <td className="text-right text-[13px] font-semibold" style={{ padding: '16px 20px', color: dayColor(camp.medicine) }}>{camp.medicine}d</td>
                <td className="text-right text-[13px]" style={{ padding: '16px 20px' }}>
                  <span style={{ color: camp.shelterPct > 90 ? 'var(--danger)' : camp.shelterPct > 70 ? 'var(--amber)' : 'var(--green)' }}>{camp.shelterPct}%</span>
                </td>
                <td className="text-center" style={{ padding: '16px 20px' }}>
                  <span className={`badge ${statusCls(camp.st.status)}`}>{camp.st.label}</span>
                </td>
                <td className="text-right text-[13px] font-mono font-bold" style={{ padding: '16px 20px', color: 'var(--text-1)' }}>{camp.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {campData.map((camp, i) => (
          <div key={camp.id} className="anim-up" style={{ animationDelay: `${i * 40}ms`, borderBottom: '1px solid var(--border)' }}>
            <button className="w-full flex items-center justify-between text-left" style={{ padding: '16px 20px' }}
              onClick={() => setExpandedId(expandedId === camp.id ? null : camp.id)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div>
                <div className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{camp.name.replace(' Relief Camp', '')}</div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-4)' }}>{camp.village} · {camp.current_population} people</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${statusCls(camp.st.status)}`}>{camp.st.label}</span>
                {expandedId === camp.id ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-4)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-4)' }} />}
              </div>
            </button>
            {expandedId === camp.id && (
              <div className="grid grid-cols-2 gap-3 anim-in" style={{ padding: '0 20px 20px' }}>
                {[
                  { label: 'Food', value: `${camp.food}d`, d: camp.food },
                  { label: 'Water', value: `${camp.water}d`, d: camp.water },
                  { label: 'Medicine', value: `${camp.medicine}d`, d: camp.medicine },
                  { label: 'Shelter', value: `${camp.shelterPct}%`, d: camp.shelterPct > 90 ? 0 : 5 },
                ].map(r => (
                  <div key={r.label} className="text-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px' }}>
                    <div className="text-[11px] font-medium" style={{ color: 'var(--text-4)' }}>{r.label}</div>
                    <div className="text-[18px] font-bold mt-1" style={{ color: dayColor(r.d) }}>{r.value}</div>
                  </div>
                ))}
                <div className="col-span-2 text-center mt-1">
                  <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>Priority Score: </span>
                  <span className="text-[13px] font-mono font-bold" style={{ color: 'var(--text-1)' }}>{camp.score}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
