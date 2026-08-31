'use client';

import { useState } from 'react';
import Link from 'next/link';

const REVIEWS = [
  {
    id: 'Yp2VP2oFKrk',
    type: 'long',
    badge: 'Long Review',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    title: 'The Creators AI 실전 부트캠프 종합 리뷰',
    speaker: '부트캠프 수료 대표님',
    desc: '아이디어만 있던 사업이 어떻게 4주 만에 24시간 작동하는 무인 세일즈 시스템으로 완성되었는지 생생한 과정을 공개합니다.'
  },
  {
    id: 'UoDxeQg9pTc',
    type: 'short',
    badge: 'Shorts 후기',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    title: '비전공자도 가능했던 무인 오피스 구축',
    speaker: '1인 지식창업가',
    desc: '코딩을 몰라도 바이브 코딩과 제미나이 AI 에이전트로 진짜 작동하는 웹 서비스를 만들어냈습니다.'
  },
  {
    id: 'NPBGbXxhvUU',
    type: 'short',
    badge: '정기 특강',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    title: '매월 정기 무료특강 안내',
    speaker: 'The Creators AI',
    desc: '매월 정기적으로 진행되는 실전 AI 시스템 빌딩 및 무인 자동화 무료 라이브 특강 안내 영상입니다.'
  }
];

export default function VideoReviewGallery() {
  const [activeVideoId, setActiveVideoId] = useState(null);

  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#05080f] border-t border-b border-white/5 relative overflow-hidden">
      
      {/* 백그라운드 조명 */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-3 inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            Sincere Reviews & Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            진짜 시스템을 경험한<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
              참여자들의 솔직한 목소리
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base font-medium">
            화려한 수식어로 포장하지 않습니다. 현업에 직접 파이프라인을 구축하신 대표님들의 생생한 영상입니다.
          </p>
        </div>

        {/* 비디오 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#0B1120] border border-white/10 hover:border-blue-500/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group"
            >
              {/* 비디오 임베드 / 썸네일 영역 */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${review.id}?controls=1&rel=0&modestbranding=1`}
                  title={review.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* 텍스트 설명 영역 */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${review.badgeColor}`}>
                      {review.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{review.speaker}</span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {review.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {review.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-bold">The Creators AI 검증</span>
                  <Link
                    href="/bootcamp-sales"
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                  >
                    사례 더보기 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 💡 안티-학원 매니페스토 배너 */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-900/90 to-blue-950/70 border border-blue-500/30 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative text-center">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-400 rounded-l-[2.5rem]"></div>
          <span className="text-rose-400 font-black tracking-widest text-xs uppercase mb-3 block">
            Our Core Philosophy
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">
            "강의만 듣고 끝나는 학습은 이제 멈추십시오."
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium mb-8">
            누구나 돈만 내면 들을 수 있는 공장형 템플릿 강의는 사양합니다.<br/>
            The Creators AI는 대표님의 실제 사업에 24시간 작동하는 무인 세일즈 파이프라인을 직접 이식하는 <strong>'비즈니스 빌더'</strong>입니다.
          </p>
          <Link
            href="/bootcamp-sales"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 hover:bg-slate-100 font-black text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"
          >
            부트캠프 전체 커리큘럼 확인하기 →
          </Link>
        </div>

      </div>
    </section>
  );
}
