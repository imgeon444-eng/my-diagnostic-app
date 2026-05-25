'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// 💡 [STEP 2] 스크롤 감지 애니메이션 모듈
function FadeInSection({ children, delay = 0 }) {
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

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
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

// 💡 [신규 이식: V4.0 옵션 A] 안티-학원 프레임 선언문 모듈
function AntiAcademySection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#05080f] text-center border-b border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
      <FadeInSection>
        <div className="max-w-4xl mx-auto">
          <span className="text-rose-500 font-black tracking-widest text-xs md:text-sm uppercase mb-4 block">Manifesto</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 break-keep leading-tight">
            단호하게 말씀드립니다.<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400"> 우리는 &apos;코딩 학원&apos;이 아닙니다.</span>
          </h2>
          <div className="bg-slate-900/80 border border-rose-500/20 p-8 md:p-12 rounded-[2rem] shadow-2xl relative transform transition-all hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rose-500 to-orange-500 rounded-l-[2rem]"></div>
            <p className="text-slate-300 text-base md:text-lg lg:text-xl font-medium leading-relaxed break-keep text-left md:text-center">
              누구나 돈만 내면 들을 수 있는 <strong className="text-white">공장형 템플릿 강의를 찾으신다면, 지금 당장 뒤로 가기를 눌러주십시오.</strong><br/><br/>
              The Creators AI는 당신에게 지식을 파는 강사가 아닙니다. AI의 압도적인 효율성과 인간의 진정성을 결합하여, 당신의 비즈니스에 <strong>&apos;무인 자동화 시스템&apos;을 함께 지어 올리는 시스템 빌딩 파트너</strong>입니다.
            </p>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}

