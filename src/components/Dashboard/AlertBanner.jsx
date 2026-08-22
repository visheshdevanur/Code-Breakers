import { AlertTriangle, AlertCircle, Radio } from 'lucide-react';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { detectForgottenZones } from '../../lib/aiEngine';

export default function AlertBanner({ camps = seedCamps, resources = seedResources }) {
  const alerts = [];

  camps.forEach(camp => {
    const res = resources.filter(r => r.camp_id === camp.id);
    const food = res.find(r => r.resource_type === 'food');
    const med = res.find(r => r.resource_type === 'medicine');
    if (food && getDaysRemaining(food) < 0.25) {
      alerts.push({ type: 'critical', icon: AlertTriangle, msg: `🔴 ${camp.village}: Food < 6 hours remaining! ${camp.current_population} people at risk.`, color: 'red' });
    }
    if (med && med.quantity <= 0) {
      alerts.push({ type: 'critical', icon: AlertCircle, msg: `🔴 ${camp.village}: Medicine EXHAUSTED! ${camp.injured_count} injured, ${camp.elderly_count} elderly with zero medicine.`, color: 'red' });
    }
  });

  const forgotten = detectForgottenZones(camps, resources);
  if (forgotten.length > 0) {
    alerts.push({ type: 'warning', icon: Radio, msg: `🚨 ${forgotten.length} forgotten zone(s) detected — camps with zero or near-zero supplies.`, color: 'amber' });
  }

  if (alerts.length === 0) return null;

  const colorClasses = { red: 'bg-red-500/10 border-red-500/50 text-red-300', amber: 'bg-amber-500/10 border-amber-500/50 text-amber-300' };

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colorClasses[alert.color]} ${alert.color === 'red' ? 'animate-pulse-red' : ''}`}>
          <alert.icon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{alert.msg}</span>
        </div>
      ))}
    </div>
  );
}
