import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Polygon,
  Text as SvgText,
  G,
  Circle,
} from 'react-native-svg';

/**
 * Render visual diagram alur (flowchart) dengan tampilan menarik dan gamified
 * Simbol standar:
 * - Oval / Pill: Mulai / Selesai (Terminator)
 * - Persegi Panjang: Proses (Langkah Aksi)
 * - Jajar Genjang: Input / Output
 * - Belah Ketupat: Keputusan (Decision)
 * - Panah: Dibuat dengan garis + segitiga polygon eksplisit (100% konsisten di semua HP)
 */
export default function FlowchartRenderer({ node = [], sambungan = [] }) {
  if (!node || node.length === 0) return null;

  const isBranchingOrLoop =
    sambungan.some(s => !!s.label) || node.some(n => n.jenis === 'keputusan');

  const svgWidth = 330;
  const nodeWidth = 180;
  const nodeHeight = 46;
  const centerX = svgWidth / 2;

  // Hitung posisi Y untuk setiap node
  const nodePositions = {};
  let currentY = 16;
  const verticalSpacing = 44;

  node.forEach((n, idx) => {
    let x = centerX - nodeWidth / 2;
    let y = currentY;
    let w = nodeWidth;
    let h = nodeHeight;

    if (isBranchingOrLoop) {
      if (n.id === '3' && node.some(item => item.id === '4')) {
        // Cabang kiri (ya)
        w = 124;
        x = 20;
      } else if (n.id === '4' && node.some(item => item.id === '3')) {
        // Cabang kanan (tidak)
        w = 124;
        x = svgWidth - 124 - 20;
      }
    }

    nodePositions[n.id] = {
      x,
      y,
      w,
      h,
      cx: x + w / 2,
      cy: y + h / 2,
      top: y,
      bottom: y + h,
      left: x,
      right: x + w,
      jenis: n.jenis,
      label: n.label,
    };

    if (isBranchingOrLoop && n.id === '3') {
      // sejajar dengan node 4
    } else {
      currentY += nodeHeight + verticalSpacing;
    }
  });

  const totalHeight = currentY + 14;

  return (
    <View style={styles.cardContainer}>
      {/* Header Kotak Diagram */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeIcon}>🧭</Text>
            <Text style={styles.badgeText}>DIAGRAM ALUR LOGIKA</Text>
          </View>
        </View>
        <Text style={styles.headerHint}>Ikuti alur panah ↓</Text>
      </View>

      <Svg width="100%" height={totalHeight} viewBox={`0 0 ${svgWidth} ${totalHeight}`}>
        {/* ── 1. SAMBUNGAN & PANAH EKSPLISIT ────────────────────────── */}
        {sambungan.map((edge, idx) => {
          const from = nodePositions[edge.dari];
          const to = nodePositions[edge.ke];
          if (!from || !to) return null;

          let pathD = '';
          let arrowHeadPoints = '';
          let labelX = (from.cx + to.cx) / 2;
          let labelY = (from.bottom + to.top) / 2;

          // Kasus 1: Panah lurus vertikal ke bawah
          if (Math.abs(from.cx - to.cx) < 5 && from.bottom < to.top) {
            pathD = `M ${from.cx} ${from.bottom} L ${to.cx} ${to.top - 6}`;
            arrowHeadPoints = `${to.cx - 5},${to.top - 6} ${to.cx + 5},${to.top - 6} ${to.cx},${to.top}`;
          }
          // Kasus 2: Percabangan kiri / kanan
          else if (from.bottom <= to.top) {
            const midY = from.bottom + 16;
            pathD = `M ${from.cx} ${from.bottom} L ${from.cx} ${midY} L ${to.cx} ${midY} L ${to.cx} ${to.top - 6}`;
            arrowHeadPoints = `${to.cx - 5},${to.top - 6} ${to.cx + 5},${to.top - 6} ${to.cx},${to.top}`;
            labelX = (from.cx + to.cx) / 2;
            labelY = midY - 8;
          }
          // Kasus 3: Penggabungan cabang ke Selesai
          else if (from.bottom < to.top + 20) {
            const midY = to.top - 14;
            pathD = `M ${from.cx} ${from.bottom} L ${from.cx} ${midY} L ${to.cx} ${midY} L ${to.cx} ${to.top - 6}`;
            arrowHeadPoints = `${to.cx - 5},${to.top - 6} ${to.cx + 5},${to.top - 6} ${to.cx},${to.top}`;
          }
          // Kasus 4: Loop kembali ke atas (Modul 4)
          else if (from.top > to.bottom) {
            const loopX = from.right + 22;
            pathD = `M ${from.right} ${from.cy} L ${loopX} ${from.cy} L ${loopX} ${to.cy} L ${to.right + 6} ${to.cy}`;
            arrowHeadPoints = `${to.right + 6},${to.cy - 5} ${to.right + 6},${to.cy + 5} ${to.right},${to.cy}`;
            labelX = loopX - 2;
            labelY = (from.cy + to.cy) / 2;
          } else {
            pathD = `M ${from.cx} ${from.bottom} L ${to.cx} ${to.top - 6}`;
            arrowHeadPoints = `${to.cx - 5},${to.top - 6} ${to.cx + 5},${to.top - 6} ${to.cx},${to.top}`;
          }

          const isYes = edge.label && edge.label.toLowerCase() === 'ya';

          return (
            <G key={`edge-${idx}`}>
              {/* Garis Panah */}
              <Path
                d={pathD}
                stroke="#64748B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Kepala Panah (Segitiga Tajam Presisi) */}
              {arrowHeadPoints ? (
                <Polygon points={arrowHeadPoints} fill="#475569" />
              ) : null}

              {/* Label Percabangan (Ya / Tidak) */}
              {edge.label ? (
                <G>
                  <Rect
                    x={labelX - 18}
                    y={labelY - 10}
                    width={36}
                    height={20}
                    rx={10}
                    fill={isYes ? '#DCFCE7' : '#FEE2E2'}
                    stroke={isYes ? '#22C55E' : '#EF4444'}
                    strokeWidth="1.5"
                  />
                  <SvgText
                    x={labelX}
                    y={labelY + 4}
                    fontSize="10"
                    fontWeight="800"
                    fill={isYes ? '#15803D' : '#B91C1C'}
                    textAnchor="middle"
                  >
                    {edge.label.toUpperCase()}
                  </SvgText>
                </G>
              ) : null}
            </G>
          );
        })}

        {/* ── 2. BENTUK SIMBOL NODE (DENGAN KEDALAMAN 3D) ───────────── */}
        {node.map(n => {
          const pos = nodePositions[n.id];
          if (!pos) return null;

          const { x, y, w, h, cx, cy, jenis, label } = pos;

          return (
            <G key={`node-${n.id}`}>
              {/* 1. OVAL (MULAI / SELESAI) */}
              {(jenis === 'mulai' || jenis === 'selesai') && (
                <G>
                  {/* Efek Shadow Bawah */}
                  <Rect
                    x={x}
                    y={y + 3}
                    width={w}
                    height={h}
                    rx={h / 2}
                    ry={h / 2}
                    fill={jenis === 'mulai' ? '#15803D' : '#B91C1C'}
                    opacity={0.3}
                  />
                  {/* Bentuk Utama */}
                  <Rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx={h / 2}
                    ry={h / 2}
                    fill={jenis === 'mulai' ? '#DCFCE7' : '#FEE2E2'}
                    stroke={jenis === 'mulai' ? '#16A34A' : '#DC2626'}
                    strokeWidth="2.5"
                  />
                  {/* Bulatan Aksen Mini */}
                  <Circle
                    cx={x + 18}
                    cy={cy}
                    r="4.5"
                    fill={jenis === 'mulai' ? '#16A34A' : '#DC2626'}
                  />
                </G>
              )}

              {/* 2. PERSEGI PANJANG (PROSES / LANGKAH) */}
              {jenis === 'proses' && (
                <G>
                  {/* Shadow Bawah */}
                  <Rect
                    x={x}
                    y={y + 3}
                    width={w}
                    height={h}
                    rx={12}
                    ry={12}
                    fill="#1D4ED8"
                    opacity={0.2}
                  />
                  {/* Bentuk Utama */}
                  <Rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx={12}
                    ry={12}
                    fill="#EFF6FF"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                  />
                  {/* Garis Aksen Atas */}
                  <Rect
                    x={x + 12}
                    y={y}
                    width={w - 24}
                    height={3}
                    rx={1.5}
                    fill="#2563EB"
                  />
                </G>
              )}

              {/* 3. JAJAR GENJANG (INPUT / OUTPUT) */}
              {jenis === 'io' && (
                <G>
                  {/* Shadow Bawah */}
                  <Polygon
                    points={`${x + 14},${y + 3} ${x + w},${y + 3} ${x + w - 14},${y + h + 3} ${x},${y + h + 3}`}
                    fill="#B45309"
                    opacity={0.2}
                  />
                  {/* Bentuk Utama */}
                  <Polygon
                    points={`${x + 14},${y} ${x + w},${y} ${x + w - 14},${y + h} ${x},${y + h}`}
                    fill="#FEF3C7"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                  />
                </G>
              )}

              {/* 4. BELAH KETUPAT (KEPUTUSAN / PERTANYAAN) */}
              {jenis === 'keputusan' && (
                <G>
                  {/* Shadow Bawah */}
                  <Polygon
                    points={`${cx},${y + 3} ${x + w},${cy + 3} ${cx},${y + h + 3} ${x},${cy + 3}`}
                    fill="#7E22CE"
                    opacity={0.25}
                  />
                  {/* Bentuk Utama */}
                  <Polygon
                    points={`${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`}
                    fill="#FAF5FF"
                    stroke="#A855F7"
                    strokeWidth="2.5"
                  />
                </G>
              )}

              {/* TEKS DI DALAM SIMBOL */}
              <SvgText
                x={cx}
                y={cy + 4.5}
                fontSize={label.length > 22 ? '10.5' : '11.5'}
                fontWeight="800"
                fill="#1E293B"
                textAnchor="middle"
                letterSpacing="0.2"
              >
                {label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
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
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  headerHint: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
