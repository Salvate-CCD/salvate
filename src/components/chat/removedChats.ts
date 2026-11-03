// 둘 다 또는 내가 "Help Completed" 를 확인해 다시 볼 수 없는 채팅 — 서버 없는 프로토타입이라 새로고침하면 복원됨
const removed = new Set<string>();

export function removeChat(name: string) {
  removed.add(name);
}

export function restoreChat(name: string) {
  removed.delete(name);
}

export function isChatRemoved(name: string) {
  return removed.has(name);
}
