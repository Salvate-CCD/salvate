import { useEffect, useState } from 'react';
import type { KeyboardViewport } from './use-web-keyboard-viewport';

// react-dom 은 타입 패키지가 없어 필요한 함수만 타입을 붙여 가져옴
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { flushSync } = require('react-dom') as { flushSync: (fn: () => void) => void };

type Viewport = { height: number; top: number; keyboardOpen: boolean };

// 보이는 영역이 이만큼 이상 줄면 키보드가 열린 것으로 봄 (주소창 변화와 구분)
const KEYBOARD_MIN_PX = 120;
// 키보드가 움직이는 동안 iOS 는 이벤트를 드물게 주므로 이 시간 동안 프레임마다 위치를 다시 읽음
const WATCH_MS = 700;

// 이보다 많이 움직인 터치는 탭이 아니라 스크롤로 봄
const TAP_SLOP_PX = 10;

// 키보드가 안 뜨는 경우(외장 키보드 등)에도 입력칸을 되돌리는 시간
const HOLD_MAX_MS = 800;

function isKeyboardOpen() {
  const vv = window.visualViewport;
  // 손가락으로 확대한 경우(scale > 1)는 키보드로 보지 않음
  return !!vv && vv.height * vv.scale < document.documentElement.clientHeight - KEYBOARD_MIN_PX;
}

function isTextInput(el: Element | null): el is HTMLInputElement | HTMLTextAreaElement {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}

function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// iOS Safari 는 키보드에 가려질 입력칸을 보여주려고 페이지를 밀어 올림
// 탭한 뒤 키보드가 뜰 때까지 입력칸이 화면 위쪽에 있는 것처럼 속여 밀지 않게 함 (React Aria usePreventScroll 을 참고)
function focusWithoutPagePan() {
  let startX = 0;
  let startY = 0;
  const onTouchStart = (e: TouchEvent) => {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const target = e.target;
    if (!(target instanceof Element) || !isTextInput(target) || target === document.activeElement) return;
    const touch = e.changedTouches[0];
    if (Math.abs(touch.clientX - startX) > TAP_SLOP_PX || Math.abs(touch.clientY - startY) > TAP_SLOP_PX) return;
    e.preventDefault();
    target.style.transform = 'translateY(-2000px)';
    target.focus();
    // iOS 는 키보드가 뜰 때 입력칸 위치를 다시 보므로, 화면이 키보드 위로 줄어든 뒤에 되돌림
    const start = performance.now();
    const restore = () => {
      if (!isKeyboardOpen() && performance.now() - start < HOLD_MAX_MS) {
        requestAnimationFrame(restore);
        return;
      }
      requestAnimationFrame(() => {
        target.style.transform = '';
      });
    };
    requestAnimationFrame(restore);
  };
  document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
  document.addEventListener('touchend', onTouchEnd, { passive: false, capture: true });
  return () => {
    document.removeEventListener('touchstart', onTouchStart, { capture: true });
    document.removeEventListener('touchend', onTouchEnd, { capture: true });
  };
}

// 모바일 브라우저는 키보드가 올라와도 레이아웃 높이를 줄이지 않고 페이지를 위로 밀어 입력칸을 보여줌
// 입력 중에는 화면을 실제로 보이는 영역(visualViewport)에 맞춰 헤더가 밀려 올라가지 않게 함
export function useWebKeyboardViewport(): KeyboardViewport {
  const [viewport, setViewport] = useState<Viewport | null>(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let frame = 0;
    let watchUntil = 0;

    const read = () => {
      const keyboardOpen = isKeyboardOpen();
      // 포커스 순간부터 따라가야 페이지가 밀리기 시작할 때 화면이 튀지 않음
      const next = keyboardOpen || isTextInput(document.activeElement) ? { height: vv.height, top: vv.pageTop, keyboardOpen } : null;
      setViewport((prev) =>
        prev?.height === next?.height && prev?.top === next?.top && prev?.keyboardOpen === next?.keyboardOpen ? prev : next,
      );
    };
    // 프레임 안에서 바로 그려야 위치가 한 박자 늦지 않음
    const tick = () => {
      flushSync(read);
      frame = performance.now() < watchUntil ? requestAnimationFrame(tick) : 0;
    };
    const watch = () => {
      read();
      watchUntil = performance.now() + WATCH_MS;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    read();
    const stopFocusGuard = isIOS() ? focusWithoutPagePan() : undefined;
    vv.addEventListener('resize', watch);
    vv.addEventListener('scroll', watch);
    window.addEventListener('scroll', watch);
    document.addEventListener('focusin', watch);
    document.addEventListener('focusout', watch);
    return () => {
      cancelAnimationFrame(frame);
      stopFocusGuard?.();
      vv.removeEventListener('resize', watch);
      vv.removeEventListener('scroll', watch);
      window.removeEventListener('scroll', watch);
      document.removeEventListener('focusin', watch);
      document.removeEventListener('focusout', watch);
    };
  }, []);

  if (!viewport) return { style: null, keyboardOpen: false };
  return {
    style: { position: 'absolute', top: viewport.top, left: 0, right: 0, height: viewport.height },
    keyboardOpen: viewport.keyboardOpen,
  };
}
