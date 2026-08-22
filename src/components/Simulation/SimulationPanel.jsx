import { useState } from 'react';
import { Zap, CloudRain, Mountain, Wind, Users, Package, Droplets, Pill, Home } from 'lucide-react';
import { seedCamps, seedResources } from '../../lib/seedData';

const scenarios = [
  { name: 'Flood Surge', icon: CloudRain, desc: 'Heavy flooding — 3 camps critical', changes: { 'camp-2': { food: 50, water: 80 }, 'camp-6': { food: 20, water: 30, medicine: 0 }, 'camp-9': { food: 100, water: 100 } } },
  { name: 'Earthquake', icon: Mountain, desc: 'Earthquake — all camps lose 60% stock', changes: {} },
  { name: 'Cyclone', icon: Wind, desc: 'Cyclone — road access drops, 2 camps isolated', changes: {} },
];

export default function SimulationPanel({ camps = seedCamps, resources = seedResources, onUpdate }) {
  const [selectedCamp, setSelectedCamp] = useState(camps[0]?.id || '');
  const [values, setValues] = useState({});
  
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
    <div className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="icon-box w-10 h-10 bg-red-500/10 text-red-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Simulation Panel</h3>
            <span className="text-xs text-neutral-400">Judges: Change data and see AI react instantly</span>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-5">
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-3">Quick Scenarios</label>
          <div className="flex gap-2 flex-wrap">
            {scenarios.map(s => (
              <button key={s.name} onClick={() => applyScenario(s)} className="btn-dark flex items-center gap-2 px-4 py-2 text-sm">
                <s.icon className="w-4 h-4 text-neutral-400" />
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.04]">
          <label className="text-xs text-neutral-400 font-medium block mb-3">Manual Edit</label>
          <select value={selectedCamp} onChange={e => handleCampChange(e.target.value)} className="input mb-4">
            {camps.map(c => <option key={c.id} value={c.id}>{c.name} ({c.village})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'population', label: 'Population', icon: Users },
              { key: 'food', label: 'Food Kits', icon: Package },
              { key: 'water', label: 'Water (L)', icon: Droplets },
              { key: 'medicine', label: 'Medicine', icon: Pill },
              { key: 'shelter', label: 'Shelter Beds', icon: Home },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-neutral-400 mb-2 flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5" /> {f.label}
                </label>
                <input
                  type="number"
                  value={values[f.key] || ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: +e.target.value }))}
                  className="input"
                />
              </div>
            ))}
          </div>
          <button onClick={handleApply} className="btn-red w-full mt-5 py-3 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
