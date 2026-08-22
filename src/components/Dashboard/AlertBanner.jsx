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
      alerts.push({ type: 'critical', icon: AlertTriangle, msg: `${camp.village}: Food < 6 hours remaining! ${camp.current_population} people at risk.` });
    }
    if (med && med.quantity <= 0) {
      alerts.push({ type: 'critical', icon: AlertCircle, msg: `${camp.village}: Medicine EXHAUSTED! ${camp.injured_count} injured, ${camp.elderly_count} elderly with zero medicine.` });
    }
  });

  const forgotten = detectForgottenZones(camps, resources);
  if (forgotten.length > 0) {
    alerts.push({ type: 'warning', icon: Radio, msg: `${forgotten.length} forgotten zone(s) detected — camps with zero or near-zero supplies.` });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <div key={i} className="dark-card flex items-center gap-4 anim-up"
          style={{ padding: '16px 20px', animationDelay: `${i * 60}ms`, borderColor: alert.type === 'critical' ? 'rgba(244,63,94,0.15)' : 'rgba(251,191,36,0.15)' }}>
          <div className="icon-box !w-10 !h-10 !rounded-lg flex-shrink-0"
            style={{ background: alert.type === 'critical' ? 'var(--danger-soft)' : 'var(--amber-soft)' }}>
            <alert.icon className="w-5 h-5" style={{ color: alert.type === 'critical' ? 'var(--danger)' : 'var(--amber)' }} />
          </div>
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{alert.msg}</span>
        </div>
      ))}
    </div>
  );
}
