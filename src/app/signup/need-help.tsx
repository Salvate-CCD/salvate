import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { TopicGrid } from '@/components/TopicGrid';
import { useSignup } from '@/state/signup';
import { colors, fonts } from '@/theme/tokens';

const MIN_TOPICS = 3;

// Figma "회원가입 - 프로필 생성 - 선호도움 선택" — 도움 받고 싶은 분야 선택 (3개 이상)
export default function NeedHelp() {
  const { draft, update } = useSignup();
  const [selected, setSelected] = useState(draft.needHelp);

  const next = (topics: string[]) => {
    update({ needHelp: topics });
    router.push('/signup/can-help');
  };

  return (
    <Screen>
      <ProgressBar total={4} current={3} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <TitleBlock
          title={'Select areas\nyou need help with'}
          description={'Choose 3 or more topics.\nWe’ll find the right match for you!'}
          style={styles.title}
        />
        <TopicGrid selected={selected} onChange={setSelected} />
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => next([])} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.actions}>
        <Button label="Back" variant="ghost" style={styles.flex} onPress={() => router.back()} />
        <Button label="Next" style={styles.flex} disabled={selected.length < MIN_TOPICS} onPress={() => next(selected)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 20 },
  // Figma: Pagination(y54~60) → Title & Description(y79)
  title: { marginTop: 19, paddingBottom: 41 },
  skip: { alignSelf: 'center', marginTop: 24 },
  // Figma "Label/Label 2/R" + underline
  skipText: {
    fontFamily: fonts.robotoRegular,
    fontSize: 13,
    lineHeight: 16,
    color: colors.labelNeutral,
    textDecorationLine: 'underline',
  },
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22 },
});
