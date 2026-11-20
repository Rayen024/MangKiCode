const isJest = typeof jest !== 'undefined' || typeof describe === 'function';

const describeFn = isJest ? describe : require('node:test').describe;
const itFn = isJest ? it : require('node:test').it;
const assert = isJest
  ? {
      strictEqual: (a, b) => expect(a).toBe(b),
    }
  : require('node:assert');

const { MODUL_BELAJAR } = require('../src/data/modulBelajar.js');
const {
  STATUS_MODUL,
  getExerciseSetsForModule,
  getModuleStatus,
  isModuleCompleted,
  calculateModuleProgress,
  calculateOverallProgress,
  getExerciseSetKey,
} = require('../src/services/belajarProgressService.js');

describeFn('Belajar Progress & Unlock Logic Tests', () => {
  let mockProgress;

  const initProgress = () => {
    mockProgress = {
      completedLessons: [],
      completedExerciseSets: {},
      lastPosition: {},
    };
  };

  if (isJest) {
    beforeEach(() => {
      initProgress();
    });
  }

  itFn('Modul 1 selalu TERSEDIA di awal dan Modul 2-4 TERKUNCI', () => {
    initProgress();
    const status1 = getModuleStatus(MODUL_BELAJAR[0], MODUL_BELAJAR, mockProgress);
    const status2 = getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress);
    const status3 = getModuleStatus(MODUL_BELAJAR[2], MODUL_BELAJAR, mockProgress);
    const status4 = getModuleStatus(MODUL_BELAJAR[3], MODUL_BELAJAR, mockProgress);

    assert.strictEqual(status1, STATUS_MODUL.TERSEDIA);
    assert.strictEqual(status2, STATUS_MODUL.TERKUNCI);
    assert.strictEqual(status3, STATUS_MODUL.TERKUNCI);
    assert.strictEqual(status4, STATUS_MODUL.TERKUNCI);
  });

  itFn('Modul 1 menjadi SEDANG_DIPELAJARI jika sudah ada pelajaran yang selesai atau diakses', () => {
    initProgress();
    mockProgress.completedLessons.push('p-1-1');
    const status1 = getModuleStatus(MODUL_BELAJAR[0], MODUL_BELAJAR, mockProgress);
    assert.strictEqual(status1, STATUS_MODUL.SEDANG_DIPELAJARI);
  });

  itFn('Modul 1 TIDAK selesai jika hanya pelajaran selesai tetapi latihannya belum selesai', () => {
    initProgress();
    MODUL_BELAJAR[0].pelajaran.forEach(p => {
      mockProgress.completedLessons.push(p.id);
    });

    assert.strictEqual(isModuleCompleted(MODUL_BELAJAR[0], mockProgress), false);
    const status2 = getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress);
    assert.strictEqual(status2, STATUS_MODUL.TERKUNCI);
  });

  itFn('Modul 2 TERBUKA (TERSEDIA) setelah semua 9 pelajaran dan 3 set latihan Modul 1 selesai', () => {
    initProgress();
    MODUL_BELAJAR[0].pelajaran.forEach(p => {
      mockProgress.completedLessons.push(p.id);
    });

    const sets = getExerciseSetsForModule(MODUL_BELAJAR[0]);
    assert.strictEqual(sets.length, 3);
    sets.forEach(set => {
      mockProgress.completedExerciseSets[set.key] = { score: 3, total: 3 };
    });

    assert.strictEqual(isModuleCompleted(MODUL_BELAJAR[0], mockProgress), true);
    assert.strictEqual(
      getModuleStatus(MODUL_BELAJAR[0], MODUL_BELAJAR, mockProgress),
      STATUS_MODUL.SELESAI
    );

    assert.strictEqual(
      getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress),
      STATUS_MODUL.TERSEDIA
    );

    assert.strictEqual(
      getModuleStatus(MODUL_BELAJAR[2], MODUL_BELAJAR, mockProgress),
      STATUS_MODUL.TERKUNCI
    );
  });

  itFn('Perhitungan persentase progres modul berjalan akurat', () => {
    initProgress();
    assert.strictEqual(calculateModuleProgress(MODUL_BELAJAR[0], mockProgress), 0);

    mockProgress.completedLessons.push('p-1-1', 'p-1-2', 'p-1-3');
    assert.strictEqual(calculateModuleProgress(MODUL_BELAJAR[0], mockProgress), 25);

    const key1 = getExerciseSetKey('modul-1', 3);
    mockProgress.completedExerciseSets[key1] = { score: 3, total: 3 };
    assert.strictEqual(calculateModuleProgress(MODUL_BELAJAR[0], mockProgress), 33);
  });

  itFn('Perhitungan progres keseluruhan seluruh modul', () => {
    initProgress();
    const initial = calculateOverallProgress(MODUL_BELAJAR, mockProgress);
    assert.strictEqual(initial.completedModulesCount, 0);
    assert.strictEqual(initial.totalModules, 4);
    assert.strictEqual(initial.percentage, 0);

    MODUL_BELAJAR[0].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));
    getExerciseSetsForModule(MODUL_BELAJAR[0]).forEach(s => {
      mockProgress.completedExerciseSets[s.key] = { score: 3, total: 3 };
    });

    const afterM1 = calculateOverallProgress(MODUL_BELAJAR, mockProgress);
    assert.strictEqual(afterM1.completedModulesCount, 1);
    assert.strictEqual(afterM1.totalModules, 4);
    assert.strictEqual(afterM1.percentage, 25);
  });

  itFn('Buka kunci berurutan hingga Modul 4 selesai', () => {
    initProgress();
    MODUL_BELAJAR[0].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));
    getExerciseSetsForModule(MODUL_BELAJAR[0]).forEach(s => {
      mockProgress.completedExerciseSets[s.key] = { score: 3, total: 3 };
    });

    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERSEDIA);
    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[2], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERKUNCI);

    MODUL_BELAJAR[1].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));
    getExerciseSetsForModule(MODUL_BELAJAR[1]).forEach(s => {
      mockProgress.completedExerciseSets[s.key] = { score: 5, total: 5 };
    });

    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress), STATUS_MODUL.SELESAI);
    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[2], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERSEDIA);
    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[3], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERKUNCI);

    MODUL_BELAJAR[2].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));
    getExerciseSetsForModule(MODUL_BELAJAR[2]).forEach(s => {
      mockProgress.completedExerciseSets[s.key] = { score: 4, total: 4 };
    });

    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[2], MODUL_BELAJAR, mockProgress), STATUS_MODUL.SELESAI);
    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[3], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERSEDIA);

    MODUL_BELAJAR[3].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));
    getExerciseSetsForModule(MODUL_BELAJAR[3]).forEach(s => {
      mockProgress.completedExerciseSets[s.key] = { score: 4, total: 4 };
    });

    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[3], MODUL_BELAJAR, mockProgress), STATUS_MODUL.SELESAI);
    const finalProgress = calculateOverallProgress(MODUL_BELAJAR, mockProgress);
    assert.strictEqual(finalProgress.completedModulesCount, 4);
    assert.strictEqual(finalProgress.percentage, 100);
  });

  itFn('Fitur resume menyimpan dan mengambil posisi terakhir dengan benar', () => {
    initProgress();
    mockProgress.lastPosition['modul-1'] = { lessonIndex: 4, pageIndex: 1 };
    const pos = mockProgress.lastPosition['modul-1'];
    assert.strictEqual(pos.lessonIndex, 4);
    assert.strictEqual(pos.pageIndex, 1);
  });

  itFn('Modul TIDAK selesai dan modul berikutnya tetap TERKUNCI jika nilai latihan akhir modul belum sempurna (score < total)', () => {
    initProgress();
    MODUL_BELAJAR[0].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));

    // Latihan akhir belum 100% (misal 3 dari 4)
    const finalKey = getExerciseSetKey('modul-1', 9);
    mockProgress.completedExerciseSets[finalKey] = { score: 3, total: 4 }; // TIDAK SEMPURNA

    assert.strictEqual(isModuleCompleted(MODUL_BELAJAR[0], mockProgress), false);
    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERKUNCI);
  });

  itFn('Modul baru selesai dan modul berikutnya TERBUKA jika seluruh pelajaran tuntas DAN latihan modul 100% benar', () => {
    initProgress();
    MODUL_BELAJAR[0].pelajaran.forEach(p => mockProgress.completedLessons.push(p.id));

    const finalKey = getExerciseSetKey('modul-1', 9);
    mockProgress.completedExerciseSets[finalKey] = { score: 4, total: 4 }; // 100% SEMPURNA

    assert.strictEqual(isModuleCompleted(MODUL_BELAJAR[0], mockProgress), true);
    assert.strictEqual(getModuleStatus(MODUL_BELAJAR[1], MODUL_BELAJAR, mockProgress), STATUS_MODUL.TERSEDIA);
  });
});
