import { MODUL_BELAJAR } from '../data/modulBelajar.js';

// Adapter AsyncStorage dengan in-memory fallback untuk test environment
let AsyncStorageInstance;
try {
  AsyncStorageInstance = require('@react-native-async-storage/async-storage');
  if (AsyncStorageInstance && AsyncStorageInstance.default) {
    AsyncStorageInstance = AsyncStorageInstance.default;
  }
} catch (_) {
  const store = new Map();
  AsyncStorageInstance = {
    getItem: async key => store.get(key) || null,
    setItem: async (key, value) => {
      store.set(key, value);
      return null;
    },
    removeItem: async key => {
      store.delete(key);
      return null;
    },
  };
}

// Adapter Supabase
let supabaseInstance;
try {
  supabaseInstance = require('./supabase').supabase;
} catch (_) {
  supabaseInstance = {
    auth: {
      getUser: async () => ({ data: { user: null } }),
    },
  };
}

const STORAGE_KEY = '@mangkicode_belajar_progress_v1';

// Status Modul
export const STATUS_MODUL = {
  SELESAI: 'SELESAI',
  SEDANG_DIPELAJARI: 'SEDANG_DIPELAJARI',
  TERSEDIA: 'TERSEDIA',
  TERKUNCI: 'TERKUNCI',
};

// In-memory cache agar UI instan dan reaktif
let memoryProgress = {
  completedLessons: [],
  completedExerciseSets: {},
  lastPosition: {}, // { [moduleId]: { lessonIndex, pageIndex } }
};

/**
 * Mengambil key ID unik untuk sebuah set latihan
 */
export function getExerciseSetKey(moduleId, setelahPelajaran) {
  return `${moduleId}_set_${Number(setelahPelajaran)}`;
}

/**
 * Mengambil daftar set latihan yang ada di dalam sebuah modul
 */
export function getExerciseSetsForModule(module) {
  if (!module || !module.latihan || module.latihan.length === 0) return [];
  const setMap = new Map();
  module.latihan.forEach(soal => {
    const sp = Number(soal.setelahPelajaran || module.pelajaran.length);
    if (!setMap.has(sp)) {
      setMap.set(sp, []);
    }
    setMap.get(sp).push(soal);
  });
  return Array.from(setMap.entries()).map(([setelahPelajaran, soalList]) => ({
    setelahPelajaran: Number(setelahPelajaran),
    key: getExerciseSetKey(module.id, setelahPelajaran),
    soalList,
  }));
}

/**
 * Memeriksa apakah satu pelajaran telah selesai
 */
export function isLessonCompleted(lessonId, progress = memoryProgress) {
  return progress.completedLessons.includes(lessonId);
}

/**
 * Memeriksa apakah hasil set latihan bernilai sempurna (100% benar semua)
 */
export function isExerciseSetPassed(result) {
  if (!result) return false;
  return (
    typeof result.score === 'number' &&
    typeof result.total === 'number' &&
    result.total > 0 &&
    result.score === result.total
  );
}

/**
 * Memeriksa apakah sebuah set latihan tertentu telah selesai DAN benar semua (skor 100%)
 */
export function isExerciseSetCompleted(moduleId, setelahPelajaran, progress = memoryProgress) {
  const key = getExerciseSetKey(moduleId, setelahPelajaran);
  const result = progress.completedExerciseSets?.[key];
  return isExerciseSetPassed(result);
}

/**
 * Memeriksa apakah SEMUA pelajaran dan latihan dalam modul telah selesai DAN benar semua (skor 100%)
 */
export function isModuleCompleted(module, progress = memoryProgress) {
  if (!module || !module.pelajaran) return false;

  // 1. Cek semua pelajaran harus selesai
  const allLessonsDone = module.pelajaran.every(p =>
    progress.completedLessons.includes(p.id)
  );
  if (!allLessonsDone) return false;

  // 2. Jika latihan akhir modul telah selesai 100% benar semua -> Modul Selesai!
  const finalKey = getExerciseSetKey(module.id, module.pelajaran.length);
  const finalResult = progress.completedExerciseSets?.[finalKey];
  if (isExerciseSetPassed(finalResult)) {
    return true;
  }

  // Jika modul tidak memiliki latihan
  const exerciseSets = getExerciseSetsForModule(module);
  if (exerciseSets.length === 0) return true;

  // Cek apakah seluruh set latihan modul sudah 100%
  const allExercisesPassed = exerciseSets.every(set => {
    const result = progress.completedExerciseSets?.[set.key];
    return isExerciseSetPassed(result);
  });

  return allExercisesPassed;
}

