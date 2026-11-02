import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, type TextStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { formatDuration } from './mariaChat';

type Props = {
  onSendText: (text: string) => void;
  onSendVoice: (seconds: number) => void;
  onFocusChange?: (focused: boolean) => void;
};

// 음성 메시지 단계 — 녹음 중(1935:42343) → 멈춤(42383) ↔ 재생 중(42437). 실제 녹음·재생 없이 화면만
type Voice =
  | { step: 'idle' }
  | { step: 'recording'; seconds: number }
  | { step: 'recorded'; seconds: number }
  | { step: 'playing'; seconds: number; position: number };

const LINE = 21; // Body 1/Reading/R 줄 높이

// 웹: 입력칸 포커스 테두리(outline) 숨김 — RN 타입에는 'none' 이 없어 따로 둠
const webNoOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : null;
const MAX_LINES = 5;

// Figma "Bottom Section" 안의 "Text input" (350 폭) — 평소엔 알약 모양 48 높이 + 마이크,
// 글자를 쓰면 보내기 버튼, 두 줄 이상이면 모서리 20 으로 늘어남 (1935:42602)
export function ChatComposer({ onSendText, onSendVoice, onFocusChange }: Props) {
  const [text, setText] = useState('');
  const [lines, setLines] = useState(1);
  const [voice, setVoice] = useState<Voice>({ step: 'idle' });

  // 녹음·재생 중에는 1초마다 시간이 흐름
  useEffect(() => {
    if (voice.step !== 'recording' && voice.step !== 'playing') return;
    const t = setInterval(() => {
      setVoice((v) => {
        if (v.step === 'recording') return { ...v, seconds: v.seconds + 1 };
        if (v.step === 'playing') {
          // 끝까지 재생하면 멈춤 상태로
          return v.position + 1 >= v.seconds ? { step: 'recorded', seconds: v.seconds } : { ...v, position: v.position + 1 };
        }
        return v;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [voice.step]);

  const sendText = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendText(trimmed);
    setText('');
    setLines(1);
  };

  const sendVoice = () => {
    if (voice.step === 'recorded' || voice.step === 'playing') {
      // 0초 녹음도 말풍선은 1초로
      onSendVoice(Math.max(1, voice.seconds));
    }
    setVoice({ step: 'idle' });
  };

  if (voice.step !== 'idle') {
    const shown = voice.step === 'playing' ? voice.position : voice.seconds;
    return (
      <View style={[styles.field, styles.pill]}>
        <IconButton label="Cancel voice message" source={require('../../../assets/figma/chat/voice-cancel.svg')} left={19} onPress={() => setVoice({ step: 'idle' })} />
        <Text style={styles.timer}>{formatDuration(shown)}</Text>
        {voice.step === 'recording' ? (
          <>
            <Image source={require('../../../assets/figma/chat/wave-recording.svg')} style={styles.waveShort} />
            <IconButton
              label="Stop recording"
              source={require('../../../assets/figma/chat/voice-stop.svg')}
              left={301}
              onPress={() => setVoice({ step: 'recorded', seconds: voice.seconds })}
            />
          </>
        ) : (
          <>
            <Image
              source={
                voice.step === 'playing'
                  ? require('../../../assets/figma/chat/wave-playing.svg')
                  : require('../../../assets/figma/chat/wave-recorded.svg')
              }
              style={styles.waveLong}
            />
            {voice.step === 'playing' ? (
              <IconButton
                label="Pause"
                source={require('../../../assets/figma/chat/voice-pause.svg')}
                left={261}
                onPress={() => setVoice({ step: 'recorded', seconds: voice.seconds })}
              />
            ) : (
              <IconButton
                label="Play"
                source={require('../../../assets/figma/chat/voice-play.svg')}
                left={261}
                onPress={() => setVoice({ step: 'playing', seconds: voice.seconds, position: 0 })}
              />
            )}
            <IconButton label="Send" source={require('../../../assets/figma/chat/send.svg')} left={301} onPress={sendVoice} />
          </>
        )}
      </View>
    );
  }

  const typing = text.length > 0;
  // 한 줄 48, 두 줄 66 (= 21×2 + 24)
  const height = lines > 1 ? lines * LINE + 24 : 48;
  return (
    <View style={[styles.field, lines > 1 ? styles.multi : styles.pill, { height }]}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor={colors.labelAssistive}
        multiline
        onContentSizeChange={(e) => setLines(Math.min(MAX_LINES, Math.max(1, Math.round(e.nativeEvent.contentSize.height / LINE))))}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        style={[styles.input, webNoOutline, { height: lines * LINE, bottom: lines > 1 ? 9 : 11.5 }]}
      />
      {typing ? (
        // 보내기 버튼 — 입력칸 아래쪽에 붙음 (테두리 안쪽 기준 아래 7)
        <IconButton label="Send" source={require('../../../assets/figma/chat/send.svg')} left={301} bottom={7} onPress={sendText} />
      ) : (
        <IconButton
          label="Record voice message"
          source={require('../../../assets/figma/chat/mic.svg')}
          left={301}
          bottom={7}
          onPress={() => setVoice({ step: 'recording', seconds: 0 })}
        />
      )}
    </View>
  );
}

type IconButtonProps = {
  label: string;
  source: number;
  left: number;
  bottom?: number;
  onPress: () => void;
};

function IconButton({ label, source, left, bottom, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={onPress}
      style={[styles.icon, { left }, bottom === undefined ? { top: 9 } : { bottom }]}
    >
      <Image source={source} style={styles.iconImage} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Background/Alternative + 흰 테두리 2 + 안쪽 흰 빛 번짐 8
  field: {
    width: 350,
    height: 48,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.backgroundAlternative,
    boxShadow: `inset 0px 0px 8px 0px ${colors.white}`,
    overflow: 'hidden',
  },
  pill: { borderRadius: 999 },
  multi: { borderRadius: 20 },
  // 글자는 왼쪽 19, 아래쪽에 맞춤 (Figma: 두 줄일 때 테두리 안쪽 기준 아래 9, 한 줄은 세로 가운데)
  input: {
    position: 'absolute',
    left: 19,
    width: 270,
    padding: 0,
    fontFamily: fonts.robotoRegular,
    fontSize: 16,
    lineHeight: LINE,
    color: colors.labelNormal,
  },
  icon: { position: 'absolute', width: 28, height: 28 },
  iconImage: { width: 28, height: 28 },
  // 녹음 시간 — Label/Assistive 16/21, 세로 가운데
  timer: {
    position: 'absolute',
    left: 59,
    top: 14,
    fontFamily: fonts.robotoRegular,
    fontSize: 16,
    lineHeight: LINE,
    color: colors.labelAssistive,
  },
  // 파형 SVG 는 오른쪽 끝 막대 굵기만큼 넓음 (48→53, 136→141)
  waveShort: { position: 'absolute', left: 102, top: 14, width: 53, height: 16 },
  waveLong: { position: 'absolute', left: 102, top: 14, width: 141, height: 16 },
});
