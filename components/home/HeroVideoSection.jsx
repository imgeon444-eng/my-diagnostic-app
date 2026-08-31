'use client';

import Link from 'next/link';

export default function HeroVideoSection({ onOpenDiagnostic }) {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 🎬 배경: 선명하고 밝은 고화질 시네마틱 AI 코어 루프 비디오 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-100 opacity-90 md:opacity-95"
          src="/videos/Glowing_AI_core_in_landscape_202608310749.mp4"
        />
        {/* 영상의 선명함을 유지하면서 상하 경계만 자연스럽게 이어주는 비네팅 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090E17]/60 via-transparent to-[#090E17]/95"></div>
      </div>

      {/* 🔮 센터 앰비언트 글로우 조명 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[350px] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
        
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-cyan-400/50 text-cyan-300 text-xs md:text-sm font-black tracking-widest uppercase mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-md animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          The Creators AI · Next-Gen Business Builder
        </div>

        {/* 메인 헤드라인 (그림자 효과로 가독성 100% 확보) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-6 animate-fade-in-up drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          비즈니스의 모든 병목을 파괴하고,<br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300 drop-shadow-[0_0_35px_rgba(59,130,246,0.8)]">
            24시간 잠들지 않는 무인 오피스
          </span>
          를 구축합니다.
        </h1>

        {/* 서브 카피 (반투명 글래스 패널로 가독성 극대화) */}
        <div className="max-w-3xl mx-auto mb-10 animate-fade-in-up">
          <div className="bg-black/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <p className="text-slate-100 text-sm sm:text-base md:text-lg font-medium leading-relaxed text-balance">
              단순한 지식 강의가 아닙니다. <strong className="text-white font-black">AI 마케팅 체급 진단</strong>부터 <strong className="text-cyan-300 font-black">URL 비용 누수 분석</strong>, 그리고 <strong className="text-blue-300 font-black">실시간 CRM 칸반보드</strong>까지 대표님의 사업에 실물 시스템을 직접 이식합니다.
            </p>
          </div>
        </div>

        {/* CTA 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up">
          <button
            onClick={onOpenDiagnostic}
            className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-black text-base sm:text-lg shadow-[0_0_35px_rgba(59,130,246,0.7)] hover:shadow-[0_0_55px_rgba(59,130,246,1)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-cyan-400/50 group"
          >
            <svg className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>1분 마케팅 체급 진단하기</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">무료</span>
          </button>

          <Link
            href="/synergy-test"
            className="w-full sm:w-auto h-14 sm:h-16 px-7 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md shadow-xl"
          >
            <span>🧠 AI 메타인지 진단하기</span>
            <span className="text-xs text-slate-400">→</span>
          </Link>

          <Link
            href="/bootcamp-sales"
            className="w-full sm:w-auto h-14 sm:h-16 px-7 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/40 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-xl"
          >
            <span>🔥 4주 부트캠프 알아보기</span>
          </Link>
        </div>

        {/* 💻 투명 글래스모피즘 라이브 시스템 관제 스트립 */}
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10 text-left">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">THE CREATORS AI AGENTIC SYSTEM</h3>
                <p className="text-xs text-slate-300 font-medium">Gemini 2.5 Flash 기반 실시간 무인 비즈니스 오피스 가동 중</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              STATUS: ONLINE (24/7)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5">
            <div className="bg-slate-900/70 border border-white/10 p-3.5 rounded-2xl text-left">
              <div className="text-xl sm:text-2xl font-black text-white">1,420+</div>
              <div className="text-[11px] text-slate-300 font-bold mt-0.5">기업 AI 퍼널 분석</div>
            </div>
            <div className="bg-slate-900/70 border border-white/10 p-3.5 rounded-2xl text-left">
              <div className="text-xl sm:text-2xl font-black text-cyan-300">430% ↑</div>
              <div className="text-[11px] text-slate-300 font-bold mt-0.5">평균 세일즈 ROI</div>
            </div>
            <div className="bg-slate-900/70 border border-white/10 p-3.5 rounded-2xl text-left">
              <div className="text-xl sm:text-2xl font-black text-blue-400">Gemini 2.5</div>
              <div className="text-[11px] text-slate-300 font-bold mt-0.5">최신 추론 엔진</div>
            </div>
            <div className="bg-slate-900/70 border border-white/10 p-3.5 rounded-2xl text-left">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">0 sec</div>
              <div className="text-[11px] text-slate-300 font-bold mt-0.5">CRM 실시간 동기화</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
