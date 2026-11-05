import { Image } from '@/components/Image';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';
import { breakAll, wa, waText } from './theme';

// Figma "채팅 영역" 상단 — 날짜 / 안전 메시지 / 비즈니스 계정 프로필
export function ChatIntro() {
  return (
    <>
      <View style={styles.date}>
        <Text style={[typography.label1Medium, styles.dateText]}>Wednesday, November 4</Text>
      </View>

      <View style={styles.safety}>
        <Text style={[waText.label2Regular, styles.safetyText]}>
          This business uses Sálvate&apos;s secure service to manage this chat. Tap to learn more.
        </Text>
      </View>

      <View style={styles.profile}>
        {/* Figma 메모 "로고 빼고" — 로고 없이 Ellipse 140 원만 둔다 (Figma에 같은 원이 2겹이라 1개만 그림) */}
        <Image source={require('../../../assets/figma/whatsapp/avatar-profile.svg')} style={styles.profileAvatar} />
        <View style={styles.profileName}>
          <Text style={[waText.headline2Medium, styles.strong]}>Sálvate</Text>
          <Image source={require('../../../assets/figma/whatsapp/badge-profile.svg')} style={styles.profileBadge} />
        </View>
        <Text style={[waText.body2Reading, styles.profileMeta]}>Business account · Joined in October 2026</Text>
        <View style={styles.manage}>
          <Text style={[waText.headline2Medium, styles.manageText]}>Manage messages</Text>
        </View>
      </View>
    </>
  );
}

// Figma "채팅" — 비즈니스 계정이 보낸 인증 안내 메시지
export function BotMessage() {
  return (
    <View style={styles.bot}>
      <Image source={require('../../../assets/figma/whatsapp/bubble-in.svg')} style={styles.botBubble} />
      <Text style={[waText.headline2Medium, styles.strong, styles.botTitle]}>Verify your Sálvate account</Text>
      <Text style={[waText.body1Regular, styles.strong, styles.botBody]}>
        Welcome to Sálvate! To complete your identity verification, please send the pre-filled verification message
        below. Once verified, you can return to Sálvate to continue setting up your account.
      </Text>
      <Text style={[waText.caption1Regular, styles.time, styles.botTime]}>09:36 am</Text>
    </View>
  );
}

// Figma "채팅" — 내가 보낸 초록 말풍선 (시간 + 읽음 체크)
export function OutgoingMessage({ text, time }: { text: string; time: string }) {
  return (
    <View style={styles.out}>
      {/* Figma에서 Union을 좌우 반전(rotate 180 + flip Y)해서 꼬리를 오른쪽에 둠 */}
      <Image source={require('../../../assets/figma/whatsapp/bubble-out.svg')} style={styles.outBubble} />
      <Text style={[waText.body1Regular, breakAll, styles.outText]}>{text}</Text>
      <Text style={[waText.caption1Regular, styles.time, styles.outTime]}>{time}</Text>
      <Image source={require('../../../assets/figma/whatsapp/ticks.svg')} style={styles.ticks} />
    </View>
  );
}

const styles = StyleSheet.create({
  strong: { color: colors.labelStrong },
  time: { position: 'absolute', width: 60, textAlign: 'center', color: colors.labelNeutral },

  date: {
    alignSelf: 'center',
    height: 17,
    marginTop: 35,
    paddingHorizontal: 6,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: wa.bubbleBorder,
    borderRadius: radius.m,
    backgroundColor: colors.surfaceNormal,
  },
  dateText: { color: colors.black, textAlign: 'center' },

  safety: {
    alignSelf: 'center',
    width: 279,
    height: 48,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: wa.bubbleBorder,
    borderRadius: radius.s,
    backgroundColor: wa.safetyNotice,
  },
  safetyText: { width: 277, textAlign: 'center', color: colors.labelNormal },

  profile: {
    alignSelf: 'center',
    width: 341,
    height: 268,
    marginTop: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: wa.bubbleBorder,
    borderRadius: 24,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  profileAvatar: { width: 90, height: 90, marginTop: 12 },
  profileName: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 20, marginTop: 35 },
  profileBadge: { width: 20, height: 20 },
  profileMeta: { marginTop: 13, textAlign: 'center', color: colors.labelNeutral },
  manage: {
    width: 300,
    height: 52,
    marginTop: 6,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.backgroundAlternative,
  },
  manageText: { color: colors.labelNormal, textAlign: 'center' },

  bot: { width: 293, height: 189, marginTop: 13, marginLeft: 10 },
  botBubble: { position: 'absolute', left: 0.7, top: 1, width: 291.287, height: 182 },
  botTitle: { position: 'absolute', left: 19, top: 15, width: 247 },
  botBody: { position: 'absolute', left: 19, top: 39, width: 262 },
  botTime: { left: 226, top: 154 },

  // 말풍선 101px + 다음 말풍선까지 17px (Figma 두 말풍선 top 차이 118)
  out: { alignSelf: 'flex-end', width: 293, height: 118, marginRight: 10 },
  outBubble: { position: 'absolute', left: 1, top: 1, width: 291, height: 111.304, transform: [{ scaleX: -1 }] },
  outText: { position: 'absolute', left: 15, top: 15, width: 262, color: colors.labelNormal },
  outTime: { left: 194, top: 91 },
  ticks: { position: 'absolute', left: 252, top: 88, width: 21, height: 21 },
});
