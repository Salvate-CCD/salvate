import { Image } from '@/components/Image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

// Figma "Slide" — Slide_Background 280×68, 손잡이(Slide_Slidder_Background) 60×60
const TRACK_W = 280;
const KNOB = 60;
const INSET = 4; // 손잡이는 배경 안쪽 4px
const MAX = TRACK_W - INSET * 2 - KNOB; // 212 — slide default(x 59) → slide after(x 271)

const useNative = Platform.OS !== 'web';

// 웹에서만 손잡이에 'grab' 커서 — RN 타입(CursorValue)은 'auto' | 'pointer' 만 허용하므로 따로 둠
const webGrabCursor = Platform.OS === 'web' ? ({ cursor: 'grab' } as unknown as ViewStyle) : null;

type Props = { onComplete: () => void };

// "Slide to talk with AI" — 손잡이를 오른쪽 끝까지 밀면 onComplete.
// 중간 모습은 디자인에 없어서 default ↔ after 두 상태를 진행도만큼 겹쳐(크로스페이드) 보여줌
export function SlideToCall({ onComplete }: Props) {
  const [x] = useState(() => new Animated.Value(0));
  const done = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 통화 화면에서 돌아오면 다시 처음 상태(slide default)로
  useFocusEffect(
    useCallback(() => {
      done.current = false;
      x.setValue(0);
    }, [x]),
  );

  // 핸들러는 ref 만 읽으므로 한 번만 만듦.
  // 핸들러는 터치 이벤트 때만 호출되고 렌더 중에는 실행되지 않음 → react-hooks/refs 오탐
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !done.current,
      onMoveShouldSetPanResponder: () => !done.current,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        if (done.current) return;
        const v = Math.max(0, Math.min(MAX, g.dx));
        x.setValue(v);
        if (v >= MAX) {
          // 끝에 닿으면 바로 통화 화면으로
          done.current = true;
          onCompleteRef.current();
        }
      },
      onPanResponderRelease: () => {
        if (done.current) return;
        // 디자인 외 보완: 끝까지 못 밀고 놓으면 처음 위치로 되돌아감
        Animated.spring(x, { toValue: 0, useNativeDriver: useNative, bounciness: 0, speed: 14 }).start();
      },
      onPanResponderTerminate: () => {
        if (done.current) return;
        Animated.spring(x, { toValue: 0, useNativeDriver: useNative, bounciness: 0, speed: 14 }).start();
      },
    }),
  );

  const after = x.interpolate({ inputRange: [0, MAX], outputRange: [0, 1], extrapolate: 'clamp' });
  const before = x.interpolate({ inputRange: [0, MAX], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={styles.track}>
      {/* slide default: 흰 배경 + Shadow/Primary/01 */}
      <View style={[styles.trackBg, styles.trackDefault]} />
      {/* slide after: Gradient 166° #457D64 → #6CD2B6 */}
      <Animated.View style={[styles.trackBg, styles.trackAfter, { opacity: after }]}>
        <LinearGradient
          colors={[colors.primary, colors.secondaryNormal]}
          // CSS 166.29deg 를 280×68 박스 좌표로 환산
          start={{ x: 0.442, y: -0.454 }}
          end={{ x: 0.558, y: 1.454 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.hint, { opacity: before }]}>
        <Text style={styles.label}>Slide to talk with AI</Text>
        {/* icons/Arrows/double-right */}
        <Image source={require('../../../assets/figma/need/double-right.svg')} style={styles.arrows} />
      </Animated.View>

      <Animated.View
        {...pan.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Slide to talk with AI"
        style={[styles.knob, webGrabCursor, { transform: [{ translateX: x }] }]}
      >
        {/* 웹에서 <img> 기본 드래그가 끼어들지 않도록 이미지는 터치를 받지 않음 */}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: before }]}>
          <Image source={require('../../../assets/figma/need/slider-knob-default.svg')} style={styles.knobBg} />
          <Image source={require('../../../assets/figma/need/phone-default.svg')} style={styles.phone} />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: after }]}>
          <Image source={require('../../../assets/figma/need/slider-knob-after.svg')} style={styles.knobBg} />
          <Image source={require('../../../assets/figma/need/phone-after.svg')} style={styles.phone} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: TRACK_W, height: 68, userSelect: 'none' },
  trackBg: { ...StyleSheet.absoluteFill, borderRadius: 999 },
  trackDefault: { backgroundColor: colors.surfaceNormal, boxShadow: '0px 0px 34px 0px rgba(108,210,182,0.08)' },
  trackAfter: {
    overflow: 'hidden',
    boxShadow: '0px 0px 12px 0px rgba(108,210,182,0.08), 0px 0px 34px 0px rgba(108,210,182,0.08)',
  },
  hint: { ...StyleSheet.absoluteFill },
  // Body 2/Reading/R (15/20), 텍스트 가운데 x = 배경 기준 152, y 24
  label: {
    position: 'absolute',
    top: 24,
    left: 52,
    width: 200,
    textAlign: 'center',
    fontFamily: fonts.robotoRegular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.labelAlternative,
  },
  arrows: { position: 'absolute', left: 240, top: 24, width: 20, height: 20 },
  knob: { position: 'absolute', left: INSET, top: INSET, width: KNOB, height: KNOB },
  knobBg: { position: 'absolute', left: 0, top: 0, width: KNOB, height: KNOB },
  // icons/Communicate/phone-telephone 32×32, 손잡이 안 (14, 14)
  phone: { position: 'absolute', left: 14, top: 14, width: 32, height: 32 },
});
