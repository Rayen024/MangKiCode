import { supabase } from '../services/supabase';

let levelStarsStore = {};

export function getLevelStarsMap() {
  return { ...levelStarsStore };
}

export function getTotalStars() {
  return Object.values(levelStarsStore).reduce((sum, s) => sum + s, 0);
}

export function getUnlockedMaxLevel(totalLevels = 6) {
  const completedIds = Object.keys(levelStarsStore).map(Number);
  if (completedIds.length === 0) return 1;
  const highestCompleted = Math.max(...completedIds);
  return Math.min(highestCompleted + 1, totalLevels);
}

export async function syncGameProgressFromSupabase() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return getLevelStarsMap();

    const { data, error } = await supabase
      .from('user_game_progress')
      .select('level_id, stars')
      .eq('user_id', user.id);

    if (error) {
      console.warn('Gagal mengambil progres dari Supabase:', error.message);
      return getLevelStarsMap();
    }

    const updatedMap = {};
    (data || []).forEach((row) => {
      updatedMap[row.level_id] = row.stars;
    });

    levelStarsStore = updatedMap;
    return getLevelStarsMap();
  } catch (err) {
    console.warn('Error syncGameProgressFromSupabase:', err.message);
    return getLevelStarsMap();
  }
}

export async function saveLevelStars(levelId, starsEarned) {
  const prevStars = levelStarsStore[levelId] || 0;
  const bestStars = Math.max(prevStars, starsEarned);

  levelStarsStore[levelId] = bestStars;

  if (starsEarned <= prevStars) return;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from('user_game_progress').upsert(
      {
        user_id: user.id,
        level_id: levelId,
        stars: bestStars,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,level_id' }
    );

    if (error) {
      console.warn('Gagal menyimpan bintang ke Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Error saveLevelStars:', err.message);
  }
}