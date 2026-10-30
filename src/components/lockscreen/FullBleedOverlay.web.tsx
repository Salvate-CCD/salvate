import { useLayoutEffect } from 'react';

// react-dom 은 타입 패키지가 없어 필요한 함수만 타입을 붙여 가져옴
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createPortal } = require('react-dom') as {
  createPortal: (children: React.ReactNode, container: Element) => React.ReactNode;
};

type Props = { visible: boolean; onRequestClose: () => void; children: React.ReactNode };

// 웹(iOS 26 Safari): 상태바·하단 툴바 뒤까지 오버레이 이미지가 보이게 하는 전체 화면 레이어
//  - position: fixed 요소는 툴바 아래로 그려지지 않으므로, 문서 맨 위에 absolute 로 붙임
//  - 레이어를 보이는 높이(100dvh)보다 위·아래로 더 크게 그림 (TOP_BLEED / BOTTOM_BLEED)
//  - 스크롤이 0이면 Safari 가 상태바 뒤를 단색으로 칠하므로, 문서를 TOP_BLEED 만큼 스크롤해 둠
//  - 떠 있는 동안만 viewport-fit=cover·문서 스크롤을 켜고, 닫히면 원래대로 되돌림
// 참고: https://1ar.io/updates/safari-26-liquid-glass-web/
export const TOP_BLEED = 62;
export const BOTTOM_BLEED = 136;

export function FullBleedOverlay({ visible, children }: Props) {
  useLayoutEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const body = document.body;
    const meta = document.querySelector('meta[name="viewport"]');
    const prevMeta = meta?.getAttribute('content') ?? null;
    const prev = {
      htmlOverflowY: html.style.overflowY,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyMinHeight: body.style.minHeight,
    };

    if (meta && prevMeta && !prevMeta.includes('viewport-fit')) meta.setAttribute('content', `${prevMeta}, viewport-fit=cover`);
    html.style.overflowY = 'scroll';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'visible';
    body.style.minHeight = `calc(100dvh + ${TOP_BLEED}px)`;
    window.scrollTo({ top: TOP_BLEED, left: 0, behavior: 'instant' });

    // 스크롤은 켜 두되 손가락·휠로 움직이지는 않게
    const block = (e: Event) => e.preventDefault();
    document.addEventListener('touchmove', block, { passive: false });
    document.addEventListener('wheel', block, { passive: false });

    return () => {
      document.removeEventListener('touchmove', block);
      document.removeEventListener('wheel', block);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      html.style.overflowY = prev.htmlOverflowY;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.minHeight = prev.bodyMinHeight;
      if (meta && prevMeta !== null) meta.setAttribute('content', prevMeta);
    };
  }, [visible]);

  if (!visible) return null;
  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: `calc(100dvh + ${TOP_BLEED + BOTTOM_BLEED}px)`,
        zIndex: 1000,
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
