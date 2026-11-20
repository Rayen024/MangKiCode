import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function IconFlame({ size = 16, color = '#EAB308' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C9.5 6 6 8.5 6 13C6 16.31 8.69 19 12 19C15.31 19 18 16.31 18 13C18 9 14.5 6.5 14.5 2C14.5 2 13 3.5 12 2Z"
        fill={color}
      />
      <Path
        d="M12 9C10.8 11.2 9.5 12.8 9.5 14.8C9.5 16.2 10.6 17.3 12 17.3C13.4 17.3 14.5 16.2 14.5 14.8C14.5 12.8 13.2 11.2 12 9Z"
        fill="#FEF08A"
      />
    </Svg>
  );
}

export function IconSprout({ size = 16, color = '#22C55E' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V12M12 12C12 7.58 8.42 4 4 4C4 8.42 7.58 12 12 12ZM12 12C12 8.13 15.13 5 19 5C19 8.87 15.87 12 12 12Z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconHome({ size = 22, color = '#2F7D46', filled = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBook({ size = 22, color = '#71717A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="4"
        width="14"
        height="16"
        rx="2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M9 8H15M9 12H15M9 16H13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconGamepad({ size = 22, color = '#71717A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="6"
        width="20"
        height="12"
        rx="6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* D-Pad */}
      <Path
        d="M6 12H10M8 10V14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Buttons */}
      <Circle cx="15.5" cy="10.5" r="1.2" fill={color} />
      <Circle cx="17.5" cy="13.5" r="1.2" fill={color} />
    </Svg>
  );
}

export function IconUser({ size = 22, color = '#71717A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
      <Path
        d="M5 20C5 16.69 8.13 14 12 14C15.87 14 19 16.69 19 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconCheck({ size = 15, color = '#2F7D46' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12.5L9.5 18L20 6"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconCodeChip({ size = 16, color = '#475569' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 8L4 12L8 16M16 8L20 12L16 16M14 4L10 20"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconStar({ size = 16, color = '#FBBF24', filled = true }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconLock({ size = 18, color = '#94A3B8' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16" r="1.5" fill={color} />
    </Svg>
  );
}

export function IconClock({ size = 14, color = '#71717A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Path
        d="M12 7V12L15 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconChevronLeft({ size = 20, color = '#1E5E3A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChevronRight({ size = 20, color = '#71717A' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChevronUp({ size = 18, color = '#334155' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 15L12 9L6 15"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChevronDown({ size = 18, color = '#334155' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconCheckCircle({ size = 18, color = '#2F7D46' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={color} />
      <Path
        d="M8 12.5L10.5 15L16 9.5"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconLightbulb({ size = 24, color = '#EAB308' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H15M10 24H14M12 2C7.58 2 4 5.58 4 10C4 12.89 5.53 15.42 7.83 16.79C8.36 17.11 8.71 17.65 8.78 18.27L8.9 19H15.1L15.22 18.27C15.29 17.65 15.64 17.11 16.17 16.79C18.47 15.42 20 12.89 20 10C20 5.58 16.42 2 12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconSteps({ size = 24, color = '#2F7D46' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19H8V15H12V11H16V7H20"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBranch({ size = 24, color = '#F59E0B' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="6" r="3" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="18" r="3" stroke={color} strokeWidth="2" />
      <Path
        d="M6 9V13C6 14.1 6.9 15 8 15H12M18 9V13C18 14.1 17.1 15 16 15H12M12 15V15.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconRepeat({ size = 24, color = '#3B82F6' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 2L21 6L17 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 11V9C3 7.34 4.34 6 6 6H21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M7 22L3 18L7 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 13V15C21 16.66 19.66 18 18 18H3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
