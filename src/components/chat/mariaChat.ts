// Maria 와의 채팅 프로토타입 데이터 (서버 연동 전) — Figma "도움 요청_채팅" (1935:42314 ~ 42743)

export type Sender = 'them' | 'me';

export type ChatMessage =
  | { id: string; from: Sender; kind: 'text'; text: string; at: Date }
  | { id: string; from: Sender; kind: 'voice'; seconds: number; at: Date };

// Figma 예시 시각 9:41 am 에 온 첫 두 메시지
function todayAt(hour: number, minute: number) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function initialMessages(): ChatMessage[] {
  const at = todayAt(9, 41);
  return [
    { id: 'm1', from: 'them', kind: 'text', text: 'Hi José, I saw your help request and wanted to reach out.', at },
    { id: 'm2', from: 'them', kind: 'text', text: 'I’m available to leave now. Do you still need a ride?', at },
  ];
}

// 내가 메시지를 보내면 Maria 가 Figma 대화 순서대로 하나씩 답함 (다 쓰면 더 답하지 않음)
export const SCRIPTED_REPLIES = ['I’m glad I can help.', 'I should be there in about 10 minutes!'];

// 마지막으로 보낸 뒤 이만큼 조용하면 답장이 옴 — 연달아 보내면 다 보낸 뒤에 한 번 답함
export const REPLY_DELAY_MS = 1500;

// Figma "프로필" (1935:42577)
export const MARIA_PROFILE = {
  name: 'Maria',
  relation: 'Friend of Friend',
  ageGroup: '40-49',
  gender: 'Female',
  totalHelp: 12,
  given: 5,
  received: 7,
};

// "9:41 am"
export function formatTime(d: Date) {
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? 'am' : 'pm'}`;
}

// "0:16"
export function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
