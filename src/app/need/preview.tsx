import { VesperLibre_700Bold } from '@expo-google-fonts/vesper-libre';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dialog } from '@/components/Dialog';
import { Header } from '@/components/Header';
import { BottomActions } from '@/components/need/preview/BottomActions';
import { mockRequest } from '@/components/need/preview/mockRequest';
import { PostedModal } from '@/components/need/preview/PostedModal';
import { RequestCard } from '@/components/need/preview/RequestCard';
import { Screen } from '@/components/Screen';
import { colors, fonts, typography } from '@/theme/tokens';

// "Request Posted!" 를 보여준 뒤 홈으로 넘어가기까지의 시간
const POSTED_MS = 1500;

type ModalState = 'cancel' | 'post' | 'posted' | null;

// Figma "도움 요청_AI 전화 페이지(장소 2개 버전)" (1608:33688)
//  Cancel → "Discard this request?" (1608:33730) / Post → "Post this request?" (1608:33753)
//  → "Request Posted!" (1608:33776) → 홈 + 잠금화면 알림 (1608:33799 / 1608:33987)
export default function Preview() {
  // Figma "Display/Display 3/B" 는 Vesper Libre Bold — 앱 공통 폰트에 없어 이 화면에서 불러옴
  const [fontLoaded] = useFonts({ VesperLibre_700Bold });
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    if (modal !== 'posted') return;
    const t = setTimeout(() => router.replace('/home?posted=1'), POSTED_MS);
    return () => clearTimeout(t);
  }, [modal]);

  return (
    <Screen background={colors.backgroundAlternative} style={styles.noBottomPad}>
      <View style={styles.stage}>
        {/* Figma "Scroll Section": y 57 ~ 화면 끝, 내용은 21 아래부터 */}
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleArea}>
            <Text accessibilityRole="header" style={[typography.display1, styles.title]}>
              Preview
            </Text>
          </View>
          <View style={styles.description}>
            <Text style={[styles.subtitle, fontLoaded && { fontFamily: 'VesperLibre_700Bold' }]}>
              Individual help may be the best fit.
            </Text>
            <Text style={styles.body}>
              Your request will be shared with verified helpers nearby. You can review and edit it before posting.
            </Text>
          </View>
          <RequestCard request={mockRequest} />
          {/* Figma "스크롤 하단 여백용 프레임" */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Figma 에서 헤더는 스크롤 영역 위에 배경 없이 겹쳐 있음. 뒤로가기는 별도 디자인이 없어 기본 동작(이전 화면) */}
        <View style={styles.header} pointerEvents="box-none">
          <Header title="Help Request" />
      </View>

      <BottomActions
        onCancel={() => setModal('cancel')}
        onPost={() => setModal('post')}
        onEdit={() => {
          // TODO: Edit — Figma 에 편집 화면/상태가 없음
        }}
      />
      </View>

      <Dialog
        visible={modal === 'cancel'}
        title="Discard this request?"
        message="Your request will be deleted and won't be posted."
        cancelLabel="Discard"
        confirmLabel="Keep"
        onCancel={() => {
          setModal(null);
          router.replace('/need');
        }}
        onConfirm={() => setModal(null)}
      />
      <Dialog
        visible={modal === 'post'}
        title="Post this request?"
        message="Your request will be shared with nearby helpers in your network."
        cancelLabel="Back"
        confirmLabel="Post"
        onCancel={() => setModal(null)}
        onConfirm={() => setModal('posted')}
      />
      <PostedModal visible={modal === 'posted'} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  noBottomPad: { paddingBottom: 0 },
  stage: { flex: 1 },
  // Scroll Section top 57 → 상태바 아래 10
  scroll: { position: 'absolute', top: 10, left: 0, right: 0, bottom: 0 },
  scrollContent: { paddingTop: 21, alignItems: 'center' },
  titleArea: { alignSelf: 'stretch', height: 84, paddingTop: 36, paddingHorizontal: 20 },
  title: { color: colors.labelStrong },
  description: { alignSelf: 'stretch', height: 90, gap: 4, paddingHorizontal: 20 },
  // Display/Display 3/B — Vesper Libre Bold 20/20
  subtitle: { fontFamily: fonts.vesperHeavy, fontSize: 20, lineHeight: 20, color: colors.labelNormal },
  // Body/Body 1/Reading/R — 16/21
  body: { fontFamily: fonts.robotoRegular, fontSize: 16, lineHeight: 21, color: colors.labelNormal },
  bottomSpacer: { height: 160 },
  header: { position: 'absolute', left: 0, right: 0, top: 0 },
});
