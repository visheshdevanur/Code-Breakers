import { Users, AlertTriangle, Truck, Heart } from 'lucide-react';
import { seedCamps, seedResources, seedDonations, seedRecommendations } from '../../lib/seedData';
import { calculatePriorityScore } from '../../lib/aiEngine';

export default function StatsCards({ camps = seedCamps, resources = seedResources }) {
  const totalAffected = camps.reduce((s, c) => s + c.current_population, 0);
  const criticalCount = camps.filter(c => calculatePriorityScore(c, resources) > 18).length;
  const totalDonations = seedDonations.reduce((s, d) => s + d.amount, 0);
  const activeTransfers = seedRecommendations.filter(r => r.status === 'pending').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Affected */}
      <div className="bg-blue-500/[0.08] border border-blue-500/20 rounded-2xl p-4 sm:p-5 anim-slide">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
          <Users className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">{totalAffected.toLocaleString()}</div>
        <div className="text-xs text-slate-500 mt-1">Total Affected</div>
      </div>

      {/* Critical Camps */}
      <div className={`bg-red-500/[0.08] border border-red-500/20 rounded-2xl p-4 sm:p-5 anim-slide delay-1 ${criticalCount > 0 ? 'anim-pulse' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          {criticalCount > 0 && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">{criticalCount}</div>
        <div className="text-xs text-slate-500 mt-1">Critical Camps</div>
      </div>

      {/* Pending Transfers */}
      <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-4 sm:p-5 anim-slide delay-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
          <Truck className="w-5 h-5 text-amber-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">{activeTransfers}</div>
        <div className="text-xs text-slate-500 mt-1">Pending Transfers</div>
      </div>

      {/* Total Donations */}
      <div className="bg-emerald-500/[0.08] border border-emerald-500/20 rounded-2xl p-4 sm:p-5 anim-slide delay-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
          <Heart className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-white">₹{(totalDonations / 1000).toFixed(0)}K</div>
        <div className="text-xs text-slate-500 mt-1">Total Donations</div>
      </div>
    </div>
  );
}
