'use client';

import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, serverTimestamp, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, app } from '../../lib/firebase';

const PALETTE = [
  'bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

const CATEGORIES = [
  "바이브코딩부트캠프",
  "AI기업업무자동화",
  "AX행정 지자체 및 공공기관 연수",
  "AI영상콘텐츠제작",
  "AI비지니스마케팅",
  "AI업무활용",
  "AI리터러시(기초)",
  "AI디자인&브랜딩",
  "AI맞춤형연수"
];

const STATUS_OPTIONS = ["기획/준비", "모집/접수중", "마감임박/확정", "진행/완료"];

export default function CalendarDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeMode, setActiveMode] = useState('portal_console'); // 'portal_console' | 'portal_table' | 'team_calendar'
  const iframeRef = useRef(null);

  // 1. 공식 교육 일정표 포털 마스터 상태 (Firestore: academy_portal/master_state 실시간 연동)
  const [portalState, setPortalState] = useState({
    lectures: [],
    stats: [],
    tickerItems: [],
    heroConfig: {},
    instructors: [],
    companyInfo: {},
    reviews: [],
    updatedAt: 0
  });
  const [quickFilterDate, setQuickFilterDate] = useState('');
  const [quickSearch, setQuickSearch] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickForm, setQuickForm] = useState({
    id: '',
    targetOrg: '',
    category: '바이브코딩부트캠프',
    status: '모집/접수중',
    date: '2026-10-15',
    startTime: '14:00',
    endTime: '17:00',
    instructor: '정시후 테크 디렉터',
    location: '더크리에이터즈AI 대강의장',
    isMajorFeatured: false
  });

  // 2. 기존 팀원 사내 공유 일정 상태
  const [events, setEvents] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEvent, setNewEvent] = useState({ title: '', color: 'bg-blue-500' });

  useEffect(() => {
    const auth = getAuth(app);
    const unsubAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));

    // 공식 일정표 포털 마스터 문서 실시간 구독
    const unsubPortal = onSnapshot(doc(db, 'academy_portal', 'master_state'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data?.payloadJson) {
          try {
            const parsed = JSON.parse(data.payloadJson);
            setPortalState({
              lectures: Array.isArray(parsed.lectures) ? parsed.lectures : [],
              stats: Array.isArray(parsed.stats) ? parsed.stats : [],
              tickerItems: Array.isArray(parsed.tickerItems) ? parsed.tickerItems : [],
              heroConfig: parsed.heroConfig || {},
              instructors: Array.isArray(parsed.instructors) ? parsed.instructors : [],
              companyInfo: parsed.companyInfo || {},
              reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
              instructorApplications: Array.isArray(parsed.instructorApplications) ? parsed.instructorApplications : [],
              consultApplications: Array.isArray(parsed.consultApplications) ? parsed.consultApplications : [],
              updatedAt: Number(data.updatedAt || parsed.updatedAt || Date.now())
            });
          } catch (err) {}
        }
      }
    });

    // 사내 공유 일정 로드
    const unsubEvents = onSnapshot(query(collection(db, 'shared_schedules')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 팀원 컬러 매핑 로드
    const unsubColors = onSnapshot(collection(db, 'calendar_colors'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setColorMap(map);
    });

    // 임베드된 일정표 포털(iframe)이 준비되면 보안 핸드셰이크 토큰 자동 응답
    const PORTAL_ADMIN_TOKEN = 'tc_portal_admin_v6_8077_secure';
    const handlePortalMessage = (e) => {
      if (!e || !e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'CRM_PORTAL_READY_FOR_HANDSHAKE') {
        iframeRef.current?.contentWindow?.postMessage({
          type: 'CRM_ADMIN_AUTH_HANDSHAKE',
          token: PORTAL_ADMIN_TOKEN
        }, '*');
      }
    };
    window.addEventListener('message', handlePortalMessage);

    return () => {
      unsubAuth();
      unsubPortal();
      unsubEvents();
      unsubColors();
      window.removeEventListener('message', handlePortalMessage);
    };
  }, []);

  // 클라우드(1순위: Firestore SSOT + 2순위: 본사 실서버 api.php Mirror)에 변경된 포털 마스터 데이터 즉시 저장
  const savePortalStateToCloud = async (nextLectures) => {
    const PORTAL_ADMIN_TOKEN = 'tc_portal_admin_v6_8077_secure';
    const nowTs = Date.now();
    const nextPayload = {
      version: 'v6',
      updatedAt: nowTs,
      exportedAt: new Date(nowTs).toISOString(),
      ...portalState,
      lectures: nextLectures
    };

    setPortalState(prev => ({ ...prev, lectures: nextLectures, updatedAt: nowTs }));

    // 1. 1순위 정본(SSOT) Firebase Firestore 저장
    try {
      await setDoc(doc(db, 'academy_portal', 'master_state'), {
        version: 'v6',
        updatedAt: nowTs,
        payloadJson: JSON.stringify(nextPayload)
      });
    } catch (e) {}

    // 2. 본사 실서버 /schedule/api.php 미러 동기화 (보안 토큰 포함)
    try {
      fetch('https://thecreator-mcn.com/schedule/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Creators-Admin-Token': PORTAL_ADMIN_TOKEN
        },
        body: JSON.stringify({ ...nextPayload, action: 'admin_save', adminToken: PORTAL_ADMIN_TOKEN })
      }).catch(() => {});
    } catch (e) {}

    // 3. 임베드된 포털 iframe에도 즉시 갱신 신호 전달 (보안 토큰 동봉)
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'CRM_CMD_PULL_CLOUD', token: PORTAL_ADMIN_TOKEN }, '*');
    }
  };

  // 임베드 포털 컨트롤 명령 전송 (보안 토큰 동봉)
  const sendPortalCommand = (type, payload) => {
    const PORTAL_ADMIN_TOKEN = 'tc_portal_admin_v6_8077_secure';
    if (activeMode !== 'portal_console') {
      setActiveMode('portal_console');
      setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage({ type, payload, token: PORTAL_ADMIN_TOKEN }, '*');
      }, 350);
    } else {
      iframeRef.current?.contentWindow?.postMessage({ type, payload, token: PORTAL_ADMIN_TOKEN }, '*');
    }
  };

  // CRM 빠른 강의 등록/수정 저장
  const handleQuickSaveLecture = async (e) => {
    e.preventDefault();
    const cleanOrg = quickForm.targetOrg.replace(/^\[+|\]+$/g, '').trim();
    if (!cleanOrg) return;
    const title = `[${cleanOrg}] ${quickForm.category}`;

    let nextLectures = [...(portalState.lectures || [])];
    if (quickForm.id) {
      nextLectures = nextLectures.map(l => String(l.id) === String(quickForm.id) ? {
        ...l,
        ...quickForm,
        targetOrg: cleanOrg,
        title
      } : l);
    } else {
      nextLectures.push({
        id: `lec-${Date.now()}`,
        title,
        targetOrg: cleanOrg,
        customType: '',
        category: quickForm.category,
        status: quickForm.status,
        date: quickForm.date,
        startTime: quickForm.startTime,
        endTime: quickForm.endTime,
        instructor: quickForm.instructor,
        location: quickForm.location,
        isMajorFeatured: !!quickForm.isMajorFeatured,
        curriculum: ['강의 커리큘럼 준비 중'],
        preparation: '개인 노트북 지참'
      });
    }

    await savePortalStateToCloud(nextLectures);
    setIsQuickAddOpen(false);
    setQuickForm({
      id: '',
      targetOrg: '',
      category: '바이브코딩부트캠프',
      status: '모집/접수중',
      date: quickForm.date,
      startTime: '14:00',
      endTime: '17:00',
      instructor: '정시후 테크 디렉터',
      location: '더크리에이터즈AI 대강의장',
      isMajorFeatured: false
    });
  };

  const handleQuickDeleteLecture = async (lecId, lecTitle) => {
    if (!window.confirm(`'${lecTitle}' 강의를 교육 일정표에서 삭제하시겠습니까? (기존 하드코딩 일정 포함 즉시 삭제됩니다)`)) return;
    const nextLectures = (portalState.lectures || []).filter(l => String(l.id) !== String(lecId));
    await savePortalStateToCloud(nextLectures);
  };

  const handleQuickStatusChange = async (lecId, newStatus) => {
    const nextLectures = (portalState.lectures || []).map(l => String(l.id) === String(lecId) ? { ...l, status: newStatus } : l);
    await savePortalStateToCloud(nextLectures);
  };

  const handleQuickToggleBanner = async (lecId) => {
    const nextLectures = (portalState.lectures || []).map(l => String(l.id) === String(lecId) ? { ...l, isMajorFeatured: !l.isMajorFeatured } : l);
    await savePortalStateToCloud(nextLectures);
  };

  const openQuickEdit = (lec) => {
    let org = lec.targetOrg || '';
    if (!org && lec.title) {
      const m = lec.title.match(/^\[(.*?)\]/);
      if (m) org = m[1];
    }
    setQuickForm({
      id: lec.id,
      targetOrg: org || lec.title,
      category: lec.category || '바이브코딩부트캠프',
      status: lec.status || '모집/접수중',
      date: lec.date || '2026-10-15',
      startTime: lec.startTime || '14:00',
      endTime: lec.endTime || '17:00',
      instructor: lec.instructor || '정시후',
      location: lec.location || '더크리에이터즈AI 대강의장',
      isMajorFeatured: !!lec.isMajorFeatured
    });
    setIsQuickAddOpen(true);
  };

  // 사내 캘린더 계산
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleClaimColor = async (colorClass) => {
    if (!currentUser) return;
    const myEmail = currentUser.email;
    const myName = currentUser.displayName || myEmail.split('@')[0];
    const isMaster = myEmail === 'nova78jyg@gmail.com';

    if (colorMap[colorClass]) {
      if (isMaster) {
        if (window.confirm(`[대표 권한] ${colorMap[colorClass].name}님의 컬러 지정을 해제하시겠습니까?`)) {
          await deleteDoc(doc(db, 'calendar_colors', colorClass));
        }
      } else if (colorMap[colorClass].email === myEmail) {
        if (window.confirm(`내 컬러 지정을 해제하시겠습니까?`)) {
          await deleteDoc(doc(db, 'calendar_colors', colorClass));
        }
      } else {
        alert(`이미 ${colorMap[colorClass].name}님이 사용 중인 컬러입니다.`);
      }
      return;
    }

    const existingMyColor = Object.keys(colorMap).find(key => colorMap[key].email === myEmail);
    if (existingMyColor) {
      if (!window.confirm(`현재 사용 중인 컬러가 있습니다. 이 컬러로 변경하시겠습니까?`)) return;
      await deleteDoc(doc(db, 'calendar_colors', existingMyColor));
    }

    await setDoc(doc(db, 'calendar_colors', colorClass), { name: myName, email: myEmail });
  };

  const openAddModal = (day) => {
    const myEmail = currentUser?.email;
    const myClaimedColor = Object.keys(colorMap).find(key => colorMap[key]?.email === myEmail);
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${formattedMonth}-${formattedDay}`);
    setNewEvent({ title: '', color: myClaimedColor || 'bg-blue-500' });
    setIsModalOpen(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    await addDoc(collection(db, 'shared_schedules'), {
      date: selectedDate,
      title: newEvent.title,
      color: newEvent.color,
      author: currentUser?.displayName || currentUser?.email?.split('@')[0] || '직원',
      authorEmail: currentUser?.email,
      createdAt: serverTimestamp()
    });
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (e, event) => {
    e.stopPropagation();
    const isMaster = currentUser?.email === 'nova78jyg@gmail.com';
    const isMine = currentUser?.email === event.authorEmail;
    if (!isMaster && !isMine) return alert("본인이 등록한 일정만 삭제할 수 있습니다.");
    if (window.confirm(`'${event.title}' 일정을 삭제하시겠습니까?`)) {
      await deleteDoc(doc(db, 'shared_schedules', event.id));
    }
  };

  const sortedLectures = [...(portalState.lectures || [])]
    .filter(l => {
      if (quickFilterDate && l.date !== quickFilterDate) return false;
      if (quickSearch) {
        const q = quickSearch.toLowerCase();
        const hay = `${l.title} ${l.instructor} ${l.location} ${l.category} ${l.date}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.startTime || '').localeCompare(b.startTime || ''));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 animate-fade-in-up h-full min-h-[720px] flex flex-col gap-5">
      
      {/* 상단 통합 컨트롤 헤더 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-black text-xs tracking-wider uppercase">Real-Time Cloud Sync Active</span>
          </div>
          <h3 className="text-white font-black text-xl md:text-2xl flex items-center gap-2">
            교육 일정표 포털 & 8대 데이터 허브 통합 관리
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            기존 17개 일정 포함 전체 일정을 자유롭게 삭제·수정·추가(하루 최대 3개 노출)하며, 본사 홈페이지 일정표와 실시간 동기화됩니다.
          </p>
        </div>

        {/* 3대 모드 전환 버튼 + 새 창 열기 */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => setActiveMode('portal_console')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all border ${
              activeMode === 'portal_console'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            일정표 포털 & 8대 허브 전체 콘솔
          </button>
          <button
            onClick={() => setActiveMode('portal_table')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all border ${
              activeMode === 'portal_table'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            전체 강의 빠른 편집/삭제 ({portalState.lectures?.length || 0}건)
          </button>
          <button
            onClick={() => setActiveMode('team_calendar')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all border ${
              activeMode === 'team_calendar'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            사내 팀원 컬러 일정표
          </button>
          <a
            href="https://thecreator-mcn.com/schedule/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all"
          >
            공식 일정표 새창 열기 ↗
          </a>
        </div>
      </div>

      {/* 상단 8대 관리자 기능 원클릭 바로가기 바 */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setQuickForm({
                id: '',
                targetOrg: '',
                category: '바이브코딩부트캠프',
                status: '모집/접수중',
                date: '2026-10-15',
                startTime: '14:00',
                endTime: '17:00',
                instructor: '정시후 테크 디렉터',
                location: '더크리에이터즈AI 대강의장',
                isMajorFeatured: false
              });
              setIsQuickAddOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
          >
            + CRM 빠른 강의 등록
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_SWITCH_MODE', 'calendar')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            월간 달력 뷰
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_SWITCH_MODE', 'kanban')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            4단계 강의 칸반보드
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_OPEN_HUB', 'major')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            배너 강의 지정
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_OPEN_HUB', 'ticker')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            상단 롤링 티커 교체
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_OPEN_HUB', 'stats')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            슬로건 & 실적 수정
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_OPEN_HUB', 'instructors')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            강사진 프로필 관리
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_OPEN_HUB', 'company')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            하단 회사정보 수정
          </button>
          <button onClick={() => sendPortalCommand('CRM_CMD_OPEN_HUB', 'reviews')} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700">
            수강 후기 관리
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-semibold">
          현재 등록 강의: <strong className="text-blue-400">{portalState.lectures?.length || 0}건</strong> · 대표 강사진: <strong className="text-emerald-400">{portalState.instructors?.length || 0}명</strong>
        </div>
      </div>

      {/* MODE 1: 일정표 포털 & 8대 데이터 허브 전체 관리자 콘솔 (임베드) */}
      {activeMode === 'portal_console' && (
        <div className="flex-1 w-full bg-white rounded-2xl overflow-hidden border border-slate-700 shadow-2xl min-h-[780px] flex flex-col">
          <iframe
            ref={iframeRef}
            src="/schedule-portal/index.html?crm_admin=1"
            title="THE CREATORS AI ACADEMY Schedule Portal Admin Console"
            className="w-full flex-1 min-h-[780px] border-0"
            onLoad={() => {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'CRM_ADMIN_AUTH_HANDSHAKE',
                token: 'tc_portal_admin_v6_8077_secure'
              }, '*');
            }}
          />
        </div>
      )}

      {/* MODE 2: CRM 직결 전체 강의 빠른 편집 / 삭제 / 추가 테이블 (기존 17개 하드코딩 일정 포함 자유 제어) */}
      {activeMode === 'portal_table' && (
        <div className="flex-1 flex flex-col gap-4 bg-slate-950/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="강의명, 기관명, 강사명 검색..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-blue-500 min-w-[220px]"
              />
              <input
                type="date"
                value={quickFilterDate}
                onChange={(e) => setQuickFilterDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
              />
              {quickFilterDate && (
                <button
                  onClick={() => setQuickFilterDate('')}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  날짜 필터 해제
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setQuickForm({
                  id: '',
                  targetOrg: '',
                  category: '바이브코딩부트캠프',
                  status: '모집/접수중',
                  date: quickFilterDate || '2026-10-15',
                  startTime: '14:00',
                  endTime: '17:00',
                  instructor: '정시후 테크 디렉터',
                  location: '더크리에이터즈AI 대강의장',
                  isMajorFeatured: false
                });
                setIsQuickAddOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
            >
              + 새 강의 일정 추가 (하루 최대 3개 노출 지원)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/80">
                  <th className="py-3 px-3">날짜 / 시간</th>
                  <th className="py-3 px-3">강의명 ([대상기관] 과정명)</th>
                  <th className="py-3 px-3">담당 강사 / 장소</th>
                  <th className="py-3 px-3">진행 단계 (칸반 연동)</th>
                  <th className="py-3 px-3">상단 배너 노출</th>
                  <th className="py-3 px-3 text-right">관리 (수정/삭제)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {sortedLectures.map((lec) => (
                  <tr key={lec.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-black text-blue-400">{lec.date}</div>
                      <div className="text-slate-400 text-[11px]">{lec.startTime} ~ {lec.endTime}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-sm">{lec.title}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                        {lec.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200 font-semibold">{lec.instructor}</div>
                      <div className="text-slate-500 text-[11px]">{lec.location}</div>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={lec.status || '모집/접수중'}
                        onChange={(e) => handleQuickStatusChange(lec.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white outline-none focus:border-blue-500"
                      >
                        {STATUS_OPTIONS.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleQuickToggleBanner(lec.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                          lec.isMajorFeatured
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {lec.isMajorFeatured ? '배너 노출 중' : '+ 배너 추가'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openQuickEdit(lec)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleQuickDeleteLecture(lec.id, lec.title)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedLectures.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      조회된 강의 일정이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODE 3: 기존 사내 팀원 컬러 일정표 */}
      {activeMode === 'team_calendar' && (
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h4 className="text-white font-black text-lg">사내 구성원 컬러 공유 캘린더 (교육 일정 자동 병합)</h4>
            <div className="flex items-center gap-4 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
              <button onClick={prevMonth} className="text-slate-400 hover:text-white px-3 font-bold">&lt;</button>
              <span className="text-white font-black text-base min-w-[110px] text-center">{year}년 {month + 1}월</span>
              <button onClick={nextMonth} className="text-slate-400 hover:text-white px-3 font-bold">&gt;</button>
            </div>
          </div>

          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50 mb-4 flex flex-wrap gap-2.5 items-center">
            <span className="text-slate-300 font-bold text-xs tracking-wider mr-2">구성원 컬러 매핑</span>
            {PALETTE.map(color => {
              const isTaken = !!colorMap[color];
              const ownerName = isTaken ? colorMap[color].name : '미지정 (클릭)';
              const isMine = colorMap[color]?.email === currentUser?.email;
              return (
                <button
                  key={color}
                  onClick={() => handleClaimColor(color)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                    isMine ? 'border-emerald-400 bg-emerald-400/10' : 
                    isTaken ? 'border-transparent bg-slate-700/50 opacity-60 hover:opacity-100' : 
                    'border-dashed border-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full shadow-sm ${color}`}></div>
                  <span className={`text-[11px] font-bold ${isMine ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {ownerName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
              <div key={day} className={`text-center text-xs font-black py-2 ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
            {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-900/30 rounded-xl border border-slate-800/50 min-h-[100px]"></div>)}
            {days.map(day => {
              const formattedMonth = String(month + 1).padStart(2, '0');
              const formattedDay = String(day).padStart(2, '0');
              const dateString = `${year}-${formattedMonth}-${formattedDay}`;
              const dayEvents = events.filter(e => e.date === dateString);
              const dayLectures = (portalState.lectures || [])
                .filter(l => l.date === dateString)
                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
              const isToday = new Date().toISOString().split('T')[0] === dateString;

              return (
                <div 
                  key={day} 
                  onClick={() => openAddModal(day)}
                  className={`bg-slate-800/40 hover:bg-slate-700/50 rounded-xl border cursor-pointer p-2 flex flex-col transition-colors group min-h-[110px] ${isToday ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700/50 hover:border-slate-500'}`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-xs font-bold ${isToday ? 'bg-blue-500 text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-slate-300'}`}>{day}</span>
                    {dayLectures.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">교육 {dayLectures.length}건</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                    {dayLectures.slice(0, 3).map(lec => (
                      <div key={lec.id} onClick={(e) => { e.stopPropagation(); openQuickEdit(lec); }} className="bg-blue-600/30 border border-blue-400/30 px-1.5 py-1 rounded text-[10px] text-blue-100 flex justify-between items-center">
                        <span className="truncate flex-1 font-bold">{lec.startTime} {lec.title}</span>
                      </div>
                    ))}
                    {dayEvents.map(event => (
                      <div key={event.id} className={`${event.color} bg-opacity-20 border border-white/10 px-1.5 py-1 rounded text-[10px] text-white flex justify-between items-center group/item`}>
                        <span className="truncate flex-1 font-medium">{event.title}</span>
                        <button onClick={(e) => handleDeleteEvent(e, event)} className="opacity-0 group-hover/item:opacity-100 text-white/50 hover:text-rose-400 ml-1 font-bold">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CRM 빠른 강의 등록/수정 모달 */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[120] flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in-up">
            <h2 className="text-lg font-black text-white mb-1">
              {quickForm.id ? '교육 일정 수정 (실시간 포털 연동)' : '새 교육 일정 빠른 등록 (하루 최대 3개 노출)'}
            </h2>
            <p className="text-slate-400 text-xs mb-4">저장 즉시 공식 교육 일정표 포털 및 4단계 칸반보드에 실시간 반영됩니다.</p>

            <form onSubmit={handleQuickSaveLecture} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">교육 대상 기관 / 기업 / 대학명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 부산 북구청 AX연수, 해운대구청, 신라대학교"
                  value={quickForm.targetOrg}
                  onChange={(e) => setQuickForm({ ...quickForm, targetOrg: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">교육 과정 카테고리 *</label>
                  <select
                    value={quickForm.category}
                    onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">진행 상태 (칸반 단계) *</label>
                  <select
                    value={quickForm.status}
                    onChange={(e) => setQuickForm({ ...quickForm, status: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">강의 날짜 *</label>
                  <input
                    type="date"
                    required
                    value={quickForm.date}
                    onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">시작 시간 *</label>
                  <input
                    type="time"
                    required
                    value={quickForm.startTime}
                    onChange={(e) => setQuickForm({ ...quickForm, startTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">종료 시간 *</label>
                  <input
                    type="time"
                    required
                    value={quickForm.endTime}
                    onChange={(e) => setQuickForm({ ...quickForm, endTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">담당 강사 *</label>
                  <input
                    type="text"
                    required
                    value={quickForm.instructor}
                    onChange={(e) => setQuickForm({ ...quickForm, instructor: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">교육 장소 *</label>
                  <input
                    type="text"
                    required
                    value={quickForm.location}
                    onChange={(e) => setQuickForm({ ...quickForm, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={quickForm.isMajorFeatured}
                  onChange={(e) => setQuickForm({ ...quickForm, isMajorFeatured: e.target.checked })}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>상단 히어로 주요강의 스포트라이트 배너에 함께 노출</span>
              </label>

              <div className="flex gap-2 pt-4">
                {quickForm.id && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuickAddOpen(false);
                      handleQuickDeleteLecture(quickForm.id, `[${quickForm.targetOrg}] ${quickForm.category}`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 font-bold"
                  >
                    삭제
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl font-bold hover:bg-slate-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-500"
                >
                  저장 및 실시간 반영
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 사내 일정 추가 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-black text-white mb-1">사내 일정 등록</h2>
            <p className="text-slate-400 text-xs mb-4">{selectedDate}</p>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input
                type="text"
                placeholder="일정 내용을 입력하세요"
                required
                autoFocus
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm"
              />
              <div>
                <p className="text-slate-400 text-xs font-bold mb-2">카테고리 색상</p>
                <div className="flex gap-2 flex-wrap">
                  {PALETTE.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewEvent({ ...newEvent, color })}
                      className={`w-6 h-6 rounded-full ${color} ${newEvent.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-30 hover:opacity-100'} transition-all`}
                    ></button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 text-sm">취소</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 text-sm">등록하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}