'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// 💡 [STEP 1] 글로벌 폰트(Pretendard) 및 하이엔드/시네마틱 모션 스타일 주입
const globalStyles = `
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");
  
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  }
  
  /* 고급 가감속 (깃털처럼 부드럽게 감속) */
  .ease-lux {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* 부유하는 애니메이션 */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }

  /* 🎬 시네마틱 배경 줌인 (Ken Burns Effect) */
  @keyframes ken-burns {
    0% { transform: scale(1); }
    100% { transform: scale(1.15); }
  }
  .animate-ken-burns {
    animation: ken-burns 25s ease-out forwards alternate infinite;
  }

  /* 🚀 히어로 섹션 전용 확정 로드 모션 */
  @keyframes heroFadeLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes heroFadeRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes heroFadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  
  .hero-left { opacity: 0; animation: heroFadeLeft 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .hero-right { opacity: 0; animation: heroFadeRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .hero-up { opacity: 0; animation: heroFadeUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

// 💡 [STEP 2] 스크롤 감지 애니메이션 모듈 (방향성 지원)
function FadeInSection({ children, delay = 0, direction = 'up', duration = 1000 }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0 scale-100 opacity-100';
    switch (direction) {
      case 'left': return '-translate-x-16 opacity-0';
      case 'right': return 'translate-x-16 opacity-0';
      case 'zoom': return 'scale-95 opacity-0';
      case 'up': default: return 'translate-y-12 opacity-0';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all ease-lux ${getTransform()}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// 💡 [STEP 3] 하이브리드 카드 모듈
function TiltCard({ children, className = "" }) {
  const [style, setStyle] = useState({});
  
  const handleMouseMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    const rotateX = (0.5 - y) * 15; 
    const rotateY = (x - 0.5) * 15;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  const handleTouchStart = () => {
    setStyle({
      transform: 'perspective(1000px) scale3d(0.94, 0.94, 0.94)', 
      boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
      transition: 'all 0.15s ease-out'
    });
  };

  const handleTouchEnd = () => {
    setStyle({
      transform: 'perspective(1000px) scale3d(1, 1, 1)',
      boxShadow: 'none',
      transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)' 
    });
  };

  return (
    <div 
      className={`transform-gpu cursor-pointer ${className}`} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={style}
    >
      {children}
    </div>
  );
}

// 💡 매니페스토 (안티-학원 프레임 고도화) 모듈
function AntiAcademySection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#05080f] text-center border-b border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
      <FadeInSection>
        <div className="max-w-4xl mx-auto">
          <span className="text-rose-500 font-black tracking-widest text-xs md:text-sm uppercase mb-4 block">Manifesto</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 break-keep leading-tight tracking-tight">
            수많은 강의가 '지식'을 파는 동안,<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">당신의 비즈니스에 '실물 시스템'을 이식합니다.</span>
          </h2>
          <div className="bg-slate-900/80 border border-rose-500/20 p-8 md:p-12 rounded-[2rem] shadow-2xl relative transform transition-all hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rose-500 to-orange-500 rounded-l-[2rem]"></div>
            <p className="text-slate-300 text-base md:text-lg lg:text-xl font-medium leading-relaxed break-keep text-left md:text-center">
              누구나 돈만 내면 들을 수 있는 <strong className="text-white">공장형 템플릿 강의를 찾으신다면, 정중히 거절하겠습니다.</strong><br/><br/>
              The Creators AI는 단순한 교육자가 아닙니다. AI의 압도적인 효율성을 무기로, 대표님과 함께 잠들지 않는 무인 오피스를 직접 지어 올리는 <strong>'비즈니스 빌더(System Builder)'</strong>입니다.
            </p>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}

// 💡 듀얼 리뷰 섹션 모듈 (진정성 카피 & 유튜브 모바일 UI 최적화 반영)
function ReviewSection() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#090E17] border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <FadeInSection direction="up">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-[#3B82F6] font-black tracking-widest text-xs uppercase mb-2 block">Sincere Reviews & Portfolio</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight break-keep">
              실제 참여자들의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#3B82F6]">진솔한 교육 후기</span>
            </h2>
            <p className="text-slate-400 mt-4 text-sm md:text-base break-keep max-w-2xl mx-auto">
              화려한 수식어로 포장하지 않겠습니다. 4주간의 여정을 마친 수강생분들의 생생한 목소리와,<br className="hidden sm:block"/>
              현업에 직접 구축하신 비즈니스 파이프라인 사례를 투명하게 공개합니다.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={100} direction="up">
          <div className="flex justify-center mb-10">
            <div className="bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 inline-flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-6 md:px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'video' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                수강생 인터뷰 및 사례
              </button>
              <button
                onClick={() => setActiveTab('kakao')}
                className={`px-6 md:px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'kakao' ? 'bg-[#FEE500] text-[#191919] shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-[#FEE500]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                100% 리얼 카톡 후기
              </button>
            </div>
          </div>

          {activeTab === 'video' && (
            <div className="flex flex-col gap-8 items-center animate-fade-in-up">
              {/* 🚀 숏폼 2개 모바일 UI 최적화 */}
              <div className="flex w-full md:w-3/4 lg:w-1/2 gap-3 md:gap-4 justify-center px-2">
                <div className="flex-1 max-w-[240px]">
                  <div className="aspect-[9/16] w-full relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded-md z-10 pointer-events-none shadow-md">Shorts</div>
                    <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/UoDxeQg9pTc" title="수강생 리얼 숏폼 후기" frameBorder="0" allowFullScreen></iframe>
                  </div>
                </div>
                <div className="flex-1 max-w-[240px]">
                  <div className="aspect-[9/16] w-full relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                    <div className="absolute top-2 left-2 bg-cyan-600 text-white text-[10px] font-black px-2 py-1 rounded-md z-10 pointer-events-none shadow-md">특강 안내</div>
                    <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/NPBGbXxhvUU" title="매월 정기 무료특강 안내" frameBorder="0" allowFullScreen></iframe>
                  </div>
                </div>
              </div>
              {/* 가로 롱폼 1개 */}
              <div className="w-full max-w-3xl relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-black mx-2">
                <div className="aspect-video w-full relative">
                  <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/Yp2VP2oFKrk?controls=1&modestbranding=1" title="The Creators AI Long Review" frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="p-5 bg-slate-900 border-t border-slate-800 text-center">
                  <h3 className="text-white font-bold text-sm md:text-base break-keep">"개발자 없이 2주 만에 자동화 시스템을 구축했습니다."</h3>
                  <p className="text-slate-500 text-xs mt-1">The Creators AI 수강생 인터뷰 원본</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kakao' && (
            <div className="max-w-2xl mx-auto animate-fade-in-up px-2">
              <div className="bg-[#abc1d1] rounded-[2rem] p-4 md:p-6 shadow-2xl relative overflow-hidden border-4 border-slate-800 mb-8">
                <div className="flex items-center gap-3 mb-6 bg-[#abc1d1] z-10 sticky top-0">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center font-black text-slate-700">김</div>
                  <span className="font-bold text-[#191919] text-lg">김유진 수강생님</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/50 shrink-0"></div>
                    <div className="bg-white p-3 md:p-4 rounded-2xl rounded-tl-sm text-[#191919] text-sm md:text-base max-w-[85%] shadow-sm leading-relaxed break-keep">
                      안녕하세요 정시후 선생님!! 😀<br/>
                      오늘 청년 1인 크리에이터 심화반 수업에 참석한 김유진이라고 합니다 ㅎㅎ<br/><br/>
                      오늘 수업 너무 재밌고 인상깊게 잘 들었습니다 ㅎㅎ 나 자신을 깊게 알아가고 객관화할수 있는 하나의 방식이 영상이 될 수 있다는 말씀이 많이 와닿았던거같아요 .. 🥺<br/><br/>
                      그래서 그런데 오늘 수업자료들 좀 받을 수 있을까요? 놓친 부분이 있으면 참고할 수 있을 것 같아 부탁드립니다 ㅎㅎ 😀
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 mt-6">
                    <div className="bg-white p-3 rounded-2xl rounded-tr-sm border border-slate-200 max-w-[80%] shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-500 font-bold">P</div>
                      <div className="text-left">
                        <p className="text-[#191919] text-sm font-bold truncate">미디어산업이해 중급반 정시후강사.pptx</p>
                        <p className="text-slate-500 text-xs mt-0.5">용량 4.07 MB</p>
                      </div>
                    </div>
                    <div className="bg-[#FEE500] p-3 rounded-2xl rounded-tr-sm text-[#191919] text-sm shadow-sm inline-block">
                      재밋게들어주셔서 감사합니다 ^^
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <a href="http://thecreator-mcn.com/bbs/board.php?bo_table=review" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-slate-700 transition-all hover:-translate-y-1 ease-lux">
                  <span className="text-2xl">📝</span>
                  본사 홈페이지에서 리얼 후기 더 보기
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
                <p className="text-slate-500 text-xs md:text-sm mt-4 font-medium">
                  * 8년간 누적된 The Creators AI의 실제 수강생 리뷰를 투명하게 공개합니다.
                </p>
              </div>
            </div>
          )}
        </FadeInSection>
      </div>
    </section>
  );
}

