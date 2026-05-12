'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// 💡 파이어베이스 연동 필수 부품 보존
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function BootcampSalesPage() {
  const [heroState, setHeroState] = useState(0);
  
  // 💡 상담 접수 폼 관련 상태 관리
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
      return alert("성함과 연락처는 필수 입력 사항입니다.");
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
      alert("접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#3B82F6] selection:text-white relative font-sans break-keep">
      
      {/* 🚀 1. 히어로 섹션 (유지) */}
      <header className="relative pt-20 pb-16 md:pt-24 md:pb-20 px-4 md:px-6 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl mb-6 md:mb-8 inline-block animate-pulse w-full sm:w-auto shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <p className="font-bold text-xs md:text-base leading-snug">⚠️ 앞선 진단기에서 확인하신 매월 새어나가는 막대한 인건비 누수,</p>
            <p className="text-[10px] md:text-sm mt-1">The Creators AI 부트캠프가 지금 즉시 완벽하게 틀어막아 드립니다.</p>
          </div>
          <br className="hidden md:block"/>
          <span className="inline-block py-1 px-4 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs md:text-sm mb-4 md:mb-6 border border-blue-500/30 tracking-widest uppercase shadow-sm">
            The Creators AI Bootcamp 1st
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tighter break-keep">
            개발자 채용할 돈으로,<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#3B82F6] to-indigo-400 text-transparent bg-clip-text">마케팅에 투자하십시오.</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-8 md:mb-10 font-medium max-w-2xl mx-auto leading-relaxed break-keep">
            코드 한 줄 몰라도 괜찮습니다. AI와 대화하며 단 4주 만에<br className="hidden md:block"/>
            수많은 고객 DB를 쓸어 담는 <strong>'바이브 코딩'</strong> 실전 부트캠프.
          </p>

          <div className="w-full max-w-3xl mx-auto bg-[#0B1120] rounded-2xl p-1 md:p-2 shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-slate-700 relative h-56 sm:h-64 md:h-96 overflow-hidden">
            <div className={`absolute inset-0 bg-[#0c0c0c] p-4 sm:p-6 md:p-8 text-left font-mono transition-opacity duration-500 flex flex-col justify-center ${heroState === 0 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="text-rose-500 mb-1 md:mb-2 font-bold text-sm sm:text-lg md:text-xl">⨯ Error: Frontend Build failed</div>
              <div className="text-slate-400 mb-1 text-xs sm:text-sm md:text-base">&gt; Wait for Developer's schedule...</div>
              <div className="text-rose-400 mb-1 text-xs sm:text-sm md:text-base">⚠ Estimated delay: 3 weeks.</div>
              <div className="text-slate-500 mt-2 md:mt-4 text-xs sm:text-sm animate-pulse">Losing potential customers...</div>
            </div>
            <div className={`absolute inset-0 bg-[#0c0c0c] p-4 sm:p-6 md:p-8 text-left font-mono transition-opacity duration-500 flex flex-col justify-center border-2 border-[#3B82F6] ${heroState === 1 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="text-[#3B82F6] mb-2 md:mb-3 font-bold text-sm sm:text-lg md:text-xl">✨ CEO Vibe Coding Agent Activated</div>
              <div className="text-emerald-400 mb-1 text-xs sm:text-sm md:text-base">✓ Bypassing manual code...</div>
              <div className="text-emerald-400 mb-1 text-xs sm:text-sm md:text-base">✓ Generative AI structuring Sales Funnel.</div>
              <div className="text-blue-300 mt-2 md:mt-4 text-xs sm:text-sm font-bold">Deploying Lead Collection Dashboard...</div>
            </div>
            <div className={`absolute inset-0 bg-[#0F172A] p-3 sm:p-4 md:p-6 transition-opacity duration-700 flex flex-col text-left ${heroState === 2 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">
                <h3 className="text-white font-black text-sm sm:text-lg md:text-xl tracking-tighter">AI AUTOMATION CRM</h3>
                <span className="bg-[#3B82F6] text-white px-3 py-1 rounded text-[8px] md:text-[10px] font-bold animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]">Live Leads +34</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 flex-1 overflow-hidden relative">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#1E293B] rounded-lg md:rounded-xl p-2 md:p-3 shadow-sm border border-slate-700 h-16 md:h-20 flex flex-col justify-center">
                    <div className="text-[8px] md:text-[10px] font-bold text-emerald-400 mb-1">결제 대기 | 92점</div>
                    <div className="text-[10px] md:text-xs font-black text-white">익명 고객 {Math.floor(Math.random() * 1000) + 1000}님</div>
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F172A] to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🛑 2. [인포그래픽] 인강 VS 부트캠프 비교표 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 break-keep leading-tight">
              코딩 VOD 강의 결제해 놓고,<br className="block sm:hidden"/> <span className="text-red-500">에러 창</span> 앞에서 포기하셨습니까?
            </h2>
            <p className="text-slate-500 font-medium text-sm md:text-lg break-keep">
              AI가 짜준 코드를 내 서버에 올리고 결제 시스템을 붙이는 '고도화의 순간'.<br className="hidden md:block"/>
              초보자는 절대 온라인 영상만 보고 이 디버깅의 벽을 넘을 수 없습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* 인강의 한계 */}
            <div className="bg-red-50/50 p-6 md:p-8 rounded-3xl border border-red-100 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                대량 살포형 온라인 강의
              </div>
              <h3 className="text-xl font-black text-red-600 mb-6 text-center mt-4">"팔고 나면 끝"</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="text-red-500 font-black">❌</span>
                  <p className="text-slate-700 text-sm font-medium">에러가 나도 물어볼 곳 없이 구글링만 며칠째</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-500 font-black">❌</span>
                  <p className="text-slate-700 text-sm font-medium">내 비즈니스 로직은커녕 예제 코드 따라치기 급급</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-500 font-black">❌</span>
                  <p className="text-slate-700 text-sm font-medium">결국 서버 배포 실패하고 "코딩은 개발자에게" 포기</p>
                </li>
              </ul>
            </div>

            {/* 오프라인 부트캠프의 위력 */}
            <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-6 md:p-8 rounded-3xl border-2 border-[#3B82F6] relative shadow-xl transform md:-translate-y-2">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-blue-500/30">
                The Creators 오프라인 부트캠프
              </div>
              <h3 className="text-xl font-black text-[#3B82F6] mb-6 text-center mt-4">"끝까지 멱살 잡고 캐리합니다"</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="text-blue-500 font-black">✅</span>
                  <p className="text-slate-800 text-sm font-bold">막히는 즉시 마스터 군단이 투입되는 실시간 디버깅</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-blue-500 font-black">✅</span>
                  <p className="text-slate-800 text-sm font-bold">남의 예제가 아닌 '내 사업의 CRM 시스템' 직접 구축</p>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-blue-500 font-black">✅</span>
                  <p className="text-slate-800 text-sm font-bold">도메인 연결부터 배포까지 현장에서 완벽하게 세팅 완료</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 3. [고도화된 카피] 수강 타겟 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Target Audience</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black break-keep leading-tight">
              AI가 내 밥그릇을 뺏을까 두려우십니까?<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AI를 부리는 1%의 포식자로 만들어 드립니다.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-[#3B82F6]/50 transition-all">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">🏢</div>
              <h3 className="text-xl font-black text-white mb-2 break-keep">압도적 격차를 원하는 사업자 · 스타트업</h3>
              <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                외주 개발사와 대행사에 쏟아붓던 '인건비 폭탄'을 완벽히 제거하십시오. 24시간 잠들지 않는 AI 영업팀을 세팅하여 1인 기업으로도 10인분의 매출을 폭발시킵니다.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-indigo-400/50 transition-all">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">💼</div>
              <h3 className="text-xl font-black text-white mb-2 break-keep">가치를 증명할 마케터 · 실무자 · N잡러</h3>
              <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                개발자 일정에 끌려다니는 기획은 끝났습니다. 코딩을 몰라도 프롬프트 하나로 세일즈 퍼널을 직접 뽑아내는 '슈퍼 인재'로 거듭나 연봉의 자릿수를 바꾸십시오.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-pink-400/50 transition-all">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">📸</div>
              <h3 className="text-xl font-black text-white mb-2 break-keep">트래픽을 현금으로 바꿀 크리에이터</h3>
              <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                조회수만 높은 채널은 속 빈 강정입니다. 들어온 트래픽을 잠재 고객 DB로 쓸어 담아 자동 결제까지 이어지게 만드는 '수익화 자동화 파이프라인'을 직접 설계하십시오.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-emerald-400/50 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">🌱</div>
              <h3 className="text-xl font-black text-white mb-2 break-keep">새 챕터를 준비하는 퇴직자 · 경단녀</h3>
              <p className="text-slate-400 text-sm leading-relaxed break-keep font-medium">
                바이브 코딩은 기술이 아닌 '경험'의 영역입니다. 당신이 살아오며 쌓은 연륜과 노하우를 가장 강력한 비즈니스 무기로 번역해 주는 새로운 눈을 띄워드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 👨‍🏫 4. [인포그래픽] 최강의 강사진 스탯 기반 프로필 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#F4F6FA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">Avengers Masters</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-keep">당신을 마스터로 이끌어 줄<br/>각 분야 최고의 실전 전문가</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 이상원 강사 프로필 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 flex flex-col transform transition hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🎬</div>
                <div>
                  <span className="text-red-600 text-[10px] font-black tracking-widest uppercase bg-red-50 px-2 py-1 rounded-md">Media Marketing</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">이상원</h3>
                </div>
              </div>
              <div className="space-y-3 mb-6 flex-1 relative z-10">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-500">보유 채널 합계</span>
                  <span className="text-sm font-black text-slate-800">25만 구독자</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-500">인증 마크</span>
                  <span className="text-sm font-black text-slate-800">유튜브 실버버튼</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-bold text-slate-500">핵심 역량</span>
                  <span className="text-sm font-black text-red-600">바이럴 트래픽 폭발</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl font-medium relative z-10">
                "퍼널이 완벽해도 유입이 없으면 죽은 시스템입니다. 25만 구독자를 맨땅에서 모아본 실전 크리에이터의 팩트 기반 콘텐츠 바이럴 전략을 꽂아드립니다."
              </p>
            </div>

            {/* 정시후 강사 프로필 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl border-2 border-[#3B82F6] flex flex-col transform transition hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🧠</div>
                <div>
                  <span className="text-[#3B82F6] text-[10px] font-black tracking-widest uppercase bg-blue-50 px-2 py-1 rounded-md">Vibe Coding / Plan</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">정시후</h3>
                </div>
              </div>
              <div className="space-y-3 mb-6 flex-1 relative z-10">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-500">수강생 변화</span>
                  <span className="text-sm font-black text-slate-800">전원 코딩 마스터</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-500">강의 철학</span>
                  <span className="text-sm font-black text-slate-800">철저한 초보자 눈높이</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-bold text-slate-500">핵심 역량</span>
                  <span className="text-sm font-black text-[#3B82F6]">가성비 세일즈 퍼널</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed break-keep bg-blue-50/50 p-4 rounded-xl font-medium relative z-10">
                "저 역시 코딩을 몰랐던 평범한 초보였습니다. 개발자의 복잡한 언어가 아닌, 오직 CEO의 언어로 AI를 통제하여 수익 시스템을 기획하는 본질을 전수합니다."
              </p>
            </div>

            {/* 임건 강사 프로필 */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 flex flex-col transform transition hover:-translate-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💻</div>
                <div>
                  <span className="text-indigo-600 text-[10px] font-black tracking-widest uppercase bg-indigo-50 px-2 py-1 rounded-md">Full-Stack Dev</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">임건</h3>
                </div>
              </div>
              <div className="space-y-3 mb-6 flex-1 relative z-10">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-500">출신 배경</span>
                  <span className="text-sm font-black text-slate-800">엘리트 게임/플랫폼 개발</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-500">부트캠프 역할</span>
                  <span className="text-sm font-black text-slate-800">무한 디버깅 해결사</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-bold text-slate-500">핵심 역량</span>
                  <span className="text-sm font-black text-indigo-600">안전한 백엔드 구축</span>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed break-keep bg-slate-50 p-4 rounded-xl font-medium relative z-10">
                "AI가 짠 코드의 숨은 구멍은 천재 해커의 눈으로 막아야 합니다. 프론트엔드의 화려함을 넘어, 고객 데이터가 결제까지 안전하게 도달하는 기술적 뼈대를 책임집니다."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 5. [시각화] 수료 후의 압도적 변화 로드맵 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <span className="text-[#3B82F6] font-black tracking-widest text-sm uppercase mb-2 block">After 4 Weeks</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 break-keep">
              전문가 의존도 0%<br/>내 손으로 돌리는 현금 창출 엔진
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm bg-slate-50 flex gap-4 items-start">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl shrink-0">1️⃣</div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-2">완벽한 AI 리터러시</h4>
                <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">단순히 ChatGPT를 쓰는 수준을 넘어, 내 업무 환경에 맞게 AI를 완벽하게 조련하는 프롬프트 본질을 장착합니다.</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm bg-slate-50 flex gap-4 items-start">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl shrink-0">2️⃣</div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-2">트래픽을 부르는 콘텐츠</h4>
                <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">기획부터 편집까지, AI가 생성한 결과물이 실제 잠재 고객을 유입시키는 바이럴 파급력을 갖게 됩니다.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm bg-slate-50 flex gap-4 items-start">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl shrink-0">3️⃣</div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-2">바이브 코딩 자가 구현력</h4>
                <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">외주사에 수천만 원을 주지 않아도, 내 머릿속 아이디어를 어플과 웹 서비스로 즉시 구현하여 배포합니다.</p>
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm bg-slate-50 flex gap-4 items-start">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xl shrink-0">4️⃣</div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-2">AI 에이전트 군단 세팅</h4>
                <p className="text-slate-600 text-sm break-keep leading-relaxed font-medium">내 사업을 24시간 돕는 AI 마케팅 팀장, CS 비서 등 파트별 '가상의 직원'을 시스템에 완벽히 연동시킵니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Risk Reversal (환불 보장) */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white break-keep">결제가 망설여지시나요?</h2>
            <p className="text-sm md:text-xl text-slate-400 font-medium break-keep">당연합니다. 그래서 저희가 모든 리스크를 짊어지겠습니다.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-[#3B82F6]/50 p-6 md:p-10 rounded-2xl md:rounded-3xl text-center mb-10 md:mb-16 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <h3 className="text-lg md:text-2xl font-black text-[#3B82F6] mb-3 md:mb-4">💯 100% 만족도 환불 보장제</h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base max-w-2xl mx-auto break-keep">
              첫 1주 차 강의를 들어보시고, "이건 내 비즈니스에 적용할 수 없겠다"라는 생각이 조금이라도 드신다면 묻지도 따지지도 않고 전액 환불해 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 🚀 7. 최종 Pricing 및 상담 접수 CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#F4F6FA] border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 md:mb-8 break-keep">진짜 마스터가 될 마지막 기회입니다.</h2>
          <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-2 border-[#3B82F6] shadow-2xl relative max-w-2xl mx-auto">
            <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white px-6 py-2 rounded-full font-black text-xs md:text-sm tracking-widest shadow-lg whitespace-nowrap uppercase">
              1기 단 10명 한정 스페셜 티켓
            </div>
            <div className="text-slate-400 line-through text-lg md:text-2xl font-bold mt-4 mb-2">정가 2,200,000원</div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3B82F6] mb-6 md:mb-8 tracking-tighter">990,000<span className="text-lg md:text-2xl text-slate-600 ml-1 md:ml-2 tracking-normal">원</span></div>
            
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-slate-900 text-white px-4 md:px-8 py-5 md:py-6 rounded-xl md:rounded-2xl text-base sm:text-lg md:text-2xl font-black shadow-xl hover:bg-[#3B82F6] hover:scale-105 transition-all break-keep leading-tight"
            >
              📝 1기 합류 전 우선 상담 접수하기
            </button>
            <p className="text-slate-500 text-xs md:text-sm mt-4 font-bold break-keep">* 담당자가 확인 후 순차적으로 연락을 드립니다.</p>
          </div>
        </div>
      </section>

      {/* 💡 상담 접수 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 md:p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
            {!isSuccess && (
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 md:top-6 right-4 md:right-6 w-8 h-8 bg-slate-100 rounded-full font-bold hover:bg-slate-200 text-slate-500">✕</button>
            )}
            
            {!isSuccess ? (
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 break-keep">부트캠프 상담 접수</h2>
                <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 break-keep">입력해주신 연락처로 개별 안내를 도와드립니다.</p>
                
                <div className="space-y-3 md:space-y-4">
                  <input type="text" placeholder="기업명 또는 브랜드명" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-sm md:text-base" />
                  <input type="text" placeholder="성함 및 직함 (예: 홍길동 대표)" value={formData.clientTitle} onChange={e => handleInputChange('clientTitle', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-sm md:text-base" />
                  <input type="text" placeholder="연락처 (010-0000-0000)" value={formData.clientContact} onChange={e => handleInputChange('clientContact', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-sm md:text-base" />
                  <input type="email" placeholder="이메일" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#3B82F6] outline-none text-sm md:text-base" />
                  
                  <button 
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 bg-[#3B82F6] text-white rounded-xl font-bold text-base md:text-lg hover:bg-blue-600 disabled:bg-slate-400 transition-colors mt-2 md:mt-4"
                  >
                    {isSubmitting ? '접수 중...' : '상담 신청 완료하기'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 md:py-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-2xl md:text-3xl mx-auto mb-4 md:mb-6">✓</div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 break-keep">접수가 완료되었습니다!</h2>
                <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base break-keep">
                  담당자가 내용을 확인 후 빠르게 연락드리겠습니다.<br className="hidden sm:block"/>
                  가장 빠른 답변을 원하시면 아래 채널로 직접 문의해 주세요.
                </p>
                
                <div className="space-y-2 md:space-y-3">
                  <a href="https://open.kakao.com/o/sw0Qhz5b" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 h-12 md:h-14 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-sm md:text-lg hover:bg-[#FADA0A] transition-colors">
                    💬 카카오톡 채널로 문의하기
                  </a>
                  <a href="tel:051-633-3812" className="w-full flex items-center justify-center gap-2 h-12 md:h-14 bg-slate-800 text-white rounded-xl font-bold text-sm md:text-lg hover:bg-slate-900 transition-colors">
                    📞 담당자 직통 전화 (051-633-3812)
                  </a>
                </div>
                
                <button onClick={() => {setIsFormOpen(false); setIsSuccess(false);}} className="mt-6 md:mt-8 text-slate-400 font-bold hover:text-slate-600 underline text-sm md:text-base">
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