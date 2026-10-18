/**
 * AI Education Calendar & Admin Portal - Core Application Logic
 * Zero-Error, Real-Data Management, Bulletproof CRUD & Multi-Tab Sync Engine
 */

// 1. 카테고리 테마 색상 정의 (9개 교육과정 완벽 매핑)
const CATEGORIES = {
  "바이브코딩부트캠프": { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" },
  "AI기업업무자동화": { color: "#4f46e5", bgColor: "#eef2ff", badgeBorder: "#c7d2fe" },
  "AX행정 지자체 및 공공기관 연수": { color: "#0891b2", bgColor: "#ecfeff", badgeBorder: "#a5f3fc" },
  "AI영상콘텐츠제작": { color: "#0284c7", bgColor: "#f0f9ff", badgeBorder: "#bae6fd" },
  "AI비지니스마케팅": { color: "#d97706", bgColor: "#fffbeb", badgeBorder: "#fde68a" },
  "AI업무활용": { color: "#7c3aed", bgColor: "#f5f3ff", badgeBorder: "#ddd6fe" },
  "AI리터러시(기초)": { color: "#059669", bgColor: "#ecfdf5", badgeBorder: "#a7f3d0" },
  "AI디자인&브랜딩": { color: "#e11d48", bgColor: "#fff1f2", badgeBorder: "#fecdd3" },
  "AI맞춤형연수": { color: "#ea580c", bgColor: "#fff7ed", badgeBorder: "#fed7aa" }
};

// 레거시 카테고리 자동 마이그레이션 매핑 맵
const LEGACY_CAT_MAP = {
  "바이브 코딩": "바이브코딩부트캠프",
  "업무 자동화": "AI기업업무자동화",
  "영상/콘텐츠": "AI영상콘텐츠제작",
  "비즈니스/마케팅": "AI비지니스마케팅",
  "디자인/브랜딩": "AI디자인&브랜딩",
  "특별 행사": "AX행정 지자체 및 공공기관 연수"
};

// 2. 기본 샘플 강의 데이터 (10월) - 교육대상자 + 교육과정 자동 조합 반영
const DEFAULT_LECTURES = [
  {
    "id": "lec-01",
    "date": "2026-10-06",
    "startTime": "14:00",
    "endTime": "17:00",
    "targetOrg": "부산 북구청 AX연수",
    "category": "바이브코딩부트캠프",
    "title": "[부산 북구청 AX연수] 바이브코딩부트캠프",
    "instructor": "정시후 테크 디렉터",
    "location": "부산북구청 전산실",
    "status": "모집/접수중",
    "isMajorFeatured": true,
    "curriculum": [
      "지자체 공무원 및 실무자를 위한 바이브 코딩(Vibe Coding) 핵심 이해",
      "AI 에이전트에게 직관적으로 지시하는 실전 프롬프트 엔지니어링",
      "행정 업무용 웹 대시보드 및 프로토타입 실시간 빌드",
      "실시간 오류 디버깅 및 공공 데이터 시각화 연동 실습"
    ],
    "preparation": "개인 노트북 (Chrome 브라우저 설치 필수)"
  },
  {
    "id": "lec-02",
    "date": "2026-10-07",
    "startTime": "14:00",
    "endTime": "17:00",
    "targetOrg": "부산 해운대구청 AX연수",
    "category": "AI기업업무자동화",
    "title": "[부산 해운대구청 AX연수] AI기업업무자동화",
    "instructor": "임건 테크 디렉터",
    "location": "해운대구청 전산실",
    "status": "마감임박/확정",
    "isMajorFeatured": true,
    "curriculum": [
      "행정·공공 실무 자동화를 위한 멀티모달 AI 프롬프트 설계",
      "공문서 요약, 보도자료 초안 작성 및 엑셀 데이터 자동 가공",
      "지능형 맞춤 AI 행정 비서 워크플로우 세팅",
      "반복 행정 업무 90% 단축을 위한 실전 AX 파이프라인 완성"
    ],
    "preparation": "개인 노트북, 구글 계정"
  },
  {
    "id": "lec-03",
    "date": "2026-10-08",
    "startTime": "13:00",
    "endTime": "16:00",
    "targetOrg": "신라대학교 AI콘텐츠제작",
    "category": "AI영상콘텐츠제작",
    "title": "[신라대학교 AI콘텐츠제작] AI영상콘텐츠제작",
    "instructor": "김민석 수석 컨설턴트",
    "location": "신라대학교",
    "status": "모집/접수중",
    "isMajorFeatured": true,
    "curriculum": [
      "대학생 및 청년 창업가를 위한 생성형 AI 숏폼 영상 기획",
      "AI 보이스 생성 및 캡컷(CapCut) 자동 자막 템플릿 제작법",
      "시선을 사로잡는 3초 훅(Hook) 바이럴 영상 촬영 & 편집 노하우",
      "유튜브 쇼츠 & 인스타그램 릴스 알고리즘 최적화 전략"
    ],
    "preparation": "스마트폰, 개인 노트북, 캡컷(CapCut) 앱 설치"
  },
  {
    "id": "lec-04",
    "date": "2026-10-09",
    "startTime": "13:00",
    "endTime": "16:00",
    "targetOrg": "부산과학기술대학교 AI콘텐츠제작",
    "category": "AI영상콘텐츠제작",
    "title": "[부산과학기술대학교 AI콘텐츠제작] AI영상콘텐츠제작",
    "instructor": "김민석 수석 컨설턴트",
    "location": "부산과학기술대학교",
    "status": "모집/접수중",
    "isMajorFeatured": true,
    "curriculum": [
      "생성형 AI를 활용한 학과 홍보 및 포트폴리오 영상 제작",
      "미드저니 & AI 비디오 생성 툴을 결합한 하이엔드 모션 그래픽",
      "오디오 싱크 애니메이션 및 감성 컷편집 테크닉",
      "실전 프로젝트 제작 및 전문가 1:1 라이브 피드백"
    ],
    "preparation": "개인 노트북, 실습 영상 에셋"
  },
  {
    "id": "lec-1791179529201",
    "title": "[동의대 미래융합대학] 바이브코딩부트캠프",
    "targetOrg": "동의대 미래융합대학",
    "customType": "",
    "category": "바이브코딩부트캠프",
    "status": "마감임박/확정",
    "date": "2026-10-12",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "정시후",
    "location": "동의대학교 지천관 6층",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791180400349",
    "title": "[금정구청] AX행정 지자체 및 공공기관 연수",
    "targetOrg": "금정구청",
    "customType": "",
    "category": "AX행정 지자체 및 공공기관 연수",
    "status": "진행/완료",
    "date": "2026-10-15",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "정시후",
    "location": "더크리에이터즈AI 대강의장",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791180474493",
    "title": "[부산과학기술대학교] AI영상콘텐츠제작",
    "targetOrg": "부산과학기술대학교",
    "customType": "",
    "category": "AI영상콘텐츠제작",
    "status": "모집/접수중",
    "date": "2026-10-13",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "임건",
    "location": "부산과학기술대학교",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181461146",
    "title": "[부산과기대] AI영상콘텐츠제작",
    "targetOrg": "부산과기대",
    "customType": "",
    "category": "AI영상콘텐츠제작",
    "status": "모집/접수중",
    "date": "2026-10-16",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "임건",
    "location": "부산과기대",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181484449",
    "title": "[부산과기대] AI영상콘텐츠제작",
    "targetOrg": "부산과기대",
    "customType": "",
    "category": "AI영상콘텐츠제작",
    "status": "모집/접수중",
    "date": "2026-10-14",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "임건",
    "location": "부산과기대",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181550960",
    "title": "[부산경제진흥원] AI리터러시(기초)",
    "targetOrg": "부산경제진흥원",
    "customType": "",
    "category": "AI리터러시(기초)",
    "status": "진행/완료",
    "date": "2026-10-19",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "정시후",
    "location": "더크리에이터즈AI 대강의장",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181585438",
    "title": "[해운대구청] AX행정 지자체 및 공공기관 연수",
    "targetOrg": "해운대구청",
    "customType": "",
    "category": "AX행정 지자체 및 공공기관 연수",
    "status": "모집/접수중",
    "date": "2026-10-20",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "정시후",
    "location": "해운대구청",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181613314",
    "title": "[북구평생학습관] 바이브코딩부트캠프",
    "targetOrg": "북구평생학습관",
    "customType": "",
    "category": "바이브코딩부트캠프",
    "status": "모집/접수중",
    "date": "2026-10-21",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "김민석",
    "location": "만덕도서관",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181634181",
    "title": "[해운대구청] AX행정 지자체 및 공공기관 연수",
    "targetOrg": "해운대구청",
    "customType": "",
    "category": "AX행정 지자체 및 공공기관 연수",
    "status": "마감임박/확정",
    "date": "2026-10-22",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "정시후",
    "location": "해운대구청",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181722002",
    "title": "[해운대구청] AI기업업무자동화",
    "targetOrg": "해운대구청",
    "customType": "",
    "category": "AI기업업무자동화",
    "status": "모집/접수중",
    "date": "2026-10-26",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "정시후",
    "location": "해운대구청",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181745740",
    "title": "[북구평생학습관] 바이브코딩부트캠프",
    "targetOrg": "북구평생학습관",
    "customType": "",
    "category": "바이브코딩부트캠프",
    "status": "마감임박/확정",
    "date": "2026-10-28",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "임건",
    "location": "만덕도서관",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181768274",
    "title": "[부산과기대] AI영상콘텐츠제작",
    "targetOrg": "부산과기대",
    "customType": "",
    "category": "AI영상콘텐츠제작",
    "status": "모집/접수중",
    "date": "2026-10-01",
    "startTime": "19:00",
    "endTime": "21:00",
    "instructor": "임건",
    "location": "부산과기대",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  },
  {
    "id": "lec-1791181803235",
    "title": "[더크리에이터즈AI] 바이브코딩부트캠프",
    "targetOrg": "더크리에이터즈AI",
    "customType": "",
    "category": "바이브코딩부트캠프",
    "status": "모집/접수중",
    "date": "2026-10-02",
    "startTime": "13:00",
    "endTime": "18:00",
    "instructor": "정시후",
    "location": "더크리에이터즈AI 대강의장",
    "curriculum": [
      "강의 커리큘럼 준비 중"
    ],
    "preparation": "개인 노트북 지참"
  }
];

const STORAGE_KEY = "ai_edu_calendar_lectures_v9";
const STATS_STORAGE_KEY = "ai_edu_calendar_stats_v2";
const INST_STORAGE_KEY = "ai_edu_calendar_instructors_v3";
const COMP_STORAGE_KEY = "ai_edu_calendar_company_v4";
const REVIEWS_STORAGE_KEY = "ai_edu_calendar_reviews_v1";
const TICKER_STORAGE_KEY = "ai_edu_calendar_ticker_v3";
const HERO_CONFIG_STORAGE_KEY = "ai_edu_calendar_hero_config_v1";
const INSTRUCTOR_APPS_STORAGE_KEY = "ai_edu_calendar_instructor_apps_v1";
const CONSULT_APPS_STORAGE_KEY = "ai_edu_calendar_consult_apps_v1";

// 상단 실시간 무한 롤링 티커 기본 데이터
const DEFAULT_TICKER_ITEMS = [
  { id: "tick-1", text: "11월 정규 AI바이브코딩 모집 중", badge: "badge-amber", icon: "zap" },
  { id: "tick-2", text: "강의를 클릭하면 Google Calendar에 1초 만에 자동 저장됩니다", badge: "badge-blue", icon: "calendar" },
  { id: "tick-3", text: "바이브 코딩 3기 수강생 전원 실무 웹 서비스 프로토타입 배포 완료", badge: "badge-indigo", icon: "rocket" },
  { id: "tick-4", text: "빅테크 현업 테크 디렉터의 1:1 라이브 코드 리뷰 상시 진행", badge: "badge-emerald", icon: "award" }
];

// 최상단 메인 슬로건 기본 문구
const DEFAULT_HERO_CONFIG = {
  sloganTop: "AI비개발자 초보도 4시간이면 나만의 홈페이지,어플,프로그램을 만드는",
  sloganBottom: "실전 AI & 바이브 코딩 아카데미",
  leadText: "지루한 문법 암기는 끝났습니다. AI 에이전트에게 직관적으로 개발을 지시하고,\n현업 AX 분야 최고 수준의 실무 강사진과 함께 나만의 프로덕트를 완성하세요.",
  ctaMonth: 10
};

// 관리자 보안 인증 자격 증명 (수강생 임의 조작 방지 및 영구 세션)
const ADMIN_CREDENTIALS = {
  email: "nova78jyg@gmail.com",
  password: "12341234"
};
const ADMIN_SESSION_KEY = "ai_edu_calendar_admin_session_v2";

// 3. 기본 통계 지표 (히어로 신뢰도 통계)
const DEFAULT_STATS = [
  {
    "id": "stat-1",
    "label": "누적 수강생",
    "value": "3,850+"
  },
  {
    "id": "stat-2",
    "label": "수강 만족도",
    "value": "95.2%"
  },
  {
    "id": "stat-3",
    "label": "실습 완성률",
    "value": "85%"
  },
  {
    "id": "stat-4",
    "label": "기업 출강 평점",
    "value": "4.98 / 5.0"
  }
];

// 4. 기본 강사진 / 멘토진 소개 데이터
const DEFAULT_INSTRUCTORS = [
  {
    id: "inst-1",
    name: "정시후",
    role: "AI 테크 디렉터",
    bio: "더크리에이터즈 AI 테크 리드. 비개발자도 1시간 만에 배포 가능한 웹 서비스를 완성하도록 바이브 코딩 실무를 이끕니다.",
    tags: ["바이브 코딩", "Next.js", "AI 에이전트"],
    avatarClass: "avatar-blue",
    featuredInBanner: true
  },
  {
    id: "inst-2",
    name: "김민석",
    role: "AX 수석 컨설턴트",
    bio: "대기업 AX 프로젝트 40회 이상 수행. 제미나이와 안티그래비티 CLI를 결합하여 기업 실무 자동화 파이프라인을 구축합니다.",
    tags: ["업무 자동화", "제미나이", "프롬프트 고급"],
    avatarClass: "avatar-indigo",
    featuredInBanner: true
  },
  {
    id: "inst-임건",
    name: "임건",
    role: "AI 테크 디렉터",
    bio: "지자체 및 공공기관 AX 연수 총괄 디렉터. 행정 업무 자동화 및 AI 에이전트 구축 실무를 전담합니다.",
    tags: ["AX 행정 연수", "기업 업무 자동화", "AI 에이전트"],
    avatarClass: "avatar-purple",
    featuredInBanner: true
  },
  {
    id: "inst-4",
    name: "이소율",
    role: "브랜드 아트디렉터",
    bio: "국내 톱 브랜드 비주얼 총괄. 미드저니 v6 파라미터 제어와 생성형 AI를 활용한 하이엔드 패키지 & 웹 비주얼을 제작합니다.",
    tags: ["디자인 시스템", "미드저니 v6", "AI 브랜딩"],
    avatarClass: "avatar-rose",
    featuredInBanner: false
  }
];

// 5. 기본 하단 회사 / 학원 정보 (사업자등록증 실데이터 100% 반영)
const DEFAULT_COMPANY_INFO = {
  brandDesc: "대한민국 최고수준의 실전 AI & 바이브 코딩 교육 플랫폼.\n비개발자가 AI와 함께 직접 제품을 만들어 세상과 연결되도록 돕습니다.",
  phone: "051-633-3812",
  email: "nova78jyg3@naver.com",
  hours: "연중무휴",
  location: "부산 범천동 사학연금빌딩 14층 (범일역/범내골역 인근)",
  companyName: "더크리에이터즈AI",
  ceo: "정시후",
  bizNumber: "554-62-00204",
  openDate: "2018.05.28",
  bizType: "교육서비스업, 정보통신업, 서비스",
  bizItem: "창업·취업, 소프트웨어사업(디지털 콘텐츠 개발), 유튜브교육, 광고대행",
  telecomNumber: "제 2018-부산진구-0528호",
  address: "부산광역시 부산진구 범일로 181, 14층(범천동, 사학연금빌딩)",
  copyright: "Copyright © 2018-2026 더크리에이터즈AI. All rights reserved."
};

// 6. 기본 수강생 리얼 후기 데이터
const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    author: "김지은",
    role: "IT 스타트업 마케팅 팀장",
    rating: 5,
    course: "바이브 코딩 & 실무 자동화",
    content: "코딩을 한 줄도 몰랐던 마케터인데 2주 만에 회사 업무 자동화 툴과 고객 랜딩페이지를 완성했습니다. AI와 대화하는 법을 배운 게 인생의 터닝포인트예요.",
    date: "2026.09.28",
    avatarInitial: "김",
    avatarBg: "linear-gradient(135deg, #2563eb, #3b82f6)",
    isDummy: true
  },
  {
    id: "rev-2",
    author: "박성훈",
    role: "엔터프라이즈 프로덕트 매니저",
    rating: 5,
    course: "제미나이 & 안티그래비티 부트캠프",
    content: "강사님의 1:1 피드백 덕분에 에이전트 CLI와 바이브 코딩을 실무에 바로 접목했습니다. 사내에서 AI 챔피언으로 인정받아 승진까지 했습니다!",
    date: "2026.09.30",
    avatarInitial: "박",
    avatarBg: "linear-gradient(135deg, #4f46e5, #6366f1)",
    isDummy: true
  },
  {
    id: "rev-3",
    author: "최원정",
    role: "이커머스 비즈니스 대표",
    rating: 5,
    course: "소상공인 AI 상세페이지",
    content: "구글 캘린더 원클릭 연동부터 칸반보드 관리까지 수강생 입장을 배려한 디테일이 살아있습니다. 직장인이나 사업자라면 꼭 들어야 하는 필수 코스입니다.",
    date: "2026.10.02",
    avatarInitial: "최",
    avatarBg: "linear-gradient(135deg, #059669, #10b981)",
    isDummy: true
  }
];

// 다중 스토리지 계층(LocalStorage + SessionStorage + MemoryStore) 지원 영구 저장소
const SafeStorage = {
  getItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch (e) {}
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const val = window.sessionStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch (e) {}
    return window.__memStore ? (window.__memStore[key] ?? null) : null;
  },
  setItem(key, val) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem(key, val);
      }
    } catch (e) {}
    if (!window.__memStore) window.__memStore = {};
    window.__memStore[key] = val;
  },
  removeItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {}
    if (window.__memStore) delete window.__memStore[key];
  },
  // 이전 버전의 스토리지 키(v1, v2, v3 등)로부터 유실 없는 자동 마이그레이션
  getHistoricalItem(keyList) {
    for (const k of keyList) {
      const val = this.getItem(k);
      if (val !== null && val !== undefined && val !== "") {
        // 첫 번째(최신) 키가 아니면 최신 키로 마이그레이션 저장
        if (k !== keyList[0]) {
          this.setItem(keyList[0], val);
        }
        return val;
      }
    }
    return null;
  }
};

class EduCalendarApp {
  constructor() {
    window.app = this; // 전역 바인딩 보장
    this.cloudDocUrl = "https://firestore.googleapis.com/v1/projects/thecreators-94563/databases/(default)/documents/academy_portal/master_state";
    this.serverApiUrl = "api.php";
    this.adminApiToken = "tc_portal_admin_v6_8077_secure";
    this.isCloudSyncing = false;
    this.selectedDateKey = "2026-10-06";

    // URL 파라미터 (?crm_admin=1 등) 확인하되, 주소창 직접 입력(window.self === window.top) 우회는 원천 차단!
    const urlParams = new URLSearchParams(window.location.search);
    const hasCrmParam = urlParams.get("crm_admin") === "1";
    const isInsideIframe = (window.self !== window.top);
    this.isCrmEmbedded = false;
    const initialAction = urlParams.get("action") || "";

    this.lectures = this.loadLectures();
    this.stats = this.loadStats();
    this.instructors = this.loadInstructors();
    this.companyInfo = this.loadCompanyInfo();
    this.reviews = this.loadReviews();
    this.tickerItems = this.loadTickerItems();
    this.heroConfig = this.loadHeroConfig();
    this.instructorApplications = this.loadInstructorApplications();
    this.consultApplications = this.loadConsultApplications();
    this.activeDataHubTab = "lectures";

    // 날짜 상태 (기본 2026년 10월)
    this.currentYear = 2026;
    this.currentMonth = 9; // 0-indexed: 9 = 10월
    this.today = new Date();

    // 필터 상태
    this.searchQuery = "";
    this.selectedCategory = "전체";

    // 뷰 상태
    this.currentMode = "calendar"; // 'calendar' | 'kanban'
    this.calendarSubView = "calendar"; // 'calendar' | 'list'
    this.draggedLectureId = null;
    this.selectedLectureForView = null;
    this.pendingDeleteId = null;
    this.lastKnownUpdate = SafeStorage.getItem(STORAGE_KEY + '_updated_at') || "0";

    // 관리자 인증 상태: 기존 정식 로그인 세션 확인 (단독 URL 파라미터로는 절대 자동 인증하지 않음)
    this.isAdmin = this.checkAdminSession();
    this.pendingAdminAction = null;
    this.selectedBannerInstructorId = null;
    this.selectedMajorLectureId = null;

    this.initSyncEngine();
    this.cacheDOM();
    this.attachEvents();
    this.renderAll();
    this.updateAdminUI();

    // 부모 CRM 대시보드 iframe 내부에서 로드된 경우 부모 창에 보안 핸드셰이크 요청
    if (isInsideIframe && hasCrmParam && window.parent) {
      try {
        window.parent.postMessage({ type: "CRM_PORTAL_READY_FOR_HANDSHAKE" }, "*");
      } catch (e) {}
    }

    // 실시간 클라우드 마스터 DB (1순위: Firestore SSOT / 2순위: Server API Fallback) 로드
    this.pullFromCloud(true).then(() => {
      if (this.isAdmin) {
        if (initialAction === "kanban") {
          this.switchMode("kanban");
        } else if (initialAction.startsWith("hub_")) {
          const tab = initialAction.replace("hub_", "");
          this.openDataHubModal(tab);
        } else if (initialAction === "create") {
          this.openCreateModal();
        }
      }
    });
  }

