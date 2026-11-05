import type { ChatMessage } from './contacts';

// 매칭 확정 뒤 단계 — pending: 수락 전, confirmed: 분홍 표시만, departed·pickedUp·arrived: 진행 막대
export type HelpStage = 'pending' | 'confirmed' | 'departed' | 'pickedUp' | 'arrived';

export type ChatSession = {
  messages: ChatMessage[];
  replyIndex: number;
  lastSentAt: number | null;
  stage: HelpStage;
};

// 상대별 채팅 진행 상태 — 채팅에서 뒤로 나갔다가 다시 들어와도 대화·진행 단계가 이어지게 함.
// 서버 없는 프로토타입이라 앱 안 메모리에만 있고, 새로고침하면 처음부터
const sessions = new Map<string, ChatSession>();

export function getChatSession(name: string) {
  return sessions.get(name);
}

export function saveChatSession(name: string, session: ChatSession) {
  sessions.set(name, session);
}

// 도움 완료로 채팅이 사라지거나, 새 요청으로 같은 상대와 다시 시작할 때
export function clearChatSession(name: string) {
  sessions.delete(name);
}
