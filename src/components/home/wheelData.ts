import { colors } from '@/theme/tokens';

// Figma "Home(메인화면)" > Interaction > Names 의 휠 데이터
// 좌표는 모두 "휠 중심"(초록색 원 중심, Figma Names 프레임 (581, 603)) 기준 px.
// 각 이름 카드는 78×37 "frame"(이름 텍스트 + 눈금선)의 중심을 pivot 으로 회전한다.

export type RingId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type WheelNode = {
  key: string;
  ring: RingId;
  name: string;
  /** 링 회전 중심 기준 pivot 위치 */
  x: number;
  y: number;
  /** 카드 회전 각도(도, 시계방향) */
  rotate: number;
};

export type Ring = {
  id: RingId;
  /** 휠 중심 기준 이 링의 회전 중심 (Figma 3~8번 링은 중심이 살짝 위로 어긋나 있음 — 그대로 따름) */
  cx: number;
  cy: number;
  nodes: WheelNode[];
};

// 링별 스타일 — Figma Card/Network Node 인스턴스에서 가져온 값
export const RING_STYLE = {
  1: { color: colors.labelNormal, lineLength: 28, line: 'ring1', popoverOffset: 61 },
  2: { color: colors.labelNeutral, lineLength: 24, line: 'ring2', popoverOffset: 57 },
  outer: { color: colors.labelAssistive, lineLength: 20, line: 'outer', popoverOffset: 53 },
} as const;

export function ringStyle(ring: RingId) {
  return ring === 1 ? RING_STYLE[1] : ring === 2 ? RING_STYLE[2] : RING_STYLE.outer;
}

// "첫번째 휠" 1608:34349 — 손으로 배치된 8명 (Figma 좌표 그대로)
const RING1: [string, number, number, number][] = [
  ['Maria', -1, -83.5, 0],
  ['Juan', 66, -47.5, 45],
  ['Ana', 89, 1.5, 90],
  ['Sofia', 67, 50.5, 135],
  ['Miguel', 1, 86.5, 180],
  ['Lucìa', -69, 50.5, -135],
  ['Carlos', -91, 1.5, -90],
  ['Rosa', -70, -47.5, -45],
];

// "두번째 휠" 1608:34336 — 12명 (Figma 좌표 그대로)
const RING2: [string, number, number, number][] = [
  ['Andrés', -1, -158.5, 0],
  ['Renata', 75, -129.5, 30],
  ['Javier', 132, -68.5, 60],
  ['Elena', 149, 2.5, 90],
  ['Andrés', 126, 72.5, 120],
  ['Fernando', 72, 134.5, 150],
  ['Alejandro', -3, 159.5, 180],
  ['Daniela', -88, 134.5, -150],
  ['Andrea', -142, 72.5, -120],
  ['Manuel', -159, 2.5, -90],
  ['Diego', -136, -68.5, -60],
  ['Antonio', -85, -129.5, -30],
];

