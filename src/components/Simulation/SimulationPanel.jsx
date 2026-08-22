import { useState } from 'react';
import { Zap, CloudRain, Mountain, Wind } from 'lucide-react';
import { seedCamps, seedResources } from '../../lib/seedData';

const scenarios = [
  { name: 'Flood Surge', icon: CloudRain, desc: 'Heavy flooding — 3 camps critical', color: 'blue', changes: { 'camp-2': { food: 50, water: 80 }, 'camp-6': { food: 20, water: 30, medicine: 0 }, 'camp-9': { food: 100, water: 100 } } },
  { name: 'Earthquake', icon: Mountain, desc: 'Earthquake — all camps lose 60% stock', color: 'amber', changes: {} },
  { name: 'Cyclone', icon: Wind, desc: 'Cyclone — road access drops, 2 camps isolated', color: 'purple', changes: {} },
];

export default function SimulationPanel({ camps = seedCamps, resources = seedResources, onUpdate }) {
  const [selectedCamp, setSelectedCamp] = useState(camps[0]?.id || '');
  const [values, setValues] = useState({});
  const camp = camps.find(c => c.id === selectedCamp);
  const campRes = resources.filter(r => r.camp_id === selectedCamp);

  const handleCampChange = (id) => {
    setSelectedCamp(id);
    const res = resources.filter(r => r.camp_id === id);
    setValues({
      population: camps.find(c => c.id === id)?.current_population || 0,
      food: res.find(r => r.resource_type === 'food')?.quantity || 0,
      water: res.find(r => r.resource_type === 'water')?.quantity || 0,
      medicine: res.find(r => r.resource_type === 'medicine')?.quantity || 0,
      shelter: res.find(r => r.resource_type === 'shelter')?.quantity || 0,
    });
  };

  const handleApply = () => {
    onUpdate?.(selectedCamp, values);
  };

  const applyScenario = (scenario) => {
    if (scenario.name === 'Earthquake') {
      const allChanges = {};
      camps.forEach(c => {
        const res = resources.filter(r => r.camp_id === c.id);
        allChanges[c.id] = {
          food: Math.round((res.find(r => r.resource_type === 'food')?.quantity || 0) * 0.4),
          water: Math.round((res.find(r => r.resource_type === 'water')?.quantity || 0) * 0.4),
          medicine: Math.round((res.find(r => r.resource_type === 'medicine')?.quantity || 0) * 0.3),
        };
      });
      Object.entries(allChanges).forEach(([campId, changes]) => onUpdate?.(campId, changes));
    } else if (scenario.name === 'Cyclone') {
      onUpdate?.('camp-2', { food: 100, water: 150 });
      onUpdate?.('camp-6', { food: 50, water: 50, medicine: 0 });
    } else {
      Object.entries(scenario.changes).forEach(([campId, changes]) => onUpdate?.(campId, changes));
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-bold text-white">🎮 Simulation Panel</h3>
        <span className="text-xs text-slate-400 ml-2">Judges: Change data and see AI react instantly</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Scenario Buttons */}
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">Quick Scenarios</label>
          <div className="flex gap-2 flex-wrap">
            {scenarios.map(s => (
              <button key={s.name} onClick={() => applyScenario(s)} className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
                <s.icon className="w-4 h-4" />
                <span className="text-white font-medium">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Edit */}
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">Manual Edit</label>
          <select value={selectedCamp} onChange={e => handleCampChange(e.target.value)} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 mb-3">
            {camps.map(c => <option key={c.id} value={c.id}>{c.name} ({c.village})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'population', label: 'Population', icon: '👥' },
              { key: 'food', label: 'Food Kits', icon: '🍚' },
              { key: 'water', label: 'Water (L)', icon: '💧' },
              { key: 'medicine', label: 'Medicine', icon: '💊' },
              { key: 'shelter', label: 'Shelter Beds', icon: '🏠' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-slate-400 mb-1 block">{f.icon} {f.label}</label>
                <input
                  type="number"
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: +e.target.value }))}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
                />
              </div>
            ))}
          </div>
          <button onClick={handleApply} className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-colors text-sm">
            ⚡ Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
