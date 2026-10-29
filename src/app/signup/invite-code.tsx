import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { openWhatsAppVerification } from '@/lib/whatsapp';
import { useSignup } from '@/state/signup';
import { colors, insetGlow, radius, typography } from '@/theme/tokens';

const CODE_LENGTH = 6;

export default function InviteCode() {
  const { update } = useSignup();
  const input = useRef<TextInputInstance>(null);
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(true);
  const [confirm, setConfirm] = useState(false);

  const complete = code.length === CODE_LENGTH;

  const onContinue = () => {
    input.current?.blur();
    update({ inviteCode: code });
    setConfirm(true);
  };

  const onOpen = () => {
    setConfirm(false);
    openWhatsAppVerification('signup');
  };

  return (
    <Screen background={colors.backgroundAlternative}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Header title="Create an Account" />
        <TitleBlock
          title="Enter your invite code"
          description="Enter the invitation code you received from a friend."
          titleWidth={200}
          descriptionWidth={330}
        />

        <View style={styles.field}>
          <Text style={[typography.label1Medium, styles.label]}>Invitation Code</Text>
          <Pressable
            accessibilityLabel="Invitation Code"
            onPress={() => input.current?.focus()}
            style={styles.boxes}
          >
            {Array.from({ length: CODE_LENGTH }, (_, i) => {
              const digit = code[i];
              const isCursor = focused && i === code.length;
              return (
                <View key={i} style={[styles.box, !digit && styles.boxEmpty]}>
                  <Text style={[typography.body1Medium, styles.digit, isCursor && styles.cursor]}>
                    {digit ?? (isCursor ? '|' : '')}
                  </Text>
                </View>
              );
            })}
          </Pressable>
          <TextInput
            ref={input}
            value={code}
            onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, CODE_LENGTH))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={CODE_LENGTH}
            autoFocus
            caretHidden
            style={styles.hiddenInput}
          />
        </View>

        <View style={styles.flex} />
        <View style={[styles.action, focused && styles.actionAboveKeyboard]}>
          <Button label="Continue" disabled={!complete} onPress={onContinue} />
        </View>
      </KeyboardAvoidingView>

      <Dialog
        visible={confirm}
        title="Open WhatsApp?"
        message="You'll be redirected to WhatsApp to complete verification."
        confirmLabel="Open"
        onCancel={() => setConfirm(false)}
        onConfirm={onOpen}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  field: { paddingHorizontal: 20, gap: 4, marginTop: -4 },
  label: { color: colors.labelAlternative },
  boxes: { flexDirection: 'row', gap: 8 },
  box: {
    flex: 1,
    height: 51.67,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.strokeAlternative,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceNeutral,
  },
  boxEmpty: { boxShadow: insetGlow.field },
  digit: { color: colors.labelStrong, textAlign: 'center' },
  cursor: { color: colors.labelAlternative },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  action: { paddingHorizontal: 20, paddingBottom: 22 },
  // Figma: 키보드가 올라와 있을 때 버튼 하단과 키보드 사이 28px
  actionAboveKeyboard: { paddingBottom: 28 },
});
