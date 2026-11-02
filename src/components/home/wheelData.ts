import { colors, fonts } from '@/theme/tokens';

// Figma "Home(메인화면)" > "홈_메인페이지" (1935:44135) > interaction > network section 의 휠 데이터.
// 좌표는 모두 휠 중심 = 가운데 "Me" 분홍 원 중심(프레임 기준 (195, 462)) 기준 px.
// 링마다 이름이 12시 방향부터 시계방향으로 같은 간격(360 / 인원)으로 놓이고, 글자는 그 각도만큼 기울어짐.

export type RingId = 1 | 2 | 3 | 4 | 5;

export type WheelNode = {
  key: string;
  ring: RingId;
  name: string;
  /** 휠 중심 기준 이름(=흐린 원) 중심 위치 */
  x: number;
  y: number;
  /** 글자 기울기(도, 시계방향) */
  rotate: number;
};

export type Ring = {
  id: RingId;
  nodes: WheelNode[];
};

type RingSpec = {
  id: RingId;
  /** 휠 중심 기준 이 링의 중심 (Figma 링마다 중심이 1~8px 어긋나 있음 — 그대로 따름) */
  cx: number;
  cy: number;
  r: number;
  names: string[];
};

// Figma "Repeat group 1"~"5" (안쪽부터)
const RINGS: RingSpec[] = [
  { id: 1, cx: 0, cy: 0.6, r: 81.6, names: ['Juan', 'Antonio', 'Ana', 'Maria', 'Rocío', 'Nicolás', 'Luis'] },
  {
    id: 2,
    cx: 0.4,
    cy: -2.6,
    r: 158.4,
    names: ['Javier', 'Ángel', 'Jorge', 'Silvia', 'Santiago', 'Alberto', 'Mario', 'Andrés', 'Patricia', 'Rosa', 'Elías', 'Sofia'],
  },
  // 바깥 세 링은 Figma 에서 모두 "Alejandra" 15명
  { id: 3, cx: -0.5, cy: 0, r: 227.5, names: Array(15).fill('Alejandra') },
  { id: 4, cx: -0.5, cy: 0, r: 305.5, names: Array(15).fill('Alejandra') },
  { id: 5, cx: -2.8, cy: -7.8, r: 399.5, names: Array(15).fill('Alejandra') },
];

// 그리는 순서 = Figma 레이어 순서 (바깥 링이 맨 아래, 첫번째 링이 맨 위)
export const RINGS_BOTTOM_UP: Ring[] = [...RINGS].reverse().map(({ id, cx, cy, r, names }) => ({
  id,
  nodes: names.map((name, i) => {
    const deg = i * (360 / names.length);
    const rad = (deg * Math.PI) / 180;
    return { key: `${id}-${i}`, ring: id, name, x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad), rotate: deg };
  }),
}));

// Figma "연결선" — 휠 중심보다 3px 위를 중심으로 하는 원 5개. size 는 원 지름, svg 는 테두리 여백 포함 크기
export const RING_LINES = [
  { size: 170, svg: 194, opacity: 0.72, source: require('../../../assets/figma/home/ring-line-1.svg') },
  { size: 316, svg: 340, opacity: 0.52, source: require('../../../assets/figma/home/ring-line-2.svg') },
  { size: 466, svg: 490, opacity: 0.36, source: require('../../../assets/figma/home/ring-line-3.svg') },
  { size: 616, svg: 640, opacity: 0.36, source: require('../../../assets/figma/home/ring-line-4.svg') },
  { size: 804, svg: 828, opacity: 0.36, source: require('../../../assets/figma/home/ring-line-5.svg') },
] as const;
export const RING_LINE_CY = -3;

// 링별 스타일 — 이름 글자 + 뒤의 흐린 초록 원("surface"). dotSvg 는 blur 여백 포함 크기
const DOT_RING1 = require('../../../assets/figma/home/dot-ring1.svg');
const DOT_RING2 = require('../../../assets/figma/home/dot-ring2.svg');
const DOT_OUTER = require('../../../assets/figma/home/dot-outer.svg');

export function ringStyle(ring: RingId) {
  if (ring === 1) {
    // Body 1/Normal/M 16/18, Label/Normal
    return { dot: DOT_RING1, dotSvg: 72, dotOpacity: 1, font: fonts.robotoMedium, fontSize: 16, lineHeight: 18, color: colors.labelNormal };
  }
  if (ring === 2) {
    return { dot: DOT_RING2, dotSvg: 88, dotOpacity: 0.6, font: fonts.robotoMedium, fontSize: 16, lineHeight: 18, color: colors.labelNeutral };
  }
  // Body 2/Normal/R 15/17, Primitive/Neutral/500
  return { dot: DOT_OUTER, dotSvg: 112, dotOpacity: 0.6, font: fonts.robotoRegular, fontSize: 15, lineHeight: 17, color: colors.neutral500 };
}

export type HelpStats = { total: number; give: number; receive: number; relation: 'Your Friend' | 'Friends of Friends' };

// 서버 연동 전 임시 활동 데이터 — 이름·링·위치로 정해지는 결정적 값
// (Figma 예시: 첫번째 링 Juan = 12/5/7. 가까운 링일수록 많이 도움)
export function mockStats(node: WheelNode): HelpStats {
  const relation = node.ring === 1 ? 'Your Friend' : 'Friends of Friends';
  if (node.key === '1-0') return { total: 12, give: 5, receive: 7, relation };
  let h = 0;
  for (const ch of node.key + node.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const max = node.ring === 1 ? 9 : node.ring === 2 ? 5 : 3;
  const min = node.ring === 1 ? 3 : node.ring === 2 ? 1 : 0;
  const give = min + (h % (max - min + 1));
  const receive = min + ((h >>> 8) % (max - min + 1));
  return { total: give + receive, give, receive, relation };
}