// 💡 백엔드 데이터 쇼케이스 모듈
function BackendShowcaseSection() {
  const [logs, setLogs] = useState([]);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const rawLogs = [
      { time: '00:00:01', msg: 'System initialized. Waiting for traffic...', type: 'info' },
      { time: '00:00:04', msg: 'POST /api/funnel - Status: 200 OK', type: 'success' },
      { time: '00:00:05', msg: 'Firebase Cloud Firestore: Document written [ID: 8xDf...]', type: 'warn' },
      { time: '00:00:08', msg: 'Triggering Webhook -> CRM Kanban Board', type: 'info' },
      { time: '00:00:10', msg: 'Auto-reply Email sent to new lead.', type: 'success' },
    ];

    const rawLeads = [
      { id: 1, name: '김*진 대표', phone: '010-****-1234', status: 'DB 수집 완료' },
      { id: 2, name: '이*훈 마케터', phone: '010-****-5678', status: '자동화 메일 발송' },
      { id: 3, name: '박*성 크리에이터', phone: '010-****-9012', status: '상담 대기' },
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < rawLogs.length) {
        const currentLog = rawLogs[logIndex];
        if (currentLog) setLogs(prev => [...prev, currentLog]);
        logIndex++;
      } else {
        logIndex = 0;
        setLogs([]);
      }
    }, 2000);

    let leadIndex = 0;
    const leadInterval = setInterval(() => {
      if (leadIndex < rawLeads.length) {
        const currentLead = rawLeads[leadIndex];
        if (currentLead) setLeads(prev => [currentLead, ...prev].slice(0, 3));
        leadIndex++;
      } else {
        leadIndex = 0;
        setLeads([]);
      }
    }, 3000);

    return () => { clearInterval(logInterval); clearInterval(leadInterval); };
  }, []);

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-[#05080f] overflow-hidden border-y border-slate-800 relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeInSection>
          <div className="text-center mb-12 md:mb-16">
            <span className="animate-pulse inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span className="text-rose-400 font-black tracking-widest text-xs md:text-sm uppercase mb-3 inline-block">Live System Demonstration</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white break-keep leading-tight mb-4">
              화려한 말 대신, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">날것의 시스템</span>을 보여드립니다.
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto break-keep font-medium">
              이것이 4주 후 당신이 소유하게 될 <strong>The Creators AI의 비즈니스 오토메이션 백엔드(Back-end)</strong> 실체입니다. 고객이 잠든 사이에도 데이터는 수집되고, 시스템은 일합니다.
            </p>
          </div>
        </FadeInSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <FadeInSection delay={100} direction="left">
            <div className="bg-[#0D1117] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl h-[360px] md:h-[400px] flex flex-col">
              <div className="bg-[#161B22] px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-slate-400 text-xs font-mono font-bold tracking-widest">FIREBASE CLOUD FIRESTORE</div>
              </div>
              <div className="p-5 font-mono text-xs sm:text-sm flex-1 bg-[#0D1117] text-slate-300 overflow-y-auto custom-scrollbar">
                <div className="text-blue-400 mb-4">$ The Creators AI - Database listening on port 3000...</div>
                {logs.map((log, idx) => {
                  if (!log) return null;
                  return (
                    <div key={idx} className="mb-2 flex items-start gap-3 animate-fade-in-up">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className={`${log.type === 'success' ? 'text-emerald-400' : ''} ${log.type === 'warn' ? 'text-amber-400' : ''} ${log.type === 'info' ? 'text-cyan-400' : ''}`}>
                        {log.msg}
                      </span>
                    </div>
                  );
                })}
                <div className="animate-pulse w-2 h-4 bg-slate-400 mt-2"></div>
              </div>
            </div>
          </FadeInSection>
          <FadeInSection delay={300} direction="right">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl h-[360px] md:h-[400px] flex flex-col relative">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between shrink-0 z-20">
                <div className="text-slate-200 text-sm font-bold flex items-center gap-2">
                  <span className="text-xl">📊</span> Admin CRM Dashboard
                </div>
                <div className="text-emerald-400 text-xs font-black bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> Live Sync
                </div>
              </div>
              <div className="p-5 flex-1 bg-slate-900 relative overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {leads.map((lead, idx) => {
                    if (!lead) return null;
                    return (
                      <div key={lead.id} className={`bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-lg transform transition-all duration-500 animate-fade-in-up ${idx === 0 ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105 z-10' : 'opacity-70'}`}>
                        <div className="text-[10px] font-black text-cyan-400 mb-1 tracking-wider uppercase">{lead.status}</div>
                        <div className="text-white font-bold text-sm mb-1 truncate">{lead.name}</div>
                        <div className="text-slate-400 text-[10px] sm:text-xs font-mono truncate">{lead.phone}</div>
                        {idx === 0 && <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-full animate-pulse"></div></div>}
                      </div>
                    );
                  })}
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-center p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl z-10">
                  <p className="text-blue-400 text-[11px] sm:text-xs font-bold tracking-wide break-keep">
                    ※ 마케팅 퍼널에서 수집된 DB가 딜레이 없이 100% 자동 라우팅 됩니다.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// 💡 메타버스 AI 오피스 시뮬레이터
