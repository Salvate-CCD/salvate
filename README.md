# Sálvate

믿을 수 있는 지인 네트워크 안에서 도움을 주고받는 모바일 앱의 **프로토타입**입니다.
아이 픽업, 차량 이동, 통역, 장보기처럼 생활 속 도움을 친구와 친구의 친구에게 요청하고, 내가 도울 수 있는 요청에 응답합니다.

> 현재는 서버가 없는 클릭형 프로토타입입니다. 모든 데이터는 예시 값이고 앱 메모리에만 있어서 **새로고침하면 처음 상태로 돌아갑니다.**
> 화면과 문구는 Figma 디자인을 기준으로 구현했습니다.

## 기술 스택

- [Expo](https://docs.expo.dev/) SDK 58 · React Native 0.88 · React 19
- [Expo Router](https://docs.expo.dev/router/introduction/) (파일 기반 라우팅, typed routes)
- TypeScript (strict)
- 웹(PWA)으로 시연하고, 배포는 EAS Hosting을 씁니다. iOS·Android 빌드는 EAS Build로 할 수 있습니다.

## 시작하기

```bash
npm install
npx expo start        # 개발 서버 — w: 웹, i: iOS 시뮬레이터, a: Android
```

- 웹 화면은 **iPhone 폭(390pt)** 을 기준으로 디자인했습니다. 브라우저 개발자 도구의 모바일 화면에서 보거나 휴대폰으로 여세요.
- 회원가입의 초대 코드는 아무 숫자 6자리나 입력하면 됩니다. WhatsApp 인증도 실제 WhatsApp을 열지 않고 앱 안에서 흉내만 냅니다.

### 확인 명령

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # expo lint
npx expo-doctor       # 의존성·설정 점검
```

패키지를 추가할 때는 `npm install` 대신 `npx expo install <패키지>`를 써야 SDK와 맞는 버전이 설치됩니다.

## 배포

### 웹 (EAS Hosting)

```bash
npx expo export --platform web    # dist/ 생성
npx eas-cli@latest deploy --prod  # 업로드
```

`app.json`의 `web.output`은 `single`(SPA)입니다. `static`으로 바꾸면 빌드할 때 화면 폭이 0으로 고정돼 온보딩 같은 화면이 깨지니 바꾸지 마세요.

### 네이티브 앱 (EAS Build)

```bash
npx eas-cli@latest build --profile preview --platform android   # 내부 배포용 APK
npx eas-cli@latest build --profile production --platform ios
```

빌드 프로필은 `eas.json`에 있습니다. 앱 식별자는 `com.salvate.app`입니다.
`ios/`와 `android/` 폴더는 빌드할 때 자동으로 생성되니 직접 만들거나 고치지 말고, 네이티브 설정은 `app.json`에서 바꿉니다.

## 화면 흐름

```
온보딩 → 랜딩(welcome)
  ├─ Sign Up: 초대 코드 → WhatsApp 인증 → 이름 → 성별·연령대 → 필요한 도움 → 줄 수 있는 도움 → 신청 완료
  │           → 랜딩으로 돌아오면 "가입 승인" 알림
  └─ Continue with WhatsApp: WhatsApp 인증 → 홈
```

로그인하면 하단 탭으로 화면을 오갑니다. 다섯 번째 설정 탭은 아직 화면이 없습니다.

| 탭 | 경로 | 내용 |
|---|---|---|
| Home | `/home` | 내 이름을 가운데에 둔 회전 링으로 커뮤니티를 보여줍니다. 메시지 버튼을 누르면 대화 목록이 열립니다. |
| Need | `/need` | 밀어서 AI와 통화 → 내용 분석 → 요청 카드 미리보기 → 게시 → "Maria가 돕겠대요" 알림 → 채팅 |
| Give | `/give` | 긴급도(Critical / High / Moderate / Low)별 요청 목록 → 상세 → 채팅 |
| Services | `/services` | 지역 기관 카테고리와 Hotline 버튼 (디자인이 아직 없어 동작은 없음) |

### 도움 진행 시나리오

채팅 화면(`/chat/[name]`)에서 매칭 확정부터 도움 완료까지 진행합니다. 실제 푸시 알림 대신 몇 초 뒤 **잠금화면 알림**이 화면 위로 내려와 다음 단계를 안내합니다.

- **도움받는 쪽 (Maria):** 매칭 수락 → 출발 → 도착 → 완료
- **도움 주는 쪽 (Miguel, Carlos):** "Ready to Leave?" → (장소가 두 곳이면 픽업 지점 도착) → 도착 → 완료
- 도움을 마친 채팅은 대화 목록에서, 그 요청은 Give 목록에서 빠집니다.

## 폴더 구조

```
src/
├─ app/            # 화면 (Expo Router — 파일 하나가 화면 하나)
│  ├─ signup/      # 회원가입 단계
│  ├─ need/        # 도움 요청: AI 통화 → 분석 → 미리보기
│  ├─ give/        # 도움 제공 상세
│  └─ chat/        # 채팅과 도움 진행
├─ components/     # 화면별 컴포넌트 (home, need, give, chat, services, whatsapp, lockscreen)와 공통 컴포넌트
├─ hooks/          # 웹 키보드·페이지 배경 대응 (.web.ts 는 웹 전용 구현)
├─ state/          # 회원가입 입력값(Context), 가입 승인 상태
├─ lib/            # WhatsApp 인증 흐름
└─ theme/tokens.ts # 색·글꼴·타이포그래피 토큰 (Figma 변수 기준)

assets/figma/      # Figma에서 내보낸 SVG·이미지
public/            # PWA 파일 (index.html, manifest.json, sw.js, 아이콘)
```

### 예시 데이터가 있는 곳

| 파일 | 내용 |
|---|---|
| `src/components/chat/contacts.ts` | 채팅 상대(Maria·Miguel·Carlos)의 대화, 답장, 프로필, 진행 알림 문구 |
| `src/components/give/giveData.ts` | Give 탭의 긴급도별 요청 목록과 상세 |
| `src/components/need/preview/mockRequest.ts` | AI 통화 뒤 만들어지는 요청 카드 |
| `src/components/home/wheelData.ts` | 홈 링에 보이는 이름 |

진행 상태는 `chatSessions.ts`, `removedChats.ts`, `completedRequests.ts`가 메모리에 기억합니다. 서버를 붙일 때 이 파일들을 API 호출로 바꾸면 됩니다.

## 작업 규칙

- **Figma가 기준입니다.** 코드 주석에 해당 Figma 노드 ID(예: `1935:44135`)를 적어 둡니다. Figma에 없는 동작(애니메이션, 제스처 등)은 임의로 만들지 않고 먼저 팀에 묻습니다.
- 커밋 메시지와 주석은 한국어로 씁니다.
- 작업은 브랜치에서 하고 PR로 `main`에 합칩니다. 합치기 전에 `typecheck`와 `lint`를 통과시킵니다.

## 아직 연결되지 않은 것

- 서버: 가입 신청, 관리자 승인, WhatsApp 인증, 요청·채팅 저장
- Services 탭의 기관 목록과 Hotline 전화
- 요청 카드 편집, 소리 내어 읽기, 통화 중 스피커·음소거
- 설정 화면

코드에서 `TODO`로 검색하면 위치를 찾을 수 있습니다.
