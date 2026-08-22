import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { seedCamps, seedResources, getDaysRemaining } from '../../lib/seedData';
import { calculatePriorityScore, getStatus } from '../../lib/aiEngine';

const COLORS = { critical: '#f43f5e', warning: '#fbbf24', watch: '#fbbf24', stable: '#22c55e' };

export default function ResourceCharts({ camps = seedCamps, resources = seedResources }) {
  const barData = camps.map(camp => {
    const food = resources.find(r => r.camp_id === camp.id && r.resource_type === 'food');
    const score = calculatePriorityScore(camp, resources);
    const st = getStatus(score);
    return { name: camp.village.slice(0, 8), days: food ? getDaysRemaining(food) : 0, fill: COLORS[st.status] || '#60a5fa' };
  }).sort((a, b) => a.days - b.days);

  const totalByType = ['food', 'water', 'medicine', 'shelter'].map(type => {
    const res = resources.filter(r => r.resource_type === type);
    const totalQty = res.reduce((s, r) => s + r.quantity, 0);
    const totalNeed = res.reduce((s, r) => s + r.daily_consumption * 3, 0);
    return { name: type.charAt(0).toUpperCase() + type.slice(1), value: Math.round((totalQty / Math.max(totalNeed, 1)) * 100) };
  });
  const PIE_COLORS = ['#60a5fa', '#06b6d4', '#a78bfa', '#fbbf24'];

  const tooltipStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text-1)',
    fontSize: '12px',
    padding: '8px 12px',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="dark-card anim-up" style={{ padding: '24px' }}>
        <h3 className="text-[13px] font-semibold mb-6" style={{ color: 'var(--text-3)' }}>Food Days Remaining by Camp</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
            <XAxis dataKey="name" tick={{ fill: 'var(--text-4)', fontSize: 11 }} angle={-40} textAnchor="end" height={50} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={{ fill: 'var(--text-4)', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="days" radius={[5, 5, 0, 0]} maxBarSize={40}>
              {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="dark-card anim-up d1" style={{ padding: '24px' }}>
        <h3 className="text-[13px] font-semibold mb-6" style={{ color: 'var(--text-3)' }}>3-Day Need Coverage (%)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={totalByType} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
              {totalByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: 'var(--text-3)', paddingTop: '16px' }}
              formatter={(value, entry) => <span style={{ color: 'var(--text-2)', marginLeft: '4px' }}>{value}: {entry.payload.value}%</span>} />
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
