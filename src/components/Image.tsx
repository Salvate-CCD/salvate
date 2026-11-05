import { Image as ExpoImage, type ImageErrorEventData, type ImageProps } from 'expo-image';
import { useEffect, useRef, useState } from 'react';

export type { ImageSource } from 'expo-image';

// 실패하면 다시 불러오는 횟수와 간격(1차 0.5초, 2차 1초, 3차 1.5초 …)
const MAX_RETRIES = 4;
const RETRY_STEP_MS = 500;

// expo-image 래퍼 — 앱 전체는 이 Image 를 씀.
// 웹(expo-image)은 이미지를 한 번 불러오다 실패하면 그 이미지를 화면에서 빼고 다시 시도하지 않음.
// 홈 화면 앱(PWA)을 다시 켜는 순간처럼 네트워크가 막 붙을 때 일부 아이콘 요청이 실패하면
// 화면을 다시 열기 전까지 아이콘이 계속 비어 보였음 → 실패하면 잠시 뒤 다시 그려서 재요청
export function Image({ onError, ...props }: ImageProps) {
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleError = (event: ImageErrorEventData) => {
    onError?.(event);
    if (attempt >= MAX_RETRIES || timer.current) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      setAttempt((a) => a + 1);
    }, RETRY_STEP_MS * (attempt + 1));
  };

  // key 가 바뀌면 expo-image 가 새로 마운트되어 같은 주소를 다시 요청함
  return <ExpoImage key={attempt} {...props} onError={handleError} />;
}
