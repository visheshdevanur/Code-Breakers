import { useState } from 'react';
import { Bot } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import { seedCamps, seedResources, seedRecommendations } from '../../lib/seedData';
import { generateRecommendations } from '../../lib/aiEngine';

export default function RecommendationList({ camps = seedCamps, resources = seedResources }) {
  const [filter, setFilter] = useState('all');
  const recs = seedRecommendations;

  const filtered = filter === 'all' ? recs : filter === 'critical' ? recs.filter(r => r.priority_score > 18) : recs.filter(r => r.priority_score > 12 && r.priority_score <= 18);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
          <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">{recs.length}</span>
        </div>
        <div className="flex gap-1">
          {['all', 'critical', 'warning'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No recommendations for this filter.</div>
        ) : (
          filtered.map(rec => <RecommendationCard key={rec.id} recommendation={rec} />)
        )}
      </div>
    </div>
  );
}
