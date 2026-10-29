import { Image, type ImageSource } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

// Figma "AI 전화 페이지" 두 프레임(1608:33565 = 상태 A, 1608:33614 = 상태 B)의 원 그래픽.
// B 는 A 의 원들이 한 단계씩 바깥으로 커지며 옅어진 모습 → A ↔ B 를 부드럽게 오감.
// 각 원은 끝 상태에서 그 프레임의 SVG 를 원래 크기 그대로 보여주고, 중간은 크기·투명도를 보간함.
// 한 방향 시간은 디자인에 없어서 임의로 정함
const HALF_MS = 1400;

type Pair = {
  /** 상태 A 의 원 지름과 SVG (없으면 B 에서 새로 생기는 원 → 가운데 136 원에서 커져 나옴) */
  a?: { d: number; src: ImageSource; box: number };
  b: { d: number; src: ImageSource; box: number };
  aFrom?: number; // a 가 없을 때 시작 지름
};

// box = SVG 루트 크기 (blur 여백 포함), d = 원 지름
const PAIRS: Pair[] = [
  // Ellipse 127 — #EBF9F5
  {
    a: { d: 330, box: 330, src: require('../../../assets/figma/need/ringA-330.svg') },
    b: { d: 436, box: 436, src: require('../../../assets/figma/need/ringB-436.svg') },
  },
  // Ellipse 126 — #CDF0E5
  {
    a: { d: 246, box: 246, src: require('../../../assets/figma/need/ringA-246.svg') },
    b: { d: 326, box: 326, src: require('../../../assets/figma/need/ringB-326.svg') },
  },
  // Ellipse 122 (흐린 원) — B 에서만 218 로 커진 것
  { b: { d: 218, box: 306, src: require('../../../assets/figma/need/ringB-218-glow.svg') }, aFrom: 136 },
  // Ellipse 128 — B 에서만 218 로 커진 것
  { b: { d: 218, box: 218, src: require('../../../assets/figma/need/ringB-218.svg') }, aFrom: 136 },
];

export function CallRings() {
  const [t] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const ease = Easing.inOut(Easing.ease);
    const useNativeDriver = Platform.OS !== 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: HALF_MS, easing: ease, useNativeDriver }),
        Animated.timing(t, { toValue: 0, duration: HALF_MS, easing: ease, useNativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  const fadeIn = t;
  const fadeOut = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View pointerEvents="none" style={styles.center}>
      {PAIRS.map((p, i) => {
        const bScale = t.interpolate({ inputRange: [0, 1], outputRange: [(p.a?.d ?? p.aFrom ?? p.b.d) / p.b.d, 1] });
        return (
          <View key={i} style={StyleSheet.absoluteFill}>
            {p.a ? (
              <Animated.View
                style={[
                  centered(p.a.box),
                  {
                    opacity: fadeOut,
                    transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, p.b.d / p.a.d] }) }],
                  },
                ]}
              >
                <Image source={p.a.src} style={{ width: p.a.box, height: p.a.box }} />
              </Animated.View>
            ) : null}
            <Animated.View style={[centered(p.b.box), { opacity: fadeIn, transform: [{ scale: bScale }] }]}>
              <Image source={p.b.src} style={{ width: p.b.box, height: p.b.box }} />
            </Animated.View>
          </View>
        );
      })}

      {/* 두 상태에 똑같이 있는 가운데 원들: Ellipse 122(흐린 136), Ellipse 129(136), Ellipse 130(74) */}
      <Image source={require('../../../assets/figma/need/ring-136-glow.svg')} style={centered(224)} />
      <Image source={require('../../../assets/figma/need/ring-136.svg')} style={centered(136)} />
      <Image source={require('../../../assets/figma/need/ring-74.svg')} style={centered(74)} />
    </View>
  );
}

// 중심(0,0) 기준으로 size×size 를 가운데 정렬
function centered(size: number) {
  return { position: 'absolute' as const, left: -size / 2, top: -size / 2, width: size, height: size };
}

const styles = StyleSheet.create({
  // 크기 0 인 기준점 — 부모가 원의 중심 위치에 둠
  center: { width: 0, height: 0 },
});
