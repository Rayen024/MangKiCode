import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MODUL_BELAJAR } from '../../data/modulBelajar';
import {
  saveExerciseResult,
  loadBelajarProgress,
  isModuleCompleted,
} from '../../services/belajarProgressService';
import QuizOption from '../../components/quiz/QuizOption';
import OrderQuestion from '../../components/quiz/OrderQuestion';
import CodeQuestion from '../../components/quiz/CodeQuestion';
import MascotHead from '../../components/ui/MascotHead';
import { FormattedText } from '../../components/lesson/ContentBlockRenderer';
import { IconChevronLeft, IconCheckCircle } from '../../components/ui/Icons';

export default function QuizScreen({ route, navigation }) {
  const { moduleId, setelahPelajaran } = route.params || {};

  const module = MODUL_BELAJAR.find(m => m.id === moduleId) || MODUL_BELAJAR[0];
  const questions = (module.latihan || []).filter(
    q => (q.setelahPelajaran || module.pelajaran.length) === setelahPelajaran
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [codeText, setCodeText] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isModuleFinished, setIsModuleFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const nextModule = MODUL_BELAJAR.find(m => m.urutan === module.urutan + 1);

  // Inisialisasi state per soal saat berpindah
  React.useEffect(() => {
    if (!currentQ) return;
    setIsAnswerSubmitted(false);
    setSelectedOption(null);

    if (currentQ.jenis === 'susun_urutan') {
      // Acak urutan awal agar siswa dapat menyusun
      const initial = currentQ.opsi ? [...currentQ.opsi] : Array.isArray(currentQ.kunci) ? [...currentQ.kunci] : [];
      // Buat pengacakan sederhana jika belum teracak
      const shuffled = [...initial].sort(() => 0.5 - Math.random());
      setOrderItems(shuffled);
    } else if (currentQ.jenis === 'perbaiki_kode' || currentQ.jenis === 'buat_program') {
      setCodeText(currentQ.petunjukKode || '');
    }
  }, [currentIndex, currentQ]);

  // Handler periksa jawaban
  const handleCheckAnswer = () => {
    if (isAnswerSubmitted || !currentQ) return;

    let isCorrect = false;

    if (currentQ.jenis === 'pilihan_ganda' || currentQ.jenis === 'tebak_keluaran') {
      if (!selectedOption) return;
      isCorrect = selectedOption.trim() === currentQ.kunci.trim();
    } else if (currentQ.jenis === 'susun_urutan') {
      const correctOrder = Array.isArray(currentQ.kunci) ? currentQ.kunci : [];
      isCorrect = JSON.stringify(orderItems) === JSON.stringify(correctOrder);
    } else if (currentQ.jenis === 'perbaiki_kode' || currentQ.jenis === 'buat_program') {
      // Evaluasi toleran untuk soal kode
      const cleanUser = codeText.replace(/\s+/g, ' ').trim().toLowerCase();
      const cleanKey = currentQ.kunci.replace(/\s+/g, ' ').trim().toLowerCase();
      isCorrect = cleanUser.length > 5 && (cleanUser.includes(cleanKey) || cleanKey.includes(cleanUser));
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setLastAnswerCorrect(isCorrect);
    setIsAnswerSubmitted(true);
  };

  // Handler lanjut ke soal berikutnya
  const handleNextQuestion = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Selesai seluruh soal di set ini
      const updatedProgress = await saveExerciseResult(module.id, setelahPelajaran, score, totalQuestions);
      const modCompleted = isModuleCompleted(module, updatedProgress);
      setIsModuleFinished(modCompleted);
      setIsFinished(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setLastAnswerCorrect(false);
    setScore(0);
    setIsFinished(false);
    setIsModuleFinished(false);
  };

  // ── TAMPILAN SKOR AKHIR ──────────────────────────────────────────
  if (isFinished) {
    const isPerfect = score === totalQuestions;
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#FAF9F5" barStyle="dark-content" />
        <View style={styles.summaryContainer}>
          <MascotHead width={96} height={96} />

          <Text style={styles.summaryTitle}>
            {isModuleFinished
              ? 'Modul Selesai! 🎉'
              : isPerfect
              ? 'Sempurna! 100% Benar 🌟'
              : 'Belum Sempurna! 💪'}
          </Text>

          <Text style={styles.summarySubtitle}>
            {isModuleFinished
              ? `Hebat! Kamu telah menyelesaikan seluruh pelajaran & latihan di ${module.judul} dengan nilai sempurna 100%.${nextModule ? ` Modul ${nextModule.urutan} (${nextModule.judul}) sekarang sudah terbuka!` : ''}`
              : isPerfect
              ? `Keren! Seluruh soal terjawab benar (${score}/${totalQuestions}). Lanjutkan semangat belajarmu!`
              : 'Untuk membuka modul berikutnya, semua soal harus terjawab dengan benar (100%). Ayo coba lagi!'}
          </Text>

          {/* Kotak Nilai */}
          <View style={[styles.scoreBox, !isPerfect && styles.scoreBoxIncomplete]}>
            <Text style={[styles.scoreNumber, !isPerfect && styles.scoreNumberIncomplete]}>
              {score} / {totalQuestions}
            </Text>
            <Text style={[styles.scoreLabel, !isPerfect && styles.scoreLabelIncomplete]}>
              {isPerfect ? 'Semua Soal Terjawab Benar ✓' : `Soal Benar (Target: ${totalQuestions}/${totalQuestions})`}
            </Text>
          </View>

          <Text style={styles.summaryFeedback}>
            {isPerfect
              ? 'Kerja bagus! Pemahaman logikamu sangat mantap. Ayo lanjutkan perjalanan belajarmu!'
              : 'Jangan menyerah! Tinjau kembali materi jika perlu, lalu ulangi latihan hingga semua jawaban benar.'}
          </Text>

          {/* Tombol Aksi Utama */}
          {/* KASUS 1: Belum 100% -> Tombol Utama adalah Ulangi Latihan */}
          {!isPerfect ? (
            <TouchableOpacity
              style={styles.btnSummaryPrimary}
              activeOpacity={0.85}
              onPress={handleRetryQuiz}
            >
              <Text style={styles.btnSummaryPrimaryText}>
                Ulangi Latihan Soal 🔄
              </Text>
            </TouchableOpacity>
          ) : isModuleFinished && nextModule ? (
            /* KASUS 2: 100% dan Modul Tuntas -> Mulai Modul Berikutnya */
            <TouchableOpacity
              style={styles.btnSummaryPrimary}
              activeOpacity={0.85}
              onPress={() => {
                navigation.replace('LessonDetail', {
                  moduleId: nextModule.id,
                  initialLessonIndex: 0,
                  initialPageIndex: 0,
                });
              }}
            >
              <Text style={styles.btnSummaryPrimaryText}>
                Mulai Modul {nextModule.urutan}: {nextModule.judul} 🚀
              </Text>
            </TouchableOpacity>
          ) : setelahPelajaran < module.pelajaran.length ? (
            /* KASUS 3: 100% pada set antara -> Lanjut ke Pelajaran Selanjutnya */
            <TouchableOpacity
              style={styles.btnSummaryPrimary}
              activeOpacity={0.85}
              onPress={() => {
                navigation.replace('LessonDetail', {
                  moduleId: module.id,
                  initialLessonIndex: setelahPelajaran,
                  initialPageIndex: 0,
                });
              }}
            >
              <Text style={styles.btnSummaryPrimaryText}>
                Lanjut ke Pelajaran {setelahPelajaran + 1} 🚀
              </Text>
            </TouchableOpacity>
          ) : null}

          {/* Tombol Sekunder / Kembali */}
          <TouchableOpacity
            style={styles.btnSummarySecondary}
            activeOpacity={0.85}
            onPress={() => {
              if (isModuleFinished) {
                navigation.navigate('Dashboard', { screen: 'Belajar' });
              } else {
                navigation.goBack();
              }
            }}
          >
            <Text style={styles.btnSummarySecondaryText}>
              {isModuleFinished ? 'Kembali ke Daftar Modul' : 'Kembali ke Materi Belajar'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQ) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Tidak ada soal tersedia.</Text>
          <TouchableOpacity style={styles.btnSummaryDone} onPress={() => navigation.goBack()}>
            <Text style={styles.btnSummaryDoneText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCheckDisabled =
    (currentQ.jenis === 'pilihan_ganda' || currentQ.jenis === 'tebak_keluaran') &&
    !selectedOption;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FAF9F5" barStyle="dark-content" />

      {/* ── HEADER LATIHAN ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Tutup latihan"
        >
          <IconChevronLeft size={22} color="#1E5E3A" />
        </TouchableOpacity>

        <View style={styles.headerInfoCol}>
          <Text style={styles.headerModuleTitle} numberOfLines={1}>
            Latihan • {module.judul}
          </Text>
          <Text style={styles.headerCounter}>
            Soal {currentIndex + 1} dari {totalQuestions}
          </Text>
        </View>
      </View>

      {/* Baris Progress Soal */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentIndex + 1) / totalQuestions) * 100}%` },
          ]}
        />
      </View>

      {/* ── KONTEN SOAL (SCROLLABLE) ──────────────────────────────── */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Teks Pertanyaan */}
        <View style={styles.questionCard}>
          <FormattedText text={currentQ.pertanyaan} style={styles.questionText} />
        </View>

        {/* Komponen Input Berdasarkan Jenis Soal */}
        {(currentQ.jenis === 'pilihan_ganda' || currentQ.jenis === 'tebak_keluaran') && (
          <View style={styles.optionsWrap}>
            {(currentQ.opsi || []).map((opt, idx) => (
              <QuizOption
                key={`opt-${idx}`}
                option={opt}
                index={idx}
                isSelected={selectedOption === opt}
                isCorrect={isAnswerSubmitted && opt.trim() === currentQ.kunci.trim()}
                isWrong={
                  isAnswerSubmitted &&
                  selectedOption === opt &&
                  opt.trim() !== currentQ.kunci.trim()
                }
                isAnswerSubmitted={isAnswerSubmitted}
                onSelect={setSelectedOption}
              />
            ))}
          </View>
        )}

        {currentQ.jenis === 'susun_urutan' && (
          <OrderQuestion
            items={orderItems}
            isAnswerSubmitted={isAnswerSubmitted}
            onOrderChange={setOrderItems}
          />
        )}

        {(currentQ.jenis === 'perbaiki_kode' || currentQ.jenis === 'buat_program') && (
          <CodeQuestion
            value={codeText}
            kunci={currentQ.kunci}
            petunjukKode={currentQ.petunjukKode}
            isAnswerSubmitted={isAnswerSubmitted}
            onChangeText={setCodeText}
          />
        )}

        {/* ── KARTU UMPAN BALIK (FEEDBACK) LANGSUNG ───────────────── */}
        {isAnswerSubmitted && (
          <View
            style={[
              styles.feedbackCard,
              lastAnswerCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}
          >
            <View style={styles.feedbackTitleRow}>
              <Text style={styles.feedbackIcon}>
                {lastAnswerCorrect ? '🎉' : '💡'}
              </Text>
              <Text
                style={[
                  styles.feedbackTitle,
                  lastAnswerCorrect
                    ? styles.feedbackTitleCorrect
                    : styles.feedbackTitleWrong,
                ]}
              >
                {lastAnswerCorrect ? 'Jawaban Benar!' : 'Jawaban Belum Tepat'}
              </Text>
            </View>

            {/* Penjelasan Singkat */}
            <Text style={styles.feedbackExplanation}>
              {currentQ.penjelasan}
            </Text>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── FOOTER TOMBOL AKSI ─────────────────────────────────────── */}
      <View style={styles.footer}>
        {!isAnswerSubmitted ? (
          <TouchableOpacity
            style={[styles.btnAction, isCheckDisabled && styles.btnActionDisabled]}
            disabled={isCheckDisabled}
            activeOpacity={0.85}
            onPress={handleCheckAnswer}
          >
            <Text style={styles.btnActionText}>Periksa Jawaban</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btnAction,
              lastAnswerCorrect ? styles.btnActionSuccess : styles.btnActionNext,
            ]}
            activeOpacity={0.85}
            onPress={handleNextQuestion}
          >
            <Text style={styles.btnActionText}>
              {currentIndex < totalQuestions - 1 ? 'Lanjut Soal Berikutnya' : 'Selesai Latihan'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FAF9F5',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0EFE9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfoCol: {
    flex: 1,
  },
  headerModuleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5E3A',
  },
  headerCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    marginTop: 2,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2F7D46',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  questionText: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
    fontWeight: '600',
  },
  optionsWrap: {
    marginVertical: 4,
  },

  // Feedback Card
  feedbackCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1.5,
  },
  feedbackCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  feedbackWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  feedbackIcon: {
    fontSize: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: 'FeatherBold',
  },
  feedbackTitleCorrect: {
    color: '#166534',
  },
  feedbackTitleWrong: {
    color: '#991B1B',
  },
  feedbackExplanation: {
    fontSize: 13.5,
    color: '#374151',
    lineHeight: 20,
    paddingLeft: 28,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FAF9F5',
    borderTopWidth: 1,
    borderTopColor: '#EAE6DC',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
  },
  btnAction: {
    height: 50,
    backgroundColor: '#2F7D46',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1E5E3A',
  },
  btnActionDisabled: {
    opacity: 0.45,
    backgroundColor: '#9CA3AF',
    borderBottomColor: '#6B7280',
  },
  btnActionSuccess: {
    backgroundColor: '#16A34A',
    borderBottomColor: '#15803D',
  },
  btnActionNext: {
    backgroundColor: '#2F7D46',
    borderBottomColor: '#1E5E3A',
  },
  btnActionText: {
    fontFamily: 'FeatherBold',
    fontSize: 15,
    color: '#FFFFFF',
  },

  // Summary
  summaryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  summaryTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 26,
    color: '#1E5E3A',
    marginTop: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scoreBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#86EFAC',
    paddingVertical: 20,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreBoxIncomplete: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
  },
  scoreNumber: {
    fontFamily: 'FeatherBold',
    fontSize: 42,
    color: '#15803D',
  },
  scoreNumberIncomplete: {
    color: '#A16207',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginTop: 4,
  },
  scoreLabelIncomplete: {
    color: '#854D0E',
  },
  summaryFeedback: {
    fontSize: 13.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  btnSummaryDone: {
    width: '100%',
    backgroundColor: '#2F7D46',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1E5E3A',
  },
  btnSummaryDoneText: {
    fontFamily: 'FeatherBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  btnSummaryPrimary: {
    width: '100%',
    backgroundColor: '#2F7D46',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1E5E3A',
    marginBottom: 12,
  },
  btnSummaryPrimaryText: {
    fontFamily: 'FeatherBold',
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  btnSummarySecondary: {
    width: '100%',
    backgroundColor: '#FAF9F5',
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderBottomWidth: 3,
    borderBottomColor: '#94A3B8',
  },
  btnSummarySecondaryText: {
    fontFamily: 'FeatherBold',
    fontSize: 14.5,
    color: '#475569',
  },
});
