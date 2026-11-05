import { Image } from '@/components/Image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View, type TextInputInstance } from 'react-native';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { TitleBlock } from '@/components/TitleBlock';
import { useSignup } from '@/state/signup';

const MAX_LENGTH = 20;

// Figma "회원가입 - 프로필 생성 - 이름"
export default function Name() {
  const { draft, update } = useSignup();
  const input = useRef<TextInputInstance>(null);
  const [name, setName] = useState(draft.firstName);
  const [focused, setFocused] = useState(false);

  const tooLong = name.length > MAX_LENGTH; // 21자부터 에러
  const canContinue = name.trim().length > 0 && !tooLong;

  const onNext = () => {
    Keyboard.dismiss();
    update({ firstName: name.trim() });
    router.push('/signup/gender-age');
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Figma "touch section" — 입력칸 바깥을 누르면 키보드 내림. 장식 요소는 터치를 통과시킴 */}
        <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} accessible={false} focusable={false} />

        <View style={styles.passThrough}>
          <ProgressBar total={4} current={1} />
          <TitleBlock
            title="Create your profile for Sálvate"
            description="Enter your first name. Only this name will be shown to others."
            titleWidth={330}
            descriptionWidth={330}
            style={styles.title}
          />

          {/* Figma "Grpahic" — 64×64 슬롯, SVG는 그림자 포함 98×94 */}
          <View style={styles.graphic}>
            <Image source={require('../../../assets/figma/profile-graphic.svg')} style={styles.graphicImage} />
          </View>
        </View>

        <TextField
          ref={input}
          label="First name"
          placeholder="e.g., Maria or Pedro"
          value={name}
          onChangeText={setName}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          error={tooLong ? `Please use ${MAX_LENGTH} characters or fewer.` : undefined}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="done"
          onSubmitEditing={() => canContinue && onNext()}
          style={styles.field}
        />

        <View style={[styles.flex, styles.passThrough]} />
        <View style={[styles.action, focused && styles.actionAboveKeyboard]}>
          <Button label="Next" disabled={!canContinue} onPress={onNext} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  passThrough: { pointerEvents: 'none' },
  // Figma: 진행바(하단 y=60)와 제목 블록(y=79) 사이 19 + 블록 내부 상단 36
  title: { paddingTop: 55 },
  graphic: { width: 64, height: 64, alignSelf: 'center', marginTop: 4 },
  graphicImage: { position: 'absolute', left: -17, top: -10, width: 98, height: 94 },
  field: { marginTop: 30, marginHorizontal: 20 },
  action: { paddingHorizontal: 20, paddingBottom: 22 },
  // Figma: 키보드가 올라와 있을 때 버튼 하단과 키보드 사이 20px
  actionAboveKeyboard: { paddingBottom: 20 },
});
