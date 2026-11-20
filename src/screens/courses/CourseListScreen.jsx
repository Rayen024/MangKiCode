import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MODUL_BELAJAR } from '../../data/modulBelajar';
import {
  STATUS_MODUL,
  getModuleStatus,
  calculateModuleProgress,
  calculateOverallProgress,
  loadBelajarProgress,
  getLastPosition,
} from '../../services/belajarProgressService';
import MascotHead from '../../components/ui/MascotHead';
import {
  IconLock,
  IconClock,
  IconCheckCircle,
  IconLightbulb,
  IconSteps,
  IconBranch,
  IconRepeat,
  IconBook,
  IconChevronRight,
  IconStar,
} from '../../components/ui/Icons';

/**
 * Pemetaan ikon modul ke komponen SVG berwarna tematik
 */
function renderModulIcon(ikonName, status) {
  const isLocked = status === STATUS_MODUL.TERKUNCI;

  switch (ikonName) {
    case 'IconLightbulb':
      return <IconLightbulb size={28} color={isLocked ? '#94A3B8' : '#D97706'} />;
    case 'IconSteps':
      return <IconSteps size={28} color={isLocked ? '#94A3B8' : '#15803D'} />;
    case 'IconBranch':
      return <IconBranch size={28} color={isLocked ? '#94A3B8' : '#C2410C'} />;
    case 'IconRepeat':
      return <IconRepeat size={28} color={isLocked ? '#94A3B8' : '#1D4ED8'} />;
    default:
      return <IconBook size={28} color={isLocked ? '#94A3B8' : '#1E5E3A'} />;
  }
}

