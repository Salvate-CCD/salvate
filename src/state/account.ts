// 가입 승인 여부 (프로토타입용 메모리 상태 — 새로고침하면 초기화)
// TODO: 서버의 승인 상태로 교체
let approved = false;

export function isAccountApproved() {
  return approved;
}

export function markAccountApproved() {
  approved = true;
}
