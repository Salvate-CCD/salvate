import type { ViewStyle } from 'react-native';

export type KeyboardViewport = {
  /** 화면을 실제로 보이는 영역에 맞추는 스타일 — 입력 중이 아니면 null */
  style: ViewStyle | null;
  /** 키보드가 실제로 열려 있음 */
  keyboardOpen: boolean;
};

const NONE: KeyboardViewport = { style: null, keyboardOpen: false };

// 네이티브는 KeyboardAvoidingView 가 처리 — 실제 구현은 use-web-keyboard-viewport.web.ts
export function useWebKeyboardViewport(): KeyboardViewport {
  return NONE;
}
