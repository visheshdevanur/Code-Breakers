import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, XCircle, Users, Search, ChevronDown, ChevronUp, Loader2, Truck, ClipboardList } from 'lucide-react';
import { getAllProfiles, ngoApproveUser, ngoRejectUser } from '../../lib/supabase';

export default function NGOApprovalPanel({ ngoUser }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [tab, setTab] = useState('pending');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllProfiles();
    setProfiles(data.filter(p => ['coordinator', 'driver'].includes(p.role) && p.account_status === 'approved'));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const pending = profiles.filter(p => !p.ngo_approved);
  const approved = profiles.filter(p => p.ngo_approved);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try { await ngoApproveUser(userId, ngoUser?.id); await load(); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  const handleReject = async (userId) => {
    setActionLoading(userId);
    try { await ngoRejectUser(userId, rejectReason, ngoUser?.id); await load(); setRejectReason(''); } catch (e) { alert(e.message); }
    setActionLoading(null);
  };

  const list = tab === 'pending' ? pending : approved;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" /> Verify Field Workers
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">Approve coordinators & drivers after admin approval</p>
        </div>
        {pending.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-amber-400">{pending.length} awaiting</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-500 hover:bg-white/[0.03] border border-transparent'}`}>
          <Clock className="w-4 h-4 inline mr-1.5" />Pending ({pending.length})
        </button>
        <button onClick={() => setTab('approved')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-neutral-500 hover:bg-white/[0.03] border border-transparent'}`}>
          <CheckCircle2 className="w-4 h-4 inline mr-1.5" />Verified ({approved.length})
        </button>
      </div>

      {loading ? (
        <div className="dark-card p-12 text-center"><Loader2 className="w-8 h-8 text-neutral-600 animate-spin mx-auto" /></div>
      ) : list.length === 0 ? (
        <div className="dark-card p-12 text-center">
          <Users className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">{tab === 'pending' ? 'No workers awaiting verification.' : 'No verified workers yet.'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((u, i) => (
            <div key={u.id} className="dark-card overflow-hidden anim-up" style={{ animationDelay: `${i * 40}ms` }}>
              <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}>
                <div className={`icon-box !w-10 !h-10 !rounded-xl ${u.role === 'driver' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                  {u.role === 'driver' ? <Truck className="w-5 h-5 text-amber-400" /> : <ClipboardList className="w-5 h-5 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{u.full_name || 'No Name'}</div>
                  <div className="text-[11px] text-neutral-600">{u.email} · {u.role} · {u.city || 'Unknown'}</div>
                </div>
                <span className={`badge border ${u.ngo_approved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {u.ngo_approved ? 'Verified' : 'Pending'}
                </span>
                {expandedId === u.id ? <ChevronUp className="w-4 h-4 text-neutral-600" /> : <ChevronDown className="w-4 h-4 text-neutral-600" />}
              </button>

              {expandedId === u.id && (
                <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-3 anim-in">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {u.vehicle_type && <div className="bg-white/[0.02] rounded-lg p-2.5"><div className="text-neutral-600">Vehicle</div><div className="text-neutral-300">{u.vehicle_type} · {u.vehicle_number}</div></div>}
                    {u.driving_license && <div className="bg-white/[0.02] rounded-lg p-2.5"><div className="text-neutral-600">License</div><div className="text-neutral-300">{u.driving_license}</div></div>}
                    {u.phone && <div className="bg-white/[0.02] rounded-lg p-2.5"><div className="text-neutral-600">Phone</div><div className="text-neutral-300">{u.phone}</div></div>}
                    {u.carrying_capacity && <div className="bg-white/[0.02] rounded-lg p-2.5"><div className="text-neutral-600">Capacity</div><div className="text-neutral-300">{u.carrying_capacity} kg</div></div>}
                  </div>
                  {tab === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(u.id)} disabled={actionLoading === u.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                        {actionLoading === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Verify
                      </button>
                      <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="input !py-2 !text-xs flex-1" placeholder="Reason..." />
                      <button onClick={() => handleReject(u.id)} disabled={actionLoading === u.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
