import { Users, AlertTriangle, Truck, Heart } from 'lucide-react';
import { seedCamps, seedResources, seedDonations, seedRecommendations } from '../../lib/seedData';
import { calculatePriorityScore } from '../../lib/aiEngine';

export default function StatsCards({ camps = seedCamps, resources = seedResources, donations = seedDonations, recommendations = seedRecommendations }) {
  const totalAffected = camps.reduce((s, c) => s + c.current_population, 0);
  const criticalCount = camps.filter(c => calculatePriorityScore(c, resources) > 18).length;
  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
  const activeTransfers = recommendations.filter(r => r.status === 'pending').length;

  const cards = [
    { label: 'Total Affected', value: totalAffected.toLocaleString(), icon: Users, color: 'blue', gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    { label: 'Critical Camps', value: criticalCount, icon: AlertTriangle, color: 'red', gradient: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20', iconBg: 'bg-red-500/10', iconColor: 'text-red-400', pulse: criticalCount > 0 },
    { label: 'Pending Transfers', value: activeTransfers, icon: Truck, color: 'amber', gradient: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    { label: 'Total Donations', value: `₹${(totalDonations / 1000).toFixed(0)}K`, icon: Heart, color: 'green', gradient: 'from-green-500/10 to-green-600/5', border: 'border-green-500/20', iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <div key={card.label}
          className={`bg-gradient-to-br ${card.gradient} rounded-2xl border ${card.border} p-4 sm:p-5 card-hover animate-slide-up ${card.pulse ? 'animate-pulse-glow' : ''}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
            </div>
            {card.pulse && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            )}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">{card.value}</div>
          <div className="text-[11px] sm:text-xs text-slate-400 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
