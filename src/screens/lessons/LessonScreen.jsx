import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MODUL_BELAJAR } from '../../data/modulBelajar';
import {
  markLessonCompleted,
  markAllLessonsCompleted,
  saveLastPosition,
  getExerciseSetsForModule,
  isExerciseSetCompleted,
  isExerciseSetPassed,
  isModuleCompleted,
  loadBelajarProgress,
} from '../../services/belajarProgressService';
import ContentBlockRenderer from '../../components/lesson/ContentBlockRenderer';
import { IconChevronLeft, IconChevronRight } from '../../components/ui/Icons';

export default function LessonScreen({ route, navigation }) {
  const { moduleId, initialLessonIndex = 0, initialPageIndex = 0 } = route.params || {};

  const module = MODUL_BELAJAR.find(m => m.id === moduleId) || MODUL_BELAJAR[0];
  const [lessonIndex, setLessonIndex] = useState(initialLessonIndex);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [progress, setProgress] = useState(null);
  const scrollViewRef = useRef(null);

  const totalLessons = module.pelajaran.length;
  const currentLesson = module.pelajaran[lessonIndex] || module.pelajaran[0];

  // Mengelompokkan blok menjadi halaman-halaman kecil
  const pagesMap = new Map();
  (currentLesson.blok || []).forEach(b => {
    const pNum = b.halaman || 1;
    if (!pagesMap.has(pNum)) pagesMap.set(pNum, []);
    pagesMap.get(pNum).push(b);
  });
  const pages = Array.from(pagesMap.values());
  const totalPages = Math.max(1, pages.length);
  const currentPageBlocks = pages[pageIndex] || pages[0] || [];

  const lessonProgressPct = Math.round(((lessonIndex + 1) / totalLessons) * 100);

  // Cek apakah ada latihan setelah pelajaran ini
  const exerciseSets = getExerciseSetsForModule(module);
  const currentSet = exerciseSets.find(
    s => s.setelahPelajaran === currentLesson.urutan
  );
  const hasExerciseNow = !!currentSet;

  const refreshProgress = useCallback(async () => {
    try {
      const p = await loadBelajarProgress();
      setProgress(p);
    } catch (_) {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
    }, [refreshProgress])
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
    saveLastPosition(module.id, lessonIndex, pageIndex);
    refreshProgress();
  }, [lessonIndex, pageIndex, module.id, refreshProgress]);

  const currentSetResult = currentSet && progress
    ? progress.completedExerciseSets?.[currentSet.key]
    : null;
  const isSetCompleted = isExerciseSetPassed(currentSetResult);

  const isCurrentModuleCompleted = progress
    ? isModuleCompleted(module, progress)
    : false;

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    } else if (lessonIndex > 0) {
      const prevLesson = module.pelajaran[lessonIndex - 1];
      const prevPagesMap = new Map();
      (prevLesson.blok || []).forEach(b => {
        const pNum = b.halaman || 1;
        if (!prevPagesMap.has(pNum)) prevPagesMap.set(pNum, []);
        prevPagesMap.get(pNum).push(b);
      });
      const prevTotalPages = Math.max(1, prevPagesMap.size);
      setLessonIndex(lessonIndex - 1);
      setPageIndex(prevTotalPages - 1);
    }
  };

  const handleNext = async () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      await markLessonCompleted(module.id, currentLesson.id);

      if (lessonIndex < totalLessons - 1) {
        setLessonIndex(lessonIndex + 1);
        setPageIndex(0);
      } else {
        // Halaman terakhir dari modul
        await markAllLessonsCompleted(module.id);
        const latestProgress = await loadBelajarProgress();
        setProgress(latestProgress);
        const done = isModuleCompleted(module, latestProgress);

        if (done) {
          const nextMod = MODUL_BELAJAR.find(m => m.urutan === module.urutan + 1);
          Alert.alert(
            'Modul Selesai! 🎉',
            `Selamat! Kamu telah menyelesaikan modul "${module.judul}" dengan seluruh latihan tuntas 100%.${nextMod ? ` Modul ${nextMod.urutan} (${nextMod.judul}) sekarang sudah terbuka!` : ''}`,
            [
              ...(nextMod
                ? [
                    {
                      text: `Buka Modul ${nextMod.urutan} 🚀`,
                      onPress: () => {
                        navigation.replace('LessonDetail', {
                          moduleId: nextMod.id,
                          initialLessonIndex: 0,
                          initialPageIndex: 0,
                        });
                      },
                    },
                  ]
                : []),
              {
                text: 'Ke Daftar Modul',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        } else {
          // Latihan akhir modul belum tuntas 100%
          const finalKey = getExerciseSetKey(module.id, module.pelajaran.length);
          const finalRes = latestProgress.completedExerciseSets?.[finalKey];
          const hasAttempted = !!finalRes;
          const scoreDetail = hasAttempted
            ? `\nSkor saat ini: ${finalRes.score}/${finalRes.total} (belum sempurna).`
            : '';

          Alert.alert(
            'Latihan Belum Sempurna 🎯',
            `Untuk membuka modul berikutnya, latihan soal modul harus diselesaikan dengan benar semua (100%).${scoreDetail}\n\nAyo selesaikan sekarang!`,
            [
              {
                text: 'Kerjakan Latihan 🎯',
                onPress: handleOpenQuiz,
              },
              { text: 'Nanti Dulu', onPress: () => navigation.goBack(), style: 'cancel' },
            ]
          );
        }
      }
    }
  };

  const handleOpenQuiz = () => {
    if (!currentSet) return;
    navigation.navigate('Quiz', {
      moduleId: module.id,
      setelahPelajaran: currentSet.setelahPelajaran,
    });
  };

  const isFirstPage = lessonIndex === 0 && pageIndex === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FAF9F5" barStyle="dark-content" />

      {/* ── 1. HEADER DETAIL MODUL ─────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Kembali ke daftar modul"
          >
            <IconChevronLeft size={22} color="#1E5E3A" />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <View style={styles.headerBadgeRow}>
              {currentLesson.kelompok ? (
                <View style={styles.groupBadge}>
                  <Text style={styles.groupBadgeText}>{currentLesson.kelompok.toUpperCase()}</Text>
                </View>
              ) : null}
              <Text style={styles.progressCounterText}>
                {lessonIndex + 1} / {totalLessons}
              </Text>
            </View>
            <Text style={styles.headerModuleTitle} numberOfLines={1}>
              {module.judul}
            </Text>
          </View>
        </View>

        {/* Progress Bar Bersegmen 3D */}
        <View style={styles.segmentedProgressRow}>
          {module.pelajaran.map((p, idx) => {
            const isCompleted = idx < lessonIndex;
            const isCurrent = idx === lessonIndex;
            return (
              <View
                key={p.id}
                style={[
                  styles.progressSegment,
                  isCompleted && styles.segmentCompleted,
                  isCurrent && styles.segmentCurrent,
                ]}
              />
            );
          })}
        </View>

        {/* Halaman Dots Indicator */}
        {totalPages > 1 && (
          <View style={styles.pageDotsRow}>
            <View style={styles.pageDotsGroup}>
              {Array.from({ length: totalPages }).map((_, pIdx) => (
                <View
                  key={pIdx}
                  style={[
                    styles.pageDot,
                    pIdx === pageIndex && styles.pageDotActive,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.pageIndicatorText}>
              Bagian {pageIndex + 1} dari {totalPages}
            </Text>
          </View>
        )}
      </View>

      {/* ── 2. AREA KONTEN MATERI (SCROLLABLE) ────────────────────── */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Kartu Judul Pelajaran */}
        <View style={styles.lessonHeaderCard}>
          <View style={styles.lessonPillTag}>
            <Text style={styles.lessonPillTagText}>
              PELAJARAN {lessonIndex + 1} DARI {totalLessons}
            </Text>
          </View>
          <Text style={styles.lessonHeading}>{currentLesson.judul}</Text>
        </View>

        {/* Blok Konten */}
        <View style={styles.blocksContainer}>
          {currentPageBlocks.map((block, bIdx) => (
            <ContentBlockRenderer key={`block-${bIdx}`} block={block} />
          ))}
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* ── 3. STICKY FOOTER BAWAH (3D BEVEL BUTTONS) ──────────────── */}
      <View style={styles.stickyFooter}>
        {/* Tombol Coba Latihan */}
        {hasExerciseNow && (
          <TouchableOpacity
            style={[
              styles.btnExercise,
              isSetCompleted && styles.btnExerciseCompleted,
              currentSetResult && !isSetCompleted && styles.btnExerciseRetry,
            ]}
            activeOpacity={0.85}
            onPress={handleOpenQuiz}
          >
            <Text
              style={[
                styles.btnExerciseText,
                isSetCompleted && styles.btnExerciseCompletedText,
                currentSetResult && !isSetCompleted && styles.btnExerciseRetryText,
              ]}
            >
              {isSetCompleted
                ? '✓ Latihan Selesai 100% (Ulangi)'
                : currentSetResult
                ? `🎯 Ulangi Latihan (${currentSetResult.score}/${currentSetResult.total} Benar - Perlu 100%)`
                : '🎯 Coba Latihan Soal Sekarang'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Baris Tombol Sebelumnya & Berikutnya */}
        <View style={styles.navButtonsRow}>
          <TouchableOpacity
            style={[
              styles.btnNavSecondary,
              isFirstPage && styles.btnNavDisabled,
            ]}
            disabled={isFirstPage}
            activeOpacity={0.8}
            onPress={handlePrev}
          >
            <IconChevronLeft size={16} color={isFirstPage ? '#94A3B8' : '#475569'} />
            <Text
              numberOfLines={1}
              style={[
                styles.btnNavSecondaryText,
                isFirstPage && styles.textDisabled,
              ]}
            >
              Sebelumnya
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnNavPrimary}
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Text numberOfLines={1} style={styles.btnNavPrimaryText}>
              {pageIndex < totalPages - 1
                ? 'Lanjut'
                : lessonIndex < totalLessons - 1
                ? 'Berikutnya'
                : isCurrentModuleCompleted
                ? 'Buka Modul Berikutnya'
                : 'Selesaikan Modul'}
            </Text>
            <IconChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },

  // ── HEADER ───────────────────────────────────────────────────
  header: {
    backgroundColor: '#FAF9F5',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#EAE6DC',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  groupBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  progressCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717A',
  },
  headerModuleTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 17,
    color: '#1E5E3A',
  },

  // Segmented Progress Bar
  segmentedProgressRow: {
    flexDirection: 'row',
    gap: 4,
    height: 7,
    marginTop: 6,
    marginBottom: 4,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  segmentCompleted: {
    backgroundColor: '#2F7D46',
  },
  segmentCurrent: {
    backgroundColor: '#FACC15',
  },

  // Page Dots
  pageDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  pageDotsGroup: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  pageDotActive: {
    width: 16,
    backgroundColor: '#2F7D46',
  },
  pageIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#854D0E',
  },

  // ── CONTENT AREA ─────────────────────────────────────────────
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  lessonHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  lessonPillTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  lessonPillTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.6,
  },
  lessonHeading: {
    fontFamily: 'FeatherBold',
    fontSize: 22,
    color: '#1E293B',
    lineHeight: 28,
  },
  blocksContainer: {
    gap: 8,
  },

  // ── STICKY FOOTER (3D BUTTONS) ───────────────────────────────
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF9F5',
    borderTopWidth: 1.5,
    borderTopColor: '#EAE6DC',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  btnExercise: {
    height: 44,
    backgroundColor: '#FEF9C3',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FACC15',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CA8A04',
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  btnExerciseText: {
    fontFamily: 'FeatherBold',
    fontSize: 13.5,
    color: '#854D0E',
    letterSpacing: 0.2,
  },
  btnExerciseCompleted: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderBottomColor: '#16A34A',
  },
  btnExerciseCompletedText: {
    color: '#166534',
  },
  btnExerciseRetry: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
  },
  btnExerciseRetryText: {
    color: '#92400E',
  },
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnNavSecondary: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderBottomWidth: 3.5,
    borderBottomColor: '#94A3B8',
  },
  btnNavSecondaryText: {
    fontFamily: 'FeatherBold',
    fontSize: 13,
    color: '#334155',
  },
  btnNavDisabled: {
    opacity: 0.45,
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderBottomColor: '#CBD5E1',
  },
  textDisabled: {
    color: '#94A3B8',
  },
  btnNavPrimary: {
    flex: 1.4,
    height: 48,
    flexDirection: 'row',
    backgroundColor: '#2F7D46',
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 4,
    borderBottomColor: '#1E5E3A',
  },
  btnNavPrimaryText: {
    fontFamily: 'FeatherBold',
    fontSize: 13.5,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
