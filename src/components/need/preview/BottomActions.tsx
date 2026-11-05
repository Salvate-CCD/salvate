import { BlurView } from 'expo-blur';
import { Image } from '@/components/Image';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@/theme/tokens';

// Figma "Bottom Section" 은 128 (홈 인디케이터 34 포함)
const SECTION_HEIGHT = 128 - 34;
// 버튼 글자 아래 끝(14 + 86 = 100)이 SECTION_HEIGHT(94)보다 6 아래 — Figma 에선 홈 인디케이터 영역에 걸침.
// 아래 inset 이 없는 기기(웹, 홈 버튼 아이폰 등)에서 글자가 잘리지 않도록 최소 14 확보 (글자 아래 8 여유)
const MIN_BOTTOM = 14;
// Figma: backdrop-blur 8px (opacity/16 ÷ 2)
const webBlur = Platform.OS === 'web' ? ({ backdropFilter: 'blur(8px)' } as ViewStyle) : null;

type Props = { onCancel: () => void; onPost: () => void; onEdit: () => void };

// Figma "Bottom Section" — Cancel / Post / Edit ("Button/Action Button/Posting")
export function BottomActions({ onCancel, onPost, onEdit }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.section, webBlur, { height: SECTION_HEIGHT + Math.max(insets.bottom, MIN_BOTTOM) }]}>
      {Platform.OS !== 'web' ? <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} /> : null}
      <View style={styles.background} />
      <View style={styles.row}>
        <ActionButton label="Cancel" icon={require('../../../../assets/figma/need/preview/icon-close.svg')} onPress={onCancel} />
        <ActionButton label="Post" primary onPress={onPost} />
        <ActionButton label="Edit" icon={require('../../../../assets/figma/need/preview/icon-edit.svg')} onPress={onEdit} />
      </View>
    </View>
  );
}

function ActionButton({ label, icon, primary, onPress }: { label: string; icon?: number; primary?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}>
      <Image
        source={
          primary
            ? require('../../../../assets/figma/need/preview/btn-ellipse-post.svg')
            : require('../../../../assets/figma/need/preview/btn-ellipse.svg')
        }
        style={styles.circle}
      />
      {primary ? (
        // icons/Arrows/upload — 28 박스 안 23×23 (2.5, 2.5)
        <Image source={require('../../../../assets/figma/need/preview/icon-upload.svg')} style={styles.upload} />
      ) : (
        <Image source={icon} style={styles.icon} />
      )}
      <Text style={[typography.label1Medium, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  // Figma "background": static/white 60%
  background: { ...StyleSheet.absoluteFill, backgroundColor: colors.white, opacity: 0.6 },
  // 버튼 x 21 / 가운데 / 305 (테두리 1 포함 → top 14)
  row: { position: 'absolute', top: 14, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  button: { width: 64, height: 86 },
  circle: { position: 'absolute', left: 0, top: 0, width: 64, height: 64 },
  icon: { position: 'absolute', left: 18, top: 18, width: 28, height: 28 },
  upload: { position: 'absolute', left: 20.5, top: 20.5, width: 23, height: 23 },
  label: { position: 'absolute', left: -10, right: -10, top: 69, textAlign: 'center', color: colors.primary },
});
