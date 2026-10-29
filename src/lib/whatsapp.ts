import { router } from 'expo-router';

export type WhatsAppFlow = 'signup' | 'login';

// TODO: 실제 인증 서버 주소로 교체
const VERIFY_BASE_URL = 'https://salvate.example/auth/whatsapp/verify';

/**
 * WhatsApp 인증 단계로 이동한다.
 * 실제 WhatsApp 앱을 열지 않고, Figma의 "왓츠앱 전환 → 왓츠앱 인증" 화면을 앱 안에서 이어서 보여주는 프로토타입 흐름.
 */
export function openWhatsAppVerification(flow: WhatsAppFlow) {
  router.push({ pathname: '/whatsapp', params: { flow } });
}

// 대화창에 미리 채워지는 인증 링크 (Figma 문구 형식)
export function createVerifyLink() {
  const rand = () => Math.random().toString(36).slice(2, 10);
  return `${VERIFY_BASE_URL}?session=${rand()}&token=${rand()}${rand()}`;
}
