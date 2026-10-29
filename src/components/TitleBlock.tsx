import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, typography } from '@/theme/tokens';

type Props = {
  title: string;
  description?: string;
  /** Figma 텍스트 박스 너비 — 줄바꿈 위치를 디자인과 맞추기 위함 */
  titleWidth?: number;
  descriptionWidth?: number;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
};

// Figma "Title & Description" 블록
export function TitleBlock({ title, description, titleWidth, descriptionWidth, style, descriptionStyle }: Props) {
  return (
    <View style={[styles.root, style]}>
      <Text accessibilityRole="header" style={[typography.display1, styles.title, titleWidth ? { width: titleWidth } : null]}>
        {title}
      </Text>
      {description ? (
        <Text style={[typography.heading2Medium, styles.description, descriptionWidth ? { width: descriptionWidth } : null, descriptionStyle]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 20, paddingTop: 36, paddingBottom: 24 },
  title: { color: colors.labelStrong, paddingBottom: 12 },
  description: { color: colors.labelNormal },
});
