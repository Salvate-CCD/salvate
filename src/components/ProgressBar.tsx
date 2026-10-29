import { StyleSheet, View } from 'react-native';
import { colors, radius } from '@/theme/tokens';

type Props = { total: number; current: number };

// Figma "Pagination" — 상단의 단계 표시 바. current는 1부터 시작.
export function ProgressBar({ total, current }: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: current }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.item, { backgroundColor: i < current ? colors.labelAlternative : colors.labelInactive }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4, marginHorizontal: 20, marginTop: 7 },
  item: { flex: 1, height: 6, borderRadius: radius.full },
});
