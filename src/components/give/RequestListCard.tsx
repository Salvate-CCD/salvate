import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import type { RequestSummary } from './giveData';
import { RelationChip } from './RelationChip';

// Figma 목록 카드 350×93 — 제목(두 줄까지) + 이름·거리 + 관계 칩("Button/Chip Button/Name")
export function RequestListCard({ item, onPress }: { item: RequestSummary; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.name}, ${item.distance}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <Text numberOfLines={2} style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.meta}>{`${item.name} ・ ${item.distance}`}</Text>
      <RelationChip relation={item.relation} style={styles.chip} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Shadow/Nuetral/01: 0 0 16 #00000014
  card: {
    width: 350,
    height: 93,
    borderRadius: 12,
    backgroundColor: colors.surfaceNormal,
    boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.08)',
  },
  // Body 1/Normal/M 16/18, 폭 215
  title: {
    position: 'absolute',
    left: 20,
    top: 16,
    width: 215,
    fontFamily: fonts.robotoMedium,
    fontSize: 16,
    lineHeight: 18,
    color: colors.labelNormal,
  },
  // Label 1/R 14/17
  meta: {
    position: 'absolute',
    left: 21,
    top: 60,
    fontFamily: fonts.robotoRegular,
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelNeutral,
  },
  chip: { position: 'absolute', right: 20, top: 11 },
});
