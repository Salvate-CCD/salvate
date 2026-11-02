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

export type RequestSummary = { id: string; title: string; name: string; distance: string; relation: Relation };

const TITLE = 'Need Help Filling Out School Enrollment Forms';

function list(urgency: Urgency, rows: [string, Relation][]): RequestSummary[] {
  return rows.map(([distance, relation], i) => ({ id: `${urgency}-${i}`, title: TITLE, name: 'Miguel', distance, relation }));
}

// 탭마다 Figma 프레임의 목록 그대로
export const REQUESTS: Record<Urgency, RequestSummary[]> = {
  Critical: list('Critical', [
    ['1.6 miles', 'Your Friend'],
    ['2.4 miles', 'Friend of Friend'],
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

// Figma "도움 제공_상세페이지" (1935:44050) — 어느 카드를 눌러도 이 상세를 보여줌
export const MIGUEL_REQUEST: { name: string; request: HelpRequest } = {
  name: 'Miguel',
  request: {
    urgency: 'Moderate',
    category: 'Language Help',
    title: TITLE,
    body: "I need to complete my daughter's school enrollment forms, but they're in English and I don't understand some of the questions. I'm worried about filling them out incorrectly. I need someone who speaks both Spanish and English to help me understand the forms and complete them before the deadline tomorrow.",
    time: { value: '2:00 PM – 3:00 PM' },
    date: { value: 'Thu, Nov 5, 2026' },
    places: { location: 'Palisades Park, NJ (exact address private)' },
  },
};
