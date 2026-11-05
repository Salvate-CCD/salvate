import { Image } from '@/components/Image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type ScrollViewInstance,
  type NativeSyntheticEvent,
} from 'react-native';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { colors, radius, typography } from '@/theme/tokens';

const PAGES = 2;
// Figma 프레임(390×844)의 하단 좌표를 safe area 안쪽 기준으로 바꿀 때 쓰는 iPhone 13 홈 인디케이터 높이
const HOME_INDICATOR = 34;

export default function Onboarding() {
  const { width, height: windowHeight } = useWindowDimensions();
  const scroller = useRef<ScrollViewInstance>(null);
  const [page, setPage] = useState(0);
  // 실제 높이는 onLayout 으로 받지만, 첫 화면에서 아래 기준 요소가 위로 튀지 않도록 화면 높이로 시작
  const [height, setHeight] = useState(windowHeight);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const goTo = (next: number) => {
    scroller.current?.scrollTo({ x: next * width, animated: true });
    setPage(next);
  };

  return (
    <Screen background={colors.backgroundAlternative}>
      <ProgressBar total={PAGES} current={page + 1} />
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        style={styles.pager}
      >
        <InvitationPage size={{ width, height }} onNext={() => goTo(1)} />
        <FeaturesPage size={{ width, height }} onStart={() => router.replace('/welcome')} />
      </ScrollView>
    </Screen>
  );
}

type PageSize = { width: number; height: number };

// 동심원 묶음(466) 중 맨 위 글자/퍼진 원이 시작되는 지점 — 그 위는 빈 여백
const CIRCLE_VISIBLE_TOP = 23;
// 설명 글자와 동심원 사이 최소 간격
const CIRCLE_MIN_GAP = 12;