function VirtualAgencySection() {
  const [ceoName, setCeoName] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [agents, setAgents] = useState([]);
  const [userPos, setUserPos] = useState({ x: 50, y: 50 }); 
  const [stats, setStats] = useState({ costSaved: 0, tasksDone: 0 });

  const initialAgents = [
    { id: 1, role: '기획 에이전트', icon: '🧠', color: 'bg-indigo-600', x: 20, y: 30, messages: ['페르소나 분석 완료', '경쟁사 랜딩페이지 크롤링 중'] },
    { id: 2, role: '마케팅 에이전트', icon: '🎯', color: 'bg-rose-600', x: 75, y: 25, messages: ['퍼널 전환율 12% 상승!', '리타겟팅 캠페인 가동'] },
    { id: 3, role: '디자인 에이전트', icon: '🎨', color: 'bg-amber-600', x: 80, y: 70, messages: ['광고 소재 베리에이션 생성', '상세페이지 UI 수정 완료'] },
    { id: 4, role: '개발 에이전트', icon: '💻', color: 'bg-cyan-600', x: 25, y: 75, messages: ['CRM 칸반보드 신규 DB 연동', 'API 에러 자동 디버깅'] },
  ];

  useEffect(() => {
    if (!isLogged) return;
    setAgents(initialAgents.map(a => ({...a, currentMsg: a.messages[0]})));
    
    const logicInterval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const changeMsg = Math.random() > 0.6;
        return {
          ...agent,
          x: Math.max(10, Math.min(90, agent.x + (Math.random() * 10 - 5))),
          y: Math.max(10, Math.min(90, agent.y + (Math.random() * 10 - 5))),
          currentMsg: changeMsg ? agent.messages[Math.floor(Math.random() * agent.messages.length)] : agent.currentMsg
        };
      }));
    }, 2500);

    const statInterval = setInterval(() => {
      setStats(prev => ({
        costSaved: prev.costSaved + Math.floor(Math.random() * 15000),
        tasksDone: prev.tasksDone + Math.floor(Math.random() * 3)
      }));
    }, 800);

    return () => { clearInterval(logicInterval); clearInterval(statInterval); };
  }, [isLogged]);

  const handleMapClick = (e) => {
    if (!isLogged) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    setUserPos({ x: clickX, y: clickY });
  };

  return (
    <section className="py-20 px-4 md:px-6 bg-[#0B1120] overflow-hidden border-b border-slate-800 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <FadeInSection direction="up">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-purple-400 font-black tracking-widest text-xs uppercase mb-2 block">Interactive AI Office</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight break-keep">
              지금, 나만의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">무인 자동화 오피스</span>에 접속하십시오
            </h2>
            <p className="mt-4 text-slate-400 text-sm md:text-base break-keep max-w-2xl mx-auto">
              직원의 퇴사나 외주 비용에 얽매이지 마십시오. 잠들지 않는 AI 에이전트들이 실시간으로 데이터를 주고받으며 당신의 비즈니스를 어떻게 자동화하는지 직접 체험해 보세요.
            </p>
          </div>
        </FadeInSection>

        <div className="bg-slate-900 border-4 border-slate-700 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] relative h-[450px] md:h-[550px] font-mono">
          {!isLogged ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1120] z-20 px-4">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border-[3px] border-slate-700 animate-bounce">🏢</div>
              <h3 className="text-white font-black text-xl mb-6 text-center break-keep">AI 직원들을 지휘할 최고 경영자의 이름을 입력하십시오.</h3>
              <div className="flex w-full max-w-sm gap-2">
                <input type="text" maxLength="8" placeholder="예: 김대표" value={ceoName} onChange={(e) => setCeoName(e.target.value)} className="flex-1 bg-slate-800 border-2 border-slate-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 font-bold" />
                <button onClick={() => ceoName.trim() ? setIsLogged(true) : alert("이름을 입력해주세요!")} className="bg-purple-600 hover:bg-purple-500 text-white font-black px-6 py-3 rounded-xl transition-colors border-b-4 border-purple-800 active:border-b-0 active:translate-y-1">
                  시스템 접속
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[#0f172a] cursor-crosshair overflow-hidden" onClick={handleMapClick}>
              <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-md border border-slate-600 p-4 rounded-2xl pointer-events-none w-48 shadow-xl">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-600 pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-300 text-xs font-black tracking-widest uppercase">Live System</span>
                </div>
                <div className="mb-2">
                  <div className="text-slate-500 text-[10px] font-bold">누적 인건비 절감액</div>
                  <div className="text-emerald-400 font-black text-lg font-mono">₩{stats.costSaved.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px] font-bold">자동화 처리된 업무</div>
                  <div className="text-blue-400 font-black text-lg font-mono">{stats.tasksDone.toLocaleString()} 건</div>
                </div>
              </div>
              <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-white/70 text-[10px] sm:text-xs font-bold pointer-events-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                마우스(터치)로 공간을 클릭하여 이동하세요
              </div>
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(600px) rotateX(60deg) scale(2.5)', transformOrigin: 'top center', opacity: 0.3 }}></div>
              <div className="absolute z-20 flex flex-col items-center transition-all duration-700 ease-lux transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ top: `${userPos.y}%`, left: `${userPos.x}%` }}>
                <div className="bg-yellow-400 text-[#191919] text-[10px] md:text-xs font-black px-2 py-0.5 rounded shadow-lg mb-1 whitespace-nowrap border border-yellow-500">CEO {ceoName}</div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg border-[3px] border-slate-800 shadow-2xl flex items-center justify-center text-xl md:text-2xl z-20">😎</div>
                <div className="w-6 h-2 bg-black/40 rounded-[100%] mt-1 blur-[1px]"></div>
              </div>
              {agents.map(agent => (
                <div key={agent.id} className="absolute z-10 flex flex-col items-center transition-all duration-1000 ease-lux transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ top: `${agent.y}%`, left: `${agent.x}%` }}>
                  <div className="mb-2 bg-white text-slate-800 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-2xl rounded-br-sm shadow-xl whitespace-nowrap border border-slate-200">
                    {agent.currentMsg}
                    <div className="absolute -bottom-1 right-2 w-2 h-2 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                  </div>
                  <div className="bg-slate-800/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-600 mb-1">{agent.role}</div>
                  <div className={`w-8 h-8 md:w-10 md:h-10 ${agent.color} rounded-lg flex items-center justify-center text-base md:text-xl border-2 border-slate-800 shadow-xl animate-float`}>{agent.icon}</div>
                  <div className="w-5 h-1.5 bg-black/30 rounded-[100%] mt-1 blur-[1px]"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <FadeInSection delay={200} direction="up">
          <div className="mt-6 md:mt-8 bg-blue-900/10 border border-blue-500/20 p-5 md:p-6 rounded-2xl max-w-4xl mx-auto text-left md:text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <p className="text-slate-300 font-bold text-xs md:text-base break-keep leading-relaxed pl-2 md:pl-0">
              <span className="text-blue-400 text-lg mr-2 hidden md:inline-block">ℹ️</span>
              위 화면은 <strong className="text-white">AI 직원들이 일하는 메타버스 환경 예시</strong>입니다.<br className="hidden md:block"/>
              실제 교육 수료 후에는 AI 직원들에게 실무를 위임하고 이러한 대시보드를 구축하여, <strong className="text-cyan-400">대표님이 직접 AI 직원들과 함께 무인 기업을 운영하는 단계까지 시스템을 진화</strong>시키게 됩니다.
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// 💡 롤링 명언 섹션 모듈
function ParadigmShiftSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const quotes = [
    { highlight: "곱셈", text1: "비즈니스는 ", text2: "입니다. 당신의 아이디어가 아무리 뛰어나도,", text3: "결국 '실행'이 0이라면 결과는 영원히 0입니다." },
    { highlight: "도태", text1: "결정하지 않는 것도 하나의 결정입니다.", text2: " 그리고 그 대가는 ", text3: "라는 가장 잔인한 청구서로 돌아옵니다." },
    { highlight: "행동", text1: "생각만으로 바뀐 세상은 단 한 평도 없습니다.", text2: " 변화를 증명하는 유일한 언어는 오직 ", text3: "뿐입니다." },
    { highlight: "독식", text1: "기술은 당신을 기다려주지 않습니다.", text2: " 오늘 핑계를 찾는 사이, 누군가는 시스템을 만들고 시장을 ", text3: "합니다." },
    { highlight: "예외는 없습니다", text1: "모든 행동의 끝에는 결과라는 답이 기다리고 있습니다.", text2: " 아무것도 하지 않은 자에게 주어지는 기적은 없습니다. ", text3: "." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length);
        setFade(true); 
      }, 500); 
    }, 4500); 
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 bg-[#05080f] text-center relative overflow-hidden border-t border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-40 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative z-10 min-h-[200px] flex flex-col justify-center items-center">
        <div className="text-blue-500/30 text-5xl md:text-7xl font-serif leading-none mb-[-10px] md:mb-[-20px]">&quot;</div>
        <h2 className={`text-xl sm:text-2xl md:text-4xl font-black text-white break-keep leading-tight mb-8 relative z-10 transition-opacity duration-500 ease-lux ${fade ? 'opacity-100' : 'opacity-0'}`}>
          {quotes[currentIndex].text1}
          <span className="text-cyan-400">{quotes[currentIndex].highlight}</span>
          {quotes[currentIndex].text2}<br className="hidden md:block"/>
          <span className="text-slate-300">{quotes[currentIndex].text3}</span>
        </h2>
        <div className="w-12 h-1 bg-blue-500/50 mx-auto mb-6"></div>
        <p className="text-slate-500 font-bold tracking-widest uppercase text-xs md:text-sm">The Creators AI</p>
        <div className="flex gap-2 mt-8">
          {quotes.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-cyan-400 w-6' : 'bg-slate-700'}`}></div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 💡 1:1 무료 컨설팅 지원 모달 폼
const CONSULTING_TOPICS = [
  '🚀 자기계발 및 역량 강화',
  '🏢 회사 업무 자동화/고도화',
  '💰 프리랜서 수익화 파이프라인',
  '✨ 퍼스널 브랜딩 구축',
  '📈 세일즈/마케팅 효율화',
  '💡 내 아이디어 플랫폼 개발',
  '🤖 AI 에이전트 기반 인건비 절감'
];

function ConsultingApplyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', contact: '', email: '', topic: '', jobAndReason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.topic) return alert("중점적으로 컨설팅받고 싶은 분야를 하나 선택해주세요.");
    
    setIsSubmitting(true);

    try {
      const safeBusinessGoal = formData.jobAndReason 
        ? `관심분야: ${formData.topic} / 직무 및 고민: ${formData.jobAndReason}` 
        : `관심분야: ${formData.topic}`;

      await addDoc(collection(db, "bootcamp_leads"), {
        clientName: "무료컨설팅 신청",
        clientTitle: formData.name,
        clientContact: formData.contact,
        clientEmail: formData.email,
        businessGoal: safeBusinessGoal,
        status: "심사 대기",
        createdAt: serverTimestamp()
      });

      await fetch('/api/notify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          contact: formData.contact,
          email: formData.email,
          topic: formData.topic,
          jobAndReason: formData.jobAndReason
        })
      }).catch(err => console.error("알람 발송 우회 실패:", err));

      alert(`신청이 완료되었습니다!\n빠른 시일 내에 ${formData.contact} 번호로 일정 조율 연락을 드리겠습니다.`);
      onClose();
      setFormData({ name: '', contact: '', email: '', topic: '', jobAndReason: '' });

    } catch (error) {
      console.error("제출 에러:", error);
      alert(`시스템 오류가 발생했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex justify-center items-end md:items-center p-0 md:p-4 transition-opacity ease-lux">
      <div className="bg-[#090E17] border border-slate-700 rounded-t-[2rem] md:rounded-[2rem] w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 mb-1 md:hidden"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500 z-10"></div>
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white transition-colors p-2 z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="text-center mb-8">
            <span className="bg-blue-500/20 text-blue-400 text-xs font-black px-3 py-1 rounded-full border border-blue-500/30 tracking-widest uppercase mb-4 inline-block">VIP 1:1 Consulting</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 break-keep">2기 크루 맞춤형 비즈니스 진단</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed break-keep">결제 전 1시간 무료 컨설팅을 통해 현재 비즈니스의 병목을 진단하고<br className="hidden md:block"/> 최적의 자동화 로드맵을 설계해 드립니다.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="block text-slate-400 text-xs font-bold mb-2">이름 <span className="text-rose-500">*</span></label><input type="text" required placeholder="홍길동" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-blue-500" /></div>
              <div><label className="block text-slate-400 text-xs font-bold mb-2">연락처 <span className="text-rose-500">*</span></label><input type="tel" required placeholder="010-1234-5678" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 font-mono" /></div>
              <div><label className="block text-slate-400 text-xs font-bold mb-2">이메일 <span className="text-rose-500">*</span></label><input type="email" required placeholder="example@mail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white outline-none focus:border-blue-500 font-mono" /></div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-3">중점적으로 컨설팅 받고 싶은 내용 <span className="text-rose-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {CONSULTING_TOPICS.map(topic => (
                  <button key={topic} type="button" onClick={() => setFormData({...formData, topic})} className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border ease-lux ${formData.topic === topic ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}>{topic}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-2 flex justify-between"><span>현재 직무 및 이 교육이 필요한 이유</span><span className="text-slate-500 font-medium">(선택 사항)</span></label>
              <textarea placeholder="예: 마케팅 에이전시 대표입니다. 직원들의 단순 반복 업무를 AI 에이전트로 자동화하여 인건비를 절감하고 싶습니다." value={formData.jobAndReason} onChange={e => setFormData({...formData, jobAndReason: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 text-sm h-24 resize-none custom-scrollbar" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 mt-4 ease-lux">
              {isSubmitting ? '신청 처리 중...' : '1:1 무료 컨설팅 지원하기'}
            </button>
            <p className="text-center text-slate-500 text-[11px] mt-3">신청이 접수되면 확인 후 기재해주신 연락처로 스케줄 조율 차 연락드립니다.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

// 👑 [메인 함수] 랜딩페이지 뼈대
export default function BootcampSalesPage() {
  const [heroState, setHeroState] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const interval = setInterval(() => setHeroState((prev) => (prev + 1) % 3), 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    // 🚀 모바일에서 하단 고정바에 가리지 않도록 pb-24 패딩 부여
    <div className="bg-[#05080f] text-slate-900 antialiased selection:bg-[#3B82F6] selection:text-white relative font-sans break-keep overflow-x-hidden pb-24 md:pb-0">
      
      <style dangerouslySetInnerHTML={{__html: globalStyles}} />

      {/* 🚀 좌측 상단: 플로팅 네비게이션 */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50">
        <Link href="/" className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-black/50 transition-all duration-300 ease-lux">
          <span className="text-white/70 group-hover:text-white transition-transform group-hover:-translate-x-1 ease-lux">←</span>
          <span className="text-white/90 group-hover:text-white text-xs md:text-sm font-bold tracking-wide">이전 페이지로</span>
        </Link>
      </div>

      {/* 🚀 PC 전용 우측 상단: 듀얼 퀵 컨택트 버튼 (모바일에서 숨김) */}
      <div className="hidden md:flex fixed top-4 right-4 md:top-6 md:right-6 z-50 items-center gap-2 md:gap-3">
        <a href="tel:051-633-3812" className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-black/50 transition-all duration-300 ease-lux group text-white">
          <span className="text-sm md:text-base">📞</span>
          <span className="text-xs md:text-sm font-bold tracking-wide hidden sm:inline-block group-hover:text-cyan-300 transition-colors">051-633-3812</span>
        </a>
        <button 
          onClick={() => alert('카카오톡 ID: aegisnova\\n친구 추가 후 문의 남겨주시면 즉시 답변드리겠습니다.')} 
          className="flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 bg-[#FEE500]/90 backdrop-blur-md border border-[#FEE500]/20 rounded-full shadow-[0_0_15px_rgba(254,229,0,0.3)] hover:bg-[#FEE500] transition-all duration-300 ease-lux group text-[#191919]"
        >
          <span className="text-sm md:text-base">💬</span>
          <span className="text-xs md:text-sm font-black tracking-wide hidden sm:inline-block group-hover:scale-105 transition-transform">카톡 상담</span>
        </button>
      </div>

      {/* 🚀 모바일 전용 하단 고정 퀵 컨택트 바 (PC에서 숨김) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-[100] bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-2 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <a href="tel:051-633-3812" className="flex-1 flex flex-col items-center justify-center text-slate-300 hover:text-white transition-colors">
          <span className="text-xl mb-1">📞</span>
          <span className="text-[10px] font-bold">전화문의</span>
        </a>
        <div className="w-px h-8 bg-slate-700"></div>
        <button onClick={() => alert('카카오톡 ID: aegisnova\\n친구 추가 후 문의 남겨주시면 즉시 답변드리겠습니다.')} className="flex-1 flex flex-col items-center justify-center text-[#FEE500] hover:scale-105 transition-transform">
          <span className="text-xl mb-1">💬</span>
          <span className="text-[10px] font-bold">카톡상담</span>
        </button>
        <div className="w-px h-8 bg-slate-700"></div>
        <button onClick={() => setIsModalOpen(true)} className="flex-[2] mx-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl py-3 text-xs font-black shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95 transition-all">
          🚀 VIP 진단 신청
        </button>
      </div>

      {/* 🚀 1. 히어로 섹션 (투명 사령탑 + AI 로봇 배경 줌인 모션) */}
      <header className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-6 overflow-hidden">
        
        {/* 🎬 배경: 고화질 시네마틱 AI 코어 루프 비디오 + 프리미엄 딥 다크 글래스 오버레이 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105 opacity-60"
            src="/videos/Glowing_AI_core_in_landscape_202608310749.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05080f]/90 via-[#05080f]/65 to-[#05080f] backdrop-blur-[1px]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center w-full">
          {/* 확정 로드 모션 적용 (.hero-up 등) */}
          <div className="hero-up mb-6">
            <span className="inline-block py-1.5 px-5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white font-bold text-xs md:text-sm tracking-widest uppercase shadow-lg">
              The Creators AI Bootcamp 2nd
            </span>
          </div>
          
          <div className="flex flex-col items-center text-3xl sm:text-5xl md:text-7xl font-black mb-8 leading-[1.2] tracking-tight break-keep overflow-hidden w-full">
            <div className="hero-left">
              <span className="block mb-2 text-white drop-shadow-lg">코딩은 단 한 줄도 가르치지 않습니다.</span>
            </div>
            <div className="hero-right" style={{ animationDelay: '0.2s' }}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                오직 스스로 돌아갈 '시스템'만 짓겠습니다.
              </span>
            </div>
          </div>

          <div className="hero-up w-full" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-12 font-medium max-w-3xl mx-auto leading-relaxed break-keep drop-shadow-md">
              외주 개발사에 끌려다니던 시간, 이제 대표님이 'AI'를 통제하여 직접 배포하십시오.<br className="hidden md:block"/>
              기획서를 넘기고, 소통 오류에 지치며, 단순 수정에도 비용을 지불하던 악순환을 끊어내야 합니다. 개발 지식이 없어도 괜찮습니다.<br className="hidden lg:block"/>
              <strong>Agentic AI</strong>를 나만의 수석 개발자로 고용하여, 단 4주 만에 세일즈 퍼널과 맞춤형 백엔드를 직접 구축하는 실전 환경을 제공합니다.
            </p>
          </div>

          {/* 💻 투명 사령탑 (Glassmorphism 시뮬레이터 거대화) */}
          <div className="hero-up w-full" style={{ animationDelay: '0.6s' }}>
            <div className="w-full max-w-4xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-1 md:p-2 shadow-[0_0_50px_rgba(0,0,0,0.6)] border border-white/10 relative h-64 sm:h-80 md:h-[28rem] overflow-hidden">
              <div className={`absolute inset-0 p-6 sm:p-8 md:p-12 text-left font-mono transition-opacity duration-500 flex flex-col justify-center ${heroState === 0 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
                <div className="text-slate-400 mb-2 md:mb-3 font-bold text-base sm:text-xl md:text-2xl drop-shadow-md">⨯ System: Manual Coding Required</div>
                <div className="text-slate-300 mb-1 text-sm sm:text-base md:text-lg drop-shadow-md">&gt; Planning development resources...</div>
                <div className="text-slate-300 mb-1 text-sm sm:text-base md:text-lg drop-shadow-md">ℹ Estimated timeline: 3 weeks.</div>
                <div className="text-slate-500 mt-4 md:mt-6 text-sm sm:text-base animate-pulse">Waiting for execution...</div>
              </div>
              <div className={`absolute inset-0 p-6 sm:p-8 md:p-12 text-left font-mono transition-opacity duration-500 flex flex-col justify-center border-2 border-blue-500/50 rounded-xl ${heroState === 1 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
                <div className="text-blue-400 mb-3 md:mb-4 font-bold text-base sm:text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">✨ Vibe Coding Agent Initiated</div>
                <div className="text-emerald-400 mb-2 text-sm sm:text-base md:text-lg drop-shadow-md">✓ Analyzing business logic...</div>
                <div className="text-emerald-400 mb-2 text-sm sm:text-base md:text-lg drop-shadow-md">✓ Generating optimized Sales Funnel.</div>
                <div className="text-blue-300 mt-4 md:mt-6 text-sm sm:text-base font-bold">Deploying System...</div>
              </div>
              <div className={`absolute inset-0 bg-slate-900/40 p-4 sm:p-6 md:p-8 transition-opacity duration-700 flex flex-col text-left rounded-xl ${heroState === 2 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
                <div className="flex justify-between items-center border-b border-slate-600/50 pb-3 md:pb-4 mb-4 md:mb-6 shrink-0">
                  <h3 className="text-white font-black text-base sm:text-xl md:text-2xl tracking-tighter drop-shadow-md">INTEGRATED CRM DASHBOARD</h3>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded text-[10px] md:text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">Active Sessions</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 flex-1 overflow-hidden relative">
                  {[1911, 1121, 1199, 1390, 1374, 1202].map((num, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-md rounded-xl p-3 md:p-4 shadow-lg border border-white/5 h-20 md:h-24 flex flex-col justify-center transition-all hover:border-blue-500/50">
                      <div className="text-[10px] md:text-xs font-bold text-blue-300 mb-1.5 drop-shadow-sm">상담 대기 | 리드 스코어 92</div>
                      <div className="text-xs md:text-sm font-black text-white drop-shadow-md">신규 잠재 고객 {num}</div>
                    </div>
                  ))}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1120]/80 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 💡 2. 매니페스토 (안티-학원 프레임 고도화) */}
      <AntiAcademySection />

      {/* 🛑 3. 인강 VS 부트캠프 비교표 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeInSection direction="up">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 break-keep leading-tight text-slate-900">수많은 온라인 코딩 강의,<br className="block sm:hidden"/> 왜 실전 적용에서 멈출까요?</h2>
              <p className="text-slate-500 font-medium text-sm md:text-lg break-keep">시스템을 구축하고 실제 비즈니스에 연동하는 고도화의 과정에는 수많은 변수가 존재합니다.<br className="hidden md:block"/>저희는 영상 너머가 아닌, 현장에서 함께 고민하고 문제를 해결하는 방식을 선택했습니다.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <FadeInSection direction="left" delay={100}>
              <TiltCard className="h-full">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-200 relative h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-sm">일반적인 온라인 VOD 교육</div>
                  <h3 className="text-xl font-black text-slate-600 mb-6 text-center mt-4">일방향 지식 전달의 한계</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start"><span className="text-slate-400 font-black mt-0.5">-</span><p className="text-slate-600 text-sm font-medium leading-relaxed">예기치 못한 오류 발생 시 개별적인 해결책을 찾기 어려움</p></li>
                    <li className="flex gap-3 items-start"><span className="text-slate-400 font-black mt-0.5">-</span><p className="text-slate-600 text-sm font-medium leading-relaxed">정해진 예제 코드를 실습하는 데 그쳐 자사 서비스 적용 한계</p></li>
                    <li className="flex gap-3 items-start"><span className="text-slate-400 font-black mt-0.5">-</span><p className="text-slate-600 text-sm font-medium leading-relaxed">복잡한 서버 배포 및 도메인 연동 과정에서의 높은 포기율</p></li>
                  </ul>
                </div>
              </TiltCard>
            </FadeInSection>
            <FadeInSection direction="right" delay={300}>
              <TiltCard className="h-full">
                <div className="bg-gradient-to-b from-blue-50/50 to-indigo-50/50 p-6 md:p-8 rounded-[2rem] border border-blue-200 relative shadow-lg transform md:-translate-y-2 h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-blue-500/20">The Creators 실전 부트캠프</div>
                  <h3 className="text-xl font-black text-[#3B82F6] mb-6 text-center mt-4">실전 구현과 문제 해결에 집중</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start"><span className="text-blue-500 font-black mt-0.5">✓</span><p className="text-slate-800 text-sm font-bold leading-relaxed">현장에서 전문가와 함께 원인을 파악하는 실시간 트러블슈팅</p></li>
                    <li className="flex gap-3 items-start"><span className="text-blue-500 font-black mt-0.5">✓</span><p className="text-slate-800 text-sm font-bold leading-relaxed">수강생의 실제 비즈니스 모델에 맞춘 CRM 시스템 맞춤 설계</p></li>
                    <li className="flex gap-3 items-start"><span className="text-blue-500 font-black mt-0.5">✓</span><p className="text-slate-800 text-sm font-bold leading-relaxed">배포부터 실제 운영 환경 세팅까지 수료 후 즉시 활용 가능</p></li>
                  </ul>
                </div>
              </TiltCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 🎯 4. 수강 타겟 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white border-y border-slate-800 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInSection direction="up">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Who is this for</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black break-keep leading-tight text-white">빠르게 변화하는 AI 시대,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 font-bold">기술에 이끌려 갈 것인가, 기술을 리드할 것인가.</span></h2>
              <p className="text-slate-400 mt-4 text-sm md:text-base">새로운 도약과 생산성의 혁신을 준비하는 분들과 함께합니다.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FadeInSection direction="up" delay={100}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full flex flex-col"><div className="mb-4 text-[#3B82F6]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div><h3 className="text-xl font-bold text-white mb-2 break-keep">비용 효율화가 필요한 사업자 · 스타트업</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">불필요한 외주 개발과 대행 리소스를 줄이고, 아이디어를 즉시 자체 시스템으로 구현하세요. 자동화된 업무 프로세스를 통해 조직 전체의 생산성과 매출 밀도를 높일 수 있습니다.</p></div></TiltCard></FadeInSection>
            <FadeInSection direction="up" delay={200}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full flex flex-col"><div className="mb-4 text-[#3B82F6]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div><h3 className="text-xl font-bold text-white mb-2 break-keep">성장을 주도하는 마케터 · 실무 기획자</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">개발 부서와의 소통 지연으로 아쉬웠던 기획을 직접 실현해 보세요. 프롬프트를 활용해 세일즈 퍼널과 랜딩페이지를 신속하게 구축하며 실무 경쟁력을 한 차원 높일 수 있습니다.</p></div></TiltCard></FadeInSection>
            <FadeInSection direction="up" delay={300}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full flex flex-col"><div className="mb-4 text-[#3B82F6]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><h3 className="text-xl font-bold text-white mb-2 break-keep">안정적인 수익 모델을 찾는 크리에이터</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">채널의 트래픽을 일회성 조회수에 머물게 하지 마세요. 잠재 고객의 데이터를 수집하고 자연스러운 전환을 유도하는 '나만의 수익화 자동화 시스템'을 기획하는 방법을 안내합니다.</p></div></TiltCard></FadeInSection>
            <FadeInSection direction="up" delay={400}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full flex flex-col"><div className="mb-4 text-[#3B82F6]"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div><h3 className="text-xl font-bold text-white mb-2 break-keep">새로운 커리어를 준비하는 도약자</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">코딩에 대한 진입 장벽을 낮추어 드립니다. 그동안 쌓아오신 각자의 도메인 경험과 노하우를 AI 기술과 결합하여, 유의미한 비즈니스 가치로 치환하는 여정을 돕겠습니다.</p></div></TiltCard></FadeInSection>
          </div>
        </div>
      </section>

      {/* 👨‍🏫 5. 강사진 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeInSection direction="up">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Expert Facilitators</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-keep">안전하고 확실한 성장을 돕기 위해,<br/>각 분야의 현업 전문가들이 함께합니다.</h2>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FadeInSection direction="up" delay={100}><TiltCard className="h-full"><div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col relative h-full transition-shadow hover:shadow-md"><div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-600 font-medium">LS</div><div><span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Media & Content</span><h3 className="text-xl font-black text-slate-900 mt-1">이상원 디렉터</h3></div></div><div className="space-y-3 mb-6 flex-1 text-sm"><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">실무 배경</span><span className="font-bold text-slate-700">뉴미디어 채널 기획 및 운영</span></div><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">주요 레퍼런스</span><span className="font-bold text-slate-700">채널 합산 25만 구독자 확보</span></div><div className="flex justify-between items-center pb-2"><span className="font-medium text-slate-500">교육 포커스</span><span className="font-bold text-slate-800">효율적인 오가닉 트래픽 확보</span></div></div><p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl">"시스템 구축만큼이나 중요한 것은 적절한 유입 전략입니다. 현업에서 직접 채널을 성장시키며 체득한 오가닉 트래픽 확보와 콘텐츠 기획의 인사이트를 투명하게 공유합니다."</p></div></TiltCard></FadeInSection>
            <FadeInSection direction="up" delay={300}><TiltCard className="h-full"><div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#3B82F6]/30 flex flex-col relative h-full transition-shadow hover:shadow-md"><div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-xl text-blue-600 font-medium">JS</div><div><span className="text-[#3B82F6] text-[10px] font-bold tracking-wider uppercase">Vibe Coding</span><h3 className="text-xl font-black text-slate-900 mt-1">정시후 디렉터</h3></div></div><div className="space-y-3 mb-6 flex-1 text-sm"><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">실무 배경</span><span className="font-bold text-slate-700">비즈니스 기획 및 전략 수립</span></div><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">강의 철학</span><span className="font-bold text-slate-700">비개발자의 눈높이에 맞춘 소통</span></div><div className="flex justify-between items-center pb-2"><span className="font-medium text-slate-500">교육 포커스</span><span className="font-bold text-slate-800">퍼널 기획 및 AI 툴 연동 실무</span></div></div><p className="text-slate-600 text-sm leading-relaxed break-keep bg-blue-50/50 p-4 rounded-xl">"복잡한 개발 언어 대신, 기획자의 언어로 AI와 소통하는 방법을 안내합니다. 비개발자도 충분히 비즈니스 자동화 모델을 설계하고 구현할 수 있도록 섬세하게 돕겠습니다."</p></div></TiltCard></FadeInSection>
            <FadeInSection direction="up" delay={500}><TiltCard className="h-full"><div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col relative h-full transition-shadow hover:shadow-md"><div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-600 font-medium">LG</div><div><span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Technical Support</span><h3 className="text-xl font-black text-slate-900 mt-1">임건 테크리드</h3></div></div><div className="space-y-3 mb-6 flex-1 text-sm"><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">실무 배경</span><span className="font-bold text-slate-700">다년간의 IT 플랫폼 개발</span></div><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">부트캠프 역할</span><span className="font-bold text-slate-700">실시간 이슈 대응 및 멘토링</span></div><div className="flex justify-between items-center pb-2"><span className="font-medium text-slate-500">교육 포커스</span><span className="font-bold text-slate-800">안정적인 배포 환경 구축</span></div></div><p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl">"기초적인 오류부터 복잡한 서버 연동까지, 기술적인 허들에서 수강생분들이 좌절하지 않도록 든든한 가이드 역할을 수행하겠습니다. 구현의 완성도를 높이는 데 집중합니다."</p></div></TiltCard></FadeInSection>
          </div>
        </div>
      </section>

      {/* 🚀 6. 수료 후의 변화 & 6대 실물 자산 (그리드 레이아웃 완벽 대칭 패치) */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[#0B1120] border-y border-slate-800 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-64 bg-[#3B82F6]/10 blur-[150px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeInSection direction="up">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-cyan-400 font-black tracking-widest text-xs md:text-sm uppercase mb-3 block">Paradigm Shift &amp; Assets</span>
              <h2 className="text-3xl md:text-5xl font-black text-white break-keep leading-tight mb-6">
                4주 후, 비즈니스가 작동하는 <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">패러다임 자체가 혁신됩니다.</span>
              </h2>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 p-5 md:p-6 rounded-2xl max-w-3xl mx-auto mb-16 text-center relative overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <span className="animate-pulse inline-block w-2.5 h-2.5 bg-rose-500 rounded-full mr-3 translate-y-[1px]"></span>
              <span className="text-slate-200 font-bold text-sm md:text-base break-keep leading-relaxed">
                <strong className="text-white">Fact Check : </strong>지금 보고 계신 이 압도적인 랜딩페이지 역시,<br className="hidden md:block"/>
                코딩을 전혀 모르는 <strong className="text-cyan-400 font-black">왕초보 입문자가 '바이브 코딩'으로 직접 구축</strong>한 결과물입니다.
              </span>
            </div>
          </FadeInSection>

          <div className="relative space-y-16 max-w-4xl mx-auto">
            <FadeInSection direction="up">
              <div className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                <div className="w-14 h-14 shrink-0 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-center font-black text-blue-400 text-xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">01</div>
                <div>
                  <span className="text-blue-500 font-black text-xs tracking-widest uppercase block mb-1">Infrastructure</span>
                  <h3 className="text-white font-black text-xl mb-2">Agentic AI 기반 핵심 엔진 탑재</h3>
                  <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                    단순한 챗봇 활용을 넘어, 스스로 목표를 인지하고 판단하여 비즈니스 트래픽을 처리하는 하이엔드 자율형 <strong>에이전틱 AI(Agentic AI) 엔진</strong>을 내 시스템에 이식하는 기초 뼈대를 구축합니다.
                  </p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="up">
              <div className="relative">
                <div className="absolute left-6 md:left-[35px] -top-16 w-0.5 h-16 bg-gradient-to-b from-blue-500/50 to-cyan-500/50"></div>
                
                <div className="bg-slate-900/90 border-2 border-cyan-500/30 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(34,211,238,0.1)] relative">
                  <div className="absolute -top-3 left-6 md:left-10 bg-cyan-500 text-slate-900 font-black text-[10px] px-4 py-1 rounded-full tracking-widest shadow-md">02. CORE ASSETS</div>
                  
                  <div className="mb-8 mt-2 text-left md:text-center">
                    <h3 className="text-white font-black text-2xl mb-2">왕초보 입문자가 4주 만에 손에 쥘 6대 실물 자산</h3>
                    <p className="text-slate-400 text-xs md:text-sm font-medium">이론 강의는 없습니다. 수료와 동시에 당신의 비즈니스에 즉시 배포되는 실물 프로그램 라인업입니다.</p>
                  </div>

                  {/* 🚀 3x2 대칭 그리드 및 하이엔드 SVG 라인 아이콘 적용 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 text-left">
                    <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col">
                      <div className="mb-4 text-cyan-400 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      </div>
                      <h4 className="text-white font-black text-base md:text-lg mb-2">원하는 웹 / 앱 페이지</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">현재 보고 계신 퀄리티의 고효율 전환형 랜딩페이지와 비즈니스 웹사이트를 내 손으로 직접 커스텀 빌딩 및 배포합니다.</p>
                    </div>
                    
                    <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col">
                      <div className="mb-4 text-cyan-400 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                      </div>
                      <h4 className="text-white font-black text-base md:text-lg mb-2">업무용 맞춤 프로그램</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">매번 수작업으로 처리하던 반복 업무, 복잡한 데이터 수집 및 가공 리포트를 단 10분 만에 끝내는 나만의 백엔드 프로그램을 완성합니다.</p>
                    </div>
                    
                    <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col">
                      <div className="mb-4 text-cyan-400 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      </div>
                      <h4 className="text-white font-black text-base md:text-lg mb-2">나만의 독립 어플(App)</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">단순 링크 이동을 넘어 실제 유저들이 모바일 기기에 직접 설치하고 유기적으로 작동하는 크로스 플랫폼 형태의 어플리케이션을 소유합니다.</p>
                    </div>
                    
                    <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col">
                      <div className="mb-4 text-cyan-400 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <h4 className="text-white font-black text-base md:text-lg mb-2">상세페이지 전면 자동화</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">수많은 상품 라인업과 크리에이티브 요소를 AI가 자동으로 결합하고, 매체별 맞춤형 세일즈 카피와 상세페이지를 대량 생산하는 무인 오토메이션을 개통합니다.</p>
                    </div>
                    
                    <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col">
                      <div className="mb-4 text-cyan-400 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                      </div>
                      <h4 className="text-white font-black text-base md:text-lg mb-2">하이엔드 마케팅 퍼널</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">잠재 고객의 이탈을 막고 실시간으로 DB를 수집하여, 어드민 칸반보드 대시보드로 자동 라우팅시키는 최고 효율의 세일즈 직렬 주로를 확보합니다.</p>
                    </div>

                    <div className="bg-slate-800/40 border border-slate-700/40 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group flex flex-col">
                      <div className="mb-4 text-cyan-400 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                      </div>
                      <h4 className="text-white font-black text-base md:text-lg mb-2">퍼스널 DB 통합 구축</h4>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">단편적인 경험을 넘어 대표님만의 고유한 노하우를 체계적인 데이터베이스(DB)로 자산화하여, 퍼스널 브랜딩의 강력한 무기로 활용합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="up">
              <div className="relative">
                <div className="absolute left-6 md:left-[35px] -top-16 w-0.5 h-16 bg-gradient-to-b from-cyan-500/50 to-indigo-500/50"></div>
                <div className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                  <div className="w-14 h-14 shrink-0 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center font-black text-indigo-400 text-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">03</div>
                  <div>
                    <span className="text-indigo-500 font-black text-xs tracking-widest uppercase block mb-1">Automation &amp; Scale-up</span>
                    <h3 className="text-white font-black text-xl mb-2">AI 직원 간 상호작용 및 인건비 제로화</h3>
                    <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                      위 6대 실물 자산들이 하나의 파이프라인 안에서 유기적으로 데이터를 주고받으며 <strong className="text-indigo-300">상호작용(Multi-Agent System)</strong>합니다. 업무 프로세스가 초고도화되어, 1인 기업도 대기업 수준의 아웃풋을 내며 불필요한 고정 인건비와 외주 비용을 대폭 절감하게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 💡 7. 리뷰 탭 (진정성 카피 & 유튜브 모바일 UI 최적화 반영) */}
      <ReviewSection />

      {/* 💡 8. 백엔드 쇼케이스 */}
      <BackendShowcaseSection />

      {/* 💡 9. 메타버스 가상 오피스 시뮬레이터 */}
      <VirtualAgencySection />

      {/* 🛑 10. 환불 보장 섹션 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInSection direction="up">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 text-white break-keep">새로운 시작을 위한 결정, 부담 없이 경험해 보세요.</h2>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-6 md:p-10 rounded-[2rem] text-center">
              <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-4">신뢰를 기반으로 한 조건 없는 환불 규정</h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-2xl mx-auto break-keep">
                첫 1주 차 과정에 참여하신 후, 저희의 교육 방식이 기대하셨던 방향성과 맞지 않는다고 판단되신다면 전액 환불해 드립니다. 수강생 여러분의 소중한 시간과 가치를 최우선으로 존중하겠습니다.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 💡 11. 롤링 명언 섹션 */}
      <ParadigmShiftSection />

      {/* 🚀 12. 최종 CRM 컨설팅 유도 CTA */}
      <section className="py-24 md:py-40 px-4 md:px-6 bg-[#0B1120] text-white overflow-hidden border-t border-slate-800 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeInSection direction="up">
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-3 block">Start Your Journey</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight break-keep leading-tight">
                유튜브 무료 강의와 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">차원이 다른 밀도</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16 text-left">
              {[
                { title: '총 교육 시간', value: '40시간', sub: '압도적 실전 코칭' },
                { title: '개강 일정', value: '8월 모집중', sub: '평일반/주말반' },
                { title: '참여 대상', value: 'AI 왕초보', sub: '비개발자 맞춤' },
                { title: '신뢰 보장', value: '사후 관리', sub: '지속적 피드백' }
              ].map((info, idx) => (
                <div key={idx} className="bg-slate-800/40 border border-white/5 p-5 rounded-[1.5rem]">
                  <p className="text-slate-500 text-xs font-bold mb-1">{info.title}</p>
                  <p className="text-white font-black text-lg md:text-xl">{info.value}</p>
                  <p className="text-slate-400 text-[10px] mt-1 font-medium">{info.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white text-slate-900 p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative max-w-3xl mx-auto overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#3B82F6] text-white font-black text-xs px-6 py-2 uppercase tracking-wider rounded-bl-2xl shadow-md">
                VIP CONSULTING
              </div>
              
              <div className="text-slate-500 font-bold mb-3 text-xs md:text-sm tracking-widest uppercase">The Creators AI Bootcamp 2nd</div>
              <div className="text-2xl md:text-4xl font-black text-[#191919] mb-6 tracking-tight break-keep leading-snug mt-4">
                "수강 비용은 개인의 현재 비즈니스<br className="hidden sm:block"/> 수준과 목표에 따라 산정됩니다."
              </div>
              
              <p className="text-slate-600 text-sm md:text-base mb-10 font-medium break-keep leading-relaxed bg-slate-50 p-6 rounded-2xl">
                저희는 획일화된 가격표로 공장형 VOD를 팔지 않습니다.<br className="hidden sm:block"/> 
                현재 비즈니스의 병목 구간을 진단하고, 그에 맞는 최적의 바이브 코딩 파이프라인과 맞춤형 구축 견적을 투명하게 안내해 드립니다.
              </p>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-slate-900 hover:bg-black text-white px-6 py-5 rounded-2xl text-lg md:text-xl font-black shadow-xl transition-all transform hover:-translate-y-1 break-keep flex items-center justify-center gap-3 ease-lux"
              >
                <span>🚀 결제 전 1:1 무료 진단 및 컨설팅 신청</span>
              </button>
              
              <p className="text-slate-500 text-xs mt-6 font-medium break-keep leading-relaxed text-center">
                * 1시간 무료 컨설팅을 통해 나에게 맞는 시스템인지 직접 검증하십시오.<br className="hidden sm:block"/>
                신청을 남겨주시면 스케줄 조율을 위해 담당자가 개별 연락을 드립니다. (소수 정예 모집으로 조기 마감 주의)
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <ConsultingApplyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
}