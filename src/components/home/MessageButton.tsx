import { Image } from 'expo-image';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

// Figma "Button/Action Button/Message" (56×56) — 반투명 원 + 흰 테두리 + 아이콘 + 분홍 알림 점
export function MessageButton({ onPress, style }: { onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Messages" onPress={onPress} style={[styles.root, style]}>
      <Image source={require('../../../assets/figma/home/message-ellipse.svg')} style={styles.fill} />
      <Image source={require('../../../assets/figma/home/message-stroke.svg')} style={styles.fill} />
      {/* icons/Communicate/message-emoji */}
      <Image source={require('../../../assets/figma/home/message-icon.svg')} style={styles.icon} />
      {/* alert: inset 12.5% -3.57% 66.07% 82.14% → (46, 7) 12×12 */}
      <Image source={require('../../../assets/figma/home/message-alert.svg')} style={styles.alert} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { width: 56, height: 56 },
  fill: { position: 'absolute', left: 0, top: 0, width: 56, height: 56 },
  icon: { position: 'absolute', left: 10, top: 10, width: 36, height: 36 },
  alert: { position: 'absolute', left: 46, top: 7, width: 12, height: 12 },
});
