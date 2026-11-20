import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

/**
 * Editor teks sederhana untuk soal perbaiki_kode dan buat_program
 * Dilengkapi tombol "Lihat contoh jawaban"
 */
export default function CodeQuestion({
  value = '',
  kunci = '',
  petunjukKode = '',
  isAnswerSubmitted = false,
  onChangeText,
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <View style={styles.container}>
      {/* Editor Teks Sederhana */}
      <View style={styles.editorBox}>
        <View style={styles.editorHeader}>
          <Text style={styles.editorHeaderTitle}>KODE JAWABAN</Text>
          <TouchableOpacity
            style={styles.btnToggleAnswer}
            activeOpacity={0.7}
            onPress={() => setShowAnswer(!showAnswer)}
          >
            <Text style={styles.btnToggleAnswerText}>
              {showAnswer ? 'Tutup Contoh' : '💡 Lihat Contoh Jawaban'}
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textInput}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          placeholder="Tulis kode jawabanmu di sini..."
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          editable={!isAnswerSubmitted}
        />
      </View>

      {/* Kartu Contoh Jawaban (Saat tombol ditekan) */}
      {showAnswer && (
        <View style={styles.sampleAnswerCard}>
          <View style={styles.sampleHeaderRow}>
            <Text style={styles.sampleHeaderTitle}>CONTOH JAWABAN BENAR:</Text>
          </View>
          <Text style={styles.sampleCodeText}>{kunci}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  editorBox: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  editorHeaderTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  btnToggleAnswer: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  btnToggleAnswerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FACC15',
  },
  textInput: {
    minHeight: 120,
    maxHeight: 220,
    padding: 14,
    fontSize: 13.5,
    fontFamily: 'monospace',
    color: '#F8FAFC',
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  sampleAnswerCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  sampleHeaderRow: {
    marginBottom: 6,
  },
  sampleHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    letterSpacing: 0.5,
  },
  sampleCodeText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#14532D',
    lineHeight: 19,
  },
});
