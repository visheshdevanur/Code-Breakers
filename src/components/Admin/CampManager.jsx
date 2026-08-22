import { useState } from 'react';
import { Plus, MapPin, Users, UserCheck, Trash2, Edit, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function CampManager({ camps = [], coordinators = [], onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', village: '', district: 'Ernakulam', latitude: '', longitude: '',
    total_capacity: 500, road_accessibility: 5,
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('camps').insert({
        ...form,
        latitude: +form.latitude,
        longitude: +form.longitude,
        total_capacity: +form.total_capacity,
        road_accessibility: +form.road_accessibility,
        status: 'active',
      });
      if (error) throw error;
      // Also create 4 default resources for the camp
      setShowForm(false);
      setForm({ name: '', village: '', district: 'Ernakulam', latitude: '', longitude: '', total_capacity: 500, road_accessibility: 5 });
      onRefresh?.();
      alert('✅ Camp created successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (campId, coordinatorId) => {
    try {
      const { error } = await supabase.from('camps').update({ coordinator_id: coordinatorId }).eq('id', campId);
      if (error) throw error;
      setAssignModal(null);
      onRefresh?.();
      alert('✅ Coordinator assigned!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteCamp = async (campId) => {
    if (!confirm('Delete this camp?')) return;
    try {
      await supabase.from('resources').delete().eq('camp_id', campId);
      await supabase.from('camps').delete().eq('id', campId);
      onRefresh?.();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const inputCls = "w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:border-blue-500 focus:outline-none text-sm";

  return (
    <div className="space-y-6">
      {/* Create Camp Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" /> Manage Relief Camps
          </h3>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors">
            <Plus className="w-4 h-4" /> Create Camp
          </button>
        </div>

        {/* Create Camp Form */}
        {showForm && (
          <form onSubmit={handleCreateCamp} className="p-4 bg-slate-700/30 border-b border-slate-700 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Camp Name *</label>
                <input value={form.name} onChange={set('name')} required placeholder="e.g., Aluva Relief Camp" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Village/Town *</label>
                <input value={form.village} onChange={set('village')} required placeholder="e.g., Aluva" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Latitude *</label>
                <input type="number" step="any" value={form.latitude} onChange={set('latitude')} required placeholder="10.1077" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Longitude *</label>
                <input type="number" step="any" value={form.longitude} onChange={set('longitude')} required placeholder="76.3516" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Total Capacity</label>
                <input type="number" value={form.total_capacity} onChange={set('total_capacity')} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Road Accessibility (1-10)</label>
                <input type="number" min="1" max="10" value={form.road_accessibility} onChange={set('road_accessibility')} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-1">
                <Save className="w-4 h-4" /> {loading ? 'Creating...' : 'Create Camp'}
              </button>
            </div>
          </form>
        )}

        {/* Camps List */}
        <div className="divide-y divide-slate-700">
          {camps.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No camps created yet. Click "Create Camp" to add one.</div>
          ) : camps.map(camp => {
            const coordinator = coordinators.find(c => c.id === camp.coordinator_id);
            return (
              <div key={camp.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{camp.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      📍 {camp.village} • Capacity: {camp.total_capacity} • Pop: {camp.current_population || 0}
                    </div>
                    <div className="text-xs mt-1">
                      {coordinator ? (
                        <span className="text-green-400">👤 Coordinator: {coordinator.full_name}</span>
                      ) : (
                        <span className="text-amber-400">⚠️ No coordinator assigned</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAssignModal(camp.id)}
                      className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Assign
                    </button>
                    <button onClick={() => handleDeleteCamp(camp.id)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Assign Modal */}
                {assignModal === camp.id && (
                  <div className="mt-3 bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                    <div className="text-xs text-slate-300 font-medium mb-2">Select Coordinator:</div>
                    {coordinators.length === 0 ? (
                      <p className="text-xs text-slate-400">No coordinators registered yet.</p>
                    ) : (
                      <div className="space-y-1">
                        {coordinators.map(c => (
                          <button key={c.id} onClick={() => handleAssign(camp.id, c.id)}
                            className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors">
                            {c.full_name} — {c.phone || c.email}
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setAssignModal(null)} className="mt-2 text-xs text-slate-400 hover:text-white">Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordinators List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" /> Registered Coordinators
          </h3>
        </div>
        <div className="divide-y divide-slate-700">
          {coordinators.length === 0 ? (
            <div className="p-6 text-center text-slate-400">No coordinators registered yet. They can sign up at the public page.</div>
          ) : coordinators.map(c => {
            const assignedCamp = camps.find(camp => camp.coordinator_id === c.id);
            return (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{c.full_name}</div>
                  <div className="text-xs text-slate-400">{c.email} • {c.phone} • {c.city}</div>
                </div>
                <div>
                  {assignedCamp ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Assigned: {assignedCamp.name}</span>
                  ) : (
                    <span className="text-xs bg-slate-700 text-slate-400 px-2 py-1 rounded-full">Unassigned</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
