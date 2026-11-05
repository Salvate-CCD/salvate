import { clearChatSession } from './chatSessions';

// 둘 다 또는 내가 "Help Completed" 를 확인해 다시 볼 수 없는 채팅 — 서버 없는 프로토타입이라 새로고침하면 복원됨
const removed = new Set<string>();

export function removeChat(name: string) {
  removed.add(name);
  clearChatSession(name);
}

// 다시 나타나는 채팅은 이전 진행 상태 없이 처음부터
export function restoreChat(name: string) {
  removed.delete(name);
  clearChatSession(name);
}

export function isChatRemoved(name: string) {
  return removed.has(name);
}

// 상대가 나중에 완료를 눌렀다는 알림(Figma 1967:20707)을 기다리는 채팅 — 홈으로 돌아간 뒤 내려옴
let pendingCompletion: string | null = null;

export function queueCompletionPush(name: string) {
  pendingCompletion = name;
}

export function peekCompletionPush() {
  return pendingCompletion;
}

export function clearCompletionPush() {
  pendingCompletion = null;
}
