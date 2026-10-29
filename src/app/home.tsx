import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { ApprovalLockScreen } from '@/components/ApprovalLockScreen';
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

// Figma "Home(메인화면)" > "홈_메인페이지" (1608:34179 / 34369 / 34559)
export default function Home() {
  const { draft } = useSignup();
  const navHeight = useNavHeight();
  const firstName = draft.firstName.trim() || FALLBACK_NAME;
  const { width } = useWindowDimensions();

  // 도움 요청 게시 직후(/home?posted=1) — Figma "Post Modal 애니메이션용 연막" 1608:33799 → 1608:33987
  // 메시지 버튼이 제목 옆에 있는 홈을 잠깐 보여준 뒤, "Someone offered to help" 알림이 온 잠금화면이 내려옴
  const posted = useLocalSearchParams<{ posted?: string }>().posted === '1';
  const [showOffer, setShowOffer] = useState(false);
  useEffect(() => {
    if (!posted) return;
    const t = setTimeout(() => setShowOffer(true), OFFER_NOTIFICATION_MS);
    return () => clearTimeout(t);
  }, [posted]);

  return (
    // 내비게이션이 홈 인디케이터 영역까지 덮으므로 아래 여백은 직접 처리
    <Screen background={colors.backgroundAlternative} style={styles.noBottomPad}>
      <View style={styles.stage}>
        <NameWheel
          firstName={firstName}
          bottomInset={navHeight}
          hideMessageButton={posted}
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
              {posted ? (
                // Figma 1608:33799: 메시지 버튼이 제목 영역 (231, 37)
                <MessageButton
                  style={[styles.postedMessage, { left: width / 2 - 195 + 231 }]}
                  onPress={() => {
                    // TODO: 메시지 화면 연결
                  }}
                />
              ) : null}
            </View>
          }
        />
        <BottomNavigation selected="home" />
      </View>
      <ApprovalLockScreen
        visible={showOffer}
        date="Monday, June 3"
        time="9:41"
        title="Someone offered to help"
        message="Maria is ready to help. Tap to view."
        onOpenNotification={() => {
          setShowOffer(false);
          router.replace('/chat/maria');
        }}
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
  // Figma y 37 → 상태바 아래 -10
  postedMessage: { position: 'absolute', top: -10 },
});