function InvitationPage({ size, onNext }: { size: PageSize; onNext: () => void }) {
  const [pulse] = useState(() => new Animated.Value(0));
  const [titleBottom, setTitleBottom] = useState(0);

  // 화면이 낮으면(예: 모바일 Safari 툴바) 아래 기준 동심원이 설명 글자를 덮음 → 남은 공간에 맞게 아래 기준으로 축소
  const room = size.height - CIRCLE_BOTTOM - titleBottom - CIRCLE_MIN_GAP;
  const fit = titleBottom > 0 ? Math.min(1, room / (CIRCLE_HEIGHT - CIRCLE_VISIBLE_TOP)) : 1;

  // 온보딩_1의 두 프레임(기본 / 퍼진 상태)을 오가는 호흡 애니메이션
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={size}>
      <TitleBlock
        style={styles.title}
        onLayout={(e) => setTitleBottom(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
        title="Connect by invitation"
        description="Give and receive help through your trusted network."
        titleWidth={350}
        descriptionWidth={269}
      />
      <View style={[styles.circleGraphic, { transform: [{ scale: Math.max(fit, 0) }] }]} pointerEvents="none">
        <Animated.View style={[styles.circle, { transform: [{ scale }] }]}>
          <Image source={require('../../assets/figma/onboarding-circle.svg')} style={styles.circleImage} />
        </Animated.View>
        <Text style={[typography.body2Medium, styles.ring, { top: 47, width: 81 }]}>{'Friends\nof Friends'}</Text>
        <Text style={[typography.body2Medium, styles.ring, { top: 116, width: 63 }]}>{'Your\nFriends'}</Text>
        <Text style={[typography.heading1Bold, styles.ring, styles.me]}>Me</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Next" onPress={onNext} style={styles.fab}>
        <Image source={require('../../assets/figma/fab-next.svg')} style={styles.fabImage} />
      </Pressable>
    </View>
  );
}

const FEATURES = [
  {
    no: '01',
    title: 'Talk to AI',
    body: 'Tell AI your situation and get a help request ready to post.',
    image: require('../../assets/figma/card-ai.svg'),
  },
  {
    no: '02',
    title: 'Nearby Help',
    body: 'Find nearby help within your friends and friends-of-friends network.',
    image: require('../../assets/figma/card-nearby.svg'),
  },
  {
    no: '03',
    title: 'Local Support',
    body: 'Find support through shared experiences.',
    image: require('../../assets/figma/card-local.svg'),
  },
];

function FeaturesPage({ size, onStart }: { size: PageSize; onStart: () => void }) {
  return (
    <View style={size}>
      <TitleBlock
        style={styles.title}
        title={'Tell us what\nyou need'}
        description="Get help from people you trust, nearby."
        titleWidth={350}
        descriptionWidth={269}
      />
      {/* 화면이 낮으면(예: 모바일 Safari 툴바) 카드가 Start 버튼에 가려짐 → 카드 영역만 스크롤 */}
      <ScrollView style={styles.cardsScroll} contentContainerStyle={styles.cards} showsVerticalScrollIndicator={false}>
        {FEATURES.map((f) => (
          <View key={f.no} style={styles.card}>
            <View style={styles.cardImage}>
              {f.no === '02' ? <NearbyGlow /> : null}
              <Image source={f.image} style={styles.cardSvg} />
            </View>
            <View style={styles.cardText}>
              <View style={styles.badge}>
                <View style={styles.badgeGlow} />
                <Text style={[typography.display3, styles.badgeText]}>{f.no}</Text>
              </View>
              <Text style={[typography.title2Bold, styles.cardTitle]}>{f.title}</Text>
              <Text style={[typography.body2Regular, styles.cardBody]}>{f.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.startWrap}>
        <Button label="Start" onPress={onStart} />
      </View>
    </View>
  );
}

// 2번 카드 이미지 아래에 깔리는 그라데이션 원 4개 (Figma에서 이미지보다 아래 레이어)
function NearbyGlow() {
  return (
    <>
      <Image source={require('../../assets/figma/card-nearby-ellipse143.svg')} style={{ position: 'absolute', left: 45, top: 43, width: 37, height: 53 }} />
      <Image source={require('../../assets/figma/card-nearby-ellipse144.svg')} style={{ position: 'absolute', left: 85, top: 51, width: 37, height: 45 }} />
      <Image source={require('../../assets/figma/card-nearby-ellipse145.svg')} style={{ position: 'absolute', left: 91, top: 27, width: 30, height: 30 }} />
      <Image source={require('../../assets/figma/card-nearby-ellipse145.svg')} style={{ position: 'absolute', left: 46, top: 20, width: 30, height: 30 }} />
    </>
  );
}

const CIRCLE_HEIGHT = 466;
const START_BOTTOM = 56 - HOME_INDICATOR; // Figma 기준 화면 하단에서 56px
const START_HEIGHT = 56; // Button size L
const CIRCLE_BOTTOM = 112 - HOME_INDICATOR; // Figma 기준 화면 하단에서 112px

const styles = StyleSheet.create({
  pager: { flex: 1 },
  title: { paddingTop: 23 },

  circleGraphic: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: CIRCLE_BOTTOM,
    height: CIRCLE_HEIGHT,
    alignItems: 'center',
    transformOrigin: 'bottom',
  },
  circle: { position: 'absolute', top: 36, width: 328, height: 328 },
  circleImage: { width: 328, height: 328 },
  ring: { position: 'absolute', textAlign: 'center', color: colors.accentPinkHeavy },
  me: { top: 188, width: 39 },
  fab: { position: 'absolute', right: 20, bottom: 64 - HOME_INDICATOR },
  fabImage: { width: 60, height: 60 },

  // Start 버튼 윗선까지만 — 카드 이미지 그림자(16)가 잘리지 않게 위아래 여백은 안쪽 padding 으로
  cardsScroll: { flex: 1, marginBottom: START_BOTTOM + START_HEIGHT },
  cards: { paddingHorizontal: 20, gap: 16, paddingTop: 16, paddingBottom: 16 },
  card: { flexDirection: 'row', height: 124, gap: 21 },
  cardImage: { width: 165, height: 124 },
  cardSvg: { position: 'absolute', left: -16, top: -16, width: 197, height: 156 },
  cardText: { flex: 1, paddingTop: 7, gap: 4 },
  badge: { alignSelf: 'flex-start', marginBottom: -4 }, // Figma: 번호와 제목 사이 간격 0
  badgeGlow: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 24,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryLight,
    filter: [{ blur: 4 }],
  },
  badgeText: { color: colors.primary },
  cardTitle: { color: colors.labelNormal },
  cardBody: { color: colors.labelNormal },
  startWrap: { position: 'absolute', left: 20, right: 20, bottom: START_BOTTOM },
});
