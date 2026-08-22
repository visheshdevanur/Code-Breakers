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
      alerts.push({ type: 'critical', icon: AlertTriangle, msg: `${camp.village}: Food < 6 hours remaining! ${camp.current_population} people at risk.`, statusClass: 'status-critical' });
    }
    if (med && med.quantity <= 0) {
      alerts.push({ type: 'critical', icon: AlertCircle, msg: `${camp.village}: Medicine EXHAUSTED! ${camp.injured_count} injured, ${camp.elderly_count} elderly with zero medicine.`, statusClass: 'status-critical' });
    }
  });

  const forgotten = detectForgottenZones(camps, resources);
  if (forgotten.length > 0) {
    alerts.push({ type: 'warning', icon: Radio, msg: `${forgotten.length} forgotten zone(s) detected — camps with zero or near-zero supplies.`, statusClass: 'status-warning' });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <div key={i} className={`dark-card p-4 flex items-center gap-4 ${alert.statusClass} anim-up`} style={{ animationDelay: `${i * 60}ms` }}>
          <div className="icon-box bg-white/[0.04] text-neutral-400">
            <alert.icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-white">{alert.msg}</span>
        </div>
      ))}
    </div>
  );
}
