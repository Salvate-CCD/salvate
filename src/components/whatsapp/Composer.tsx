import { Image } from '@/components/Image';
import { forwardRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View, type TextInputInstance, type TextStyle } from 'react-native';
import { colors, fonts } from '@/theme/tokens';
import { wa } from './theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

const LINE_HEIGHT = 21;
// 웹에서 textarea 기본 포커스 테두리/리사이즈 핸들 제거 + 링크를 글자 단위로 줄바꿈 (Figma와 동일)
const webInput = (Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'none', wordBreak: 'break-all' } : {}) as TextStyle;

// Figma 하단 입력바 — 비었을 때: + / 입력칸 / 카메라 / 마이크, 입력 중: + / 넓어진 입력칸 / 전송
export const Composer = forwardRef<TextInputInstance, Props>(function Composer({ value, onChangeText, onSend }, ref) {
  const [contentHeight, setContentHeight] = useState(LINE_HEIGHT);
  const typing = value.length > 0;

  return (
    <View style={styles.root}>
      <Image source={require('../../../assets/figma/whatsapp/plus.svg')} style={styles.plus} />

      <View style={[styles.field, typing ? styles.fieldTyping : styles.fieldEmpty]}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          multiline
          scrollEnabled={false}
          onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
          style={[styles.input, webInput, { height: typing ? Math.max(LINE_HEIGHT, contentHeight) : LINE_HEIGHT }]}
        />
        <Image source={require('../../../assets/figma/whatsapp/sticker.svg')} style={styles.sticker} />
      </View>

      {typing ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Send" onPress={onSend} style={styles.send}>
          <Image source={require('../../../assets/figma/whatsapp/send.svg')} style={styles.circle} />
        </Pressable>
      ) : (
        <>
          <Image source={require('../../../assets/figma/whatsapp/camera.svg')} style={styles.camera} />
          <Image source={require('../../../assets/figma/whatsapp/mic.svg')} style={[styles.circle, styles.mic]} />
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 7,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 9,
    backgroundColor: wa.background,
  },
  // Figma "icons/Character/plus" 30×30 (입력칸 하단보다 1px 위)
  plus: { width: 30, height: 30, marginBottom: 1, marginRight: 8 },
  // Figma "Rectangle 315" — 입력 전 250×30, 입력 중 296×102
  field: {
    flex: 1,
    minHeight: 30,
    paddingLeft: 17,
    paddingRight: 21,
    borderWidth: 1,
    borderColor: colors.strokeNeutral,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  fieldEmpty: { paddingTop: 3, paddingBottom: 4, marginRight: 17 },
  fieldTyping: { paddingTop: 10, paddingBottom: 6, marginRight: 6 },
  input: {
    padding: 0,
    fontFamily: fonts.robotoRegular,
    fontSize: 16,
    lineHeight: LINE_HEIGHT,
    color: colors.labelNormal,
    textAlign: 'justify',
    textAlignVertical: 'top',
  },
  // Figma "Group 633499" 스티커 아이콘 — 입력칸 오른쪽 아래
  sticker: { position: 'absolute', right: 12, bottom: 5, width: 18, height: 18 },
  camera: { width: 24, height: 24, marginBottom: 4, marginRight: 11 },
  circle: { width: 33, height: 33 },
  mic: { marginBottom: -1 },
  send: { marginBottom: -1 },
});
