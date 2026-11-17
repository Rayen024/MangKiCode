import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import MascotHead from '../ui/MascotHead';

export default function AiTutorModal({
  visible,
  hintLevel,
  hints,
  errorMessage,
  onNextHint,
  onClose,
}) {
  const activeHintText =
    hints && hints[hintLevel - 1]
      ? hints[hintLevel - 1]
      : 'Periksa kembali urutan blok dan arah hadap monyet di papan.';

  const isMaxHint = hintLevel >= (hints?.length || 3);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <View style={styles.tutorInfo}>
              <View style={styles.avatarCircle}>
                <MascotHead width={32} height={32} />
              </View>
              <View>
                <Text style={styles.tutorTitle}>Tutor AI</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Perlu diperbaiki</Text>
                </View>
              </View>
            </View>

            <Text style={styles.hintCounter}>
              Petunjuk {hintLevel} dari {hints?.length || 3}
            </Text>
          </View>

          <View style={styles.messageBox}>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            <Text style={styles.hintText}>{activeHintText}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Perbaiki Blok</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNextHint}
              disabled={isMaxHint}
              style={[
                styles.btnSecondary,
                isMaxHint && styles.btnSecondaryDisabled,
              ]}
            >
              <Text
                style={[
                  styles.btnSecondaryText,
                  isMaxHint && styles.btnSecondaryTextDisabled,
                ]}
              >
                Petunjuk Lanjut
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 2,
    borderColor: '#D6CEC2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tutorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F3E8',
    borderWidth: 1,
    borderColor: '#2E5A27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#26211D',
  },
  statusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  hintCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E655F',
  },
  messageBox: {
    backgroundColor: '#F8F5EE',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5DEC9',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#3D352E',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#2E5A27',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E5A27',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondaryDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  btnSecondaryText: {
    color: '#2E5A27',
    fontWeight: '700',
    fontSize: 14,
  },
  btnSecondaryTextDisabled: {
    color: '#9CA3AF',
  },
});