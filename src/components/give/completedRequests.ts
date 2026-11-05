// 도움을 끝낸 요청 — Give 목록에서 뺌. 서버 없는 프로토타입이라 앱 메모리에만 있고 새로고침하면 다시 보임.
// 목록의 Miguel 카드들은 같은 예시 요청을 가리키므로, 채팅 상대가 아니라 실제로 눌러서 도와준 카드(id)를 기억함
const completed = new Set<string>();
// 채팅 상대(chat 키) → 그 채팅을 시작한 요청 카드 id
const active = new Map<string, string>();

// 상세에서 Give Help 를 눌렀을 때
export function startHelping(chat: string, requestId: string) {
  active.set(chat, requestId);
}

// 채팅에서 도움 완료를 확인했을 때
export function completeHelping(chat: string) {
  const id = active.get(chat);
  if (id) completed.add(id);
  active.delete(chat);
}

export function isRequestCompleted(requestId: string) {
  return completed.has(requestId);
}
