import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { getActiveCourse, getCourses } from '../../services/courseService';
import { getUserAdventureStats, getUserProfile } from '../../services/progressService';
import MascotHead from '../../components/ui/MascotHead';
import {
  IconBook,
  IconCheck,
  IconCodeChip,
  IconGamepad,
  IconHome,
  IconSprout,
  IconStar,
  IconUser,
} from '../../components/ui/Icons';

export default function Dashboard() {
  const navigation = useNavigation();

  // State
  const [profile, setProfile] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [stats, setStats] = useState({ totalStars: 0, completedLessonsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Beranda'); // Beranda | Belajar | Permainan | Profil
  const [modalInfo, setModalInfo] = useState(null);

  // Load all dashboard data from Supabase / services
  const loadDashboardData = useCallback(async () => {
    try {
      // 1. Ambil session user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Ambil data profile dari Supabase
        const prof = await getUserProfile(user.id);
        setProfile(prof || { full_name: user.email?.split('@')[0] || 'Jek', streak: 0, xp: 0 });

        // Ambil data progress
        const userStats = await getUserAdventureStats(user.id);
        setStats(userStats);
      } else {
        // Demo profile jika belum login
        setProfile({ full_name: 'Jek', streak: 0, xp: 0 });
      }

      // 2. Ambil data courses & active course
      const courses = await getCourses();
      setAllCourses(courses);
      const active = await getActiveCourse('pengenalan-coding');
      setActiveCourse(active);
    } catch (err) {
      console.warn('loadDashboardData error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = async () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah kamu yakin ingin keluar dari MangKiCode?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  // Helper sapaan nama user (ambil nama panggilan)
  const getFirstName = () => {
    if (!profile?.full_name) return 'Jek';
    return profile.full_name.trim().split(' ')[0];
  };

  const totalLessons = activeCourse?.lessons?.length || 3;
  const currentLessonIndex = stats.completedLessonsCount < totalLessons ? stats.completedLessonsCount + 1 : totalLessons;
  const currentLesson = activeCourse?.lessons?.[currentLessonIndex - 1] || { title: 'Dasar Pemrograman' };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2F7D46" />
        <Text style={styles.loadingText}>Menyiapkan petualanganmu...</Text>
      </View>
    );
  }

  // Render view berdasarkan tab yang dipilih
  const renderTabContent = () => {
    if (activeTab === 'Belajar') {
      return (
        <ScrollView style={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.tabHeading}>Daftar Kursus Belajar</Text>
          <Text style={styles.tabSubheading}>Pilih materi untuk memulai belajar kode bersama MangKi</Text>
          {allCourses.map((c, idx) => (
            <TouchableOpacity
              key={c.id || idx}
              style={styles.courseCard}
              activeOpacity={0.85}
              onPress={() =>
                setModalInfo({
                  title: c.title,
                  desc: `${c.description || 'Pelajari materi interaktif ini.'}\n\nJumlah Pelajaran: ${c.lessons?.length || 0}`,
                })
              }
            >
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>Level {c.order_index || idx + 1}</Text>
              </View>
              <Text style={styles.courseTitle}>{c.title}</Text>
              <Text style={styles.courseDesc}>{c.description}</Text>
              <View style={styles.courseFooter}>
                <Text style={styles.courseLessonsCount}>
                  📚 {c.lessons?.length || 0} Pelajaran
                </Text>
                <Text style={styles.courseAction}>Lihat Materi →</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (activeTab === 'Permainan') {
      return (
        <View style={styles.tabCenterContent}>
          <MascotHead width={90} height={90} />
          <Text style={styles.tabHeading}>Teka-Teki & Game Kode</Text>
          <Text style={styles.gameSub}>
            Tantang kemampuan logikamu dengan game koding mini yang menyenangkan!
          </Text>
          <TouchableOpacity
            style={styles.btnPrimaryYellow}
            activeOpacity={0.85}
            onPress={() =>
              setModalInfo({
                title: 'Teka-Teki MangKi',
                desc: 'Mode game petualangan logika sedang dipersiapkan untuk level berikutnya!',
              })
            }
          >
            <Text style={styles.btnPrimaryYellowText}>Mulai Tantangan</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeTab === 'Profil') {
      return (
        <ScrollView style={styles.tabContentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.profileHeaderCard}>
            <MascotHead width={80} height={80} />
            <Text style={styles.profileName}>{profile?.full_name || 'Pengguna MangKi'}</Text>
            {profile?.username && <Text style={styles.profileUsername}>@{profile.username}</Text>}

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatVal}>{profile?.xp ?? 0}</Text>
                <Text style={styles.profileStatLbl}>Total XP</Text>
              </View>
              <View style={styles.profileDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatVal}>{profile?.streak ?? 0} Hari</Text>
                <Text style={styles.profileStatLbl}>Streak Aktif</Text>
              </View>
              <View style={styles.profileDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatVal}>{stats.totalStars}</Text>
                <Text style={styles.profileStatLbl}>Bintang</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.btnLogout} activeOpacity={0.85} onPress={handleLogout}>
            <Text style={styles.btnLogoutText}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    // TAB UTAMA: Beranda (Sesuai Referensi Gambar)
    return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2F7D46']} />}
      >
        {/* ── 1. HEADER (Halo, Jek! & Streak pill) ────────────────── */}
        <View style={styles.topHeaderRow}>
          <View style={styles.greetingCol}>
            <Text style={styles.greetingTitle}>Halo, {getFirstName()}!</Text>
            <Text style={styles.greetingSubtitle}>
              Pisang berikutnya ada di Level {activeCourse?.order_index || 1}.
            </Text>
          </View>

          {/* Streak Badge Pill */}
          <View style={styles.streakBadge}>
            <IconSprout size={16} color="#4D7C0F" />
            <Text style={styles.streakText}>{profile?.streak ?? 0} hari</Text>
          </View>
        </View>

        {/* ── 2. HERO CARD HIJAU (Mulai petualanganmu) ───────────── */}
        <View style={styles.heroCard}>
          {/* Maskot Kepala di Pojok Kanan Atas */}
          <View style={styles.mascotCornerWrapper}>
            <MascotHead width={78} height={78} />
          </View>

          <Text style={styles.heroPretitle}>Mulai petualanganmu</Text>
          <Text style={styles.heroTitle}>{activeCourse?.title || 'Pengenalan Coding'}</Text>
          <Text style={styles.heroProgress}>
            Pelajaran {currentLessonIndex} dari {totalLessons}
          </Text>

          {/* Tombol Kuning: Lanjutkan Belajar */}
          <TouchableOpacity
            style={styles.heroActionBtn}
            activeOpacity={0.85}
            onPress={() =>
              setModalInfo({
                title: activeCourse?.title || 'Pengenalan Coding',
                desc: `Pelajaran ke-${currentLessonIndex}: "${currentLesson.title}"\n\nSiap untuk belajar dasar pemrograman bersama MangKi?`,
              })
            }
          >
            <Text style={styles.heroActionBtnText}>Lanjutkan Belajar</Text>
          </TouchableOpacity>
        </View>

        {/* ── 3. JEJAK PETUALANGANMU ─────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>Jejak petualanganmu</Text>

          {/* Trail / Road Stepper */}
          <View style={styles.trailContainer}>
            {/* Node 1: Kotak Kuning / Gold (Level saat ini) */}
            <View style={styles.trailActiveBox}>
              <View style={styles.trailActiveInner} />
            </View>

            {/* Garis Penghubung & Bulatan Stepper */}
            <View style={styles.trailTrackLine} />

            <View style={styles.trailCirclesRow}>
              {[...Array(8)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.trailCircleNode,
                    i < stats.completedLessonsCount ? styles.trailCircleCompleted : null,
                  ]}
                />
              ))}
            </View>
          </View>

          <Text style={styles.trailCaption}>
            {stats.completedLessonsCount > 0 ? 'Luar biasa!' : 'Petualangan baru dimulai!'} {stats.totalStars} bintang terkumpul.
          </Text>
        </View>

        {/* ── 4. MISI HARI INI ───────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>Misi hari ini</Text>

          <View style={styles.missionCard}>
            <View style={styles.missionInfoCol}>
              <Text style={styles.missionTitle}>Selesaikan materi</Text>
              <Text style={styles.missionCourseName}>{activeCourse?.title || 'Pengenalan Coding'}</Text>
              <Text style={styles.missionTopic}>
                Topik: {currentLesson?.title || 'Dasar Pemrograman'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.missionBtn}
              activeOpacity={0.85}
              onPress={() =>
                setModalInfo({
                  title: 'Misi Hari Ini',
                  desc: `Materi: ${activeCourse?.title || 'Pengenalan Coding'}\nTopik: ${currentLesson?.title || 'Dasar Pemrograman'}\n\nSelesaikan materi untuk menambah XP dan menjaga streak belajarmu!`,
                })
              }
            >
              <Text style={styles.missionBtnText}>Mulai Belajar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 5. AKSES CEPAT ─────────────────────────────────────── */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>Akses cepat</Text>

          <View style={styles.quickAccessRow}>
            {/* Chip Level 1 */}
            <TouchableOpacity
              style={styles.quickChip}
              activeOpacity={0.8}
              onPress={() =>
                setModalInfo({
                  title: 'Level 1: Pengenalan Coding',
                  desc: 'Mempelajari sintaks dasar komputer dan perintah pertama.',
                })
              }
            >
              <IconCodeChip size={15} color="#475569" />
              <Text style={styles.quickChipText}>Level 1</Text>
            </TouchableOpacity>

            {/* Chip Level 2 */}
            <TouchableOpacity
              style={styles.quickChip}
              activeOpacity={0.8}
              onPress={() =>
                setModalInfo({
                  title: 'Level 2: Struktur Data',
                  desc: 'Mempelajari penyimpanan kumpulan data seperti Array & List.',
                })
              }
            >
              <IconCodeChip size={15} color="#475569" />
              <Text style={styles.quickChipText}>Level 2</Text>
            </TouchableOpacity>
          </View>

          {/* Chip Pengenalan Algoritma */}
          <View style={styles.quickAccessRowSecond}>
            <TouchableOpacity
              style={styles.quickChip}
              activeOpacity={0.8}
              onPress={() =>
                setModalInfo({
                  title: 'Pengenalan Algoritma',
                  desc: 'Materi terstruktur untuk melatih logika berpikir komputasional.',
                })
              }
            >
              <IconCheck size={14} color="#2F7D46" />
              <Text style={styles.quickChipText}>Pengenalan Algoritma</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer bawah agar tidak terhalang navbar */}
        <View style={{ height: 32 }} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar backgroundColor="#FAF9F5" barStyle="dark-content" />

      {/* Konten Tab */}
      <View style={styles.mainContent}>{renderTabContent()}</View>

      {/* ── 6. BOTTOM NAVIGATION BAR ─────────────────────────────── */}
      <View style={styles.bottomNav}>
        {/* Tab 1: Beranda */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('Beranda')}
        >
          {activeTab === 'Beranda' ? (
            <View style={styles.activeIconPill}>
              <IconHome size={22} color="#1E5E3A" filled={true} />
            </View>
          ) : (
            <IconHome size={22} color="#9CA3AF" filled={false} />
          )}
          <Text style={[styles.navLabel, activeTab === 'Beranda' && styles.navLabelActive]}>
            Beranda
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Belajar */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('Belajar')}
        >
          {activeTab === 'Belajar' ? (
            <View style={styles.activeIconPill}>
              <IconBook size={22} color="#1E5E3A" />
            </View>
          ) : (
            <IconBook size={22} color="#9CA3AF" />
          )}
          <Text style={[styles.navLabel, activeTab === 'Belajar' && styles.navLabelActive]}>
            Belajar
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Permainan */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('Permainan')}
        >
          {activeTab === 'Permainan' ? (
            <View style={styles.activeIconPill}>
              <IconGamepad size={22} color="#1E5E3A" />
            </View>
          ) : (
            <IconGamepad size={22} color="#9CA3AF" />
          )}
          <Text style={[styles.navLabel, activeTab === 'Permainan' && styles.navLabelActive]}>
            Permainan
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Profil */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('Profil')}
        >
          {activeTab === 'Profil' ? (
            <View style={styles.activeIconPill}>
              <IconUser size={22} color="#1E5E3A" />
            </View>
          ) : (
            <IconUser size={22} color="#9CA3AF" />
          )}
          <Text style={[styles.navLabel, activeTab === 'Profil' && styles.navLabelActive]}>
            Profil
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Popup Info Aksi */}
      {modalInfo && (
        <Modal transparent animationType="fade" visible={!!modalInfo}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{modalInfo.title}</Text>
              <Text style={styles.modalDesc}>{modalInfo.desc}</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalInfo(null)}
              >
                <Text style={styles.modalCloseBtnText}>Mengerti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FAF9F5',
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
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },

  // ── 1. HEADER ──────────────────────────────────────────────────
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greetingCol: {
    flex: 1,
  },
  greetingTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 27,
    color: '#1E5E3A',
    letterSpacing: 0.2,
  },
  greetingSubtitle: {
    fontSize: 13.5,
    color: '#71717A',
    fontWeight: '500',
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF08A',
    gap: 6,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4D7C0F',
  },

  // ── 2. HERO CARD ───────────────────────────────────────────────
  heroCard: {
    backgroundColor: '#3DBE68',
    borderRadius: 28,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 22,
    position: 'relative',
    marginBottom: 24,
    shadowColor: '#2F7D46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  mascotCornerWrapper: {
    position: 'absolute',
    top: 4,
    right: 14,
  },
  heroPretitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  heroProgress: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    marginBottom: 16,
  },
  heroActionBtn: {
    backgroundColor: '#F5B82E',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#D99B00',
  },
  heroActionBtnText: {
    fontFamily: 'FeatherBold',
    fontSize: 16,
    color: '#262626',
    letterSpacing: 0.3,
  },

  // ── 3. JEJAK PETUALANGANMU ─────────────────────────────────────
  sectionWrap: {
    marginBottom: 22,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#27272A',
    marginBottom: 12,
  },
  trailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 32,
    marginBottom: 4,
  },
  trailActiveBox: {
    width: 24,
    height: 24,
    backgroundColor: '#FACC15',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  trailActiveInner: {
    width: 8,
    height: 8,
    backgroundColor: '#EAB308',
    borderRadius: 2,
  },
  trailTrackLine: {
    position: 'absolute',
    left: 20,
    right: 10,
    height: 2,
    backgroundColor: '#EAD9AA',
    zIndex: 1,
  },
  trailCirclesRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 14,
    zIndex: 2,
  },
  trailCircleNode: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#D8C7A3',
  },
  trailCircleCompleted: {
    backgroundColor: '#FACC15',
    borderColor: '#78350F',
  },
  trailCaption: {
    fontSize: 12.5,
    color: '#71717A',
    fontWeight: '500',
    marginTop: 6,
  },

  // ── 4. MISI HARI INI ───────────────────────────────────────────
  missionCard: {
    backgroundColor: '#FEF9C3',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEF08A',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionInfoCol: {
    flex: 1,
    paddingRight: 12,
  },
  missionTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#422006',
    marginBottom: 2,
  },
  missionCourseName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#292524',
    marginBottom: 4,
  },
  missionTopic: {
    fontSize: 12,
    color: '#78716C',
    fontWeight: '500',
  },
  missionBtn: {
    backgroundColor: '#2F7D46',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1E5E3A',
  },
  missionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── 5. AKSES CEPAT ─────────────────────────────────────────────
  quickAccessRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  quickAccessRowSecond: {
    flexDirection: 'row',
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  // ── 6. BOTTOM NAVIGATION BAR ───────────────────────────────────
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
    paddingBottom: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeIconPill: {
    backgroundColor: '#FDE047',
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#1E5E3A',
  },

  // ── OTHER TABS ─────────────────────────────────────────────────
  tabContentScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  tabCenterContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  tabHeading: {
    fontFamily: 'FeatherBold',
    fontSize: 22,
    color: '#1E5E3A',
    marginBottom: 6,
    textAlign: 'center',
  },
  tabSubheading: {
    fontSize: 13.5,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameSub: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 20,
  },
  btnPrimaryYellow: {
    backgroundColor: '#F5B82E',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 18,
    borderBottomWidth: 4,
    borderBottomColor: '#D99B00',
  },
  btnPrimaryYellowText: {
    fontFamily: 'FeatherBold',
    fontSize: 15,
    color: '#262626',
  },

  // Course card di tab Belajar
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  courseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  courseBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2F7D46',
  },
  courseTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 6,
  },
  courseDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  courseLessonsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  courseAction: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2F7D46',
  },

  // Profil tab
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  profileName: {
    fontFamily: 'FeatherBold',
    fontSize: 22,
    color: '#1E293B',
    marginTop: 12,
  },
  profileUsername: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatVal: {
    fontFamily: 'FeatherBold',
    fontSize: 18,
    color: '#1E293B',
  },
  profileStatLbl: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  profileDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  btnLogout: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 40,
  },
  btnLogoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
  },
  modalTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 20,
    color: '#1E293B',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalCloseBtn: {
    backgroundColor: '#2F7D46',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
