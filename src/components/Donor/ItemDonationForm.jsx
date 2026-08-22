import { useState } from 'react';
import { Package, MapPin, Clock, Send } from 'lucide-react';
import { seedCollectionCenters } from '../../lib/seedData';

const categories = ['Clothes', 'Food Packets', 'Blankets', 'Utensils', 'Medicine', 'Hygiene Kits', 'Baby Supplies'];
const subcategories = {
  Clothes: ["Men's", "Women's", "Children's", 'Mixed'],
  'Food Packets': ['Rice & Provisions', 'Ready-to-eat', 'Dry Snacks', 'Baby Food'],
  Blankets: ['Woolen', 'Cotton', 'Bed Sheets'],
  Utensils: ['Cooking Pots', 'Plates & Cups', 'Mixed Set'],
  Medicine: ['First Aid Kits', 'General Medicine', 'Insulin/Specialized'],
  'Hygiene Kits': ['Soap & Sanitizer', 'Sanitary Pads', 'Mixed'],
  'Baby Supplies': ['Diapers', 'Baby Food', 'Baby Clothes'],
};

export default function ItemDonationForm({ onSubmit }) {
  const [form, setForm] = useState({ category: '', subcategory: '', quantity: '', condition: 'new', description: '', handover: 'drop_off', center: seedCollectionCenters[0]?.id || '', address: '', time: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.quantity) return;
    setSubmitted(true);
    onSubmit?.(form);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (submitted) {
    return (
      <div className="dark-card border border-red-500/30 p-8 text-center anim-up">
        <div className="icon-box mx-auto mb-4 bg-red-500/10 text-red-500">
          <Package className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Item Registered!</h3>
        <p className="text-neutral-400">{form.quantity} {form.category} — AI will match to a camp in need</p>
        <p className="text-neutral-500 text-sm mt-2">Track your donation in the "My Donations" tab</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="dark-card overflow-hidden">
      <div className="p-5 border-b border-white/[0.04]">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-red-500" /> Donate Items
        </h3>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-2">Category *</label>
            <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value, subcategory: '' }))} className="input">
              <option value="">Select...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-2">Sub-category</label>
            <select value={form.subcategory} onChange={e => setForm(v => ({ ...v, subcategory: e.target.value }))} className="input">
              <option value="">Select...</option>
              {(subcategories[form.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-2">Quantity *</label>
            <input type="number" min="1" value={form.quantity} onChange={e => setForm(v => ({ ...v, quantity: e.target.value }))} placeholder="0" className="input" />
          </div>
          <div>
            <label className="text-xs text-neutral-400 font-medium block mb-2">Condition</label>
            <div className="flex gap-2">
              {['new', 'gently_used', 'used'].map(c => (
                <button key={c} type="button" onClick={() => setForm(v => ({ ...v, condition: c }))} className={`flex-1 py-2 rounded-[14px] text-xs font-medium transition-all border ${form.condition === c ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'btn-dark'}`}>
                  {c === 'gently_used' ? 'Gently Used' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-2">Description</label>
          <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} placeholder="e.g., Winter jackets, sizes M and L" className="input h-20 resize-none py-3" />
        </div>
        <div>
          <label className="text-xs text-neutral-400 font-medium block mb-2">Handover Method</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setForm(v => ({ ...v, handover: 'drop_off' }))} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-medium border ${form.handover === 'drop_off' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'btn-dark'}`}>
              <MapPin className="w-4 h-4" /> Drop at Center
            </button>
            <button type="button" onClick={() => setForm(v => ({ ...v, handover: 'pickup' }))} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-sm font-medium border ${form.handover === 'pickup' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'btn-dark'}`}>
              <Clock className="w-4 h-4" /> Request Pickup
            </button>
          </div>
        </div>
        {form.handover === 'drop_off' ? (
          <div className="anim-up">
            <label className="text-xs text-neutral-400 font-medium block mb-2">Collection Center</label>
            <select value={form.center} onChange={e => setForm(v => ({ ...v, center: e.target.value }))} className="input">
              {seedCollectionCenters.map(c => <option key={c.id} value={c.id}>{c.name} — {c.address} ({c.operating_hours})</option>)}
            </select>
          </div>
        ) : (
          <div className="space-y-3 anim-up">
            <input value={form.address} onChange={e => setForm(v => ({ ...v, address: e.target.value }))} placeholder="Your address for pickup" className="input" />
            <input type="datetime-local" value={form.time} onChange={e => setForm(v => ({ ...v, time: e.target.value }))} className="input" />
          </div>
        )}
        <button type="submit" className="btn-red w-full py-3 flex items-center justify-center gap-2 mt-4">
          <Send className="w-4 h-4" /> Register Item Donation
        </button>
      </div>
    </form>
  );
}
