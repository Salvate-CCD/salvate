import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ApprovalLockScreen } from '@/components/ApprovalLockScreen';
import { ApprovedSheet } from '@/components/ApprovedSheet';
import { Button } from '@/components/Button';
import { HELP_PUSH_MS } from '@/components/chat/contacts';
import { Dialog } from '@/components/Dialog';
import { Logo } from '@/components/Logo';
import { Screen } from '@/components/Screen';
import { openWhatsAppVerification } from '@/lib/whatsapp';
import { clearApprovalPush, hasApprovalPush } from '@/state/account';

// Figma "회원가입/로그인" 첫 화면 — WhatsApp 로그인 / 회원가입 진입
//
// 프로토타입 흐름:
//  1) 가입 신청 후 돌아오면 몇 초 뒤 "회원 승인" 잠금화면(푸시 알림)이 위에서 내려옴. 승인 대기 중 로그인 버튼을 눌러도 바로 뜸
//  2) 알림 터치 → "Your account is approved!" 시트 → OK → 랜딩
//  3) 로그인 버튼 → "Open WhatsApp?" → WhatsApp 인증 (로그인할 때마다)
export default function Welcome() {
  const [confirmLogin, setConfirmLogin] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  // 승인 알림(salvate://welcome?approved=1)으로 들어오면 승인 안내 시트를 띄움
  const { approved } = useLocalSearchParams<{ approved?: string }>();
  const [showApproved, setShowApproved] = useState(approved === '1');

  const showApprovalPush = useCallback(() => {
    clearApprovalPush();
    setShowLockScreen(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasApprovalPush()) return;
      // 그 사이 로그인 버튼으로 이미 띄웠으면 다시 띄우지 않음
      const t = setTimeout(() => {
        if (hasApprovalPush()) showApprovalPush();
      }, HELP_PUSH_MS);
      return () => clearTimeout(t);
    }, [showApprovalPush]),
  );

  const onLoginPress = () => {
    if (hasApprovalPush()) showApprovalPush();
    else setConfirmLogin(true);
  };

  const onNotificationOpen = () => {
    setShowLockScreen(false);
    setShowApproved(true);
  };

  const login = () => {
    setConfirmLogin(false);
    openWhatsAppVerification('login');
  };

  return (
    <Screen>
      {/* Figma "Logo" — 상태바 아래 ~ 버튼 위 영역 가운데보다 6.5px 위 (프레임 기준 top 278) */}
      <View style={styles.logoArea}>
        <Logo />
      </View>

      <View style={styles.actions}>
        <Button label="Continue with WhatsApp" onPress={onLoginPress} />
        <Button label="Sign Up" variant="ghost" onPress={() => router.push('/signup/invite-code')} />
      </View>

      <Dialog
        visible={confirmLogin}
        title="Open WhatsApp?"
        message="You'll need to open WhatsApp to log in to Sálvate."
        confirmLabel="Open"
        onCancel={() => setConfirmLogin(false)}
        onConfirm={login}
      />

      <ApprovalLockScreen visible={showLockScreen} appearance="help" onOpenNotification={onNotificationOpen} />
      <ApprovedSheet visible={showApproved} onClose={() => setShowApproved(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 13 },
  actions: { paddingHorizontal: 20, paddingBottom: 22, gap: 10 },
});
