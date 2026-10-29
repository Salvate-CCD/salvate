import { Image } from 'expo-image';
import { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputInstance,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, radius, typography } from '@/theme/tokens';

// tokens.ts에 없는 Figma 값 (Primitive/Red, 포커스 glow, Caption 2/M)
const red50 = '#FBE6E6';
const red100 = '#F4B0B0';
const focusGlow = 'inset 0px 0px 8px 0px rgba(96, 145, 123, 0.2)';
const caption2Medium = { fontFamily: fonts.robotoMedium, fontSize: 11, lineHeight: 14 };

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  /** 있으면 에러 상태(빨간 테두리·라벨) + 아래 에러 메시지 */
  error?: string;
  style?: StyleProp<ViewStyle>;
};

// Figma "Input/Text Input/Text Field" — Default / Activate(포커스) / Filled / Error
export const TextField = forwardRef<TextInputInstance, Props>(function TextField(
  { label, error, style, onFocus, onBlur, ...input },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={style}>
      <Text style={[typography.label1Medium, { color: hasError ? colors.statusNegative : colors.labelAlternative }]}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.labelInactive}
        selectionColor={colors.labelAlternative}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          typography.body1Medium,
          styles.input,
          { color: focused && !hasError ? colors.labelStrong : colors.labelNormal },
          hasError ? styles.inputError : focused ? styles.inputFocused : null,
        ]}
        {...input}
      />
      {hasError ? (
        <View style={styles.error}>
          <Image source={require('../../assets/figma/icon-attention.svg')} style={styles.errorIcon} />
          <Text style={[caption2Medium, { color: colors.statusNegative }]}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    marginTop: 4,
    height: 44,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: colors.labelInactive,
    borderRadius: radius.m,
    backgroundColor: colors.surfaceNeutral,
    // 웹 브라우저 기본 포커스 링 제거 (포커스는 테두리 색으로 표시)
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  inputFocused: { borderColor: colors.labelAlternative, boxShadow: focusGlow },
  inputError: { borderColor: red100, backgroundColor: red50 },
  error: { position: 'absolute', top: 69, left: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorIcon: { width: 12, height: 12 },
});
