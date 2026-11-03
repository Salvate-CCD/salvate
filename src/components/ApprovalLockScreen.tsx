import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { BOTTOM_BLEED, FullBleedOverlay, TOP_BLEED } from '@/components/lockscreen/FullBleedOverlay';
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
  /** help: 도움 진행 알림(1967:19898 / 1967:19943) — 검은 글자 + 분홍 로고 */
  appearance?: 'approval' | 'help';
  /** 알림 안쪽 아래에 더 그릴 내용 (진행 막대) */
  footer?: ReactNode;
  /** 알림 높이 — 기본 80 */
  notificationHeight?: number;
};

const SLIDE_MS = 450;
// 배경화면(wallpaper.jpg) 위·아래 끝 색 — 웹에서 Safari 상태바·툴바 뒤까지 잠금화면처럼 보이게
const WALLPAPER_TOP = '#A8DBE4';
const WALLPAPER_BOTTOM = '#7ABCCB';
const isWeb = Platform.OS === 'web';
const useNativeDriver = !isWeb;

// Figma "회원 승인" — 승인 푸시 알림이 와 있는 iOS 잠금화면. 위에서 스르륵 내려와 열림.
// 도움 요청 게시 후 "Someone offered to help" 알림(1608:33987)도 같은 레이아웃에 문구만 바꿔 사용.
export function ApprovalLockScreen({
  visible,
  onOpenNotification,
  date = 'Wednesday, November 4',
  time = '10:41',
  title = 'Your account is approved!',
  message = 'Welcome to Sálvate! Tap to get started.',
  appearance = 'approval',
  footer,
  notificationHeight,
}: Props) {
  const help = appearance === 'help';
  const textColor = help ? styles.black : styles.white;
  const { height } = useWindowDimensions();
  // 0 = 화면 위로 숨음, 1 = 다 내려옴
  const [shown] = useState(() => new Animated.Value(0));
  // 웹은 창 크기가 바뀌어도 맞도록 자기 높이 기준(%)으로 숨김
  const translateY = isWeb
    ? shown.interpolate({ inputRange: [0, 1], outputRange: ['-100%', '0%'] })
    : shown.interpolate({ inputRange: [0, 1], outputRange: [-height, 0] });

  useEffect(() => {
    if (!visible) return;
    shown.setValue(0);
    Animated.timing(shown, { toValue: 1, duration: SLIDE_MS, easing: Easing.out(Easing.cubic), useNativeDriver }).start();
  }, [visible, shown]);

  // 웹: 레이어가 내려오는 동안 등 상태바·툴바 뒤에 html/body 배경이 보일 때를 대비해 배경화면 색으로 바꿨다가 닫히면 복원
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
    <FullBleedOverlay visible={visible} onRequestClose={open}>
      <Animated.View style={[styles.root, isWeb && styles.rootWeb, { transform: [{ translateY }] }]}>
        {/* 배경화면은 상태바·툴바 뒤까지(웹 bleed 포함) 깔고, 나머지는 보이는 영역 기준으로 배치 */}
        <Image source={require('../../assets/figma/lockscreen/wallpaper.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" />
        <View style={[styles.frame, { top: TOP_BLEED, bottom: BOTTOM_BLEED }]}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${title} ${message}`}
            onPress={open}
            style={({ pressed }) => [styles.notification, notificationHeight ? { height: notificationHeight } : null, pressed && { opacity: 0.85 }]}
          >
            <BlurView intensity={30} tint="light" style={styles.platterBlur} />
            <View style={styles.appIcon}>
              {help ? (
                <Image source={require('../../assets/figma/lockscreen/logo-symbol-accent.svg')} style={styles.appSymbolAccent} />
              ) : (
                <Image source={require('../../assets/figma/lockscreen/logo-symbol-white.svg')} style={styles.appSymbol} />
              )}
            </View>
            <View style={styles.content}>
              <Text style={[typography.body1Bold, textColor]} numberOfLines={1}>
                {title}
              </Text>
              <Text style={[styles.caption, textColor]}>{message}</Text>
            </View>
            <Text style={styles.now}>now</Text>
            {footer}
          </Pressable>

          <Image source={require('../../assets/figma/lockscreen/flashlight-button.svg')} style={[styles.quickButton, { left: 48 }]} />
          <Image source={require('../../assets/figma/lockscreen/camera-button.svg')} style={[styles.quickButton, { right: 48 }]} />
          <Text style={styles.swipe}>swipe up to open</Text>
        </View>
      </Animated.View>
    </FullBleedOverlay>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black, overflow: 'hidden' },
  // 웹: 이미지가 뜨기 전 잠깐 보이는 바탕 — 검정 대신 배경화면 아래 끝 색
  rootWeb: { backgroundColor: WALLPAPER_BOTTOM },
  frame: { position: 'absolute', left: 0, right: 0 },
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
  // Figma Logo(27×17) 의 Symbol 영역 — 아이콘 기준 (4.33, 7.25)
  appSymbolAccent: { position: 'absolute', left: 4.33, top: 7.25, width: 16.3, height: 10.23 },
  content: { position: 'absolute', left: 58, right: 18, top: 19, gap: 5 },
  // Figma "Caption/Caption 1/R"
  caption: { fontFamily: fonts.robotoRegular, fontSize: 12, lineHeight: 15 },
  white: { color: colors.white },
  black: { color: colors.black },
  now: { position: 'absolute', top: 13, right: 15, fontSize: 13, letterSpacing: -0.31, color: colors.white, opacity: 0.72 },
  quickButton: { position: 'absolute', bottom: 52, width: 52, height: 51.97 },
  swipe: { position: 'absolute', bottom: 63, left: 0, right: 0, textAlign: 'center', fontSize: 17, letterSpacing: -0.408, color: colors.white, opacity: 0.64 },
});
