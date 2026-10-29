import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ApprovalLockScreen } from '@/components/ApprovalLockScreen';
import { ApprovedSheet } from '@/components/ApprovedSheet';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { Screen } from '@/components/Screen';
import { openWhatsAppVerification } from '@/lib/whatsapp';
import { isAccountApproved, markAccountApproved } from '@/state/account';

// Figma "회원가입/로그인" 첫 화면 — WhatsApp 로그인 / 회원가입 진입
//
// 로그인 프로토타입 흐름:
//  1) 아직 승인 전이면 로그인 버튼 → "회원 승인" 잠금화면(푸시 알림)이 위에서 내려옴
//  2) 알림 터치 → "Your account is approved!" 시트 → OK → 랜딩
//  3) 승인 후 로그인 버튼 → "Open WhatsApp?" → WhatsApp 인증
export default function Welcome() {
  const [confirmLogin, setConfirmLogin] = useState(false);
  const [showLockScreen, setShowLockScreen] = useState(false);
  // 승인 알림(salvate://welcome?approved=1)으로 들어오면 승인 안내 시트를 띄움
  const { approved } = useLocalSearchParams<{ approved?: string }>();
  const [showApproved, setShowApproved] = useState(approved === '1');

  const onLoginPress = () => {
    if (isAccountApproved()) setConfirmLogin(true);
    else setShowLockScreen(true);
  };

  const onNotificationOpen = () => {
    setShowLockScreen(false);
    setShowApproved(true);
  };

  const onApprovedClose = () => {
    markAccountApproved();
    setShowApproved(false);
  };

  const login = () => {
    setConfirmLogin(false);
    openWhatsAppVerification('login');
  };

  return (
    <Screen>
      {/* TODO: 로고 — Figma 메모 "로고 넣어야 함". 로고 에셋이 확정되면 이 영역에 배치 */}
      <View style={styles.logoArea} />

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

      <ApprovalLockScreen visible={showLockScreen} onOpenNotification={onNotificationOpen} />
      <ApprovedSheet visible={showApproved} onClose={onApprovedClose} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoArea: { flex: 1 },
  actions: { paddingHorizontal: 20, paddingBottom: 22, gap: 10 },
});
