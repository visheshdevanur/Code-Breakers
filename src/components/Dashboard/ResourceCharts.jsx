import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';

const COLORS = { critical: '#dc2626', warning: '#f59e0b', watch: '#eab308', stable: '#16a34a' };

export default function ResourceCharts({ camps = seedCamps, resources = seedResources }) {
  const barData = camps.map(camp => {
    const food = resources.find(r => r.camp_id === camp.id && r.resource_type === 'food');
    const score = calculatePriorityScore(camp, resources);
    const st = getStatus(score);
    return { name: camp.village, days: food ? getDaysRemaining(food) : 0, fill: COLORS[st.status] };
  }).sort((a, b) => a.days - b.days);

  const totalByType = ['food', 'water', 'medicine', 'shelter'].map(type => {
    const res = resources.filter(r => r.resource_type === type);
    const totalQty = res.reduce((s, r) => s + r.quantity, 0);
    const totalNeed = res.reduce((s, r) => s + r.daily_consumption * 3, 0);
    return { name: type.charAt(0).toUpperCase() + type.slice(1), value: Math.round((totalQty / Math.max(totalNeed, 1)) * 100) };
  });
  const PIE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-3">🍚 Food Days Remaining by Camp</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#e2e8f0' }} />
            <Bar dataKey="days" radius={[4, 4, 0, 0]}>
              {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-3">📊 3-Day Need Coverage (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={totalByType} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
              {totalByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: 8, color: '#e2e8f0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
