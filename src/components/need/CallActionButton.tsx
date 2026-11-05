import { Image } from '@/components/Image';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, typography } from '@/theme/tokens';

type Kind = 'speaker' | 'mute' | 'end';

const KINDS = {
  // 흰색 36% 원 + 흰 테두리
  speaker: { label: 'Speaker', icon: require('../../../assets/figma/need/icon-volume-notice.svg') }, // icons/Music/volume-notice
  mute: { label: 'Mute', icon: require('../../../assets/figma/need/icon-voice-off.svg') }, // icons/Music/voice-off
  // 빨간 원 (status/negative + inner shadow)
  end: { label: 'End', icon: require('../../../assets/figma/need/icon-phone-off.svg') }, // icons/Communicate/phone-off
} as const;

type Props = { kind: Kind; onPress: () => void; left: number };

// Figma "Button/Action Button_AI Calling" (64×86) — Speaker / Mute / End, Default 상태만 있음
export function CallActionButton({ kind, onPress, left }: Props) {
  const k = KINDS[kind];
  const isEnd = kind === 'end';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={k.label} onPress={onPress} style={[styles.root, { left }]}>
      {isEnd ? (
        <Image source={require('../../../assets/figma/need/btn-end-ellipse.svg')} style={styles.circle} />
      ) : (
        <>
          <Image source={require('../../../assets/figma/need/btn-ellipse.svg')} style={styles.circle} />
          <Image source={require('../../../assets/figma/need/btn-stroke.svg')} style={styles.circle} />
        </>
      )}
      <Image source={k.icon} style={styles.icon} />
      <Text
        numberOfLines={1}
        style={[typography.label1Medium, styles.label, { color: isEnd ? colors.statusNegative : colors.labelNeutral }]}
      >
        {k.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, width: 64, height: 86 },
  circle: { position: 'absolute', left: 0, top: 0, width: 64, height: 64 },
  // inset 20.93% / 28.13% → (18, 18) 28×28
  icon: { position: 'absolute', left: 18, top: 18, width: 28, height: 28 },
  // top 80.23% → 69
  // 웹: numberOfLines 가 max-width 100%(=버튼 폭 64)를 걸어 글자 상자가 64로 줄고 8px 왼쪽으로 쏠림 → maxWidth 명시
  label: { position: 'absolute', top: 69, left: -8, width: 80, maxWidth: 80, textAlign: 'center' },
});
