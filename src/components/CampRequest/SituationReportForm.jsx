import { useState } from 'react';
import { Users, Baby, UserCheck, Heart, Stethoscope, Apple, Droplets, Pill, Home, AlertCircle, Send } from 'lucide-react';
import { seedCamps } from '../../lib/seedData';

export default function SituationReportForm({ camps = seedCamps, onSubmit }) {
  const [selectedCamp, setSelectedCamp] = useState(camps[0]?.id || '');
  const [form, setForm] = useState({ total_people: '', children: '', elderly: '', pregnant: '', injured: '', food_kits: '', water_liters: '', medicine_packs: '', shelter_beds: '', urgent_need: '' });
  const [errors, setErrors] = useState({});

  const fields = [
    { key: 'total_people', label: 'Total People in Camp', icon: Users, required: true },
    { key: 'children', label: 'Children (under 12)', icon: Baby, required: true },
    { key: 'elderly', label: 'Elderly (above 60)', icon: UserCheck, required: true },
    { key: 'pregnant', label: 'Pregnant Women', icon: Heart, required: true },
    { key: 'injured', label: 'Injured / Sick', icon: Stethoscope, required: true },
    { key: 'food_kits', label: 'Food Kits Remaining', icon: Apple, required: true },
    { key: 'water_liters', label: 'Water (Liters) Remaining', icon: Droplets, required: true },
    { key: 'medicine_packs', label: 'Medicine Packs Remaining', icon: Pill, required: true },
    { key: 'shelter_beds', label: 'Shelter Beds Available', icon: Home, required: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    fields.forEach(f => { if (f.required && (form[f.key] === '' || +form[f.key] < 0)) errs[f.key] = 'Required'; });
    if (+form.total_people <= 0) errs.total_people = 'Must be > 0';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    const camp = camps.find(c => c.id === selectedCamp);
    onSubmit?.({
      camp_id: selectedCamp,
      camp_name: camp?.name,
      current_population: +form.total_people,
      children_count: +form.children,
      elderly_count: +form.elderly,
      pregnant_count: +form.pregnant,
      injured_count: +form.injured,
      food: +form.food_kits,
      water: +form.water_liters,
      medicine: +form.medicine_packs,
      shelter: +form.shelter_beds,
      urgent_need: form.urgent_need,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white">📋 Situation Report</h3>
        <p className="text-xs text-slate-400 mt-1">Enter current camp status. AI will auto-calculate needs.</p>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Select Camp</label>
          <select value={selectedCamp} onChange={e => setSelectedCamp(e.target.value)} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600">
            {camps.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
                <f.icon className="w-3 h-3" /> {f.label}
              </label>
              <input
                type="number"
                min="0"
                value={form[f.key]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                className={`w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border ${errors[f.key] ? 'border-red-500' : 'border-slate-600'}`}
                placeholder="0"
              />
              {errors[f.key] && <span className="text-xs text-red-400">{errors[f.key]}</span>}
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Any Urgent Need? (optional)
          </label>
          <textarea
            value={form.urgent_need}
            onChange={e => setForm(v => ({ ...v, urgent_need: e.target.value }))}
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 h-20 resize-none"
            placeholder="e.g., Need insulin for 3 diabetic patients"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Submit & Analyze with AI
        </button>
      </div>
    </form>
  );
}
