import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BottomNavigation, useNavHeight } from '@/components/home/BottomNavigation';
import { SlideToCall } from '@/components/need/SlideToCall';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { colors } from '@/theme/tokens';

// Figma "Need(도움 요청 페이지)" > "도움 요청_메인페이지_slide default / slide after" (1608:33521 / 33543)
export default function CallWithAI() {
  const navHeight = useNavHeight();
  return (
    // 내비게이션이 홈 인디케이터 영역까지 덮으므로 아래 여백은 직접 처리
    <Screen background={colors.backgroundAlternative} style={styles.noBottomPad}>
      <View style={styles.stage}>
        <TitleBlock
          title="Call with AI"
          description="A private space to talk about what you need."
          descriptionWidth={257}
        />

        {/* 그래픽 + 슬라이더를 제목과 내비 사이 가운데에 둠 (iPhone 13 에서는 Figma 위치와 같음) */}
        <View style={[styles.body, { marginBottom: navHeight }]}>
          {/* Figma "Graiphic" 389×370 — 초록 알약 3개 + 분홍 빛 (Graphic 280×230, SVG 는 glow 포함 430×430) */}
          <View pointerEvents="none" style={styles.graphicArea}>
            <Image source={require('../../assets/figma/need/graphic.svg')} style={styles.graphic} />
          </View>

          {/* Figma "Slide" 390×174 — 배경(280)은 영역 안 위에서 49, 가로 가운데 */}
          <View style={styles.slideArea}>
            <SlideToCall onComplete={() => router.push('/need/call')} />
          </View>
        </View>

        <BottomNavigation selected="need" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // 웹(아래 inset 0)에서 내비 아이템이 화면 밖으로 몇 px 넘쳐 페이지가 스크롤되지 않게 잘라냄
  noBottomPad: { paddingBottom: 0, overflow: 'hidden' },
  stage: { flex: 1, userSelect: 'none' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  graphicArea: { width: 389, height: 370 },
  // Graphic 가운데 = (194, 185) → 430 SVG 의 왼쪽 위 (-21, -30)
  graphic: { position: 'absolute', left: -21, top: -30, width: 430, height: 430 },
  slideArea: { height: 174, paddingTop: 49, alignItems: 'center' },
});