/**
 * Mendapatkan status modul sesuai aturan buka kunci:
 * - Modul 1 selalu terbuka.
 * - Modul 2, 3, 4 terbuka berurutan setelah modul sebelumnya SELESAI.
 * - Status: SELESAI | SEDANG_DIPELAJARI | TERSEDIA | TERKUNCI
 */
export function getModuleStatus(module, allModules = MODUL_BELAJAR, progress = memoryProgress) {
  if (!module) return STATUS_MODUL.TERKUNCI;

  // Jika modul sudah selesai sepenuhnya
  if (isModuleCompleted(module, progress)) {
    return STATUS_MODUL.SELESAI;
  }

  // Modul 1 selalu terbuka
  if (module.urutan === 1) {
    const hasStarted =
      module.pelajaran.some(p => progress.completedLessons.includes(p.id)) ||
      (progress.lastPosition && progress.lastPosition[module.id]);

    return hasStarted ? STATUS_MODUL.SEDANG_DIPELAJARI : STATUS_MODUL.TERSEDIA;
  }

  // Modul 2, 3, 4: Periksa apakah modul sebelumnya sudah selesai
  const prevModule = allModules.find(m => m.urutan === module.urutan - 1);
  const isPrevCompleted = prevModule ? isModuleCompleted(prevModule, progress) : false;

  if (!isPrevCompleted) {
    return STATUS_MODUL.TERKUNCI;
  }

  // Jika modul sebelumnya sudah selesai, cek apakah modul ini sudah mulai dipelajari
  const hasStarted =
    module.pelajaran.some(p => progress.completedLessons.includes(p.id)) ||
    (progress.lastPosition && progress.lastPosition[module.id]);

  return hasStarted ? STATUS_MODUL.SEDANG_DIPELAJARI : STATUS_MODUL.TERSEDIA;
}

/**
 * Menghitung persentase progres untuk sebuah modul (0 - 100)
 */
export function calculateModuleProgress(module, progress = memoryProgress) {
  if (!module || !module.pelajaran) return 0;

  if (isModuleCompleted(module, progress)) return 100;

  const totalLessons = module.pelajaran.length;
  const exerciseSets = getExerciseSetsForModule(module);
  const totalExercises = exerciseSets.length;
  const totalItems = totalLessons + totalExercises;

  if (totalItems === 0) return 0;

  const completedLessonsCount = module.pelajaran.filter(p =>
    progress.completedLessons.includes(p.id)
  ).length;

  const completedExercisesCount = exerciseSets.filter(set =>
    !!progress.completedExerciseSets[set.key]
  ).length;

  const completedItems = completedLessonsCount + completedExercisesCount;
  return Math.min(100, Math.round((completedItems / totalItems) * 100));
}

/**
 * Menghitung progres keseluruhan untuk seluruh modul
 */
export function calculateOverallProgress(allModules = MODUL_BELAJAR, progress = memoryProgress) {
  if (!allModules || allModules.length === 0) {
    return { completedModulesCount: 0, totalModules: 0, percentage: 0 };
  }

  const completedModulesCount = allModules.filter(m =>
    isModuleCompleted(m, progress)
  ).length;

  const totalModules = allModules.length;
  const percentage = Math.round((completedModulesCount / totalModules) * 100);

  return {
    completedModulesCount,
    totalModules,
    percentage,
  };
}

/**
 * Memuat progres dari penyimpanan lokal (AsyncStorage)
 */
export async function loadBelajarProgress() {
  try {
    const raw = await AsyncStorageInstance.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryProgress = {
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
        completedExerciseSets: parsed.completedExerciseSets || {},
        lastPosition: parsed.lastPosition || {},
      };

      // Auto-heal: jika latihan akhir modul selesai 100%, pastikan seluruh modul tuntas
      MODUL_BELAJAR.forEach(mod => {
        const finalKey = getExerciseSetKey(mod.id, mod.pelajaran.length);
        const finalRes = memoryProgress.completedExerciseSets[finalKey];
        if (isExerciseSetPassed(finalRes)) {
          mod.pelajaran.forEach(p => {
            if (!memoryProgress.completedLessons.includes(p.id)) {
              memoryProgress.completedLessons.push(p.id);
            }
          });
          const sets = getExerciseSetsForModule(mod);
          sets.forEach(s => {
            if (!isExerciseSetPassed(memoryProgress.completedExerciseSets[s.key])) {
              memoryProgress.completedExerciseSets[s.key] = {
                score: s.soalList.length,
                total: s.soalList.length,
                completedAt: new Date().toISOString(),
              };
            }
          });
        }
      });
    }
  } catch (err) {
    console.warn('Gagal memuat progres belajar dari AsyncStorage:', err);
  }
  return { ...memoryProgress };
}

