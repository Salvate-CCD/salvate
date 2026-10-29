import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { BottomNavigation, useNavHeight } from '@/components/home/BottomNavigation';
import { Screen } from '@/components/Screen';
import { SUPPORT_CATEGORIES, SupportCategoryCard } from '@/components/services/SupportCategoryCard';
import { TitleBlock } from '@/components/TitleBlock';
import { colors } from '@/theme/tokens';

// Figma "Category": 3열 그리드, 칸 간격 16, 좌우 20 → 폭 390 에서 카드 106
const GRID_WIDTH = 350;
const GAP = 16;
const CARD = (GRID_WIDTH - GAP * 2) / 3;

// Figma "Services(기관 도움 페이지)" > "기관도움_메인페이지" (1608:34159)
export default function FindSupport() {
  const navHeight = useNavHeight();
  return (
    // 내비게이션이 홈 인디케이터 영역까지 덮으므로 아래 여백은 직접 처리
    <Screen background={colors.backgroundAlternative} style={styles.noBottomPad}>
      <TitleBlock title="Find Support" description="Find local organizations that can help you." descriptionWidth={257} />

      <View style={styles.grid}>
        {SUPPORT_CATEGORIES.map((c) => (
          // TODO: 카테고리별 기관 목록 화면 디자인이 없어 아직 동작 없음
          <SupportCategoryCard key={c.key} category={c} size={CARD} onPress={() => {}} />
        ))}
      </View>

      <View style={styles.flex} />
      {/* Figma "Button": 버튼 아래 끝과 내비게이션 사이 19 */}
      <View style={[styles.action, { marginBottom: navHeight + 19 }]}>
        {/* TODO: Hotline Call 이후 동작(전화 연결 등) 디자인이 없어 아직 동작 없음 */}
        <Button label="Hotline Call" onPress={() => {}} />
      </View>

      <BottomNavigation selected="services" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  noBottomPad: { paddingBottom: 0, overflow: 'hidden' },
  flex: { flex: 1 },
  // Figma "Category" py 24 (제목 블록 바로 아래)
  grid: {
    width: GRID_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    paddingTop: 24,
  },
  action: { width: GRID_WIDTH, alignSelf: 'center' },
});
