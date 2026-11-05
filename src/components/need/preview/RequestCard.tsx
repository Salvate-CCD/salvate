import { Image, type ImageSource } from '@/components/Image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, insetGlow, radius, typography } from '@/theme/tokens';
import type { HelpRequest, Urgency } from './mockRequest';

// Figma 의 라벨 아이콘 뒤에 깔린 흐린 "초록색 원" / "분홍색 원" (blur 포함 SVG 이므로 SVG 크기·위치 그대로)
type Deco = { source: ImageSource; left: number; top: number; width: number; height: number };

const LABELS = {
  time: {
    icon: require('../../../../assets/figma/need/preview/icon-time.svg'),
    decos: [
      { source: require('../../../../assets/figma/need/preview/time-green.svg'), left: -2, top: -1.85, width: 20, height: 20 },
      { source: require('../../../../assets/figma/need/preview/pink-dot.svg'), left: 7, top: 6.15, width: 8, height: 8 },
    ],
  },
  date: {
    icon: require('../../../../assets/figma/need/preview/icon-calendar-dot.svg'),
    decos: [
      { source: require('../../../../assets/figma/need/preview/date-green.svg'), left: -2, top: 0.15, width: 20, height: 19 },
      { source: require('../../../../assets/figma/need/preview/date-pink.svg'), left: -1, top: -0.85, width: 18, height: 8 },
    ],
  },
  pickup: {
    icon: require('../../../../assets/figma/need/preview/icon-local-two.svg'),
    decos: [
      { source: require('../../../../assets/figma/need/preview/pickup-green.svg'), left: 0, top: -1.85, width: 16, height: 19 },
      { source: require('../../../../assets/figma/need/preview/pickup-pink.svg'), left: 6, top: 4.15, width: 4, height: 4 },
    ],
  },
  dropoff: {
    icon: require('../../../../assets/figma/need/preview/icon-pennant.svg'),
    decos: [
      { source: require('../../../../assets/figma/need/preview/dropoff-green.svg'), left: -1, top: -0.85, width: 17, height: 12 },
      { source: require('../../../../assets/figma/need/preview/pink-dot.svg'), left: 0, top: 10.15, width: 8, height: 8 },
    ],
  },
} satisfies Record<string, { icon: ImageSource; decos: Deco[] }>;

// Figma "Badge/Urgency Badge" 색 — Primitive/Red·Yellow 50 배경 + 500 글자.
// High / Low 배지는 아직 디자인이 없어 Give 탭 색(Red/300, Status/Positive)을 따름
const URGENCY_TONE: Record<Urgency, { bg: string; fg: string }> = {
  Critical: { bg: '#FBE6E6', fg: colors.statusNegative },
  High: { bg: '#FBE6E6', fg: '#E75454' },
  Moderate: { bg: '#FFFAE5', fg: '#CBA60E' },
  Low: { bg: colors.secondaryBackground, fg: colors.statusPositive },
};
const TAG_TONE = URGENCY_TONE.Critical;

