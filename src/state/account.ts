// 가입 신청 뒤 관리자 승인 대기 (프로토타입용 메모리 상태 — 새로고침하면 초기화)
// TODO: 서버의 승인 상태로 교체
let approvalPushQueued = false;

// 가입 신청 완료 → 랜딩에서 승인 알림이 내려오도록 예약
export function queueApprovalPush() {
  approvalPushQueued = true;
}

export function hasApprovalPush() {
  return approvalPushQueued;
}

// 알림을 띄울 때 호출 — 한 번만 뜸
export function clearApprovalPush() {
  approvalPushQueued = false;
}
