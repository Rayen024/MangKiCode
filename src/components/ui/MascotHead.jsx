import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Path,
  Rect,
} from 'react-native-svg';

/**
 * Maskot Kepala Monyet Bertopi Petualang (Safari Hat)
 * Dibuat sesuai referensi UI MangKiCode
 */
export default function MascotHead({ width = 76, height = 76 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 160 145" fill="none">
      <Defs>
        <ClipPath id="mouthClip">
          <Path d="M 68,100 Q 80,105 92,100 Q 90,118 80,118 Q 70,118 68,100 Z" />
        </ClipPath>
      </Defs>

      <G>
        {/* ── TELINGA KIRI & KANAN ──────────────────────── */}
        {/* Telinga Kiri */}
        <Circle cx="28" cy="78" r="20" fill="#2A1810" stroke="#2A1810" strokeWidth="6" />
        <Circle cx="28" cy="78" r="18" fill="#945D38" />
        <Circle cx="28" cy="79" r="10" fill="#F7DBB1" />

        {/* Telinga Kanan */}
        <Circle cx="132" cy="78" r="20" fill="#2A1810" stroke="#2A1810" strokeWidth="6" />
        <Circle cx="132" cy="78" r="18" fill="#945D38" />
        <Circle cx="132" cy="79" r="10" fill="#F7DBB1" />

        {/* ── KEPALA ────────────────────────────────────── */}
        <Ellipse cx="80" cy="82" rx="55" ry="48" fill="#2A1810" stroke="#2A1810" strokeWidth="6" />
        <Ellipse cx="80" cy="82" rx="53" ry="46" fill="#945D38" />

        {/* ── AREA MONCONG / PIPI KREM ─────────────────── */}
        <Ellipse cx="63" cy="90" rx="27" ry="25" fill="#F7DBB1" />
        <Ellipse cx="97" cy="90" rx="27" ry="25" fill="#F7DBB1" />
        <Ellipse cx="80" cy="102" rx="30" ry="20" fill="#F7DBB1" />

        {/* Blush Merah Muda di Pipi */}
        <Circle cx="44" cy="94" r="8" fill="#F2BF9E" opacity={0.65} />
        <Circle cx="116" cy="94" r="8" fill="#F2BF9E" opacity={0.65} />

        {/* ── HIDUNG ───────────────────────────────────── */}
        <Circle cx="76.5" cy="94" r="2" fill="#945D38" />
        <Circle cx="83.5" cy="94" r="2" fill="#945D38" />

        {/* ── MULUT SENYUM GEMBIRA ─────────────────────── */}
        <Path
          d="M 68,100 Q 80,105 92,100 Q 90,118 80,118 Q 70,118 68,100 Z"
          fill="#6B1F1F"
          stroke="#2A1810"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Lidah */}
        <Ellipse cx="80" cy="115" rx="8" ry="6" fill="#ED9277" clipPath="url(#mouthClip)" />

        {/* ── MATA CERIA ──────────────────────────────── */}
        {/* Mata Kiri */}
        <Ellipse cx="64" cy="80" rx="6.5" ry="8.5" fill="#2A1810" />
        <Circle cx="66" cy="77" r="2.5" fill="#FFFFFF" />
        <Circle cx="62.5" cy="83" r="1.2" fill="#FFFFFF" />

        {/* Mata Kanan */}
        <Ellipse cx="96" cy="80" rx="6.5" ry="8.5" fill="#2A1810" />
        <Circle cx="98" cy="77" r="2.5" fill="#FFFFFF" />
        <Circle cx="94.5" cy="83" r="1.2" fill="#FFFFFF" />

        {/* ── TOPI RIMBA / SAFARI HAT ──────────────────── */}
        {/* Kubah Topi */}
        <Path
          d="M 44,55 C 44,24 116,24 116,55 Z"
          fill="#F5BE2E"
          stroke="#2A1810"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        {/* Garis / Lipatan Topi */}
        <Path
          d="M 70,30 Q 73,42 74,54"
          stroke="#D99B00"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Path
          d="M 90,30 Q 87,42 86,54"
          stroke="#D99B00"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Pita Cokelat Topi */}
        <Rect
          x="44"
          y="48"
          width="72"
          height="7"
          fill="#78350F"
          stroke="#2A1810"
          strokeWidth="3.5"
        />

        {/* Pinggiran / Lidah Topi (Brim) */}
        <Ellipse
          cx="80"
          cy="56"
          rx="44"
          ry="7.5"
          fill="#F5BE2E"
          stroke="#2A1810"
          strokeWidth="4.5"
        />

        {/* Tombol Puncak Topi */}
        <Ellipse
          cx="80"
          cy="26"
          rx="5"
          ry="3"
          fill="#D99B00"
          stroke="#2A1810"
          strokeWidth="2.5"
        />
      </G>
    </Svg>
  );
}
