import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Platform } from 'react-native';

// 웹: 모바일 Safari 는 주소창·툴바 뒤와 바운스 영역에 html/body 배경을 그림
// 기본값(흰색)이면 앱 화면 아래가 끊겨 보이므로 현재 화면 배경색과 맞춤
// 뒤로가기로 돌아온 화면은 다시 마운트되지 않으므로 포커스될 때마다 적용
export function useWebPageBackground(color: string) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'web') return;
      document.documentElement.style.backgroundColor = color;
      document.body.style.backgroundColor = color;
    }, [color]),
  );
}
