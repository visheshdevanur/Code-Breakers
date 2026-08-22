import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfbgyttkaqofituvuzfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYmd5dHRrYXFvZml0dXZ1emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODUzMjYsImV4cCI6MjEwMjk2MTMyNn0.Z7O13G0uvdzyk9Zq57HTZbEX0XncnJEykQPDz1ADvbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Roles that require admin approval
const GATED_ROLES = ['ngo', 'coordinator', 'driver'];

// ─── Sign Up ───
export async function signUp(email, password, metadata = {}) {
  const role = metadata.role || 'donor';
  const accountStatus = GATED_ROLES.includes(role) ? 'pending' : 'approved';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: metadata.full_name || '', account_status: accountStatus },
    },
  });
  if (error) throw error;

  if (data.user && !data.user.identities?.length) {
    throw new Error('This email is already registered. Try signing in.');
  }

  // Insert profile
  if (data.user) {
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        account_status: accountStatus,
        ...metadata,
      });
    } catch (e) {
      console.warn('Profile insert skipped:', e.message);
    }
  }

  return { ...data, accountStatus };
}

// ─── Sign In ───
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please check your email and confirm your account first.');
    }
    throw error;
  }
  return data;
}

// ─── Sign Out ───
export async function signOut() {
  await supabase.auth.signOut();
}

// ─── Get Profile (with metadata fallback) ───
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) {
      const { data: { user } } = await supabase.auth.getUser();
      const meta = user?.user_metadata || {};
      return {
        id: userId,
        role: meta.role || 'donor',
        full_name: meta.full_name || '',
        email: user?.email || '',
        account_status: meta.account_status || (GATED_ROLES.includes(meta.role) ? 'pending' : 'approved'),
      };
    }
    return data;
  } catch {
    return { id: userId, role: 'donor', account_status: 'approved' };
  }
}

// ─── Get Current User ───
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── Admin: Get all profiles ───
export async function getAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

// ─── Admin: Update profile status ───
export async function updateProfileStatus(userId, status, rejectionReason = null, adminId = null) {
  const updates = {
    account_status: status,
    reviewed_at: new Date().toISOString(),
  };
  if (rejectionReason) updates.rejection_reason = rejectionReason;
  if (adminId) updates.reviewed_by = adminId;

  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;
}

// ─── Admin: Delete profile ───
export async function deleteProfile(userId) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) throw error;
}
