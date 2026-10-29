import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

// Figma 채팅 말풍선 자리 (212×80, 내용 없음) — 받은 메시지(왼쪽, 흰색) / 보낸 메시지(오른쪽, Secondary/Light)
export function BubblePlaceholder({ mine }: { mine?: boolean }) {
  return <View style={[styles.base, mine ? styles.mine : styles.theirs]} />;
}

const styles = StyleSheet.create({
  base: { width: 212, height: 80, borderRadius: 12 }, // shape/radius/l
  theirs: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    borderBottomLeftRadius: 0,
    backgroundColor: colors.surfaceNormal,
    boxShadow: '0px 0px 34px 0px rgba(108, 210, 182, 0.08)', // Shadow/Primary/01
  },
  mine: {
    alignSelf: 'flex-end',
    marginRight: 20,
    borderBottomRightRadius: 0,
    backgroundColor: colors.secondaryLight,
    boxShadow: 'inset 0px 0px 22px 0px #EBF9F5', // Mint/50
  },
});
