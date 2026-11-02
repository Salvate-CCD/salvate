import { Image } from 'expo-image';
import { memo, useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { HelpActivityPopover, POPOVER_HEIGHT, POPOVER_WIDTH } from './HelpActivityPopover';
import {
  mockStats,
  RING_LINE_CY,
  RING_LINES,
  RINGS_BOTTOM_UP,
  ringStyle,
  type Ring,
  type WheelNode,
} from './wheelData';

// Figma 프레임(390 폭) 기준 휠 중심 — "Me" 분홍 원 중심 (195, 462) → 상태바(47) 제외 y 415
const CENTER_Y = 415;
// 회전 레이어 크기 — 가장 바깥 링(반지름 ~400) + 흐린 원 여백이 들어가는 정사각형. 이 정사각형의 가운데가 회전축
const LAYER = 1000;
const HALF = LAYER / 2;
// 이름 터치 영역 (글자와 같은 각도로 기울어짐)
const NAME_W = 90;
const NAME_H = 40;
// 이 거리 이상 움직이면 탭이 아니라 돌리기로 처리
const DRAG_SLOP = 10;
// Help Activity 카드는 누른 이름 위에 덮여 뜸 — Figma: Juan 중심 (195, 381) → 카드 (117, 332)
const POPOVER_DX = -78;
const POPOVER_DY = -49;

type Selected = { node: WheelNode; angle: number };

type Props = {
  firstName: string;
  /** 휠 위에 덮이는 레이어 (제목 그라데이션) — 팝오버보다는 아래 */
  overlay?: React.ReactNode;
  /** 화면 하단에서 팝오버가 피해야 할 높이 (내비게이션) */
  bottomInset: number;
  /** 휠을 돌리기 시작하거나 빈 곳을 누를 때 (홈의 메시지 목록 등 다른 팝오버를 닫는 용도) */
  onInteract?: () => void;
};

// Figma "Home(메인화면)" > interaction > network section — 이름 링 + Help Activity 팝오버.
// 손가락으로 휠 중심(Me) 둘레를 끌면 링 전체가 그 각도만큼 돌아감 (관성 없음, 손을 떼면 그 자리에 멈춤)
export function NameWheel({ firstName, overlay, bottomInset, onInteract }: Props) {
  const [angle] = useState(() => new Animated.Value(0));
  const [size, setSize] = useState({ width: 390, height: 763 });
  const [selected, setSelected] = useState<Selected | null>(null);
  const rootRef = useRef<ComponentRef<typeof View>>(null);

  // 화면 폭이 390이 아니어도 휠은 가로 가운데
  const cx = size.width / 2;

  const gesture = useRef({
    // 휠 중심의 화면(page) 좌표 — 손가락 각도 계산용
    origin: { x: cx, y: CENTER_Y },
    angle: 0,
    lastTouch: 0,
    moved: false,
    releasedAt: 0,
  });
  const onInteractRef = useRef(onInteract);
  useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  const responder = useMemo(() => {
    const touchAngle = (x: number, y: number) => {
      const o = gesture.current.origin;
      return (Math.atan2(y - o.y, x - o.x) * 180) / Math.PI;
    };
    // PanResponder 핸들러는 터치 이벤트 때만 호출되고 렌더 중에는 실행되지 않음 → react-hooks/refs·purity 오탐
    // eslint-disable-next-line react-hooks/refs
    return PanResponder.create({
      // 이름(Pressable)이 먼저 터치를 받고, 빈 곳을 누르면 휠이 받음
      onStartShouldSetPanResponder: () => true,
      // 이름 위에서 시작해도 일정 거리 이상 끌면 돌리기로 가로챔
      onMoveShouldSetPanResponderCapture: (_, g) => Math.hypot(g.dx, g.dy) > DRAG_SLOP,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (_, g) => {
        const s = gesture.current;
        s.moved = false;
        s.lastTouch = touchAngle(g.x0, g.y0);
      },
      onPanResponderMove: (_, g) => {
        const s = gesture.current;
        if (!s.moved && Math.hypot(g.dx, g.dy) <= DRAG_SLOP) return;
        if (!s.moved) {
          s.moved = true;
          setSelected(null); // 돌리기 시작하면 팝오버 닫기
          onInteractRef.current?.();
        }
        // 직전 위치와의 각도 차이를 누적 (±180° 경계를 넘어도 끊기지 않게)
        const now = touchAngle(g.moveX, g.moveY);
        let delta = now - s.lastTouch;
        if (delta > 180) delta -= 360;
        else if (delta < -180) delta += 360;
        s.lastTouch = now;
        s.angle += delta;
        angle.setValue(s.angle);
      },
      onPanResponderRelease: () => {
        const s = gesture.current;
        // eslint-disable-next-line react-hooks/purity
        s.releasedAt = Date.now();
        // 빈 곳 탭 → 팝오버 닫기
        if (!s.moved) {
          setSelected(null);
          onInteractRef.current?.();
        }
      },
    });
  }, [angle]);

  const onSelect = (node: WheelNode) => {
    // 웹: 이름을 잡고 돌리면 손을 뗄 때 같은 이름에 click 이 발생 → 무시
    const s = gesture.current;
    if (s.moved && Date.now() - s.releasedAt < 300) return;
    onInteract?.();
    setSelected((cur) => (cur?.node.key === node.key ? null : { node, angle: s.angle }));
  };

  const popover = selected ? popoverPosition(selected, cx, size, bottomInset) : null;
  const rotate = angle.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'], extrapolate: 'extend' });

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
        rootRef.current?.measureInWindow((x, y) => {
          gesture.current.origin = { x: x + width / 2, y: y + CENTER_Y };
        });
      }}
      {...responder.panHandlers}
    >
      {/* Figma "Me" — 분홍 원(blur 포함 102) + "Me" + 내 이름. 돌지 않음 */}
      <Image
        pointerEvents="none"
        source={require('../../../assets/figma/home/me-circle.svg')}
        style={[styles.meCircle, { left: cx - 51 }]}
      />
      <View pointerEvents="none" style={[styles.center, { left: cx - 60 }]}>
        <Text style={styles.me}>Me</Text>
        <Text numberOfLines={1} style={styles.myName}>
          {firstName}
        </Text>
      </View>

      {/* Figma "연결선" — 동심원이라 돌려도 같은 모습. 중심이 3px 위라 회전 레이어 밖에 고정 */}
      {RING_LINES.map((line) => (
        <Image
          key={line.size}
          pointerEvents="none"
          source={line.source}
          style={{
            position: 'absolute',
            width: line.svg,
            height: line.svg,
            left: cx - line.svg / 2,
            top: CENTER_Y + RING_LINE_CY - line.svg / 2,
            opacity: line.opacity,
          }}
        />
      ))}

      <Animated.View
        pointerEvents="box-none"
        style={[styles.layer, { left: cx - HALF, top: CENTER_Y - HALF, transform: [{ rotate }] }]}
      >
        {RINGS_BOTTOM_UP.map((ring) => (
          <RingNodes key={ring.id} ring={ring} onSelect={onSelect} />
        ))}
      </Animated.View>

      {overlay}

      {selected && popover ? (
        <HelpActivityPopover
          stats={mockStats(selected.node)}
          left={popover.left}
          top={popover.top}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </View>
  );
}

