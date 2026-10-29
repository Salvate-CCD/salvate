import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';

// Figma "왓츠앱 인증 완료" — 3개 프레임(213px → 213px → 265px)을 천천히 오가는 체크 그래픽
export default function Verified() {
  const { flow } = useLocalSearchParams<{ flow?: 'signup' | 'login' }>();
  const t = useRef(new Animated.Value(0)).current;

  const onContinue = () => {
    // 로그인 완료 → 홈
    if (flow === 'login') router.replace('/home');
    else router.replace('/signup/name');
  };

  useEffect(() => {
    const ease = Easing.inOut(Easing.quad);
    const useNativeDriver = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(t, { toValue: 1, duration: 900, easing: ease, useNativeDriver }),
        Animated.timing(t, { toValue: 0, duration: 900, easing: ease, useNativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  const smallOpacity = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Screen>
      <TitleBlock
        title="Verification complete"
        description="A private space to talk about what you need."
        titleWidth={297}
        descriptionWidth={257}
      />

      {/* 두 SVG는 중심이 같음 — 265px 상자 안에서 겹쳐 크로스페이드 */}
      <View style={styles.graphic} accessibilityRole="image" accessibilityLabel="Verified">
        <Animated.View style={[styles.layer, { opacity: smallOpacity }]}>
          <Image source={require('../../../assets/figma/graphic-check.svg')} style={styles.small} />
        </Animated.View>
        <Animated.View style={[styles.layer, { opacity: t }]}>
          <Image source={require('../../../assets/figma/graphic-check-expanded.svg')} style={styles.large} />
        </Animated.View>
      </View>

      <View style={styles.flex} />
      <View style={styles.action}>
        <Button label="Continue" onPress={onContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // Figma: 제목 블록 하단(y=239)과 큰 그래픽 상단(y=275) 사이 36
  graphic: { width: 265, height: 265, alignSelf: 'center', marginTop: 36 },
  layer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  small: { width: 213, height: 213 },
  large: { width: 265, height: 265 },
  action: { paddingHorizontal: 20, paddingBottom: 22 },
});
