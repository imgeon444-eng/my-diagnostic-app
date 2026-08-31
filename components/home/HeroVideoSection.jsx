'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function HeroVideoSection({ onOpenDiagnostic }) {
  const [activeTab, setActiveTab] = useState('core'); // 'core' (로컬 영상) | 'youtube' (소개 영상)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('Yp2VP2oFKrk');
  const videoRef = useRef(null);

  const openVideo = (videoId = 'Yp2VP2oFKrk') => {
    setSelectedVideoId(videoId);
    setIsVideoModalOpen(true);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* 🎬 배경 앰비언트 비디오 (대표님이 추가하신 타이틀 영상 루프) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none overflow-hidden opacity-25 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover blur-[40px] scale-110"
          src="/videos/Glowing_AI_core_in_landscape_202608310749.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090E17]/60 via-[#090E17]/80 to-[#090E17]" />
      </div>

      {/* 🔮 배경 글로우 조명 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse z-0" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs md:text-sm font-black tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          The Creators AI · Next-Gen Business Builder
        </div>

        {/* 메인 헤드라인 */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-6 animate-fade-in-up">
          비즈니스의 모든 병목을 파괴하고,<br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.4)]">
            24시간 잠들지 않는 무인 오피스
          </span>
          를 구축합니다.
        </h1>

        {/* 서브 카피 */}
        <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-10 text-balance animate-fade-in-up">
          단순한 지식 강의가 아닙니다. <strong className="text-white">AI 마케팅 체급 진단</strong>부터 <strong className="text-cyan-300">URL 비용 누수 분석</strong>, 그리고 <strong className="text-blue-400">실시간 CRM 칸반보드</strong>까지 대표님의 사업에 실물 시스템을 직접 이식합니다.
        </p>

        {/* CTA 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-in-up">
          <button
            onClick={onOpenDiagnostic}
            className="w-full sm:w-auto h-14 sm:h-16 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-base sm:text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_45px_rgba(59,130,246,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-blue-400/40 group"
          >
            <svg className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>1분 마케팅 체급 진단하기</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">무료</span>
          </button>

          <button
            onClick={() => openVideo('Yp2VP2oFKrk')}
            className="w-full sm:w-auto h-14 sm:h-16 px-7 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md shadow-lg"
          >
            <div className="w-8 h-8 rounded-full bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span>소개 영상 시청하기</span>
          </button>
        </div>

        {/* 🎬 시네마틱 비디오 쇼케이스 컨테이너 */}
        <div className="relative max-w-5xl mx-auto rounded-[2.5rem] p-2.5 sm:p-4 bg-gradient-to-b from-blue-500/20 via-slate-800/50 to-transparent border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl group">
          
          {/* 상단 브라우저 스타일 바 & 탭 전환 */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/80 rounded-t-2xl gap-3 mb-2">
            
            {/* 좌측 상태 뱃지 */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                THE CREATORS AI ENGINE
              </span>
            </div>

            {/* 우측 탭 전환 버튼 */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1 w-full sm:w-auto justify-center">
              <button
                onClick={() => setActiveTab('core')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'core'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 AI 비주얼 코어
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'youtube'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ▶️ 부트캠프 소개 영상
              </button>
            </div>
          </div>

          {/* 비디오 프레임 */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-inner">
            {activeTab === 'core' ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
                src="/videos/Glowing_AI_core_in_landscape_202608310749.mp4"
              />
            ) : (
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/Yp2VP2oFKrk?controls=1&rel=0&modestbranding=1"
                title="The Creators AI 비즈니스 시스템 소개"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* 비디오 하단 캡션 */}
          <div className="mt-3 px-3 py-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span className="font-bold text-slate-300">
              💡 {activeTab === 'core' ? 'The Creators AI 차세대 에이전틱 비즈니스 엔진 비주얼' : 'The Creators AI 4주 실전 부트캠프 인터뷰 및 실제 구동 화면'}
            </span>
            <Link
              href="/bootcamp-sales"
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              부트캠프 커리큘럼 보기 →
            </Link>
          </div>
        </div>

        {/* 📊 핵심 신뢰 지표 (Trust Metrics) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-white">1,420+</div>
            <div className="text-xs text-slate-400 font-bold mt-1">기업 AI 퍼널 분석 완료</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300">430% ↑</div>
            <div className="text-xs text-slate-400 font-bold mt-1">도입 기업 평균 ROI</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-blue-400">Gemini 2.5</div>
            <div className="text-xs text-slate-400 font-bold mt-1">실시간 정밀 추론 엔진</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">24/7 Live</div>
            <div className="text-xs text-slate-400 font-bold mt-1">무인 CRM 파이프라인</div>
          </div>
        </div>

      </div>

      {/* 팝업 비디오 모달 (소개 영상 팝업용) */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
