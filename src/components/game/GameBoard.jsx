import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotHead from '../ui/MascotHead';

const ROTATION_MAP = {
  UP: '0deg',
  RIGHT: '90deg',
  DOWN: '180deg',
  LEFT: '270deg',
};

export default function GameBoard({ grid, monkeyPos, currentStep }) {
  return (
    <View style={styles.boardCard}>
      {/* Badge Penghitung Langkah */}
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>Langkah {currentStep}</Text>
      </View>

      {/* Grid Papan */}
      <View style={styles.gridWrapper}>
        {grid.map((rowItems, rIdx) => (
          <View key={`row-${rIdx}`} style={styles.gridRow}>
            {rowItems.map((cell, cIdx) => {
              const isMonkeyHere =
                monkeyPos.row === rIdx && monkeyPos.col === cIdx;
              const isPath = cell !== 0;

              const hasTop = rIdx > 0 && grid[rIdx - 1][cIdx] !== 0;
              const hasBottom = rIdx < grid.length - 1 && grid[rIdx + 1][cIdx] !== 0;
              const hasLeft = cIdx > 0 && grid[rIdx][cIdx - 1] !== 0;
              const hasRight = cIdx < rowItems.length - 1 && grid[rIdx][cIdx + 1] !== 0;

              return (
                <View key={`cell-${rIdx}-${cIdx}`} style={styles.cell}>
                  {/* Garis Tali Liana */}
                  {isPath && (
                    <>
                      {hasTop && <View style={styles.ropeTop} />}
                      {hasBottom && <View style={styles.ropeBottom} />}
                      {hasLeft && <View style={styles.ropeLeft} />}
                      {hasRight && <View style={styles.ropeRight} />}
                      <View style={styles.ropeNode} />
                    </>
                  )}

                  {/* Sarang Lebah (2) */}
                  {cell === 2 && !isMonkeyHere && (
                    <View style={styles.beehiveBox}>
                      <Text style={styles.emojiMedium}>🐝</Text>
                    </View>
                  )}

                  {/* Pisang Tujuan (3) */}
                  {cell === 3 && !isMonkeyHere && (
                    <View style={styles.bananaBox}>
                      <Text style={styles.emojiLarge}>🍌</Text>
                    </View>
                  )}

                  {/* Karakter Monyet (M) */}
                  {isMonkeyHere && (
                    <View
                      style={[
                        styles.monkeyWrapper,
                        {
                          transform: [
                            { rotate: ROTATION_MAP[monkeyPos.dir] || '0deg' },
                          ],
                        },
                      ]}
                    >
                      <MascotHead width={32} height={32} />
                      <View style={styles.directionArrow} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Legenda Bawah */}
      <Text style={styles.legendText}>
        🐵 monyet   🍌 pisang   🐝 sarang lebah
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  boardCard: {
    backgroundColor: '#F8F5EE',
    borderWidth: 2,
    borderColor: '#D6CEC2',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stepBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D6CEC2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    zIndex: 10,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3D352E',
  },
  gridWrapper: {
    marginVertical: 14,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ropeTop: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: '50%',
    backgroundColor: '#7A8450',
  },
  ropeBottom: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: '50%',
    backgroundColor: '#7A8450',
  },
  ropeLeft: {
    position: 'absolute',
    left: 0,
    height: 8,
    width: '50%',
    backgroundColor: '#7A8450',
  },
  ropeRight: {
    position: 'absolute',
    right: 0,
    height: 8,
    width: '50%',
    backgroundColor: '#7A8450',
  },
  ropeNode: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#5C6638',
  },
  beehiveBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE68A',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  bananaBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF08A',
    borderWidth: 2,
    borderColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  emojiMedium: {
    fontSize: 16,
  },
  emojiLarge: {
    fontSize: 18,
  },
  monkeyWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#2E5A27',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 4,
  },
  directionArrow: {
    position: 'absolute',
    top: -5,
    width: 10,
    height: 10,
    backgroundColor: '#2E5A27',
    transform: [{ rotate: '45deg' }],
  },
  legendText: {
    fontSize: 12,
    color: '#6E655F',
    fontWeight: '600',
    marginTop: 4,
  },
});