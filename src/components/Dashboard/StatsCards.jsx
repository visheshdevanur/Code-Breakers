import { Users, AlertTriangle, Truck, Heart } from 'lucide-react';
import { seedCamps, seedResources, seedDonations, seedRecommendations } from '../../lib/seedData';
import { calculatePriorityScore } from '../../lib/aiEngine';

export default function StatsCards({ camps = seedCamps, resources = seedResources }) {
  const totalAffected = camps.reduce((s, c) => s + c.current_population, 0);
  const criticalCount = camps.filter(c => calculatePriorityScore(c, resources) > 18).length;
  const totalDonations = seedDonations.reduce((s, d) => s + d.amount, 0);
  const activeTransfers = seedRecommendations.filter(r => r.status === 'pending').length;

  const cards = [
    { label: 'Total Affected', value: totalAffected.toLocaleString(), icon: Users, color: 'var(--blue)' },
    { label: 'Critical Camps', value: criticalCount, icon: AlertTriangle, color: 'var(--danger)', pulse: criticalCount > 0 },
    { label: 'Pending Transfers', value: activeTransfers, icon: Truck, color: 'var(--amber)' },
    { label: 'Total Donations', value: `₹${(totalDonations / 1000).toFixed(0)}K`, icon: Heart, color: 'var(--green)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((c, i) => (
        <div key={c.label} className="dark-card anim-up" style={{ padding: '24px', animationDelay: `${i * 80}ms` }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
            <div className="icon-box !w-11 !h-11 !rounded-xl" style={{ background: 'var(--accent-soft)' }}>
              <c.icon className="w-5 h-5" style={{ color: c.color }} />
            </div>
            {c.pulse && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute h-full w-full rounded-full opacity-75" style={{ background: 'var(--danger)' }} />
                <span className="relative h-2.5 w-2.5 rounded-full" style={{ background: 'var(--danger)' }} />
              </span>
            )}
          </div>
          <div className="text-[28px] sm:text-[32px] font-black tracking-tight leading-none" style={{ color: 'var(--text-1)' }}>{c.value}</div>
          <div className="text-[12px] font-medium" style={{ color: 'var(--text-3)', marginTop: '8px' }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}
