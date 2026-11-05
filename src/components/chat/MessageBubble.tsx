import { Image } from '@/components/Image';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { formatDuration, type ChatMessage } from './contacts';

// Figma 말풍선은 폭이 214 로 고정 (화면 좌우 20 / 반대쪽 156)
export const BUBBLE_WIDTH = 214;

type Props = {
  message: Exclude<ChatMessage, { kind: 'notice' | 'date' }>;
  /** 같은 사람·같은 분의 묶음에서 마지막이면 시각을 옆에 표시 */
  time?: string;
};

// Figma "말풍선 왼/오" — 받은 말풍선은 흰색(왼쪽 아래 각짐), 보낸 말풍선은 민트(오른쪽 아래 각짐).
// 시각(Caption 2/R)은 말풍선 바깥 아래쪽에 맞춤: 받은 쪽은 오른쪽 8, 보낸 쪽은 왼쪽 10
export function MessageBubble({ message, time }: Props) {
  const mine = message.from === 'me';
  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      {time ? <Text style={styles.time}>{time}</Text> : null}
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        {message.kind === 'text' ? <Text style={styles.text}>{message.text}</Text> : <VoiceContent seconds={message.seconds} />}
      </View>
    </View>
  );
}

// Figma 음성 말풍선 (1935:42503) 214×37 — 길이 + 파형 + 재생 버튼 (실제 재생은 없음)
function VoiceContent({ seconds }: { seconds: number }) {
  return (
    <View style={styles.voice}>
      <Text style={styles.voiceTime}>{formatDuration(seconds)}</Text>
      <Image source={require('../../../assets/figma/chat/bubble-wave.svg')} style={styles.voiceWave} />
      <Image source={require('../../../assets/figma/chat/bubble-play-bg.svg')} style={styles.playBg} />
      {/* play 아이콘 16 슬롯: 12.4×11 도형을 90° 돌려 오른쪽을 가리키게 함 */}
      <View style={styles.playSlot}>
        <Image source={require('../../../assets/figma/chat/bubble-play.svg')} style={styles.play} />
      </View>
    </View>
  );
}

const R = 12; // Shape/Radius/L

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20 },
  rowTheirs: { flexDirection: 'row-reverse', justifyContent: 'flex-end', gap: 8 },
  rowMine: { justifyContent: 'flex-end', gap: 10 },
  bubble: { width: BUBBLE_WIDTH, paddingHorizontal: 12, paddingVertical: 8 },
  // Shadow/Primary/01: 0 0 34 #6CD2B614 (CSS blur 17)
  theirs: {
    backgroundColor: colors.surfaceNormal,
    borderTopLeftRadius: R,
    borderTopRightRadius: R,
    borderBottomRightRadius: R,
    boxShadow: '0px 0px 17px 0px rgba(108, 210, 182, 0.08)',
  },
  // Secondary/Light + 안쪽 Mint/50 빛 번짐 22
  mine: {
    backgroundColor: colors.secondaryLight,
    borderTopLeftRadius: R,
    borderTopRightRadius: R,
    borderBottomLeftRadius: R,
    boxShadow: `inset 0px 0px 22px 0px ${colors.secondaryBackground}`,
  },
  // Body 1/Reading/R 16/21
  text: { width: 190, fontFamily: fonts.robotoRegular, fontSize: 16, lineHeight: 21, color: colors.black },
  // Caption 2/R 11/14
  time: { fontFamily: fonts.robotoRegular, fontSize: 11, lineHeight: 14, color: colors.labelAssistive },
  // 음성 말풍선은 안쪽 여백 없이 37 높이 — 바깥 bubble 의 padding 8/12 를 상쇄
  voice: { height: 37, marginVertical: -8, marginHorizontal: -12 },
  // Label 2/R 13/16, Label/Neutral
  voiceTime: {
    position: 'absolute',
    left: 12,
    top: 11,
    fontFamily: fonts.robotoRegular,
    fontSize: 13,
    lineHeight: 16,
    color: colors.labelNeutral,
  },
  voiceWave: { position: 'absolute', left: 46, top: 11, width: 115, height: 16 },
  playBg: { position: 'absolute', left: 174, top: 5, width: 28, height: 28 },
  playSlot: { position: 'absolute', left: 180, top: 11, width: 16, height: 16, transform: [{ rotate: '90deg' }] },
  play: { position: 'absolute', left: 1.8, top: 1, width: 12.3953, height: 11 },
});