export default function CourseListScreen({ navigation }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const p = await loadBelajarProgress();
      setProgress(p);
    } catch (e) {
      console.warn('Gagal memuat progres:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleOpenModule = (module, status) => {
    if (status === STATUS_MODUL.TERKUNCI) return;

    const lastPos = getLastPosition(module.id, progress);

    navigation.navigate('LessonDetail', {
      moduleId: module.id,
      initialLessonIndex: lastPos.lessonIndex || 0,
      initialPageIndex: lastPos.pageIndex || 0,
    });
  };

  if (loading && !progress) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2F7D46" />
        <Text style={styles.loadingText}>Menyiapkan petualangan belajar...</Text>
      </View>
    );
  }

  const overall = calculateOverallProgress(MODUL_BELAJAR, progress || {});

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2F7D46']} />
      }
    >
      {/* ── 1. HERO BANNER PETUALANGAN KODE (Gaya MangKiCode) ─────── */}
      <View style={styles.heroBanner}>
        {/* Kepala Maskot di Sudut Kanan Atas */}
        <View style={styles.heroMascotWrap}>
          <MascotHead width={84} height={84} />
        </View>

        <View style={styles.heroPreRow}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>FASE E • KELAS X</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Modul Belajar Kode</Text>
        <Text style={styles.heroSubtitle}>
          Kuasai 4 pilar algoritma dan bantu MangKi mengumpulkan seluruh pisang! 🍌
        </Text>

        {/* Progress Card Terintegrasi di dalam Banner */}
        <View style={styles.heroStatsCard}>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>
                {overall.completedModulesCount} / {overall.totalModules}
              </Text>
              <Text style={styles.heroStatLbl}>Modul Selesai</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatVal}>{overall.percentage}%</Text>
              <Text style={styles.heroStatLbl}>Total Progres</Text>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.heroStatItem}>
              <View style={styles.starRow}>
                <IconStar size={16} color="#FACC15" filled={true} />
                <Text style={styles.heroStatVal}>{overall.completedModulesCount * 3}</Text>
              </View>
              <Text style={styles.heroStatLbl}>Bintang</Text>
            </View>
          </View>

          {/* Bar Kemajuan 3D */}
          <View style={styles.overallTrack}>
            <View style={[styles.overallFill, { width: `${overall.percentage}%` }]} />
          </View>
        </View>
      </View>

      {/* ── 2. DAFTAR KARTU MODUL ──────────────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Alur Pembelajaran</Text>
        <Text style={styles.sectionCounter}>
          {overall.completedModulesCount} dari {overall.totalModules} terbuka
        </Text>
      </View>

      <View style={styles.moduleList}>
        {MODUL_BELAJAR.map((module, mIdx) => {
          const status = getModuleStatus(module, MODUL_BELAJAR, progress || {});
          const modulePct = calculateModuleProgress(module, progress || {});
          const isLocked = status === STATUS_MODUL.TERKUNCI;
          const isActive = status === STATUS_MODUL.SEDANG_DIPELAJARI;
          const isDone = status === STATUS_MODUL.SELESAI;
          const isAvailable = status === STATUS_MODUL.TERSEDIA;

          return (
            <TouchableOpacity
              key={module.id}
              activeOpacity={isLocked ? 1 : 0.82}
              disabled={isLocked}
              onPress={() => handleOpenModule(module, status)}
              accessibilityRole={isLocked ? 'none' : 'button'}
              accessibilityLabel={`${module.judul}, status: ${status}`}
              style={[
                styles.moduleCard,
                isDone && styles.cardSelesai,
                isActive && styles.cardAktif,
                isAvailable && styles.cardTersedia,
                isLocked && styles.cardTerkunci,
              ]}
            >
              {/* Header Kartu: Label Urutan & Lencana Status */}
              <View style={styles.cardHeader}>
                <View style={styles.moduleTagRow}>
                  <View
                    style={[
                      styles.orderTag,
                      isLocked && styles.orderTagLocked,
                      isActive && styles.orderTagActive,
                      isDone && styles.orderTagDone,
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderTagText,
                        isLocked && styles.orderTagTextLocked,
                        isActive && styles.orderTagTextActive,
                        isDone && styles.orderTagTextDone,
                      ]}
                    >
                      MODUL {module.urutan}
                    </Text>
                  </View>
                </View>

                {/* Status Badges */}
                {isDone && (
                  <View style={styles.badgeSelesai}>
                    <IconCheckCircle size={14} color="#15803D" />
                    <Text style={styles.badgeTextSelesai}>Tuntas ⭐</Text>
                  </View>
                )}

                {isActive && (
                  <View style={styles.badgeAktif}>
                    <Text style={styles.badgeTextAktif}>Sedang Dipelajari 🚀</Text>
                  </View>
                )}

                {isAvailable && (
                  <View style={styles.badgeTersedia}>
                    <Text style={styles.badgeTextTersedia}>Tersedia ✨</Text>
                  </View>
                )}

                {isLocked && (
                  <View style={styles.badgeTerkunci}>
                    <IconLock size={13} color="#94A3B8" />
                    <Text style={styles.badgeTextTerkunci}>Terkunci</Text>
                  </View>
                )}
              </View>

              {/* Baris Konten Utama: Ikon & Teks Modul */}
              <View style={styles.cardMainRow}>
                {/* Bubble Ikon */}
                <View
                  style={[
                    styles.iconBubble,
                    isLocked && styles.iconBubbleLocked,
                    isActive && styles.iconBubbleActive,
                    isDone && styles.iconBubbleDone,
                  ]}
                >
                  {renderModulIcon(module.ikon, status)}
                </View>

                {/* Info Modul */}
                <View style={styles.cardTextCol}>
                  <Text style={[styles.moduleTitle, isLocked && styles.textLocked]}>
                    {module.judul}
                  </Text>
                  <Text
                    style={[styles.moduleDesc, isLocked && styles.textLockedDesc]}
                    numberOfLines={2}
                  >
                    {module.deskripsi}
                  </Text>
                </View>
              </View>

              {/* Chips Info (Waktu & Jumlah Pelajaran) */}
              <View style={styles.chipsRow}>
                <View style={[styles.infoChip, isLocked && styles.chipLocked]}>
                  <IconClock size={12.5} color={isLocked ? '#94A3B8' : '#64748B'} />
                  <Text style={[styles.chipText, isLocked && styles.textLockedDesc]}>
                    {module.estimasiMenit} Menit
                  </Text>
                </View>

                <View style={[styles.infoChip, isLocked && styles.chipLocked]}>
                  <IconBook size={12.5} color={isLocked ? '#94A3B8' : '#64748B'} />
                  <Text style={[styles.chipText, isLocked && styles.textLockedDesc]}>
                    {module.pelajaran.length} Pelajaran
                  </Text>
                </View>

                {!isLocked && (
                  <View style={[styles.infoChip, styles.chipXp]}>
                    <Text style={styles.chipXpText}>+50 XP</Text>
                  </View>
                )}
              </View>

              {/* Progress Bar Khusus Kartu Sedang Dipelajari */}
              {isActive && (
                <View style={styles.activeProgressBox}>
                  <View style={styles.activeProgressHeader}>
                    <Text style={styles.activeProgressLabel}>Kemajuan Belajarmu</Text>
                    <Text style={styles.activeProgressValue}>{modulePct}%</Text>
                  </View>
                  <View style={styles.activeTrack}>
                    <View style={[styles.activeFill, { width: `${modulePct}%` }]} />
                  </View>
                </View>
              )}

              {/* Tombol Aksi 3D di Bawah Kartu */}
              {!isLocked && (
                <View style={styles.actionBtnRow}>
                  {isActive ? (
                    <View style={styles.btn3DActive}>
                      <Text style={styles.btn3DActiveText}>Lanjutkan Belajar</Text>
                      <IconChevronRight size={16} color="#262626" />
                    </View>
                  ) : isDone ? (
                    <View style={styles.btn3DDone}>
                      <Text style={styles.btn3DDoneText}>Pelajari Lagi</Text>
                      <IconRepeat size={14} color="#15803D" />
                    </View>
                  ) : (
                    <View style={styles.btn3DAvailable}>
                      <Text style={styles.btn3DAvailableText}>Mulai Belajar</Text>
                      <IconChevronRight size={16} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              )}

              {/* Keterangan Kunci jika Terkunci */}
              {isLocked && (
                <View style={styles.lockedNoteRow}>
                  <IconLock size={12} color="#94A3B8" />
                  <Text style={styles.lockedNoteText}>
                    Selesaikan Modul {module.urutan - 1} untuk membuka materi ini
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },

  // ── 1. HERO BANNER ───────────────────────────────────────────
  heroBanner: {
    backgroundColor: '#1E5E3A',
    borderRadius: 26,
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    position: 'relative',
    marginBottom: 24,
    shadowColor: '#1E5E3A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroMascotWrap: {
    position: 'absolute',
    top: 10,
    right: 12,
  },
  heroPreRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  heroPill: {
    backgroundColor: '#2A7A4E',
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  heroPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#86EFAC',
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 4,
    maxWidth: '70%',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#D1FAE5',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
    maxWidth: '75%',
  },
  heroStatsCard: {
    backgroundColor: '#164E2F',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatVal: {
    fontFamily: 'FeatherBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  heroStatLbl: {
    fontSize: 11,
    color: '#A7F3D0',
    fontWeight: '600',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallTrack: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  overallFill: {
    height: '100%',
    backgroundColor: '#FACC15',
    borderRadius: 6,
  },

  // ── 2. DAFTAR MODUL ──────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionCounter: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#71717A',
  },
  moduleList: {
    gap: 16,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // State Card Styles
  cardSelesai: {
    borderColor: '#86EFAC',
    backgroundColor: '#F8FCF8',
  },
  cardAktif: {
    borderColor: '#F59E0B',
    borderWidth: 2.5,
    backgroundColor: '#FFFEF5',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTersedia: {
    borderColor: '#2F7D46',
    borderWidth: 2,
  },
  cardTerkunci: {
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    opacity: 0.75,
  },

  // Header Kartu
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  orderTagActive: {
    backgroundColor: '#FEF08A',
  },
  orderTagDone: {
    backgroundColor: '#DCFCE7',
  },
  orderTagLocked: {
    backgroundColor: '#E2E8F0',
  },
  orderTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.6,
  },
  orderTagTextActive: {
    color: '#854D0E',
  },
  orderTagTextDone: {
    color: '#166534',
  },
  orderTagTextLocked: {
    color: '#94A3B8',
  },

  // Badges
  badgeSelesai: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextSelesai: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D',
  },
  badgeAktif: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextAktif: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#854D0E',
  },
  badgeTersedia: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeTextTersedia: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#15803D',
  },
  badgeTerkunci: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextTerkunci: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
  },

  // Baris Utama
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
  },
  iconBubbleActive: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FEF08A',
  },
  iconBubbleDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  iconBubbleLocked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  cardTextCol: {
    flex: 1,
  },
  moduleTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 4,
    lineHeight: 22,
  },
  moduleDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  textLocked: {
    color: '#94A3B8',
  },
  textLockedDesc: {
    color: '#94A3B8',
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 10,
  },
  chipLocked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  chipXp: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FEF08A',
  },
  chipXpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A16207',
  },

  // Progress Box Aktif
  activeProgressBox: {
    backgroundColor: '#FEFCE8',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginBottom: 14,
  },
  activeProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  activeProgressLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#854D0E',
  },
  activeProgressValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#854D0E',
  },
  activeTrack: {
    height: 7,
    backgroundColor: '#FDE047',
    borderRadius: 6,
    overflow: 'hidden',
  },
  activeFill: {
    height: '100%',
    backgroundColor: '#CA8A04',
    borderRadius: 6,
  },

  // Tombol Aksi 3D
  actionBtnRow: {
    marginTop: 2,
  },
  btn3DActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F5B82E',
    borderRadius: 16,
    paddingVertical: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#D99B00',
  },
  btn3DActiveText: {
    fontFamily: 'FeatherBold',
    fontSize: 14.5,
    color: '#262626',
    letterSpacing: 0.3,
  },
  btn3DAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2F7D46',
    borderRadius: 16,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#1E5E3A',
  },
  btn3DAvailableText: {
    fontFamily: 'FeatherBold',
    fontSize: 14.5,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  btn3DDone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
  },
  btn3DDoneText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#15803D',
  },
  lockedNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 4,
  },
  lockedNoteText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
