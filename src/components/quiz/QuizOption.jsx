import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { IconCheck } from '../ui/Icons';

/**
 * Komponen Pilihan Ganda / Tebak Keluaran
 */
export default function QuizOption({
  option,
  index,
  isSelected,
  isCorrect,
  isWrong,
  isAnswerSubmitted,
  onSelect,
}) {
  const optionLetters = ['A', 'B', 'C', 'D', 'E'];
  const letter = optionLetters[index] || `${index + 1}`;

  return (
    <TouchableOpacity
      activeOpacity={isAnswerSubmitted ? 1 : 0.75}
      disabled={isAnswerSubmitted}
      onPress={() => onSelect(option)}
      style={[
        styles.optionCard,
        isSelected && !isAnswerSubmitted && styles.optionSelected,
        isAnswerSubmitted && isCorrect && styles.optionCorrect,
        isAnswerSubmitted && isWrong && styles.optionWrong,
      ]}
    >
      <View
        style={[
          styles.letterCircle,
          isSelected && !isAnswerSubmitted && styles.letterCircleSelected,
          isAnswerSubmitted && isCorrect && styles.letterCircleCorrect,
          isAnswerSubmitted && isWrong && styles.letterCircleWrong,
        ]}
      >
        {isAnswerSubmitted && isCorrect ? (
          <IconCheck size={14} color="#FFFFFF" />
        ) : (
          <Text
            style={[
              styles.letterText,
              isSelected && !isAnswerSubmitted && styles.letterTextSelected,
              isAnswerSubmitted && isCorrect && styles.letterTextCorrect,
              isAnswerSubmitted && isWrong && styles.letterTextWrong,
            ]}
          >
            {letter}
          </Text>
        )}
      </View>

      <Text
        style={[
          styles.optionText,
          isSelected && !isAnswerSubmitted && styles.optionTextSelected,
          isAnswerSubmitted && isCorrect && styles.optionTextCorrect,
          isAnswerSubmitted && isWrong && styles.optionTextWrong,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CBD5E1',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  optionSelected: {
    borderColor: '#2F7D46',
    borderBottomColor: '#1E5E3A',
    backgroundColor: '#F0FDF4',
  },
  optionCorrect: {
    borderColor: '#16A34A',
    borderBottomColor: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  optionWrong: {
    borderColor: '#DC2626',
    borderBottomColor: '#B91C1C',
    backgroundColor: '#FEE2E2',
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  letterCircleSelected: {
    backgroundColor: '#2F7D46',
  },
  letterCircleCorrect: {
    backgroundColor: '#16A34A',
  },
  letterCircleWrong: {
    backgroundColor: '#DC2626',
  },
  letterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  letterTextSelected: {
    color: '#FFFFFF',
  },
  letterTextCorrect: {
    color: '#FFFFFF',
  },
  letterTextWrong: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 20,
  },
  optionTextSelected: {
    color: '#14532D',
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#14532D',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#7F1D1D',
  },
});
