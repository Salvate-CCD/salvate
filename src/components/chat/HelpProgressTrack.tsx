import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

export type HelpProgressState = {
  bar: ImageSource;
  /** left 는 왼쪽 끝, center 는 글자 가운데 기준 (Figma 가 가운데 정렬한 라벨) */
  labels: { text: string; left?: number; center?: number; color: string }[];
  /** 체크 표시의 왼쪽 위치 */
  checks: number[];
};

const DEPARTED_LABEL = { text: 'Departed', left: 52, color: colors.secondaryNormal };
const ARRIVAL_LEFT = 301;
const DEPARTED_CHECK = 65;
const MIDDLE_CHECK = 187;
const LAST_CHECK = 309;
const LABEL_BOX = 100;

// Figma "도움 진행 표시" — 막대 채움은 프레임마다 다른 SVG 그대로
export const HELP_PROGRESS = {
  // 1967:19129 채팅 — 출발
  chatDeparted: {
    bar: require('../../../assets/figma/progress/bar-chat-departed.svg'),
    labels: [DEPARTED_LABEL, { text: 'Arrival', left: ARRIVAL_LEFT, color: colors.accentPink }],
    checks: [DEPARTED_CHECK],
  },
  // 1967:19184 채팅 — 도착
  chatArrived: {
    bar: require('../../../assets/figma/progress/bar-chat-arrived.svg'),
    labels: [DEPARTED_LABEL, { text: 'Arrival', left: ARRIVAL_LEFT, color: colors.secondaryNormal }],
    checks: [DEPARTED_CHECK],
  },
  // 1967:19898 잠금화면 알림 — 출발
  lockDeparted: {
    bar: require('../../../assets/figma/progress/bar-lock-departed.svg'),
    labels: [DEPARTED_LABEL, { text: 'Arrival', left: ARRIVAL_LEFT, color: colors.accentPink }],
    checks: [DEPARTED_CHECK],
  },
  // 1967:20561 도움 제공, 장소 1개 — 도착 확인
  chatProviderArrived: {
    bar: require('../../../assets/figma/progress/bar-chat-arrived.svg'),
    labels: [DEPARTED_LABEL, { text: 'Arrived', left: ARRIVAL_LEFT, color: colors.secondaryNormal }],
    checks: [DEPARTED_CHECK, LAST_CHECK],
  },
  // 1967:20464 장소 2개 — 출발
  twoDeparted: {
    bar: require('../../../assets/figma/progress/bar-chat-two-departed.svg'),
    labels: [
      DEPARTED_LABEL,
      { text: 'Pick-up', left: 179, color: colors.accentPink },
      { text: 'Drop-off', left: 296, color: colors.accentPink },
    ],
    checks: [DEPARTED_CHECK],
  },
  // 1967:20512 장소 2개 — Pickup 도착
  twoPickedUp: {
    bar: require('../../../assets/figma/progress/bar-chat-two-pickedup.svg'),
    labels: [
      DEPARTED_LABEL,
      { text: 'Picked-up', left: 170, color: colors.secondaryNormal },
      { text: 'Drop-off', left: 296, color: colors.accentPink },
    ],
    checks: [DEPARTED_CHECK, MIDDLE_CHECK],
  },
  // 1967:20608 장소 2개 — Drop-off 도착 ("Droped-off" 는 Figma 문구 그대로)
  twoDroppedOff: {
    bar: require('../../../assets/figma/progress/bar-chat-two-droppedoff.svg'),
    labels: [
      DEPARTED_LABEL,
      { text: 'Picked-up', center: 198, color: colors.secondaryNormal },
      { text: 'Droped-off', center: 317, color: colors.secondaryNormal },
    ],
    checks: [DEPARTED_CHECK, MIDDLE_CHECK, LAST_CHECK],
  },
} satisfies Record<string, HelpProgressState>;

// 막대 264×20 은 프레임 폭 390 의 가운데, 글자는 막대 위에서 23, 체크는 2 아래
export function HelpProgressTrack({ state, style }: { state: HelpProgressState; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.root, style]}>
      <Image source={state.bar} style={styles.bar} />
      {state.checks.map((left) => (
        <Image key={left} source={require('../../../assets/figma/progress/check-small.svg')} style={[styles.check, { left }]} />
      ))}
      {state.labels.map((label) => (
        <Text
          key={label.text}
          style={[
            styles.label,
            { color: label.color },
            label.center === undefined ? { left: label.left } : { left: label.center - LABEL_BOX / 2, width: LABEL_BOX, textAlign: 'center' },
          ]}
        >
          {label.text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: 390, height: 37 },
  bar: { position: 'absolute', left: 63, top: 0, width: 264, height: 20 },
  check: { position: 'absolute', top: 2, width: 16, height: 16 },
  // Caption 2/M 11/14
  label: { position: 'absolute', top: 23, fontFamily: fonts.robotoMedium, fontSize: 11, lineHeight: 14 },
});
