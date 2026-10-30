import { Modal } from 'react-native';

type Props = { visible: boolean; onRequestClose: () => void; children: React.ReactNode };

// 네이티브: 상태바까지 덮는 투명 모달. 웹 구현은 FullBleedOverlay.web.tsx
export const TOP_BLEED = 0;
export const BOTTOM_BLEED = 0;

export function FullBleedOverlay({ visible, onRequestClose, children }: Props) {
  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onRequestClose}>
      {children}
    </Modal>
  );
}
