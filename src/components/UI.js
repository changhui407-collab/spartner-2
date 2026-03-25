import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors, levelColors } from '../data';

// ── Pill badge ────────────────────────────────────────
export const Pill = ({ label, color, bg }) => (
  <View style={[styles.pill, { backgroundColor: bg || color + '22', borderColor: color + '44' }]}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>
);

// ── Level pill ────────────────────────────────────────
export const LevelPill = ({ level }) => (
  <Pill label={level} color={levelColors[level] || Colors.muted} />
);

// ── Tag ───────────────────────────────────────────────
export const Tag = ({ label }) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>#{label}</Text>
  </View>
);

// ── Avatar ────────────────────────────────────────────
export const Avatar = ({ emoji, size = 44, bg = '#1a1a2e', borderColor = '#2a2a3e', borderWidth = 2 }) => (
  <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg, borderColor, borderWidth }]}>
    <Text style={{ fontSize: size * 0.46 }}>{emoji}</Text>
  </View>
);

// ── Fill bar ──────────────────────────────────────────
export const FillBar = ({ pct, warn }) => (
  <View style={styles.fillTrack}>
    <View style={[
      styles.fillBar,
      { width: `${Math.min(pct, 100)}%`, backgroundColor: warn ? Colors.red : Colors.accent },
    ]} />
  </View>
);

// ── Section label ─────────────────────────────────────
export const SectionLabel = ({ children }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

// ── Divider ───────────────────────────────────────────
export const Divider = ({ style }) => <View style={[styles.divider, style]} />;

// ── Primary button ────────────────────────────────────
export const PrimaryButton = ({ label, onPress, variant = 'primary', disabled, style: sx }) => {
  const bgMap = {
    primary: disabled ? '#1c1c28' : null,
    ghost: '#1c1c28',
    danger: '#2a1010',
  };
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        variant === 'primary' && !disabled && styles.buttonGradientFallback,
        bgMap[variant] && { backgroundColor: bgMap[variant] },
        variant === 'danger' && { borderColor: '#3a1515', borderWidth: 1 },
        variant === 'ghost' && { borderColor: Colors.border, borderWidth: 1 },
        sx,
      ]}
    >
      <Text style={[styles.buttonText, { color: disabled ? '#444' : (variant === 'primary' ? '#fff' : variant === 'danger' ? Colors.red : '#777') }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ── Filter chip ───────────────────────────────────────
export const FilterChip = ({ label, active, onPress, activeColor = Colors.accentRed }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, active && { borderColor: activeColor, backgroundColor: activeColor + '1a' }]}
  >
    <Text style={[styles.chipText, active && { color: activeColor }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: { fontSize: 10, fontWeight: '700' },

  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  tagText: { fontSize: 10, color: '#555' },

  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  fillTrack: {
    height: 3,
    backgroundColor: '#1c1c28',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 2,
  },

  sectionLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#1c1c28',
    marginHorizontal: -18,
  },

  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGradientFallback: {
    backgroundColor: '#ff5500',  // fallback; gradient applied via LinearGradient in screens
  },
  buttonText: { fontSize: 14, fontWeight: '700' },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  chipText: { fontSize: 12, color: '#555' },
});
