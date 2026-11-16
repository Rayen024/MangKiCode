import { supabase } from './supabase';

/**
 * Mengambil profil user saat ini dari Supabase profiles table
 */
export async function getUserProfile(userId) {
  try {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, xp, streak, last_active_date')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('getUserProfile error:', err.message);
    return null;
  }
}

/**
 * Mengambil daftar lesson_id yang telah diselesaikan oleh user
 */
export async function getUserCompletedLessons(userId) {
  try {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed_at')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('getUserCompletedLessons error:', err.message);
    return [];
  }
}

/**
 * Menghitung jumlah bintang yang terkumpul
 * Berdasarkan lesson yang selesai & quiz yang lulus
 */
export async function getUserAdventureStats(userId) {
  try {
    if (!userId) {
      return { totalStars: 0, completedLessonsCount: 0 };
    }

    const { data: progress } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId);

    const completedLessonsCount = progress?.length || 0;
    // 1 bintang per pelajaran selesai
    const totalStars = completedLessonsCount;

    return { totalStars, completedLessonsCount };
  } catch (err) {
    return { totalStars: 0, completedLessonsCount: 0 };
  }
}
