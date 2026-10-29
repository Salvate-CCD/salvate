import { Image } from 'expo-image';
import { Modal, Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fonts, typography } from '@/theme/tokens';

export const AGE_GROUPS = ['18 - 29', '30 - 39', '40 - 49', '50 - 59', '60 - 69', '70 +'] as const;

// tokens.ts에 없는 Figma 값
const dim03 = 'rgba(0, 0, 0, 0.16)'; // Material/Dim 03 (스크린샷 기준 불투명도)
const sheetBackground = 'rgba(255, 255, 255, 0.6)'; // Surface/Normal @ 60%
const secondaryNormal = '#6CD2B6';
// Figma backdrop-blur 6px — RN 타입에 없어 웹에서만 적용 (react-native-web이 지원)
const webBlur = Platform.OS === 'web' ? ({ backdropFilter: 'blur(6px)' } as ViewStyle) : null;
const headline1Medium = { fontFamily: fonts.robotoMedium, fontSize: 18, lineHeight: 21 };

type Props = {
  visible: boolean;
  value: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
};

// Figma "Input/Dropdown/Age group" — 아래에서 올라오는 나이대 선택 시트
export function AgeGroupSheet({ visible, value, onSelect, onClose }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.dim}>
        {/* Figma "터치영역" — 시트 바깥을 누르면 닫힘 */}
        <Pressable style={styles.flex} onPress={onClose} accessibilityLabel="Close" />
        <View style={[styles.sheet, webBlur]} accessibilityRole="menu">
          <Text style={[headline1Medium, styles.heading]}>Select your age group</Text>
          {AGE_GROUPS.map((group) => {
            const selected = group === value;
            return (
              <Pressable
                key={group}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                onPress={() => onSelect(group)}
                style={styles.item}
              >
                {selected ? <View style={styles.highlight} /> : null}
                <Text style={[selected ? typography.body1Bold : typography.body1Medium, selected ? styles.selected : styles.label]}>
                  {group}
                </Text>
                <Image source={require('../../assets/figma/dropdown-divider.svg')} style={styles.divider} />
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  dim: { flex: 1, backgroundColor: dim03 },
  sheet: {
    backgroundColor: sheetBackground,
    borderTopWidth: 1,
    borderColor: colors.white,
    paddingBottom: 9,
  },
  heading: { color: colors.primary, textAlign: 'center', paddingVertical: 16, marginTop: -1 },
  item: { height: 48, paddingTop: 12, alignItems: 'center', gap: 12 },
  label: { color: colors.labelNormal, textAlign: 'center' },
  selected: { color: secondaryNormal, textAlign: 'center' },
  // Figma: 선택된 항목 뒤 흐린 흰 띠 (blur 8)
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 41,
    backgroundColor: colors.white,
    boxShadow: `0px 0px 12px 6px ${colors.white}`,
  },
  divider: { width: 350, height: 1 },
});
