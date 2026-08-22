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
      <div className="bg-slate-800 rounded-xl border border-green-500 p-8 text-center animate-slide-in">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Item Registered!</h3>
        <p className="text-slate-300">{form.quantity} {form.category} — AI will match to a camp in need</p>
        <p className="text-slate-400 text-sm mt-2">Track your donation in the "My Donations" tab</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Package className="w-5 h-5 text-purple-400" /> Donate Items</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm(v => ({ ...v, category: e.target.value, subcategory: '' }))} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600">
              <option value="">Select...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Sub-category</label>
            <select value={form.subcategory} onChange={e => setForm(v => ({ ...v, subcategory: e.target.value }))} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600">
              <option value="">Select...</option>
              {(subcategories[form.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Quantity *</label>
            <input type="number" min="1" value={form.quantity} onChange={e => setForm(v => ({ ...v, quantity: e.target.value }))} placeholder="0" className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Condition</label>
            <div className="flex gap-1">
              {['new', 'gently_used', 'used'].map(c => (
                <button key={c} type="button" onClick={() => setForm(v => ({ ...v, condition: c }))} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${form.condition === c ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-700 border-slate-600 text-slate-400'} border`}>
                  {c === 'gently_used' ? 'Gently Used' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm(v => ({ ...v, description: e.target.value }))} placeholder="e.g., Winter jackets, sizes M and L" className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 h-16 resize-none" />
        </div>
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">Handover Method</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setForm(v => ({ ...v, handover: 'drop_off' }))} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium ${form.handover === 'drop_off' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-700 border-slate-600 text-slate-400'} border`}>
              <MapPin className="w-3 h-3" /> Drop at Center
            </button>
            <button type="button" onClick={() => setForm(v => ({ ...v, handover: 'pickup' }))} className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium ${form.handover === 'pickup' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-700 border-slate-600 text-slate-400'} border`}>
              <Clock className="w-3 h-3" /> Request Pickup
            </button>
          </div>
        </div>
        {form.handover === 'drop_off' ? (
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Collection Center</label>
            <select value={form.center} onChange={e => setForm(v => ({ ...v, center: e.target.value }))} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600">
              {seedCollectionCenters.map(c => <option key={c.id} value={c.id}>{c.name} — {c.address} ({c.operating_hours})</option>)}
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <input value={form.address} onChange={e => setForm(v => ({ ...v, address: e.target.value }))} placeholder="Your address for pickup" className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600" />
            <input type="datetime-local" value={form.time} onChange={e => setForm(v => ({ ...v, time: e.target.value }))} className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600" />
          </div>
        )}
        <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Register Item Donation
        </button>
      </div>
    </form>
  );
}
