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

export default function BootcampSalesPage() {
  const [heroState, setHeroState] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '', clientTitle: '', clientContact: '', clientEmail: ''
  });

  useEffect(() => {
    const interval = setInterval(() => setHeroState((prev) => (prev + 1) % 3), 3500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmitForm = async () => {
    if (!formData.clientName || !formData.clientContact) {
      return alert("성함과 연락처를 정확히 입력해 주시면 감사하겠습니다.");
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bootcamp_leads"), {
        ...formData,
        status: "상담 대기",
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("접수 중 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
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

      {/* 🎯 플로팅 네비게이션 */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 z-50 animate-fade-in-up">
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-slate-900/40 backdrop-blur-lg border border-white/10 rounded-full shadow-lg hover:bg-slate-900/70 hover:border-white/20 transition-all duration-300"
        >
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
            나만의 비즈니스 수익화 파이프라인을 구축하는 <strong>'바이브 코딩'</strong> 실전 부트캠프.
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

      {/* 🎬 1.5. VSL 홀로그램 쇼케이스 섹션 */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 bg-[#090E17] overflow-hidden flex flex-col items-center border-b border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#3B82F6]/10 rounded-[100%] blur-[150px] pointer-events-none"></div>

        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
            <div className="mb-8 md:mb-12">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-3 block">Director's Message</span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white break-keep leading-tight">
                The Creators AI가 제안하는<br className="hidden sm:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#3B82F6]">비즈니스 자동화의 새로운 패러다임</span>
              </h2>
            </div>

            <div className="relative group w-full mx-auto aspect-video rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.2)] border border-white/10 bg-black transition-all duration-500 hover:shadow-[0_0_60px_rgba(59,130,246,0.3)]">
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/10 to-transparent flex items-center px-4 gap-2 z-20 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/80"></div>
              </div>
              <iframe 
                className="absolute inset-0 w-full h-full z-10"
                src="https://www.youtube.com/embed/M7FIvfx5J10?controls=1&rel=0&modestbranding=1" 
                title="The Creators AI VSL" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            <p className="mt-8 text-slate-500 font-medium text-sm md:text-base break-keep">
              * 잠시만 시간을 내어 영상을 시청해 주시면, 저희가 추구하는 교육의 본질과 방향성을 명확히 확인하실 수 있습니다.
            </p>
          </div>
        </FadeInSection>
      </section>

      {/* 🛑 2. 인강 VS 부트캠프 비교표 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 break-keep leading-tight text-slate-900">
                수많은 온라인 코딩 강의,<br className="block sm:hidden"/> 왜 실전 적용에서 멈추게 될까요?
              </h2>
              <p className="text-slate-500 font-medium text-sm md:text-lg break-keep">
                시스템을 구축하고 실제 비즈니스에 연동하는 고도화의 과정에는 수많은 변수가 존재합니다.<br className="hidden md:block"/>
                저희는 영상 너머가 아닌, 현장에서 함께 고민하고 문제를 해결하는 방식을 선택했습니다.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <FadeInSection delay={100}>
              <TiltCard className="h-full">
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 relative h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                    일반적인 온라인 VOD 교육
                  </div>
                  <h3 className="text-xl font-black text-slate-600 mb-6 text-center mt-4">일방향 지식 전달의 한계</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <span className="text-slate-400 font-black mt-0.5">-</span>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">예기치 못한 오류 발생 시 개별적인 해결책을 찾기 어려움</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-slate-400 font-black mt-0.5">-</span>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">정해진 예제 코드를 실습하는 데 그쳐 자사 서비스 적용 한계</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-slate-400 font-black mt-0.5">-</span>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">복잡한 서버 배포 및 도메인 연동 과정에서의 높은 포기율</p>
                    </li>
                  </ul>
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection delay={300}>
              <TiltCard className="h-full">
                <div className="bg-gradient-to-b from-blue-50/50 to-indigo-50/50 p-6 md:p-8 rounded-3xl border border-blue-200 relative shadow-lg transform md:-translate-y-2 h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-md shadow-blue-500/20">
                    The Creators 실전 부트캠프
                  </div>
                  <h3 className="text-xl font-black text-[#3B82F6] mb-6 text-center mt-4">실전 구현과 문제 해결에 집중</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 font-black mt-0.5">✓</span>
                      <p className="text-slate-800 text-sm font-bold leading-relaxed">현장에서 전문가와 함께 원인을 파악하는 실시간 트러블슈팅</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 font-black mt-0.5">✓</span>
                      <p className="text-slate-800 text-sm font-bold leading-relaxed">수강생의 실제 비즈니스 모델에 맞춘 CRM 시스템 맞춤 설계</p>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 font-black mt-0.5">✓</span>
                      <p className="text-slate-800 text-sm font-bold leading-relaxed">배포부터 실제 운영 환경 세팅까지 수료 후 즉시 활용 가능</p>
                    </li>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black break-keep leading-tight text-white">
                빠르게 변화하는 AI 시대,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 font-bold">기술에 이끌려 갈 것인가, 기술을 리드할 것인가.</span>
              </h2>
              <p className="text-slate-400 mt-4 text-sm md:text-base">새로운 도약과 생산성의 혁신을 준비하는 분들과 함께합니다.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <FadeInSection delay={100}>
              <TiltCard className="h-full">
                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full">
                  <div className="text-2xl mb-4 opacity-80">🏢</div>
                  <h3 className="text-xl font-bold text-white mb-2 break-keep">비용 효율화가 필요한 사업자 · 스타트업</h3>
                  <p className="text-slate-400 text-sm leading-relaxed break-keep">
                    불필요한 외주 개발과 대행 리소스를 줄이고, 아이디어를 즉시 자체 시스템으로 구현하세요. 자동화된 업무 프로세스를 통해 조직 전체의 생산성과 매출 밀도를 높일 수 있습니다.
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection delay={200}>
              <TiltCard className="h-full">
                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full">
                  <div className="text-2xl mb-4 opacity-80">💼</div>
                  <h3 className="text-xl font-bold text-white mb-2 break-keep">성장을 주도하는 마케터 · 실무 기획자</h3>
                  <p className="text-slate-400 text-sm leading-relaxed break-keep">
                    개발 부서와의 소통 지연으로 아쉬웠던 기획을 직접 실현해 보세요. 프롬프트를 활용해 세일즈 퍼널과 랜딩페이지를 신속하게 구축하며 실무 경쟁력을 한 차원 높일 수 있습니다.
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection delay={300}>
              <TiltCard className="h-full">
                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full">
                  <div className="text-2xl mb-4 opacity-80">📸</div>
                  <h3 className="text-xl font-bold text-white mb-2 break-keep">안정적인 수익 모델을 찾는 크리에이터</h3>
                  <p className="text-slate-400 text-sm leading-relaxed break-keep">
                    채널의 트래픽을 일회성 조회수에 머물게 하지 마세요. 잠재 고객의 데이터를 수집하고 자연스러운 전환을 유도하는 '나만의 수익화 자동화 시스템'을 기획하는 방법을 안내합니다.
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection delay={400}>
              <TiltCard className="h-full">
                <div className="bg-slate-800/30 p-8 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors h-full">
                  <div className="text-2xl mb-4 opacity-80">🌱</div>
                  <h3 className="text-xl font-bold text-white mb-2 break-keep">새로운 커리어를 준비하는 도약자</h3>
                  <p className="text-slate-400 text-sm leading-relaxed break-keep">
                    코딩에 대한 진입 장벽을 낮추어 드립니다. 그동안 쌓아오신 각자의 도메인 경험과 노하우를 AI 기술과 결합하여, 유의미한 비즈니스 가치로 치환하는 여정을 돕겠습니다.
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 👨‍🏫 4. 강사진 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Expert Facilitators</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-keep">
                안전하고 확실한 성장을 돕기 위해,<br/>각 분야의 현업 전문가들이 함께합니다.
              </h2>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FadeInSection delay={100}>
              <TiltCard className="h-full">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative h-full transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-600 font-medium">LS</div>
                    <div>
                      <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Media & Content</span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">이상원 디렉터</h3>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6 flex-1 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-medium text-slate-500">실무 배경</span>
                      <span className="font-bold text-slate-700">뉴미디어 채널 기획 및 운영</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-medium text-slate-500">주요 레퍼런스</span>
                      <span className="font-bold text-slate-700">채널 합산 25만 구독자 확보</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="font-medium text-slate-500">교육 포커스</span>
                      <span className="font-bold text-slate-800">효율적인 오가닉 트래픽 확보</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl">
                    "시스템 구축만큼이나 중요한 것은 적절한 유입 전략입니다. 현업에서 직접 채널을 성장시키며 체득한 오가닉 트래픽 확보와 콘텐츠 기획의 인사이트를 투명하게 공유합니다."
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection delay={300}>
              <TiltCard className="h-full">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#3B82F6]/30 flex flex-col relative h-full transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-xl text-blue-600 font-medium">JS</div>
                    <div>
                      <span className="text-[#3B82F6] text-[10px] font-bold tracking-wider uppercase">Vibe Coding</span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">정시후 디렉터</h3>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6 flex-1 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-medium text-slate-500">실무 배경</span>
                      <span className="font-bold text-slate-700">비즈니스 기획 및 전략 수립</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-medium text-slate-500">강의 철학</span>
                      <span className="font-bold text-slate-700">비개발자의 눈높이에 맞춘 소통</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="font-medium text-slate-500">교육 포커스</span>
                      <span className="font-bold text-slate-800">퍼널 기획 및 AI 툴 연동 실무</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed break-keep bg-blue-50/50 p-4 rounded-xl">
                    "복잡한 개발 언어 대신, 기획자의 언어로 AI와 소통하는 방법을 안내합니다. 비개발자도 충분히 비즈니스 자동화 모델을 설계하고 구현할 수 있도록 섬세하게 돕겠습니다."
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection delay={500}>
              <TiltCard className="h-full">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative h-full transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl text-slate-600 font-medium">LG</div>
                    <div>
                      <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Technical Support</span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">임건 테크리드</h3>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6 flex-1 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-medium text-slate-500">실무 배경</span>
                      <span className="font-bold text-slate-700">다년간의 IT 플랫폼 개발</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="font-medium text-slate-500">부트캠프 역할</span>
                      <span className="font-bold text-slate-700">실시간 이슈 대응 및 멘토링</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="font-medium text-slate-500">교육 포커스</span>
                      <span className="font-bold text-slate-800">안정적인 배포 환경 구축</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl">
                    "기초적인 오류부터 복잡한 서버 연동까지, 기술적인 허들에서 수강생분들이 좌절하지 않도록 든든한 가이드 역할을 수행하겠습니다. 구현의 완성도를 높이는 데 집중합니다."
                  </p>
                </div>
              </TiltCard>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 🚀 5. 수료 후의 변화 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10 md:mb-16">
              <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Roadmap</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-keep leading-tight">
                4주 후, 비즈니스를 바라보는 시야가 달라집니다.
              </h2>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <FadeInSection delay={100}>
              <div className="p-6 md:p-8 rounded-3xl border border-slate-100 bg-slate-50 flex gap-4 items-start h-full">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-slate-600 shrink-0 border border-slate-200">1</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-2">실무 중심 AI 리터러시</h4>
                  <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">일반적인 활용을 넘어, 툴의 한계를 이해하고 자사 업무에 맞게 조율하는 실질적인 프롬프트 작성 역량을 기릅니다.</p>
                </div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <div className="p-6 md:p-8 rounded-3xl border border-slate-100 bg-slate-50 flex gap-4 items-start h-full">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-slate-600 shrink-0 border border-slate-200">2</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-2">가치 지향적 콘텐츠 기획</h4>
                  <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">단순한 정보 나열을 넘어, 타겟 고객의 공감을 이끌어내고 브랜드의 가치를 전달하는 콘텐츠 기획의 본질을 학습합니다.</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className="p-6 md:p-8 rounded-3xl border border-slate-100 bg-slate-50 flex gap-4 items-start h-full">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-slate-600 shrink-0 border border-slate-200">3</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-2">자기 주도적 시스템 구축</h4>
                  <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">아이디어 단계에 머물렀던 서비스를 웹 또는 앱 형태로 직접 기획하고 배포해 보는 성공적인 사이클을 경험합니다.</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="p-6 md:p-8 rounded-3xl border border-slate-100 bg-slate-50 flex gap-4 items-start h-full">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center font-bold text-slate-600 shrink-0 border border-slate-200">4</div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-2">효율적인 운영 환경 설계</h4>
                  <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">자동화 봇과 데이터 관리 툴을 유기적으로 연동하여, 지속 가능한 비즈니스 운영을 위한 최적의 백엔드 환경을 세팅합니다.</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 🌟 5.5. 소셜 프루프 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#F8FAFC] border-t border-slate-200 overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeInSection>
            <span className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-3 block">Since 2018</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-5 break-keep leading-tight">
              새로운 도전 앞에서의 신중함은 당연합니다.<br className="hidden sm:block"/>
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium break-keep leading-relaxed mb-10 max-w-2xl mx-auto">
              지난 8년간 교육 현장에서 쌓아온 저희의 진정성과 노력의 흔적을 먼저 확인해 보시기 바랍니다.
            </p>

            <div className="flex flex-col items-center justify-center gap-3">
              <a
                href="http://thecreator-mcn.com/bbs/board.php?bo_table=review"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-800 border border-slate-300 rounded-xl font-bold text-sm md:text-base shadow-sm hover:shadow-md hover:border-slate-400 transition-all duration-300"
              >
                <span className="text-slate-400">📝</span> 
                본사 홈페이지에서 누적 수강생 리뷰 확인하기
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
              <p className="text-slate-500 text-xs mt-3 font-medium break-keep">
                * 클릭 시 리뷰 게시판이 새 창으로 열립니다. <br className="block sm:hidden"/>천천히 둘러보신 후, 준비가 되셨을 때 다시 이 창으로 돌아와 주시면 됩니다.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

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

      {/* 🚀 7. 최종 Pricing 및 상담 접수 CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 border-t border-slate-200 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 md:mb-8 break-keep">성장을 향한 여정, 1기 크루로 초대합니다.</h2>
            <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-xl relative max-w-2xl mx-auto">
              <div className="text-slate-500 font-bold mb-2">오프라인 부트캠프 1기 등록</div>
              <div className="text-slate-400 line-through text-base md:text-lg mb-1">정상가 2,200,000원</div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-[#3B82F6] mb-8">990,000<span className="text-lg md:text-xl text-slate-500 font-bold ml-1">원</span></div>
              
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-[#3B82F6] text-white px-4 md:px-8 py-4 md:py-5 rounded-xl text-base md:text-lg font-bold shadow-md hover:bg-blue-600 transition-colors break-keep"
              >
                1기 참여 전 사전 상담 신청하기
              </button>
              <p className="text-slate-500 text-xs md:text-sm mt-5 font-medium break-keep">
                * 긴밀한 소통과 퀄리티 유지를 위해 1기는 10명 소수 정예로 운영됩니다.<br/>
                제출해 주신 연락처로 개별 안내를 도와드리겠습니다.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 💡 상담 접수 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 md:p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto border border-slate-100">
            {!isSuccess && (
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 md:top-6 right-4 md:right-6 w-8 h-8 bg-slate-100 rounded-full font-bold hover:bg-slate-200 text-slate-500 transition-colors">✕</button>
            )}
            
            {!isSuccess ? (
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2 break-keep">사전 상담 신청서</h2>
                <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 break-keep">원활한 소통을 위해 정확한 정보를 기재해 주시면 감사하겠습니다.</p>
                
                <div className="space-y-3 md:space-y-4">
                  <input type="text" placeholder="기업명 또는 브랜드명" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#3B82F6] outline-none text-sm transition-colors" />
                  <input type="text" placeholder="성함 및 직함 (예: 홍길동 대표)" value={formData.clientTitle} onChange={e => handleInputChange('clientTitle', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#3B82F6] outline-none text-sm transition-colors" />
                  <input type="text" placeholder="연락처 (010-0000-0000)" value={formData.clientContact} onChange={e => handleInputChange('clientContact', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#3B82F6] outline-none text-sm transition-colors" />
                  <input type="email" placeholder="이메일 주소" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#3B82F6] outline-none text-sm transition-colors" />
                  
                  <button 
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 bg-[#3B82F6] text-white rounded-xl font-bold text-base hover:bg-blue-600 disabled:bg-slate-300 transition-colors mt-2 md:mt-4"
                  >
                    {isSubmitting ? '접수 중입니다...' : '상담 신청 완료하기'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 md:py-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-[#3B82F6] rounded-full flex items-center justify-center text-xl md:text-2xl mx-auto mb-4 md:mb-6 font-black">✓</div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-3 md:mb-4 break-keep">접수가 완료되었습니다.</h2>
                <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base break-keep">
                  소중한 정보를 남겨주셔서 감사합니다.<br className="hidden sm:block"/>
                  담당자가 내용을 꼼꼼히 확인 후 신속하게 연락드리겠습니다.
                </p>
                
                <div className="space-y-2 md:space-y-3">
                  <a href="https://open.kakao.com/o/sw0Qhz5b" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 h-12 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-sm hover:bg-[#FADA0A] transition-colors">
                    💬 카카오톡 채널로 바로 문의하기
                  </a>
                  <a href="tel:051-633-3812" className="w-full flex items-center justify-center gap-2 h-12 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                    📞 유선으로 문의하기 (051-633-3812)
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