import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/tokens';

type Props = {
  blur: number;
  /** 흰 배경 불투명도 (Figma: 기본 60%, 채팅 헤더 72%, 입력 바 88%) */
  tint?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onLayout?: (e: LayoutChangeEvent) => void;
};

// Figma 의 반투명 바 (흰 테두리 1 + static/white 반투명 + backdrop-blur)
export function FrostedBar({ blur, tint = 0.6, style, children, onLayout }: Props) {
  const webBlur = Platform.OS === 'web' ? ({ backdropFilter: `blur(${blur}px)` } as ViewStyle) : null;
  return (
    <View style={[styles.root, webBlur, style]} onLayout={onLayout}>
      {Platform.OS !== 'web' ? <BlurView intensity={blur * 2.5} tint="light" style={StyleSheet.absoluteFill} /> : null}
      <View style={[styles.background, { opacity: tint }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', left: 0, right: 0, borderWidth: 1, borderColor: colors.white, overflow: 'hidden' },
  background: { ...StyleSheet.absoluteFill, backgroundColor: colors.white },
});
