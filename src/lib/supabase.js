import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gfbgyttkaqofituvuzfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYmd5dHRrYXFvZml0dXZ1emZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODUzMjYsImV4cCI6MjEwMjk2MTMyNn0.Z7O13G0uvdzyk9Zq57HTZbEX0XncnJEykQPDz1ADvbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signUp(email, password, metadata) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email,
      ...metadata,
    });
    if (profileError) console.error('Profile creation error:', profileError);
  }
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) return null;
  return data;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
