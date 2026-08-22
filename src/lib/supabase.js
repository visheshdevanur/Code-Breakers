import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfbgyttkaqofituvuzfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYmd5dHRrYXFvZml0dXZ1emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODUzMjYsImV4cCI6MjEwMjk2MTMyNn0.Z7O13G0uvdzyk9Zq57HTZbEX0XncnJEykQPDz1ADvbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Sign Up ───
export async function signUp(email, password, metadata) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: metadata?.role || 'donor', full_name: metadata?.full_name || '' },
    },
  });
  if (error) throw error;

  // If email confirmation is required, user won't be confirmed yet
  if (data.user && !data.user.identities?.length) {
    throw new Error('This email is already registered. Try signing in instead.');
  }

  // Try to insert profile (may fail if profiles table doesn't exist yet)
  if (data.user) {
    try {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        ...metadata,
      });
    } catch (e) {
      console.warn('Profile insert skipped:', e.message);
    }
  }

  return data;
}

// ─── Sign In ───
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please check your email and confirm your account before signing in.');
    }
    throw error;
  }
  return data;
}

// ─── Sign Out ───
export async function signOut() {
  await supabase.auth.signOut();
}

// ─── Get Profile ───
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error || !data) {
      // Fallback: get role from user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.role) {
        return { id: userId, role: user.user_metadata.role, full_name: user.user_metadata.full_name || '', email: user.email };
      }
      return { id: userId, role: 'donor', email: user?.email || '' };
    }
    return data;
  } catch {
    return { id: userId, role: 'donor' };
  }
}

// ─── Get Current User ───
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
