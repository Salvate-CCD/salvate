import { BlurView } from 'expo-blur';
import { Image, type ImageSource } from '@/components/Image';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme/tokens';

// Figma 프레임에서 홈 인디케이터(34) 위로 보이는 내비게이션 높이 (97 - 34)
export const NAV_HEIGHT = 63;
// 탭 글자 아래 끝(21 + 29 + 14 = 64)이 NAV_HEIGHT 를 살짝 넘음 — Figma 에선 홈 인디케이터 영역에 걸침.
// 아래 inset 이 없는 기기(웹, 홈 버튼 아이폰 등)에서 글자가 잘리지 않도록 최소 10 확보
const MIN_BOTTOM = 10;

/** 내비게이션이 화면 아래에서 차지하는 높이 (inset 포함) */
export function useNavHeight() {
  return NAV_HEIGHT + Math.max(useSafeAreaInsets().bottom, MIN_BOTTOM);
}

type Tab = 'home' | 'need' | 'give' | 'services' | 'settings';

// 아이콘 SVG 에 색이 들어 있어서 선택(초록 #457D64)/비선택(회색 #7F7F7F) 파일을 따로 둠.
// settings 는 아직 선택 상태 디자인이 없어 회색만 있음
const TABS: { key: Tab; label: string; icon: ImageSource; activeIcon?: ImageSource }[] = [
  {
    key: 'home',
    label: 'home',
    icon: require('../../../assets/figma/need/nav-home-inactive.svg'),
    activeIcon: require('../../../assets/figma/home/nav-home.svg'),
  }, // icons/Base/home
  {
    key: 'need',
    label: 'need',
    icon: require('../../../assets/figma/home/nav-need.svg'),
    activeIcon: require('../../../assets/figma/need/nav-need-active.svg'),
  }, // icons/Health/love-and-help
  {
    key: 'give',
    label: 'give',
    icon: require('../../../assets/figma/home/nav-give.svg'),
    activeIcon: require('../../../assets/figma/give/nav-give-active.svg'),
  }, // icons/Travels/enquire
  {
    key: 'services',
    label: 'services',
    icon: require('../../../assets/figma/home/nav-services.svg'),
    activeIcon: require('../../../assets/figma/services/nav-services-active.svg'),
  }, // icons/Build/city-one
  { key: 'settings', label: 'settings', icon: require('../../../assets/figma/home/nav-settings.svg') }, // icons/Base/setting-two
];

// Figma: backdrop-blur 8px (opacity/16 ÷ 2)
const webBlur = Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as ViewStyle) : null;

// Figma "Bottom Navigation" + "Bottom Navigation_Selection" (선택된 탭 뒤 흐린 초록 원)
export function BottomNavigation({ selected }: { selected: Tab }) {
  const navHeight = useNavHeight();
  const { width } = useWindowDimensions();
  const index = TABS.findIndex((t) => t.key === selected);
  // 아이템 간격 — 390 폭에서 75.5
  const step = (width - 40 - 48) / (TABS.length - 1);

  const onPress = (tab: Tab) => {
    if (tab === selected) return;
    if (tab === 'home') router.replace('/home');
    else if (tab === 'need') router.replace('/need');
    else if (tab === 'give') router.replace('/give');
    else if (tab === 'services') router.replace('/services');
    // TODO: settings 화면이 생기면 router 로 연결
  };

  return (
    <>
      {/* Selection 원은 내비게이션 배경 아래에 깔림 (Figma 레이어 순서). 48×48 원 + blur → 120×120 SVG */}
      {/* 원의 blur 가 화면 아래로 넘쳐 웹 페이지가 스크롤되지 않도록 부모 영역으로 잘라냄 */}
      <View pointerEvents="none" style={styles.selectionClip}>
        <Image
          source={require('../../../assets/figma/home/nav-selection.svg')}
          style={[styles.selection, { bottom: navHeight + 13 - 120, left: 20 - 36 + index * step }]}
        />
      </View>
      <View style={[styles.nav, webBlur, { height: navHeight }]}>
        {Platform.OS !== 'web' ? <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} /> : null}
        <View style={styles.background} />
        <View style={styles.items}>
          {TABS.map((tab) => {
            const active = tab.key === selected;
            return (
              <Pressable
                key={tab.key}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                onPress={() => onPress(tab.key)}
                style={styles.item}
              >
                <Image source={active ? (tab.activeIcon ?? tab.icon) : tab.icon} style={styles.icon} />
                <Text numberOfLines={1} style={[styles.label, { color: active ? colors.primary : colors.neutral500 }]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  selectionClip: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  selection: { position: 'absolute', width: 120, height: 120 },
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.white,
  },
  // Figma "background": surface/normal 44%
  background: { ...StyleSheet.absoluteFill, backgroundColor: colors.surfaceNormal, opacity: 0.44 },
  // Figma: pt 22 (테두리 1 포함), px 20, 48×48 아이템 justify-between
  items: {
    position: 'absolute',
    top: 21,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: { width: 48, height: 48, alignItems: 'center' },
  icon: { position: 'absolute', top: 5, width: 24, height: 24 },
  // Caption 2/M, top 60.42% (29px)
  label: {
    position: 'absolute',
    top: 29,
    width: 60,
    maxWidth: 60, // 웹 numberOfLines 의 maxWidth 100%(=48) 때문에 글자가 6px 왼쪽으로 쏠리던 것 방지
    left: -6,
    textAlign: 'center',
    fontFamily: fonts.robotoMedium,
    fontSize: 11,
    lineHeight: 14,
  },
});
