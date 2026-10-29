import { Image } from 'expo-image';
import { memo, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { HelpActivityPopover, POPOVER_HEIGHT, POPOVER_WIDTH } from './HelpActivityPopover';
import { MessageButton } from './MessageButton';
import { mockStats, OUTER_RINGS, RING_1, RING_2, ringStyle, type Ring, type WheelNode } from './wheelData';

// Figma 프레임(390 폭, 상태바 47 아래) 기준 휠 중심 — 초록색 원 중심 (195, 424) → 상태바 제외 y 377
const CENTER_X = 195;
const CENTER_Y = 377;
// 링 레이어 크기 — 가장 큰 링(반지름 530) + 카드가 들어가는 정사각형
const LAYER = 1300;
const HALF = LAYER / 2;
// Card/Network Node/Name 의 "frame" (이름 + 눈금선) 크기
const FRAME_W = 78;
const FRAME_H = 37;
// 이 거리 이상 움직이면 탭이 아니라 드래그로 처리
const DRAG_SLOP = 10;

const LINES = {
  ring1: require('../../../assets/figma/home/line-ring1.svg'),
  ring2: require('../../../assets/figma/home/line-ring2.svg'),
  outer: require('../../../assets/figma/home/line-outer.svg'),
};

type Offset = { x: number; y: number };
type Selected = { node: WheelNode; ring: Ring; offset: Offset };

type Props = {
  firstName: string;
  /** 휠 위에 덮이는 레이어 (제목 그라데이션) — 팝오버보다는 아래 */
  overlay?: React.ReactNode;
  /** 화면 하단에서 팝오버가 피해야 할 높이 (내비게이션) */
  bottomInset: number;
  /** 휠 안의 메시지 버튼을 숨김 (도움 요청 게시 직후 홈 — 버튼이 제목 옆에 있는 Figma 1608:33799) */
  hideMessageButton?: boolean;
};

// 끌어서 옮길 수 있는 범위 — 가장 바깥 링(반지름 530) + 카드 여유. 이 밖으로는 휠이 화면에서 사라지지 않게 막음
const REACH = 570;

// Figma "Interaction" > "Names" — 고정된 이름 휠. 회전 없이 손가락으로 끌어서(drag) 둘러봄 + Help Activity 팝오버
export function NameWheel({ firstName, overlay, bottomInset, hideMessageButton }: Props) {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [size, setSize] = useState({ width: 390, height: 763 });
  const [selected, setSelected] = useState<Selected | null>(null);

  // 화면 폭이 390이 아니면 휠을 가로 가운데로
  const cx = size.width / 2;
  const offsetX = cx - CENTER_X;

  const gesture = useRef({ start: { x: 0, y: 0 }, current: { x: 0, y: 0 }, moved: false, releasedAt: 0 });

  const responder = useMemo(() => {
    const limit = {
      minX: -(REACH - (size.width - cx)),
      maxX: REACH - cx,
      minY: -(REACH - (size.height - CENTER_Y)),
      maxY: REACH - CENTER_Y,
    };
    return PanResponder.create({
      // 이름 카드(Pressable)가 먼저 터치를 받고, 빈 곳을 누르면 휠이 받음
      onStartShouldSetPanResponder: () => true,
      // 이름 위에서 시작해도 일정 거리 이상 끌면 드래그로 가로챔
      onMoveShouldSetPanResponderCapture: (_, g) => Math.hypot(g.dx, g.dy) > DRAG_SLOP,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const s = gesture.current;
        s.moved = false;
        s.start = { ...s.current };
      },
      onPanResponderMove: (_, g) => {
        const s = gesture.current;
        if (!s.moved && Math.hypot(g.dx, g.dy) <= DRAG_SLOP) return;
        if (!s.moved) {
          s.moved = true;
          setSelected(null); // 끌기 시작하면 팝오버 닫기
        }
        s.current = {
          x: clamp(s.start.x + g.dx, limit.minX, limit.maxX),
          y: clamp(s.start.y + g.dy, limit.minY, limit.maxY),
        };
        pan.setValue(s.current);
      },
      onPanResponderRelease: () => {
        const s = gesture.current;
        s.releasedAt = Date.now();
        // 빈 곳 탭 → 팝오버 닫기. 손을 떼면 그 자리에 멈춤(관성 없음)
        if (!s.moved) setSelected(null);
      },
    });
  }, [pan, cx, size.width, size.height]);

  const onSelect = (node: WheelNode, ring: Ring) => {
    // 웹: 카드를 잡고 끌면 카드가 손가락을 따라오므로 손을 뗄 때 같은 카드에 click 이 발생 → 무시
    const s = gesture.current;
    if (s.moved && Date.now() - s.releasedAt < 300) return;
    setSelected((cur) => (cur?.node.key === node.key ? null : { node, ring, offset: { ...s.current } }));
  };

  const popover = selected ? popoverPosition(selected, cx, size, bottomInset) : null;

  return (
    <View
      style={styles.root}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
      }}
      {...responder.panHandlers}
    >
      {/* Figma "Names" 프레임 전체(배경 원·가운데 이름·이름 카드·메시지 버튼)가 함께 움직임 */}
      <Animated.View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { transform: pan.getTranslateTransform() }]}>
        {/* Figma "분홍색 원" 312 / "초록색 원" 186 — blur 포함 SVG (400 / 274) */}
        <Image
          pointerEvents="none"
          source={require('../../../assets/figma/home/circle-pink.svg')}
          style={[styles.pink, { left: CENTER_X - 200 + offsetX }]}
        />
        <Image
          pointerEvents="none"
          source={require('../../../assets/figma/home/circle-green.svg')}
          style={[styles.green, { left: CENTER_X - 137 + offsetX }]}
        />
        <View pointerEvents="none" style={[styles.center, { left: cx - 60 }]}>
          <Text style={styles.me}>Me</Text>
          <Text numberOfLines={1} style={styles.myName}>
            {firstName}
          </Text>
        </View>

        {OUTER_RINGS.map((ring) => (
          <RingLayer key={ring.id} ring={ring} cx={cx} onSelect={onSelect} />
        ))}
        <RingLayer ring={RING_2} cx={cx} onSelect={onSelect} />
        {/* Figma 레이어 순서: 두번째 휠 위, 첫번째 휠 아래 */}
        {hideMessageButton ? null : (
          <MessageButton
            style={[styles.message, { left: 232 + offsetX }]}
            onPress={() => {
              // TODO: 메시지 화면 연결
            }}
          />
        )}
        <RingLayer ring={RING_1} cx={cx} onSelect={onSelect} />
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

