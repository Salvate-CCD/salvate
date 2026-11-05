import { Image } from '@/components/Image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/theme/tokens';

type Props = { title?: string; onBack?: () => void };

// Figma "Header" — 뒤로가기 화살표 + 가운데 제목
export function Header({ title, onBack }: Props) {
  return (
    <View style={styles.root}>
      {/* 제목은 폭 전체를 차지하므로 터치를 받지 않게 하고, 뒤로가기 버튼을 그 위에 둔다 */}
      {title ? (
        <Text pointerEvents="none" style={[typography.body1Medium, styles.title]}>
          {title}
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
        onPress={onBack ?? (() => router.back())}
        style={styles.back}
      >
        <Image source={require('../../assets/figma/arrow-left.svg')} style={styles.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: 24, marginTop: 7 },
  back: { position: 'absolute', left: 10, top: 0 },
  icon: { width: 28, height: 28 },
  title: { marginTop: 5, textAlign: 'center', color: colors.labelNeutral },
});