/**
 * Menyimpan snapshot data progres ke AsyncStorage
 */
async function persistProgress() {
  try {
    await AsyncStorageInstance.setItem(STORAGE_KEY, JSON.stringify(memoryProgress));
  } catch (err) {
    console.warn('Gagal menyimpan progres belajar ke AsyncStorage:', err);
  }
}

/**
 * Menandai satu pelajaran selesai
 */
export async function markLessonCompleted(moduleId, lessonId) {
  if (!memoryProgress.completedLessons.includes(lessonId)) {
    memoryProgress.completedLessons.push(lessonId);
    await persistProgress();

    // Sinkronisasi opsional ke Supabase jika login
    try {
      const { data: { user } } = await supabaseInstance.auth.getUser();
      if (user) {
        console.log(`[Supabase Sync] Pelajaran ${lessonId} selesai untuk user ${user.id}`);
      }
    } catch (_) {}
  }
  return { ...memoryProgress };
}

/**
 * Menandai seluruh pelajaran di sebuah modul selesai
 */
export async function markAllLessonsCompleted(moduleId) {
  const module = MODUL_BELAJAR.find(m => m.id === moduleId);
  if (!module) return { ...memoryProgress };

  let changed = false;
  module.pelajaran.forEach(p => {
    if (!memoryProgress.completedLessons.includes(p.id)) {
      memoryProgress.completedLessons.push(p.id);
      changed = true;
    }
  });

  if (changed) {
    await persistProgress();
  }
  return { ...memoryProgress };
}

/**
 * Menyimpan hasil pengerjaan satu set latihan
 */
export async function saveExerciseResult(moduleId, setelahPelajaran, score, total) {
  const numSetelah = Number(setelahPelajaran);
  const key = getExerciseSetKey(moduleId, numSetelah);

  // Pertahankan skor terbaik yang pernah diraih
  const existing = memoryProgress.completedExerciseSets[key];
  const bestScore = existing ? Math.max(existing.score || 0, score) : score;

  memoryProgress.completedExerciseSets[key] = {
    score: bestScore,
    total,
    completedAt: new Date().toISOString(),
  };

  const module = MODUL_BELAJAR.find(m => m.id === moduleId);
  if (module && numSetelah === module.pelajaran.length && bestScore === total) {
    module.pelajaran.forEach(p => {
      if (!memoryProgress.completedLessons.includes(p.id)) {
        memoryProgress.completedLessons.push(p.id);
      }
    });
    const sets = getExerciseSetsForModule(module);
    sets.forEach(s => {
      if (!isExerciseSetPassed(memoryProgress.completedExerciseSets[s.key])) {
        memoryProgress.completedExerciseSets[s.key] = {
          score: s.soalList.length,
          total: s.soalList.length,
          completedAt: new Date().toISOString(),
        };
      }
    });
  }

  await persistProgress();
  return { ...memoryProgress };
}

/**
 * Menyimpan posisi terakhir yang dibuka (untuk fitur resume)
 */
export async function saveLastPosition(moduleId, lessonIndex, pageIndex = 0) {
  if (!memoryProgress.lastPosition) {
    memoryProgress.lastPosition = {};
  }
  memoryProgress.lastPosition[moduleId] = { lessonIndex, pageIndex };
  await persistProgress();
  return { ...memoryProgress };
}

/**
 * Mengambil posisi terakhir modul
 */
export function getLastPosition(moduleId, progress = memoryProgress) {
  return progress.lastPosition?.[moduleId] || { lessonIndex: 0, pageIndex: 0 };
}

/**
 * Reset progres (digunakan untuk pengujian)
 */
export async function resetBelajarProgress() {
  memoryProgress = {
    completedLessons: [],
    completedExerciseSets: {},
    lastPosition: {},
  };
  await persistProgress();
  return { ...memoryProgress };
}
