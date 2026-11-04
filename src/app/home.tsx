import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ApprovalLockScreen } from '@/components/ApprovalLockScreen';
import { HELP_PUSH_MS } from '@/components/chat/contacts';
import { clearCompletionPush, peekCompletionPush, restoreChat } from '@/components/chat/removedChats';
import { BottomNavigation, useNavHeight } from '@/components/home/BottomNavigation';
import { MessageButton } from '@/components/home/MessageButton';
import { NameWheel } from '@/components/home/NameWheel';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { useSignup } from '@/state/signup';
import { colors } from '@/theme/tokens';

// 로그인으로 들어오면 가입 이름이 없으므로 Figma 예시 이름을 보여줌
const FALLBACK_NAME = 'José';
// 도움 요청 게시 후 홈이 보인 뒤 잠금화면 알림이 내려오기까지의 시간
const OFFER_NOTIFICATION_MS = 1000;
// Figma 1967:20707 알림 높이 — 본문 두 줄
const COMPLETED_PUSH_HEIGHT = 89;

// Figma "Home(메인화면)" > "홈_메인페이지" (1935:44135 / 44795) + 메시지 목록 (1935:44355)
export default function Home() {
  const { draft } = useSignup();
  const navHeight = useNavHeight();
  const firstName = draft.firstName.trim() || FALLBACK_NAME;

  // 도움 요청 게시 직후(/home?posted=1) — Figma "Post Modal 애니메이션용 연막" (1935:43195 → 1935:43383)
  // 홈을 잠깐 보여준 뒤 "Someone offered to help" 알림이 온 잠금화면이 내려옴
  const posted = useLocalSearchParams<{ posted?: string }>().posted === '1';
  const [showOffer, setShowOffer] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  useEffect(() => {
    if (!posted) return;
    const t = setTimeout(() => setShowOffer(true), OFFER_NOTIFICATION_MS);
    return () => clearTimeout(t);
  }, [posted]);

  // 내가 먼저 Help Completed 를 누르고 돌아온 뒤, 상대도 눌렀다는 알림 (Figma 1967:20707)
  const [completedWith, setCompletedWith] = useState<string | null>(null);
  useFocusEffect(
    useCallback(() => {
      const name = peekCompletionPush();
      if (!name) return;
      const t = setTimeout(() => {
        clearCompletionPush();
        setCompletedWith(name);
      }, HELP_PUSH_MS);
      return () => clearTimeout(t);
    }, []),
  );

  return (
    // 내비게이션이 홈 인디케이터 영역까지 덮으므로 아래 여백은 직접 처리
    <Screen background={colors.backgroundAlternative} style={styles.noBottomPad}>
      <View style={styles.stage}>
        <NameWheel
          firstName={firstName}
          bottomInset={navHeight}
          onInteract={() => setMessagesOpen(false)}
          overlay={
            // Figma "Title & Descriotion": 휠 위에 덮이는 #F5F5F5 → 투명 그라데이션 (70%부터)
            <View pointerEvents="none" style={styles.titleLayer}>
              <LinearGradient
                colors={[colors.backgroundAlternative, 'rgba(245,245,245,0)']}
                locations={[0.7, 1]}
                style={styles.gradient}
              />
              <TitleBlock
                title="Your trusted community is here"
                description="Tap names to view activity. Rotate to explore. Closer friends have helped you more."
                titleWidth={350}
                descriptionWidth={276}
                style={styles.title}
                descriptionStyle={styles.description}
              />
            </View>
          }
        />
        {/* Figma (314, 671) — 오른쪽 20, 내비게이션 위 20. 누르면 대화 목록이 버튼 위에 뜸 */}
        <MessageButton
          open={messagesOpen}
          onPress={() => setMessagesOpen((v) => !v)}
          style={[styles.message, { bottom: navHeight + 20 }]}
        />
        <BottomNavigation selected="home" />
      </View>
      <ApprovalLockScreen
        visible={showOffer}
        appearance="help"
        date="Monday, June 3"
        time="9:41"
        title="Someone offered to help"
        message="Maria is ready to help. Tap to view."
        onOpenNotification={() => {
          setShowOffer(false);
          // 새 요청에 다시 도움 제안이 온 것이므로 시연을 반복하면 목록에도 다시 나타남
          restoreChat('Maria');
          router.replace('/chat/maria');
        }}
      />
      <ApprovalLockScreen
        visible={completedWith !== null}
        appearance="help"
        date="Monday, June 3"
        time="9:41"
        title="Help Completed!"
        message={`Both you and ${completedWith} have confirmed completion. Thank you for helping!`}
        notificationHeight={COMPLETED_PUSH_HEIGHT}
        onOpenNotification={() => setCompletedWith(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  noBottomPad: { paddingBottom: 0 },
  // 웹에서 휠을 드래그할 때 글자가 선택(하이라이트)되지 않도록
  stage: { flex: 1, userSelect: 'none' },
  titleLayer: { position: 'absolute', left: 0, right: 0, top: 0 },
  // Figma 프레임 y 1 ~ 238 (상태바 47 아래 기준 -46 ~ 191)
  gradient: { position: 'absolute', left: 0, right: 0, top: -46, height: 237 },
  // 제목 텍스트 y 73 → 상태바 아래 26
  title: { paddingTop: 26 },
  // Figma Description 텍스트는 y 155 (제목 아래 10px) — 기본 간격보다 2px 위
  description: { marginTop: -2 },
  message: { position: 'absolute', right: 20 },
});
