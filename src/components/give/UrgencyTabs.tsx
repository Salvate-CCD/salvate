import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Urgency } from '@/components/need/preview/mockRequest';
import { colors, fonts } from '@/theme/tokens';
import { URGENCY_TABS } from './giveData';

type Props = { value: Urgency; onChange: (u: Urgency) => void; style?: StyleProp<ViewStyle> };

// Figma "Tap" 350×33 — 흰 알약 안에 긴급도 4개. 선택한 항목 뒤에 색 슬라이더 + 흰 굵은 글자
export function UrgencyTabs({ value, onChange, style }: Props) {
  const selected = URGENCY_TABS.find((t) => t.key === value) ?? URGENCY_TABS[0];
  return (
    <View style={[styles.root, style]} accessibilityRole="tablist">
      <View
        pointerEvents="none"
        style={[
          styles.slider,
          {
            left: selected.slider.left,
            width: selected.slider.width,
            backgroundColor: selected.slider.bg,
            boxShadow: `inset 0px 0px 8px 0px ${selected.slider.glow}`,
          },
        ]}
      />
      {URGENCY_TABS.map((t) => {
        const active = t.key === value;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}
            onPress={() => onChange(t.key)}
          >
            <Text style={[styles.label, active ? styles.labelActive : { color: t.color }]}>{t.key}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Shadow/Nuetral/01 (Figma 반지름 16 → CSS blur 8)
  root: {
    width: 350,
    height: 33,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    backgroundColor: colors.surfaceNormal,
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
  },
  slider: { position: 'absolute', top: 0, height: 33, borderRadius: 999 },
  // Label 1/M 14/17
  label: { fontFamily: fonts.robotoMedium, fontSize: 14, lineHeight: 17, textAlign: 'center' },
  // Label 1/B
  labelActive: { fontFamily: fonts.robotoBold, color: colors.white },
});
