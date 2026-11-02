import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { FrostedBar } from '@/components/chat/FrostedBar';
import { MatchConfirmedModal } from '@/components/chat/MatchConfirmedModal';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ProfileSheet } from '@/components/chat/ProfileSheet';
import {
  formatTime,
  initialMessages,
  REPLY_DELAY_MS,
  SCRIPTED_REPLIES,
  type ChatMessage,
} from '@/components/chat/mariaChat';
import { useWebPageBackground } from '@/hooks/use-web-page-background';
import { colors, typography } from '@/theme/tokens';

// 상태바 아래 헤더 높이 (Figma Header 100 − 상태바 47)
const HEADER_HEIGHT = 53;
// 매칭 버튼 줄: 프레임 y 116 (상태바 아래 69), 높이 40
const ACTIONS_TOP = 69;
// 대화 목록 시작: Scroll Section y 176 (상태바 아래 129) + 위 여백 4
const SCROLL_TOP = 129;
// 입력 바: 입력칸은 바 위에서 16
const BAR_PADDING = 16;
// 말풍선 사이 간격 — 같은 사람이면 12, 사람이 바뀌면 20
const GAP_SAME = 12;
const GAP_CHANGE = 20;

// 이름 표시 — 지금은 Figma 의 "Maria" 대화만 있음
function displayName(name?: string) {
  if (!name) return '';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Figma "Need(도움 요청 페이지)" > "도움 요청_채팅" (1935:42314 ~ 42790) — 도움을 제안한 사람과의 채팅
export default function Chat() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const insets = useSafeAreaInsets();
  useWebPageBackground(colors.backgroundAlternative);

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [replyIndex, setReplyIndex] = useState(0);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [barHeight, setBarHeight] = useState(112);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  // 내가 보낸 뒤 잠시 조용하면 Maria 가 정해진 다음 답장을 보냄
  useEffect(() => {
    if (lastSentAt === null || replyIndex >= SCRIPTED_REPLIES.length) return;
    const t = setTimeout(() => {
      const text = SCRIPTED_REPLIES[replyIndex];
      setMessages((list) => [...list, { id: `r${replyIndex}`, from: 'them', kind: 'text', text, at: new Date() }]);
      setReplyIndex((i) => i + 1);
      setLastSentAt(null);
    }, REPLY_DELAY_MS);
    return () => clearTimeout(t);
  }, [lastSentAt, replyIndex]);

  const append = (message: ChatMessage) => {
    setMessages((list) => [...list, message]);
    setLastSentAt(Date.now());
  };

  const id = () => `me${Date.now()}`;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scroll}
        style={[styles.scroll, { marginTop: insets.top + SCROLL_TOP }]}
        // 입력 바는 대화 위에 덮이므로 그 높이 + 20 만큼 아래 여백
        contentContainerStyle={[styles.scrollContent, { paddingBottom: barHeight + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // 새 메시지가 오면 맨 아래로
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          // 같은 사람·같은 분의 마지막 말풍선에만 시각 표시
          const showTime = !next || next.from !== m.from || formatTime(next.at) !== formatTime(m.at);
          return (
            <View key={m.id} style={{ marginTop: !prev ? 0 : prev.from === m.from ? GAP_SAME : GAP_CHANGE }}>
              <MessageBubble message={m} time={showTime ? formatTime(m.at) : undefined} />
            </View>
          );
        })}
      </ScrollView>

      {/* Figma "Bottom Section": 반투명 바 (blur 22, 흰색 88%). 키보드가 올라오면 홈 인디케이터 여백 없음 */}
      <FrostedBar
        blur={22}
        tint={0.88}
        // 홈 인디케이터 위 여백 14 (Figma 112 = 16 + 48 + 14 + 34)
        style={[styles.bottomBar, { paddingBottom: inputFocused ? BAR_PADDING : insets.bottom + 14 }]}
        onLayout={(e) => setBarHeight(e.nativeEvent.layout.height)}
      >
        <ChatComposer
          onFocusChange={setInputFocused}
          onSendText={(text) => append({ id: id(), from: 'me', kind: 'text', text, at: new Date() })}
          onSendVoice={(seconds) => append({ id: id(), from: 'me', kind: 'voice', seconds, at: new Date() })}
        />
      </FrostedBar>

      {/* Figma "도움 제공 수락/수락안함" — Find Another Match 는 아직 이후 화면 디자인이 없어 동작 없음 */}
      <View style={[styles.actions, { top: insets.top + ACTIONS_TOP }]}>
        <Button label="Find Another Match" variant="ghost" size="S" style={styles.flex} />
        <Button label="Accept Match" size="S" style={styles.flex} onPress={() => setShowMatch(true)} />
      </View>

      {/* Figma "Header": 상태바까지 덮는 반투명 바 (blur 18, 흰색 72%) */}
      <FrostedBar blur={18} tint={0.72} style={{ top: 0, height: insets.top + HEADER_HEIGHT, paddingTop: insets.top }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          onPress={() => router.replace('/home')}
          style={styles.back}
        >
          <Image source={require('../../../assets/figma/arrow-left.svg')} style={styles.icon28} />
        </Pressable>
        {/* "채팅 사람 이름" — 누르면 프로필 */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${displayName(name)} profile`}
          onPress={() => setShowProfile(true)}
          style={styles.title}
        >
          <Text style={[typography.body1Medium, styles.titleText]}>{displayName(name)}</Text>
          <Image source={require('../../../assets/figma/chat/header-down.svg')} style={styles.down} />
        </Pressable>
        {/* 전화 — 이후 화면 디자인이 없어 아직 동작 없음 */}
        <Image source={require('../../../assets/figma/chat/header-phone.svg')} style={[styles.icon28, styles.phone]} />
      </FrostedBar>

      <ProfileSheet visible={showProfile} onClose={() => setShowProfile(false)} />
      <MatchConfirmedModal visible={showMatch} onClose={() => setShowMatch(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlternative },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 4 },
  bottomBar: { bottom: 0, alignItems: 'center', paddingTop: BAR_PADDING, borderBottomWidth: 0 },
  actions: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  // Figma: 뒤로가기 (9, 53), 전화 (344, 53), 이름 묶음 가운데 y 55 — 상태바 아래 기준, 바 테두리 1 만큼 보정
  back: { position: 'absolute', left: 8, bottom: HEADER_HEIGHT - 6 - 28 - 1 },
  phone: { position: 'absolute', right: 17, bottom: HEADER_HEIGHT - 6 - 28 - 1 },
  icon28: { width: 28, height: 28 },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: HEADER_HEIGHT - 8 - 24 - 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleText: { color: colors.labelNeutral },
  down: { width: 24, height: 24 },
});
