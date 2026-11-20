import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconChevronUp, IconChevronDown } from '../ui/Icons';

/**
 * Komponen Susun Urutan Langkah (Reordering Question)
 */
export default function OrderQuestion({
  items = [],
  isAnswerSubmitted = false,
  onOrderChange,
}) {
  const moveItem = (index, direction) => {
    if (isAnswerSubmitted) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    onOrderChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hintText}>
        Gunakan tombol panah untuk menyusun urutan langkah dari awal hingga akhir:
      </Text>

      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        return (
          <View key={`item-${index}`} style={styles.itemCard}>
            {/* Nomor Urut */}
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>

            {/* Teks Langkah */}
            <Text style={styles.itemText}>{item}</Text>

            {/* Tombol Geser Atas / Bawah */}
            {!isAnswerSubmitted && (
              <View style={styles.actionsCol}>
                <TouchableOpacity
                  style={[styles.arrowBtn, isFirst && styles.arrowBtnDisabled]}
                  disabled={isFirst}
                  onPress={() => moveItem(index, -1)}
                  accessibilityLabel="Pindah ke atas"
                >
                  <IconChevronUp size={16} color={isFirst ? '#CBD5E1' : '#334155'} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.arrowBtn, isLast && styles.arrowBtnDisabled]}
                  disabled={isLast}
                  onPress={() => moveItem(index, 1)}
                  accessibilityLabel="Pindah ke bawah"
                >
                  <IconChevronDown size={16} color={isLast ? '#CBD5E1' : '#334155'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  hintText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF08A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#854D0E',
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 19,
    paddingRight: 8,
  },
  actionsCol: {
    flexDirection: 'column',
    gap: 4,
  },
  arrowBtn: {
    width: 32,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  arrowBtnDisabled: {
    opacity: 0.35,
    backgroundColor: '#F8FAFC',
  },
});
