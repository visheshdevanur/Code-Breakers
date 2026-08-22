import { useState } from 'react';
import { Bot } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import { seedCamps, seedResources, seedRecommendations } from '../../lib/seedData';

export default function RecommendationList({ camps = seedCamps, resources = seedResources }) {
  const [filter, setFilter] = useState('all');
  const recs = seedRecommendations;

  const filtered = filter === 'all' 
    ? recs 
    : filter === 'critical' 
      ? recs.filter(r => r.priority_score > 18) 
      : recs.filter(r => r.priority_score > 12 && r.priority_score <= 18);

  return (
    <div className="dark-card flex flex-col h-full max-h-[600px] overflow-hidden">
      <div className="p-5 border-b border-white/[0.04] flex items-center justify-between sticky top-0 bg-[var(--bg-card)] z-10">
        <div className="flex items-center gap-3">
          <div className="icon-box bg-blue-500/10 text-blue-400 w-10 h-10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
            <p className="text-xs text-neutral-500">{recs.length} active alerts</p>
          </div>
        </div>
        <div className="flex gap-2 bg-white/[0.02] p-1 rounded-12 border border-white/[0.04]">
          {['all', 'critical', 'warning'].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-4 py-1.5 rounded-[10px] text-xs font-medium transition-all ${filter === f ? 'bg-white/[0.08] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5 space-y-4 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-neutral-500 py-12 flex flex-col items-center gap-3">
            <Bot className="w-8 h-8 opacity-20" />
            <p>No recommendations for this filter.</p>
          </div>
        ) : (
          filtered.map((rec, i) => (
            <div key={rec.id} className="anim-up" style={{ animationDelay: `${i * 60}ms` }}>
              <RecommendationCard recommendation={rec} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
