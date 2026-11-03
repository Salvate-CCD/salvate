// 채팅 상대별 프로토타입 데이터 (서버 연동 전)
//  - Maria: Figma "도움 요청_채팅" (1935:42314 ~ 42946) — 내 도움 요청에 도움을 제안한 사람
//  - Miguel: Figma "도움 제공_채팅" (1935:44067 / 44089) — 내가 도움을 주려는 사람

export type Sender = 'them' | 'me' | 'system';

export type ChatMessage =
  | { id: string; from: Sender; kind: 'text'; text: string; at: Date }
  | { id: string; from: Sender; kind: 'voice'; seconds: number; at: Date }
  /** Figma 분홍 "Match Confirmed." 표시 */
  | { id: string; from: 'system'; kind: 'notice'; text: string; at: Date }
  /** Figma 날짜 칩 "November 5, 2026" */
  | { id: string; from: 'system'; kind: 'date'; text: string; at: Date };

// Figma 예시 시각 9:41 am 에 온 첫 두 메시지
export function todayAt(hour: number, minute: number) {
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

// 프로토타입: 실제 시간 대신 다음 단계 잠금화면 알림이 이만큼 뒤에 내려옴
export const HELP_PUSH_MS = 4000;

// 도움 제공자 흐름 — 메모: 장소 2개(Grocery, Rides, Delivery, Child Pickup) / 장소 1개(Childcare, Language, Legal, Other)
export type HelpRoute = 'one' | 'two';

export type ProviderFlow = {
  route: HelpRoute;
  /** 매칭 확정 뒤 상대 답장 (Figma 1967:20388). Carlos 는 대화 디자인이 없어 없음 */
  reply?: string;
  /** Help Completed 뒤 — waiting: 상대 미완료(1967:20826), both: 둘 다 완료(1967:20777) */
  completion: 'waiting' | 'both';
};

// Figma 진행 화면(1967:20418 등)의 날짜 칩과 José 메시지 — 출발 Yes 뒤 자동으로 들어감
export const DEPARTED_DATE = 'November 5, 2026';
export const DEPARTED_MESSAGE = 'I’m on my way! I’ll be there in about 15 minutes!';

// Figma 도움 제공 잠금화면 확인 알림 — 시각은 프레임 그대로
export const CONFIRM_PUSHES = {
  leave: { title: 'Ready to Leave?', message: 'Have you departed to provide help?', time: '1:30' }, // 1967:20914 / 20954
  pickup: { title: 'Have You Arrived at Pickup?', message: 'Have you arrived at the pickup location?', time: '1:45' }, // 1967:20994
  dropoff: { title: 'Have You Arrived at Drop-off?', message: 'Have you arrived at the drop-off location?', time: '1:45' }, // 1967:21034
  arrival: { title: 'Have You Arrived?', message: 'Have you arrived at the help location?', time: '1:55' }, // 1967:21074
};

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
  /** 매칭 확정 뒤 진행 흐름의 잠금화면 알림 문구 (Figma 1967:19898 / 1967:19943) */
  helpPushes?: { departed: string; arrived: string };
  /** 내가 도움을 주는 쪽의 진행 흐름 */
  provider?: ProviderFlow;
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
    helpPushes: {
      departed: 'Maria has picked up your child and is expected to arrive in about 15 minutes.',
      arrived: 'I’m here!',
    },
    backTo: '/home',
  },
  miguel: {
    name: 'Miguel',
    initialMessages: () => [],
    replies: [],
    matchActions: false,
    emptyText: 'Send a message to get started.',
    provider: {
      route: 'one',
      reply: "Thank you so much, José! I really appreciate your help. We can meet in front of St. Mary's Church at 2 PM. Thank you again!",
      completion: 'waiting',
    },
  },
  // Carlos 채팅은 Figma 에 없어 Miguel 의 빈 채팅과 같게 두고 답장 없이 진행. Rides & Carpool 이라 장소 2개 흐름
  carlos: {
    name: 'Carlos',
    initialMessages: () => [],
    replies: [],
    matchActions: false,
    emptyText: 'Send a message to get started.',
    provider: { route: 'two', completion: 'both' },
  },
};
