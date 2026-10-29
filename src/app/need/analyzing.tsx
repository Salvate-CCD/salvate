import { VesperLibre_500Medium, useFonts } from '@expo-google-fonts/vesper-libre';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/tokens';

// 진행 바가 24 → 228 로 차는 시간 (디자인 두 상태 사이, 사용자 승인)
const FILL_MS = 2500;
const FILL_FROM = 24;
const FILL_TO = 228;

// Figma "도움 요청_AI 분석 로딩" (1608:33672 → 1608:33680)
export default function Analyzing() {
  // Display 3/M 은 Vesper Libre Medium — 이 화면에서만 쓰여 여기서 불러옴
  const [fontLoaded, fontError] = useFonts({ VesperLibre_500Medium });
  const [width] = useState(() => new Animated.Value(FILL_FROM));

  useEffect(() => {
    // width 는 네이티브 드라이버를 못 씀
    const anim = Animated.timing(width, {
      toValue: FILL_TO,
      duration: FILL_MS,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      if (finished) router.replace('/need/preview');
    });
    return () => anim.stop();
  }, [width]);

  return (
    <Screen background={colors.backgroundAlternative}>
      {/* 바 중심은 Figma y 401 (콘텐츠 영역 가운데보다 27.5 위) */}
      <View style={styles.anchor}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width }]} />
        </View>
        <Text
          style={[styles.label, { fontFamily: fontLoaded || fontError ? 'VesperLibre_500Medium' : undefined }]}
          accessibilityRole="progressbar"
        >
          Analyzing your needs...
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', left: 0, right: 0, top: '50%', marginTop: -27.5 - 12 },
  // 흰 바 244×24 (x 73), 그림자 2겹
  track: {
    alignSelf: 'center',
    marginLeft: 0,
    width: 244,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.white,
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.04), 0px 0px 12px 0px rgba(0,0,0,0.08)',
  },
  // primary/normal + inset 8px deepgreen/300 (#97B9A9), radius 12
  fill: {
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    boxShadow: 'inset 0px 0px 8px 0px #97B9A9',
  },
  // Display 3/M (20/20), 바 아래 24 (Figma y 437)
  label: { marginTop: 24, textAlign: 'center', fontSize: 20, lineHeight: 20, color: colors.primary },
});
