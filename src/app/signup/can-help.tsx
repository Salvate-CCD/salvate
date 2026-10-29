import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { TopicGrid } from '@/components/TopicGrid';
import { useSignup } from '@/state/signup';
import { colors, fonts } from '@/theme/tokens';

const MIN_TOPICS = 3;

// Figma "회원가입 - 프로필 생성 - 줄 수 있는 도움 선택" + 제출 확인 모달
export default function CanHelp() {
  const { draft, update } = useSignup();
  const [selected, setSelected] = useState(draft.canHelp);
  const [confirm, setConfirm] = useState<string[] | null>(null);

  const submit = () => {
    if (!confirm) return;
    update({ canHelp: confirm });
    setConfirm(null);
    // TODO: 서버에 가입 신청 전송
    router.push('/signup/submitted');
  };

  return (
    <Screen>
      <ProgressBar total={4} current={4} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <TitleBlock
          title={'Select areas\nyou can help with'}
          description={'Choose 3 or more topics.\nWe’ll find the right match for you!'}
          style={styles.title}
        />
        <TopicGrid selected={selected} onChange={setSelected} />
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setConfirm([])} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.actions}>
        <Button label="Back" variant="ghost" style={styles.flex} onPress={() => router.back()} />
        <Button
          label="Next"
          style={styles.flex}
          disabled={selected.length < MIN_TOPICS}
          onPress={() => setConfirm(selected)}
        />
      </View>

      <Dialog
        visible={confirm !== null}
        title="Submit your application?"
        message="Your profile will be reviewed. You can edit your help preferences later, but not your name or gender."
        confirmLabel="Submit"
        onCancel={() => setConfirm(null)}
        onConfirm={submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 20 },
  title: { marginTop: 19, paddingBottom: 41 },
  skip: { alignSelf: 'center', marginTop: 24 },
  skipText: {
    fontFamily: fonts.robotoRegular,
    fontSize: 13,
    lineHeight: 16,
    color: colors.labelNeutral,
    textDecorationLine: 'underline',
  },
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22 },
});
