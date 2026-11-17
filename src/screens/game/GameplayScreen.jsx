import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { GAME_LEVELS } from '../../data/gameLevels';
import { runBlockProgram } from '../../utils/gameInterpreter';
import { saveLevelStars } from '../../utils/gameProgress';
import GameBoard from '../../components/game/GameBoard';
import AiTutorModal from '../../components/game/AiTutorModal';
import LevelCompleteModal from '../../components/game/LevelCompleteModal';

const BLOCK_STYLES = {
  MAJU: { label: 'Maju', bg: '#2E5A27' },
  BELOK_KIRI: { label: 'Belok Kiri', bg: '#8D6E63' },
  BELOK_KANAN: { label: 'Belok Kanan', bg: '#D97706' },
};

export default function GameplayScreen({ route, navigation }) {
  const initialLevelId = route?.params?.levelId || 1;
  const [currentLevelId, setCurrentLevelId] = useState(initialLevelId);

  const levelData =
    GAME_LEVELS.find((lvl) => lvl.id === currentLevelId) || GAME_LEVELS[0];

  const [programBlocks, setProgramBlocks] = useState([]);
  const [monkeyPos, setMonkeyPos] = useState(levelData.startPos);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeBlockIdx, setActiveBlockIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const [statusBanner, setStatusBanner] = useState({
    type: 'info',
    text: levelData.instruction,
  });

  const [tutorVisible, setTutorVisible] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  const [tutorErrorMsg, setTutorErrorMsg] = useState('');

  const [completeVisible, setCompleteVisible] = useState(false);
  const [winStats, setWinStats] = useState({
    stars: 3,
    blocksUsed: 0,
    stepsCount: 0,
  });

  const timerRef = useRef(null);

  useEffect(() => {
    resetBoard(true);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentLevelId]);

  const resetBoard = (clearBlocks = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setMonkeyPos(levelData.startPos);
    setCurrentStep(0);
    setActiveBlockIdx(-1);
    setTutorErrorMsg('');
    setStatusBanner({ type: 'info', text: levelData.instruction });
    if (clearBlocks) {
      setProgramBlocks([]);
      setHintLevel(1);
    }
  };

  const handleAddBlock = (cmd) => {
    if (isRunning) return;
    if (programBlocks.length >= levelData.maxBlocks) return;
    setProgramBlocks((prev) => [...prev, cmd]);
  };

  const handleRemoveBlock = (indexToRemove) => {
    if (isRunning) return;
    setProgramBlocks((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRunProgram = () => {
    if (isRunning) return;
    resetBoard(false);

    const result = runBlockProgram(programBlocks, levelData);

    if (result.status === 'EMPTY') {
      setStatusBanner({ type: 'error', text: result.message });
      return;
    }

    setIsRunning(true);
    let idx = 1;

    timerRef.current = setInterval(() => {
      if (idx < result.steps.length) {
        const stepData = result.steps[idx];
        setMonkeyPos({
          row: stepData.row,
          col: stepData.col,
          dir: stepData.dir,
        });
        setCurrentStep(stepData.stepIndex);
        setActiveBlockIdx(stepData.blockIndex);
        idx++;
      } else {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setActiveBlockIdx(-1);

        if (result.status === 'SUCCESS') {
          saveLevelStars(currentLevelId, result.stars);
          setStatusBanner({
            type: 'success',
            text: 'Berhasil! Monyet sampai ke pisang!',
          });
          setWinStats({
            stars: result.stars,
            blocksUsed: result.blocksUsed,
            stepsCount: result.steps.length - 1,
          });
          setCompleteVisible(true);
        } else {
          setStatusBanner({ type: 'error', text: result.message });
          setTutorErrorMsg(result.message);
          setTutorVisible(true);
        }
      }
    }, 500);
  };

  const handleNextLevel = () => {
    setCompleteVisible(false);
    const nextId = currentLevelId + 1;
    const exists = GAME_LEVELS.some((l) => l.id === nextId);
    if (exists) {
      setCurrentLevelId(nextId);
    } else {
      navigation.goBack();
    }
  };

  const slots = Array.from(
    { length: levelData.maxBlocks },
    (_, i) => programBlocks[i] || null
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Atas */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>{'<'}</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.levelTitle}>{levelData.title}</Text>
            <Text style={styles.levelTopic}>{levelData.topic}</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setTutorErrorMsg('');
              setTutorVisible(true);
            }}
            style={styles.hintBtn}
          >
            <Text style={styles.hintBtnText}>Petunjuk</Text>
          </TouchableOpacity>
        </View>

        {/* Kotak Status */}
        <View
          style={[
            styles.bannerBox,
            statusBanner.type === 'error'
              ? styles.bannerError
              : statusBanner.type === 'success'
              ? styles.bannerSuccess
              : styles.bannerInfo,
          ]}
        >
          <Text
            style={[
              styles.bannerText,
              statusBanner.type === 'error'
                ? styles.bannerTextError
                : statusBanner.type === 'success'
                ? styles.bannerTextSuccess
                : styles.bannerTextInfo,
            ]}
          >
            {statusBanner.text}
          </Text>
        </View>

        {/* Papan Permainan */}
        <GameBoard
          grid={levelData.grid}
          monkeyPos={monkeyPos}
          currentStep={currentStep}
        />

        {/* Area Susunan Blok ("Program kamu") */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Program kamu</Text>
            <Text style={styles.sectionSubtitle}>
              {programBlocks.length}/{levelData.maxBlocks} blok, target bagus{' '}
              {levelData.targetBlocks}
            </Text>
          </View>

          {/* Grid 2 baris x 5 kolom */}
          <View style={styles.slotsGrid}>
            {slots.map((cmd, idx) => {
              const isExecuting = activeBlockIdx === idx;
              const styleObj = cmd ? BLOCK_STYLES[cmd] : null;

              return (
                <TouchableOpacity
                  key={`slot-${idx}`}
                  onPress={() => cmd && handleRemoveBlock(idx)}
                  disabled={!cmd || isRunning}
                  style={[
                    styles.slotBox,
                    cmd
                      ? { backgroundColor: styleObj.bg, borderStyle: 'solid' }
                      : styles.slotEmpty,
                    isExecuting && styles.slotExecuting,
                  ]}
                >
                  {cmd ? (
                    <Text numberOfLines={2} style={styles.slotFilledText}>
                      {styleObj.label}
                    </Text>
                  ) : (
                    <Text style={styles.slotEmptyText}>{idx + 1}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.helperCaption}>
            Ketuk blok di atas untuk menghapus
          </Text>
        </View>

        {/* Palet Blok Perintah */}
        <View style={[styles.sectionCard, { marginTop: 12 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Blok perintah</Text>
            <Text style={styles.sectionSubtitle}>Ketuk untuk menambah</Text>
          </View>

          <View style={styles.paletteRow}>
            {levelData.availableBlocks.map((cmd) => {
              const item = BLOCK_STYLES[cmd];
              return (
                <TouchableOpacity
                  key={cmd}
                  onPress={() => handleAddBlock(cmd)}
                  disabled={
                    isRunning || programBlocks.length >= levelData.maxBlocks
                  }
                  style={[styles.paletteBtn, { backgroundColor: item.bg }]}
                >
                  <Text style={styles.paletteBtnText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.controlRow}>
            <TouchableOpacity
              onPress={() => resetBoard(true)}
              disabled={isRunning}
              style={styles.resetBtn}
            >
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRunProgram}
              disabled={isRunning}
              style={[styles.runBtn, isRunning && styles.runBtnDisabled]}
            >
              <Text style={styles.runBtnText}>
                {isRunning ? 'Berjalan...' : '▶ Jalankan'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AiTutorModal
        visible={tutorVisible}
        hintLevel={hintLevel}
        hints={levelData.hints}
        errorMessage={tutorErrorMsg}
        onNextHint={() => setHintLevel((prev) => Math.min(prev + 1, 3))}
        onClose={() => setTutorVisible(false)}
      />

      <LevelCompleteModal
        visible={completeVisible}
        levelTitle={levelData.title}
        topic={levelData.topic}
        stars={winStats.stars}
        blocksUsed={winStats.blocksUsed}
        targetBlocks={levelData.targetBlocks}
        stepsCount={winStats.stepsCount}
        isLastLevel={currentLevelId >= GAME_LEVELS.length} // <-- cukup sisipkan 1 baris ini
        onRetry={() => {
          setCompleteVisible(false);
          resetBoard(false);
        }}
        onNextLevel={handleNextLevel}
        onBackToMap={() => {
          setCompleteVisible(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6CEC2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#26211D',
  },
  headerCenter: {
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#26211D',
  },
  levelTopic: {
    fontSize: 12,
    color: '#6E655F',
  },
  hintBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  hintBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  bannerBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  bannerInfo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D6CEC2',
  },
  bannerError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  bannerSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  bannerTextInfo: {
    color: '#3D352E',
  },
  bannerTextError: {
    color: '#B91C1C',
  },
  bannerTextSuccess: {
    color: '#15803D',
  },
  sectionCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6CEC2',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#26211D',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6E655F',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  slotBox: {
    width: '18.5%',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  slotEmpty: {
    backgroundColor: '#F8F5EE',
    borderStyle: 'dashed',
    borderColor: '#C7BEB0',
  },
  slotExecuting: {
    borderWidth: 2,
    borderColor: '#FACC15',
  },
  slotFilledText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  slotEmptyText: {
    fontSize: 11,
    color: '#B5ACA0',
  },
  helperCaption: {
    fontSize: 11,
    color: '#8C8278',
    textAlign: 'center',
    marginTop: 8,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  paletteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3EFE6',
    borderWidth: 1,
    borderColor: '#D6CEC2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D352E',
  },
  runBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2E5A27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  runBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});