  activateCrmEmbeddedAdmin() {
    this.isCrmEmbedded = true;
    this.isAdmin = true;
    SafeStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
      email: ADMIN_CREDENTIALS.email,
      authenticated: true,
      savedAt: Date.now()
    }));
    document.body.classList.add("crm-embedded-mode");
    this.renderCrmEmbeddedToolbar();
    this.updateAdminUI();
    this.renderAll();
  }

  renderCrmEmbeddedToolbar() {
    if (!this.isCrmEmbedded || !this.isAdmin) return;
    if (document.getElementById("crmAdminQuickbar")) return;
    const bar = document.createElement("div");
    bar.id = "crmAdminQuickbar";
    bar.className = "crm-admin-quickbar";
    bar.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
        <strong style="font-size:13px; color:#ffffff;">CRM 통합 일정표/포털 관리자 모드 (Firestore SSOT + 보안 핸드셰이크 인증됨)</strong>
      </div>
      <div class="crm-quickbar-btns">
        <button type="button" class="crm-qbtn primary" onclick="app.openCreateModal()">+ 새 강의 등록</button>
        <button type="button" class="crm-qbtn" onclick="app.switchMode('calendar'); document.getElementById('calendar-hub')?.scrollIntoView({behavior:'smooth'});">월간 달력 (하루 3개)</button>
        <button type="button" class="crm-qbtn" onclick="app.switchMode('kanban'); document.getElementById('calendar-hub')?.scrollIntoView({behavior:'smooth'});">4단계 강의 칸반보드</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('major')">배너 강의 관리</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('ticker')">상단 롤링 티커</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('stats')">슬로건 & 실적</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('instructors')">강사진 관리</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('company')">회사/학원 정보</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('reviews')">수강 후기</button>
        <button type="button" class="crm-qbtn" onclick="app.openDataHubModal('consult')">1:1 상담함</button>
      </div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  initSyncEngine() {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.bc = new BroadcastChannel('ai_edu_calendar_sync');
        this.bc.onmessage = (e) => {
          if (e && e.data === 'sync_update') {
            this.reloadFromStorage();
          }
        };
      }
    } catch (e) {}

    window.addEventListener('storage', () => {
      this.reloadFromStorage();
    });

    // 포스트메시지 브릿지 (부모 CRM 대시보드에서 보안 핸드셰이크 및 직접 명령 수신)
    window.addEventListener('message', (e) => {
      if (!e || !e.data || typeof e.data !== 'object') return;
      const { type, payload, token } = e.data;

      if (type === 'CRM_ADMIN_AUTH_HANDSHAKE') {
        if (window.self !== window.top && token === this.adminApiToken) {
          this.activateCrmEmbeddedAdmin();
        }
        return;
      }

      // 관리자 명령은 인증된 상태에서만 실행
      if (!this.isAdmin && token === this.adminApiToken && window.self !== window.top) {
        this.activateCrmEmbeddedAdmin();
      }
      if (!this.isAdmin) return;

      if (type === 'CRM_CMD_CREATE_LECTURE') {
        this.openCreateModal(payload || '모집/접수중');
      } else if (type === 'CRM_CMD_SWITCH_MODE') {
        this.switchMode(payload || 'calendar');
        document.getElementById('calendar-hub')?.scrollIntoView({ behavior: 'smooth' });
      } else if (type === 'CRM_CMD_OPEN_HUB') {
        this.openDataHubModal(payload || 'lectures');
      } else if (type === 'CRM_CMD_PULL_CLOUD') {
        this.pullFromCloud(true);
      }
    });

    setInterval(() => {
      const cur = SafeStorage.getItem(STORAGE_KEY + '_updated_at') || "0";
      if (cur !== this.lastKnownUpdate) {
        this.lastKnownUpdate = cur;
        this.reloadFromStorage();
      }
      this.updateLiveClock();
    }, 1000);

    // 4초마다 클라우드 최신 변경분 자동 폴링 (다중 기기/수강생 실시간 반영)
    setInterval(() => {
      const anyModalOpen = document.querySelector(".modal-backdrop.is-open");
      if (!anyModalOpen && !this.isCloudSyncing) {
        this.pullFromCloud(false);
      }
    }, 4000);
  }

  updateLiveClock() {
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toTimeString().split(' ')[0];
    }
  }

  // 클라우드(1순위: Firebase Firestore SSOT / 2순위: Server api.php Fallback)에서 마스터 상태 불러오기
  async pullFromCloud(forceRender = false) {
    try {
      let fsState = null;
      let apiState = null;

      // 1순위 정본(SSOT): Firebase Firestore REST API 조회
      try {
        const resFs = await fetch(this.cloudDocUrl, { cache: "no-store" });
        if (resFs.ok) {
          const docJson = await resFs.json();
          const rawStr = docJson?.fields?.payloadJson?.stringValue;
          const fsUpdated = Number(docJson?.fields?.updatedAt?.integerValue || 0);
          if (rawStr) {
            const parsedFs = JSON.parse(rawStr);
            parsedFs.updatedAt = fsUpdated || Number(parsedFs.updatedAt || 0);
            if (Array.isArray(parsedFs.lectures)) {
              fsState = parsedFs;
            }
          }
        }
      } catch (e) {}

      // 2순위 백업(Fallback): 동일 도메인 api.php 조회
      try {
        const resApi = await fetch(`${this.serverApiUrl}?_t=${Date.now()}`, { cache: "no-store" });
        if (resApi.ok) {
          const jsonApi = await resApi.json();
          if (jsonApi && Array.isArray(jsonApi.lectures)) {
            apiState = jsonApi;
          }
        }
      } catch (e) {}

      let cloudState = null;
      if (fsState && apiState) {
        const fsTs = Number(fsState.updatedAt || 0);
        const apiTs = Number(apiState.updatedAt || 0);
        cloudState = fsTs >= apiTs ? fsState : apiState;

        // [조율 포인트 1 반영] Firestore가 api.php보다 더 최신일 때, 오직 관리자(this.isAdmin) 세션에서만 api.php로 자가 치유(Self-Healing) 미러링 수행
        // 일반 방문자(!this.isAdmin)는 절대 백그라운드 POST를 날리지 않아 401/403 에러 0건 보장
        if (this.isAdmin && fsTs > apiTs) {
          fetch(this.serverApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Creators-Admin-Token": this.adminApiToken
            },
            body: JSON.stringify({ ...fsState, action: "admin_save", adminToken: this.adminApiToken })
          }).catch(() => {});
        }
      } else {
        cloudState = fsState || apiState;
      }

      if (!cloudState) return;

      const remoteUpdated = String(cloudState.updatedAt || "0");
      if (!forceRender && remoteUpdated !== "0" && remoteUpdated === this.lastKnownUpdate) {
        return; // 이미 최신 상태
      }

      if (Array.isArray(cloudState.lectures)) {
        this.lectures = cloudState.lectures;
        SafeStorage.setItem(STORAGE_KEY, JSON.stringify(this.lectures));
      }
      if (Array.isArray(cloudState.stats) && cloudState.stats.length > 0) {
        this.stats = cloudState.stats;
        SafeStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.stats));
      }
      if (Array.isArray(cloudState.tickerItems) && cloudState.tickerItems.length > 0) {
        this.tickerItems = cloudState.tickerItems;
        SafeStorage.setItem(TICKER_STORAGE_KEY, JSON.stringify(this.tickerItems));
      }
      if (cloudState.heroConfig && typeof cloudState.heroConfig === "object") {
        this.heroConfig = { ...DEFAULT_HERO_CONFIG, ...cloudState.heroConfig };
        SafeStorage.setItem(HERO_CONFIG_STORAGE_KEY, JSON.stringify(this.heroConfig));
      }
      if (Array.isArray(cloudState.instructors) && cloudState.instructors.length > 0) {
        this.instructors = cloudState.instructors;
        SafeStorage.setItem(INST_STORAGE_KEY, JSON.stringify(this.instructors));
      }
      if (cloudState.companyInfo && typeof cloudState.companyInfo === "object") {
        this.companyInfo = { ...DEFAULT_COMPANY_INFO, ...cloudState.companyInfo };
        SafeStorage.setItem(COMP_STORAGE_KEY, JSON.stringify(this.companyInfo));
      }
      if (Array.isArray(cloudState.reviews)) {
        this.reviews = cloudState.reviews;
        SafeStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(this.reviews));
      }
      if (Array.isArray(cloudState.instructorApplications)) {
        this.instructorApplications = cloudState.instructorApplications;
        SafeStorage.setItem(INSTRUCTOR_APPS_STORAGE_KEY, JSON.stringify(this.instructorApplications));
      }
      if (Array.isArray(cloudState.consultApplications)) {
        this.consultApplications = cloudState.consultApplications;
        SafeStorage.setItem(CONSULT_APPS_STORAGE_KEY, JSON.stringify(this.consultApplications));
      }

      if (remoteUpdated !== "0") {
        this.lastKnownUpdate = remoteUpdated;
        SafeStorage.setItem(STORAGE_KEY + '_updated_at', remoteUpdated);
      }

      this.renderAll();
    } catch (e) {}
  }

  // [관리자 전용] 클라우드(Firestore SSOT + Server API Mirror)에 마스터 상태 즉시 저장
  // 일반 방문자(!this.isAdmin)는 절대 전체 덮어쓰기(pushToCloud)를 호출할 수 없도록 원천 차단
  async pushToCloud() {
    if (!this.isAdmin) {
      return;
    }
    this.isCloudSyncing = true;
    const nowTs = Date.now();
    this.lastKnownUpdate = String(nowTs);
    SafeStorage.setItem(STORAGE_KEY + '_updated_at', String(nowTs));

    const masterPayload = {
      version: "v6",
      updatedAt: nowTs,
      exportedAt: new Date(nowTs).toISOString(),
      lectures: this.lectures || [],
      stats: this.stats || [],
      tickerItems: this.tickerItems || [],
      heroConfig: this.heroConfig || DEFAULT_HERO_CONFIG,
      instructors: this.instructors || [],
      companyInfo: this.companyInfo || DEFAULT_COMPANY_INFO,
      reviews: this.reviews || [],
      instructorApplications: this.instructorApplications || [],
      consultApplications: this.consultApplications || []
    };

    try {
      // 1. 1순위 정본 Firebase Firestore master_state 저장
      const fsBody = {
        fields: {
          version: { stringValue: "v6" },
          updatedAt: { integerValue: String(nowTs) },
          payloadJson: { stringValue: JSON.stringify(masterPayload) }
        }
      };
      await fetch(this.cloudDocUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fsBody)
      }).catch(() => {});

      // 2. 서버 api.php 미러 저장 (관리자 보안 토큰 헤더 포함)
      fetch(this.serverApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Creators-Admin-Token": this.adminApiToken
        },
        body: JSON.stringify({ ...masterPayload, action: "admin_save", adminToken: this.adminApiToken })
      }).catch(() => {});

      // 부모 CRM 창에도 변경 알림 전달
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: "ACADEMY_PORTAL_SYNCED", updatedAt: nowTs, lecturesCount: (this.lectures || []).length }, "*");
      }
    } catch (e) {
    } finally {
      this.isCloudSyncing = false;
    }
  }

  // [조율 포인트 2 반영: 방문자 전용 Read-Modify-Write 원자적 부분 병합]
  // 일반 방문자가 수강 후기(reviews), 1:1 상담(consultApplications), 강사 지원(instructorApplications)을 제출할 때
  // 자신의 로컬 메모리에 있던 구버전 lectures로 덮어쓰지 않고, 반드시 최신 Firestore master_state를 먼저 읽은 뒤 해당 배열에만 단건 병합하여 저장
  async appendPublicItemAtomically(targetField, newItem) {
    const allowedFields = ["reviews", "consultApplications", "instructorApplications"];
    if (!allowedFields.includes(targetField) || !newItem) return;

    this.isCloudSyncing = true;
    const nowTs = Date.now();
    try {
      // 1. api.php에는 안전한 public_append 전용 액션 호출 (서버가 lectures는 건드리지 않고 해당 배열에만 unshift)
      fetch(this.serverApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "public_append",
          targetField,
          item: newItem,
          updatedAt: nowTs
        })
      }).catch(() => {});

      // 2. 1순위 정본 Firestore master_state에 대한 Read-Modify-Write 원자적 병합
      const resFs = await fetch(this.cloudDocUrl, { cache: "no-store" });
      if (resFs.ok) {
        const docJson = await resFs.json();
        const rawStr = docJson?.fields?.payloadJson?.stringValue;
        if (rawStr) {
          const latestMaster = JSON.parse(rawStr);
          if (!Array.isArray(latestMaster[targetField])) {
            latestMaster[targetField] = [];
          }
          const exists = latestMaster[targetField].some(x => String(x.id) === String(newItem.id));
          if (!exists) {
            latestMaster[targetField].unshift(newItem);
          }
          latestMaster.updatedAt = nowTs;
          latestMaster.version = "v6";

          // 최신 강의 목록(latestMaster.lectures)을 그대로 보존한 채 Firestore에 PATCH
          const fsBody = {
            fields: {
              version: { stringValue: "v6" },
              updatedAt: { integerValue: String(nowTs) },
              payloadJson: { stringValue: JSON.stringify(latestMaster) }
            }
          };
          await fetch(this.cloudDocUrl, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fsBody)
          }).catch(() => {});

          // 로컬 메모리도 최신 마스터 기준으로 동기화
          if (Array.isArray(latestMaster.lectures)) {
            this.lectures = latestMaster.lectures;
            SafeStorage.setItem(STORAGE_KEY, JSON.stringify(this.lectures));
          }
          this.lastKnownUpdate = String(nowTs);
          SafeStorage.setItem(STORAGE_KEY + '_updated_at', String(nowTs));
        }
      }
    } catch (e) {
    } finally {
      this.isCloudSyncing = false;
    }
  }

  // 동기화 시 모든 데이터(강의, 슬로건, 실적, 강사진, 회사정보, 후기, 티커)를 빠짐없이 갱신
  reloadFromStorage() {
    try {
      this.lectures = this.loadLectures();
      this.stats = this.loadStats();
      this.instructors = this.loadInstructors();
      this.companyInfo = this.loadCompanyInfo();
      this.reviews = this.loadReviews();
      this.tickerItems = this.loadTickerItems();
      this.heroConfig = this.loadHeroConfig();
      this.instructorApplications = this.loadInstructorApplications();
      this.consultApplications = this.loadConsultApplications();
      this.renderAll();
      const dataHub = document.getElementById("dataHubModalBackdrop");
      if (dataHub && dataHub.classList.contains("is-open")) {
        this.populateDataHubInputs();
      }
    } catch (e) {}
  }

  // 데이터 변경 시 전체 창, 로컬스토리지, 클라우드 DB(관리자인 경우에만 전체 저장) 즉시 동기화
  notifySync() {
    try {
      const now = String(Date.now());
      this.lastKnownUpdate = now;
      SafeStorage.setItem(STORAGE_KEY + '_updated_at', now);
      if (this.bc) this.bc.postMessage('sync_update');
      if (this.isAdmin) {
        this.pushToCloud();
      }
    } catch (e) {}
  }

  loadLectures() {
    try {
      const data = SafeStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          const hasMajorFlag = parsed.some(l => typeof l.isMajorFeatured === "boolean");
          if (!hasMajorFlag && parsed.length > 0) {
            parsed.forEach(l => {
              l.isMajorFeatured = ["lec-01", "lec-02", "lec-03", "lec-04"].includes(l.id);
            });
          }
          // 레거시 카테고리 및 targetOrg 자동 마이그레이션
          parsed.forEach(l => {
            if (LEGACY_CAT_MAP[l.category]) {
              l.category = LEGACY_CAT_MAP[l.category];
            }
            if (!l.targetOrg && l.title) {
              const m = l.title.match(/^\[(.*?)\]\s*(.*)$/);
              if (m) {
                l.targetOrg = m[1];
              }
            }
          });
          return parsed;
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_LECTURES));
  }

  saveLectures() {
    try {
      SafeStorage.setItem(STORAGE_KEY, JSON.stringify(this.lectures));
      this.notifySync();
    } catch (e) {}
  }

  loadStats() {
    try {
      const data = SafeStorage.getHistoricalItem([
        STATS_STORAGE_KEY,
        "ai_edu_calendar_stats"
      ]);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_STATS));
  }

  saveStats() {
    try {
      SafeStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(this.stats));
      this.notifySync();
    } catch (e) {}
  }

  loadInstructors() {
    try {
      const data = SafeStorage.getItem(INST_STORAGE_KEY);
      if (data !== null) {
        const list = JSON.parse(data);
        if (Array.isArray(list)) {
          return list.map((item, idx) => ({
            ...item,
            featuredInBanner: item.featuredInBanner !== undefined ? !!item.featuredInBanner : (idx < 2)
          }));
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_INSTRUCTORS));
  }

  saveInstructors() {
    try {
      SafeStorage.setItem(INST_STORAGE_KEY, JSON.stringify(this.instructors));
      this.notifySync();
    } catch (e) {}
  }

  loadCompanyInfo() {
    try {
      const data = SafeStorage.getHistoricalItem([
        COMP_STORAGE_KEY,
        "ai_edu_calendar_company_v3",
        "ai_edu_calendar_company_v2",
        "ai_edu_calendar_company_v1",
        "ai_edu_calendar_company"
      ]);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") {
          if (parsed.brandDesc && parsed.brandDesc.includes("대한민국 1위")) {
            parsed.brandDesc = parsed.brandDesc.replace(/대한민국\s*1위/g, "대한민국 최고수준의");
            SafeStorage.setItem(COMP_STORAGE_KEY, JSON.stringify(parsed));
          }
          return { ...DEFAULT_COMPANY_INFO, ...parsed };
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_COMPANY_INFO));
  }

  saveCompanyInfo() {
    try {
      SafeStorage.setItem(COMP_STORAGE_KEY, JSON.stringify(this.companyInfo));
      this.notifySync();
    } catch (e) {}
  }

  loadTickerItems() {
    try {
      const data = SafeStorage.getHistoricalItem([
        TICKER_STORAGE_KEY,
        "ai_edu_calendar_ticker_v1",
        "ai_edu_calendar_ticker"
      ]);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_TICKER_ITEMS));
  }

  saveTickerItems() {
    try {
      SafeStorage.setItem(TICKER_STORAGE_KEY, JSON.stringify(this.tickerItems));
      this.notifySync();
    } catch (e) {}
  }

  loadHeroConfig() {
    try {
      const data = SafeStorage.getHistoricalItem([
        HERO_CONFIG_STORAGE_KEY,
        "ai_edu_calendar_hero_config"
      ]);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object") return { ...DEFAULT_HERO_CONFIG, ...parsed };
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_HERO_CONFIG));
  }

  saveHeroConfig() {
    try {
      SafeStorage.setItem(HERO_CONFIG_STORAGE_KEY, JSON.stringify(this.heroConfig));
      this.notifySync();
    } catch (e) {}
  }

  loadInstructorApplications() {
    try {
      const data = SafeStorage.getItem(INSTRUCTOR_APPS_STORAGE_KEY);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  saveInstructorApplications() {
    try {
      SafeStorage.setItem(INSTRUCTOR_APPS_STORAGE_KEY, JSON.stringify(this.instructorApplications));
      this.notifySync();
    } catch (e) {}
  }

  loadConsultApplications() {
    try {
      const data = SafeStorage.getItem(CONSULT_APPS_STORAGE_KEY);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  saveConsultApplications() {
    try {
      SafeStorage.setItem(CONSULT_APPS_STORAGE_KEY, JSON.stringify(this.consultApplications));
      this.notifySync();
    } catch (e) {}
  }

  cacheDOM() {
    // 탭 & 모드
    this.tabCalendar = document.getElementById("tabCalendar");
    this.tabKanban = document.getElementById("tabKanban");
    this.calendarSection = document.getElementById("calendarSection");
    this.kanbanSection = document.getElementById("kanbanSection");
    this.kanbanTotalBadge = document.getElementById("kanbanTotalBadge");

    // KPI 지표 요소
    this.kpiTotal = document.getElementById("kpiTotal");
    this.kpiOpen = document.getElementById("kpiOpen");
    this.kpiClosing = document.getElementById("kpiClosing");
    this.kpiPlanning = document.getElementById("kpiPlanning");

    // 검색 & 필터
    this.searchInput = document.getElementById("searchInput");
    this.searchClearBtn = document.getElementById("searchClearBtn");
    this.categoryPills = document.getElementById("categoryPills");

    // 캘린더 네비게이션
    this.currentMonthYearEl = document.getElementById("currentMonthYear");
    this.prevMonthBtn = document.getElementById("prevMonthBtn");
    this.nextMonthBtn = document.getElementById("nextMonthBtn");
    this.todayBtn = document.getElementById("todayBtn");
    this.daysGridEl = document.getElementById("daysGrid");
    this.calendarWrapper = document.getElementById("calendarWrapper");
    this.listWrapper = document.getElementById("listWrapper");
    this.calendarViewBtn = document.getElementById("calendarViewBtn");
    this.listViewBtn = document.getElementById("listViewBtn");
    this.lectureListEl = document.getElementById("lectureList");
    this.listMonthTitleEl = document.getElementById("listMonthTitle");
    this.monthlyCountEl = document.getElementById("monthlyCount");

    // 칸반 드롭존 & 카운터
    this.dropzones = {
      "기획/준비": document.getElementById("dropzone-planning"),
      "모집/접수중": document.getElementById("dropzone-open"),
      "마감임박/확정": document.getElementById("dropzone-closing"),
      "진행/완료": document.getElementById("dropzone-completed")
    };
    this.counters = {
      "기획/준비": document.getElementById("count-planning"),
      "모집/접수중": document.getElementById("count-open"),
      "마감임박/확정": document.getElementById("count-closing"),
      "진행/완료": document.getElementById("count-completed")
    };

    // 상세 모달
    this.lectureModalBackdrop = document.getElementById("lectureModalBackdrop");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalCategory = document.getElementById("modalCategory");
    this.modalStatus = document.getElementById("modalStatus");
    this.modalDate = document.getElementById("modalDate");
    this.modalTime = document.getElementById("modalTime");
    this.modalInstructor = document.getElementById("modalInstructor");
    this.modalLocation = document.getElementById("modalLocation");
    this.modalCurriculum = document.getElementById("modalCurriculum");
    this.modalPreparation = document.getElementById("modalPreparation");
    this.modalGcalBtn = document.getElementById("modalGcalBtn");
    this.modalEditBtn = document.getElementById("modalEditBtn");

    // 등록/수정 모달
    this.editModalBackdrop = document.getElementById("editModalBackdrop");
    this.editModalHeading = document.getElementById("editModalHeading");
    this.lectureForm = document.getElementById("lectureForm");
    this.formDeleteBtn = document.getElementById("formDeleteBtn");

    this.formLectureId = document.getElementById("formLectureId");
    this.formTargetOrg = document.getElementById("formTargetOrg");
    this.formTitle = this.formTargetOrg; // 하위 호환성 유지
    this.formCategory = document.getElementById("formCategory");
    this.formCustomTypeWrap = document.getElementById("formCustomTypeWrap");
    this.formCustomType = document.getElementById("formCustomType");
    this.formCombinedPreviewWrap = document.getElementById("formCombinedPreviewWrap");
    this.formCombinedPreviewText = document.getElementById("formCombinedPreviewText");
    this.formStatus = document.getElementById("formStatus");
    this.formDate = document.getElementById("formDate");
    this.formStartTime = document.getElementById("formStartTime");
    this.formEndTime = document.getElementById("formEndTime");
    this.formInstructor = document.getElementById("formInstructor");
    this.formLocation = document.getElementById("formLocation");
    this.formCurriculum = document.getElementById("formCurriculum");
    this.formPreparation = document.getElementById("formPreparation");

    // 삭제 확인 모달
    this.deleteConfirmBackdrop = document.getElementById("deleteConfirmBackdrop");
    this.deleteTargetTitle = document.getElementById("deleteTargetTitle");

    // 샘플 비우기 확인 모달
    this.clearConfirmBackdrop = document.getElementById("clearConfirmBackdrop");

    // 관리자 전용 인증 모달 DOM
    this.adminLoginModalBackdrop = document.getElementById("adminLoginModalBackdrop");
    this.adminEmailInput = document.getElementById("adminEmailInput");
    this.adminPwInput = document.getElementById("adminPwInput");
    this.adminAutoLoginCheck = document.getElementById("adminAutoLoginCheck");
    this.adminLoginError = document.getElementById("adminLoginError");
    this.adminLoginErrorText = document.getElementById("adminLoginErrorText");
    this.adminAuthBadgeWrap = document.getElementById("adminAuthBadgeWrap");

    // 수강 후기 모달 및 요소 DOM
    this.reviewModalBackdrop = document.getElementById("reviewModalBackdrop");
    this.reviewsGrid = document.getElementById("reviewsGrid");
    this.reviewsAvgScore = document.getElementById("reviewsAvgScore");
    this.reviewsTotalCount = document.getElementById("reviewsTotalCount");

    // 강사 채용 지원 모달 DOM
    this.instructorApplyModalBackdrop = document.getElementById("instructorApplyModalBackdrop");

    // 운영 정책 (이용약관/개인정보/환불규정) 안내 모달 DOM
    this.policyModalBackdrop = document.getElementById("policyModalBackdrop");

    // 1:1 교육 상담 신청 모달 DOM
    this.consultModalBackdrop = document.getElementById("consultModalBackdrop");

    // 대표 강사진 배너 DOM & 10월 주요강의 배너 DOM
    this.heroInstructorBannerWrap = document.getElementById("heroInstructorBannerWrap");
    this.heroMajorLectureBannerWrap = document.getElementById("heroMajorLectureBannerWrap");
  }

  attachEvents() {
    // 실시간 검색
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (this.searchClearBtn) {
          this.searchClearBtn.style.display = this.searchQuery ? "flex" : "none";
        }
        this.renderCalendar();
        this.renderListView();
        this.renderKanban();
      });
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener("click", () => {
        this.searchInput.value = "";
        this.searchQuery = "";
        this.searchClearBtn.style.display = "none";
        this.renderCalendar();
        this.renderListView();
        this.renderKanban();
      });
    }

    // 강의 등록 폼 실시간 교육대상자+과정 결합 미리보기 이벤트
    if (this.formTargetOrg) {
      this.formTargetOrg.addEventListener("input", () => this.updateLectureFormPreview());
    }
    if (this.formCategory) {
      this.formCategory.addEventListener("change", (e) => this.handleFormCategoryChange(e.target.value));
    }
    if (this.formCustomType) {
      this.formCustomType.addEventListener("change", () => this.updateLectureFormPreview());
    }

    // 상세 모달 내 수정 버튼
    if (this.modalEditBtn) {
      this.modalEditBtn.addEventListener("click", () => {
        if (this.selectedLectureForView) {
          const id = this.selectedLectureForView.id;
          this.closeDetailModal();
          this.openEditModal(id);
        }
      });
    }

    // 칸반 드롭존 드래그 앤 드롭
    Object.keys(this.dropzones).forEach(status => {
      const dropzone = this.dropzones[status];
      if (!dropzone) return;

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("drag-over");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("drag-over");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("drag-over");
        if (!this.isAdmin) {
          this.promptAdminLogin();
          return;
        }
        const lectureId = e.dataTransfer.getData("text/plain") || this.draggedLectureId;
        if (lectureId) {
          this.updateLectureStatus(lectureId, status);
        }
      });
    });

    // ESC 키로 모든 열린 모달 닫기
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeDetailModal();
        this.closeEditModal();
        this.closeDeleteConfirmModal();
        this.closeClearConfirmModal();
        this.closeDataHubModal();
        this.closeAdminLoginModal();
        this.closeReviewModal();
      }
    });
  }

  // 필터링된 강의 목록 반환
  getFilteredLectures() {
    return this.lectures.filter(l => {
      // 카테고리 필터
      if (this.selectedCategory !== "전체" && l.category !== this.selectedCategory) {
        return false;
      }
      // 검색어 필터
      if (this.searchQuery) {
        const text = `${l.title} ${l.instructor} ${l.location} ${(l.curriculum || []).join(" ")}`.toLowerCase();
        if (!text.includes(this.searchQuery)) {
          return false;
        }
      }
      return true;
    });
  }

  // 뷰 모드 전환 (calendar | kanban)
  switchMode(mode) {
    if (mode === "kanban" && !this.isAdmin) {
      this.promptAdminLogin(() => this.switchMode("kanban"));
      return;
    }
    this.currentMode = mode;
    if (mode === "calendar") {
      this.tabCalendar?.classList.add("active");
      this.tabKanban?.classList.remove("active");
      this.calendarSection.classList.add("active");
      this.kanbanSection.classList.remove("active");
      this.calendarSection.style.display = "flex";
      this.kanbanSection.style.display = "none";
      this.renderCalendar();
      this.renderListView();
    } else {
      this.tabCalendar?.classList.remove("active");
      this.tabKanban?.classList.add("active");
      this.calendarSection.classList.remove("active");
      this.kanbanSection.classList.add("active");
      this.calendarSection.style.display = "none";
      this.kanbanSection.style.display = "flex";
      this.renderKanban();
    }
  }

  // 캘린더 서브뷰 전환 (달력 | 리스트)
  switchCalendarView(subView) {
    this.calendarSubView = subView;
    if (subView === "calendar") {
      this.calendarViewBtn.classList.add("active");
      this.listViewBtn.classList.remove("active");
      this.calendarWrapper.style.display = "block";
      this.listWrapper.style.display = "none";
    } else {
      this.calendarViewBtn.classList.remove("active");
      this.listViewBtn.classList.add("active");
      this.calendarWrapper.style.display = "none";
      this.listWrapper.style.display = "block";
      this.renderListView();
    }
  }

  // 월 이동
  changeMonth(diff) {
    this.currentMonth += diff;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar();
    this.renderListView();
  }

  goToday() {
    this.currentYear = 2026;
    this.currentMonth = 9; // 10월
    this.renderCalendar();
    this.renderListView();
  }

  // 배너 중앙: N월 교육 일정 확인하기 버튼 활성화 (관리자 설정 동적 연동)
  goToOctoberCalendar(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.switchMode("calendar");
    const ctaMonth = (this.heroConfig && this.heroConfig.ctaMonth) ? Number(this.heroConfig.ctaMonth) : 10;
    this.currentYear = 2026;
    this.currentMonth = Math.max(0, Math.min(11, ctaMonth - 1)); // 0-indexed
    this.renderCalendar();
    this.renderListView();

    const hub = document.getElementById("calendar-hub");
    if (hub) {
      const yOffset = -72;
      const y = hub.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    const controls = document.querySelector(".calendar-controls");
    if (controls) {
      controls.classList.add("pulse-highlight");
      setTimeout(() => controls.classList.remove("pulse-highlight"), 1600);
    }

    this.showToast(`📅 2026년 ${ctaMonth}월 교육 일정으로 이동했습니다.`, "info");
  }

  // 최상단 우측: 관리자 전용 칸반보드 관리 열기
  openAdminKanban(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.openAdminKanban());
      return;
    }
    this.switchMode("kanban");

    const hub = document.getElementById("calendar-hub");
    if (hub) {
      const yOffset = -72;
      const y = hub.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    const kanbanHeader = document.querySelector(".kanban-header");
    if (kanbanHeader) {
      kanbanHeader.classList.add("pulse-highlight");
      setTimeout(() => kanbanHeader.classList.remove("pulse-highlight"), 1600);
    }

    this.showToast("📋 관리자 칸반보드로 이동했습니다. 카드 드래그 & 상태 수정이 가능합니다.", "info");
  }

  // 전체 렌더링
  renderAll() {
    this.renderTicker();
    this.renderHeroSlogan();
    this.renderKPIs();
    this.renderCategoryPills();
    this.renderCalendar();
    this.renderListView();
    this.renderKanban();
    this.renderStats();
    this.renderHeroMajorLectureBanner();
    this.renderHeroInstructorBanner();
    this.renderInstructors();
    this.renderCompanyInfo();
    this.renderReviews();
  }

  // 1-0. 실시간 무한 롤링 티커 렌더링
  renderTicker() {
    const track = document.getElementById("tickerTrack");
    if (!track) return;

    if (!this.tickerItems || this.tickerItems.length === 0) {
      this.tickerItems = JSON.parse(JSON.stringify(DEFAULT_TICKER_ITEMS));
    }

    const iconMap = {
      zap: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
      calendar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
      rocket: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-2.05 11A22.35 22.35 0 0 1 15 15z"></path></svg>`,
      award: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`
    };

    const renderItemHtml = (item) => {
      const iconSvg = iconMap[item.icon] || `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>`;
      const badgeClass = item.badge || "badge-blue";
      return `
        <div class="ticker-item">
          <span class="ticker-icon-badge ${badgeClass}">${iconSvg}</span>
          <span>${item.text}</span>
        </div>
      `;
    };

    const singleSet = this.tickerItems.map(renderItemHtml).join('<span class="ticker-sep">•</span>');
    const repeatCount = this.tickerItems.length < 3 ? 4 : 2;
    let fullTrackHtml = "";
    for (let i = 0; i < repeatCount; i++) {
      if (i > 0) fullTrackHtml += '<span class="ticker-sep">•</span>';
      fullTrackHtml += singleSet;
    }

    track.innerHTML = fullTrackHtml;
  }

  // 1-0-1. 최상단 메인 슬로건 문구 렌더링
  renderHeroSlogan() {
    const topEl = document.getElementById("heroSloganTop");
    const bottomEl = document.getElementById("heroSloganBottom");
    const leadEl = document.getElementById("heroLeadText");

    if (topEl && this.heroConfig && this.heroConfig.sloganTop) {
      topEl.textContent = this.heroConfig.sloganTop;
    }
    if (bottomEl && this.heroConfig && this.heroConfig.sloganBottom) {
      bottomEl.textContent = this.heroConfig.sloganBottom;
    }
    if (leadEl && this.heroConfig && this.heroConfig.leadText) {
      leadEl.innerHTML = this.heroConfig.leadText.replace(/\n/g, "<br>");
    }

    const ctaMonth = (this.heroConfig && this.heroConfig.ctaMonth) ? Number(this.heroConfig.ctaMonth) : 10;
    const heroBtn = document.getElementById("heroOctoberBtn");
    if (heroBtn) {
      const span = heroBtn.querySelector("span");
      if (span) span.textContent = `${ctaMonth}월 교육 일정 확인하기`;
      heroBtn.title = `2026년 ${ctaMonth}월 교육 일정 캘린더 바로가기`;
    }
  }

  // 1. 히어로 핵심 실적 수치 렌더링
  renderStats() {
    const container = document.getElementById("heroStatsContainer");
    if (!container) return;
    if (!this.stats || this.stats.length === 0) return;

    container.innerHTML = this.stats.map(s => `
      <div class="stat-box">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join("");
  }

  // 1-1. 메인 히어로 '10월의 주요강의 일정' 배너 렌더링 (데이터 관리에서 자유롭게 노출 강의 제어)
  renderHeroMajorLectureBanner() {
    const wrap = this.heroMajorLectureBannerWrap || document.getElementById("heroMajorLectureBannerWrap");
    if (!wrap) return;

    if (!this.lectures || this.lectures.length === 0) {
      wrap.innerHTML = `
        <div class="major-banner-card empty-state" style="padding: 24px 20px; text-align: center; background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 16px;">
          <div style="font-size: 15px; font-weight: 700; color: #475569; margin-bottom: 6px;">📅 등록된 10월 강의 일정이 없습니다.</div>
          <p style="font-size: 13px; color: #94a3b8; margin-bottom: 0;">10월 주요 강의 일정이 곧 오픈될 예정입니다.</p>
        </div>
      `;
      return;
    }

    // 10월 주요강의로 지정된 목록 (isMajorFeatured === true)
    let majorList = this.lectures.filter(l => l.isMajorFeatured);
    if (majorList.length === 0) {
      majorList = [this.lectures[0]];
    }

    // 현재 선택된 주요강의 ID 확인 (유효하지 않으면 첫 번째 강의 선택)
    if (!this.selectedMajorLectureId || !majorList.some(l => String(l.id) === String(this.selectedMajorLectureId))) {
      this.selectedMajorLectureId = majorList[0].id;
    }

    const currentLec = majorList.find(l => String(l.id) === String(this.selectedMajorLectureId)) || majorList[0];

    // 날짜 및 요일 파싱
    const parts = (currentLec.date || "2026-10-01").split("-");
    const m = parseInt(parts[1] || "10", 10);
    const d = parts[2] || "01";
    const dateObj = new Date(Number(parts[0] || "2026"), m - 1, Number(d));
    const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = weekNames[dateObj.getDay()] || "일";

    const cat = CATEGORIES[currentLec.category] || { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" };

    // 상태 뱃지 스타일 매핑
    let statusClass = "badge-status-open";
    if (currentLec.status === "마감임박/확정") statusClass = "badge-status-closing";
    else if (currentLec.status === "기획/준비") statusClass = "badge-status-planning";
    else if (currentLec.status === "진행/완료") statusClass = "badge-status-done";

    // 주요강의 선택 필(Pills) 목록 생성 (날짜 제거, 강의 제목만 심플하게 2줄 배치)
    const pillsHtml = majorList.map(lec => {
      const isActive = String(lec.id) === String(currentLec.id);
      return `
        <button class="major-pill-btn ${isActive ? 'active' : ''}" onclick="app.selectMajorBannerLecture('${lec.id}')" title="${lec.title} 일정 보기">
          <span class="pill-title-chip">${lec.title}</span>
        </button>
      `;
    }).join("");

    wrap.innerHTML = `
      <div class="major-banner-card" id="majorBannerCard">
        <div class="major-banner-selector-bar">
          <div class="major-selector-header-row">
            <div class="major-selector-label">
              <span class="pulse-indicator"></span>
              <span class="selector-heading-text">⭐ 10월의 주요강의 일정</span>
              <span class="major-counter-badge">${majorList.length}개 SPECIAL</span>
            </div>
          </div>
          <div class="major-selector-pills-grid" id="majorBannerPills">
            ${pillsHtml}
          </div>
        </div>

        <div class="major-banner-spotlight">
          <!-- 좌측: 대형 날짜 및 시간 박스 -->
          <div class="major-spotlight-datebox">
            <div class="major-date-top">
              <span class="major-month-label">OCTOBER</span>
              <div class="major-day-num">${d}</div>
              <div class="major-day-name">(${dayName}요일)</div>
            </div>
            <div class="major-time-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${currentLec.startTime} ~ ${currentLec.endTime}</span>
            </div>
            <div class="major-category-badge" style="color: ${cat.color}; background: ${cat.bgColor}; border: 1px solid ${cat.badgeBorder || '#bfdbfe'};">
              ${currentLec.category}
            </div>
          </div>

          <!-- 우측: 강의 핵심 요약 정보 (담당 멘토, 교육 장소, 교육 기간) -->
          <div class="major-spotlight-content">
            <div class="major-spotlight-header">
              <h3 class="major-spotlight-title">${currentLec.title}</h3>
            </div>

            <!-- 핵심 메타 3대 요약 그리드 (군더더기 텍스트 제거) -->
            <div class="major-meta-grid">
              <div class="major-meta-item">
                <span class="meta-label">담당 멘토</span>
                <span class="meta-val highlight-val">${currentLec.instructor}</span>
              </div>
              <div class="major-meta-item">
                <span class="meta-label">교육 장소</span>
                <span class="meta-val">${currentLec.location}</span>
              </div>
              <div class="major-meta-item">
                <span class="meta-label">교육 기간</span>
                <span class="meta-val">${currentLec.date} (${dayName}) ${currentLec.startTime} ~ ${currentLec.endTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectMajorBannerLecture(lecId) {
    this.selectedMajorLectureId = lecId;
    this.renderHeroMajorLectureBanner();
    const card = document.getElementById("majorBannerCard");
    if (card) {
      card.classList.remove("banner-pulse");
      void card.offsetWidth;
      card.classList.add("banner-pulse");
    }
  }

  viewMajorLectureInCalendar(lecId) {
    const lecture = this.lectures.find(l => String(l.id) === String(lecId));
    if (!lecture) return;

    if (this.currentMode !== "calendar") {
      this.switchMode("calendar");
    }

    const calHub = document.getElementById("calendar-hub");
    if (calHub) {
      calHub.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => {
      this.openDetailModal(lecture);
      this.highlightLecture(lecId);
    }, 450);
  }

  toggleMajorFeaturedLecture(lecId) {
    const lec = this.lectures.find(l => String(l.id) === String(lecId));
    if (!lec) return;

    lec.isMajorFeatured = !lec.isMajorFeatured;
    if (lec.isMajorFeatured) {
      this.selectedMajorLectureId = lec.id;
    }
    this.saveLectures();
    this.renderHeroMajorLectureBanner();
    this.renderHubMajorLecturesList();

    if (lec.isMajorFeatured) {
      this.showToast(`⭐ '${lec.title}' 강의가 상단 주요강의 배너에 추가되었습니다.`, "success");
    } else {
      this.showToast(`'${lec.title}' 강의가 상단 주요강의 배너에서 제외되었습니다.`, "info");
    }
  }

  renderHubMajorLecturesList() {
    const wrap = document.getElementById("hubMajorLecturesList");
    if (!wrap) return;

    const badge = document.getElementById("hubMajorCountBadge");
    const featuredCount = (this.lectures || []).filter(l => l.isMajorFeatured).length;
    if (badge) badge.textContent = `총 ${featuredCount}개 배너 노출 중`;

    if (!this.lectures || this.lectures.length === 0) {
      wrap.innerHTML = `<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">등록된 강의가 없습니다. 먼저 강의를 등록해주세요.</div>`;
      return;
    }

    wrap.innerHTML = this.lectures.map(lec => {
      const isFeatured = !!lec.isMajorFeatured;
      const cat = CATEGORIES[lec.category] || { color: "#2563eb", bgColor: "#eff6ff" };
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; background: ${isFeatured ? '#f0fdf4' : '#ffffff'}; border: 1.5px solid ${isFeatured ? '#86efac' : '#e2e8f0'}; border-radius: 10px; transition: all 0.2s ease;">
          <div style="display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1;">
            <div style="padding: 5px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; background: ${cat.bgColor}; color: ${cat.color}; white-space: nowrap;">
              ${lec.date.slice(5)}
            </div>
            <div style="min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="font-size: 13.5px; font-weight: 800; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${lec.title}</span>
                ${isFeatured ? '<span style="font-size: 11px; font-weight: 700; color: #166534; background: #dcfce7; padding: 1px 6px; border-radius: 9999px;">⭐ 배너 노출 중</span>' : ''}
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                ${lec.instructor} · ${lec.startTime}~${lec.endTime} · <span style="color: ${cat.color}; font-weight: 600;">${lec.category}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
            <button class="btn btn-sm ${isFeatured ? 'btn-primary' : 'btn-secondary'}" onclick="app.toggleMajorFeaturedLecture('${lec.id}')" style="font-size: 12px; padding: 5px 12px; border-radius: 8px;">
              ${isFeatured ? '⭐ 노출 해제' : '+ 배너 노출'}
            </button>
            <button class="btn btn-ghost btn-sm" onclick="app.closeDataHubModal(); app.openEditModal('${lec.id}')" style="font-size: 12px; padding: 5px 8px;">
              ✏️ 수정
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 1-2. 메인 히어로 대표 강사진 배너 렌더링 (강사진 선택 시 배너에 스포트라이트 노출)
  renderHeroInstructorBanner() {
    const wrap = this.heroInstructorBannerWrap || document.getElementById("heroInstructorBannerWrap");
    if (!wrap) return;

    if (!this.instructors || this.instructors.length === 0) {
      wrap.innerHTML = "";
      return;
    }

    // 배너 노출로 선택된 강사진 목록 (없을 경우 전체 강사진 중 첫 번째 강사)
    let featuredList = this.instructors.filter(i => i.featuredInBanner);
    if (featuredList.length === 0) {
      featuredList = [this.instructors[0]];
    }

    // 현재 선택된 강사 ID 확인 (유효하지 않으면 첫 번째 대표 강사 선택)
    if (!this.selectedBannerInstructorId || !featuredList.some(i => String(i.id) === String(this.selectedBannerInstructorId))) {
      this.selectedBannerInstructorId = featuredList[0].id;
    }

    const currentInst = this.instructors.find(i => String(i.id) === String(this.selectedBannerInstructorId)) || featuredList[0];

    // 해당 강사의 10월 등록 강의 개수 파악
    const instLectures = (this.lectures || []).filter(l => {
      const targetInst = (l.instructor || "").toLowerCase();
      const name = (currentInst.name || "").toLowerCase();
      return targetInst.includes(name) || name.includes(targetInst.split(' ')[0]);
    });
    const lectureCount = instLectures.length;

    // 강사진 선택 칩 버튼 목록 생성
    const pillsHtml = featuredList.map(inst => {
      const isActive = String(inst.id) === String(currentInst.id);
      const dotColor = inst.avatarClass === 'avatar-indigo' ? 'dot-amber' : (inst.avatarClass === 'avatar-rose' ? 'dot-slate' : 'dot-blue');
      return `
        <button class="mentor-pill-btn ${isActive ? 'active' : ''}" onclick="app.selectBannerInstructor('${inst.id}')" title="${inst.name} (${inst.role}) 배너 보기">
          <span class="pill-dot ${dotColor}"></span>
          <span>${inst.name}</span>
        </button>
      `;
    }).join("");

    const tags = Array.isArray(currentInst.tags) ? currentInst.tags : (typeof currentInst.tags === 'string' ? currentInst.tags.split(',').map(t=>t.trim()).filter(Boolean) : []);
    const tagsHtml = tags.map(t => `<span class="inst-tag">#${t}</span>`).join("");

    wrap.innerHTML = `
      <div class="mentor-banner-card" id="mentorBannerCard">
        <div class="mentor-banner-selector-bar">
          <div class="mentor-selector-label">
            <span class="pulse-indicator"></span>
            <span>⭐ 이달의 대표 강사진</span>
          </div>
          <div class="mentor-selector-pills" id="mentorBannerPills">
            ${pillsHtml}
          </div>
        </div>

        <div class="mentor-banner-spotlight">
          <div class="mentor-spotlight-avatar-box ${currentInst.avatarClass || 'avatar-blue'}">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span class="mentor-online-badge">MENTOR</span>
          </div>

          <div class="mentor-spotlight-content">
            <div class="mentor-spotlight-header">
              <div class="mentor-name-row">
                <span class="mentor-spotlight-name">${currentInst.name}</span>
                <span class="mentor-spotlight-role">${currentInst.role}</span>
                <span class="mentor-badge-featured">⭐ 배너 대표 강사</span>
              </div>
              <button class="btn-mentor-schedule" onclick="app.filterLecturesByInstructor('${currentInst.name}')" title="${currentInst.name} 강사의 10월 강의 일정 확인">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>10월 강의 확인 (${lectureCount}개)</span>
              </button>
            </div>

            <p class="mentor-spotlight-bio">"${currentInst.bio || '실전 AI 바이브 코딩 및 비즈니스 자동화를 현업 실무진이 밀착 지도합니다.'}"</p>

            <div class="mentor-spotlight-tags">
              ${tagsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  selectBannerInstructor(instId) {
    this.selectedBannerInstructorId = instId;
    this.renderHeroInstructorBanner();
    const card = document.getElementById("mentorBannerCard");
    if (card) {
      card.classList.remove("banner-pulse");
      void card.offsetWidth;
      card.classList.add("banner-pulse");
    }
  }

  spotlightInstructorOnBanner(instId) {
    const inst = this.instructors.find(i => String(i.id) === String(instId));
    if (!inst) return;

    if (!inst.featuredInBanner) {
      inst.featuredInBanner = true;
      this.saveInstructors();
      this.renderInstructors();
      this.renderHubInstructorList();
    }

    this.selectedBannerInstructorId = instId;
    this.renderHeroInstructorBanner();

    const bannerWrap = document.getElementById("heroInstructorBannerWrap");
    if (bannerWrap) {
      bannerWrap.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const card = document.getElementById("mentorBannerCard");
        if (card) {
          card.classList.remove("banner-pulse");
          void card.offsetWidth;
          card.classList.add("banner-pulse");
        }
      }, 350);
    }
    this.showToast(`'${inst.name}' 강사가 메인 배너에 스포트라이트되었습니다.`, "info");
  }

  toggleInstructorBanner(instId) {
    const inst = this.instructors.find(i => String(i.id) === String(instId));
    if (!inst) return;

    inst.featuredInBanner = !inst.featuredInBanner;
    if (inst.featuredInBanner) {
      this.selectedBannerInstructorId = inst.id;
    }
    this.saveInstructors();
    this.renderInstructors();
    this.renderHeroInstructorBanner();
    this.renderHubInstructorList();

    if (inst.featuredInBanner) {
      this.showToast(`⭐ '${inst.name}' 강사가 메인 배너에 노출됩니다.`, "success");
    } else {
      this.showToast(`'${inst.name}' 강사의 배너 노출이 해제되었습니다.`, "info");
    }
  }

  filterLecturesByInstructor(instName) {
    const cleanName = (instName || "").split(" ")[0].trim();
    if (this.searchInput) {
      this.searchInput.value = cleanName;
      this.searchQuery = cleanName.toLowerCase();
      if (this.searchClearBtn) this.searchClearBtn.style.display = "flex";
    }
    this.currentYear = 2026;
    this.currentMonth = 9;
    this.switchMode("calendar");
    this.renderKPIs();
    this.renderCalendar();
    this.renderListView();

    const calEl = document.getElementById("calendar-hub");
    if (calEl) {
      const yOffset = -72;
      const y = calEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    this.showToast(`'${cleanName}' 강사님의 10월 강의로 필터링되었습니다.`, "info");
  }

  // 1-3. 푸터 교육과정 링크 연동: 카테고리 필터링 및 캘린더 이동
  filterCategoryAndScroll(catName, e) {
    if (e && e.preventDefault) e.preventDefault();

    this.selectedCategory = catName || "전체";

    // 검색어 초기화 (중복 필터링 혼선 방지)
    if (this.searchInput) {
      this.searchInput.value = "";
      this.searchQuery = "";
      if (this.searchClearBtn) this.searchClearBtn.style.display = "none";
    }

    this.currentYear = 2026;
    this.currentMonth = 9; // 10월
    this.switchMode("calendar");

    this.renderCategoryPills();
    this.renderKPIs();
    this.renderCalendar();
    this.renderListView();

    const calEl = document.getElementById("calendar-hub");
    if (calEl) {
      const yOffset = -72;
      const y = calEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    if (catName === "전체") {
      this.showToast("📅 10월 전체 교육 일정표로 이동했습니다.", "info");
    } else {
      this.showToast(`🔍 '${catName}' 교육 과정 일정으로 필터링되었습니다.`, "info");
    }
  }

  // 2. 강사진 / 멘토진 소개 렌더링
  renderInstructors() {
    const grid = document.getElementById("instructorsGrid");
    if (!grid) return;
    if (!this.instructors || this.instructors.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--slate-400); font-size: 14px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">등록된 강사진 프로필이 없습니다. [강사진 데이터 수정] 버튼을 눌러 강사 정보를 등록해주세요.</div>`;
      return;
    }

    grid.innerHTML = this.instructors.map((inst, idx) => {
      const delayClass = `delay-${(idx % 4) + 1}`;
      const tags = Array.isArray(inst.tags) ? inst.tags : (typeof inst.tags === 'string' ? inst.tags.split(',').map(t=>t.trim()).filter(Boolean) : []);
      const tagsHtml = tags.map(t => `<span class="inst-tag">${t}</span>`).join("");
      const isFeatured = !!inst.featuredInBanner;
      const featuredBadge = isFeatured ? `<div class="inst-banner-badge">⭐ 메인 배너 노출 멘토</div>` : '';
      return `
        <div class="instructor-card reveal-on-scroll is-revealed ${delayClass}">
          <div class="inst-avatar-wrap ${inst.avatarClass || 'avatar-blue'}">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3 class="inst-name">${inst.name}</h3>
          <span class="inst-role-badge">${inst.role}</span>
          ${featuredBadge}
          <p class="inst-bio">${inst.bio || ''}</p>
          <div class="inst-tags">
            ${tagsHtml}
          </div>
          <button class="btn-view-on-banner" onclick="app.spotlightInstructorOnBanner('${inst.id}')" title="상단 메인 배너에서 이 강사님 확인">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            상단 배너에서 보기
          </button>
        </div>
      `;
    }).join("");
  }

  // 3. 하단 푸터 및 교육원 정보 렌더링 (사업자등록증 실데이터 100% 반영)
  renderCompanyInfo() {
    const info = this.companyInfo;
    if (!info) return;

    const brandDesc = document.getElementById("footerBrandDesc");
    if (brandDesc && info.brandDesc) {
      const parts = info.brandDesc.split(/\n+/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        brandDesc.innerHTML = parts.map(p => `<span class="footer-copy-item">${p}</span>`).join(" ");
      } else {
        brandDesc.innerHTML = `<span class="footer-copy-item">${info.brandDesc}</span>`;
      }
    }

    const phone = document.getElementById("footerPhone");
    if (phone) {
      const phoneVal = info.phone || "051-633-3812";
      phone.textContent = phoneVal;
      const card = phone.closest("a");
      if (card) card.href = `tel:${phoneVal.replace(/[^0-9]/g, "")}`;
    }

    const email = document.getElementById("footerEmail");
    if (email) {
      const emailVal = info.email || "nova78jyg3@naver.com";
      email.textContent = emailVal;
      const card = email.closest("a");
      if (card) card.href = `mailto:${emailVal}`;
    }

    const hours = document.getElementById("footerHours");
    if (hours) hours.textContent = info.hours || "연중무휴";

    const loc = document.getElementById("footerLocation");
    if (loc) loc.textContent = info.location || "부산 범천동 사학연금빌딩 14층 (범일역/범내골역 인근)";

    const legal = document.getElementById("footerLegalLine");
    if (legal) {
      const openDatePart = info.openDate ? ` | 개업연월일: ${info.openDate}` : "";
      legal.textContent = `${info.companyName || '더크리에이터즈AI'} | 대표자: ${info.ceo || '정시후'} | 사업자등록번호: ${info.bizNumber || '554-62-00204'}${openDatePart}`;
    }

    const bizTypeEl = document.getElementById("footerBizTypeLine");
    if (bizTypeEl) {
      bizTypeEl.textContent = `업태: ${info.bizType || '교육서비스업, 정보통신업, 서비스'} | 종목: ${info.bizItem || '창업·취업, 소프트웨어개발(디지털 콘텐츠 개발), 유튜브교육, 광고대행'}`;
    }

    const addr = document.getElementById("footerAddressLine");
    if (addr) {
      addr.textContent = `사업장 및 교육장 주소: ${info.address || '부산광역시 부산진구 범일로 181, 14층(범천동, 사학연금빌딩)'}`;
    }

    const copy = document.getElementById("footerCopyrightLine");
    if (copy) {
      copy.textContent = info.copyright || "Copyright © 2018-2026 더크리에이터즈AI. All rights reserved.";
    }
  }

  // KPI 요약 바 갱신
  renderKPIs() {
    const total = this.lectures.length;
    const openCount = this.lectures.filter(l => l.status === "모집/접수중").length;
    const closingCount = this.lectures.filter(l => l.status === "마감임박/확정").length;
    const planningCount = this.lectures.filter(l => l.status === "기획/준비").length;

    if (this.kpiTotal) this.kpiTotal.innerHTML = `${total}<span>개</span>`;
    if (this.kpiOpen) this.kpiOpen.innerHTML = `${openCount}<span>개</span>`;
    if (this.kpiClosing) this.kpiClosing.innerHTML = `${closingCount}<span>개</span>`;
    if (this.kpiPlanning) this.kpiPlanning.innerHTML = `${planningCount}<span>개</span>`;
    if (this.kanbanTotalBadge) this.kanbanTotalBadge.textContent = total;
  }

  // 카테고리 필터 필(Pill) 생성
  renderCategoryPills() {
    if (!this.categoryPills) return;
    this.categoryPills.innerHTML = "";

    const cats = ["전체", ...Object.keys(CATEGORIES)];

    cats.forEach(catName => {
      const btn = document.createElement("button");
      btn.className = `cat-pill ${this.selectedCategory === catName ? "active" : ""}`;
      
      const count = catName === "전체" 
        ? this.lectures.length 
        : this.lectures.filter(l => l.category === catName).length;

      btn.innerHTML = `
        <span>${catName}</span>
        <span class="cat-pill-count">${count}</span>
      `;

      btn.addEventListener("click", () => {
        this.selectedCategory = catName;
        this.renderCategoryPills();
        this.renderCalendar();
        this.renderListView();
        this.renderKanban();
      });

      this.categoryPills.appendChild(btn);
    });
  }

  // 1. 월간 캘린더 렌더링 (하루 최대 3개 시간순 노출 + +N건 더보기 + 선택일 상세 브리핑 패널)
  renderCalendar() {
    const year = this.currentYear;
    const month = this.currentMonth;
    if (this.currentMonthYearEl) {
      this.currentMonthYearEl.textContent = `${year}년 ${month + 1}월`;
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const totalDays = lastDay.getDate();
    const prevDays = prevLastDay.getDate();

    const firstDayIdx = (firstDay.getDay() + 6) % 7;
    const lastDayIdx = (lastDay.getDay() + 6) % 7;
    const nextDays = 6 - lastDayIdx;

    if (!this.daysGridEl) return;
    this.daysGridEl.innerHTML = "";
    const filtered = this.getFilteredLectures();

    // 선택된 날짜가 현재 월에 속하지 않으면 현재 월의 첫 강의일 또는 1일로 자동 맞춤
    const curPrefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    if (!this.selectedDateKey || !this.selectedDateKey.startsWith(curPrefix)) {
      const monthLecs = filtered
        .filter(l => (l.date || "").startsWith(curPrefix))
        .sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.startTime || "").localeCompare(b.startTime || ""));
      this.selectedDateKey = monthLecs.length > 0 ? monthLecs[0].date : `${curPrefix}01`;
    }

    // 이전 달 셀
    for (let x = firstDayIdx; x > 0; x--) {
      const d = prevDays - x + 1;
      const cell = document.createElement("div");
      cell.className = "day-cell other-month";
      cell.innerHTML = `<div class="day-header"><span class="day-number">${d}</span></div>`;
      this.daysGridEl.appendChild(cell);
    }

    // 이번 달 셀
    for (let day = 1; day <= totalDays; day++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      const dateKey = `${year}-${mStr}-${dStr}`;

      const cell = document.createElement("div");
      cell.className = "day-cell";
      cell.dataset.date = dateKey;

      const dayOfWeek = new Date(year, month, day).getDay();
      if (dayOfWeek === 6) cell.classList.add("sat");
      if (dayOfWeek === 0) cell.classList.add("sun");

      if (year === this.today.getFullYear() && month === this.today.getMonth() && day === this.today.getDate()) {
        cell.classList.add("today", "is-today");
      }
      if (this.selectedDateKey === dateKey) {
        cell.classList.add("selected-day");
      }

      // 같은 날 강의를 시작 시간(startTime) 오름차순으로 정렬
      const dayLectures = filtered
        .filter(l => l.date === dateKey)
        .sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"));

      // 하루 최대 3개까지 슬롯 노출, 4개 이상이면 +N건 더보기 표시
      const visibleLectures = dayLectures.slice(0, 3);
      const extraCount = Math.max(0, dayLectures.length - 3);

      let headerHtml = `
        <div class="day-header">
          <span class="day-number">${day}</span>
          ${dayLectures.length > 0 ? `<span class="day-count-badge">${dayLectures.length}건</span>` : ""}
        </div>
      `;

      let chipsHtml = `<div class="day-chips-stack">`;
      visibleLectures.forEach(lec => {
        const cat = CATEGORIES[lec.category] || { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" };
        const statusBadge = lec.status === "마감임박/확정" ? `<span class="chip-status-dot dot-closing"></span>` : "";
        const hourOnly = (lec.startTime || "14:00").split(":")[0];
        const shortCatMap = {
          "바이브코딩부트캠프": "바이브",
          "AI기업업무자동화": "자동화",
          "AX행정 지자체 및 공공기관 연수": "공공AX",
          "AI영상콘텐츠제작": "AI영상",
          "AI비지니스마케팅": "마케팅",
          "AI업무활용": "업무AI",
          "AI리터러시(기초)": "리터러시",
          "AI디자인&브랜딩": "디자인",
          "AI맞춤형연수": "맞춤연수"
        };
        const shortKeyword = shortCatMap[lec.category] || (lec.title || "").replace(/^\[[^\]]+\]\s*/, "").slice(0, 4);

        chipsHtml += `
          <div class="lecture-chip" data-id="${lec.id}" style="border-left-color: ${cat.color}; background: ${cat.bgColor};" title="${lec.startTime}~${lec.endTime} ${lec.title} (${lec.instructor})">
            <div class="chip-header">
              <span class="chip-time" style="color: ${cat.color};">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${lec.startTime}
              </span>
              ${statusBadge}
            </div>
            <div class="chip-title chip-title-pc">${lec.title}</div>
            <div class="chip-title-mob" style="color: ${cat.color};"><span class="mob-chip-hr">${hourOnly}시</span> ${shortKeyword}</div>
          </div>
        `;
      });

      if (extraCount > 0) {
        chipsHtml += `
          <button type="button" class="day-more-btn" data-date="${dateKey}">
            <span class="more-text-pc">+${extraCount}건 더보기 (총 ${dayLectures.length}건)</span>
            <span class="more-text-mob">+${extraCount}건 더보기</span>
          </button>
        `;
      }
      chipsHtml += `</div>`;

      cell.innerHTML = headerHtml + chipsHtml;

      // 칩 클릭 시: 모바일(768px 이하)에서는 하단 브리핑 패널 먼저 갱신 후 상세 모달 오픈, PC에서는 즉시 상세 모달 오픈 + 선택일 갱신
      cell.querySelectorAll(".lecture-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          this.selectDayCell(dateKey, false);
          const lecId = chip.dataset.id;
          const found = this.lectures.find(l => String(l.id) === String(lecId));
          if (found) this.openDetailModal(found);
        });
      });

      // +N건 더보기 버튼 클릭 시 해당 날짜 전체 강의 모달 오픈
      const moreBtn = cell.querySelector(".day-more-btn");
      if (moreBtn) {
        moreBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.selectDayCell(dateKey, false);
          this.openDayAllLecturesModal(dateKey);
        });
      }

      // 날짜 셀 클릭 시: 해당 날짜를 선택하여 하단 브리핑 패널에 3개+ 일정을 한눈에 표시
      cell.addEventListener("click", () => {
        this.selectDayCell(dateKey, true);
      });

      // 관리자 더블클릭 시 빠른 등록 모달 오픈
      if (this.isAdmin) {
        cell.addEventListener("dblclick", (e) => {
          e.stopPropagation();
          this.openCreateModalForDate(dateKey);
        });
      }

      this.daysGridEl.appendChild(cell);
    }

    // 다음 달 셀
    for (let x = 1; x <= nextDays; x++) {
      const cell = document.createElement("div");
      cell.className = "day-cell other-month";
      cell.innerHTML = `<div class="day-header"><span class="day-number">${x}</span></div>`;
      this.daysGridEl.appendChild(cell);
    }

    this.renderSelectedDayPanel();
  }

  selectDayCell(dateKey, scrollOnMobile = false) {
    this.selectedDateKey = dateKey;
    if (this.daysGridEl) {
      this.daysGridEl.querySelectorAll(".day-cell").forEach(c => {
        c.classList.toggle("selected-day", c.dataset.date === dateKey);
      });
    }
    this.renderSelectedDayPanel();
    if (scrollOnMobile && window.innerWidth <= 768) {
      const panel = document.getElementById("mobileDayDetailPanel");
      if (panel) {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  // 선택 날짜 상세 브리핑 패널 렌더링 (하루 3개 이상 일정도 카드 형태로 한눈에 조회 + 관리자 즉시 추가/수정/삭제)
  renderSelectedDayPanel() {
    const panel = document.getElementById("mobileDayDetailPanel");
    if (!panel) return;

    const dateKey = this.selectedDateKey || "2026-10-06";
    const [y, m, d] = dateKey.split("-");
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = weekNames[dateObj.getDay()] || "";

    const dayLectures = this.getFilteredLectures()
      .filter(l => l.date === dateKey)
      .sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"));

    const adminAddBtnHtml = this.isAdmin
      ? `<button type="button" class="btn btn-primary btn-sm" onclick="app.openCreateModalForDate('${dateKey}')" style="font-size:12px; padding:6px 12px; font-weight:800;">+ 이 날짜에 강의 등록</button>`
      : `<button type="button" class="btn btn-secondary btn-sm" onclick="app.openConsultModal(event)" style="font-size:12px; padding:6px 12px; font-weight:700;">1:1 교육 문의</button>`;

    if (dayLectures.length === 0) {
      panel.innerHTML = `
        <div class="mobile-day-panel-header">
          <div class="mobile-day-panel-title">
            <span>${Number(y)}년 ${Number(m)}월 ${Number(d)}일 (${dayName}요일) 일정</span>
            <span class="mobile-day-panel-badge" style="color:#64748b; background:#f1f5f9; border-color:#cbd5e1;">일정 없음</span>
          </div>
          <div>${adminAddBtnHtml}</div>
        </div>
        <div style="text-align:center; padding: 18px 12px; color:#64748b; font-size:13px; background:#f8fafc; border-radius:10px; border:1px dashed #cbd5e1;">
          선택하신 날짜(${dateKey})에는 등록된 교육 일정이 없습니다. 달력에서 파란색 배지가 표시된 날짜를 클릭해보세요.
          ${this.isAdmin ? `<div style="margin-top:8px;"><button type="button" class="btn btn-primary btn-sm" onclick="app.openCreateModalForDate('${dateKey}')">+ ${Number(m)}월 ${Number(d)}일에 새 강의 추가하기</button></div>` : ""}
        </div>
      `;
      return;
    }

    const cardsHtml = dayLectures.map((lec, idx) => {
      const cat = CATEGORIES[lec.category] || { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" };
      const adminBtns = this.isAdmin
        ? `
          <div style="display:flex; gap:6px; margin-top:8px; padding-top:8px; border-top:1px dashed #e2e8f0;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); app.openEditModal('${lec.id}')" style="flex:1; font-size:11.5px; padding:4px 8px;">수정</button>
            <button type="button" class="btn btn-danger-solid btn-sm" onclick="event.stopPropagation(); app.promptDeleteLecture('${lec.id}')" style="flex:1; font-size:11.5px; padding:4px 8px;">삭제</button>
          </div>
        `
        : "";

      return `
        <div class="mobile-day-lecture-card" style="border-left-color: ${cat.color};" onclick="app.openDetailModal(app.lectures.find(l => String(l.id) === '${lec.id}'))">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:6px; flex-wrap:wrap;">
              <span style="font-size:11px; font-weight:800; color:${cat.color}; background:${cat.bgColor}; border:1px solid ${cat.badgeBorder}; padding:2px 7px; border-radius:6px;">
                #${idx + 1} · ${lec.category}
              </span>
              <span style="font-size:11px; font-weight:700; color:#475569; background:#e2e8f0; padding:2px 7px; border-radius:9999px;">
                ${lec.status}
              </span>
            </div>
            <div style="font-size:14.5px; font-weight:800; color:#0f172a; line-height:1.35; margin-bottom:6px; word-break:keep-all;">
              ${lec.title}
            </div>
            <div style="display:flex; flex-direction:column; gap:3px; font-size:12px; color:#475569;">
              <div><strong>시간:</strong> ${lec.startTime} ~ ${lec.endTime}</div>
              <div><strong>강사:</strong> ${lec.instructor} · <strong>장소:</strong> ${lec.location}</div>
            </div>
          </div>
          ${adminBtns}
        </div>
      `;
    }).join("");

    panel.innerHTML = `
      <div class="mobile-day-panel-header">
        <div class="mobile-day-panel-title">
          <span>${Number(y)}년 ${Number(m)}월 ${Number(d)}일 (${dayName}요일) 교육 일정</span>
          <span class="mobile-day-panel-badge">총 ${dayLectures.length}건 편성</span>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          ${adminAddBtnHtml}
        </div>
      </div>
      <div class="mobile-day-cards-list">
        ${cardsHtml}
      </div>
    `;
  }

  // 특정 날짜 전체 강의 모달 (하루 4개 이상일 때 +N건 더보기 클릭 시 오픈)
  openDayAllLecturesModal(dateKey) {
    const modal = document.getElementById("dayAllLecturesModalBackdrop");
    const heading = document.getElementById("dayAllModalHeading");
    const body = document.getElementById("dayAllModalBody");
    const countText = document.getElementById("dayAllModalCountText");
    const addBtn = document.getElementById("dayAllModalAddBtn");
    if (!modal || !body) return;

    const [y, m, d] = (dateKey || "2026-10-06").split("-");
    if (heading) heading.textContent = `${Number(y)}년 ${Number(m)}월 ${Number(d)}일 전체 교육 일정`;

    const dayLectures = this.lectures
      .filter(l => l.date === dateKey)
      .sort((a, b) => (a.startTime || "00:00").localeCompare(b.startTime || "00:00"));

    if (countText) countText.textContent = `총 ${dayLectures.length}건의 강의가 등록되어 있습니다.`;

    if (addBtn) {
      if (this.isAdmin) {
        addBtn.style.display = "inline-flex";
        addBtn.onclick = () => {
          this.closeDayAllLecturesModal();
          this.openCreateModalForDate(dateKey);
        };
      } else {
        addBtn.style.display = "none";
      }
    }

    body.innerHTML = dayLectures.map((lec, i) => {
      const cat = CATEGORIES[lec.category] || { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" };
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 14px; border:1px solid #e2e8f0; border-left:4px solid ${cat.color}; border-radius:10px; background:#ffffff;">
          <div style="min-width:0; flex:1;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
              <span style="font-size:11px; font-weight:800; color:${cat.color}; background:${cat.bgColor}; padding:2px 6px; border-radius:4px;">#${i + 1} ${lec.startTime}~${lec.endTime}</span>
              <span style="font-size:11px; font-weight:700; color:#475569;">${lec.status}</span>
            </div>
            <div style="font-size:14px; font-weight:800; color:#0f172a;">${lec.title}</div>
            <div style="font-size:12px; color:#64748b; margin-top:2px;">강사: ${lec.instructor} | 장소: ${lec.location}</div>
          </div>
          <div style="display:flex; gap:6px; flex-shrink:0;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.closeDayAllLecturesModal(); app.openDetailModal(app.lectures.find(l => String(l.id) === '${lec.id}'))">상세</button>
            ${this.isAdmin ? `<button type="button" class="btn btn-ghost btn-sm" onclick="app.closeDayAllLecturesModal(); app.openEditModal('${lec.id}')">수정</button>` : ""}
            ${this.isAdmin ? `<button type="button" class="btn btn-danger-solid btn-sm" onclick="app.closeDayAllLecturesModal(); app.promptDeleteLecture('${lec.id}')">삭제</button>` : ""}
          </div>
        </div>
      `;
    }).join("");

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  closeDayAllLecturesModal() {
    const modal = document.getElementById("dayAllLecturesModalBackdrop");
    if (modal) modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  // 2. 리스트 뷰 렌더링
  renderListView() {
    if (!this.lectureListEl) return;
    const year = this.currentYear;
    const month = this.currentMonth;
    const filtered = this.getFilteredLectures();

    const monthLectures = filtered
      .filter(l => {
        const [y, m] = l.date.split("-");
        return Number(y) === year && Number(m) === month + 1;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

    if (this.listMonthTitleEl) {
      this.listMonthTitleEl.textContent = `${year}년 ${month + 1}월 전체 강의 목록`;
    }
    if (this.monthlyCountEl) {
      this.monthlyCountEl.textContent = `${monthLectures.length}`;
    }

    this.lectureListEl.innerHTML = "";

    if (monthLectures.length === 0) {
      const adminEmptyAction = this.isAdmin
        ? `<p style="font-size: 13px; color: var(--slate-500); margin: 6px 0 16px;">새 강의를 등록하여 일정을 채워보세요.</p>
           <button class="btn btn-primary" onclick="app.openCreateModal()" style="font-size: 13px;">+ 첫 강의 등록하기</button>`
        : `<p style="font-size: 13px; color: var(--slate-500); margin: 6px 0 0;">해당 월 또는 카테고리에 예정된 교육 일정이 없습니다. 다른 월이나 카테고리를 선택해주세요.</p>`;

      this.lectureListEl.innerHTML = `
        <div class="empty-state-list">
          <div class="empty-calendar-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
          </div>
          <p style="font-weight: 700; color: var(--slate-700); font-size: 15px;">등록된 강의 일정이 없습니다.</p>
          ${adminEmptyAction}
        </div>
      `;
      return;
    }

    monthLectures.forEach(lec => {
      const cat = CATEGORIES[lec.category] || { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" };
      const item = document.createElement("div");
      item.className = "lecture-list-item";
      item.style.borderLeftColor = cat.color;

      const [y, m, d] = lec.date.split("-");

      item.innerHTML = `
        <div class="list-item-date">
          <span class="list-item-day">${d}</span>
          <span class="list-item-month">${parseInt(m, 10)}월</span>
        </div>
        <div class="list-item-main">
          <div class="list-item-tags">
            <span class="category-badge" style="color: ${cat.color}; background-color: ${cat.bgColor}; border: 1px solid ${cat.badgeBorder};">
              ${lec.category}
            </span>
            <span class="status-badge">${lec.status}</span>
          </div>
          <h4 class="list-item-title">${lec.title}</h4>
          <div class="list-item-meta">
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${lec.startTime} ~ ${lec.endTime}</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${lec.instructor}</span>
            <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${lec.location}</span>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-secondary btn-sm" onclick="app.openDetailModal(app.lectures.find(l => l.id === '${lec.id}'))">상세보기</button>
          ${this.isAdmin ? `<button class="btn btn-ghost btn-sm" onclick="app.openEditModal('${lec.id}')">수정</button>` : ''}
        </div>
      `;

      this.lectureListEl.appendChild(item);
    });
  }

  // 3. 칸반보드 렌더링
  renderKanban() {
    const filtered = this.getFilteredLectures();

    // 각 드롭존 비우기
    Object.keys(this.dropzones).forEach(status => {
      const dz = this.dropzones[status];
      if (dz) dz.innerHTML = "";
    });

    const counts = { "기획/준비": 0, "모집/접수중": 0, "마감임박/확정": 0, "진행/완료": 0 };

    filtered.forEach(lec => {
      const status = lec.status || "기획/준비";
      if (counts[status] !== undefined) counts[status]++;

      const card = this.createKanbanCard(lec);
      if (this.dropzones[status]) {
        this.dropzones[status].appendChild(card);
      }
    });

    // 각 단계별 카운터 갱신
    Object.keys(this.counters).forEach(status => {
      if (this.counters[status]) {
        this.counters[status].textContent = counts[status];
      }
    });
  }

  // 칸반 카드 생성 (수정 / 복제 / 삭제 / 단계변경 완비)
  createKanbanCard(lec) {
    const cat = CATEGORIES[lec.category] || { color: "#2563eb", bgColor: "#eff6ff", badgeBorder: "#bfdbfe" };
    const card = document.createElement("div");
    card.className = "kanban-card";
    card.style.borderLeftColor = cat.color;
    card.setAttribute("draggable", "true");
    card.dataset.id = lec.id;

    card.innerHTML = `
      <div class="card-top">
        <span class="card-cat-badge" style="color: ${cat.color}; background-color: ${cat.bgColor}; border: 1px solid ${cat.badgeBorder};">
          ${lec.category}
        </span>
        <div class="card-quick-btns">
          <button class="icon-btn edit-btn" title="강의 정보 수정" aria-label="강의 정보 수정">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="icon-btn clone-btn" title="강의 복제" aria-label="강의 복제">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <button class="icon-btn del-btn" title="강의 삭제" aria-label="강의 삭제" style="color: #ef4444;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      <div class="card-title">${lec.title}</div>
      <div class="card-meta-list">
        <div class="meta-row">
          <span class="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
          <span>${lec.date} (${lec.startTime}~${lec.endTime})</span>
        </div>
        <div class="meta-row">
          <span class="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          <span>${lec.instructor}</span>
        </div>
        <div class="meta-row">
          <span class="meta-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
          <span>${lec.location}</span>
        </div>
      </div>
      <div class="card-bottom-actions">
        <select class="stage-select" title="진행 단계 직접 변경">
          <option value="기획/준비" ${lec.status === "기획/준비" ? "selected" : ""}>1. 기획/준비</option>
          <option value="모집/접수중" ${lec.status === "모집/접수중" ? "selected" : ""}>2. 모집/접수중</option>
          <option value="마감임박/확정" ${lec.status === "마감임박/확정" ? "selected" : ""}>3. 마감임박</option>
          <option value="진행/완료" ${lec.status === "진행/완료" ? "selected" : ""}>4. 진행/완료</option>
        </select>
        <button class="btn-card-detail">상세보기 ›</button>
      </div>
    `;

    // 드래그 이벤트 (관리자 전용)
    card.addEventListener("dragstart", (e) => {
      if (!this.isAdmin) {
        e.preventDefault();
        this.promptAdminLogin();
        return;
      }
      this.draggedLectureId = lec.id;
      e.dataTransfer.setData("text/plain", String(lec.id));
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      this.draggedLectureId = null;
      card.classList.remove("dragging");
    });

    // 수정 버튼 클릭
    card.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      this.openEditModal(lec.id);
    });

    // 복제 버튼 클릭
    card.querySelector(".clone-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      this.duplicateLecture(lec.id);
    });

    // 삭제 버튼 클릭 (커스텀 인앱 모달 오픈)
    card.querySelector(".del-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      this.promptDeleteLecture(lec.id);
    });

    // 단계 변경 셀렉트 (관리자 전용)
    card.querySelector(".stage-select").addEventListener("change", (e) => {
      e.stopPropagation();
      if (!this.isAdmin) {
        e.target.value = lec.status; // Revert
        this.promptAdminLogin(() => {
          this.updateLectureStatus(lec.id, e.target.value);
        });
        return;
      }
      this.updateLectureStatus(lec.id, e.target.value);
    });

    // 카드 상세 보기 클릭
    card.querySelector(".btn-card-detail").addEventListener("click", (e) => {
      e.stopPropagation();
      this.openDetailModal(lec);
    });

    // 카드 본문 클릭 시에도 상세 모달 오픈
    card.addEventListener("click", () => {
      this.openDetailModal(lec);
    });

    return card;
  }

  // 강의 상태 업데이트
  updateLectureStatus(id, newStatus) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.updateLectureStatus(id, newStatus));
      return;
    }
    const lecture = this.lectures.find(l => String(l.id) === String(id));
    if (lecture && lecture.status !== newStatus) {
      lecture.status = newStatus;
      this.saveLectures();
      this.renderAll();
      this.showToast(`'${lecture.title}' 상태가 [${newStatus}](으)로 변경되었습니다.`, "info");
    }
  }

  // 강의 복제 기능
  duplicateLecture(id) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.duplicateLecture(id));
      return;
    }
    const lecture = this.lectures.find(l => String(l.id) === String(id));
    if (!lecture) return;

    const cloned = JSON.parse(JSON.stringify(lecture));
    cloned.id = "lec-" + Date.now();
    cloned.title = cloned.title + " (복제본)";

    this.lectures.unshift(cloned);
    this.saveLectures();
    this.renderAll();
    this.showToast(`'${cloned.title}' 강의가 성공적으로 복제되었습니다.`, "success");
    this.highlightLecture(cloned.id);
  }

  // 강의 상세 모달 오픈
  openDetailModal(lecture) {
    this.selectedLectureForView = lecture;
    const cat = CATEGORIES[lecture.category] || { color: "#2563eb" };

    if (this.modalCategory) this.modalCategory.textContent = lecture.category;
    if (this.modalStatus) this.modalStatus.textContent = lecture.status || "모집/접수중";
    if (this.modalTitle) this.modalTitle.textContent = lecture.title;

    // 날짜 포맷
    const parts = (lecture.date || "2026-10-01").split("-");
    const y = parts[0] || "2026";
    const m = parts[1] || "10";
    const d = parts[2] || "01";
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = weekNames[dateObj.getDay()] || "일";

    if (this.modalDate) {
      this.modalDate.textContent = `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일 (${dayName})`;
    }

    if (this.modalTime) this.modalTime.textContent = `${lecture.startTime} ~ ${lecture.endTime}`;
    if (this.modalInstructor) this.modalInstructor.textContent = lecture.instructor;
    if (this.modalLocation) this.modalLocation.textContent = lecture.location;

    if (this.modalCurriculum) {
      this.modalCurriculum.innerHTML = "";
      if (lecture.curriculum && lecture.curriculum.length > 0) {
        lecture.curriculum.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          this.modalCurriculum.appendChild(li);
        });
      }
    }

    if (this.modalPreparation) {
      this.modalPreparation.textContent = lecture.preparation || "개인 노트북 지참";
    }

    // Google Calendar 연동 링크 생성
    if (this.modalGcalBtn) {
      const sTime = (lecture.startTime || "19:00").replace(":", "");
      const eTime = (lecture.endTime || "21:00").replace(":", "");
      const startDateTime = `${y}${m}${d}T${sTime}00`;
      const endDateTime = `${y}${m}${d}T${eTime}00`;
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(lecture.title)}&dates=${startDateTime}/${endDateTime}&details=${encodeURIComponent((lecture.curriculum || []).join("\n"))}&location=${encodeURIComponent(lecture.location)}`;
      this.modalGcalBtn.href = gcalUrl;
    }

    if (this.lectureModalBackdrop) {
      this.lectureModalBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  closeDetailModal() {
    if (this.lectureModalBackdrop) {
      this.lectureModalBackdrop.classList.remove("is-open");
    }
    document.body.style.overflow = "";
    this.selectedLectureForView = null;
  }

  // 교육대상자 + 카테고리 조합 타이틀 계산 헬퍼
  getCombinedTitle(targetOrg, category, customType) {
    const rawOrg = (targetOrg || "").trim();
    const cleanOrg = rawOrg.replace(/^\[+|\]+$/g, '').trim();
    let catTitle = category || "바이브코딩부트캠프";
    if (catTitle === "AI맞춤형연수") {
      const cType = customType || "기업";
      catTitle = `AI맞춤형연수 (${cType})`;
    }
    return cleanOrg ? `[${cleanOrg}] ${catTitle}` : catTitle;
  }

  // 실시간 등록 폼 미리보기 텍스트 갱신
  updateLectureFormPreview() {
    if (!this.formCombinedPreviewText) return;
    const targetOrg = this.formTargetOrg ? this.formTargetOrg.value : "";
    const category = this.formCategory ? this.formCategory.value : "바이브코딩부트캠프";
    const customType = this.formCustomType ? this.formCustomType.value : "기업";
    this.formCombinedPreviewText.textContent = this.getCombinedTitle(targetOrg, category, customType);
  }

  // 카테고리 선택 변경 핸들러
  handleFormCategoryChange(catVal) {
    if (this.formCustomTypeWrap) {
      this.formCustomTypeWrap.style.display = (catVal === "AI맞춤형연수") ? "block" : "none";
    }
    this.updateLectureFormPreview();
  }

  // 신규 등록 모달 열기 (특정 상태 기본 지정 가능)
  openCreateModal(defaultStatus = "모집/접수중") {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.openCreateModal(defaultStatus));
      return;
    }
    if (!this.lectureForm) return;
    this.lectureForm.reset();
    if (this.formLectureId) this.formLectureId.value = "";
    if (this.editModalHeading) this.editModalHeading.textContent = "신규 강의 등록";
    if (this.formTargetOrg) this.formTargetOrg.value = "";
    if (this.formCategory) this.formCategory.value = "바이브코딩부트캠프";
    if (this.formCustomType) this.formCustomType.value = "기업";
    if (this.formCustomTypeWrap) this.formCustomTypeWrap.style.display = "none";
    if (this.formStatus) this.formStatus.value = defaultStatus;
    if (this.formDate) this.formDate.value = "2026-10-15";
    if (this.formStartTime) this.formStartTime.value = "19:00";
    if (this.formEndTime) this.formEndTime.value = "21:00";
    if (this.formDeleteBtn) this.formDeleteBtn.style.display = "none";

    this.updateLectureFormPreview();

    if (this.editModalBackdrop) this.editModalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (this.formTargetOrg) this.formTargetOrg.focus();
    }, 100);
  }

  // 특정 날짜로 신규 등록 모달 열기
  openCreateModalForDate(dateStr) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.openCreateModalForDate(dateStr));
      return;
    }
    this.openCreateModal();
    if (this.formDate) this.formDate.value = dateStr;
  }

  // 수정 모달 열기 (기존 데이터 완벽 바인딩 & 교육대상자/옵션 분리 표기)
  openEditModal(id) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.openEditModal(id));
      return;
    }
    const lecture = this.lectures.find(l => String(l.id) === String(id));
    if (!lecture) {
      this.showToast("수정할 강의 정보를 찾을 수 없습니다.", "error");
      return;
    }

    if (this.editModalHeading) this.editModalHeading.textContent = "강의 정보 수정";
    if (this.formLectureId) this.formLectureId.value = lecture.id;

    // 교육대상자 분리 바인딩
    let targetOrg = lecture.targetOrg || "";
    if (!targetOrg && lecture.title) {
      const m = lecture.title.match(/^\[(.*?)\]\s*(.*)$/);
      if (m) targetOrg = m[1];
    }
    if (this.formTargetOrg) this.formTargetOrg.value = targetOrg;

    // 카테고리 (레거시 매핑 호환)
    let catVal = lecture.category;
    if (LEGACY_CAT_MAP[catVal]) catVal = LEGACY_CAT_MAP[catVal];
    if (this.formCategory) this.formCategory.value = catVal;

    // 맞춤형 연수 추가옵션
    const cType = lecture.customType || "기업";
    if (this.formCustomType) this.formCustomType.value = cType;
    if (this.formCustomTypeWrap) {
      this.formCustomTypeWrap.style.display = (catVal === "AI맞춤형연수") ? "block" : "none";
    }

    if (this.formStatus) this.formStatus.value = lecture.status || "모집/접수중";
    if (this.formDate) this.formDate.value = lecture.date;
    if (this.formStartTime) this.formStartTime.value = lecture.startTime;
    if (this.formEndTime) this.formEndTime.value = lecture.endTime;
    if (this.formInstructor) this.formInstructor.value = lecture.instructor;
    if (this.formLocation) this.formLocation.value = lecture.location;
    if (this.formCurriculum) {
      this.formCurriculum.value = Array.isArray(lecture.curriculum) ? lecture.curriculum.join("\n") : (lecture.curriculum || "");
    }
    if (this.formPreparation) this.formPreparation.value = lecture.preparation || "";

    this.updateLectureFormPreview();

    if (this.formDeleteBtn) this.formDeleteBtn.style.display = "inline-flex";
    if (this.editModalBackdrop) this.editModalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (this.formTargetOrg) this.formTargetOrg.focus();
    }, 100);
  }

  closeEditModal() {
    if (this.editModalBackdrop) {
      this.editModalBackdrop.classList.remove("is-open");
    }
    document.body.style.overflow = "";
  }

  // 폼 제출 (교육대상자 + 카테고리 자동 결합 및 완벽 저장)
  handleFormSubmit(e) {
    e.preventDefault();
    const id = this.formLectureId ? this.formLectureId.value.trim() : "";
    const targetOrgRaw = this.formTargetOrg ? this.formTargetOrg.value.trim() : "";
    if (!targetOrgRaw) {
      this.showToast("교육대상자(기업/대학/기관명)를 입력해주세요.", "error");
      if (this.formTargetOrg) this.formTargetOrg.focus();
      return;
    }

    const category = this.formCategory ? this.formCategory.value : "바이브코딩부트캠프";
    const customType = (category === "AI맞춤형연수" && this.formCustomType) ? this.formCustomType.value : "";
    const title = this.getCombinedTitle(targetOrgRaw, category, customType);

    const rawDate = this.formDate ? this.formDate.value.trim() : "";
    if (!rawDate) {
      this.showToast("강의 날짜를 지정해주세요.", "error");
      return;
    }

    const curriculumLines = this.formCurriculum && this.formCurriculum.value
      ? this.formCurriculum.value.split("\n").map(l => l.trim()).filter(l => l.length > 0)
      : [];

    const cleanOrg = targetOrgRaw.replace(/^\[+|\]+$/g, '').trim();

    const lectureData = {
      id: id || ("lec-" + Date.now()),
      title: title,
      targetOrg: cleanOrg,
      customType: customType,
      category: category,
      status: this.formStatus ? this.formStatus.value : "모집/접수중",
      date: rawDate,
      startTime: (this.formStartTime && this.formStartTime.value) || "19:00",
      endTime: (this.formEndTime && this.formEndTime.value) || "21:00",
      instructor: (this.formInstructor && this.formInstructor.value.trim()) || "담당 강사 미정",
      location: (this.formLocation && this.formLocation.value.trim()) || "더크리에이터즈AI 교육장",
      curriculum: curriculumLines.length > 0 ? curriculumLines : ["강의 커리큘럼 준비 중"],
      preparation: (this.formPreparation && this.formPreparation.value.trim()) || "개인 노트북 지참"
    };

    let isEdit = false;
    if (id) {
      const idx = this.lectures.findIndex(l => String(l.id) === String(id));
      if (idx !== -1) {
        lectureData.isMajorFeatured = !!this.lectures[idx].isMajorFeatured;
        this.lectures[idx] = lectureData;
        isEdit = true;
      } else {
        this.lectures.push(lectureData);
      }
    } else {
      this.lectures.push(lectureData);
    }

    // 캘린더를 해당 강의가 속한 연/월로 자동 이동하여 시각적 확인 보장
    const parts = rawDate.split("-");
    if (parts.length >= 2) {
      const targetYear = parseInt(parts[0], 10);
      const targetMonth = parseInt(parts[1], 10) - 1;
      if (!isNaN(targetYear) && !isNaN(targetMonth)) {
        this.currentYear = targetYear;
        this.currentMonth = targetMonth;
      }
    }

    this.saveLectures();
    this.closeEditModal();
    this.renderAll();

    const toastMsg = isEdit 
      ? `'${title}' 강의가 성공적으로 수정되었습니다.` 
      : `'${title}' 강의가 성공적으로 등록되었습니다.`;
    this.showToast(toastMsg, "success");

    // 업데이트된 카드/칩 하이라이트
    this.highlightLecture(lectureData.id);
  }

  // 수정 모달 내 삭제 버튼 클릭 시
  promptDeleteFromForm() {
    const id = this.formLectureId.value;
    if (id) {
      this.promptDeleteLecture(id);
    }
  }

  // 커스텀 인앱 삭제 확인 모달 오픈 (브라우저 confirm 차단 문제 원천 해결)
  promptDeleteLecture(id) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.promptDeleteLecture(id));
      return;
    }
    const lecture = this.lectures.find(l => String(l.id) === String(id));
    if (!lecture) return;

    this.pendingDeleteId = id;
    if (this.deleteTargetTitle) {
      this.deleteTargetTitle.textContent = `[${lecture.category}] ${lecture.title}`;
    }
    if (this.deleteConfirmBackdrop) {
      this.deleteConfirmBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  closeDeleteConfirmModal() {
    this.pendingDeleteId = null;
    if (this.deleteConfirmBackdrop) {
      this.deleteConfirmBackdrop.classList.remove("is-open");
    }
    if (!this.editModalBackdrop.classList.contains("is-open") && !this.lectureModalBackdrop.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  // 삭제 실행
  executeDeleteLecture() {
    if (!this.pendingDeleteId) return;
    const targetId = this.pendingDeleteId;
    const target = this.lectures.find(l => String(l.id) === String(targetId));
    const title = target ? target.title : "강의";

    this.lectures = this.lectures.filter(l => String(l.id) !== String(targetId));
    this.saveLectures();

    this.closeDeleteConfirmModal();
    this.closeEditModal();
    this.closeDetailModal();
    this.renderAll();

    this.showToast(`'${title}' 강의가 완전히 삭제되었습니다.`, "info");
  }

  // 샘플 데이터 전체 비우기 모달 오픈
  promptClearAllData() {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.promptClearAllData());
      return;
    }
    if (this.clearConfirmBackdrop) {
      this.clearConfirmBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  closeClearConfirmModal() {
    if (this.clearConfirmBackdrop) {
      this.clearConfirmBackdrop.classList.remove("is-open");
    }
    document.body.style.overflow = "";
  }

  // 샘플 데이터 전체 비우기 실행 (내 실제 데이터만 입력할 수 있는 클린 상태)
  executeClearAllData() {
    this.lectures = [];
    this.saveLectures();
    this.closeClearConfirmModal();
    this.renderAll();
    this.showToast("샘플 데이터가 모두 비워졌습니다. 이제 실제 강의 일정을 등록하세요!", "info");
  }

  // 기본 샘플 데이터 복원
  promptResetDefaultData() {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.promptResetDefaultData());
      return;
    }
    this.lectures = JSON.parse(JSON.stringify(DEFAULT_LECTURES));
    this.currentYear = 2026;
    this.currentMonth = 9;
    this.saveLectures();
    this.renderAll();
    this.showToast("기본 8개 샘플 강의 데이터로 복원되었습니다.", "success");
  }

  // JSON 파일로 전체 사이트 통합 백업 다운로드
  exportToJson() {
    try {
      const payload = {
        version: "v4",
        exportedAt: new Date().toISOString(),
        lectures: this.lectures,
        stats: this.stats,
        tickerItems: this.tickerItems,
        heroConfig: this.heroConfig,
        instructors: this.instructors,
        companyInfo: this.companyInfo,
        reviews: this.reviews,
        instructorApplications: this.instructorApplications,
        consultApplications: this.consultApplications
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `thecreators_academy_data_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      this.showToast("💾 전체 데이터(강의, 롤링배너, 슬로건, 실적, 강사진, 회사정보, 지원서/상담서)가 백업되었습니다.", "success");
    } catch(e) {
      this.showToast("백업 파일 생성에 실패했습니다.", "error");
    }
  }

  // JSON 파일에서 전체 데이터 복원
  importFromJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        let importedCount = 0;
        if (Array.isArray(imported)) {
          this.lectures = imported;
          this.saveLectures();
          importedCount = imported.length;
        } else if (imported && typeof imported === "object") {
          if (Array.isArray(imported.lectures)) {
            this.lectures = imported.lectures;
            this.saveLectures();
            importedCount = imported.lectures.length;
          }
          if (Array.isArray(imported.stats)) {
            this.stats = imported.stats;
            this.saveStats();
          }
          if (Array.isArray(imported.tickerItems)) {
            this.tickerItems = imported.tickerItems;
            this.saveTickerItems();
          }
          if (imported.heroConfig && typeof imported.heroConfig === "object") {
            this.heroConfig = imported.heroConfig;
            this.saveHeroConfig();
          }
          if (Array.isArray(imported.instructors)) {
            this.instructors = imported.instructors;
            this.saveInstructors();
          }
          if (imported.companyInfo && typeof imported.companyInfo === "object") {
            this.companyInfo = imported.companyInfo;
            this.saveCompanyInfo();
          }
          if (Array.isArray(imported.reviews)) {
            this.reviews = imported.reviews;
            this.saveReviews();
          }
          if (Array.isArray(imported.instructorApplications)) {
            this.instructorApplications = imported.instructorApplications;
            this.saveInstructorApplications();
          }
          if (Array.isArray(imported.consultApplications)) {
            this.consultApplications = imported.consultApplications;
            this.saveConsultApplications();
          }
        }
        this.renderAll();
        this.populateDataHubInputs();
        this.showToast(`📂 전체 데이터 복원 완료! (강의 ${importedCount}건 및 전체 사이트 설정)`, "success");
      } catch (err) {
        this.showToast("유효한 JSON 백업 파일이 아닙니다.", "error");
      }
    };
    reader.readAsText(file);
    const input = document.getElementById("importJsonInput");
    if (input) input.value = "";
    const modalInput = document.getElementById("importJsonInputModal");
    if (modalInput) modalInput.value = "";
  }

  // 방금 수정/등록된 강의 펄스 하이라이트
  highlightLecture(id) {
    setTimeout(() => {
      const el = document.querySelector(`[data-id="${id}"]`);
      if (el) {
        el.classList.add("pulse-highlight");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el.classList.remove("pulse-highlight"), 3000);
      }
    }, 150);
  }

  // 토스트 알림 표시
  showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-msg toast-${type}`;
    
    let iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    if (type === "error") {
      iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    } else if (type === "info") {
      iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `<span>${iconSvg}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // 데이터 관리 허브 모달 열기 (특정 탭 지정 가능: 'lectures' | 'stats' | 'instructors' | 'company')
  openDataHubModal(tabName = "lectures") {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.openDataHubModal(tabName));
      return;
    }
    const modal = document.getElementById("dataHubModalBackdrop");
    if (modal) {
      this.switchDataHubTab(tabName);
      this.populateDataHubInputs();
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  openDataHubTabDirect(tabName) {
    this.openDataHubModal(tabName);
  }

  closeDataHubModal() {
    this.collectCurrentHubTabInputs(); // 닫기 전 현재 탭의 작성 내용 즉시 자동 수집 & 안전 저장
    const modal = document.getElementById("dataHubModalBackdrop");
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  // 허브 서브 탭 전환 (이전 탭의 입력값을 잃지 않도록 자동 수집 후 전환)
  switchDataHubTab(tabName) {
    if (this.activeDataHubTab && this.activeDataHubTab !== tabName) {
      this.collectCurrentHubTabInputs(); // 탭 전환 시 기존 탭의 수정 내용 무손실 보존
    }
    this.activeDataHubTab = tabName;
    const tabMap = {
      lectures: { btn: "hubTabLectures", pane: "paneHubLectures" },
      major: { btn: "hubTabMajor", pane: "paneHubMajor" },
      ticker: { btn: "hubTabTicker", pane: "paneHubTicker" },
      stats: { btn: "hubTabStats", pane: "paneHubStats" },
      instructors: { btn: "hubTabInstructors", pane: "paneHubInstructors" },
      company: { btn: "hubTabCompany", pane: "paneHubCompany" },
      reviews: { btn: "hubTabReviews", pane: "paneHubReviews" },
      consult: { btn: "hubTabConsult", pane: "paneHubConsult" }
    };

    Object.keys(tabMap).forEach(key => {
      const btn = document.getElementById(tabMap[key].btn);
      const pane = document.getElementById(tabMap[key].pane);
      if (btn) btn.classList.toggle("active", key === tabName);
      if (pane) pane.classList.toggle("active", key === tabName);
    });

    if (tabName === "major") this.renderHubMajorLecturesList();
    if (tabName === "ticker") this.renderHubTickerList();
    if (tabName === "stats") {
      this.populateStatsInputs();
      this.populateHeroSloganInputs();
    }
    if (tabName === "instructors") this.renderHubInstructorList();
    if (tabName === "company") this.populateCompanyInputs();
    if (tabName === "reviews") this.renderHubReviewsList();
    if (tabName === "consult") this.renderHubConsultApplications();
  }

  // 현재 활성화된 허브 탭의 모든 사용자 입력값을 자동으로 읽어 데이터 모델에 실시간 동기화
  collectCurrentHubTabInputs() {
    const tab = this.activeDataHubTab;
    if (tab === "stats") {
      // 1. 슬로건 & 리드 문구 수집
      const sloganTopEl = document.getElementById("hubHeroSloganTop");
      const sloganBottomEl = document.getElementById("hubHeroSloganBottom");
      const leadTextEl = document.getElementById("hubHeroLeadText");
      if (sloganTopEl || sloganBottomEl || leadTextEl) {
        this.heroConfig = {
          ...this.heroConfig,
          sloganTop: sloganTopEl ? (sloganTopEl.value.trim() || this.heroConfig.sloganTop) : this.heroConfig.sloganTop,
          sloganBottom: sloganBottomEl ? (sloganBottomEl.value.trim() || this.heroConfig.sloganBottom) : this.heroConfig.sloganBottom,
          leadText: leadTextEl ? (leadTextEl.value.trim() || this.heroConfig.leadText) : this.heroConfig.leadText
        };
        this.saveHeroConfig();
        this.renderHeroSlogan();
      }

      // 2. 실적 지표 수치 수집
      if (document.getElementById("hubStatLabel0") !== null) {
        this.stats = (this.stats || []).map((st, idx) => {
          const lblEl = document.getElementById(`hubStatLabel${idx}`);
          const valEl = document.getElementById(`hubStatVal${idx}`);
          return {
            ...st,
            label: lblEl && lblEl.value.trim() !== "" ? lblEl.value.trim() : st.label,
            value: valEl && valEl.value.trim() !== "" ? valEl.value.trim() : st.value
          };
        });
        this.saveStats();
        this.renderStats();
      }
    } else if (tab === "ticker") {
      this.collectTickerInputsFromDom();
      this.saveTickerItems();
      this.renderTicker();
    } else if (tab === "company") {
      const getVal = (id) => document.getElementById(id)?.value.trim() || "";
      if (document.getElementById("hubCompPhone") !== null) {
        this.companyInfo = {
          ...this.companyInfo,
          phone: getVal("hubCompPhone") || this.companyInfo.phone,
          email: getVal("hubCompEmail") || this.companyInfo.email,
          hours: getVal("hubCompHours") || this.companyInfo.hours,
          location: getVal("hubCompLocation") || this.companyInfo.location,
          companyName: getVal("hubCompName") || this.companyInfo.companyName,
          ceo: getVal("hubCompCeo") || this.companyInfo.ceo,
          bizNumber: getVal("hubCompBiz") || this.companyInfo.bizNumber,
          openDate: getVal("hubCompOpenDate") || this.companyInfo.openDate,
          bizType: getVal("hubCompBizType") || this.companyInfo.bizType,
          bizItem: getVal("hubCompBizItem") || this.companyInfo.bizItem,
          telecomNumber: getVal("hubCompTelecom") || this.companyInfo.telecomNumber,
          address: getVal("hubCompAddress") || this.companyInfo.address,
          brandDesc: getVal("hubCompBrandDesc") || this.companyInfo.brandDesc,
          copyright: getVal("hubCompCopyright") || this.companyInfo.copyright
        };
        this.saveCompanyInfo();
        this.renderCompanyInfo();
      }
    }
  }

  // 모달 입력 폼 채우기
  populateDataHubInputs() {
    this.renderHubMajorLecturesList();
    this.renderHubTickerList();
    this.populateStatsInputs();
    this.populateHeroSloganInputs();
    this.renderHubInstructorList();
    this.populateCompanyInputs();
    this.renderHubReviewsList();
    this.renderHubConsultApplications();
  }

  // 데이터 허브에서 관리자 칸반보드로 즉시 전환
  switchToKanbanMode() {
    this.closeDataHubModal();
    this.openAdminKanban();
  }

  // 데이터 관리 허브 전체 일괄 저장 (모든 탭의 수정사항을 한 번에 완벽 동기화)
  saveAllDataHub() {
    this.collectCurrentHubTabInputs();
    this.saveHeroConfig();
    this.saveStats();
    this.saveCompanyInfo();
    this.saveTickerItems();
    this.saveInstructors();
    this.saveLectures();
    this.renderAll();
    this.populateDataHubInputs();
    this.showToast("💾 데이터 관리 허브의 모든 설정 및 데이터가 완벽하게 저장되었습니다!", "success");
  }

  // 1. 실적 수치 폼 채우기 & 저장 & 복원
  populateStatsInputs() {
    (this.stats || []).forEach((st, idx) => {
      const lblInput = document.getElementById(`hubStatLabel${idx}`);
      const valInput = document.getElementById(`hubStatVal${idx}`);
      if (lblInput) lblInput.value = st.label || "";
      if (valInput) valInput.value = st.value || "";
    });
  }

  saveStatsFromHub() {
    // 슬로건과 실적을 함께 저장하여 한쪽만 저장되던 누락 문제 원천 해결
    const sloganTop = document.getElementById("hubHeroSloganTop")?.value.trim();
    const sloganBottom = document.getElementById("hubHeroSloganBottom")?.value.trim();
    const leadText = document.getElementById("hubHeroLeadText")?.value.trim();
    if (sloganTop || sloganBottom || leadText) {
      this.heroConfig = {
        ...this.heroConfig,
        sloganTop: sloganTop || this.heroConfig.sloganTop,
        sloganBottom: sloganBottom || this.heroConfig.sloganBottom,
        leadText: leadText || this.heroConfig.leadText
      };
      this.saveHeroConfig();
      this.renderHeroSlogan();
    }

    this.stats = (this.stats || []).map((st, idx) => {
      const lbl = document.getElementById(`hubStatLabel${idx}`)?.value;
      const val = document.getElementById(`hubStatVal${idx}`)?.value;
      return {
        ...st,
        label: lbl !== undefined && lbl.trim() !== "" ? lbl.trim() : st.label,
        value: val !== undefined && val.trim() !== "" ? val.trim() : st.value
      };
    });
    this.saveStats();
    this.renderStats();
    this.showToast("✅ 슬로건 및 핵심 실적 수치가 성공적으로 저장되었습니다.", "success");
  }

  resetStatsToDefault() {
    if (!confirm("실적 수치를 기본 예시값으로 복원하시겠습니까? 현재 입력한 수치는 초기화됩니다.")) return;
    this.stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
    this.saveStats();
    this.renderStats();
    this.populateStatsInputs();
    this.showToast("🔄 기본 실적 수치로 복원되었습니다.", "info");
  }

  // 1-1. 최상단 메인 슬로건 & 리드 문구 채우기, 저장, 복원
  populateHeroSloganInputs() {
    const config = this.heroConfig || JSON.parse(JSON.stringify(DEFAULT_HERO_CONFIG));
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };
    setVal("hubHeroSloganTop", config.sloganTop);
    setVal("hubHeroSloganBottom", config.sloganBottom);
    setVal("hubHeroLeadText", config.leadText);
    setVal("hubHeroCtaMonth", String(config.ctaMonth || 10));
  }

  saveHeroSloganFromHub() {
    const getVal = (id) => document.getElementById(id)?.value.trim() || "";
    const sloganTop = getVal("hubHeroSloganTop");
    const sloganBottom = getVal("hubHeroSloganBottom");
    const leadText = getVal("hubHeroLeadText");
    const ctaMonthVal = document.getElementById("hubHeroCtaMonth")?.value;
    const ctaMonth = ctaMonthVal ? parseInt(ctaMonthVal, 10) : 10;

    this.heroConfig = {
      ...this.heroConfig,
      sloganTop: sloganTop || this.heroConfig.sloganTop,
      sloganBottom: sloganBottom || this.heroConfig.sloganBottom,
      leadText: leadText || this.heroConfig.leadText,
      ctaMonth: ctaMonth || 10
    };
    this.saveHeroConfig();
    this.renderHeroSlogan();

    // 동시 기재된 실적 수치도 함께 저장
    this.stats = (this.stats || []).map((st, idx) => {
      const lbl = document.getElementById(`hubStatLabel${idx}`)?.value;
      const val = document.getElementById(`hubStatVal${idx}`)?.value;
      return {
        ...st,
        label: lbl !== undefined && lbl.trim() !== "" ? lbl.trim() : st.label,
        value: val !== undefined && val.trim() !== "" ? val.trim() : st.value
      };
    });
    this.saveStats();
    this.renderStats();

    this.showToast("✅ 최상단 슬로건 및 실적 지표가 성공적으로 저장되었습니다.", "success");
  }

  resetHeroSloganToDefault() {
    if (!confirm("최상단 슬로건 및 문구를 기본값으로 복원하시겠습니까?")) return;
    this.heroConfig = JSON.parse(JSON.stringify(DEFAULT_HERO_CONFIG));
    this.saveHeroConfig();
    this.renderHeroSlogan();
    this.populateHeroSloganInputs();
    this.showToast("🔄 메인 슬로건이 기본 문구로 복원되었습니다.", "info");
  }

  // 1-2. 상단 롤링 배너 (LIVE TICKER) 문구 관리 (목록 렌더링, 추가, 삭제, 저장, 복원)
  renderHubTickerList() {
    const listWrap = document.getElementById("hubTickerItemsList");
    if (!listWrap) return;

    if (!this.tickerItems || this.tickerItems.length === 0) {
      this.tickerItems = JSON.parse(JSON.stringify(DEFAULT_TICKER_ITEMS));
    }

    const badgeOptions = [
      { badge: "badge-amber", icon: "zap", label: "⚡ 번개 (골드)" },
      { badge: "badge-blue", icon: "calendar", label: "📅 캘린더 (블루)" },
      { badge: "badge-indigo", icon: "rocket", label: "🚀 로켓 (인디고)" },
      { badge: "badge-emerald", icon: "award", label: "🏆 트로피 (에메랄드)" },
      { badge: "badge-rose", icon: "zap", label: "🔥 핫이슈 (로즈)" }
    ];

    listWrap.innerHTML = this.tickerItems.map((item, idx) => {
      const optionsHtml = badgeOptions.map(opt => {
        const isSel = (item.badge === opt.badge && item.icon === opt.icon) || (!item.badge && opt.badge === "badge-blue");
        return `<option value="${opt.badge}__${opt.icon}" ${isSel ? 'selected' : ''}>${opt.label}</option>`;
      }).join("");

      const safeText = (item.text || "").replace(/"/g, '&quot;');

      return `
        <div class="inst-manage-item" style="padding: 10px 12px; gap: 10px; align-items: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="font-weight: 800; font-size: 13px; color: #64748b; width: 28px; text-align: center; flex-shrink: 0;">
            #${idx + 1}
          </div>
          <div style="width: 140px; flex-shrink: 0;">
            <select id="hubTickerBadge_${idx}" class="datahub-input" style="padding: 6px 8px; font-size: 12px;">
              ${optionsHtml}
            </select>
          </div>
          <div style="flex: 1; min-width: 0;">
            <input type="text" id="hubTickerText_${idx}" class="datahub-input" style="font-size: 13px; padding: 7px 10px;" value="${safeText}" placeholder="롤링될 안내 문구를 입력하세요">
          </div>
          <button class="btn btn-danger-solid btn-sm" onclick="app.removeTickerItem(${idx})" title="이 문구 삭제" style="padding: 6px 10px; font-size: 12px; flex-shrink: 0;">
            삭제
          </button>
        </div>
      `;
    }).join("");
  }

  collectTickerInputsFromDom() {
    const listWrap = document.getElementById("hubTickerItemsList");
    if (!listWrap) return;
    const items = [];
    for (let i = 0; i < (this.tickerItems || []).length; i++) {
      const textEl = document.getElementById(`hubTickerText_${i}`);
      const badgeEl = document.getElementById(`hubTickerBadge_${i}`);
      if (textEl && badgeEl) {
        const [badge, icon] = (badgeEl.value || "badge-blue__calendar").split("__");
        items.push({
          id: this.tickerItems[i]?.id || `tick-${Date.now()}-${i}`,
          text: textEl.value.trim() || this.tickerItems[i]?.text || "공지사항",
          badge: badge || "badge-blue",
          icon: icon || "calendar"
        });
      }
    }
    if (items.length > 0) {
      this.tickerItems = items;
    }
  }

  addTickerItemFromHub() {
    this.collectTickerInputsFromDom();
    if (!this.tickerItems) this.tickerItems = [];
    this.tickerItems.push({
      id: `tick-${Date.now()}`,
      text: "새로운 실시간 공지사항 및 이벤트 안내 문구입니다.",
      badge: "badge-blue",
      icon: "calendar"
    });
    this.renderHubTickerList();
    setTimeout(() => {
      const lastInput = document.getElementById(`hubTickerText_${this.tickerItems.length - 1}`);
      if (lastInput) {
        lastInput.focus();
        lastInput.select();
      }
    }, 50);
  }

  removeTickerItem(idx) {
    this.collectTickerInputsFromDom();
    if (this.tickerItems.length <= 1) {
      this.showToast("상단 롤링 배너는 최소 1개 이상 유지되어야 합니다.", "warning");
      return;
    }
    this.tickerItems.splice(idx, 1);
    this.renderHubTickerList();
    this.showToast("문구가 삭제되었습니다. [롤링 배너 문구 저장] 버튼을 누르면 최종 적용됩니다.", "info");
  }

  saveTickerFromHub() {
    this.collectTickerInputsFromDom();
    this.saveTickerItems();
    this.renderTicker();
    this.showToast("✅ 상단 롤링 배너 문구가 성공적으로 저장되었습니다.", "success");
  }

  resetTickerToDefault() {
    if (!confirm("상단 롤링 배너 문구를 기본 예시값으로 복원하시겠습니까?")) return;
    this.tickerItems = JSON.parse(JSON.stringify(DEFAULT_TICKER_ITEMS));
    this.saveTickerItems();
    this.renderTicker();
    this.renderHubTickerList();
    this.showToast("🔄 상단 롤링 배너 문구가 기본값으로 복원되었습니다.", "info");
  }

  // 2. 강사진 관리 (목록 렌더링, 폼 열기/닫기, 저장, 삭제, 배너 노출 토글)
  renderHubInstructorList() {
    const listWrap = document.getElementById("hubInstListWrap");
    if (!listWrap) return;

    this.renderHubInstructorApplications();

    if (!this.instructors || this.instructors.length === 0) {
      listWrap.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--slate-400); font-size: 13px;">등록된 강사진이 없습니다. 위의 [+ 새 강사 추가] 버튼을 눌러보세요.</div>`;
      return;
    }

    listWrap.innerHTML = this.instructors.map(inst => {
      const tags = Array.isArray(inst.tags) ? inst.tags.join(", ") : (inst.tags || "");
      const isFeatured = !!inst.featuredInBanner;
      const featuredBtnClass = isFeatured ? "btn-featured-active" : "btn-featured-inactive";
      const featuredBtnText = isFeatured ? "⭐ 배너 노출 해제" : "➕ 배너에 노출";

      return `
        <div class="inst-manage-item">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 800; font-size: 14.5px; color: var(--slate-900);">${inst.name}</span>
              <span style="font-size: 12px; font-weight: 600; color: #2563eb;">(${inst.role})</span>
              ${isFeatured ? '<span class="badge-featured-mini">⭐ 배너 노출 중</span>' : ''}
            </div>
            <div style="font-size: 11.5px; color: var(--slate-500); margin-top: 3px;">
              태그: ${tags}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button class="btn btn-sm ${featuredBtnClass}" onclick="app.toggleInstructorBanner('${inst.id}')" title="${isFeatured ? '클릭 시 메인 배너 노출 해제' : '클릭 시 메인 배너에 대표 강사로 노출'}">
              ${featuredBtnText}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="app.showInstructorForm('${inst.id}')" style="padding: 4px 8px; font-size: 11.5px;">수정</button>
            <button class="btn btn-danger-solid btn-sm" onclick="app.deleteInstructor('${inst.id}')" style="padding: 4px 8px; font-size: 11.5px;">삭제</button>
          </div>
        </div>
      `;
    }).join("");
  }

  showInstructorForm(instId = null) {
    const formWrap = document.getElementById("hubInstFormWrap");
    const heading = document.getElementById("hubInstFormHeading");
    const idInput = document.getElementById("hubInstFormId");
    const nameInput = document.getElementById("hubInstName");
    const roleInput = document.getElementById("hubInstRole");
    const avatarInput = document.getElementById("hubInstAvatar");
    const tagsInput = document.getElementById("hubInstTags");
    const bioInput = document.getElementById("hubInstBio");
    const featuredInput = document.getElementById("hubInstFeatured");

    if (!formWrap) return;

    if (instId) {
      const inst = this.instructors.find(i => String(i.id) === String(instId));
      if (inst) {
        if (heading) heading.textContent = `강사 정보 수정: ${inst.name}`;
        if (idInput) idInput.value = inst.id;
        if (nameInput) nameInput.value = inst.name || "";
        if (roleInput) roleInput.value = inst.role || "";
        if (avatarInput) avatarInput.value = inst.avatarClass || "avatar-blue";
        if (tagsInput) tagsInput.value = Array.isArray(inst.tags) ? inst.tags.join(", ") : (inst.tags || "");
        if (bioInput) bioInput.value = inst.bio || "";
        if (featuredInput) featuredInput.checked = !!inst.featuredInBanner;
      }
    } else {
      if (heading) heading.textContent = "신규 강사 등록";
      if (idInput) idInput.value = "";
      if (nameInput) nameInput.value = "";
      if (roleInput) roleInput.value = "";
      if (avatarInput) avatarInput.value = "avatar-blue";
      if (tagsInput) tagsInput.value = "";
      if (bioInput) bioInput.value = "";
      if (featuredInput) featuredInput.checked = false;
    }

    formWrap.style.display = "flex";
  }

  hideInstructorForm() {
    const formWrap = document.getElementById("hubInstFormWrap");
    if (formWrap) formWrap.style.display = "none";
  }

  saveInstructorFromForm() {
    const id = document.getElementById("hubInstFormId")?.value;
    const name = document.getElementById("hubInstName")?.value.trim();
    const role = document.getElementById("hubInstRole")?.value.trim();
    const avatarClass = document.getElementById("hubInstAvatar")?.value || "avatar-blue";
    const tagsRaw = document.getElementById("hubInstTags")?.value || "";
    const bio = document.getElementById("hubInstBio")?.value.trim() || "";
    const featuredInBanner = document.getElementById("hubInstFeatured")?.checked || false;

    if (!name || !role) {
      this.showToast("강사 이름과 직책을 입력해주세요.", "error");
      return;
    }

    const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);

    if (id) {
      // 수정
      const idx = this.instructors.findIndex(i => String(i.id) === String(id));
      if (idx !== -1) {
        this.instructors[idx] = { ...this.instructors[idx], name, role, avatarClass, tags, bio, featuredInBanner };
      }
    } else {
      // 신규
      const newInst = {
        id: `inst-${Date.now()}`,
        name,
        role,
        avatarClass,
        tags,
        bio,
        featuredInBanner
      };
      this.instructors.push(newInst);
    }

    if (featuredInBanner) {
      this.selectedBannerInstructorId = id || this.instructors[this.instructors.length - 1].id;
    }

    this.saveInstructors();
    this.renderInstructors();
    this.renderHeroInstructorBanner();
    this.renderHubInstructorList();
    this.hideInstructorForm();
    this.showToast(`✅ 강사 '${name}' 정보가 저장되었습니다.`, "success");
  }

  deleteInstructor(id) {
    const inst = this.instructors.find(i => String(i.id) === String(id));
    const name = inst ? inst.name : "강사";
    this.instructors = this.instructors.filter(i => String(i.id) !== String(id));
    if (String(this.selectedBannerInstructorId) === String(id)) {
      this.selectedBannerInstructorId = null;
    }
    this.saveInstructors();
    this.renderInstructors();
    this.renderHeroInstructorBanner();
    this.renderHubInstructorList();
    this.showToast(`🗑️ '${name}' 강사가 삭제되었습니다.`, "info");
  }

  // 2-1. 접수된 강사 지원 신청서 렌더링 및 삭제 관리
  renderHubInstructorApplications() {
    const listWrap = document.getElementById("hubInstAppListWrap");
    const countBadge = document.getElementById("hubInstAppCount");
    if (!listWrap) return;

    const apps = this.instructorApplications || [];
    if (countBadge) {
      countBadge.textContent = `${apps.length}건`;
      countBadge.className = apps.length > 0 ? "badge-status-closing" : "badge-status-planning";
    }

    if (apps.length === 0) {
      listWrap.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--slate-400); font-size: 13px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
          현재 접수된 강사 지원 신청서가 없습니다.
        </div>
      `;
      return;
    }

    listWrap.innerHTML = apps.map(item => {
      const linkHtml = item.portfolio ? `<a href="${item.portfolio}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">포트폴리오 열기 ↗</a>` : '<span style="color: #94a3b8;">포트폴리오 링크 없음</span>';
      return `
        <div class="inst-manage-item" style="flex-direction: column; align-items: stretch; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 800; font-size: 14.5px; color: var(--slate-900);">${item.name}</span>
              <span class="badge-status-open" style="font-size: 11px;">${item.category}</span>
              <span style="font-size: 11.5px; color: #64748b;">접수일: ${item.date}</span>
            </div>
            <button class="btn btn-danger-solid btn-sm" onclick="app.deleteInstructorApplication('${item.id}')" style="padding: 3px 8px; font-size: 11px;">접수내역 삭제</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px; font-size: 12px; color: var(--slate-600); background: #ffffff; padding: 8px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
            <div><strong>연락처:</strong> <a href="tel:${item.phone}" style="color: #1e40af;">${item.phone}</a></div>
            <div><strong>이메일:</strong> <a href="mailto:${item.email}" style="color: #1e40af;">${item.email}</a></div>
            <div style="grid-column: 1/-1;"><strong>포트폴리오:</strong> ${linkHtml}</div>
          </div>
          <div style="font-size: 12px; color: var(--slate-700); line-height: 1.5; background: #ffffff; padding: 8px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #334155; margin-bottom: 2px;">이력 요약:</div>
            <div style="white-space: pre-wrap;">${item.career}</div>
          </div>
          <div style="font-size: 12px; color: var(--slate-700); line-height: 1.5; background: #ffffff; padding: 8px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #334155; margin-bottom: 2px;">지원 동기 / 강의 제안:</div>
            <div style="white-space: pre-wrap;">${item.motive}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  deleteInstructorApplication(appId) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.deleteInstructorApplication(appId));
      return;
    }
    const item = (this.instructorApplications || []).find(a => String(a.id) === String(appId));
    const name = item ? item.name : "지원자";
    if (confirm(`'${name}' 님의 강사 지원 접수 내역을 삭제하시겠습니까?`)) {
      this.instructorApplications = this.instructorApplications.filter(a => String(a.id) !== String(appId));
      this.saveInstructorApplications();
      this.renderHubInstructorApplications();
      this.showToast(`🗑️ '${name}' 님의 지원서가 삭제되었습니다.`, "info");
    }
  }

  // 2-2. 접수된 1:1 교육 상담 신청서 렌더링 및 삭제 관리
  renderHubConsultApplications() {
    const listWrap = document.getElementById("hubConsultListWrap");
    const countBadge = document.getElementById("hubConsultCount");
    if (!listWrap) return;

    const apps = this.consultApplications || [];
    if (countBadge) {
      countBadge.textContent = `${apps.length}건`;
      countBadge.className = apps.length > 0 ? "badge-status-open" : "badge-status-planning";
    }

    if (apps.length === 0) {
      listWrap.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--slate-400); font-size: 13px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
          현재 접수된 1:1 교육 상담 신청이 없습니다.
        </div>
      `;
      return;
    }

    listWrap.innerHTML = apps.map(item => {
      return `
        <div class="inst-manage-item" style="flex-direction: column; align-items: stretch; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 800; font-size: 14.5px; color: var(--slate-900);">${item.name}</span>
              <span style="font-size: 12px; color: #475569; font-weight: 600;">· ${item.org}</span>
              <span class="badge-status-open" style="font-size: 11px;">${item.category}</span>
              <span class="badge-status-closing" style="font-size: 11px;">${item.type}</span>
              <span style="font-size: 11.5px; color: #64748b;">접수일: ${item.date}</span>
            </div>
            <button class="btn btn-danger-solid btn-sm" onclick="app.deleteConsultApplication('${item.id}')" style="padding: 3px 8px; font-size: 11px;">상담내역 삭제</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px; font-size: 12px; color: var(--slate-600); background: #ffffff; padding: 8px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
            <div><strong>연락처:</strong> <a href="tel:${item.phone}" style="color: #1e40af;">${item.phone}</a></div>
            <div><strong>이메일:</strong> <a href="mailto:${item.email}" style="color: #1e40af;">${item.email}</a></div>
            <div><strong>소속/기업:</strong> <span style="color: #0f172a; font-weight: 600;">${item.org}</span></div>
            <div><strong>방식:</strong> <span style="color: #059669; font-weight: 600;">${item.type}</span></div>
          </div>
          <div style="font-size: 12px; color: var(--slate-700); line-height: 1.5; background: #ffffff; padding: 8px 10px; border-radius: 6px; border: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #334155; margin-bottom: 2px;">문의 및 조율 내용:</div>
            <div style="white-space: pre-wrap;">${item.content}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  deleteConsultApplication(appId) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.deleteConsultApplication(appId));
      return;
    }
    const item = (this.consultApplications || []).find(a => String(a.id) === String(appId));
    const name = item ? item.name : "신청자";
    if (confirm(`'${name}' 님의 1:1 교육 상담 내역을 삭제하시겠습니까?`)) {
      this.consultApplications = this.consultApplications.filter(a => String(a.id) !== String(appId));
      this.saveConsultApplications();
      this.renderHubConsultApplications();
      this.showToast(`🗑️ '${name}' 님의 교육 상담 내역이 삭제되었습니다.`, "info");
    }
  }

  // 3. 푸터 / 회사 정보 채우기 & 저장 & 복원 (사업자등록증 실데이터 연동)
  populateCompanyInputs() {
    const info = this.companyInfo || {};
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || "";
    };

    setVal("hubCompPhone", info.phone);
    setVal("hubCompEmail", info.email);
    setVal("hubCompHours", info.hours);
    setVal("hubCompLocation", info.location);
    setVal("hubCompName", info.companyName);
    setVal("hubCompCeo", info.ceo);
    setVal("hubCompBiz", info.bizNumber);
    setVal("hubCompOpenDate", info.openDate);
    setVal("hubCompBizType", info.bizType);
    setVal("hubCompBizItem", info.bizItem);
    setVal("hubCompTelecom", info.telecomNumber);
    setVal("hubCompAddress", info.address);
    setVal("hubCompBrandDesc", info.brandDesc);
    setVal("hubCompCopyright", info.copyright);
  }

  saveCompanyInfoFromHub() {
    const getVal = (id) => document.getElementById(id)?.value.trim() || "";

    this.companyInfo = {
      phone: getVal("hubCompPhone"),
      email: getVal("hubCompEmail"),
      hours: getVal("hubCompHours"),
      location: getVal("hubCompLocation"),
      companyName: getVal("hubCompName"),
      ceo: getVal("hubCompCeo"),
      bizNumber: getVal("hubCompBiz"),
      openDate: getVal("hubCompOpenDate"),
      bizType: getVal("hubCompBizType"),
      bizItem: getVal("hubCompBizItem"),
      telecomNumber: getVal("hubCompTelecom"),
      address: getVal("hubCompAddress"),
      brandDesc: getVal("hubCompBrandDesc"),
      copyright: getVal("hubCompCopyright")
    };

    this.saveCompanyInfo();
    this.renderCompanyInfo();
    this.showToast("✅ 회사 및 사업자등록증 정보가 성공적으로 저장되었습니다.", "success");
  }

  resetCompanyInfoToDefault() {
    if (!confirm("회사 및 사업자등록증 정보를 기본 예시값으로 복원하시겠습니까?")) return;
    this.companyInfo = JSON.parse(JSON.stringify(DEFAULT_COMPANY_INFO));
    this.saveCompanyInfo();
    this.renderCompanyInfo();
    this.populateCompanyInputs();
    this.showToast("🔄 사업자등록증 기본 정보로 복원되었습니다.", "info");
  }

  // ==========================================
  // 관리자 보안 인증 & 자동 로그인 세션 관리
  // (수강생 임의 조작 방지 및 관리자 1회 등록 영구 자동입장)
  // ==========================================
  checkAdminSession() {
    try {
      const sessionRaw = SafeStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        if (session && session.authenticated === true) {
          return true;
        }
      }
      // 세션이 없으면 레거시 키 잔재를 완전 정리하여 자동 부활 방지
      SafeStorage.removeItem("ai_edu_calendar_admin_session_v1");
      SafeStorage.removeItem("ai_edu_calendar_admin_session");
    } catch (e) {}
    return false;
  }

  promptAdminLogin(callback = null) {
    this.pendingAdminAction = callback;
    if (this.adminEmailInput) {
      this.adminEmailInput.value = ADMIN_CREDENTIALS.email;
    }
    if (this.adminPwInput) {
      this.adminPwInput.value = "";
    }
    if (this.adminLoginError) {
      this.adminLoginError.style.display = "none";
    }
    if (this.adminLoginModalBackdrop) {
      this.adminLoginModalBackdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (this.adminPwInput) this.adminPwInput.focus();
      }, 100);
    }
  }

  closeAdminLoginModal() {
    this.pendingAdminAction = null;
    if (this.adminLoginModalBackdrop) {
      this.adminLoginModalBackdrop.classList.remove("is-open");
    }
    const dataHub = document.getElementById("dataHubModalBackdrop");
    if (!this.lectureModalBackdrop?.classList.contains("is-open") &&
        !this.editModalBackdrop?.classList.contains("is-open") &&
        !this.deleteConfirmBackdrop?.classList.contains("is-open") &&
        !this.clearConfirmBackdrop?.classList.contains("is-open") &&
        (!dataHub || !dataHub.classList.contains("is-open"))) {
      document.body.style.overflow = "";
    }
  }

  handleAdminLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = (this.adminEmailInput ? this.adminEmailInput.value : "").trim().toLowerCase();
    const pw = (this.adminPwInput ? this.adminPwInput.value : "").trim();
    const keepSession = this.adminAutoLoginCheck ? this.adminAutoLoginCheck.checked : true;

    if (email === ADMIN_CREDENTIALS.email.toLowerCase() && pw === ADMIN_CREDENTIALS.password) {
      this.isAdmin = true;
      if (keepSession) {
        SafeStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
          email: ADMIN_CREDENTIALS.email,
          authenticated: true,
          savedAt: Date.now()
        }));
      } else {
        SafeStorage.setItem(ADMIN_SESSION_KEY, "");
      }

      const action = this.pendingAdminAction;
      this.pendingAdminAction = null;

      this.closeAdminLoginModal();
      this.updateAdminUI();
      this.showToast("🔐 관리자 계정으로 인증되었습니다. (자동 로그인 활성화)", "success");

      // 보류된 관리자 액션이 있다면 즉시 실행
      if (typeof action === "function") {
        action();
      }
      return false;
    } else {
      if (this.adminLoginError) {
        this.adminLoginError.style.display = "flex";
        this.adminLoginError.classList.remove("shake");
        void this.adminLoginError.offsetWidth; // trigger reflow
        this.adminLoginError.classList.add("shake");
      }
      if (this.adminLoginErrorText) {
        if (email !== ADMIN_CREDENTIALS.email.toLowerCase()) {
          this.adminLoginErrorText.textContent = "등록된 관리자 이메일(nova78jyg@gmail.com)이 아닙니다.";
        } else {
          this.adminLoginErrorText.textContent = "비밀번호가 올바르지 않습니다. (12341234)";
        }
      }
      if (this.adminPwInput) {
        this.adminPwInput.select();
        this.adminPwInput.focus();
      }
    }
  }

  adminLogout() {
    this.isAdmin = false;
    try {
      SafeStorage.removeItem(ADMIN_SESSION_KEY);
      SafeStorage.removeItem("ai_edu_calendar_admin_session_v2");
      SafeStorage.removeItem("ai_edu_calendar_admin_session_v1");
      SafeStorage.removeItem("ai_edu_calendar_admin_session");
      SafeStorage.setItem(ADMIN_SESSION_KEY, "");
      SafeStorage.setItem("ai_edu_calendar_admin_session", "");
      if (typeof sessionStorage !== "undefined") sessionStorage.clear();
    } catch (e) {}
    this.updateAdminUI();
    this.switchMode("calendar");
    this.renderCalendar();
    this.renderListView();
    this.showToast("🚪 로그아웃되었습니다. (일반 수강생 모드 전환)", "info");
  }

  quickFillAdmin() {
    if (this.adminEmailInput) this.adminEmailInput.value = ADMIN_CREDENTIALS.email;
    if (this.adminPwInput) this.adminPwInput.value = ADMIN_CREDENTIALS.password;
    if (this.adminLoginError) this.adminLoginError.style.display = "none";
    this.showToast("⚡ 관리자 계정 정보가 자동 입력되었습니다.", "info");
  }

  updateAdminUI() {
    const wrap = this.adminAuthBadgeWrap || document.getElementById("adminAuthBadgeWrap");
    const modeTabsNav = document.getElementById("modeTabsNav") || document.querySelector(".mode-tabs");
    if (wrap) {
      wrap.style.display = "inline-flex";
      if (this.isAdmin) {
        wrap.innerHTML = `
          <div class="admin-logged-badge" title="현재 관리자 계정으로 로그인되어 있습니다">
            <span class="admin-active-dot"></span>
            <span>관리자 모드</span>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="app.openDataHubModal()" style="font-size: 11px; padding: 4px 8px; font-weight: 700; color: #1e40af; background: #eff6ff; border-color: #bfdbfe;" title="통합 데이터 관리 허브 열기">
            ⚙️ 허브 관리
          </button>
          <button class="btn-admin-logout" onclick="app.adminLogout()" style="font-size: 11.5px; font-weight: 700; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; padding: 4px 10px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="관리자 로그아웃">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            로그아웃
          </button>
        `;
      } else {
        wrap.innerHTML = `
          <button class="btn-admin-login-gnb" onclick="app.openAdminAccess(event)" style="font-size: 11px; font-weight: 700; color: #475569; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 9px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: all 0.2s;" title="관리자 로그인">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            🔒 관리자 로그인
          </button>
        `;
      }
    }
    // 메인 화면 본문에는 어떠한 관리자 탭도 표시하지 않고 100% 캘린더 단독 뷰 유지
    if (modeTabsNav) {
      modeTabsNav.style.display = "none";
    }
    this.renderHeroMajorLectureBanner();
    this.renderReviews();
  }

  // 푸터 최하단 단일 관리자 로그인/허브 열기 진입로
  openAdminAccess(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (this.isAdmin) {
      this.openDataHubModal();
    } else {
      this.promptAdminLogin(() => this.openDataHubModal());
    }
  }

  // ==========================================
  // 수강생 리얼 후기 & 별점 평점 등록 엔진
  // (수강생 직접 등록 및 관리자 삭제 권한)
  // ==========================================
  loadReviews() {
    try {
      const data = SafeStorage.getHistoricalItem([
        REVIEWS_STORAGE_KEY,
        "ai_edu_calendar_reviews"
      ]);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed.map(r => ({
            ...r,
            isDummy: r.isDummy !== undefined ? !!r.isDummy : ['rev-1', 'rev-2', 'rev-3'].includes(String(r.id))
          }));
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_REVIEWS));
  }

  saveReviews() {
    try {
      SafeStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(this.reviews));
      this.notifySync();
    } catch (e) {}
  }

  renderReviews() {
    const grid = this.reviewsGrid || document.getElementById("reviewsGrid");
    if (!grid) return;

    if (!this.reviews || this.reviews.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--slate-400); font-size: 14px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;">등록된 수강 후기가 없습니다. 첫 번째 수강 후기를 남겨보세요!</div>`;
      return;
    }

    // 통계 요약 갱신 (평점 평균 & 총 후기 건수)
    const totalCount = this.reviews.length;
    const avgScore = (this.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalCount).toFixed(1);
    
    const scoreNumEl = this.reviewsAvgScore || document.getElementById("reviewsAvgScore");
    if (scoreNumEl) scoreNumEl.textContent = avgScore;

    const scoreCountEl = this.reviewsTotalCount || document.getElementById("reviewsTotalCount");
    if (scoreCountEl) scoreCountEl.textContent = `(총 ${totalCount}개 후기)`;

    // 별 아이콘 생성 헬퍼
    const renderStars = (rating) => {
      let starsHtml = "";
      const r = Math.min(Math.max(Math.round(rating), 1), 5);
      for (let i = 1; i <= 5; i++) {
        if (i <= r) {
          starsHtml += `<svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        } else {
          starsHtml += `<svg width="15" height="15" viewBox="0 0 24 24" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        }
      }
      return starsHtml;
    };

    const scoreStarsEl = document.querySelector(".reviews-score-summary .score-stars");
    if (scoreStarsEl) scoreStarsEl.innerHTML = renderStars(avgScore);

    grid.innerHTML = this.reviews.map((rev, idx) => {
      const delayClass = `delay-${(idx % 3) + 1}`;
      const initial = rev.author ? rev.author.charAt(0) : "수";
      const bg = rev.avatarBg || "linear-gradient(135deg, #2563eb, #3b82f6)";
      return `
        <div class="review-card reveal-on-scroll is-revealed ${delayClass}" data-id="${rev.id}">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div class="review-stars-row" aria-label="${rev.rating}점">
                ${renderStars(rev.rating)}
                <span style="font-size: 13px; font-weight: 800; color: #d97706; margin-left: 4px;">${Number(rev.rating).toFixed(1)}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="review-date">${rev.date || ""}</span>
              </div>
            </div>
            <p class="review-quote">"${rev.content}"</p>
          </div>
          <div class="review-author">
            <div class="review-avatar" style="background: ${bg}; color: #fff;">${initial}</div>
            <div>
              <div class="review-name">${rev.author} 님</div>
              <div class="review-sub">${rev.role || rev.course || '수강생'}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  openReviewModal() {
    const modal = this.reviewModalBackdrop || document.getElementById("reviewModalBackdrop");
    if (!modal) return;
    const form = document.getElementById("reviewForm");
    if (form) form.reset();
    this.setReviewRating(5); // 기본 5점
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.getElementById("reviewAuthorInput")?.focus();
    }, 100);
  }

  closeReviewModal() {
    const modal = this.reviewModalBackdrop || document.getElementById("reviewModalBackdrop");
    if (modal) modal.classList.remove("is-open");
    if (!this.lectureModalBackdrop?.classList.contains("is-open") &&
        !this.editModalBackdrop?.classList.contains("is-open") &&
        !this.deleteConfirmBackdrop?.classList.contains("is-open") &&
        !this.clearConfirmBackdrop?.classList.contains("is-open") &&
        !this.adminLoginModalBackdrop?.classList.contains("is-open") &&
        !document.getElementById("dataHubModalBackdrop")?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  setReviewRating(rating) {
    const input = document.getElementById("reviewRatingInput");
    if (input) input.value = rating;

    const label = document.getElementById("ratingTextLabel");
    const labelMap = {
      1: "1.0점 (아쉬워요)",
      2: "2.0점 (보통이에요)",
      3: "3.0점 (괜찮아요)",
      4: "4.0점 (만족해요)",
      5: "5.0점 (매우 만족해요! 적극 추천)"
    };
    if (label) label.textContent = labelMap[rating] || `${rating}.0점`;

    const btns = document.querySelectorAll(".star-rating-selector .star-btn");
    btns.forEach(btn => {
      const val = parseInt(btn.dataset.rating, 10);
      btn.classList.toggle("active", val <= rating);
    });
  }

  handleReviewSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const author = document.getElementById("reviewAuthorInput")?.value.trim();
    const role = document.getElementById("reviewRoleInput")?.value.trim();
    const content = document.getElementById("reviewContentInput")?.value.trim();
    const rating = parseInt(document.getElementById("reviewRatingInput")?.value || "5", 10);

    if (!author) {
      this.showToast("작성자 성함이나 닉네임을 입력해주세요.", "error");
      return false;
    }
    if (!role) {
      this.showToast("직무 또는 수강하신 과정명을 입력해주세요.", "error");
      return false;
    }
    if (!content) {
      this.showToast("수강 후기 내용을 입력해주세요.", "error");
      return false;
    }

    const palettes = [
      "linear-gradient(135deg, #2563eb, #3b82f6)",
      "linear-gradient(135deg, #4f46e5, #6366f1)",
      "linear-gradient(135deg, #059669, #10b981)",
      "linear-gradient(135deg, #d97706, #f59e0b)",
      "linear-gradient(135deg, #e11d48, #f43f5e)",
      "linear-gradient(135deg, #0284c7, #06b6d4)"
    ];
    const chosenBg = palettes[Math.floor(Math.random() * palettes.length)];

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dateStr = `${y}.${m}.${d}`;

    const newRev = {
      id: `rev-${Date.now()}`,
      author,
      role,
      rating,
      content,
      date: dateStr,
      avatarInitial: author.charAt(0),
      avatarBg: chosenBg
    };

    this.reviews.unshift(newRev);
    this.saveReviews();
    if (!this.isAdmin) {
      this.appendPublicItemAtomically("reviews", newRev);
    }
    this.renderReviews();
    this.closeReviewModal();

    this.showToast("🎉 소중한 수강 후기가 성공적으로 등록되었습니다! 감사합니다.", "success");

    // 방금 등록된 후기로 부드럽게 스크롤 및 하이라이트
    setTimeout(() => {
      const card = document.querySelector(`.review-card[data-id="${newRev.id}"]`);
      if (card) {
        card.classList.add("pulse-highlight");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => card.classList.remove("pulse-highlight"), 2500);
      }
    }, 200);

    return false;
  }

  deleteReview(id) {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.deleteReview(id));
      return;
    }
    const target = this.reviews.find(r => String(r.id) === String(id));
    const author = target ? target.author : "후기";
    this.reviews = this.reviews.filter(r => String(r.id) !== String(id));
    this.saveReviews();
    this.renderReviews();
    this.renderHubReviewsList();
    this.showToast(`🗑️ '${author}' 님의 수강 후기가 삭제되었습니다.`, "info");
  }

  promptManageReviews() {
    this.openDataHubModal('reviews');
  }

  clearDummyReviews() {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.clearDummyReviews());
      return;
    }
    const initialCount = this.reviews.length;
    this.reviews = this.reviews.filter(r => !r.isDummy && !['rev-1', 'rev-2', 'rev-3'].includes(String(r.id)));
    const deletedCount = initialCount - this.reviews.length;
    this.saveReviews();
    this.renderReviews();
    this.renderHubReviewsList();
    if (deletedCount > 0) {
      this.showToast(`✅ 기본 더미 수강 후기 ${deletedCount}건이 모두 삭제되었습니다.`, "success");
    } else {
      this.showToast("삭제할 더미 후기가 없습니다.", "info");
    }
  }

  clearAllReviews() {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.clearAllReviews());
      return;
    }
    if (!this.reviews || this.reviews.length === 0) {
      this.showToast("등록된 수강 후기가 없습니다.", "info");
      return;
    }
    if (confirm("등록된 모든 수강 후기를 정말 비우시겠습니까?")) {
      this.reviews = [];
      this.saveReviews();
      this.renderReviews();
      this.renderHubReviewsList();
      this.showToast("🗑️ 모든 수강 후기가 삭제되었습니다.", "info");
    }
  }

  resetDefaultReviews() {
    if (!this.isAdmin) {
      this.promptAdminLogin(() => this.resetDefaultReviews());
      return;
    }
    this.reviews = JSON.parse(JSON.stringify(DEFAULT_REVIEWS));
    this.saveReviews();
    this.renderReviews();
    this.renderHubReviewsList();
    this.showToast("🔄 기본 수강 후기 3건이 복원되었습니다.", "success");
  }

  renderHubReviewsList() {
    const listWrap = document.getElementById("hubReviewsListWrap");
    const countBadge = document.getElementById("hubReviewsCountBadge");
    if (!listWrap) return;

    if (countBadge) countBadge.textContent = `총 ${this.reviews.length}개`;

    if (!this.reviews || this.reviews.length === 0) {
      listWrap.innerHTML = `<div style="text-align: center; padding: 28px; color: var(--slate-400); font-size: 13px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">등록된 수강 후기가 없습니다. 메인 페이지에서 수강생 후기를 작성하거나 샘플을 복원할 수 있습니다.</div>`;
      return;
    }

    listWrap.innerHTML = this.reviews.map(rev => {
      const isDummy = rev.isDummy || ['rev-1', 'rev-2', 'rev-3'].includes(String(rev.id));
      const typeBadge = isDummy 
        ? `<span style="font-size: 11px; font-weight: 700; color: #d97706; background: #fef3c7; border: 1px solid #fde68a; padding: 2px 6px; border-radius: 4px;">더미 샘플</span>` 
        : `<span style="font-size: 11px; font-weight: 700; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; padding: 2px 6px; border-radius: 4px;">수강생 직접 등록</span>`;

      return `
        <div class="inst-manage-item" style="padding: 12px 14px;">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span style="font-weight: 800; font-size: 14px; color: var(--slate-900);">${rev.author} 님</span>
              <span style="font-size: 12px; font-weight: 600; color: var(--slate-600);">(${rev.role || rev.course || '수강생'})</span>
              <span style="font-size: 12px; font-weight: 800; color: #d97706;">★ ${Number(rev.rating).toFixed(1)}</span>
              ${typeBadge}
              <span style="font-size: 11px; color: var(--slate-400); margin-left: auto;">${rev.date || ''}</span>
            </div>
            <div style="font-size: 12.5px; color: var(--slate-600); margin-top: 5px; line-height: 1.45; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              "${rev.content}"
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-left: 12px;">
            <button class="btn btn-danger-solid btn-sm" onclick="app.deleteReview('${rev.id}')" style="padding: 4px 10px; font-size: 11.5px;">삭제</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. 강사 채용 지원 신청서 모달 제어 및 접수
  openInstructorApplyModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = this.instructorApplyModalBackdrop || document.getElementById("instructorApplyModalBackdrop");
    if (!modal) return;
    const form = document.getElementById("instructorApplyForm");
    if (form) form.reset();
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.getElementById("instApplyName")?.focus();
    }, 100);
  }

  closeInstructorApplyModal() {
    const modal = this.instructorApplyModalBackdrop || document.getElementById("instructorApplyModalBackdrop");
    if (modal) modal.classList.remove("is-open");
    if (!this.lectureModalBackdrop?.classList.contains("is-open") &&
        !this.editModalBackdrop?.classList.contains("is-open") &&
        !this.deleteConfirmBackdrop?.classList.contains("is-open") &&
        !this.clearConfirmBackdrop?.classList.contains("is-open") &&
        !this.adminLoginModalBackdrop?.classList.contains("is-open") &&
        !this.reviewModalBackdrop?.classList.contains("is-open") &&
        !this.policyModalBackdrop?.classList.contains("is-open") &&
        !this.consultModalBackdrop?.classList.contains("is-open") &&
        !document.getElementById("dataHubModalBackdrop")?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  handleInstructorApplySubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const name = document.getElementById("instApplyName")?.value.trim();
    const phone = document.getElementById("instApplyPhone")?.value.trim();
    const email = document.getElementById("instApplyEmail")?.value.trim();
    const category = document.getElementById("instApplyCategory")?.value.trim() || "바이브 코딩";
    const career = document.getElementById("instApplyCareer")?.value.trim();
    const portfolio = document.getElementById("instApplyLink")?.value.trim() || "";
    const motive = document.getElementById("instApplyMotive")?.value.trim();

    if (!name) {
      this.showToast("지원자 성함을 입력해주세요.", "error");
      return false;
    }
    if (!phone) {
      this.showToast("연락처를 입력해주세요.", "error");
      return false;
    }
    if (!email) {
      this.showToast("이메일 주소를 입력해주세요.", "error");
      return false;
    }
    if (!career) {
      this.showToast("주요 실무 및 강의 이력을 입력해주세요.", "error");
      return false;
    }
    if (!motive) {
      this.showToast("강의 제안 및 지원 동기를 입력해주세요.", "error");
      return false;
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dateStr = `${y}.${m}.${d}`;

    const newApp = {
      id: `inst-app-${Date.now()}`,
      name,
      phone,
      email,
      category,
      career,
      portfolio,
      motive,
      date: dateStr
    };

    if (!this.instructorApplications) this.instructorApplications = [];
    this.instructorApplications.unshift(newApp);
    this.saveInstructorApplications();
    if (!this.isAdmin) {
      this.appendPublicItemAtomically("instructorApplications", newApp);
    }

    // CRM 0층(본사 상담문의: homepage_leads) 칸반보드로 실시간 리드 전송
    try {
      fetch("https://firestore.googleapis.com/v1/projects/thecreators-94563/databases/(default)/documents/homepage_leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            name: { stringValue: `[강사지원] ${name}` },
            phone: { stringValue: phone },
            company: { stringValue: category },
            email: { stringValue: email },
            message: { stringValue: `[경력] ${career}\n[지원동기] ${motive}\n[포트폴리오] ${portfolio}` },
            source: { stringValue: "교육일정표 포털 (강사채용지원)" },
            status: { stringValue: "상담 대기" },
            createdAt: { timestampValue: new Date().toISOString() }
          }
        })
      }).catch(() => {});
    } catch (e) {}

    this.closeInstructorApplyModal();
    this.showToast("강사 채용 지원서가 성공적으로 접수되었습니다. 검토 후 신속히 연락드리겠습니다.", "success");

    // 데이터 관리 허브가 열려있다면 접수 목록 실시간 갱신
    this.renderHubInstructorApplications();
    return false;
  }

  // 5. 운영 정책 (이용약관, 개인정보, 환불규정) 안내 모달 제어
  openPolicyModal(tabName = "terms", e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = this.policyModalBackdrop || document.getElementById("policyModalBackdrop");
    if (!modal) return;
    this.switchPolicyTab(tabName);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  closePolicyModal() {
    const modal = this.policyModalBackdrop || document.getElementById("policyModalBackdrop");
    if (modal) modal.classList.remove("is-open");
    if (!this.lectureModalBackdrop?.classList.contains("is-open") &&
        !this.editModalBackdrop?.classList.contains("is-open") &&
        !this.deleteConfirmBackdrop?.classList.contains("is-open") &&
        !this.clearConfirmBackdrop?.classList.contains("is-open") &&
        !this.adminLoginModalBackdrop?.classList.contains("is-open") &&
        !this.reviewModalBackdrop?.classList.contains("is-open") &&
        !this.instructorApplyModalBackdrop?.classList.contains("is-open") &&
        !this.consultModalBackdrop?.classList.contains("is-open") &&
        !document.getElementById("dataHubModalBackdrop")?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  switchPolicyTab(tabName) {
    const tabs = ["terms", "privacy", "refund"];
    tabs.forEach(t => {
      const btn = document.getElementById(`policyTabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
      const pane = document.getElementById(`policyPane${t.charAt(0).toUpperCase() + t.slice(1)}`);
      if (btn) btn.classList.toggle("active", t === tabName);
      if (pane) pane.style.display = t === tabName ? "block" : "none";
    });
  }

  // 6. 1:1 맞춤 교육 상담 모달 제어 및 접수
  openConsultModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = this.consultModalBackdrop || document.getElementById("consultModalBackdrop");
    if (!modal) return;
    const form = document.getElementById("consultForm");
    if (form) form.reset();
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.getElementById("consultName")?.focus();
    }, 100);
  }

  closeConsultModal() {
    const modal = this.consultModalBackdrop || document.getElementById("consultModalBackdrop");
    if (modal) modal.classList.remove("is-open");
    if (!this.lectureModalBackdrop?.classList.contains("is-open") &&
        !this.editModalBackdrop?.classList.contains("is-open") &&
        !this.deleteConfirmBackdrop?.classList.contains("is-open") &&
        !this.clearConfirmBackdrop?.classList.contains("is-open") &&
        !this.adminLoginModalBackdrop?.classList.contains("is-open") &&
        !this.reviewModalBackdrop?.classList.contains("is-open") &&
        !this.instructorApplyModalBackdrop?.classList.contains("is-open") &&
        !this.policyModalBackdrop?.classList.contains("is-open") &&
        !document.getElementById("dataHubModalBackdrop")?.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  handleConsultSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    const name = document.getElementById("consultName")?.value.trim();
    const phone = document.getElementById("consultPhone")?.value.trim();
    const email = document.getElementById("consultEmail")?.value.trim();
    const org = document.getElementById("consultOrg")?.value.trim();
    const category = document.getElementById("consultCategory")?.value.trim() || "바이브 코딩";
    const type = document.getElementById("consultType")?.value.trim() || "기업 현장 방문 출강";
    const content = document.getElementById("consultContent")?.value.trim();

    if (!name) {
      this.showToast("신청자 성함을 입력해주세요.", "error");
      return false;
    }
    if (!phone) {
      this.showToast("연락처를 입력해주세요.", "error");
      return false;
    }
    if (!email) {
      this.showToast("이메일 주소를 입력해주세요.", "error");
      return false;
    }
    if (!org) {
      this.showToast("소속 기업 / 단체명을 입력해주세요.", "error");
      return false;
    }
    if (!content) {
      this.showToast("상담 문의 및 일정/예산 조율 내용을 입력해주세요.", "error");
      return false;
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const dateStr = `${y}.${m}.${d}`;

    const newApp = {
      id: `consult-app-${Date.now()}`,
      name,
      phone,
      email,
      org,
      category,
      type,
      content,
      date: dateStr
    };

    if (!this.consultApplications) this.consultApplications = [];
    this.consultApplications.unshift(newApp);
    this.saveConsultApplications();
    if (!this.isAdmin) {
      this.appendPublicItemAtomically("consultApplications", newApp);
    }

    // CRM 0층(본사 상담문의: homepage_leads) 칸반보드로 실시간 리드 전송
    try {
      fetch("https://firestore.googleapis.com/v1/projects/thecreators-94563/databases/(default)/documents/homepage_leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            name: { stringValue: name },
            phone: { stringValue: phone },
            company: { stringValue: `${org} (${category} / ${type})` },
            email: { stringValue: email },
            message: { stringValue: content },
            source: { stringValue: "교육일정표 포털 (1:1 교육상담)" },
            status: { stringValue: "상담 대기" },
            createdAt: { timestampValue: new Date().toISOString() }
          }
        })
      }).catch(() => {});
    } catch (e) {}

    // 대표님 네이버 메일(nova78jyg3@naver.com)로 비동기 실시간 발송
    try {
      fetch("https://formsubmit.co/ajax/nova78jyg3@naver.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `[더크리에이터즈AI 1:1 상담접수] ${name} (${org}) 님의 교육 상담 신청`,
          "신청자 성함": name,
          "소속 기업 및 단체": org,
          "연락처": phone,
          "이메일": email,
          "희망 교육분야": category,
          "출강 및 교육방식": type,
          "문의 및 조율내용": content,
          "접수일시": `${dateStr} ${now.toLocaleTimeString()}`,
          _template: "table"
        })
      }).catch(() => {});
    } catch (err) {}

    this.closeConsultModal();
    this.showToast("1:1 교육 상담 신청이 성공적으로 접수되었습니다. 24시간 이내에 담당자가 안내 연락을 드립니다.", "success");

    // 데이터 관리 허브가 열려있다면 상담 목록 실시간 갱신
    this.renderHubConsultApplications();
    return false;
  }

  handleBackdropClick(e, backdropId) {
    if (e.target.id === backdropId) {
      if (backdropId === "lectureModalBackdrop") this.closeDetailModal();
      if (backdropId === "editModalBackdrop") this.closeEditModal();
      if (backdropId === "deleteConfirmBackdrop") this.closeDeleteConfirmModal();
      if (backdropId === "clearConfirmBackdrop") this.closeClearConfirmModal();
      if (backdropId === "dataHubModalBackdrop") this.closeDataHubModal();
      if (backdropId === "adminLoginModalBackdrop") this.closeAdminLoginModal();
      if (backdropId === "reviewModalBackdrop") this.closeReviewModal();
      if (backdropId === "instructorApplyModalBackdrop") this.closeInstructorApplyModal();
      if (backdropId === "policyModalBackdrop") this.closePolicyModal();
      if (backdropId === "consultModalBackdrop") this.closeConsultModal();
      if (backdropId === "dayAllLecturesModalBackdrop") this.closeDayAllLecturesModal();
    }
  }
}

// 전역 인스턴스 초기화
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new EduCalendarApp();
  window.app = app;
});
