import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MascotHead from '../ui/MascotHead';

export default function LevelCompleteModal({
  visible,
  levelTitle,
  topic,
  stars,
  blocksUsed,
  targetBlocks,
  stepsCount,
  isLastLevel = false,
  onRetry,
  onNextLevel,
  onBackToMap,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.mascotBox}>
            <MascotHead width={68} height={68} />
          </View>

          <Text style={styles.title}>
            {isLastLevel ? 'Selamat, Tamat!' : 'Hebat sekali!'}
          </Text>
          <Text style={styles.subtitle}>
            {isLastLevel
              ? 'Kamu telah mencapai level akhir dan mendapatkan Pisang Emas!'
              : `${levelTitle} (${topic}) selesai`}
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3].map((idx) => (
              <Text key={idx} style={styles.starIcon}>
                {idx <= stars ? '⭐' : '☆'}
              </Text>
            ))}
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Blok dipakai</Text>
              <Text style={styles.statValue}>{blocksUsed}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Target 3 bintang</Text>
              <Text style={styles.statValue}>{targetBlocks} blok</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Langkah dijalankan</Text>
              <Text style={styles.statValue}>{stepsCount}</Text>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Catatan Tutor AI: </Text>
              {isLastLevel
                ? 'Luar biasa! Semua tantangan logika berhasil kamu taklukkan.'
                : blocksUsed <= targetBlocks
                ? 'Susunan blokmu sudah sangat efisien!'
                : `Level ini bisa selesai dengan ${targetBlocks} blok.`}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onRetry} style={styles.btnOutline}>
              <Text style={styles.btnOutlineText}>Ulangi</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onNextLevel} style={styles.btnFill}>
              <Text style={styles.btnFillText}>
                {isLastLevel ? 'Selesai' : 'Lanjut Level'}
              </Text>
            </TouchableOpacity>
          </View>

          {!isLastLevel && (
            <TouchableOpacity onPress={onBackToMap}>
              <Text style={styles.backLink}>Kembali ke peta</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D6CEC2',
  },
  mascotBox: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: '#E8F3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#2E5A27',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#26211D',
  },
  subtitle: {
    fontSize: 13,
    color: '#6E655F',
    marginTop: 4,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 14,
  },
  starIcon: {
    fontSize: 32,
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#F8F5EE',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5DEC9',
    gap: 8,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 12,
    color: '#6E655F',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#26211D',
  },
  noteBox: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#A89F91',
    borderRadius: 12,
    padding: 10,
    marginBottom: 18,
  },
  noteText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#574F49',
  },
  noteBold: {
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 12,
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2E5A27',
    alignItems: 'center',
  },
  btnOutlineText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#2E5A27',
  },
  btnFill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2E5A27',
    alignItems: 'center',
  },
  btnFillText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
  backLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E655F',
    textDecorationLine: 'underline',
  },
});