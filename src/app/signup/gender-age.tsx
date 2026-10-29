import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AgeGroupSheet } from '@/components/AgeGroupSheet';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TitleBlock } from '@/components/TitleBlock';
import { useSignup, type Gender } from '@/state/signup';
import { colors, typography } from '@/theme/tokens';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

// Figma "회원가입 - 프로필 생성 - 성별/나이"
export default function GenderAge() {
  const { draft, update } = useSignup();
  const [gender, setGender] = useState<Gender | null>(draft.gender);
  const [ageGroup, setAgeGroup] = useState<string | null>(draft.ageGroup);
  const [pickerOpen, setPickerOpen] = useState(false);

  const canContinue = gender !== null && ageGroup !== null;

  const onSelectAge = (value: string) => {
    setAgeGroup(value);
    // 선택 표시(Figma 1608:35392)를 잠깐 보여준 뒤 닫음
    setTimeout(() => setPickerOpen(false), 200);
  };

  const onNext = () => {
    update({ gender, ageGroup });
    router.push('/signup/need-help' as Href);
  };

  return (
    <Screen>
      <ProgressBar total={4} current={2} />
      <TitleBlock
        title="Tell us your gender and age"
        description="Your age and gender help us connect you with the right people."
        titleWidth={330}
        descriptionWidth={350}
        style={styles.title}
      />

      <View style={styles.section}>
        <Text style={[typography.label1Medium, styles.label]}>Gender</Text>
        <View style={styles.genderRow} accessibilityRole="radiogroup">
          {GENDERS.map((g) => (
            <Button
              key={g.value}
              label={g.label}
              size="M"
              variant={gender === g.value ? 'solid' : 'ghost'}
              onPress={() => setGender(g.value)}
              style={styles.flex}
            />
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.age]}>
        <Text style={[typography.label1Medium, styles.label]}>Age</Text>
        <Button
          label={ageGroup ?? 'Select your age group'}
          size="M"
          variant="ghost"
          onPress={() => setPickerOpen(true)}
          right={
            <Image
              source={
                pickerOpen
                  ? require('../../../assets/figma/arrow-up-small.svg')
                  : require('../../../assets/figma/arrow-down.svg')
              }
              style={styles.arrow}
            />
          }
        />
      </View>

      <View style={styles.flex} />
      <View style={styles.actions}>
        <Button label="Back" variant="ghost" onPress={() => router.back()} style={styles.flex} />
        <Button label="Next" disabled={!canContinue} onPress={onNext} style={styles.flex} />
      </View>

      <AgeGroupSheet
        visible={pickerOpen}
        value={ageGroup}
        onSelect={onSelectAge}
        onClose={() => setPickerOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  // Figma: 진행바(하단 y=60)와 제목 블록(y=79) 사이 19 + 블록 내부 상단 36
  title: { paddingTop: 55 },
  // Figma: 제목 블록 하단 패딩과 성별 영역이 4px 겹침 (y=267)
  section: { paddingHorizontal: 20, gap: 4, marginTop: -4 },
  label: { color: colors.labelAlternative },
  genderRow: { flexDirection: 'row', gap: 8 },
  age: { marginTop: 24 },
  arrow: { width: 18, height: 18 },
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 22 },
});
