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

  return (
    <div className="space-y-6">
      {/* Create Camp Section */}
      <div className="dark-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" /> Manage Relief Camps
          </h3>
          <button onClick={() => setShowForm(!showForm)}
            className="btn-red flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Camp
          </button>
        </div>

        {/* Create Camp Form */}
        {showForm && (
          <form onSubmit={handleCreateCamp} className="p-4 bg-white/[0.02] border-b border-white/[0.04] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Camp Name *</label>
                <input value={form.name} onChange={set('name')} required placeholder="e.g., Aluva Relief Camp" className="input" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Village/Town *</label>
                <input value={form.village} onChange={set('village')} required placeholder="e.g., Aluva" className="input" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Latitude *</label>
                <input type="number" step="any" value={form.latitude} onChange={set('latitude')} required placeholder="10.1077" className="input" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Longitude *</label>
                <input type="number" step="any" value={form.longitude} onChange={set('longitude')} required placeholder="76.3516" className="input" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Total Capacity</label>
                <input type="number" value={form.total_capacity} onChange={set('total_capacity')} className="input" />
              </div>
              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Road Accessibility (1-10)</label>
                <input type="number" min="1" max="10" value={form.road_accessibility} onChange={set('road_accessibility')} className="input" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-dark">Cancel</button>
              <button type="submit" disabled={loading} className="btn-red flex items-center gap-2">
                <Save className="w-4 h-4" /> {loading ? 'Creating...' : 'Create Camp'}
              </button>
            </div>
          </form>
        )}

        {/* Camps List */}
        <div className="divide-y divide-white/[0.04]">
          {camps.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">No camps created yet. Click "Create Camp" to add one.</div>
          ) : camps.map(camp => {
            const coordinator = coordinators.find(c => c.id === camp.coordinator_id);
            return (
              <div key={camp.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{camp.name}</div>
                    <div className="text-sm text-neutral-400 mt-1">
                      📍 {camp.village} • Capacity: {camp.total_capacity} • Pop: {camp.current_population || 0}
                    </div>
                    <div className="text-sm mt-2">
                      {coordinator ? (
                        <span className="text-green-500 flex items-center gap-1"><UserCheck className="w-4 h-4"/> Coordinator: {coordinator.full_name}</span>
                      ) : (
                        <span className="text-amber-500">⚠️ No coordinator assigned</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAssignModal(camp.id)}
                      className="btn-dark flex items-center gap-2">
                      <UserCheck className="w-4 h-4" /> Assign
                    </button>
                    <button onClick={() => handleDeleteCamp(camp.id)}
                      className="btn-dark text-red-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Assign Modal */}
                {assignModal === camp.id && (
                  <div className="mt-4 bg-white/[0.02] rounded-16 p-4 border border-white/[0.04]">
                    <div className="text-sm text-neutral-300 font-medium mb-3">Select Coordinator:</div>
                    {coordinators.length === 0 ? (
                      <p className="text-sm text-neutral-500">No coordinators registered yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {coordinators.map(c => (
                          <button key={c.id} onClick={() => handleAssign(camp.id, c.id)}
                            className="w-full text-left px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] rounded-12 text-sm text-white transition-colors border border-white/[0.04]">
                            {c.full_name} — {c.phone || c.email}
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setAssignModal(null)} className="mt-3 text-sm text-neutral-400 hover:text-white">Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordinators List */}
      <div className="dark-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.04]">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Registered Coordinators
          </h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {coordinators.length === 0 ? (
            <div className="p-6 text-center text-neutral-500">No coordinators registered yet. They can sign up at the public page.</div>
          ) : coordinators.map(c => {
            const assignedCamp = camps.find(camp => camp.coordinator_id === c.id);
            return (
              <div key={c.id} className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{c.full_name}</div>
                  <div className="text-sm text-neutral-400 mt-1">{c.email} • {c.phone} • {c.city}</div>
                </div>
                <div>
                  {assignedCamp ? (
                    <span className="badge bg-green-500/10 text-green-500 border border-green-500/20">Assigned: {assignedCamp.name}</span>
                  ) : (
                    <span className="badge bg-white/[0.04] text-neutral-400 border border-white/[0.04]">Unassigned</span>
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
