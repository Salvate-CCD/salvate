import { Image } from '@/components/Image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/theme/tokens';
import type { Profile } from './contacts';

type Props = { profile: Profile; visible: boolean; onClose: () => void };

// Figma "도움 요청_채팅_이름 터치했을 때 (프로필)" (1935:42547) — 헤더의 이름을 누르면
// 딤 위에 프로필 카드(350×177, 상태바 아래 3)가 뜸. 위쪽 화살표나 딤을 누르면 닫힘
export function ProfileSheet({ profile: p, visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.dim} onPress={onClose} accessibilityLabel="Close profile" />
      <View style={[styles.card, { top: insets.top + 3 }]}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{p.name}</Text>
          {/* Figma "Tag" */}
          <View style={styles.tag}>
            <Text style={styles.tagText}>{p.relation}</Text>
          </View>
        </View>
        <Text style={styles.meta}>{`Age ${p.ageGroup}  |  ${p.gender}`}</Text>

        <Stat label="Total Help" value={p.totalHelp} left={32} />
        <Stat label="Given" value={p.given} left={168} />
        <Stat label="Received" value={p.received} left={268} />

        <Pressable accessibilityRole="button" accessibilityLabel="Close profile" hitSlop={8} onPress={onClose} style={styles.up}>
          <Image source={require('../../../assets/figma/chat/profile-up.svg')} style={styles.upIcon} />
        </Pressable>
      </View>
    </Modal>
  );
}

function Stat({ label, value, left }: { label: string; value: number; left: number }) {
  return (
    <View style={[styles.stat, { left }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Material/Dim 03 (16%)
  dim: { ...StyleSheet.absoluteFill, backgroundColor: colors.dimLight },
  card: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 177,
    borderRadius: 16,
    backgroundColor: colors.surfaceNormal,
    overflow: 'hidden',
  },
  nameRow: { position: 'absolute', left: 32, top: 29, flexDirection: 'row', alignItems: 'center', gap: 8 },
  // Title 1/B 28/30
  name: { fontFamily: fonts.robotoBold, fontSize: 28, lineHeight: 30, color: colors.labelStrong },
  tag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999, backgroundColor: colors.secondaryNormal },
  // Caption 2/R 11/14
  tagText: { fontFamily: fonts.robotoRegular, fontSize: 11, lineHeight: 14, color: colors.white },
  meta: {
    position: 'absolute',
    left: 34,
    top: 64,
    fontFamily: fonts.robotoRegular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.labelNeutral,
  },
  stat: { position: 'absolute', top: 98, gap: 4 },
  // Label 1/R 14/17
  statLabel: { fontFamily: fonts.robotoRegular, fontSize: 14, lineHeight: 17, color: colors.labelAssistive },
  // Title 2/M 24/26
  statValue: { fontFamily: fonts.robotoMedium, fontSize: 24, lineHeight: 26, color: colors.labelNormal },
  up: { position: 'absolute', left: 294, top: 30, width: 28, height: 28 },
  upIcon: { width: 28, height: 28 },
});
