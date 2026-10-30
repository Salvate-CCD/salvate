import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors, fonts, radius, typography } from '@/theme/tokens';

type Props = {
  visible: boolean;
  /** 알림을 터치했을 때 — 잠금화면이 위로 올라간 뒤 호출 */
  onOpenNotification: () => void;
  /** 잠금화면 날짜·시각과 알림 문구 — 기본값은 Figma "회원 승인" 프레임 */
  date?: string;
  time?: string;
  title?: string;
  message?: string;
};

const SLIDE_MS = 450;
// 배경화면(wallpaper.jpg) 위·아래 끝 색 — 웹에서 Safari 상태바·툴바 뒤까지 잠금화면처럼 보이게
const WALLPAPER_TOP = '#A8DBE4';
const WALLPAPER_BOTTOM = '#7ABCCB';
const isWeb = Platform.OS === 'web';
const useNativeDriver = !isWeb;

// 웹: Safari(iOS 26)는 화면 위·아래 가장자리에 붙은 고정 요소의 배경색으로 상태바·툴바를 칠함
// (스크롤 없는 페이지라 툴바 뒤로는 이미지가 그려지지 않음) → 가장자리에 배경화면 끝 색 띠를 깔아 둠
const EDGE = 2;

// Figma "회원 승인" — 승인 푸시 알림이 와 있는 iOS 잠금화면. 위에서 스르륵 내려와 열림.
// 도움 요청 게시 후 "Someone offered to help" 알림(1608:33987)도 같은 레이아웃에 문구만 바꿔 사용.
export function ApprovalLockScreen({
  visible,
  onOpenNotification,
  date = 'Wednesday, November 4',
  time = '10:41',
  title = 'Your account is approved!',
  message = 'Welcome to Sálvate! Tap to get started.',
}: Props) {
  const { height } = useWindowDimensions();
  // 0 = 화면 위로 숨음, 1 = 다 내려옴
  const shown = useRef(new Animated.Value(0)).current;
  // 웹은 창 크기가 바뀌어도 맞도록 자기 높이 기준(%)으로 숨김
  const translateY = isWeb
    ? shown.interpolate({ inputRange: [0, 1], outputRange: ['-100%', '0%'] })
    : shown.interpolate({ inputRange: [0, 1], outputRange: [-height, 0] });

  useEffect(() => {
    if (!visible) return;
    shown.setValue(0);
    Animated.timing(shown, { toValue: 1, duration: SLIDE_MS, easing: Easing.out(Easing.cubic), useNativeDriver }).start();
  }, [visible, shown]);

  // 웹: 가장자리 고정 요소가 없는 순간(내려오는 중)엔 html/body 배경으로 칠함 → 떠 있는 동안 배경화면 색으로 바꿨다가 닫히면 복원
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const targets = [document.documentElement, document.body];
    const prev = targets.map((el) => [el.style.backgroundColor, el.style.backgroundImage]);
    for (const el of targets) {
      el.style.backgroundColor = WALLPAPER_BOTTOM;
      el.style.backgroundImage = `linear-gradient(${WALLPAPER_TOP}, ${WALLPAPER_BOTTOM})`;
    }
    return () =>
      targets.forEach((el, i) => {
        [el.style.backgroundColor, el.style.backgroundImage] = prev[i];
      });
  }, [visible]);

  const open = () => {
    Animated.timing(shown, { toValue: 0, duration: SLIDE_MS * 0.7, easing: Easing.in(Easing.cubic), useNativeDriver }).start(
      () => onOpenNotification(),
    );
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={open}>
      <Animated.View style={[styles.root, isWeb && styles.rootWeb, { transform: [{ translateY }] }]}>
        <Image source={require('../../assets/figma/lockscreen/wallpaper.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
        {/* 이미지 위에 얇게 깔아야 Safari 가 가장자리 색으로 집어감 — 이미지 끝 색과 같아 눈에 띄지 않음 */}
        {isWeb ? (
          <>
            <View style={[styles.edge, { top: 0, backgroundColor: WALLPAPER_TOP }]} />
            <View style={[styles.edge, { bottom: 0, backgroundColor: WALLPAPER_BOTTOM }]} />
          </>
        ) : null}

        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title} ${message}`}
          onPress={open}
          style={({ pressed }) => [styles.notification, pressed && { opacity: 0.85 }]}
        >
          <BlurView intensity={30} tint="light" style={styles.platterBlur} />
          <View style={styles.appIcon}>
            <Image source={require('../../assets/figma/lockscreen/logo-symbol-white.svg')} style={styles.appSymbol} />
          </View>
          <View style={styles.content}>
            <Text style={[typography.body1Bold, styles.white]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.caption, styles.white]}>{message}</Text>
          </View>
          <Text style={styles.now}>now</Text>
        </Pressable>

        <Image source={require('../../assets/figma/lockscreen/flashlight-button.svg')} style={[styles.quickButton, { left: 48 }]} />
        <Image source={require('../../assets/figma/lockscreen/camera-button.svg')} style={[styles.quickButton, { right: 48 }]} />
        <Text style={styles.swipe}>swipe up to open</Text>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black, overflow: 'hidden' },
  // 검정 바탕이면 Safari 가 상태바·툴바를 검게 칠함 → 웹은 배경화면 아래 끝 색
  rootWeb: { backgroundColor: WALLPAPER_BOTTOM },
  edge: { position: 'absolute', left: 0, right: 0, height: EDGE },
  // Figma 날짜·시간·스와이프 문구는 iOS 시스템 폰트(Inter/SF) — 시스템 기본 폰트 사용
  date: { position: 'absolute', top: 78, left: 0, right: 0, textAlign: 'center', fontSize: 18, letterSpacing: -0.5, color: colors.white },
  time: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.robotoExtraBold,
    fontSize: 120,
    letterSpacing: -3,
    color: 'rgba(245, 245, 245, 0.4)',
  },
  notification: {
    position: 'absolute',
    top: 249,
    left: 8,
    right: 8,
    height: 80,
    flexDirection: 'row',
    borderRadius: radius['2xl'],
    backgroundColor: 'rgba(245, 245, 245, 0.11)',
    // Figma 스크린샷의 유리 테두리 근사치 (export 값에는 없음)
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    overflow: 'hidden',
  },
  // Figma 플래터의 배경 블러(유리 효과)
  platterBlur: StyleSheet.absoluteFill,
  appIcon: {
    position: 'absolute',
    left: 21,
    top: 26,
    width: 26,
    height: 26,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    boxShadow: 'inset 0px 0px 8px 0px #5AAE97', // Mint/500
  },
  appSymbol: { width: 20, height: 7.54 },
  content: { position: 'absolute', left: 58, right: 18, top: 19, gap: 5 },
  // Figma "Caption/Caption 1/R"
  caption: { fontFamily: fonts.robotoRegular, fontSize: 12, lineHeight: 15 },
  white: { color: colors.white },
  now: { position: 'absolute', top: 13, right: 15, fontSize: 13, letterSpacing: -0.31, color: colors.white, opacity: 0.72 },
  quickButton: { position: 'absolute', bottom: 52, width: 52, height: 51.97 },
  swipe: { position: 'absolute', bottom: 63, left: 0, right: 0, textAlign: 'center', fontSize: 17, letterSpacing: -0.408, color: colors.white, opacity: 0.64 },
});
