import { useState } from 'react';
import { Users, Baby, UserCheck, Heart, Stethoscope, Apple, Droplets, Pill, Home, AlertCircle, Send, FileText } from 'lucide-react';
import { seedCamps } from '../../lib/seedData';

export default function SituationReportForm({ camps = seedCamps, onSubmit }) {
  const [selectedCamp, setSelectedCamp] = useState(camps[0]?.id || '');
  const [form, setForm] = useState({ total_people: '', children: '', elderly: '', pregnant: '', injured: '', food_kits: '', water_liters: '', medicine_packs: '', shelter_beds: '', urgent_need: '' });
  const [errors, setErrors] = useState({});

  const fields = [
    { key: 'total_people', label: 'Total People', icon: Users, required: true },
    { key: 'children', label: 'Children (<12)', icon: Baby, required: true },
    { key: 'elderly', label: 'Elderly (>60)', icon: UserCheck, required: true },
    { key: 'pregnant', label: 'Pregnant', icon: Heart, required: true },
    { key: 'injured', label: 'Injured/Sick', icon: Stethoscope, required: true },
    { key: 'food_kits', label: 'Food Kits', icon: Apple, required: true },
    { key: 'water_liters', label: 'Water (L)', icon: Droplets, required: true },
    { key: 'medicine_packs', label: 'Meds (Packs)', icon: Pill, required: true },
    { key: 'shelter_beds', label: 'Shelter Beds', icon: Home, required: true },
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
    <form onSubmit={handleSubmit} className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="icon-box bg-white/[0.04] text-neutral-300 w-10 h-10">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Situation Report</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Submit current metrics for AI needs calculation</p>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-6">
        <div>
          <label className="text-sm font-medium text-neutral-300 block mb-2">Target Camp</label>
          <div className="relative">
            <select 
              value={selectedCamp} 
              onChange={e => setSelectedCamp(e.target.value)} 
              className="input w-full appearance-none pr-10"
            >
              {camps.map(c => <option key={c.id} value={c.id} className="bg-[#111318]">{c.name}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 border-b border-white/[0.04] pb-2">Population & Demographics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {fields.slice(0, 5).map((f, i) => (
              <div key={f.key} className="anim-up" style={{ animationDelay: `${i * 30}ms` }}>
                <label className="text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5 text-neutral-500" /> {f.label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={form[f.key]}
                  onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                  className={`input w-full ${errors[f.key] ? '!border-red-500/50 focus:!border-red-500' : ''}`}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 border-b border-white/[0.04] pb-2">Current Resources</h4>
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(5).map((f, i) => (
              <div key={f.key} className="anim-up" style={{ animationDelay: `${(i + 5) * 30}ms` }}>
                <label className="text-xs font-medium text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <f.icon className="w-3.5 h-3.5 text-neutral-500" /> {f.label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={form[f.key]}
                  onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                  className={`input w-full ${errors[f.key] ? '!border-red-500/50 focus:!border-red-500' : ''}`}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Special Requirements (Optional)
          </label>
          <textarea
            value={form.urgent_need}
            onChange={e => setForm(v => ({ ...v, urgent_need: e.target.value }))}
            className="input w-full h-24 resize-none"
            placeholder="Describe any critical situations, specific medical needs, or infrastructure damage..."
          />
        </div>

        <button type="submit" className="btn-red w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium">
          <Send className="w-4 h-4" /> Run AI Needs Analysis
        </button>
      </div>
    </form>
  );
}
