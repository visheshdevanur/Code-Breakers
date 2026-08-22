import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfbgyttkaqofituvuzfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYmd5dHRrYXFvZml0dXZ1emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODUzMjYsImV4cCI6MjEwMjk2MTMyNn0.Z7O13G0uvdzyk9Zq57HTZbEX0XncnJEykQPDz1ADvbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_GATED = ['ngo', 'coordinator', 'driver'];
const NGO_GATED = ['coordinator', 'driver'];

// ─── Sign Up ───
export async function signUp(email, password, metadata = {}) {
  const role = metadata.role || 'donor';
  const accountStatus = ADMIN_GATED.includes(role) ? 'pending' : 'approved';

  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { role, full_name: metadata.full_name || '', account_status: accountStatus } },
  });
  if (error) throw error;
  if (data.user && !data.user.identities?.length) throw new Error('Email already registered. Try signing in.');

  if (data.user) {
    try {
      await supabase.from('profiles').insert({
        id: data.user.id, email, account_status: accountStatus,
        ngo_approved: !NGO_GATED.includes(role),
        ...metadata,
      });
    } catch (e) { console.warn('Profile insert skipped:', e.message); }
  }
  return { ...data, accountStatus };
}

// ─── Sign In ───
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Email not confirmed')) throw new Error('Please confirm your email first.');
    throw error;
  }
  return data;
}

export async function signOut() { await supabase.auth.signOut(); }

// ─── Get Profile (with fallback) ───
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) {
      const { data: { user } } = await supabase.auth.getUser();
      const m = user?.user_metadata || {};
      return {
        id: userId, role: m.role || 'donor', full_name: m.full_name || '', email: user?.email || '',
        account_status: m.account_status || (ADMIN_GATED.includes(m.role) ? 'pending' : 'approved'),
        ngo_approved: !NGO_GATED.includes(m.role),
      };
    }
    return data;
  } catch { return { id: userId, role: 'donor', account_status: 'approved', ngo_approved: true }; }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── Check if user can access dashboard ───
export function canAccessDashboard(profile) {
  if (!profile) return false;
  const role = profile.role;
  if (role === 'admin' || role === 'donor') return true;
  if (profile.account_status !== 'approved') return false;
  if (NGO_GATED.includes(role) && !profile.ngo_approved) return false;
  return true;
}

// ─── Get user's block reason ───
export function getBlockReason(profile) {
  if (!profile) return 'unknown';
  if (profile.account_status === 'pending') return 'admin_pending';
  if (profile.account_status === 'rejected') return 'admin_rejected';
  if (profile.account_status === 'suspended') return 'suspended';
  if (profile.account_status === 'approved' && NGO_GATED.includes(profile.role) && !profile.ngo_approved) return 'ngo_pending';
  return 'approved';
}

// ─── Admin functions ───
export async function getAllProfiles() {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function updateProfileStatus(userId, status, rejectionReason = null, adminId = null) {
  const updates = { account_status: status, reviewed_at: new Date().toISOString() };
  if (rejectionReason) updates.rejection_reason = rejectionReason;
  if (adminId) updates.reviewed_by = adminId;
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;
}

export async function deleteProfile(userId) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) throw error;
}

// ─── NGO approval functions ───
export async function ngoApproveUser(userId, ngoId) {
  const { error } = await supabase.from('profiles').update({
    ngo_approved: true, ngo_reviewed_by: ngoId, ngo_reviewed_at: new Date().toISOString(),
  }).eq('id', userId);
  if (error) throw error;
}

export async function ngoRejectUser(userId, reason, ngoId) {
  const { error } = await supabase.from('profiles').update({
    ngo_approved: false, ngo_rejection_reason: reason, ngo_reviewed_by: ngoId, ngo_reviewed_at: new Date().toISOString(),
  }).eq('id', userId);
  if (error) throw error;
}
