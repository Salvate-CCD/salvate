import { Image } from '@/components/Image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ApprovalLockScreen } from '@/components/ApprovalLockScreen';
import { HELP_PUSH_MS } from '@/components/chat/contacts';
import { CARLOS_REQUEST_ID, CATEGORIES, REQUESTS } from '@/components/give/giveData';
import { RequestListCard } from '@/components/give/RequestListCard';
import { UrgencyTabs } from '@/components/give/UrgencyTabs';
import { BottomNavigation, useNavHeight } from '@/components/home/BottomNavigation';
import type { Urgency } from '@/components/need/preview/mockRequest';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { colors, fonts } from '@/theme/tokens';

// Figma 1967:20877 알림 높이
const CRITICAL_PUSH_HEIGHT = 102;
// 긴급 요청 알림은 탭에 처음 들어왔을 때 한 번만 — 새로고침하면 다시 뜸
let criticalPushShown = false;

// Figma "Give(도움 제공 페이지)" > "도움 제공_메인페이지" (1935:43752 / 43823 / 43887 / 43972)
// 긴급도 탭마다 목록이 바뀜. 카테고리는 선택 표시만 (목록은 바뀌지 않음)
export default function GiveHelp() {
  const navHeight = useNavHeight();
  const [urgency, setUrgency] = useState<Urgency>('Critical');
  const [category, setCategory] = useState(CATEGORIES[0].label);
  const [showCritical, setShowCritical] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (criticalPushShown) return;
      const t = setTimeout(() => {
        criticalPushShown = true;
        setShowCritical(true);
      }, HELP_PUSH_MS);
      return () => clearTimeout(t);
    }, []),
  );

  return (
    // 내비게이션이 홈 인디케이터 영역까지 덮으므로 아래 여백은 직접 처리
    <Screen background={colors.backgroundAlternative} style={styles.noBottomPad}>
      <TitleBlock title="Give Help" description="See who needs help within your network." descriptionWidth={257} />

      {/* Figma "Tap" y 207 — 설명 아래 28 */}
      <UrgencyTabs value={urgency} onChange={setUrgency} style={styles.tabs} />

      {/* Figma "Category" (21, 256) 369×20 — 가로 스크롤, 항목 간격 20 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((c) => {
          const active = c.label === category;
          return (
            <Pressable
              key={c.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setCategory(c.label)}
              style={styles.category}
            >
              <Image source={c.icon} style={styles.categoryIcon} />
              <Text style={[styles.categoryLabel, active && styles.categoryActive]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Figma "Scroll section" y 295 — 목록은 위 12, 카드 간격 12, 아래는 내비게이션에 가리지 않게 */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.list, { paddingBottom: navHeight + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {REQUESTS[urgency].map((item) => (
          <RequestListCard key={item.id} item={item} onPress={() => router.push({ pathname: '/give/request', params: { id: item.id } })} />
        ))}
      </ScrollView>

      <BottomNavigation selected="give" />

      {/* Figma 1967:20877 — 프로토타입에서는 Give 탭에 들어오고 몇 초 뒤 */}
      <ApprovalLockScreen
        visible={showCritical}
        appearance="critical"
        eyebrow="sálvate"
        date="Monday, June 3"
        time="9:41"
        title="Critical Help Request"
        message="Carlos urgently needs a ride to the hospital. Can you help?"
        notificationHeight={CRITICAL_PUSH_HEIGHT}
        onOpenNotification={() => {
          setShowCritical(false);
          router.push({ pathname: '/give/request', params: { id: CARLOS_REQUEST_ID } });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  noBottomPad: { paddingBottom: 0, overflow: 'hidden' },
  flex: { flex: 1 },
  // TitleBlock 아래 여백 24 + 4 = 28
  tabs: { alignSelf: 'center', marginTop: 4 },
  categories: { flexGrow: 0, marginTop: 16, marginLeft: 21, height: 20 },
  categoryRow: { gap: 20, alignItems: 'center', paddingRight: 20 },
  category: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryIcon: { width: 16, height: 16 },
  // Body 1/Normal/R 16/18 Label/Neutral — 선택은 Body 1/Normal/B Label/Strong
  categoryLabel: { fontFamily: fonts.robotoRegular, fontSize: 16, lineHeight: 18, color: colors.labelNeutral },
  categoryActive: { fontFamily: fonts.robotoBold, color: colors.labelStrong },
  // Category 아래 끝(276) → 목록 영역(295) 19, 목록 위 여백 12
  list: { marginTop: 19, paddingTop: 12, paddingHorizontal: 20, gap: 12, alignItems: 'center' },
});
