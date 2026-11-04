import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  /** 왼쪽 버튼 글자색 — 기본은 Status/Negative */
  cancelColor?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** 안드로이드 뒤로 버튼 — 왼쪽 버튼이 '취소'가 아닌 모달(예: Leave)에서는 모달만 닫도록 따로 지정. 기본은 onCancel */
  onDismiss?: () => void;
};

// Figma "Modal/Frame" + "Modal/Dim Box" — 2버튼 확인 모달
export function Dialog({ visible, title, message, cancelLabel = 'Cancel', cancelColor = colors.statusNegative, confirmLabel, onCancel, onConfirm, onDismiss }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss ?? onCancel}>
      <View style={styles.dim}>
        <View style={styles.frame} accessibilityRole="alert">
          <View style={styles.text}>
            <Text style={[typography.body1Bold, styles.center]}>{title}</Text>
            <Text style={[typography.label1Regular, styles.center]}>{message}</Text>
          </View>
          <View style={styles.buttons}>
            <Pressable accessibilityRole="button" onPress={onCancel} style={[styles.button, styles.leftButton]}>
              <Text style={[typography.label1Medium, { color: cancelColor }]}>{cancelLabel}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.button}>
              <Text style={[typography.label1Medium, { color: colors.statusPositive }]}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { flex: 1, backgroundColor: colors.dim, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: 289,
    marginBottom: 39,
    paddingTop: 28,
    gap: 28,
    borderRadius: radius['2xl'],
    backgroundColor: colors.backgroundNormal,
    overflow: 'hidden',
  },
  text: { gap: 12, alignItems: 'center', paddingHorizontal: 40 },
  center: { textAlign: 'center', color: colors.labelNormal },
  buttons: { flexDirection: 'row', borderTopWidth: 1, borderColor: colors.strokeNeutral },
  button: { flex: 1, height: 49, alignItems: 'center', justifyContent: 'center' },
  leftButton: { borderRightWidth: 1, borderColor: colors.strokeNeutral },
});
