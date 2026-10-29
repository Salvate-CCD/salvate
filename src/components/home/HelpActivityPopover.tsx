import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import type { HelpStats } from './wheelData';

export const POPOVER_WIDTH = 164;
export const POPOVER_HEIGHT = 104;
// 라벨 상자 폭 — Receive(가운데 x 137) 상자가 카드 오른쪽 끝(164)을 넘지 않도록 54
const CAPTION_W = 54;

// Figma: backdrop-blur 22px (opacity/44 ÷ 2)
const webBlur = Platform.OS === 'web' ? ({ backdropFilter: 'blur(22px)' } as ViewStyle) : null;

type Props = {
  stats: HelpStats;
  left: number;
  top: number;
  onClose: () => void;
};

// Figma "Card/Network Node" 안의 Card (이름을 눌렀을 때 보이는 Help Activity 카드)
export function HelpActivityPopover({ stats, left, top, onClose }: Props) {
  return (
    <View
      // 카드 안을 눌러도 바깥 탭(닫기)으로 처리되지 않게 터치를 받아 둠
      onStartShouldSetResponder={() => true}
      style={[styles.card, webBlur, { left, top }]}
    >
      {Platform.OS !== 'web' ? <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} /> : null}
      <View style={styles.background} />

      <Text style={styles.heading}>Help Activity</Text>
      <View style={styles.numbers}>
        <Text style={[styles.number, { color: colors.labelNormal }]}>{String(stats.total).padStart(2, '0')}</Text>
        <Text style={[styles.number, { color: colors.labelNeutral }]}>{stats.give}</Text>
        <Text style={[styles.number, { color: colors.labelNeutral }]}>{stats.receive}</Text>
      </View>
      <Text style={[styles.caption, { left: 30.5 - CAPTION_W / 2 }]}>Total</Text>
      <Text style={[styles.caption, { left: 87 - CAPTION_W / 2 }]}>Give</Text>
      <Text style={[styles.caption, { left: 137 - CAPTION_W / 2 }]}>Receive</Text>
      {/* Figma "Divider" */}
      <Image source={require('../../../assets/figma/home/popover-divider.svg')} style={styles.divider} />
      <Text style={styles.relation}>{stats.relation}</Text>

      {/* Figma "icons/Character/close-small" */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={10}
        onPress={onClose}
        style={styles.close}
      >
        <Image source={require('../../../assets/figma/home/popover-close.svg')} style={styles.closeIcon} />
      </Pressable>
      {/* 테두리는 위에 덮어 그림 — 자식 좌표를 Figma 그대로 쓰기 위함 */}
      <View pointerEvents="none" style={styles.border} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: POPOVER_WIDTH,
    height: POPOVER_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
  },
  // Figma "Background": surface/normal 72%
  background: { ...StyleSheet.absoluteFill, backgroundColor: colors.surfaceNormal, opacity: 0.72 },
  border: { ...StyleSheet.absoluteFill, borderRadius: 12, borderWidth: 1, borderColor: colors.white },
  // Caption 2/B
  heading: {
    position: 'absolute',
    left: 8,
    top: 8,
    fontFamily: fonts.robotoBold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.labelStrong,
  },
  // Figma "Number": px 20, justify-between, Headline 1/M (18/21)
  numbers: {
    position: 'absolute',
    left: 0,
    top: 34,
    width: POPOVER_WIDTH,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  number: { fontFamily: fonts.robotoMedium, fontSize: 18, lineHeight: 21 },
  // Caption 2/R — Figma는 각 라벨의 가운데 x 좌표로 배치 (CAPTION_W 상자로 가운데 정렬)
  caption: {
    position: 'absolute',
    top: 56,
    width: CAPTION_W,
    textAlign: 'center',
    fontFamily: fonts.robotoRegular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.secondaryNormal,
  },
  divider: { position: 'absolute', left: 8, top: 73, width: 148, height: 1 },
  // Caption 2/M, 가운데 x = 50% + 0.5px
  relation: {
    position: 'absolute',
    left: 1,
    right: 0,
    top: 80,
    textAlign: 'center',
    fontFamily: fonts.robotoMedium,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  close: { position: 'absolute', left: 136, top: 5, width: 20, height: 20 },
  closeIcon: { width: 20, height: 20 },
});
