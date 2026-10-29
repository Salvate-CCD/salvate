import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';

// Figma "Graphic_Check" 3개 프레임(1608:35310 / 35328 / 35346)은 같은 링을 회전시킨 상태들
// → 링("젤 뒤에 원")만 계속 돌리고, 가운데 사람 아이콘은 고정
const ROTATION_MS = 6000; // 한 바퀴

// Figma "회원가입 - 회원가입 완료"
export default function Submitted() {
  // 가입 완료 → 홈. 홈 가운데에 입력한 이름을 보여주므로 가입 정보(draft)는 지우지 않음
  const onOk = () => {
    router.replace('/home');
  };

  return (
    <Screen>
      {/* 그래픽은 화면 전체(상태바 포함) 기준 정중앙 — Figma top 50% */}
      <View pointerEvents="none" style={styles.graphicLayer}>
        <View style={styles.graphic}>
          {/* Figma "분홍색 원" 흐린 원 3개 (링 뒤) */}
          <Image source={require('../../../assets/figma/submitted-blur1.svg')} style={styles.blur1} />
          <Image source={require('../../../assets/figma/submitted-blur2.svg')} style={styles.blur2} />
          <Image source={require('../../../assets/figma/submitted-blur3.svg')} style={styles.blur3} />
          <RingAnimation />
        </View>
      </View>

      <TitleBlock
        title="Application submitted"
        description={"Approval may take up to 2–4 hours.\nWe'll notify you once you're approved."}
        titleWidth={350}
      />
      <View style={styles.flex} />
      <View style={styles.action}>
        <Button label="OK" onPress={onOk} />
      </View>
    </Screen>
  );
}

function RingAnimation() {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: ROTATION_MS,
        easing: Easing.linear, // 끊김 없이 일정한 속도로
        useNativeDriver: Platform.OS !== 'web',
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}>
        <Image source={require('../../../assets/figma/submitted-ring.svg')} style={styles.ring} />
      </Animated.View>
      {/* Figma "icons/Peoples/appointment" (72×72) — 링 안 고정 */}
      <View style={styles.person}>
        <Image source={require('../../../assets/figma/submitted-person-head.svg')} style={{ position: 'absolute', left: 24, top: 4.5, width: 24, height: 24 }} />
        <Image source={require('../../../assets/figma/submitted-person-body.svg')} style={{ position: 'absolute', left: 4.5, top: 36, width: 30, height: 27 }} />
        <Image source={require('../../../assets/figma/submitted-person-clock.svg')} style={{ position: 'absolute', left: 36, top: 36, width: 30, height: 30 }} />
        <Image source={require('../../../assets/figma/submitted-person-hand.svg')} style={{ position: 'absolute', left: 48, top: 45, width: 9, height: 9 }} />
      </View>
    </>
  );
}

const GRAPHIC = 232;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  graphicLayer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  graphic: { width: GRAPHIC, height: GRAPHIC },
  ring: { width: GRAPHIC, height: GRAPHIC },
  // Figma: 아이콘은 그래픽 안 (80, 78)
  person: { position: 'absolute', left: 80, top: 78, width: 72, height: 72 },
  // 그래픽 중심(116,116) 기준 Figma 위치
  blur1: { position: 'absolute', left: 81, top: 108, width: 70, height: 42 },
  blur2: { position: 'absolute', left: 98, top: 76, width: 36, height: 36 },
  blur3: { position: 'absolute', left: 111, top: 109, width: 40, height: 40 },
  action: { paddingHorizontal: 20, paddingBottom: 22 },
});
