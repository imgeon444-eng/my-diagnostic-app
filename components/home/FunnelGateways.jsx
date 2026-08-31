'use client';

import Link from 'next/link';

export default function FunnelGateways({ onOpenDiagnostic }) {
  return (
    <section id="funnel-gateways" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* 섹션 타이틀 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 font-black tracking-widest text-xs uppercase mb-3 inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            The 3-Tier Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            1층부터 3층까지 완성되는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              AI 비즈니스 수익 파이프라인
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base font-medium">
            현재 대표님의 상황에 맞는 진단을 선택하고, 무인 자동화 시스템으로 비즈니스를 레벨업하세요.
          </p>
        </div>

        {/* 3단 카드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========================================================
              🏢 1층 게이트웨이: 마케팅 & AI 메타인지 진단
              ======================================================== */}
          <div className="group relative bg-[#0F172A]/70 backdrop-blur-2xl border border-blue-500/20 hover:border-blue-500/50 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 left-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-b-full"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-wider uppercase">
                  1층 · Diagnostic Hub
                </span>
                <span className="text-2xl">📋</span>
              </div>

              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-blue-300 transition-colors">
                AI 마케팅 & 메타인지<br/>심층 체급 진단
              </h3>
              
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                현재 마케팅 퍼널의 15개 핵심 지표를 점검하고, 대표님의 AI 도구 통제 역량을 6단계 티어로 판정합니다.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span> 15문항 마케팅 체급 판정 및 ROI 누수 계산기
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span> AI 메타인지 (Intern ~ Grandmaster) 티어링
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">✓</span> 실시간 Gemini 2.5 맞춤 처방 리포트
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={onOpenDiagnostic}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
              >
                마케팅 체급 진단하기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/synergy-test"
                  className="py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-cyan-200 font-bold text-xs transition-all flex items-center justify-center gap-1"
                >
                  🧠 메타인지
                </Link>
                <Link
                  href="/storybook"
                  className="py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold text-xs transition-all flex items-center justify-center gap-1"
                >
                  📖 스토리북
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================
              📊 2층 게이트웨이: 채널 URL 데이터랩 & 누수 비용
              ======================================================== */}
          <div className="group relative bg-[#0F172A]/70 backdrop-blur-2xl border border-indigo-500/20 hover:border-indigo-500/50 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)]">
            <div className="absolute top-0 left-8 w-24 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-b-full"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-black tracking-wider uppercase">
                  2층 · Data Lab
                </span>
                <span className="text-2xl">📊</span>
              </div>

              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-indigo-300 transition-colors">
                채널 URL 데이터 해부 &<br/>비용 누수 진단소
              </h3>
              
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                유튜브 채널, 웹사이트, 인스타 URL만 입력하면 AI가 실시간으로 월간 예상 누수 비용과 SWOT을 해부합니다.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> 채널명 및 운영 주체 실시간 AI 역추적
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> 5개 영역 오각형 레이더 차트 분석
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> 맞춤형 인터랙티브 퍼널 스토리북 열람
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/bootcamp-funnel"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2"
              >
                URL 비용 누수 진단하기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>

          {/* ========================================================
              🔥 3층 게이트웨이: 부트캠프 VIP & 실물 시스템 빌딩
              ======================================================== */}
          <div className="group relative bg-[#0F172A]/70 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400/60 rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(34,211,238,0.25)]">
            <div className="absolute top-0 left-8 w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-b-full"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black tracking-wider uppercase">
                  3층 · VIP System Builder
                </span>
                <span className="text-2xl">🔥</span>
              </div>

              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
                The Creators AI 4주 실전<br/>부트캠프 VIP 과정
              </h3>
              
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                공장형 지식 강의가 아닙니다. 대표님의 사업에 24시간 잠들지 않는 무인 세일즈 오피스를 직접 구축해 드립니다.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> 바이브 코딩으로 나만의 웹/진단기 완성
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> MCP & 에이전틱 복수 인공지능 협업망 통제
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> 라이브 CRM & 자동화 알림 파이프라인 완비
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href="/bootcamp-sales"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm transition-all shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2"
              >
                부트캠프 커리큘럼 & 신청
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
