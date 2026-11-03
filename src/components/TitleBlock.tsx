import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, typography } from '@/theme/tokens';

type Props = {
  title: string;
  /** 제목 오른쪽 칩 등 (Figma "Title" 행 — 간격 16, 위 정렬) */
  titleAccessory?: ReactNode;
  description?: string;
  /** Figma 텍스트 박스 너비 — 줄바꿈 위치를 디자인과 맞추기 위함 */
  titleWidth?: number;
  descriptionWidth?: number;
  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
};

// Figma "Title & Description" 블록
export function TitleBlock({ title, titleAccessory, description, titleWidth, descriptionWidth, style, descriptionStyle, onLayout }: Props) {
  return (
    <View style={[styles.root, style]} onLayout={onLayout}>
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" style={[typography.display1, styles.title, titleWidth ? { width: titleWidth } : null]}>
          {title}
        </Text>
        {titleAccessory}
      </View>
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
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  title: { color: colors.labelStrong, paddingBottom: 12 },
  description: { color: colors.labelNormal },
});
