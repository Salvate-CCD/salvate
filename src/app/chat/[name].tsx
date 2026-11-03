import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApprovalLockScreen } from '@/components/ApprovalLockScreen';
import { Button } from '@/components/Button';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { FrostedBar } from '@/components/chat/FrostedBar';
import { HELP_PROGRESS, HelpProgressTrack } from '@/components/chat/HelpProgressTrack';
import { MatchConfirmedModal } from '@/components/chat/MatchConfirmedModal';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ProfileSheet } from '@/components/chat/ProfileSheet';
import { removeChat } from '@/components/chat/removedChats';
import { Dialog } from '@/components/Dialog';
import { CONTACTS, formatTime, REPLY_DELAY_MS, type ChatMessage, type Contact } from '@/components/chat/contacts';
import { useWebPageBackground } from '@/hooks/use-web-page-background';
import { colors, radius, typography } from '@/theme/tokens';

// 상태바 아래 헤더 높이 (Figma Header 100 − 상태바 47)
const HEADER_HEIGHT = 53;
// 매칭 버튼 줄: 프레임 y 116 (상태바 아래 69), 높이 40
const ACTIONS_TOP = 69;
// 대화 목록 시작 — 매칭 버튼이 있으면 Scroll Section y 176 (상태바 아래 129) + 위 여백 4,
// 없으면(도움 제공 채팅) y 124 + 8 (상태바 아래 85)
const SCROLL_TOP = 129;
const SCROLL_PAD = 4;
const SCROLL_TOP_PLAIN = 85;
// 진행 막대가 있으면 Scroll Section y 137 (상태바 아래 90), 처음 말풍선은 막대 영역(90 높이) 아래에서 시작
const SCROLL_TOP_PROGRESS = 90;
const SCROLL_PAD_PROGRESS = 53;
const PROGRESS_HEIGHT = 90;
// Help Completed 버튼: 입력 바 위 15, 대화 영역은 입력 바 위 71 에서 끝남
const COMPLETE_BOTTOM = 15;
const COMPLETE_SCROLL_BOTTOM = 71;
// 프로토타입: 실제 시간 대신 다음 단계 잠금화면 알림이 이만큼 뒤에 내려옴
const HELP_PUSH_MS = 4000;
// 잠금화면 알림 높이 — 진행 막대 포함 (Figma Platter 약 148)
const PUSH_PROGRESS_HEIGHT = 148;
// 입력 바: 입력칸은 바 위에서 16
const BAR_PADDING = 16;
// 말풍선 사이 간격 — 같은 사람이면 12, 사람이 바뀌면 20
const GAP_SAME = 12;
const GAP_CHANGE = 20;

// 디자인이 있는 상대(Maria, Miguel)가 아니면 이름만 보여주는 빈 채팅
function contactFor(name?: string): Contact {
  const key = (name ?? '').toLowerCase();
  return (
    CONTACTS[key] ?? {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      initialMessages: () => [],
      replies: [],
      matchActions: false,
    }
  );
}

// 매칭 확정 뒤 단계 — pending: 수락 전, confirmed: 분홍 표시만, departed·arrived: 진행 막대
type HelpStage = 'pending' | 'confirmed' | 'departed' | 'arrived';

