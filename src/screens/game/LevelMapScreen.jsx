import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GAME_LEVELS } from '../../data/gameLevels';
import {
  getLevelStarsMap,
  getTotalStars,
  getUnlockedMaxLevel,
  syncGameProgressFromSupabase,
} from '../../utils/gameProgress';
import MascotHead from '../../components/ui/MascotHead';

export default function LevelMapScreen({ navigation }) {
  const [starsMap, setStarsMap] = useState({});
  const [totalStars, setTotalStars] = useState(0);
  const [unlockedMaxLevel, setUnlockedMaxLevel] = useState(1);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProgress = async () => {
        // 1. Tampilkan cache lokal terlebih dahulu agar instan
        setStarsMap(getLevelStarsMap());
        setTotalStars(getTotalStars());
        setUnlockedMaxLevel(getUnlockedMaxLevel(GAME_LEVELS.length));

        // 2. Sinkronkan dengan database Supabase
        await syncGameProgressFromSupabase();

        // 3. Perbarui UI dengan data terbaru dari Supabase
        if (isActive) {
          setStarsMap(getLevelStarsMap());
          setTotalStars(getTotalStars());
          setUnlockedMaxLevel(getUnlockedMaxLevel(GAME_LEVELS.length));
        }
      };

      loadProgress();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const reversedLevels = [...GAME_LEVELS].reverse();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Peta */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>{'<'}</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Permainan</Text>
            <Text style={styles.subtitle}>Peta menuju pisang</Text>
          </View>
        </View>

        <View style={styles.starBadge}>
          <Text style={styles.starBadgeText}>
            ⭐ {totalStars}/{GAME_LEVELS.length * 3} bintang
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tujuan Akhir: PISANG */}
        <View style={styles.goalCard}>
          <Text style={styles.goalEmoji}>🍌</Text>
          <Text style={styles.goalLabel}>PISANG EMAS</Text>
        </View>

        {/* Daftar Node Level Berliku */}
        {reversedLevels.map((lvl, index) => {
          const isUnlocked = lvl.id <= unlockedMaxLevel;
          const isCurrent = lvl.id === unlockedMaxLevel;
          const shiftX = index % 2 === 0 ? -40 : 40;
          const earnedStars = starsMap[lvl.id] || 0;

          return (
            <View
              key={lvl.id}
              style={[
                styles.nodeWrapper,
                { transform: [{ translateX: shiftX }] },
              ]}
            >
              <View style={styles.topicPill}>
                <Text style={styles.topicText}>{lvl.topic}</Text>
              </View>

              <View style={styles.nodeRow}>
                <TouchableOpacity
                  disabled={!isUnlocked}
                  onPress={() =>
                    navigation.navigate('Gameplay', { levelId: lvl.id })
                  }
                  style={[
                    styles.nodeCircle,
                    isCurrent
                      ? styles.nodeCurrent
                      : isUnlocked
                      ? styles.nodeUnlocked
                      : styles.nodeLocked,
                  ]}
                >
                  <Text style={styles.nodeNumber}>
                    {isUnlocked ? lvl.id : '🔒'}
                  </Text>
                </TouchableOpacity>

                {isCurrent && (
                  <View style={styles.mascotBubble}>
                    <MascotHead width={28} height={28} />
                  </View>
                )}
              </View>

              {/* Indikator 1–3 Bintang per Level */}
              <View style={styles.starsRow}>
                {[1, 2, 3].map((sIdx) => (
                  <Text
                    key={sIdx}
                    style={
                      sIdx <= earnedStars
                        ? styles.starEarned
                        : styles.starEmpty
                    }
                  >
                    {sIdx <= earnedStars ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5DEC9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6CEC2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#26211D',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#26211D',
  },
  subtitle: {
    fontSize: 12,
    color: '#6E655F',
  },
  starBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  starBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  scrollContent: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  goalCard: {
    backgroundColor: '#FEF08A',
    borderWidth: 2,
    borderColor: '#EAB308',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#854D0E',
    marginTop: 2,
  },
  nodeWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },
  topicPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6CEC2',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 6,
  },
  topicText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#574F49',
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    elevation: 3,
  },
  nodeCurrent: {
    backgroundColor: '#2E5A27',
    borderColor: '#A3E635',
  },
  nodeUnlocked: {
    backgroundColor: '#4D7C0F',
    borderColor: '#D9F99D',
  },
  nodeLocked: {
    backgroundColor: '#D1D5DB',
    borderColor: '#9CA3AF',
  },
  nodeNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mascotBubble: {
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2E5A27',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 6,
  },
  starEarned: {
    fontSize: 13,
  },
  starEmpty: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});