// Figma 에서 팝오버는 이름 frame 아래(pt 61/57/53)에 붙어 있음
function popoverPosition({ node, ring, offset }: Selected, cx: number, size: { width: number; height: number }, bottomInset: number) {
  const px = cx + ring.cx + node.x + offset.x;
  const py = CENTER_Y + ring.cy + node.y + offset.y;
  const left = px - FRAME_W / 2 - 43; // Card/Network Node 왼쪽 = Name 왼쪽(43) 앞
  const top = py - FRAME_H / 2 + ringStyle(node.ring).popoverOffset;
  return {
    left: clamp(left, 8, size.width - POPOVER_WIDTH - 8),
    top: clamp(top, 8, size.height - bottomInset - POPOVER_HEIGHT - 8),
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), Math.max(min, max));
}

type RingLayerProps = {
  ring: Ring;
  cx: number;
  onSelect: (node: WheelNode, ring: Ring) => void;
};

// 링 하나 = 링 중심 기준 정사각형 레이어 (빈 영역은 터치 통과)
const RingLayer = memo(function RingLayer({ ring, cx, onSelect }: RingLayerProps) {
  return (
    <View pointerEvents="box-none" style={[styles.layer, { left: cx + ring.cx - HALF, top: CENTER_Y + ring.cy - HALF }]}>
      {ring.nodes.map((node) => (
        <NameCard key={node.key} node={node} onPress={() => onSelect(node, ring)} />
      ))}
    </View>
  );
});

// Figma "Card/Network Node/Name" — 이름 + 휠 중심을 향한 눈금선 (카드마다 Figma 각도로 고정)
function NameCard({ node, onPress }: { node: WheelNode; onPress: () => void }) {
  const st = ringStyle(node.ring);
  const len = st.lineLength;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={node.name}
      onPress={onPress}
      style={[
        styles.frame,
        { left: HALF + node.x - FRAME_W / 2, top: HALF + node.y - FRAME_H / 2, transform: [{ rotate: `${node.rotate}deg` }] },
      ]}
    >
      {/* 웹: 글자 선택·이미지 드래그가 끌기 제스처를 끊지 않도록 터치는 카드(Pressable)만 받음 */}
      <Text pointerEvents="none" selectable={false} numberOfLines={1} style={[styles.name, { color: st.color }]}>
        {node.name}
      </Text>
      {/* 눈금선: frame 의 45.95%(17px) 지점부터 아래로 len — 가로 SVG 를 90° 세움 */}
      <Image
        pointerEvents="none"
        source={LINES[st.line]}
        style={{
          position: 'absolute',
          width: len,
          height: 2,
          left: 40 - len / 2,
          top: 17 + len / 2 - 1,
          transform: [{ rotate: '90deg' }],
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  // Names 프레임 좌표 → 화면: 분홍 (381, 403)-226, 초록 (444, 466)-226
  pink: { position: 'absolute', top: 177, width: 400, height: 400 },
  green: { position: 'absolute', top: 240, width: 274, height: 274 },
  // "Me" y 344 (Caption 1/M), 이름 y 361 (Title 2/B)
  center: { position: 'absolute', top: 344, width: 120, alignItems: 'center' },
  me: { fontFamily: fonts.robotoMedium, fontSize: 12, lineHeight: 15, color: colors.labelAlternative, marginLeft: -1 },
  myName: { fontFamily: fonts.robotoBold, fontSize: 24, lineHeight: 26, color: colors.primary, marginTop: 2, marginLeft: -1 },
  message: { position: 'absolute', top: 460 },
  layer: { position: 'absolute', width: LAYER, height: LAYER },
  frame: { position: 'absolute', width: FRAME_W, height: FRAME_H },
  // Caption 1/M 12/15
  name: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: FRAME_W,
    textAlign: 'center',
    fontFamily: fonts.robotoMedium,
    fontSize: 12,
    lineHeight: 15,
  },
});
