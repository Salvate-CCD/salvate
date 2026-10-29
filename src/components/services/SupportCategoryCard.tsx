import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius } from '@/theme/tokens';

// 아이콘 뒤 흐린 색 덩어리 — Figma 카드(110×110) 기준 SVG 중심 좌표, 회전
type Blob = { src: ImageSource; w: number; h: number; cx: number; cy: number; rotate?: number };

export type SupportCategory = {
  key: string;
  label: string;
  icon: ImageSource;
  iconSize: number;
  blobs: Blob[];
};

// Figma "Card/Support Category" 8종 (레이어 순서·좌표 그대로)
export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    key: 'food',
    label: 'Food &\nLiving',
    icon: require('../../../assets/figma/services/icon-food.svg'), // icons/Foods/bowl-one
    iconSize: 32,
    blobs: [
      { src: require('../../../assets/figma/services/blob-food-1.svg'), w: 24, h: 24, cx: 55, cy: 29 },
      { src: require('../../../assets/figma/services/blob-food-2.svg'), w: 30, h: 23, cx: 55, cy: 40.5 },
    ],
  },
  {
    key: 'legal',
    label: 'Legal\nHelp',
    icon: require('../../../assets/figma/services/icon-legal.svg'), // icons/Others/gavel
    iconSize: 32,
    blobs: [
      { src: require('../../../assets/figma/services/blob-legal-1.svg'), w: 24, h: 13, cx: 50, cy: 45.5 },
      { src: require('../../../assets/figma/services/blob-legal-2.svg'), w: 28.2883, h: 15.8276, cx: 57.82, cy: 33.07, rotate: 26.81 },
    ],
  },
  {
    key: 'medical',
    label: 'Medical &\nCounseling',
    icon: require('../../../assets/figma/services/icon-medical.svg'), // icons/Health/nurse-cap
    iconSize: 32,
    blobs: [{ src: require('../../../assets/figma/services/blob-medical.svg'), w: 30, h: 23, cx: 54.15, cy: 34.72, rotate: -1.14 }],
  },
  {
    key: 'education',
    label: 'Education\n& Jobs',
    icon: require('../../../assets/figma/services/icon-education.svg'), // icons/Office/book-open
    iconSize: 32,
    blobs: [{ src: require('../../../assets/figma/services/blob-education.svg'), w: 30, h: 27, cx: 55, cy: 33.5 }],
  },
  {
    key: 'rides',
    label: 'Rides &\nTransport',
    icon: require('../../../assets/figma/services/icon-rides.svg'), // icons/Hardware/car
    iconSize: 32,
    blobs: [
      { src: require('../../../assets/figma/services/blob-rides-1.svg'), w: 24, h: 16, cx: 55, cy: 31 },
      { src: require('../../../assets/figma/services/blob-rides-2.svg'), w: 35.8341, h: 19.244, cx: 55.18, cy: 38.98, rotate: 1.9 },
    ],
  },
  {
    key: 'rights',
    label: 'Know Your\nRights',
    icon: require('../../../assets/figma/services/icon-rights.svg'), // icons/Office/security
    iconSize: 28,
    blobs: [{ src: require('../../../assets/figma/services/blob-rights.svg'), w: 29.3333, h: 29.3333, cx: 55, cy: 34 }],
  },
  {
    key: 'housing',
    // Figma 문구 "Hosuing" 은 오타 → Housing
    label: 'Housing\n& Shelter',
    icon: require('../../../assets/figma/services/icon-housing.svg'), // icons/Build/home-two
    iconSize: 32,
    blobs: [
      { src: require('../../../assets/figma/services/blob-housing-1.svg'), w: 21, h: 16, cx: 55, cy: 42.5, rotate: 90 },
      { src: require('../../../assets/figma/services/blob-housing-2.svg'), w: 20.4971, h: 18.9786, cx: 55.26, cy: 30.51, rotate: -0.16 },
      { src: require('../../../assets/figma/services/blob-housing-3.svg'), w: 13.5326, h: 25.3129, cx: 47.79, cy: 39.66, rotate: -0.16 },
      { src: require('../../../assets/figma/services/blob-housing-3.svg'), w: 13.5326, h: 25.3129, cx: 61.79, cy: 39.66, rotate: -0.16 },
    ],
  },
  {
    key: 'other',
    label: 'Other',
    icon: require('../../../assets/figma/services/icon-other.svg'), // icons/Base/more
    iconSize: 32,
    blobs: [],
  },
];

const FIGMA_CARD = 110;

type Props = { category: SupportCategory; size: number; onPress: () => void };

// Figma "Card/Support Category" — 흰 카드 + 아이콘(뒤에 흐린 색 덩어리) + 두 줄 라벨
export function SupportCategoryCard({ category, size, onPress }: Props) {
  // 카드 내용은 가운데 정렬이므로, Figma 110 카드 기준 좌표를 실제 카드 크기만큼 가운데로 옮김
  const shift = (size - FIGMA_CARD) / 2;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={category.label.replace('\n', ' ')}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { width: size, height: size }, pressed && { opacity: 0.85 }]}
    >
      {category.blobs.map((b, i) => (
        <Image
          key={i}
          pointerEvents="none"
          source={b.src}
          style={{
            position: 'absolute',
            left: b.cx - b.w / 2 + shift,
            top: b.cy - b.h / 2 + shift,
            width: b.w,
            height: b.h,
            transform: b.rotate ? [{ rotate: `${b.rotate}deg` }] : undefined,
          }}
        />
      ))}
      <Image source={category.icon} style={{ width: category.iconSize, height: category.iconSize }} />
      <Text style={styles.label}>{category.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
    borderRadius: radius.l,
    backgroundColor: colors.surfaceNormal,
    // Figma "Shadow/Nuetral/01": 0 0 16(blur) #00000014
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
  },
  // Figma "Label/Label 2/M" 13/16
  label: { fontFamily: fonts.robotoMedium, fontSize: 13, lineHeight: 16, color: colors.labelNormal, textAlign: 'center' },
});
