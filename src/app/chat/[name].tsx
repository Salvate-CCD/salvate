import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BubblePlaceholder } from '@/components/chat/BubblePlaceholder';
import { FrostedBar } from '@/components/chat/FrostedBar';
import { Header } from '@/components/Header';
import { colors } from '@/theme/tokens';

// 상태바 아래 헤더 높이 (Figma Header 100 − 상태바 47)
const HEADER_HEIGHT = 53;
// Figma "Bottom Section" 128 − 홈 인디케이터 34
const BOTTOM_HEIGHT = 94;
// Figma 는 말풍선 자리만 있음 — 받은/보낸 메시지가 번갈아 4쌍 (y 간격 99)
const BUBBLES = [false, true, false, true, false, true, false, true];

// 이름 표시 — 지금은 Figma 의 "Maria" 대화만 있음
function displayName(name?: string) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Figma 1608:33591 — 도움을 제안한 사람과의 채팅 (헤더 "Maria" + 말풍선 자리)
export default function Chat() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        style={StyleSheet.absoluteFill}
        // Figma "Scroll" top 134, 높이 945 (말풍선 773 + 아래 여백 172)
        contentContainerStyle={{ paddingTop: insets.top + 87, paddingBottom: 172, gap: 19 }}
        showsVerticalScrollIndicator={false}
      >
        {BUBBLES.map((mine, i) => (
          <BubblePlaceholder key={i} mine={mine} />
        ))}
      </ScrollView>

      {/* Figma "Header": 상태바까지 덮는 반투명 바 (blur 18) */}
      <FrostedBar blur={18} style={{ top: 0, height: insets.top + HEADER_HEIGHT, paddingTop: insets.top }}>
        {/* 바 테두리 1 만큼 위로 — 뒤로가기 y 54 */}
        <View style={styles.headerInner}>
          <Header title={displayName(name)} onBack={() => router.replace('/home')} />
        </View>
      </FrostedBar>

      {/* Figma "Bottom Section": 빈 반투명 바 (blur 8) — 입력창 등은 디자인에 없음 */}
      <FrostedBar blur={8} style={{ bottom: 0, height: insets.bottom + BOTTOM_HEIGHT }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlternative },
  headerInner: { marginTop: -1 },
});
