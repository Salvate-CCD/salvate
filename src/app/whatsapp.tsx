import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ScrollViewInstance,
  type TextInputInstance,
} from 'react-native';
import { Screen } from '@/components/Screen';
import { Composer } from '@/components/whatsapp/Composer';
import { BotMessage, ChatIntro, OutgoingMessage } from '@/components/whatsapp/Messages';
import { WhatsAppSplash } from '@/components/whatsapp/Splash';
import { wa } from '@/components/whatsapp/theme';
import { createVerifyLink, type WhatsAppFlow } from '@/lib/whatsapp';
import { colors, typography } from '@/theme/tokens';

const SPLASH_MS = 1200; // "왓츠앱 전환" 노출 시간
const FADE_MS = 300;
const PREFILL_MS = 700; // 빈 대화창(왓츠앱 인증 1번 프레임)을 잠깐 보여준 뒤 링크를 채움
const RETURN_MS = 1500; // 전송 후 앱으로 돌아가기까지

// Figma 채팅 배경(941×1672 이미지)을 389×651 "채팅 영역"에 cover로 채웠을 때의 세로 오프셋
const WALLPAPER_RATIO = 1672 / 941;
const CHAT_AREA_HEIGHT = 651;

// 로그인 흐름: 회원가입 때 보낸 링크가 대화 기록에 남아 있음 (Figma 로그인 "왓츠앱 인증")
const SIGNUP_HISTORY_LINK =
  'https://salvate.example/auth/whatsapp/verify?session=7f3a92b6c8414e28a05d9f637b12c4e8&token=K9m2Qx7T4v8Np3Y6';
// Figma 전송 상태 프레임의 시간 표기
const SENT_TIME: Record<WhatsAppFlow, string> = { signup: '09:36 am', login: '10:41 am' };

type Sent = { id: number; text: string; time: string };

// Figma "왓츠앱 전환" → "왓츠앱 인증" — 실제 WhatsApp을 열지 않고 앱 안에서 이어 보여주는 프로토타입
export default function WhatsApp() {
  const params = useLocalSearchParams<{ flow?: string }>();
  const flow: WhatsAppFlow = params.flow === 'login' ? 'login' : 'signup';
  const [splash, setSplash] = useState(true);
  const [fade] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const t = setTimeout(() => {
      setSplash(false);
      Animated.timing(fade, { toValue: 1, duration: FADE_MS, useNativeDriver: Platform.OS !== 'web' }).start();
    }, SPLASH_MS);
    return () => clearTimeout(t);
  }, [fade]);

  return (
    <View style={styles.root}>
      {splash ? <WhatsAppSplash /> : <Animated.View style={[styles.flex, { opacity: fade }]}><Chat flow={flow} /></Animated.View>}
    </View>
  );
}

function Chat({ flow }: { flow: WhatsAppFlow }) {
  const { width } = useWindowDimensions();
  const input = useRef<TextInputInstance>(null);
  const scroller = useRef<ScrollViewInstance>(null);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<Sent[]>(() =>
    flow === 'login' ? [{ id: 0, text: SIGNUP_HISTORY_LINK, time: SENT_TIME.signup }] : [],
  );
  const [done, setDone] = useState(false);

  // 인증 링크를 입력칸에 미리 채우고 키보드를 연다
  useEffect(() => {
    const t = setTimeout(() => {
      setDraft(createVerifyLink());
      input.current?.focus();
    }, PREFILL_MS);
    return () => clearTimeout(t);
  }, []);

  // 전송 후 잠시 뒤 앱으로 복귀
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      router.replace({ pathname: '/signup/verified', params: { flow } });
    }, RETURN_MS);
    return () => clearTimeout(t);
  }, [done, flow]);

  const onSend = () => {
    const text = draft.trim();
    if (!text || done) return;
    setSent((prev) => [...prev, { id: prev.length + 1, text, time: SENT_TIME[flow] }]);
    setDraft('');
    input.current?.blur();
    Keyboard.dismiss();
    setDone(true);
  };

  const wallpaperHeight = width * WALLPAPER_RATIO;
  const wallpaperTop = -(wallpaperHeight - CHAT_AREA_HEIGHT * (width / 390)) / 2;

  return (
    <Screen background={wa.background}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Figma 상단 — 뒤로가기 / 프로필 원 / 이름 + 인증 배지 */}
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()}>
            <Image source={require('../../assets/figma/whatsapp/back.svg')} style={styles.back} />
          </Pressable>
          {/* Figma 메모 "로고 빼고" — 로고 없이 Ellipse 139 원만 둔다 */}
          <Image source={require('../../assets/figma/whatsapp/avatar-header.svg')} style={styles.avatar} />
          <Text style={[typography.body1Medium, styles.name]}>Sálvate</Text>
          <Image source={require('../../assets/figma/whatsapp/badge-header.svg')} style={styles.badge} />
        </View>

        {/* Figma "채팅 영역" */}
        <View style={styles.chat}>
          <Image
            source={require('../../assets/figma/whatsapp/wallpaper.png')}
            contentFit="fill"
            style={[styles.wallpaper, { top: wallpaperTop, width, height: wallpaperHeight }]}
          />
          <ScrollView
            ref={scroller}
            contentContainerStyle={styles.messages}
            keyboardShouldPersistTaps="handled"
            // 메시지가 늘거나(전송) 화면이 줄 때(키보드·입력칸 확장) 항상 마지막 메시지를 보여줌
            onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: true })}
            onLayout={() => scroller.current?.scrollToEnd({ animated: false })}
          >
            <ChatIntro />
            <BotMessage />
            {sent.map((m) => (
              <OutgoingMessage key={m.id} text={m.text} time={m.time} />
            ))}
          </ScrollView>
        </View>

        <Composer ref={input} value={draft} onChangeText={setDraft} onSend={onSend} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: wa.background },
  flex: { flex: 1 },
  header: { height: 65, flexDirection: 'row', alignItems: 'center', paddingLeft: 15 },
  back: { width: 44, height: 44 },
  avatar: { width: 44, height: 44, marginLeft: 6 },
  name: { marginLeft: 6, color: colors.labelStrong },
  badge: { width: 14, height: 14, marginLeft: 2 },
  chat: { flex: 1, overflow: 'hidden' },
  wallpaper: { position: 'absolute', left: 0 },
  messages: { paddingBottom: 4 },
});
