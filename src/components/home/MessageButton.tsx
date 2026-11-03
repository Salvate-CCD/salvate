import { Image } from 'expo-image';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { isChatRemoved } from '@/components/chat/removedChats';
import { colors, fonts } from '@/theme/tokens';

type Conversation = { name: string; title: string; unread: boolean };

// Figma "Message List" 예시 대화 (서버 연동 전 임시 데이터)
const CONVERSATIONS: Conversation[] = [
  { name: 'Maria', title: 'Need a Ride to the Hospital', unread: true },
  { name: 'Iglesia Nueva Esperanza', title: 'Free Essential Supplies for Families', unread: false },
  { name: 'Jimena', title: 'Need Someone to Watch My Child Tomorrow', unread: false },
];

type Props = {
  /** 목록이 열린 상태 (Figma property "Tap-Defaut") — 아이콘이 X 로 바뀌고 위에 대화 목록이 뜸 */
  open?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

// Figma "Button/Action Button/Message" (56×56) — 반투명 원 + 흰 테두리 + 아이콘 + 분홍 알림 점
export function MessageButton({ open = false, onPress, style }: Props) {
  return (
    <View style={[styles.root, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? 'Close messages' : 'Messages'}
        accessibilityState={{ expanded: open }}
        onPress={onPress}
        style={StyleSheet.absoluteFill}
      >
        <Image source={require('../../../assets/figma/home/message-ellipse.svg')} style={styles.fill} />
        <Image source={require('../../../assets/figma/home/message-stroke.svg')} style={styles.fill} />
        {open ? (
          // icons/Character/close
          <Image source={require('../../../assets/figma/home/message-close.svg')} style={styles.icon} />
        ) : (
          <>
            {/* icons/Communicate/message-emoji */}
            <Image source={require('../../../assets/figma/home/message-icon.svg')} style={styles.icon} />
            {/* alert: inset 12.5% -3.57% 66.07% 82.14% → (46, 7) 12×12. 열린 상태에서는 숨김 */}
            <Image source={require('../../../assets/figma/home/message-alert.svg')} style={styles.alert} />
          </>
        )}
      </Pressable>
      {open ? <MessageList /> : null}
    </View>
  );
}

// Figma "Message List" 138×162 — 버튼 기준 (-82, -170). 안쪽 114×138 영역이 세로 스크롤
function MessageList() {
  return (
    <View style={styles.list}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {CONVERSATIONS.filter((c) => !isChatRemoved(c.name)).map((c, i) => (
          <Fragment key={c.name}>
            {i > 0 ? (
              <Image source={require('../../../assets/figma/home/message-list-divider.svg')} style={styles.divider} />
            ) : null}
            {/* 항목을 눌렀을 때의 동작은 아직 디자인이 없음 */}
            <View style={styles.item}>
              <View style={styles.nameRow}>
                <Text numberOfLines={1} style={styles.name}>
                  {c.name}
                </Text>
                {c.unread ? (
                  <Image source={require('../../../assets/figma/home/message-list-alert.svg')} style={styles.unread} />
                ) : null}
              </View>
              <Text numberOfLines={2} style={styles.title}>
                {c.title}
              </Text>
            </View>
          </Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: 56, height: 56 },
  fill: { position: 'absolute', left: 0, top: 0, width: 56, height: 56 },
  icon: { position: 'absolute', left: 10, top: 10, width: 36, height: 36 },
  alert: { position: 'absolute', left: 46, top: 7, width: 12, height: 12 },
  // Shadow/Nuetral/02: Figma 효과 반지름 8 / 16 #00000014 → CSS blur 4 / 8
  list: {
    position: 'absolute',
    left: -82,
    top: -170,
    width: 138,
    height: 162,
    borderRadius: 12,
    backgroundColor: colors.white,
    boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
  },
  scroll: { position: 'absolute', left: 12, top: 12, width: 114, height: 138 },
  divider: { width: 114, height: 1, marginVertical: 8 },
  item: { width: 114 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 2 },
  // Body 2/Normal/M 15/17, Label/Strong
  name: {
    flexShrink: 1,
    maxWidth: 104,
    fontFamily: fonts.robotoMedium,
    fontSize: 15,
    lineHeight: 17,
    color: colors.labelStrong,
  },
  unread: { width: 8, height: 8 },
  // Caption 1/R 12/15, Label/Normal — 두 줄(30)까지
  title: {
    width: 114,
    height: 30,
    fontFamily: fonts.robotoRegular,
    fontSize: 12,
    lineHeight: 15,
    color: colors.labelNormal,
  },
});
