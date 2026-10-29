import { Platform, type TextStyle } from 'react-native';
import { fonts } from '@/theme/tokens';

// WhatsApp 화면 전용 색 — 앱 토큰에 없는 Figma 하드코딩 값
export const wa = {
  background: '#F5F0E9', // 프레임/입력바 배경
  bubbleBorder: 'rgba(151, 142, 128, 0.2)', // 날짜·안내·프로필 카드 테두리
  safetyNotice: '#CAFEEB', // "안전 메시지" 배경
} as const;

// Figma 텍스트 스타일 중 앱 typography 토큰에 없는 크기들
export const waText = {
  headline2Medium: { fontFamily: fonts.robotoMedium, fontSize: 17, lineHeight: 17 }, // Headline 2/M
  label2Regular: { fontFamily: fonts.robotoRegular, fontSize: 13, lineHeight: 16 }, // Label 2/R
  body1Regular: { fontFamily: fonts.robotoRegular, fontSize: 16, lineHeight: 18 }, // Body 1/Normal/R
  body2Reading: { fontFamily: fonts.robotoRegular, fontSize: 15, lineHeight: 20 }, // Body 2/Reading/R
  caption1Regular: { fontFamily: fonts.robotoRegular, fontSize: 12, lineHeight: 15 }, // Caption 1/R
} as const satisfies Record<string, TextStyle>;

// 공백 없는 긴 링크를 Figma처럼 글자 단위로 줄바꿈 (iOS/Android는 기본 동작)
export const breakAll = (Platform.OS === 'web' ? { wordBreak: 'break-all' } : {}) as TextStyle;
