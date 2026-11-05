import { Image, type ImageSource } from '@/components/Image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

// Figma "Card/Help Category" 위에 얹힌 흐린 원(Ellipse) 장식.
// x/y는 32px 아이콘 좌상단 기준 위치, 크기는 SVG 원본 width/height.
type Blob = { src: ImageSource; x: number; y: number; w: number; h: number; rotate?: number };

type Topic = {
  id: string;
  label: string;
  icon: ImageSource;
  blobs: Blob[];
  /** 아이콘 위에 그려지는 장식 (Childcare·Delivery의 바퀴 점) */
  overlays?: Blob[];
  /** Figma에서 Delivery·Childcare만 가운데 정렬이 아니라 위에서 19px로 고정돼 있음 */
  alignTop?: boolean;
};

const dot = require('../../assets/figma/topic-dot.svg');
const wheelDots: Blob[] = [
  { src: dot, x: 8.05, y: 22.05, w: 11, h: 11, rotate: 1.9 },
  { src: dot, x: 15.05, y: 22.05, w: 11, h: 11, rotate: 1.9 },
];

export const TOPICS: Topic[] = [
  {
    id: 'grocery',
    label: 'Grocery\nShopping',
    icon: require('../../assets/figma/topic-grocery-icon.svg'),
    blobs: [
      { src: require('../../assets/figma/topic-grocery-ellipse1.svg'), x: 7, y: -1, w: 18, h: 23 },
      { src: require('../../assets/figma/topic-grocery-ellipse2.svg'), x: 0, y: 10, w: 32, h: 23 },
    ],
  },
  {
    id: 'rides',
    label: 'Rides &\nCarpool',
    icon: require('../../assets/figma/topic-rides-icon.svg'),
    blobs: [
      { src: require('../../assets/figma/topic-rides-ellipse1.svg'), x: 4, y: 4, w: 24, h: 16 },
      { src: require('../../assets/figma/topic-rides-ellipse2.svg'), x: -1.74, y: 10.36, w: 35.8341, h: 19.244, rotate: 1.9 },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: require('../../assets/figma/topic-delivery-icon.svg'),
    alignTop: true,
    blobs: [
      { src: require('../../assets/figma/topic-delivery-ellipse1.svg'), x: 3, y: 2, w: 27, h: 17 },
      { src: require('../../assets/figma/topic-delivery-ellipse2.svg'), x: -2.23, y: 8.24, w: 22.4558, h: 21.5288, rotate: 1.9 },
      { src: require('../../assets/figma/topic-delivery-ellipse3.svg'), x: 9.72, y: 8.96, w: 24.1128, h: 21.1071, rotate: -23.31 },
    ],
    overlays: wheelDots,
  },
  {
    id: 'childcare',
    label: 'Childcare',
    icon: require('../../assets/figma/topic-childcare-icon.svg'),
    alignTop: true,
    blobs: [
      { src: require('../../assets/figma/topic-childcare-ellipse1.svg'), x: 14, y: 2, w: 16, h: 17 },
      { src: require('../../assets/figma/topic-childcare-ellipse2.svg'), x: 5.29, y: 11.87, w: 23.6711, h: 14.9383, rotate: 1.9 },
    ],
    overlays: wheelDots,
  },
  {
    id: 'childPickup',
    label: 'Child\nPickup',
    icon: require('../../assets/figma/topic-pickup-icon.svg'),
    blobs: [
      { src: require('../../assets/figma/topic-pickup-ellipse1.svg'), x: 11, y: -1, w: 18, h: 13 },
      { src: require('../../assets/figma/topic-pickup-ellipse2.svg'), x: 4.12, y: 8.77, w: 24.1539, h: 24.9288, rotate: 1.9 },
      { src: require('../../assets/figma/topic-pickup-ellipse3.svg'), x: -1.03, y: 15.19, w: 34.2326, h: 18.5081, rotate: 1.9 },
    ],
  },
  {
    id: 'language',
    label: 'Language\nHelp',
    icon: require('../../assets/figma/topic-language-icon.svg'),
    blobs: [
      { src: require('../../assets/figma/topic-language-ellipse1.svg'), x: 13, y: 10, w: 23, h: 23 },
      { src: require('../../assets/figma/topic-language-ellipse2.svg'), x: -3.65, y: -0.67, w: 28.3825, h: 28.3825, rotate: 1.9 },
    ],
  },
  {
    id: 'legal',
    label: 'Legal\nHelp',
    icon: require('../../assets/figma/topic-legal-icon.svg'),
    blobs: [
      { src: require('../../assets/figma/topic-legal-ellipse1.svg'), x: -1, y: 20, w: 24, h: 13 },
      { src: require('../../assets/figma/topic-legal-ellipse2.svg'), x: 4.67, y: 6.15, w: 28.2883, h: 15.8276, rotate: 26.81 },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    icon: require('../../assets/figma/topic-other-icon.svg'),
    blobs: [],
  },
];

// Figma "Semantic/Primary/Background" — tokens.ts에 아직 없는 값
const PRIMARY_BACKGROUND = '#ECF8F3';
const TILE = 106;
const GAP = 16;

type Props = { selected: string[]; onChange: (next: string[]) => void };

// Figma "Frame 634035" — 3열 도움 주제 선택 그리드 (Card/Help Category × 8)
export function TopicGrid({ selected, onChange }: Props) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <View style={styles.grid}>
      {TOPICS.map((t) => (
        <TopicTile key={t.id} topic={t} selected={selected.includes(t.id)} onPress={() => toggle(t.id)} />
      ))}
    </View>
  );
}

function BlobImage({ b }: { b: Blob }) {
  return (
    <Image
      source={b.src}
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        transform: b.rotate ? [{ rotate: `${b.rotate}deg` }] : undefined,
      }}
    />
  );
}

function TopicTile({ topic, selected, onPress }: { topic: Topic; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={topic.label.replace('\n', ' ')}
      onPress={onPress}
      style={[styles.tile, topic.alignTop && styles.tileTop, selected ? styles.tileSelected : styles.tileDefault]}
    >
      <View style={styles.icon}>
        {topic.blobs.map((b, i) => (
          <BlobImage key={i} b={b} />
        ))}
        <Image source={topic.icon} style={styles.iconImage} />
        {topic.overlays?.map((b, i) => <BlobImage key={i} b={b} />)}
      </View>
      <Text style={styles.label}>{topic.label}</Text>
      {/* 선택 상태의 테두리 + 안쪽 글로우 (Figma에서 별도 오버레이 레이어) */}
      {selected ? <View pointerEvents="none" style={styles.selectedRing} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    width: TILE * 3 + GAP * 2,
    alignSelf: 'center',
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 12,
    padding: 20,
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTop: { justifyContent: 'flex-start', paddingTop: 19, paddingBottom: 0 },
  tileDefault: {
    backgroundColor: colors.surfaceNormal,
    boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.08)',
  },
  tileSelected: {
    backgroundColor: PRIMARY_BACKGROUND,
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.08), 0px 0px 16px 0px rgba(0, 0, 0, 0.08)',
  },
  selectedRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.strokeAlternative,
    boxShadow: `inset 0px 0px 12px 0px ${colors.strokeAlternative}`,
  },
  icon: { width: 32, height: 32 },
  iconImage: { width: 32, height: 32 },
  // Figma "Label/Label 2/M" (13/16)
  label: {
    fontFamily: fonts.robotoMedium,
    fontSize: 13,
    lineHeight: 16,
    color: colors.labelNormal,
    textAlign: 'center',
  },
});
