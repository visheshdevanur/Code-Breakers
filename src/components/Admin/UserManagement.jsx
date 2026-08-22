import { useState, useEffect, useCallback } from 'react';
import { Clock, CheckCircle2, XCircle, Ban, Trash2, Users, UserPlus, Filter, Search, Eye, Shield, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { supabase, getAllProfiles, updateProfileStatus, deleteProfile } from '../../lib/supabase';

const TABS = [
  { id: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 'approved', label: 'Active', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'suspended', label: 'Suspended', icon: Ban, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
];

const ROLE_BADGES = {
  ngo: { label: 'NGO', cls: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  coordinator: { label: 'Coordinator', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  driver: { label: 'Driver', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  donor: { label: 'Donor', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  admin: { label: 'Admin', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

export default function UserManagement({ adminUser }) {
  const [profiles, setProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    const data = await getAllProfiles();
    setProfiles(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const handleAction = async (userId, action, reason = null) => {
    setActionLoading(userId);
    try {
      if (action === 'delete') {
        if (!confirm('Permanently delete this user? This cannot be undone.')) { setActionLoading(null); return; }
        await deleteProfile(userId);
      } else {
        await updateProfileStatus(userId, action, reason, adminUser?.id);
      }
      await loadProfiles();
      setExpandedId(null);
      setRejectReason('');
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setActionLoading(null);
  };

  const filtered = profiles.filter(p => {
    if (p.account_status !== activeTab) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (p.full_name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q) || (p.organization_name || '').toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    pending: profiles.filter(p => p.account_status === 'pending').length,
    approved: profiles.filter(p => p.account_status === 'approved').length,
    rejected: profiles.filter(p => p.account_status === 'rejected').length,
    suspended: profiles.filter(p => p.account_status === 'suspended').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-red-400" /> User Management</h2>
          <p className="text-xs text-neutral-500 mt-1">Approve, reject, suspend, or delete user accounts</p>
        </div>
        {counts.pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 anim-pulse-red">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{counts.pending} pending</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id ? `${tab.bg} ${tab.color} border ${tab.border}` : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03] border border-transparent'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {counts[tab.id] > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/10' : 'bg-white/5'}`}>{counts[tab.id]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input !pl-10" placeholder="Search by name, email, organization..." />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="input !w-auto !min-w-[140px]">
          <option value="all">All Roles</option>
          <option value="ngo">NGO</option>
          <option value="coordinator">Coordinator</option>
          <option value="driver">Driver</option>
          <option value="donor">Donor</option>
        </select>
      </div>

      {/* User List */}
      {loading ? (
        <div className="dark-card p-12 text-center">
          <Loader2 className="w-8 h-8 text-neutral-600 animate-spin mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">Loading users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="dark-card p-12 text-center">
          <Users className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">No {activeTab} users found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user, i) => {
            const roleBadge = ROLE_BADGES[user.role] || ROLE_BADGES.donor;
            const isExpanded = expandedId === user.id;
            const isLoading = actionLoading === user.id;

            return (
              <div key={user.id} className="dark-card overflow-hidden anim-up" style={{ animationDelay: `${i * 40}ms` }}>
                {/* Main Row */}
                <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : user.id)}>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-neutral-400">
                      {(user.full_name || user.email || '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{user.full_name || 'No Name'}</div>
                    <div className="text-[11px] text-neutral-600 truncate">{user.email} · {user.phone || 'No phone'}</div>
                  </div>
                  <span className={`badge border ${roleBadge.cls} hidden sm:inline-flex`}>{roleBadge.label}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-600" /> : <ChevronDown className="w-4 h-4 text-neutral-600" />}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 anim-in space-y-3">
                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-white/[0.02] rounded-lg p-2.5">
                        <div className="text-neutral-600 mb-0.5">Role</div>
                        <div className="text-neutral-300 capitalize">{user.role}</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-2.5">
                        <div className="text-neutral-600 mb-0.5">City</div>
                        <div className="text-neutral-300">{user.city || '—'}</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-lg p-2.5">
                        <div className="text-neutral-600 mb-0.5">Joined</div>
                        <div className="text-neutral-300">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
                      </div>
                      {user.organization_name && (
                        <div className="bg-white/[0.02] rounded-lg p-2.5 col-span-2">
                          <div className="text-neutral-600 mb-0.5">Organization</div>
                          <div className="text-neutral-300">{user.organization_name} {user.organization_reg_number ? `(Reg: ${user.organization_reg_number})` : ''}</div>
                        </div>
                      )}
                      {user.vehicle_type && (
                        <div className="bg-white/[0.02] rounded-lg p-2.5">
                          <div className="text-neutral-600 mb-0.5">Vehicle</div>
                          <div className="text-neutral-300">{user.vehicle_type} · {user.vehicle_number}</div>
                        </div>
                      )}
                      {user.driving_license && (
                        <div className="bg-white/[0.02] rounded-lg p-2.5">
                          <div className="text-neutral-600 mb-0.5">DL Number</div>
                          <div className="text-neutral-300">{user.driving_license}</div>
                        </div>
                      )}
                      {user.rejection_reason && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 col-span-full">
                          <div className="text-red-400 mb-0.5 font-medium">Rejection Reason</div>
                          <div className="text-red-300">{user.rejection_reason}</div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeTab === 'pending' && (
                        <>
                          <button onClick={() => handleAction(user.id, 'approved')} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Approve
                          </button>
                          <div className="flex-1 flex gap-2">
                            <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="input !py-2 !text-xs flex-1" placeholder="Rejection reason..." />
                            <button onClick={() => handleAction(user.id, 'rejected', rejectReason)} disabled={isLoading}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors whitespace-nowrap">
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </>
                      )}
                      {activeTab === 'approved' && user.role !== 'admin' && (
                        <>
                          <button onClick={() => handleAction(user.id, 'suspended')} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </button>
                          <button onClick={() => handleAction(user.id, 'delete')} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </>
                      )}
                      {activeTab === 'rejected' && (
                        <button onClick={() => handleAction(user.id, 'approved')} disabled={isLoading}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Now
                        </button>
                      )}
                      {activeTab === 'suspended' && (
                        <>
                          <button onClick={() => handleAction(user.id, 'approved')} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Reinstate
                          </button>
                          <button onClick={() => handleAction(user.id, 'delete')} disabled={isLoading}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
