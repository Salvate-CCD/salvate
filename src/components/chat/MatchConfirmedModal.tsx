import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

type Props = { visible: boolean; onClose: () => void };

// Figma "도움 요청_채팅_매칭수락 확인 모달" (1935:42790) — 체크 아이콘 + "Match Confirmed!".
// Figma 메모: 딤을 누르면 원래 화면으로
export function MatchConfirmedModal({ visible, onClose }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.dim} onPress={onClose} accessibilityLabel="Close">
        <View style={styles.frame} accessibilityRole="alert">
          {/* 42×36 슬롯 안 37×36 아이콘 — SVG 는 빛 번짐 포함 45×40, (-1.5, -4) 에서 시작 */}
          <View style={styles.iconSlot}>
            <Image source={require('../../../assets/figma/chat/match-check.svg')} style={styles.icon} />
          </View>
          <Text style={[typography.body1Bold, styles.title]}>Match Confirmed!</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { flex: 1, backgroundColor: colors.dim, alignItems: 'center', justifyContent: 'center' },
  // Figma (50, 340) 292×126 — 화면 가운데보다 19 위 (Dialog 와 같은 위치)
  frame: {
    width: 292,
    marginBottom: 39,
    paddingVertical: 28,
    paddingHorizontal: 40,
    gap: 16,
    alignItems: 'center',
    borderRadius: radius['2xl'],
    backgroundColor: colors.backgroundNormal,
  },
  iconSlot: { width: 42, height: 36 },
  icon: { position: 'absolute', left: -1.5, top: -4, width: 45, height: 40 },
  title: { width: '100%', textAlign: 'center', color: colors.labelNormal },
});
