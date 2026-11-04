import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import type { Relation } from './giveData';

// Figma "Button/Chip Button/Name" — 나와의 관계 칩 (Give 목록 카드·상세 이름 옆)
export function RelationChip({ relation, style }: { relation: Relation; style?: StyleProp<ViewStyle> }) {
  const friend = relation === 'Your Friend';
  return (
    <View style={[styles.chip, { backgroundColor: friend ? colors.primary : colors.secondaryNormal }, style]}>
      <Text style={styles.label}>{relation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999 },
  // Caption 2/R 11/14
  label: { fontFamily: fonts.robotoRegular, fontSize: 11, lineHeight: 14, color: colors.white, textAlign: 'center' },
});