// Figma "도움 요청_채팅" (1935:42314 ~ 42946, 1967:19083 / 19129 / 19184, Maria) / "도움 제공_채팅" (1935:44067 / 44089, Miguel)
export default function Chat() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const contact = contactFor(name);
  const insets = useSafeAreaInsets();
  useWebPageBackground(colors.backgroundAlternative);

  const [messages, setMessages] = useState<ChatMessage[]>(contact.initialMessages);
  const [replyIndex, setReplyIndex] = useState(0);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [stage, setStage] = useState<HelpStage>('pending');
  const [showPush, setShowPush] = useState(false);
  const [completion, setCompletion] = useState<'ask' | 'done' | null>(null);
  const [barHeight, setBarHeight] = useState(112);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  // 내가 보낸 뒤 잠시 조용하면 상대가 정해진 다음 답장을 보냄
  const { replies } = contact;
  useEffect(() => {
    if (lastSentAt === null || replyIndex >= replies.length) return;
    const t = setTimeout(() => {
      const text = replies[replyIndex];
      setMessages((list) => [...list, { id: `r${replyIndex}`, from: 'them', kind: 'text', text, at: new Date() }]);
      setReplyIndex((i) => i + 1);
      setLastSentAt(null);
    }, REPLY_DELAY_MS);
    return () => clearTimeout(t);
  }, [lastSentAt, replyIndex, replies]);

  // 다음 단계 알림: 매칭 확정 → 출발 알림 → 도착 알림
  const { helpPushes } = contact;
  useEffect(() => {
    if (!helpPushes || (stage !== 'confirmed' && stage !== 'departed')) return;
    const t = setTimeout(() => setShowPush(true), HELP_PUSH_MS);
    return () => clearTimeout(t);
  }, [stage, helpPushes]);

  const showActions = contact.matchActions && stage === 'pending';
  const hasProgress = stage === 'departed' || stage === 'arrived';
  const canComplete = stage === 'arrived';

  const closeMatchModal = () => {
    setShowMatch(false);
    if (!helpPushes || stage !== 'pending') return;
    setMessages((list) => [...list, { id: 'match-confirmed', from: 'system', kind: 'notice', text: 'Match Confirmed.', at: new Date() }]);
    setStage('confirmed');
  };

  const append = (message: ChatMessage) => {
    setMessages((list) => [...list, message]);
    setLastSentAt(Date.now());
  };

  const id = () => `me${Date.now()}`;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scroll}
        style={[
          styles.scroll,
          {
            marginTop: insets.top + (hasProgress ? SCROLL_TOP_PROGRESS : showActions ? SCROLL_TOP : SCROLL_TOP_PLAIN),
            marginBottom: canComplete ? barHeight + COMPLETE_SCROLL_BOTTOM : 0,
          },
        ]}
        // 입력 바는 대화 위에 덮이므로 그 높이 + 20 만큼 아래 여백 (완료 버튼이 있으면 대화 영역 자체가 위에서 끝남)
        contentContainerStyle={{
          paddingTop: hasProgress ? SCROLL_PAD_PROGRESS : showActions ? SCROLL_PAD : 0,
          paddingBottom: canComplete ? 0 : barHeight + 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // 새 메시지가 오면 맨 아래로
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        // 진행 단계가 바뀌어 대화 영역 크기가 달라져도 맨 아래 유지
        onLayout={() => scroll.current?.scrollToEnd({ animated: false })}
      >
        {messages.length === 0 && contact.emptyText ? <Text style={styles.empty}>{contact.emptyText}</Text> : null}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          // 같은 사람·같은 분의 마지막 말풍선에만 시각 표시
          const showTime = !next || next.from !== m.from || formatTime(next.at) !== formatTime(m.at);
          return (
            <View key={m.id} style={{ marginTop: !prev ? 0 : prev.from === m.from ? GAP_SAME : GAP_CHANGE }}>
              {m.kind === 'notice' ? (
                <View style={styles.notice}>
                  <Text style={[typography.body1Medium, styles.noticeText]}>{m.text}</Text>
                </View>
              ) : (
                <MessageBubble message={m} time={showTime ? formatTime(m.at) : undefined} />
              )}
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

      {/* Figma "Help Completed" 버튼 (1967:19184) */}
      {canComplete ? (
        <Button
          label="Help Completed"
          size="S"
          style={[styles.complete, { bottom: barHeight + COMPLETE_BOTTOM }]}
          onPress={() => setCompletion('ask')}
        />
      ) : null}

      {/* Figma "도움 진행 표시": #F5F5F5 → 투명 (71.667%부터), 헤더 바로 아래 */}
      {hasProgress ? (
        <LinearGradient
          pointerEvents="none"
          colors={[colors.backgroundAlternative, 'rgba(245,245,245,0)']}
          locations={[0.71667, 1]}
          style={[styles.progress, { top: insets.top + HEADER_HEIGHT }]}
        >
          <HelpProgressTrack state={stage === 'departed' ? HELP_PROGRESS.chatDeparted : HELP_PROGRESS.chatArrived} />
        </LinearGradient>
      ) : null}

      {/* Figma "도움 제공 수락/수락안함" — Find Another Match 는 아직 이후 화면 디자인이 없어 동작 없음 */}
      {showActions ? (
        <View style={[styles.actions, { top: insets.top + ACTIONS_TOP }]}>
          <Button label="Find Another Match" variant="ghost" size="S" style={styles.flex} />
          <Button label="Accept Match" size="S" style={styles.flex} onPress={() => setShowMatch(true)} />
        </View>
      ) : null}

      {/* Figma "Header": 상태바까지 덮는 반투명 바 (blur 18, 흰색 72%) */}
      <FrostedBar blur={18} tint={0.72} style={{ top: 0, height: insets.top + HEADER_HEIGHT, paddingTop: insets.top }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          onPress={() => (contact.backTo || !router.canGoBack() ? router.replace('/home') : router.back())}
          style={styles.back}
        >
          <Image source={require('../../../assets/figma/arrow-left.svg')} style={styles.icon28} />
        </Pressable>
        {/* "채팅 사람 이름" — 누르면 프로필 (프로필 디자인이 있는 상대만) */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${contact.name} profile`}
          disabled={!contact.profile}
          onPress={() => setShowProfile(true)}
          style={styles.title}
        >
          <Text style={[typography.body1Medium, styles.titleText]}>{contact.name}</Text>
          <Image source={require('../../../assets/figma/chat/header-down.svg')} style={styles.down} />
        </Pressable>
        {/* 전화 — 이후 화면 디자인이 없어 아직 동작 없음 */}
        <Image source={require('../../../assets/figma/chat/header-phone.svg')} style={[styles.icon28, styles.phone]} />
      </FrostedBar>

      {contact.profile ? (
        <ProfileSheet profile={contact.profile} visible={showProfile} onClose={() => setShowProfile(false)} />
      ) : null}
      {contact.matchActions ? <MatchConfirmedModal visible={showMatch} onClose={closeMatchModal} /> : null}

      {/* Figma 1967:19898 / 1967:19943 — 프로토타입에서 José 쪽은 진행 확인을 몇 초 뒤 자동으로 받음 */}
      {helpPushes ? (
        <ApprovalLockScreen
          visible={showPush}
          appearance="help"
          date="Monday, November 5"
          time="1:45"
          title={contact.name}
          message={stage === 'departed' ? helpPushes.arrived : helpPushes.departed}
          notificationHeight={stage === 'departed' ? undefined : PUSH_PROGRESS_HEIGHT}
          footer={
            stage === 'departed' ? null : <HelpProgressTrack state={HELP_PROGRESS.lockDeparted} style={styles.pushProgress} />
          }
          onOpenNotification={() => {
            setShowPush(false);
            setStage(stage === 'departed' ? 'arrived' : 'departed');
          }}
        />
      ) : null}

      {/* Figma 1967:20658 — 도움 완료 확인 */}
      <Dialog
        visible={completion === 'ask'}
        title="Help Completed?"
        message="Once both confirm, this chat will be permanently deleted."
        cancelLabel="Not Yet"
        cancelColor={colors.labelNeutral}
        confirmLabel="Confirm"
        onCancel={() => setCompletion(null)}
        onConfirm={() => setCompletion('done')}
      />
      {/* Figma 1967:20826 — 상대가 아직 안 누른 경우. 누른 사람은 채팅을 다시 볼 수 없음 */}
      <MatchConfirmedModal
        visible={completion === 'done'}
        title="Completion Confirmed!"
        message="Waiting for the other person to confirm."
        onClose={() => {
          setCompletion(null);
          removeChat(contact.name);
          router.replace('/home');
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlternative },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  // Body 1/Normal/M 16/18 Label/Assistive, 가운데
  empty: { ...typography.body1Medium, color: colors.labelAssistive, textAlign: 'center' },
  bottomBar: { bottom: 0, alignItems: 'center', paddingTop: BAR_PADDING, borderBottomWidth: 0 },
  // Figma 분홍 표시: Accent/Pink, 안쪽 여백 10, 가운데
  notice: { alignSelf: 'center', padding: 10, borderRadius: radius.s, backgroundColor: colors.accentPink },
  noticeText: { color: colors.labelNormal },
  complete: { position: 'absolute', alignSelf: 'center', width: 350 },
  progress: { position: 'absolute', left: 0, right: 0, height: PROGRESS_HEIGHT, paddingTop: 24, alignItems: 'center' },
  // Figma: 알림 기준 (-8, 약 85) — 프레임 폭 390 기준으로 배치
  pushProgress: { position: 'absolute', left: -8, top: 85 },
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