// 💡 듀얼 리뷰 섹션 모듈
function ReviewSection() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-[#090E17] border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-10 md:mb-12">
            <span className="text-[#3B82F6] font-black tracking-widest text-xs uppercase mb-2 block">100% Real Reviews</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              조작 없는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#3B82F6]">날것의 변화</span>를 증명합니다
            </h2>
            <p className="text-slate-400 mt-4 text-sm md:text-base break-keep">
              아름답게 꾸며낸 가짜 텍스트 리뷰는 단 한 줄도 적지 않겠습니다.<br className="hidden sm:block"/>
              오직 수강생의 동의를 얻은 생생한 영상과 카카오톡 대화 원본만 공개합니다.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={100}>
          <div className="flex justify-center mb-10">
            <div className="bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50 inline-flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-6 md:px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'video' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ▶️ 생생한 영상 리뷰
              </button>
              <button
                onClick={() => setActiveTab('kakao')}
                className={`px-6 md:px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'kakao' 
                    ? 'bg-[#FEE500] text-[#191919] shadow-lg shadow-yellow-500/20' 
                    : 'text-slate-400 hover:text-[#FEE500]'
                }`}
              >
                💬 100% 리얼 카톡 후기
              </button>
            </div>
          </div>

          {activeTab === 'video' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 group">
                <div className="aspect-video w-full relative bg-slate-800">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/Yp2VP2oFKrk"
                    title="부트캠프 수강생 리뷰 1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-black px-2 py-1 rounded border border-blue-500/20">The Creators AI 수강생</span>
                  </div>
                  <p className="text-white font-bold text-lg leading-snug break-keep">&quot;개발자 없이 2주 만에 자동화 시스템을 구축했습니다.&quot;</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700/50 group">
                <div className="aspect-video w-full relative bg-slate-800">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/두번째영상ID_입력" 
                    title="부트캠프 수강생 리뷰 2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-cyan-500/20 text-cyan-400 text-xs font-black px-2 py-1 rounded border border-cyan-500/20">The Creators AI 수강생</span>
                  </div>
                  <p className="text-white font-bold text-lg leading-snug break-keep">&quot;이전에는 직원이 3일 걸리던 리포트가 지금은 10분 컷입니다.&quot;</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kakao' && (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
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
                <a
                  href="http://thecreator-mcn.com/bbs/board.php?bo_table=review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-slate-700 transition-all hover:-translate-y-1"
                >
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

// 💡 [이식 완료: V4.0 옵션 B] 날것의 백엔드 데이터 쇼케이스 모듈
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
          <FadeInSection delay={100}>
            <div className="bg-[#0D1117] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="bg-[#161B22] px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-slate-400 text-xs font-mono font-bold tracking-widest">FIREBASE CLOUD FIRESTORE</div>
              </div>
              <div className="p-5 font-mono text-xs sm:text-sm flex-1 bg-[#0D1117] text-slate-300 h-64 overflow-y-auto custom-scrollbar">
                <div className="text-blue-400 mb-4">$ The Creators AI - Database listening on port 3000...</div>
                {logs.map((log, idx) => {
                  if (!log) return null;
                  return (
                    <div key={idx} className="mb-2 flex items-start gap-3 animate-fade-in-up">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className={`
                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                        ${log.type === 'warn' ? 'text-amber-400' : ''}
                        ${log.type === 'info' ? 'text-cyan-400' : ''}
                      `}>
                        {log.msg}
                      </span>
                    </div>
                  );
                })}
                <div className="animate-pulse w-2 h-4 bg-slate-400 mt-2"></div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection delay={300}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="text-slate-200 text-sm font-bold flex items-center gap-2">
                  <span className="text-xl">📊</span> Admin CRM Dashboard
                </div>
                <div className="text-emerald-400 text-xs font-black bg-emerald-400/10 px-2 py-1 rounded flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> Live Sync
                </div>
              </div>
              <div className="p-5 flex-1 bg-slate-900 relative">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {leads.map((lead, idx) => {
                    if (!lead) return null;
                    return (
                      <div key={lead.id} className={`bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-lg transform transition-all duration-500 animate-fade-in-up
                        ${idx === 0 ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105 z-10' : 'opacity-70'}
                      `}>
                        <div className="text-[10px] font-black text-cyan-400 mb-1 tracking-wider uppercase">{lead.status}</div>
                        <div className="text-white font-bold text-sm mb-1">{lead.name}</div>
                        <div className="text-slate-400 text-xs font-mono">{lead.phone}</div>
                        {idx === 0 && <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 w-full animate-pulse"></div></div>}
                      </div>
                    );
                  })}
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-center mt-6 p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl">
                  <p className="text-blue-400 text-xs font-bold tracking-wide">
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
    <section className="py-20 md:py-32 px-4 md:px-6 bg-[#05080f] text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-40 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 min-h-[200px] flex flex-col justify-center items-center">
        <div className="text-blue-500/30 text-5xl md:text-7xl font-serif leading-none mb-[-10px] md:mb-[-20px]">&quot;</div>
        
        <h2 className={`text-xl sm:text-2xl md:text-4xl font-black text-white break-keep leading-tight mb-8 relative z-10 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
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

// 👑 [메인 함수] 랜딩페이지 뼈대 (배치 순서 완벽 최적화)
export default function BootcampSalesPage() {
  const [heroState, setHeroState] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ clientName: '', clientTitle: '', clientContact: '', clientEmail: '', businessGoal: '' });

  useEffect(() => {
    const interval = setInterval(() => setHeroState((prev) => (prev + 1) % 3), 3500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmitForm = async () => {
    if (!formData.clientName || !formData.clientContact || !formData.businessGoal) {
      return alert("성함, 연락처, 그리고 현재의 비즈니스 고민을 반드시 작성해 주셔야 심사가 가능합니다.");
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bootcamp_leads"), {
        ...formData, status: "심사 대기", createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("지원서 제출 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#3B82F6] selection:text-white relative font-sans break-keep overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}} />

      {/* 플로팅 네비게이션 */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50 animate-fade-in-up">
        <Link href="/" className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-full shadow-lg hover:bg-slate-900/70 hover:border-white/20 transition-all duration-300">
          <span className="text-white/70 group-hover:text-white group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-white/90 group-hover:text-white text-xs md:text-sm font-bold tracking-wide">이전 페이지로</span>
        </Link>
      </div>

      {/* 🚀 1. 히어로 섹션 */}
      <header className="relative pt-28 pb-16 md:pt-32 md:pb-20 px-4 md:px-6 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center animate-fade-in-up">
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl mb-6 md:mb-8 inline-block w-full sm:w-auto shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <p className="font-bold text-xs md:text-base leading-snug">💡 진단 리포트는 확인하셨나요? 매월 발생하는 보이지 않는 기회비용,</p>
            <p className="text-[10px] md:text-sm mt-1">The Creators AI가 제안하는 자동화 시스템으로 부드럽게 해결할 수 있습니다.</p>
          </div>
          <br className="hidden md:block"/>
          <span className="inline-block py-1 px-4 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs md:text-sm mb-4 md:mb-6 tracking-widest uppercase shadow-sm">
            The Creators AI Bootcamp 1st
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tighter break-keep">
            개발에 쏟을 리소스를,<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-cyan-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">온전히 비즈니스 성장에 집중하세요.</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-400 mb-8 md:mb-10 font-medium max-w-2xl mx-auto leading-relaxed break-keep">
            코딩 지식이 없어도 충분합니다. AI 파트너와 대화하며 단 4주 만에<br className="hidden md:block"/>
            나만의 비즈니스 수익화 파이프라인을 구축하는 <strong>&apos;바이브 코딩&apos;</strong> 실전 부트캠프.
          </p>

          <div className="w-full max-w-3xl mx-auto bg-[#0B1120] rounded-2xl p-1 md:p-2 shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-blue-500/30 relative h-56 sm:h-64 md:h-96 overflow-hidden">
            <div className={`absolute inset-0 bg-[#0c0c0c] p-4 sm:p-6 md:p-8 text-left font-mono transition-opacity duration-500 flex flex-col justify-center ${heroState === 0 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="text-slate-500 mb-1 md:mb-2 font-bold text-sm sm:text-lg md:text-xl">⨯ System: Manual Coding Required</div>
              <div className="text-slate-400 mb-1 text-xs sm:text-sm md:text-base">&gt; Planning development resources...</div>
              <div className="text-slate-400 mb-1 text-xs sm:text-sm md:text-base">ℹ Estimated timeline: 3 weeks.</div>
              <div className="text-slate-600 mt-2 md:mt-4 text-xs sm:text-sm animate-pulse">Waiting for execution...</div>
            </div>
            <div className={`absolute inset-0 bg-[#0c0c0c] p-4 sm:p-6 md:p-8 text-left font-mono transition-opacity duration-500 flex flex-col justify-center border-2 border-[#3B82F6] ${heroState === 1 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="text-[#3B82F6] mb-2 md:mb-3 font-bold text-sm sm:text-lg md:text-xl">✨ Vibe Coding Agent Initiated</div>
              <div className="text-emerald-400 mb-1 text-xs sm:text-sm md:text-base">✓ Analyzing business logic...</div>
              <div className="text-emerald-400 mb-1 text-xs sm:text-sm md:text-base">✓ Generating optimized Sales Funnel.</div>
              <div className="text-blue-300 mt-2 md:mt-4 text-xs sm:text-sm font-bold">Deploying System...</div>
            </div>
            <div className={`absolute inset-0 bg-[#0F172A] p-3 sm:p-4 md:p-6 transition-opacity duration-700 flex flex-col text-left ${heroState === 2 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">
                <h3 className="text-white font-black text-sm sm:text-lg md:text-xl tracking-tighter">INTEGRATED CRM DASHBOARD</h3>
                <span className="bg-[#3B82F6] text-white px-3 py-1 rounded text-[8px] md:text-[10px] font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]">Active Sessions</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 flex-1 overflow-hidden relative">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#1E293B] rounded-lg md:rounded-xl p-2 md:p-3 shadow-sm border border-slate-700 h-16 md:h-20 flex flex-col justify-center">
                    <div className="text-[8px] md:text-[10px] font-bold text-blue-300 mb-1">상담 대기 | 리드 스코어 92</div>
                    <div className="text-[10px] md:text-xs font-black text-white">신규 잠재 고객 {Math.floor(Math.random() * 1000) + 1000}</div>
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🎬 1.5. VSL 쇼케이스 */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 bg-[#090E17] overflow-hidden flex flex-col items-center border-b border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3B82F6]/10 rounded-[100%] blur-[150px] pointer-events-none"></div>
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
            <div className="mb-8 md:mb-12">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-3 block">Director&apos;s Message</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white break-keep leading-tight">
                The Creators AI가 제안하는<br className="hidden sm:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#3B82F6]">비즈니스 자동화의 새로운 패러다임</span>
              </h2>
            </div>
            <div className="relative group w-full max-w-[280px] sm:max-w-xs md:max-w-sm mx-auto aspect-[9/16] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] border-[6px] md:border-[8px] border-slate-800 bg-black transition-all duration-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] hover:border-blue-500/50 hover:-translate-y-2">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 md:h-6 bg-slate-800 rounded-b-2xl z-20 pointer-events-none flex justify-center items-end pb-1"><div className="w-10 h-1 bg-slate-700/50 rounded-full"></div></div>
              <iframe className="absolute inset-0 w-full h-full z-10" src="https://www.youtube.com/embed/j-Bo6WFvDAs?controls=1&rel=0&modestbranding=1&playsinline=1" title="The Creators AI VSL" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <p className="mt-8 text-slate-500 font-medium text-sm md:text-base break-keep">
              * 소수정예 오프라인 부트캠프 입니다, <span className="text-slate-700 font-bold">The Creators AI 바이브코딩 비즈니스 자동화는 생존스킬 입니다.</span>
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* 💡 [신규 이식: V4.0 옵션 A] 안티-학원 프레임 선언문 */}
      <AntiAcademySection />

      {/* 🛑 2. 인강 VS 부트캠프 비교표 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 break-keep leading-tight text-slate-900">수많은 온라인 코딩 강의,<br className="block sm:hidden"/> 왜 실전 적용에서 멈추게 될까요?</h2>
              <p className="text-slate-500 font-medium text-sm md:text-lg break-keep">시스템을 구축하고 실제 비즈니스에 연동하는 고도화의 과정에는 수많은 변수가 존재합니다.<br className="hidden md:block"/>저희는 영상 너머가 아닌, 현장에서 함께 고민하고 문제를 해결하는 방식을 선택했습니다.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <FadeInSection delay={100}>
              <TiltCard className="h-full">
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 relative h-full">
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
            <FadeInSection delay={300}>
              <TiltCard className="h-full">
                <div className="bg-gradient-to-b from-blue-50/50 to-indigo-50/50 p-6 md:p-8 rounded-3xl border border-blue-200 relative shadow-lg transform md:-translate-y-2 h-full">
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

      {/* 🎯 3. 수강 타겟 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white border-y border-slate-800 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Who is this for</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black break-keep leading-tight text-white">빠르게 변화하는 AI 시대,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 font-bold">기술에 이끌려 갈 것인가, 기술을 리드할 것인가.</span></h2>
              <p className="text-slate-400 mt-4 text-sm md:text-base">새로운 도약과 생산성의 혁신을 준비하는 분들과 함께합니다.</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FadeInSection delay={100}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full"><div className="text-2xl mb-4 opacity-80">🏢</div><h3 className="text-xl font-bold text-white mb-2 break-keep">비용 효율화가 필요한 사업자 · 스타트업</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">불필요한 외주 개발과 대행 리소스를 줄이고, 아이디어를 즉시 자체 시스템으로 구현하세요. 자동화된 업무 프로세스를 통해 조직 전체의 생산성과 매출 밀도를 높일 수 있습니다.</p></div></TiltCard></FadeInSection>
            <FadeInSection delay={200}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full"><div className="text-2xl mb-4 opacity-80">💼</div><h3 className="text-xl font-bold text-white mb-2 break-keep">성장을 주도하는 마케터 · 실무 기획자</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">개발 부서와의 소통 지연으로 아쉬웠던 기획을 직접 실현해 보세요. 프롬프트를 활용해 세일즈 퍼널과 랜딩페이지를 신속하게 구축하며 실무 경쟁력을 한 차원 높일 수 있습니다.</p></div></TiltCard></FadeInSection>
            <FadeInSection delay={300}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full"><div className="text-2xl mb-4 opacity-80">📸</div><h3 className="text-xl font-bold text-white mb-2 break-keep">안정적인 수익 모델을 찾는 크리에이터</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">채널의 트래픽을 일회성 조회수에 머물게 하지 마세요. 잠재 고객의 데이터를 수집하고 자연스러운 전환을 유도하는 &apos;나만의 수익화 자동화 시스템&apos;을 기획하는 방법을 안내합니다.</p></div></TiltCard></FadeInSection>
            <FadeInSection delay={400}><TiltCard className="h-full"><div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full"><div className="text-2xl mb-4 opacity-80">🌱</div><h3 className="text-xl font-bold text-white mb-2 break-keep">새로운 커리어를 준비하는 도약자</h3><p className="text-slate-400 text-sm leading-relaxed break-keep">코딩에 대한 진입 장벽을 낮추어 드립니다. 그동안 쌓아오신 각자의 도메인 경험과 노하우를 AI 기술과 결합하여, 유의미한 비즈니스 가치로 치환하는 여정을 돕겠습니다.</p></div></TiltCard></FadeInSection>
          </div>
        </div>
      </section>

      {/* 👨‍🏫 4. 강사진 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Expert Facilitators</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-keep">안전하고 확실한 성장을 돕기 위해,<br/>각 분야의 현업 전문가들이 함께합니다.</h2>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FadeInSection delay={100}><TiltCard className="h-full"><div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative h-full transition-shadow hover:shadow-md"><div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-600 font-medium">LS</div><div><span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Media & Content</span><h3 className="text-xl font-black text-slate-900 mt-1">이상원 디렉터</h3></div></div><div className="space-y-3 mb-6 flex-1 text-sm"><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">실무 배경</span><span className="font-bold text-slate-700">뉴미디어 채널 기획 및 운영</span></div><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">주요 레퍼런스</span><span className="font-bold text-slate-700">채널 합산 25만 구독자 확보</span></div><div className="flex justify-between items-center pb-2"><span className="font-medium text-slate-500">교육 포커스</span><span className="font-bold text-slate-800">효율적인 오가닉 트래픽 확보</span></div></div><p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl">&quot;시스템 구축만큼이나 중요한 것은 적절한 유입 전략입니다. 현업에서 직접 채널을 성장시키며 체득한 오가닉 트래픽 확보와 콘텐츠 기획의 인사이트를 투명하게 공유합니다.&quot;</p></div></TiltCard></FadeInSection>
            <FadeInSection delay={300}><TiltCard className="h-full"><div className="bg-white rounded-3xl p-8 shadow-sm border border-[#3B82F6]/30 flex flex-col relative h-full transition-shadow hover:shadow-md"><div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-xl text-blue-600 font-medium">JS</div><div><span className="text-[#3B82F6] text-[10px] font-bold tracking-wider uppercase">Vibe Coding</span><h3 className="text-xl font-black text-slate-900 mt-1">정시후 디렉터</h3></div></div><div className="space-y-3 mb-6 flex-1 text-sm"><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">실무 배경</span><span className="font-bold text-slate-700">비즈니스 기획 및 전략 수립</span></div><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">강의 철학</span><span className="font-bold text-slate-700">비개발자의 눈높이에 맞춘 소통</span></div><div className="flex justify-between items-center pb-2"><span className="font-medium text-slate-500">교육 포커스</span><span className="font-bold text-slate-800">퍼널 기획 및 AI 툴 연동 실무</span></div></div><p className="text-slate-600 text-sm leading-relaxed break-keep bg-blue-50/50 p-4 rounded-xl">&quot;복잡한 개발 언어 대신, 기획자의 언어로 AI와 소통하는 방법을 안내합니다. 비개발자도 충분히 비즈니스 자동화 모델을 설계하고 구현할 수 있도록 섬세하게 돕겠습니다.&quot;</p></div></TiltCard></FadeInSection>
            <FadeInSection delay={500}><TiltCard className="h-full"><div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative h-full transition-shadow hover:shadow-md"><div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-600 font-medium">LG</div><div><span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Technical Support</span><h3 className="text-xl font-black text-slate-900 mt-1">임건 테크리드</h3></div></div><div className="space-y-3 mb-6 flex-1 text-sm"><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">실무 배경</span><span className="font-bold text-slate-700">다년간의 IT 플랫폼 개발</span></div><div className="flex justify-between items-center border-b border-slate-50 pb-2"><span className="font-medium text-slate-500">부트캠프 역할</span><span className="font-bold text-slate-700">실시간 이슈 대응 및 멘토링</span></div><div className="flex justify-between items-center pb-2"><span className="font-medium text-slate-500">교육 포커스</span><span className="font-bold text-slate-800">안정적인 배포 환경 구축</span></div></div><p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl">&quot;기초적인 오류부터 복잡한 서버 연동까지, 기술적인 허들에서 수강생분들이 좌절하지 않도록 든든한 가이드 역할을 수행하겠습니다. 구현의 완성도를 높이는 데 집중합니다.&quot;</p></div></TiltCard></FadeInSection>
          </div>
        </div>
      </section>

      {/* 🚀 5. 수료 후의 변화 (V3.8 5대 실물 산출물 중심 인포그래픽 로드맵) */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[#0B1120] border-y border-slate-800 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-64 bg-[#3B82F6]/10 blur-[150px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeInSection>
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
                코딩을 전혀 모르는 <strong className="text-cyan-400 font-black">왕초보 입문자가 &apos;바이브 코딩&apos;으로 직접 구축</strong>한 결과물입니다.
              </span>
            </div>
          </FadeInSection>

          <div className="relative space-y-16 max-w-4xl mx-auto">
            <FadeInSection>
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

            <FadeInSection>
              <div className="relative">
                <div className="absolute left-6 md:left-[35px] -top-16 w-0.5 h-16 bg-gradient-to-b from-blue-500/50 to-cyan-500/50"></div>
                
                <div className="bg-slate-900/90 border-2 border-cyan-500/30 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(34,211,238,0.1)] relative">
                  <div className="absolute -top-3 left-6 md:left-10 bg-cyan-500 text-slate-900 font-black text-[10px] px-4 py-1 rounded-full tracking-widest shadow-md">02. CORE ASSETS</div>
                  
                  <div className="mb-8 mt-2 text-left md:text-center">
                    <h3 className="text-white font-black text-2xl mb-2">왕초보 입문자가 4주 만에 손에 쥘 5대 실물 자산</h3>
                    <p className="text-slate-400 text-xs md:text-sm font-medium">이론 강의는 없습니다. 수료와 동시에 당신의 비즈니스에 즉시 배포되는 실물 프로그램 라인업입니다.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl hover:border-cyan-500/50 transition-all group">
                      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">🌐</div>
                      <h4 className="text-white font-black text-base mb-1.5">원하는 웹 / 앱 페이지</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">현재 보고 계신 퀄리티의 고효율 전환형 랜딩페이지와 비즈니스 웹사이트를 내 손으로 직접 커스텀 빌딩 및 배포합니다.</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl hover:border-cyan-500/50 transition-all group">
                      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">🛠️</div>
                      <h4 className="text-white font-black text-base mb-1.5">업무용 맞춤 프로그램</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">매번 수작업으로 처리하던 반복 업무, 복잡한 데이터 수집 및 가공 리포트를 단 10분 만에 끝내는 나만의 백엔드 프로그램을 완성합니다.</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl hover:border-cyan-500/50 transition-all group">
                      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">📱</div>
                      <h4 className="text-white font-black text-base mb-1.5">나만의 독립 어플(App)</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">단순 링크 이동을 넘어 실제 유저들이 모바일 기기에 직접 설치하고 유기적으로 작동하는 크로스 플랫폼 형태의 어플리케이션을 소유합니다.</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl hover:border-cyan-500/50 transition-all group">
                      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                      <h4 className="text-white font-black text-base mb-1.5">상세페이지 전면 자동화</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">수많은 상품 라인업과 크리에이티브 요소를 AI가 자동으로 결합하고, 매체별 맞춤형 세일즈 카피와 상세페이지를 대량 생산하는 무인 오토메이션 시스템을 개통합니다.</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/40 p-5 rounded-2xl hover:border-cyan-500/50 transition-all group sm:col-span-2 md:col-span-1">
                      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
                      <h4 className="text-white font-black text-base mb-1.5">하이엔드 마케팅 퍼널 구축</h4>
                      <p className="text-slate-400 text-xs leading-relaxed font-medium">유입된 잠재 고객의 이탈을 막고 실시간으로 DB를 수집하여, 어드민 칸반보드 대시보드로 자동 라우팅시키는 최고 효율의 세일즈 직렬 주로를 확보합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="relative">
                <div className="absolute left-6 md:left-[35px] -top-16 w-0.5 h-16 bg-gradient-to-b from-cyan-500/50 to-indigo-500/50"></div>
                <div className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 items-start md:items-center relative">
                  <div className="w-14 h-14 shrink-0 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center font-black text-indigo-400 text-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]">03</div>
                  <div>
                    <span className="text-indigo-500 font-black text-xs tracking-widest uppercase block mb-1">Automation &amp; Scale-up</span>
                    <h3 className="text-white font-black text-xl mb-2">AI 직원 간 상호작용 및 인건비 제로화</h3>
                    <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                      위 5대 실물 자산들이 하나의 파이프라인 안에서 유기적으로 데이터를 주고받으며 <strong className="text-indigo-300">상호작용(Multi-Agent System)</strong>합니다. 업무 프로세스가 초고도화되어, 1인 기업도 대기업 수준의 아웃풋을 내며 불필요한 고정 인건비와 외주 비용을 대폭 절감하게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 💡 듀얼 리뷰 섹션 삽입 */}
      <ReviewSection />

      {/* 💡 백엔드 데이터 쇼케이스 */}
      <BackendShowcaseSection />

      {/* 6. 환불 보장 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 text-white break-keep">새로운 시작을 위한 결정, 부담 없이 경험해 보세요.</h2>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-6 md:p-10 rounded-2xl md:rounded-3xl text-center">
              <h3 className="text-lg md:text-xl font-bold text-slate-200 mb-4">신뢰를 기반으로 한 조건 없는 환불 규정</h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-2xl mx-auto break-keep">
                첫 1주 차 과정에 참여하신 후, 저희의 교육 방식이 기대하셨던 방향성과 맞지 않는다고 판단되신다면 전액 환불해 드립니다. 수강생 여러분의 소중한 시간과 가치를 최우선으로 존중하겠습니다.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 💡 [재배치 완료] 결제창 직전 감정적 쐐기: 롤링 명언 섹션 */}
      <ParadigmShiftSection />

      {/* 🚀 7. 최종 Pricing 및 상담 접수 CTA */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-slate-900 text-white overflow-hidden border-t border-slate-800 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-2 block">Special Price Pivot</span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight break-keep leading-tight">
                유튜브 무료 강의와 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">차원이 다른 밀도</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base break-keep font-medium">
                단순히 기능을 나열하는 영상 시청이 아닙니다. 4주간 내 비즈니스의 무인 자동화 파이프라인을 전문가와 1:1로 현장에서 직접 빌딩하는 실전 환경을 제안합니다.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12 text-left">
              <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold mb-1">⏱️ 총 교육 시간</p>
                <p className="text-white font-black text-lg md:text-xl">4주 총 40시간</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">압도적인 실전 코칭</p>
              </div>
              <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold mb-1">📅 개강 일정</p>
                <p className="text-cyan-400 font-black text-lg md:text-xl">6월 중순 예정</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">평일반 / 주말반 운영</p>
              </div>
              <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold mb-1">🔥 참여 대상</p>
                <p className="text-white font-black text-lg md:text-xl">AI 왕초보 가능</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">비개발자 눈높이 맞춤</p>
              </div>
              <div className="bg-slate-800/40 border border-white/5 p-5 rounded-2xl">
                <p className="text-slate-500 text-xs font-bold mb-1">🛡️ 신뢰 보장</p>
                <p className="text-emerald-400 font-black text-lg md:text-xl">사후관리 보장</p>
                <p className="text-slate-400 text-xs mt-1 font-medium">지속적인 시스템 피드백</p>
              </div>
            </div>

            <div className="bg-white text-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl relative max-w-2xl mx-auto overflow-hidden">
              <div className="absolute top-0 right-0 bg-rose-500 text-white font-black text-xs px-6 py-2 uppercase tracking-wider rounded-bl-2xl shadow-md">
                30% SPECIAL OFF
              </div>
              
              <div className="text-slate-500 font-bold mb-2 text-xs md:text-sm tracking-wide uppercase">The Creators AI Bootcamp 1st Crew</div>
              <div className="text-slate-400 line-through text-base md:text-lg mb-1">정상가 2,200,000원 (기존가 990,000원)</div>
              
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3B82F6] mb-8 tracking-tight">
                693,000<span className="text-xl md:text-2xl text-slate-500 font-bold ml-1">원</span>
              </div>
              
              {/* 결제창 마감 및 심사 지원 유도 버튼 */}
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-rose-600 text-white px-4 md:px-8 py-4 md:py-5 rounded-2xl text-base md:text-xl font-black shadow-lg hover:bg-rose-700 transition-all transform hover:-translate-y-0.5 break-keep flex items-center justify-center gap-2"
              >
                <span>🔒 결제창 마감 (1기 크루 심사 지원하기)</span>
              </button>
              
              <p className="text-slate-500 text-xs md:text-sm mt-6 font-medium break-keep leading-relaxed text-left md:text-center">
                * 고밀도 밀착 케어 및 인프라 제공 퀄리티 유지를 위해 <strong className="text-rose-500 font-black">정원은 최대 10명 소수 정예</strong>로 엄격히 제한됩니다.<br className="hidden sm:block"/>
                현재 결제창은 닫혀있으며, 제출해 주신 지원서 심사 후 합격자에 한해 개별 연락을 드립니다.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 💡 심사 지원서 폼 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 md:p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto border border-slate-100 custom-scrollbar">
            {!isSuccess && (
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 md:top-6 right-4 md:right-6 w-8 h-8 bg-slate-100 rounded-full font-bold hover:bg-slate-200 text-slate-500 transition-colors">✕</button>
            )}
            
            {!isSuccess ? (
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 break-keep">🔥 1기 크루 합류 심사 지원서</h2>
                <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 break-keep font-medium">단순 결제로 수강할 수 없습니다. 귀하의 비즈니스와 The Creators AI의 시너지를 판단하기 위해 아래 문항을 진솔하게 작성해 주십시오.</p>
                
                <div className="space-y-3 md:space-y-4">
                  <input type="text" placeholder="기업명 또는 브랜드명" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-colors" />
                  <input type="text" placeholder="성함 및 직함 (예: 홍길동 대표)" value={formData.clientTitle} onChange={e => handleInputChange('clientTitle', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-colors" />
                  <input type="text" placeholder="연락처 (010-0000-0000)" value={formData.clientContact} onChange={e => handleInputChange('clientContact', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-colors" />
                  <input type="email" placeholder="이메일 주소" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-colors" />
                  
                  <textarea placeholder="현재 비즈니스의 가장 큰 고민과, 4주 후 자동화 시스템으로 달성하고 싶은 목표를 적어주세요. (심사 핵심 기준)" value={formData.businessGoal} onChange={e => handleInputChange('businessGoal', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-rose-500 outline-none text-sm transition-colors h-32 custom-scrollbar resize-none" />
                  
                  <button 
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-black disabled:bg-slate-300 transition-colors mt-2 md:mt-4 shadow-lg"
                  >
                    {isSubmitting ? '데이터 전송 중...' : '심사 지원서 최종 제출하기'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 md:py-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-xl md:text-2xl mx-auto mb-4 md:mb-6 font-black">✓</div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-3 md:mb-4 break-keep">지원서가 제출되었습니다.</h2>
                <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base break-keep">
                  진솔한 고민을 남겨주셔서 감사합니다.<br className="hidden sm:block"/>
                  대표가 직접 내용을 심사한 후, <strong>시너지가 날 수 있는 합격자에 한해</strong> 남겨주신 연락처로 개별 연락을 드리겠습니다.
                </p>
                
                <div className="space-y-2 md:space-y-3">
                  <a href="https://open.kakao.com/o/sw0Qhz5b" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 h-12 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-sm hover:bg-[#FADA0A] transition-colors">
                    💬 긴급 카카오톡 문의
                  </a>
                  <a href="tel:051-633-3812" className="w-full flex items-center justify-center gap-2 h-12 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                    📞 유선 센터 문의 (051-633-3812)
                  </a>
                </div>
                
                <button onClick={() => {setIsFormOpen(false); setIsSuccess(false);}} className="mt-6 md:mt-8 text-slate-400 font-bold hover:text-slate-600 text-sm">
                  창 닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}