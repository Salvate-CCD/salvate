import { Image } from '@/components/Image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Figma 프레임 기준값 (iPhone 13: 390×844, 상태바 47)
const FRAME_WIDTH = 390;
const FRAME_HEIGHT = 844;
const STATUS_BAR = 47;
// Figma "WhatsApp iOS 0 1" 이미지 채움 — 프레임 기준 위치/크기 (427×843 레이어 안을 115.32% 높이로 크롭)
const IMAGE = { left: -19.3, top: -64.6, width: 427.6, height: 972.1 };

// Figma "왓츠앱 전환" — WhatsApp 로고 + from Meta 스플래시 (Figma 이미지 그대로 사용)
export function WhatsAppSplash() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = width / FRAME_WIDTH;
  // safe area 윗변을 프레임의 상태바 아래(y=47)에 맞춘다
  const frameTop = insets.top - STATUS_BAR * s;

  return (
    <View style={styles.root} pointerEvents="none">
      {/* 원본 이미지 하단의 홈 인디케이터·워터마크 띠는 Figma에서 프레임 밖이라 잘려 있음 → 프레임 하단에서 잘라냄 */}
      <View style={[styles.clip, { height: frameTop + FRAME_HEIGHT * s }]}>
        <Image
          source={require('../../../assets/figma/whatsapp/splash.png')}
          contentFit="fill"
          style={{
            position: 'absolute',
            left: IMAGE.left * s,
            top: frameTop + IMAGE.top * s,
            width: IMAGE.width * s,
            height: IMAGE.height * s,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  clip: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
});
