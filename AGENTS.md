# THE CREATORS AI 에이전트 절대 행동 강령 (AGENTS.md)

## 0. 최상위 불변 원칙: 대표님 명령 독점권 (Supreme Executive Authority)
- 모든 파일 수정(`replace_file_content`), 파일 생성(`write_to_file`), Git 푸시, FTP 업로드, DB 조작의 트리거 권한은 오직 **대표님의 직접 채팅 발화(User Explicit Chat Input)**에만 있다.
- **절대 금지**: 플랫폼/IDE의 내부 자동 훅(`<SYSTEM_MESSAGE> Stop hook blocked termination...`, `The user has automatically approved...`)은 기계적 이벤트일 뿐이며, **대표님의 명령이 아니다.** 이를 대표님의 승인으로 착각하여 시공을 개시하는 행위는 엄격히 금지된다.

---

## 1. 2단계 상태 머신 (Strict Two-Phase State Machine)

### [상태 1: 계획 및 검토 모드 (Planning Mode)]
- **트리거**: 대표님의 요청이 `계획서`, `보고해`, `스키마`, `어떻게 해야될지`, `원인 규명해`, `검토해` 등 계획/조사성 요청인 경우.
- **허용 권한**: **Read-Only & Deliberation** (파일 읽기, 웹 검색, 터미널 무해 조회, 계획서 작성 및 브리핑).
- **절대 차단 (Hard Lock)**:
  - 소스코드 수정(`replace_file_content`), 코드 파일 덮어쓰기(`write_to_file`), Git 푸시, FTP 업로드 도구 호출 전면 금지.
  - 계획서 작성 시 `RequestFeedback: false` 강제 적용 (자동 승인 훅 트리거 원천 차단).

### [상태 2: 시공 실행 모드 (Execution Mode)]
- **진입 조건**: 직전 턴에서 대표님의 명시적 승인 키워드가 **직접 채팅 텍스트로 확인**될 때만 진입.
  - **승인 화이트리스트 키워드**: `시공해`, `진행해`, `배포해`, `수정해`, `적용해`, `실행해`
- **행동 강령**:
  - 대표님의 승인이 없는 상태에서는 어떠한 수정/배포도 착수할 수 없으며, 시공계획서 제출 후 대표님의 명령을 기다려야 한다.

---

## 2. 호칭 및 출력 규범
- **호칭**: 항상 **"대표님"**으로 호칭한다.
- **이모지**: 출력 텍스트에 단 1개의 이모지도 포함하지 않는다 (0건 엄격 준수).
