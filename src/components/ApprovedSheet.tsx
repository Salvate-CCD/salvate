import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { colors, fonts, typography } from '@/theme/tokens';

type Props = { visible: boolean; onClose: () => void };

// Figma "Material/Dim 03" (#00000029)
const DIM_03 = 'rgba(0, 0, 0, 0.16)';

// Figma "Modal/Bottom Sheet" — 가입 승인 안내 (로그인 화면 위)
export function ApprovedSheet({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* Figma "터치영역" — 시트 바깥을 누르면 닫힘 */}
      <Pressable accessibilityLabel="Close" focusable={false} style={styles.dim} onPress={onClose} />
      <View
        accessibilityViewIsModal
        style={[styles.sheet, { height: 330 + insets.bottom, paddingBottom: 22 + insets.bottom }]}
      >
        <View style={styles.text}>
          <Text accessibilityRole="header" style={[typography.title2Bold, styles.title]}>
            Your account is approved!
          </Text>
          <Text style={styles.body}>{'You can now log in to Sálvate!\nContinue with WhatsApp to get started.'}</Text>
        </View>
        <View style={styles.contents}>
          <Image source={require('../../assets/figma/approved-graphic.svg')} style={styles.graphic} />
        </View>
        <Button label="OK" size="M" onPress={onClose} style={styles.button} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { flex: 1, backgroundColor: DIM_03 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 36,
    paddingHorizontal: 20,
    gap: 36,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.backgroundNormal,
  },
  text: { gap: 12, alignItems: 'center', alignSelf: 'stretch' },
  title: { color: colors.labelStrong, textAlign: 'center' },
  // Figma "Body/Body 1/Reading/R" (16/21)
  body: { fontFamily: fonts.robotoRegular, fontSize: 16, lineHeight: 21, color: colors.labelStrong, textAlign: 'center' },
  // Figma "Contens" 영역 — 그래픽은 시트 상단에서 138px 위치에 겹쳐 놓여 있음
  contents: { flex: 1, alignSelf: 'stretch', alignItems: 'center' },
  graphic: { width: 104, height: 96, marginTop: -14 },
  // Figma: 이 시트의 버튼은 M 크기지만 radius L(12)
  button: { alignSelf: 'stretch', borderRadius: 12 },
});
