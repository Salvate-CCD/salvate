import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { colors, insetGlow, radius, typography } from '@/theme/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'solid' | 'ghost';
  size?: 'L' | 'M';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  right?: React.ReactNode;
};

// Figma "Button/Box Button" — Solid / Ghost, L(56) / M(48), Disabled
export function Button({ label, onPress, variant = 'solid', size = 'L', disabled, style, right }: Props) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'L' ? styles.sizeL : styles.sizeM,
        disabled
          ? styles.disabled
          : isGhost
            ? styles.ghost
            : styles.solid,
        pressed && !disabled && { opacity: 0.85 },
        style,
      ]}
    >
      <Text
        style={[
          size === 'L' ? typography.body1Medium : typography.body2Medium,
          styles.label,
          { color: disabled ? colors.labelDisabled : isGhost ? colors.primary : colors.white },
          right ? { flex: 1 } : null,
        ]}
      >
        {label}
      </Text>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeL: { height: 56, paddingHorizontal: 20, borderRadius: radius.m, gap: 8 },
  sizeM: { height: 48, paddingHorizontal: 16, borderRadius: radius.s, gap: 6 },
  solid: { backgroundColor: colors.primary, boxShadow: insetGlow.solid },
  ghost: {
    backgroundColor: colors.surfaceNormal,
    borderWidth: 1,
    borderColor: colors.labelAssistive,
    boxShadow: insetGlow.ghost,
  },
  disabled: { backgroundColor: colors.surfaceDisabled },
  label: { textAlign: 'center' },
});
