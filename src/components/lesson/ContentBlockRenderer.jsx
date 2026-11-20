import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CodeBlock from './CodeBlock';
import FlowchartRenderer from './FlowchartRenderer';
import MonkeyGrid from './MonkeyGrid';
import MascotHead from '../ui/MascotHead';

/**
 * Parser teks inline sederhana untuk merender **tebal** dan `kode`
 */
export function FormattedText({ text, style, codeStyle }) {
  if (!text) return null;

  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push({
        type: 'normal',
        text: text.substring(lastIdx, match.index),
      });
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      parts.push({
        type: 'bold',
        text: matchedStr.slice(2, -2),
      });
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      parts.push({
        type: 'code',
        text: matchedStr.slice(1, -1),
      });
    }

    lastIdx = regex.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push({
      type: 'normal',
      text: text.substring(lastIdx),
    });
  }

  return (
    <Text style={[styles.defaultText, style]}>
      {parts.map((p, idx) => {
        if (p.type === 'bold') {
          return (
            <Text key={idx} style={styles.boldText}>
              {p.text}
            </Text>
          );
        }
        if (p.type === 'code') {
          return (
            <Text key={idx} style={[styles.inlineCode, codeStyle]}>
              {' '}{p.text}{' '}
            </Text>
          );
        }
        return <Text key={idx}>{p.text}</Text>;
      })}
    </Text>
  );
}

/**
 * Menghitung lebar kolom proporsional agar tabel tidak tertekan di layar HP
 */
function getColumnWidth(kolomName, colIdx, totalCols) {
  if (totalCols <= 2) return null;
  const name = (kolomName || '').toLowerCase();
  if (name.includes('simbol') || name.includes('operator') || name.includes('baris') || name.includes('langkah')) {
    return 105;
  }
  if (name.includes('nama') || name.includes('tipe') || name.includes('fungsi') || name.includes('posisi')) {
    return 120;
  }
  if (name.includes('contoh') || name.includes('hasil') || name.includes('perintah') || name.includes('penulisan')) {
    return 135;
  }
  if (name.includes('kegunaan') || name.includes('arti') || name.includes('situasi')) {
    return 160;
  }
  return 125;
}

/**
 * Renderer blok konten dinamis dengan tampilan estetis & interaktif
 */
export default function ContentBlockRenderer({ block }) {
  if (!block) return null;

  switch (block.tipe) {
    case 'teks':
      return (
        <View style={styles.textWrap}>
          <FormattedText text={block.isi} style={styles.paragraph} />
        </View>
      );

    case 'pseudocode':
    case 'kode':
      return <CodeBlock block={block} />;

    case 'diagram':
      return (
        <FlowchartRenderer
          node={block.node || []}
          sambungan={block.sambungan || []}
        />
      );

    case 'grid_monyet':
      return (
        <MonkeyGrid
          monyet={block.monyet}
          target={block.target}
          ukuran={block.ukuran}
        />
      );

    case 'tabel': {
      const kolom = block.kolom || [];
      const baris = block.baris || [];
      const isMultiCol = kolom.length > 2;

      const renderTableGrid = () => (
        <View style={isMultiCol ? { minWidth: Math.max(340, kolom.length * 120) } : { width: '100%' }}>
          {/* Header Tabel */}
          <View style={styles.tableHeaderRow}>
            {kolom.map((col, idx) => {
              const width = getColumnWidth(col, idx, kolom.length);
              return (
                <View
                  key={idx}
                  style={[
                    styles.tableHeaderCellWrap,
                    width ? { width } : { flex: idx === 0 ? 1 : 1.4 },
                    idx === kolom.length - 1 && styles.tableCellLastCol,
                  ]}
                >
                  <Text style={styles.tableHeaderCellText}>{col}</Text>
                </View>
              );
            })}
          </View>

          {/* Baris-baris Data */}
          {baris.map((row, rIdx) => (
            <View
              key={rIdx}
              style={[
                styles.tableRow,
                rIdx % 2 === 1 && styles.tableRowEven,
                rIdx === baris.length - 1 && styles.tableRowLast,
              ]}
            >
              {row.map((cell, cIdx) => {
                const width = getColumnWidth(kolom[cIdx] || '', cIdx, kolom.length);
                return (
                  <View
                    key={cIdx}
                    style={[
                      styles.tableCellWrap,
                      width ? { width } : { flex: cIdx === 0 ? 1 : 1.4 },
                      cIdx === row.length - 1 && styles.tableCellLastCol,
                    ]}
                  >
                    <FormattedText text={cell} style={styles.tableCellText} />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      );

      return (
        <View style={styles.tableCard}>
          {isMultiCol && (
            <View style={styles.tableScrollHintRow}>
              <Text style={styles.tableScrollHintText}>👉 Geser tabel ke samping untuk melihat lengkap</Text>
            </View>
          )}

          {isMultiCol ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              nestedScrollEnabled={true}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {renderTableGrid()}
            </ScrollView>
          ) : (
            renderTableGrid()
          )}
        </View>
      );
    }

    case 'catatan':
      return (
        <View style={styles.mascotCalloutCard}>
          <View style={styles.mascotCalloutHeader}>
            <View style={styles.mascotAvatarWrap}>
              <MascotHead width={36} height={36} />
            </View>
            <View style={styles.mascotCalloutTitleWrap}>
              <Text style={styles.mascotCalloutTitle}>Tips dari MangKi</Text>
              <View style={styles.mascotPill}>
                <Text style={styles.mascotPillText}>💡 CATATAN PENTING</Text>
              </View>
            </View>
          </View>

          <View style={styles.mascotCalloutBody}>
            <FormattedText text={block.isi} style={styles.calloutText} />
          </View>
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  textWrap: {
    marginVertical: 6,
  },
  defaultText: {
    fontSize: 15.5,
    color: '#27272A',
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 15.5,
    color: '#27272A',
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  inlineCode: {
    fontFamily: 'monospace',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    fontWeight: '800',
    fontSize: 13.5,
    borderRadius: 6,
    paddingHorizontal: 5,
  },

  // ── TABEL ESTETIS DENGAN HORIZONTAL SCROLL ──────────────────────
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginVertical: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tableScrollHintRow: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  tableScrollHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 2,
    borderBottomColor: '#CBD5E1',
  },
  tableHeaderCellWrap: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    justifyContent: 'center',
  },
  tableHeaderCellText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#F8FAFC',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCellWrap: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    justifyContent: 'center',
  },
  tableCellLastCol: {
    borderRightWidth: 0,
  },
  tableCellText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },

  // ── CALLOUT MASKOT MANGKI (TIPS & CATATAN) ───────────────────
  mascotCalloutCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
    padding: 16,
    marginVertical: 14,
    shadowColor: '#CA8A04',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  mascotCalloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mascotAvatarWrap: {
    marginRight: 10,
  },
  mascotCalloutTitleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  mascotCalloutTitle: {
    fontFamily: 'FeatherBold',
    fontSize: 15,
    color: '#92400E',
  },
  mascotPill: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FACC15',
  },
  mascotPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#854D0E',
    letterSpacing: 0.4,
  },
  mascotCalloutBody: {
    marginTop: 2,
  },
  calloutText: {
    fontSize: 14.5,
    color: '#78350F',
    lineHeight: 22,
    fontWeight: '500',
  },
});
