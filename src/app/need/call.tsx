import { Image } from '@/components/Image';
import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dialog } from '@/components/Dialog';
import { Header } from '@/components/Header';
import { CallActionButton } from '@/components/need/CallActionButton';
import { CallRings } from '@/components/need/CallRings';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { colors, fonts, typography } from '@/theme/tokens';

// Figma "도움 요청_AI 전화 페이지" (1608:33565 / 33614) + "뒤로가기 버튼 눌렀을 때 모달" (1608:33642)
export default function TalkingWithAI() {
  const insets = useSafeAreaInsets();
  const [seconds, setSeconds] = useState(0);
  const [leaveOpen, setLeaveOpen] = useState(false);

  // 통화 시간 — 00:00 부터 1초마다 증가 (Figma 의 01:05 는 예시)
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Android 하드웨어 뒤로가기도 화살표와 같이 "Leave this call?" 모달을 띄움
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        setLeaveOpen(true);
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  const onLeave = () => {
    setLeaveOpen(false);
    if (router.canGoBack()) router.back();
    else router.replace('/need');
  };

  const onEnd = () => router.replace('/need/analyzing');

  return (
    // 분홍 원이 화면 밖으로 넘치므로 잘라냄 (웹에서 페이지가 스크롤되지 않게)
    <Screen background={colors.backgroundAlternative} style={styles.clip}>
      {/* iOS 스와이프 뒤로가기는 모달을 건너뛰므로 막음 */}
      <Stack.Screen options={{ gestureEnabled: false }} />

      {/* Figma "Graiphic" 의 분홍 흐린 원 2개 — 프레임(상태바 포함) 기준 위치 */}
      <View pointerEvents="none" style={[styles.bgLayer, { top: insets.top }]}>
        <Image source={require('../../../assets/figma/need/bg-pink1.svg')} style={styles.pink1} />
        <Image source={require('../../../assets/figma/need/bg-pink2.svg')} style={styles.pink2} />
      </View>

      <View style={styles.content}>
        {/* 원 그래픽 + 이름/시간: 원 중심은 Figma y 422 (콘텐츠 영역 가운데보다 6.5 위) */}
        <View pointerEvents="none" style={styles.centerAnchor}>
          <CallRings />
          <Text style={styles.name}>Sálvate AI</Text>
          <Text style={[typography.label1Medium, styles.timer]}>{formatTime(seconds)}</Text>
        </View>

        <Header title="AI Call" onBack={() => setLeaveOpen(true)} />
        <TitleBlock
          title="Talking with AI"
          description={'Speak freely.\nYour privacy matters.'}
          descriptionWidth={257}
        />

        {/* Figma "bottom button" — 버튼 위쪽은 홈 인디케이터 위 78 (글자 아래 8px 는 인디케이터 영역에 걸침).
            아래 inset 이 없는 기기에선 글자가 잘리지 않도록 그만큼 올림 */}
        <View style={[styles.buttons, { bottom: -Math.min(8, insets.bottom) }]}>
          {/* TODO: Speaker / Mute 켜짐 상태 디자인이 없어 아직 동작 없음 */}
          {/* Figma x 67 / 163 / 259 → 버튼 묶음(256)을 화면 가운데 기준으로 배치 */}
          <CallActionButton kind="speaker" left={0} onPress={() => {}} />
          <CallActionButton kind="mute" left={96} onPress={() => {}} />
          <CallActionButton kind="end" left={192} onPress={onEnd} />
        </View>
      </View>

      <Dialog
        visible={leaveOpen}
        title="Leave this call?"
        message="Your call will end, and your request won't be saved."
        cancelLabel="Leave"
        confirmLabel="Stay"
        onCancel={onLeave}
        onConfirm={() => setLeaveOpen(false)}
        onDismiss={() => setLeaveOpen(false)}
      />
    </Screen>
  );
}

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  // 아래 좌표는 Figma 프레임(폭 390) 기준 → 프레임을 화면 가운데에 둠
  bgLayer: { position: 'absolute', left: '50%', marginLeft: -195, width: 390, height: 0 },
  // Ellipse 124: 458 원 (1-196, 24) + blur 여백 36 → 530 SVG, 상태바 47 제외
  pink1: { position: 'absolute', left: -231, top: -59, width: 530, height: 530 },
  // Ellipse 125: 418 원 (109, 378) + 여백 36 → 490 SVG
  pink2: { position: 'absolute', left: 73, top: 295, width: 490, height: 490 },
  content: { flex: 1 },
  // 원 중심: Figma x 196 (프레임 가운데 +1), y = 50% - 6.5
  centerAnchor: { position: 'absolute', left: '50%', marginLeft: 1, top: '50%', marginTop: -6.5, width: 0, height: 0 },
  // Display 3/H (Vesper Libre Heavy 20/20) — 원 중심 아래 84
  name: {
    position: 'absolute',
    top: 84,
    left: -100,
    width: 200,
    textAlign: 'center',
    fontFamily: fonts.vesperHeavy,
    fontSize: 20,
    lineHeight: 20,
    color: colors.primary,
  },
  // 원 중심 아래 109
  timer: { position: 'absolute', top: 109, left: -51, width: 100, textAlign: 'center', color: colors.labelNeutral },
  // 버튼 묶음 폭 256 (Speaker 왼쪽 67 ~ End 오른쪽 323), 화면 가운데 기준 -128
  buttons: { position: 'absolute', left: '50%', marginLeft: -128, width: 256, height: 86 },
});
