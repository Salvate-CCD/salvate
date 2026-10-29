import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';

type Props = { blur: number; style?: StyleProp<ViewStyle>; children?: React.ReactNode };

// Figma 의 반투명 바 (흰 테두리 1 + static/white 60% + backdrop-blur)
export function FrostedBar({ blur, style, children }: Props) {
  const webBlur = Platform.OS === 'web' ? ({ backdropFilter: `blur(${blur}px)` } as ViewStyle) : null;
  return (
    <View style={[styles.root, webBlur, style]}>
      {Platform.OS !== 'web' ? <BlurView intensity={blur * 2.5} tint="light" style={StyleSheet.absoluteFill} /> : null}
      <View style={styles.background} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', left: 0, right: 0, borderWidth: 1, borderColor: colors.white, overflow: 'hidden' },
  background: { ...StyleSheet.absoluteFill, backgroundColor: colors.white, opacity: 0.6 },
});
