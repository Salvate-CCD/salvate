import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { startHelping } from '@/components/give/completedRequests';
import { findRequest, MIGUEL_REQUEST } from '@/components/give/giveData';
import { RelationChip } from '@/components/give/RelationChip';
import { Header } from '@/components/Header';
import { BottomNavigation, useNavHeight } from '@/components/home/BottomNavigation';
import { RequestCard } from '@/components/need/preview/RequestCard';
import { TitleBlock } from '@/components/TitleBlock';
import { useWebPageBackground } from '@/hooks/use-web-page-background';
import { colors } from '@/theme/tokens';

// Figma "header" 높이 82 − 상태바 47
const HEADER_HEIGHT = 35;

// Figma "Give(도움 제공 페이지)" > "도움 제공_상세페이지" (1967:20278 Miguel / 1967:20296 Carlos) — 요청 내용 확인 후 Give Help
export default function RequestDetails() {
  const insets = useSafeAreaInsets();
  const navHeight = useNavHeight();
  useWebPageBackground(colors.backgroundAlternative);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const item = findRequest(id);
  const { name, chat, request } = item?.detail ?? MIGUEL_REQUEST;

  return (
    <View style={styles.root}>
      {/* Figma "Scroll" — 헤더 아래(상태바 아래 31)부터, 아래는 내비게이션에 가리지 않게 */}
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 31, paddingBottom: navHeight + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <TitleBlock
          title={name}
          titleAccessory={<RelationChip relation={item?.relation ?? 'Your Friend'} />}
          description="Review the request and decide if you can help."
          descriptionWidth={257}
          style={styles.title}
        />
        <RequestCard request={request} />
        {/* Figma "스크롤 하단 여백용 프레임" 32 */}
        <Button label="Give Help" style={styles.button} onPress={() => {
            if (item) startHelping(chat, item.id);
            router.push(`/chat/${chat}`);
          }} />
      </ScrollView>

      {/* Figma "header": 뒤로가기 + "Request Details" — 스크롤되는 내용을 가림 */}
      <View style={[styles.header, { height: insets.top + HEADER_HEIGHT, paddingTop: insets.top }]}>
        <Header title="Request Details" />
      </View>

      <BottomNavigation selected="give" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlternative },
  content: { alignItems: 'center' },
  // Figma "Description" 아래 여백 20
  title: { alignSelf: 'stretch', paddingBottom: 20 },
  button: { width: 350, marginTop: 32 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.backgroundNormal },
});
