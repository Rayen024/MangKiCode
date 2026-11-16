import { supabase } from './supabase';

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('signOut error:', err.message);
  }
}
