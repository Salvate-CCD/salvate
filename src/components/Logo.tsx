import { Image } from '@/components/Image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = { style?: StyleProp<ViewStyle> };

// Figma "Logo" 220×144 — Symbol(초록 아치) + WordMark("sálvate").
// 랜딩 화면에서는 로고 뒤에 흐린 분홍·초록 원(Ellipse 149 / 150)이 함께 놓임 — 로고 박스 기준 좌표로 옮김.
// 빛 번짐 SVG 는 blur 여백 포함 크기(118 / 86)라 원 크기(74 / 42)보다 22px씩 바깥에서 시작함.
export function Logo({ style }: Props) {
  return (
    <View style={[styles.root, style]} accessibilityRole="image" accessibilityLabel="Sálvate">
      <Image source={require('../../assets/figma/welcome/logo-glow-pink.svg')} style={styles.glowPink} />
      <Image source={require('../../assets/figma/welcome/logo-glow-green.svg')} style={styles.glowGreen} />
      <Image source={require('../../assets/figma/welcome/logo-symbol.svg')} style={styles.symbol} />
      <Image source={require('../../assets/figma/welcome/logo-wordmark.svg')} style={styles.wordmark} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: 220, height: 144 },
  glowPink: { position: 'absolute', left: 83, top: -31, width: 118, height: 118 },
  glowGreen: { position: 'absolute', left: 21, top: 21, width: 86, height: 86 },
  symbol: { position: 'absolute', left: 43.43, top: 2.09, width: 132.83, height: 86.6586 },
  wordmark: { position: 'absolute', left: 29.06, top: 104.37, width: 163.962, height: 39.8308 },
});