// 누른 이름의 현재(돌아간) 화면 위치에 카드를 덮어 띄움
function popoverPosition({ node, angle }: Selected, cx: number, size: { width: number; height: number }, bottomInset: number) {
  const rad = (angle * Math.PI) / 180;
  const px = cx + node.x * Math.cos(rad) - node.y * Math.sin(rad);
  const py = CENTER_Y + node.x * Math.sin(rad) + node.y * Math.cos(rad);
  return {
    left: clamp(px + POPOVER_DX, 8, size.width - POPOVER_WIDTH - 8),
    top: clamp(py + POPOVER_DY, 8, size.height - bottomInset - POPOVER_HEIGHT - 8),
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), Math.max(min, max));
}

type RingNodesProps = {
  ring: Ring;
  onSelect: (node: WheelNode) => void;
};

// 링 하나의 이름들 — 흐린 원을 먼저 깔고 그 위에 이름 (Figma 레이어 순서)
const RingNodes = memo(function RingNodes({ ring, onSelect }: RingNodesProps) {
  const st = ringStyle(ring.id);
  return (
    <>
      {ring.nodes.map((node) => (
        <Image
          key={`dot-${node.key}`}
          pointerEvents="none"
          source={st.dot}
          style={{
            position: 'absolute',
            width: st.dotSvg,
            height: st.dotSvg,
            left: HALF + node.x - st.dotSvg / 2,
            top: HALF + node.y - st.dotSvg / 2,
            opacity: st.dotOpacity,
          }}
        />
      ))}
      {ring.nodes.map((node) => (
        <Pressable
          key={node.key}
          accessibilityRole="button"
          accessibilityLabel={node.name}
          onPress={() => onSelect(node)}
          style={[
            styles.name,
            { left: HALF + node.x - NAME_W / 2, top: HALF + node.y - NAME_H / 2, transform: [{ rotate: `${node.rotate}deg` }] },
          ]}
        >
          {/* 웹: 글자 선택이 돌리기 제스처를 끊지 않도록 터치는 Pressable 만 받음 */}
          <Text
            pointerEvents="none"
            selectable={false}
            numberOfLines={1}
            style={{ fontFamily: st.font, fontSize: st.fontSize, lineHeight: st.lineHeight, color: st.color, textAlign: 'center' }}
          >
            {node.name}
          </Text>
        </Pressable>
      ))}
    </>
  );
});

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  meCircle: { position: 'absolute', top: CENTER_Y - 51, width: 102, height: 102 },
  // "Me" 텍스트 top: 휠 중심 −34 (Caption 2/R 11/14), 내 이름: 휠 중심 +1 을 가운데로 (Headline 2/B 17/20)
  center: { position: 'absolute', top: CENTER_Y - 34, width: 120, alignItems: 'center' },
  me: { fontFamily: fonts.robotoRegular, fontSize: 11, lineHeight: 14, color: colors.accentPinkHeavy },
  myName: { fontFamily: fonts.robotoBold, fontSize: 17, lineHeight: 20, color: colors.primary, marginTop: 11, marginLeft: -1 },
  layer: { position: 'absolute', width: LAYER, height: LAYER },
  name: { position: 'absolute', width: NAME_W, height: NAME_H, alignItems: 'center', justifyContent: 'center' },
});
