// 채팅 상대별 프로토타입 데이터 (서버 연동 전)
//  - Maria: Figma "도움 요청_채팅" (1935:42314 ~ 42946) — 내 도움 요청에 도움을 제안한 사람
//  - Miguel: Figma "도움 제공_채팅" (1935:44067 / 44089) — 내가 도움을 주려는 사람

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

function mariaMessages(): ChatMessage[] {
  const at = todayAt(9, 41);
  return [
    { id: 'm1', from: 'them', kind: 'text', text: 'Hi José, I saw your help request and wanted to reach out.', at },
    { id: 'm2', from: 'them', kind: 'text', text: 'I’m available to leave now. Do you still need a ride?', at },
  ];
}


// 마지막으로 보낸 뒤 이만큼 조용하면 답장이 옴 — 연달아 보내면 다 보낸 뒤에 한 번 답함
export const REPLY_DELAY_MS = 1500;

// Figma "프로필" (1935:42577)
const MARIA_PROFILE = {
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

export type Profile = typeof MARIA_PROFILE;

export type Contact = {
  name: string;
  initialMessages: () => ChatMessage[];
  /** 내가 보내면 Figma 대화 순서대로 하나씩 오는 답장 (다 쓰면 더 답하지 않음) */
  replies: string[];
  /** 상단 Find Another Match / Accept Match 버튼 */
  matchActions: boolean;
  /** 헤더 이름을 누르면 뜨는 프로필 (디자인이 없는 상대는 없음) */
  profile?: Profile;
  /** 대화가 없을 때 가운데 문구 */
  emptyText?: string;
  /** 뒤로가기 — 알림에서 바로 들어온 채팅은 홈으로, 나머지는 이전 화면으로 */
  backTo?: '/home';
};

export const CONTACTS: Record<string, Contact> = {
  maria: {
    name: 'Maria',
    initialMessages: mariaMessages,
    replies: ['I’m glad I can help.', 'I should be there in about 10 minutes!'],
    matchActions: true,
    profile: MARIA_PROFILE,
    backTo: '/home',
  },
  miguel: {
    name: 'Miguel',
    initialMessages: () => [],
    replies: [],
    matchActions: false,
    emptyText: 'Send a message to get started.',
  },
};
