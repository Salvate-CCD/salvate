import { Image } from 'expo-image';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

// Figma "Modal/Frame" (button=False) — "Request Posted!" 안내. 버튼이 없어 자동으로 다음 화면으로 넘어감
export function PostedModal({ visible }: { visible: boolean }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.dim}>
        <View style={styles.frame} accessibilityRole="alert">
          <View style={styles.iconBox}>
            {/* icon 37×36 (2.5, 0) — blur 포함 SVG 45×40 */}
            <Image source={require('../../../../assets/figma/need/preview/posted-check.svg')} style={styles.icon} />
          </View>
          <View style={styles.text}>
            <Text style={[typography.body1Bold, styles.center]}>Request Posted!</Text>
            <Text style={[typography.label1Regular, styles.center]}>Your request has been shared with nearby helpers.</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { flex: 1, backgroundColor: colors.dim, alignItems: 'center', justifyContent: 'center' },
  // Figma top 318, 높이 172 → 화면 중앙보다 18 위
  frame: {
    width: 292,
    marginBottom: 36,
    paddingVertical: 28,
    paddingHorizontal: 40,
    gap: 16,
    alignItems: 'center',
    borderRadius: radius['2xl'],
    backgroundColor: colors.backgroundNormal,
    overflow: 'hidden',
  },
  iconBox: { width: 42, height: 36 },
  icon: { position: 'absolute', left: -1.5, top: -4, width: 45, height: 40 },
  text: { gap: 12, alignSelf: 'stretch', alignItems: 'center' },
  center: { textAlign: 'center', color: colors.labelNormal },
});
