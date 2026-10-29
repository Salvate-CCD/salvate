// Figma "GUI" 파일의 Semantic 변수에서 가져온 값.
export const colors = {
  primary: '#457D64',
  deepGreen100: '#CFE3DA',
  deepGreen400: '#7BA591',
  secondaryLight: '#AFE6D5',
  secondaryNormal: '#6CD2B6',

  labelStrong: '#121212',
  labelNormal: '#292929',
  labelNeutral: '#636363',
  labelAlternative: '#7BA591',
  labelAssistive: '#B3CEC1',
  labelInactive: '#CFE3DA',
  labelDisabled: '#ACACAC',
  neutral500: '#7F7F7F', // Primitive/Neutral/500

  backgroundNormal: '#FAFAFA',
  backgroundAlternative: '#F5F5F5',
  surfaceNormal: '#FFFFFF',
  surfaceNeutral: '#FAFAFA',
  surfaceDisabled: '#CCCCCC',

  strokeAlternative: '#B3CEC1',
  strokeNeutral: '#E1E1E1',

  statusPositive: '#498C79',
  statusNegative: '#DB0000',

  accentPink: '#FFCBDC',
  accentPinkLight: '#FFE5EE',
  accentPinkStrong: '#C59AA8',
  accentPinkHeavy: '#AA828F',

  white: '#FFFFFF',
  black: '#000000',
  dim: '#00000085', // Material/Dim 01
} as const;

export const radius = {
  xs: 4,
  s: 6,
  m: 8,
  l: 12,
  '2xl': 20,
  full: 999,
} as const;

export const spacing = {
  padding: 20,
} as const;

export const fonts = {
  robotoRegular: 'Roboto_400Regular',
  robotoMedium: 'Roboto_500Medium',
  robotoBold: 'Roboto_700Bold',
  robotoExtraBold: 'Roboto_800ExtraBold',
  vesperHeavy: 'VesperLibre_900Black',
} as const;

// Figma 텍스트 스타일 (이름은 Figma 스타일명을 따름)
export const typography = {
  display1: { fontFamily: fonts.vesperHeavy, fontSize: 36, lineHeight: 36 },
  display3: { fontFamily: fonts.vesperHeavy, fontSize: 20, lineHeight: 20 },
  title2Bold: { fontFamily: fonts.robotoBold, fontSize: 24, lineHeight: 26 },
  heading1Bold: { fontFamily: fonts.robotoBold, fontSize: 22, lineHeight: 26 },
  heading2Medium: { fontFamily: fonts.robotoMedium, fontSize: 20, lineHeight: 24 },
  body1Medium: { fontFamily: fonts.robotoMedium, fontSize: 16, lineHeight: 18 },
  body1Bold: { fontFamily: fonts.robotoBold, fontSize: 16, lineHeight: 18 },
  body2Medium: { fontFamily: fonts.robotoMedium, fontSize: 15, lineHeight: 17 },
  body2Regular: { fontFamily: fonts.robotoRegular, fontSize: 15, lineHeight: 17 },
  label1Medium: { fontFamily: fonts.robotoMedium, fontSize: 14, lineHeight: 17 },
  label1Regular: { fontFamily: fonts.robotoRegular, fontSize: 14, lineHeight: 17 },
} as const;

// Figma의 inset 그림자 (Button/Box Button, 입력칸)
export const insetGlow = {
  solid: `inset 0px 0px 12px 0px ${colors.deepGreen400}`,
  ghost: `inset 0px 0px 12px 0px ${colors.deepGreen100}`,
  field: `inset 0px 0px 8px 0px ${colors.deepGreen100}`,
} as const;
