/**
 * MaskotAnimated — animasi tangan kanan melambaikan & mata kedip
 * Menggunakan props numerik react-native-svg (bukan transform string)
 * agar kompatibel dengan native Android bridge
 */
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Mask,
  Path,
  Rect,
} from "react-native-svg";

// Wrap komponen SVG agar bisa terima Animated.Value sebagai props
const AnimatedG       = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle  = Animated.createAnimatedComponent(Circle);

export default function MaskotAnimated({ size = 200 }) {
  const waveAnim  = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current; // 1=buka, 0=tutup

  useEffect(() => {
    // Tangan melambaikan: easing sinusoidal supaya pergerakan halus
    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 450,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(waveAnim, {
          toValue: -1,
          duration: 450,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    );

    // Kedip rekursif: tunggu 2.5 detik, tutup cepat, buka lagi
    const doBlink = () =>
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(blinkAnim, { toValue: 0, duration: 80,  useNativeDriver: false }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
      ]).start(doBlink);

    waveLoop.start();
    doBlink();

    return () => {
      waveLoop.stop();
      blinkAnim.stopAnimation();
    };
  }, [waveAnim, blinkAnim]);

  // Rotasi tangan kanan: -20° → 20° (numerik, bukan string 'deg')
  const handRotation = waveAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-20, 20],
  });

  // Mata kedip: ry dari 15 (buka) → 0.8 (tutup)
  const eyeRY = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 15],
  });

  // Highlight mata hilang saat kedip
  const eyeHighlightOpacity = blinkAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 400 440">
      <Defs>
        <ClipPath id="mc">
          <Path d="M168,224 Q200,236 232,224 Q226,268 200,268 Q174,268 168,224 Z" />
        </ClipPath>
        <Mask id="sh0" maskUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="560">
          <Rect x="-50" y="-50" width="500" height="560" fill="#fff" />
          <Circle cx="160" cy="298" r="26" fill="#000" />
        </Mask>
        <Mask id="sh1" maskUnits="userSpaceOnUse" x="-50" y="-50" width="500" height="560">
          <Rect x="-50" y="-50" width="500" height="560" fill="#fff" />
          <Circle cx="240" cy="298" r="26" fill="#000" />
        </Mask>
      </Defs>

      {/* ── BODY ─────────────────────────────────────────────────── */}
      <Path d="M240,360 C300,396 352,384 346,340 C343,314 322,312 310,322" fill="none" stroke="#2a1810" strokeWidth="30" strokeLinecap="round"/>
      <Ellipse cx="170" cy="398" rx="30" ry="21" fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Ellipse cx="230" cy="398" rx="30" ry="21" fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Ellipse cx="200" cy="336" rx="62" ry="64" fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Ellipse cx="200" cy="296" rx="64" ry="32" fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Path d="M240,360 C300,396 352,384 346,340 C343,314 322,312 310,322" fill="none" stroke="#945d38" strokeWidth="16" strokeLinecap="round"/>
      <Ellipse cx="170" cy="398" rx="30" ry="21" fill="#945d38"/>
      <Ellipse cx="170" cy="405" rx="16" ry="9"  fill="#f7dbb1"/>
      <Ellipse cx="230" cy="398" rx="30" ry="21" fill="#945d38"/>
      <Ellipse cx="230" cy="405" rx="16" ry="9"  fill="#f7dbb1"/>
      <Ellipse cx="200" cy="336" rx="62" ry="64" fill="#945d38"/>
      <Ellipse cx="200" cy="296" rx="64" ry="32" fill="#945d38"/>
      <Ellipse cx="200" cy="346" rx="37" ry="40" fill="#f7dbb1"/>

      {/* ── KEPALA ───────────────────────────────────────────────── */}
      <Circle cx="82"  cy="182" r="35"  fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Circle cx="318" cy="182" r="35"  fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Ellipse cx="200" cy="176" rx="125" ry="106" fill="#2a1810" stroke="#2a1810" strokeWidth="14"/>
      <Circle cx="82"  cy="182" r="35"  fill="#945d38"/>
      <Circle cx="82"  cy="184" r="19"  fill="#f7dbb1"/>
      <Circle cx="318" cy="182" r="35"  fill="#945d38"/>
      <Circle cx="318" cy="184" r="19"  fill="#f7dbb1"/>
      <Ellipse cx="200" cy="176" rx="125" ry="106" fill="#945d38"/>
      <Ellipse cx="160" cy="198" rx="58"  ry="54"  fill="#f7dbb1"/>
      <Ellipse cx="240" cy="198" rx="58"  ry="54"  fill="#f7dbb1"/>
      <Ellipse cx="200" cy="228" rx="64"  ry="44"  fill="#f7dbb1"/>
      <Path d="M176,80 Q182,38 226,48 Q246,54 232,70 Q212,62 214,84 Q196,74 176,80 Z" fill="#2a1810" stroke="#2a1810" strokeWidth="10" strokeLinejoin="round"/>
      <Path d="M176,80 Q182,38 226,48 Q246,54 232,70 Q212,62 214,84 Q196,74 176,80 Z" fill="#c68656"/>
      <Circle cx="116" cy="210" r="18" fill="#f2bf9e"/>
      <Circle cx="284" cy="210" r="18" fill="#f2bf9e"/>
      <Circle cx="192" cy="208" r="3.2" fill="#945d38"/>
      <Circle cx="208" cy="208" r="3.2" fill="#945d38"/>

      {/* ── MULUT ────────────────────────────────────────────────── */}
      <Path d="M168,224 Q200,236 232,224 Q226,268 200,268 Q174,268 168,224 Z" fill="#6b1f1f" stroke="#2a1810" strokeWidth="6" strokeLinejoin="round"/>
      <Ellipse cx="200" cy="262" rx="17" ry="12" fill="#ed9277" clipPath="url(#mc)"/>

      {/* ── MATA (kedip: animasi ry) ─────────────────────────────── */}
      {/* Mata kiri */}
      <AnimatedEllipse cx="160" cy="178" rx={12} ry={eyeRY} fill="#2a1810"/>
      <AnimatedCircle  cx="164" cy="173" r={4.5} fill="#fff" fillOpacity={eyeHighlightOpacity}/>
      <AnimatedCircle  cx="156" cy="184" r={2}   fill="#fff" fillOpacity={eyeHighlightOpacity}/>
      {/* Mata kanan */}
      <AnimatedEllipse cx="240" cy="178" rx={12} ry={eyeRY} fill="#2a1810"/>
      <AnimatedCircle  cx="244" cy="173" r={4.5} fill="#fff" fillOpacity={eyeHighlightOpacity}/>
      <AnimatedCircle  cx="236" cy="184" r={2}   fill="#fff" fillOpacity={eyeHighlightOpacity}/>

      {/* ── TANGAN KIRI (diam) ───────────────────────────────────── */}
      <G mask="url(#sh0)">
        <Path d="M160,298 L150,300 Q112,332 122,368" fill="none" stroke="#2a1810" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round"/>
        <Circle cx="122" cy="368" r="24" fill="#2a1810"/>
      </G>
      <Path d="M160,298 L150,300 Q112,332 122,368" fill="none" stroke="#945d38" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="122" cy="368" r="17" fill="#945d38"/>

      {/* ── TANGAN KANAN (melambaikan) ──────────────────────────── */}
      {/* Pivot trick: translate ke bahu → rotate di 0,0 → translate balik */}
      {/* Cara ini memastikan pivot (240,298) tidak bergeser saat animasi   */}
      <G x={240} y={298}>
        <AnimatedG rotation={handRotation}>
          <G x={-240} y={-298}>
            <G mask="url(#sh1)">
              <Path d="M240,298 L250,300 Q306,276 296,226" fill="none" stroke="#2a1810" strokeWidth="42" strokeLinecap="round" strokeLinejoin="round"/>
              <Circle cx="296" cy="226" r="24" fill="#2a1810"/>
            </G>
            <Path d="M240,298 L250,300 Q306,276 296,226" fill="none" stroke="#945d38" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round"/>
            <Circle cx="296" cy="226" r="17" fill="#945d38"/>
          </G>
        </AnimatedG>
      </G>
    </Svg>
  );
}