// Figma "Card/AI Results" (type=장소 2개일때 / 장소 1개일때)
export function RequestCard({ request }: { request: HelpRequest }) {
  const { places } = request;
  return (
    <View style={styles.card}>
      <View style={styles.tags}>
        <View style={styles.field}>
          <Text style={styles.caption}>Urgency Level</Text>
          <Badge label={request.urgency} tone={URGENCY_TONE[request.urgency]} />
        </View>
        <View style={styles.field}>
          <Text style={styles.caption}>Help Category</Text>
          <Text style={styles.value}>{request.category}</Text>
        </View>
      </View>

      <View style={styles.description}>
        {/* Figma "Button/Box Button" (Read) — 읽어주기 동작은 디자인에 없음 */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Read"
          onPress={() => {
            // TODO: "Read"(소리내어 읽기) 동작 — Figma 에 후속 상태가 없음
          }}
          style={({ pressed }) => [styles.read, pressed && { opacity: 0.85 }]}
        >
          <Image source={require('../../../../assets/figma/need/preview/icon-volume-notice.svg')} style={styles.readIcon} />
          <Text style={styles.readLabel}>Read</Text>
        </Pressable>
        <View style={styles.text}>
          <Text style={styles.title}>{request.title}</Text>
          <Text style={styles.body}>{request.body}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.field}>
          <Label kind="time" text="Time" />
          <View style={styles.data}>
            {request.time.tag ? <Badge label={request.time.tag} tone={TAG_TONE} /> : null}
            <Text style={styles.value}>{request.time.value}</Text>
          </View>
        </View>
        <View style={styles.field}>
          <Label kind="date" text="Date" />
          <View style={styles.data}>
            {request.date.tag ? <Badge label={request.date.tag} tone={TAG_TONE} /> : null}
            <Text style={styles.value}>{request.date.value}</Text>
          </View>
        </View>
        {'location' in places ? (
          <View style={styles.field}>
            <Label kind="pickup" text="Location" />
            <Text style={styles.value}>{places.location}</Text>
          </View>
        ) : (
          <>
            <View style={styles.field}>
              <Label kind="pickup" text="Pickup Location" />
              <Text style={styles.value}>{places.pickup}</Text>
            </View>
            <View style={styles.field}>
              <Label kind="dropoff" text="Drop-off Location" />
              <Text style={styles.value}>{places.dropoff}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

// Figma "Badge/Urgency Badge"
function Badge({ label, tone }: { label: string; tone: { bg: string; fg: string } }) {
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Text style={[styles.badgeLabel, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

function Label({ kind, text }: { kind: keyof typeof LABELS; text: string }) {
  const { icon, decos } = LABELS[kind];
  return (
    <View style={styles.label}>
      {decos.map((d, i) => (
        <Image
          key={i}
          source={d.source}
          style={{ position: 'absolute', left: d.left, top: d.top, width: d.width, height: d.height }}
        />
      ))}
      <Image source={icon} style={styles.labelIcon} />
      <Text style={styles.caption}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    paddingTop: 36,
    paddingBottom: 44,
    paddingHorizontal: 20,
    gap: 36,
    borderRadius: 24, // shape/radius/3xl
    backgroundColor: colors.surfaceNormal,
    boxShadow: '0px 0px 8px 0px #FFFFFF, 0px 0px 22px 0px rgba(0, 0, 0, 0.12)',
  },
  tags: { gap: 20, alignItems: 'flex-start' },
  field: { gap: 4, alignItems: 'flex-start' },
  // Label/Label 2/M
  caption: { fontFamily: fonts.robotoMedium, fontSize: 13, lineHeight: 16, color: colors.labelAlternative },
  // Body/Body 1/Normal/M
  value: { ...typography.body1Medium, color: colors.labelNormal },
  badge: {
    height: 23,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  badgeLabel: { ...typography.body1Medium, textAlign: 'center' },
  description: { gap: 16, alignSelf: 'stretch', alignItems: 'flex-start' },
  read: {
    height: 32,
    paddingHorizontal: 8,
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xs,
    backgroundColor: colors.primary,
    boxShadow: insetGlow.solid,
  },
  readIcon: { width: 14, height: 14 },
  readLabel: { fontFamily: fonts.robotoMedium, fontSize: 13, lineHeight: 16, color: colors.white, textAlign: 'center' },
  text: { gap: 8, alignSelf: 'stretch' },
  // Heading/Heading 2/B
  title: { fontFamily: fonts.robotoBold, fontSize: 20, lineHeight: 24, color: colors.labelStrong },
  // Body/Body 2/Reading/R
  body: { fontFamily: fonts.robotoRegular, fontSize: 15, lineHeight: 20, color: colors.labelNormal },
  details: { gap: 36, alignSelf: 'stretch' },
  data: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  labelIcon: { width: 16, height: 16 },
});
