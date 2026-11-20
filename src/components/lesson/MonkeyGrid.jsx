import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotHead from '../ui/MascotHead';

/**
 * Peta Kotak Monyet (Grid 3x3) untuk Modul 2 Pelajaran 2
 * Visual permainan ramah pemula dengan koordinat sumbu X dan Y yang jelas
 */
export default function MonkeyGrid({
  monyet = { x: 0, y: 0, arah: 'atas' },
  target = { x: 2, y: 2, label: 'Pisang' },
  ukuran = 3,
}) {
  const rows = [];
  for (let y = ukuran - 1; y >= 0; y--) {
    const cols = [];
    for (let x = 0; x < ukuran; x++) {
      const isMonkey = monyet.x === x && monyet.y === y;
      const isTarget = target.x === x && target.y === y;
      cols.push({ x, y, isMonkey, isTarget });
    }
    rows.push({ y, cols });
  }

  return (
    <View style={styles.container}>
      {/* Header Grid */}
      <View style={styles.headerRow}>
        <View style={styles.badgePill}>
          <Text style={styles.badgeIcon}>🗺️</Text>
          <Text style={styles.badgeText}>PETA KOTAK MONYET (3x3)</Text>
        </View>
        <Text style={styles.headerHint}>Monyet di (0,0) → Pisang di (2,2)</Text>
      </View>

      {/* Grid Container */}
      <View style={styles.gridWrap}>
        {rows.map(row => (
          <View key={`row-${row.y}`} style={styles.row}>
            {/* Label sumbu Y */}
            <View style={styles.axisYWrap}>
              <Text style={styles.axisYLabel}>y={row.y}</Text>
            </View>

            {row.cols.map(cell => (
              <View
                key={`cell-${cell.x}-${cell.y}`}
                style={[
                  styles.cell,
                  cell.isMonkey && styles.cellMonkey,
                  cell.isTarget && styles.cellTarget,
                ]}
              >
                {cell.isMonkey ? (
                  <View style={styles.monkeyWrapper}>
                    <MascotHead width={42} height={42} />
                    <View style={styles.directionPill}>
                      <Text style={styles.directionText}>▲ HADAP ATAS</Text>
                    </View>
                  </View>
                ) : cell.isTarget ? (
                  <View style={styles.targetWrapper}>
                    <Text style={styles.bananaEmoji}>🍌</Text>
                    <Text style={styles.targetLabel}>Pisang</Text>
                  </View>
                ) : (
                  <View style={styles.dot} />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Label sumbu X */}
        <View style={styles.axisXRow}>
          <View style={styles.axisCornerSpacer} />
          {Array.from({ length: ukuran }).map((_, x) => (
            <View key={`axis-x-${x}`} style={styles.axisXWrap}>
              <Text style={styles.axisXLabel}>x={x}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Legenda Keterangan */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#FEF9C3', borderColor: '#FACC15' }]} />
          <Text style={styles.legendText}>Posisi Awal Monyet: (0, 0)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }]} />
          <Text style={styles.legendText}>Lokasi Target Pisang: (2, 2)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginVertical: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#2F7D46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
    gap: 4,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.5,
  },
  headerHint: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  gridWrap: {
    alignItems: 'center',
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  axisYWrap: {
    width: 34,
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  axisYLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  cell: {
    width: 72,
    height: 72,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    margin: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellMonkey: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FACC15',
    borderWidth: 2.5,
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  cellTarget: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 2.5,
  },
  monkeyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionPill: {
    backgroundColor: '#CA8A04',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: -3,
  },
  directionText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  targetWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bananaEmoji: {
    fontSize: 24,
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#166534',
    marginTop: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  axisXRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  axisCornerSpacer: {
    width: 34,
  },
  axisXWrap: {
    width: 79,
    alignItems: 'center',
  },
  axisXLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1.5,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  legendText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
});
