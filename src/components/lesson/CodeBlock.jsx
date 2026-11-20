import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

/**
 * Tokenizer sederhana untuk syntax highlight Python di React Native
 */
function highlightPythonLine(line) {
  if (line.trim().startsWith('#')) {
    return <Text style={styles.tokenComment}>{line}</Text>;
  }

  const keywords = new Set([
    'def', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'range',
    'break', 'continue', 'and', 'or', 'not', 'True', 'False', 'None',
    'print', 'input', 'int', 'float', 'str', 'type'
  ]);

  // Regex memecah string ("...", '...'), angka, dan kata-kata
  const regex = /("[^"]*"|'[^']*'|#.*$|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[+\-*/%=<>!]+|[^\s\w]+|\s+)/g;
  const tokens = [];
  let match;

  while ((match = regex.exec(line)) !== null) {
    const token = match[0];
    if (token.startsWith('#')) {
      tokens.push({ type: 'comment', value: token });
    } else if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      tokens.push({ type: 'string', value: token });
    } else if (/^\d+(\.\d+)?$/.test(token)) {
      tokens.push({ type: 'number', value: token });
    } else if (keywords.has(token)) {
      tokens.push({ type: 'keyword', value: token });
    } else if (/^[+\-*/%=<>!]+$/.test(token)) {
      tokens.push({ type: 'operator', value: token });
    } else {
      tokens.push({ type: 'default', value: token });
    }
  }

  return tokens.map((t, i) => {
    switch (t.type) {
      case 'comment':
        return <Text key={i} style={styles.tokenComment}>{t.value}</Text>;
      case 'string':
        return <Text key={i} style={styles.tokenString}>{t.value}</Text>;
      case 'number':
        return <Text key={i} style={styles.tokenNumber}>{t.value}</Text>;
      case 'keyword':
        return <Text key={i} style={styles.tokenKeyword}>{t.value}</Text>;
      case 'operator':
        return <Text key={i} style={styles.tokenOperator}>{t.value}</Text>;
      default:
        return <Text key={i} style={styles.tokenDefault}>{t.value}</Text>;
    }
  });
}

export default function CodeBlock({ block }) {
  if (!block) return null;

  const isPseudo = block.tipe === 'pseudocode';
  const lines = isPseudo ? block.baris || [] : (block.isi || '').split('\n');

  return (
    <View style={[styles.windowContainer, isPseudo ? styles.pseudoWindow : styles.codeWindow]}>
      {/* ── WINDOW TITLE BAR (macOS Style) ───────────────────────── */}
      <View style={styles.windowHeader}>
        {/* Bulatan macOS */}
        <View style={styles.macDotsRow}>
          <View style={[styles.macDot, { backgroundColor: '#FF5F56' }]} />
          <View style={[styles.macDot, { backgroundColor: '#FFBD2E' }]} />
          <View style={[styles.macDot, { backgroundColor: '#27C93F' }]} />
        </View>

        {/* Label Badge */}
        <View style={[styles.badgePill, isPseudo ? styles.pseudoPill : styles.codePill]}>
          <Text style={styles.badgeText}>
            {isPseudo ? '📝 PSEUDOCODE' : '🐍 PYTHON 3'}
          </Text>
        </View>

        {/* Indikator Baris */}
        <Text style={styles.linesCount}>{lines.length} baris</Text>
      </View>

      {/* ── ISI KODE DENGAN HORIZONTAL SCROLL AGAR KOMENTAR TIDAK PATAH ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.codeScrollInner}
      >
        <View style={styles.codeBody}>
          {lines.map((line, index) => (
            <View key={index} style={styles.lineRow}>
              {/* Nomor Baris */}
              <Text style={styles.lineNumber}>{index + 1}</Text>

              {/* Isi Baris */}
              <View style={styles.lineContent}>
                {isPseudo ? (
                  <Text style={styles.pseudoLineText}>{line}</Text>
                ) : (
                  <Text style={styles.codeLineText}>{highlightPythonLine(line)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  windowContainer: {
    borderRadius: 18,
    marginVertical: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  pseudoWindow: {
    backgroundColor: '#24140D',
    borderWidth: 2,
    borderColor: '#78350F',
  },
  codeWindow: {
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  windowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  macDotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  macDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pseudoPill: {
    backgroundColor: '#78350F',
  },
  codePill: {
    backgroundColor: '#0369A1',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  linesCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  codeScrollInner: {
    flexGrow: 1,
  },
  codeBody: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    minWidth: '100%',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1.5,
  },
  lineNumber: {
    width: 26,
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'monospace',
    textAlign: 'right',
    marginRight: 10,
    paddingRight: 6,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  lineContent: {
    paddingLeft: 4,
    paddingRight: 14,
  },
  pseudoLineText: {
    fontSize: 13.5,
    color: '#FDE68A',
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  codeLineText: {
    fontSize: 13.5,
    fontFamily: 'monospace',
    lineHeight: 22,
  },

  // Token Syntax Highlighting
  tokenDefault: {
    color: '#F8FAFC',
  },
  tokenKeyword: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  tokenString: {
    color: '#86EFAC',
  },
  tokenNumber: {
    color: '#FDE047',
    fontWeight: '700',
  },
  tokenComment: {
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  tokenOperator: {
    color: '#F472B6',
    fontWeight: '700',
  },
});
