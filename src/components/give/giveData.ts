import type { ImageSource } from 'expo-image';
import type { HelpRequest, Urgency } from '@/components/need/preview/mockRequest';
import { colors } from '@/theme/tokens';

// Figma "Give(도움 제공 페이지)" (1935:43752 ~ 44089) 의 예시 데이터 — 서버 연동 전 임시

// Figma "Tap" — 긴급도 탭. 글자 색 / 선택 시 슬라이더 색·안쪽 빛 번짐 / 슬라이더 위치(탭 안쪽 기준)
export const URGENCY_TABS: {
  key: Urgency;
  color: string;
  slider: { bg: string; glow: string; left: number; width: number };
}[] = [
  { key: 'Critical', color: colors.statusNegative, slider: { bg: colors.statusNegative, glow: '#F4B0B0', left: 0, width: 85 } },
  { key: 'High', color: '#EE8A8A', slider: { bg: '#E75454', glow: '#F4B0B0', left: 87, width: 85 } },
  { key: 'Moderate', color: '#CBA60E', slider: { bg: '#CBA60E', glow: '#FFF1C1', left: 182, width: 85 } },
  { key: 'Low', color: colors.statusPositive, slider: { bg: colors.statusPositive, glow: colors.labelAssistive, left: 284, width: 66 } },
];

// Figma "Category" — 아이콘은 Figma 그대로, 이름은 가입 화면 도움 주제에 맞춤
// (Figma 글자는 "Grocery Shopping"·"Legal Help" 가 중복돼 아이콘과 맞지 않음)
export const CATEGORIES: { label: string; icon: ImageSource }[] = [
  { label: 'Childcare', icon: require('../../../assets/figma/give/cat-childcare.svg') },
  { label: 'Child Pickup', icon: require('../../../assets/figma/give/cat-school.svg') },
  { label: 'Language Help', icon: require('../../../assets/figma/give/cat-language.svg') },
  { label: 'Grocery Shopping', icon: require('../../../assets/figma/give/cat-grocery.svg') },
  { label: 'Rides & Carpool', icon: require('../../../assets/figma/give/cat-rides.svg') },
  { label: 'Legal Help', icon: require('../../../assets/figma/give/cat-legal.svg') },
  { label: 'Delivery', icon: require('../../../assets/figma/give/cat-product.svg') },
  { label: 'Other', icon: require('../../../assets/figma/give/cat-other.svg') },
];

export type Relation = 'Your Friend' | 'Friend of Friend';

export type RequestDetail = { name: string; chat: string; request: HelpRequest };

export type RequestSummary = { id: string; title: string; name: string; distance: string; relation: Relation; detail: RequestDetail };

// Figma "도움 제공_상세페이지" (1967:20278) — Carlos 카드가 아니면 어느 카드를 눌러도 이 상세를 보여줌
export const MIGUEL_REQUEST: RequestDetail = {
  name: 'Miguel',
  chat: 'miguel',
  request: {
    urgency: 'Moderate',
    category: 'Language Help',
    title: 'Need Help Filling Out School Enrollment Forms',
    body: "I need to complete my daughter's school enrollment forms, but they're in English and I don't understand some of the questions. I'm worried about filling them out incorrectly. I need someone who speaks both Spanish and English to help me understand the forms and complete them before the deadline tomorrow.",
    time: { value: '2:00 PM – 3:00 PM' },
    date: { value: 'Thu, Nov 5, 2026' },
    places: { location: 'Palisades Park, NJ (exact address private)' },
  },
};

// Figma "도움 제공_상세페이지" (1967:20296) — 문구 그대로
export const CARLOS_REQUEST: RequestDetail = {
  name: 'Carlos',
  chat: 'carlos',
  request: {
    urgency: 'Critical',
    category: 'Rides & Carpool',
    title: 'Need an Urgent Ride to the Hospital',
    body: "need to get to the hospital as soon as possible because I'm experiencing severe abdominal pain and dizziness. I don't have a car, and there's no one available to drive me right now. I urgently need someone who can take me to the hospital.",
    time: { tag: 'As soon as possible', value: '9:00 PM' },
    date: { tag: 'Today', value: 'Thu, Nov 5, 2026' },
    places: { location: 'Palisades Park, NJ (exact address private)' },
  },
};

function list(urgency: Urgency, rows: [string, Relation, RequestDetail?][]): RequestSummary[] {
  return rows.map(([distance, relation, detail = MIGUEL_REQUEST], i) => ({
    id: `${urgency}-${i}`,
    title: detail.request.title,
    name: detail.name,
    distance,
    relation,
    detail,
  }));
}

// 탭마다 Figma 프레임의 목록 그대로 (Figma 목록에 없는 Carlos 는 Critical 의 Friend of Friend 카드에 연결)
export const REQUESTS: Record<Urgency, RequestSummary[]> = {
  Critical: list('Critical', [
    ['1.6 miles', 'Your Friend'],
    ['2.4 miles', 'Friend of Friend', CARLOS_REQUEST],
    ['3.9 miles', 'Your Friend'],
    ['4.1 miles', 'Your Friend'],
  ]),
  High: list('High', [
    ['1.1 miles', 'Your Friend'],
    ['2.3 miles', 'Friend of Friend'],
    ['2.9 miles', 'Your Friend'],
  ]),
  Moderate: list('Moderate', [
    ['0.9 miles', 'Your Friend'],
    ['1.6 miles', 'Friend of Friend'],
    ['2.2 miles', 'Your Friend'],
    ['3.6 miles', 'Your Friend'],
    ['3.9 miles', 'Friend of Friend'],
    ['4.3 miles', 'Friend of Friend'],
  ]),
  Low: list('Low', [
    ['2.1 miles', 'Your Friend'],
    ['2.6 miles', 'Friend of Friend'],
    ['2.7 miles', 'Friend of Friend'],
    ['2.9 miles', 'Your Friend'],
    ['4 miles', 'Your Friend'],
  ]),
};

// Critical 알림(Figma 1967:20877)을 누르면 여는 Carlos 카드
export const CARLOS_REQUEST_ID = 'Critical-1';

export function findRequest(id?: string) {
  return Object.values(REQUESTS)
    .flat()
    .find((item) => item.id === id);
}