// 바깥 링 "3"~"8" — 24명이 15° 간격으로 정확히 원형 배치 (12시 방향부터 시계방향)
// cy: 휠 중심 기준 링 중심 y, r: 반지름
const OUTER: { id: RingId; cx: number; cy: number; r: number; names: string[] }[] = [
  {
    id: 3, cx: 0.25, cy: -10.75, r: 222.6,
    names: ['Nicolás', 'Emmanuel', 'Iván', 'Jorge', 'Paola', 'Juana', 'Mateo', 'Valeria', 'Sara', 'César', 'Óscar', 'Luz', 'Raúle', 'Patricia', 'Rocío', 'Inés', 'Dulce', 'Efraín', 'Ángel', 'Miguel', 'Abel', 'Julián', 'Rubén', 'Elías'],
  },
  {
    id: 4, cx: 0.4, cy: -10.6, r: 291.5,
    names: ['Vanessa', 'Angélica', 'Miriam', 'Noemí', 'Estefanía', 'Inés', 'Leticia', 'Silvia', 'Yolanda', 'Efraín', 'Rebeca', 'Edwin', 'Benjamín', 'Samuel', 'Alexander', 'Josué', 'Graciela', 'Daniela', 'Sebastián', 'Santiago', 'Andrés', 'Héctor', 'Lucía', 'Lorena'],
  },
  {
    id: 5, cx: 0.31, cy: -10.69, r: 355.1,
    names: ['Fátima', 'Francisco', 'Paola', 'Teresa', 'Mario', 'Ángel', 'Montserrat', 'Mauricio', 'Elena', 'Patricia', 'Santiago', 'Joaquín', 'Sergio', 'Nicolás', 'Estefanía', 'Angélica', 'Rubén', 'Saúl', 'Adán', 'Saúl', 'Cindy', 'Rocío', 'Cristian', 'Beatriz'],
  },
  {
    id: 6, cx: 0.48, cy: -26.52, r: 413.4,
    names: ['Concepción', 'Daniel', 'Cristina', 'Rosario', 'Alejandro', 'Mateo', 'Patricia', 'Ana', 'Juan', 'Juilo', 'Alberto', 'Ximena', 'Renata', 'Sara', 'Héctor', 'Luis', 'Iván', 'Alicia', 'Marisol', 'Raúl', 'Víctor', 'Paola', 'Mónica', 'César'],
  },
  {
    id: 7, cx: 0.13, cy: -26.87, r: 477,
    names: ['Pablo', 'Luz', 'Laura', 'Patricia', 'María', 'Gabriel', 'Carmen', 'Rafael', 'Natalia', 'Andrés', 'Miguel', 'Gabriela', 'Emmanuel', 'Rosa', 'First Name', 'Isabel', 'Sofía', 'Maximiliano', 'Javier', 'Eduardo', 'Mariana', 'Martín', 'Jorge', 'Alberto'],
  },
  {
    id: 8, cx: -0.49, cy: -27.49, r: 530,
    names: ['Juan', 'Jorge', 'José', 'Fernando', 'Carlos', 'Eduardo', 'Jesús', 'David', 'Mario', 'Alejandra', 'Carmen', 'Óscar', 'Sebastián', 'Guadalupe', 'Esperanza', 'Valeria', 'Felipe', 'Natalia', 'Daniel', 'Verónica', 'Claudia', 'Valentina', 'Maria', 'Isabel'],
  },
];

function handPlaced(id: RingId, list: [string, number, number, number][]): Ring {
  return {
    id,
    cx: 0,
    cy: 0,
    nodes: list.map(([name, x, y, rotate], i) => ({ key: `${id}-${i}`, ring: id, name, x, y, rotate })),
  };
}

// 그리는 순서 = Figma 레이어 순서 (바깥 링이 맨 아래, 첫번째 휠이 맨 위)
export const OUTER_RINGS: Ring[] = [...OUTER].reverse().map(({ id, cx, cy, r, names }) => ({
  id,
  cx,
  cy,
  nodes: names.map((name, i) => {
    const deg = i * (360 / names.length);
    const rad = (deg * Math.PI) / 180;
    return { key: `${id}-${i}`, ring: id, name, x: r * Math.sin(rad), y: -r * Math.cos(rad), rotate: deg };
  }),
}));
export const RING_2 = handPlaced(2, RING2);
export const RING_1 = handPlaced(1, RING1);

export type HelpStats = { total: number; give: number; receive: number; relation: 'Your Friend' | 'Friends of Friends' };

// 서버 연동 전 임시 활동 데이터 — 이름·링·위치로 정해지는 결정적 값
// (Figma 예시: 첫번째 휠 Juan = 12/5/7, 두번째 휠 Andrés = 07/3/4. 가까운 링일수록 많이 도움)
export function mockStats(node: WheelNode): HelpStats {
  const relation = node.ring === 1 ? 'Your Friend' : 'Friends of Friends';
  if (node.key === '1-1') return { total: 12, give: 5, receive: 7, relation };
  if (node.key === '2-0') return { total: 7, give: 3, receive: 4, relation };
  let h = 0;
  for (const ch of node.key + node.name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const max = node.ring === 1 ? 9 : node.ring === 2 ? 5 : 3;
  const min = node.ring === 1 ? 3 : node.ring === 2 ? 1 : 0;
  const give = min + (h % (max - min + 1));
  const receive = min + ((h >>> 8) % (max - min + 1));
  return { total: give + receive, give, receive, relation };
}
