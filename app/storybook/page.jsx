'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// SVG 아이콘 컴포넌트들
const SvgIcon = ({ d, className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} dangerouslySetInnerHTML={{ __html: d }} />
);

const ChevronLeft = ({className}) => <SvgIcon className={className} d='<polyline points="15 18 9 12 15 6"></polyline>' />;
const ChevronRight = ({className}) => <SvgIcon className={className} d='<polyline points="9 18 15 12 9 6"></polyline>' />;
const BookOpen = ({className}) => <SvgIcon className={className} d='<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>' />;
const Target = ({className}) => <SvgIcon className={className} d='<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>' />;
const TrendingUp = ({className}) => <SvgIcon className={className} d='<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>' />;
const Cpu = ({className}) => <SvgIcon className={className} d='<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>' />;
const Lightbulb = ({className}) => <SvgIcon className={className} d='<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line>' />;
const CheckCircle = ({className}) => <SvgIcon className={className} d='<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>' />;
const Play = ({className}) => <SvgIcon className={className} d='<polygon points="5 3 19 12 5 21 5 3"></polygon>' />;
const Menu = ({className}) => <SvgIcon className={className} d='<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>' />;

const CHAPTERS = [
  { id: 'intro', title: '1. 패러다임 전환', icon: BookOpen },
  { id: 'funnel', title: '2. 맞춤 퍼널 설계', icon: Target },
  { id: 'nurture', title: '3. 맥락적 육성', icon: Lightbulb },
  { id: 'auto', title: '4. 마케팅 자동화', icon: Cpu },
  { id: 'growth', title: '5. 그로스해킹', icon: TrendingUp }
];

const SLIDES = [
  { chapterId: 'intro', type: 'cover', title: "퍼널마케팅 비밀공식", subtitle: "1%의 한계를 깨는 자동판매 시스템", description: "설득을 넘어 '증명'으로, 데이터 기반 맞춤형 마케팅 설계" },
  { chapterId: 'intro', type: 'comparison', title: "사냥꾼 vs 농사꾼 마케팅", left: { title: "사냥꾼 마케팅", items: ["매일 새로운 트래픽 의존", "처음 본 고객에게 당장 판매 강요", "단기적 이익, 높은 광고비 피로도"] }, right: { title: "농사꾼 마케팅", items: ["유용한 가치로 잠재고객 확보", "신뢰 관계를 쌓아 자연스러운 구매 유도", "장기적 고객 생애 가치 극대화"] } },
  { chapterId: 'intro', type: 'content', title: "전환의 강을 건너다", text: "첫 방문자가 구매에 이르기까지 건너야 하는 '전환의 강'. 퍼널(Funnel)은 이 과정을 단계별로 쪼개어 고객을 안전하게 안내하는 징검다리입니다.", points: ["유입 (Traffic)", "잠재고객 획득 (Lead)", "육성 (Nurturing)", "전환 (Sales)"] },
  { chapterId: 'funnel', type: 'cards', title: "유입 경로별 맥락 해석", cards: [{ title: "우연한 발견 (SNS)", desc: "가벼운 터치와 시각적 흥미로 호기심 유발" }, { title: "정보 탐색 (유튜브/블로그)", desc: "구체적인 문제 해결과 깊이 있는 정보 습득 기대" }, { title: "명확한 의도 (검색 광고)", desc: "즉각적인 솔루션과 가치 제안 필수" }] },
  { chapterId: 'funnel', type: 'content', title: "리드 설계: 가치 있는 만남", text: "모든 고객은 같은 문으로 들어오지 않습니다. 유입 경로에 맞춘 다각화된 랜딩페이지가 필요합니다. 첫술에 팔려 하지 말고, 연락처를 얻기 위한 미끼를 던지세요.", points: ["무료 진단 테스트 제공", "비밀 노하우 PDF 가이드북", "경로별 맞춤형 카피라이팅"] },
  { chapterId: 'nurture', type: 'quote', title: "설득의 시대는 끝났다", quote: "설득하려 하지 마라, 증명하라.", author: "데이터 기반 마케팅의 핵심" },
  { chapterId: 'nurture', type: 'content', title: "왜 우리를 선택해야 하는가?", text: "정보가 넘쳐나는 시대, 화려한 카피보다 중요한 것은 객관적 증명입니다. 고객 스스로 우리를 선택할 수밖에 없는 명분을 쥐어주세요.", points: ["본질적 차별점 부각", "압도적인 Before & After", "공신력 있는 수치와 데이터"] },
  { chapterId: 'nurture', type: 'cards', title: "고객 데이터 분류", cards: [{ title: "행동 데이터", desc: "페이지 체류 시간, 오픈율 등" }, { title: "관심사 기반", desc: "고객이 반응한 콘텐츠 주제" }, { title: "유입 채널", desc: "검색, SNS, 광고 등 최초 유입" }] },
  { chapterId: 'auto', type: 'cover', title: "나만의 24시간 우편배달부", subtitle: "마케팅 자동화 (Automation)", description: "세그먼트된 고객의 맥락에 맞는 1:1 맞춤 메시지를 적시에 자동 발송하는 시스템" },
  { chapterId: 'auto', type: 'comparison', title: "시스템과 인사이트", left: { title: "AI Automation", items: ["24시간 지치지 않는 실행력", "정확한 타이밍 발송", "단순 반복 작업의 자동화"] }, right: { title: "Human Insight", items: ["고객 심리를 꿰뚫는 기획", "변별력 있는 맥락 설계", "A/B 테스트를 통한 방향 제시"] } },
  { chapterId: 'growth', type: 'content', title: "그로스해킹: 끊임없는 개선", text: "퍼널은 한 번 만들고 끝나는 것이 아닙니다. 각 구간의 데이터를 정밀하게 측정하여 병목 구간을 찾아내야 합니다.", points: ["핵심 지표(KPI) 설정", "이탈 구간 진단", "맥락 맞춤 A/B 테스트"] },
  { chapterId: 'growth', type: 'content', title: "1Day Action Plan", text: "지금 당장 비즈니스에 적용해 볼 수 있는 4단계 액션 플랜입니다.", points: ["주요 유입 경로 3가지 정의", "유입 고객의 가장 큰 결핍 도출", "거부할 수 없는 제안(미끼) 기획", "첫 번째 자동 발송 메시지 작성"] }
];

export default function StorybookPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const slide = SLIDES[currentSlide];
  const totalSlides = SLIDES.length;

  const handlePageChange = (newIndex) => {
    if (newIndex >= 0 && newIndex < totalSlides && newIndex !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(newIndex);
        setIsTransitioning(false);
      }, 250);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handlePageChange(currentSlide + 1);
      if (e.key === 'ArrowLeft') handlePageChange(currentSlide - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'cover':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-4 md:p-6 bg-cyan-500/10 rounded-full mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <Target className="w-12 h-12 md:w-16 md:h-16 text-cyan-400" />
            </div>
            <span className="text-xs md:text-sm font-black tracking-widest text-cyan-400 uppercase mb-3 px-3 py-1 bg-cyan-900/30 rounded-full border border-cyan-500/30">
              The Creators AI Guide
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 break-keep">{slide.title}</h1>
            <h2 className="text-xl md:text-2xl text-cyan-300 font-bold mb-6 break-keep">{slide.subtitle}</h2>
            <p className="text-base md:text-xl text-slate-300 max-w-2xl leading-relaxed break-keep font-medium">{slide.description}</p>
          </div>
        );
      case 'comparison':
        return (
          <div className="flex flex-col h-full w-full justify-center px-4">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-8 md:mb-12 text-center break-keep">{slide.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-slate-800/60 p-6 md:p-8 rounded-3xl border border-slate-700 backdrop-blur-md">
                <h3 className="text-xl md:text-2xl font-bold text-rose-400 mb-4 md:mb-6">{slide.left.title}</h3>
                <ul className="space-y-3 md:space-y-4">
                  {slide.left.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-slate-300 text-sm md:text-base font-medium break-keep">
                      <span className="mr-3 text-rose-400 mt-1">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/90 p-6 md:p-8 rounded-3xl border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md">
                <h3 className="text-xl md:text-2xl font-bold text-cyan-300 mb-4 md:mb-6">{slide.right.title}</h3>
                <ul className="space-y-3 md:space-y-4">
                  {slide.right.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-slate-100 text-sm md:text-base font-bold break-keep">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 mr-3 text-cyan-400 shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'cards':
        return (
          <div className="flex flex-col h-full w-full justify-center px-4">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-8 md:mb-12 text-center md:text-left break-keep">{slide.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {slide.cards.map((card, idx) => (
                <div key={idx} className="bg-slate-800/80 p-6 md:p-8 rounded-3xl border border-slate-700 flex flex-col items-start hover:border-cyan-500/50 transition-colors shadow-lg">
                  <div className="text-2xl md:text-4xl font-black text-cyan-500/40 mb-3 md:mb-4">0{idx + 1}</div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-4 break-keep">{card.title}</h3>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed break-keep font-medium">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'quote':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 md:px-12">
            <h2 className="text-xl md:text-3xl font-bold text-cyan-300 mb-8 md:mb-16 break-keep">{slide.title}</h2>
            <blockquote className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8 relative break-keep">
              <span className="text-cyan-500/30 text-5xl md:text-8xl absolute -top-6 -left-6 md:-top-8 md:-left-12">"</span>
              {slide.quote}
              <span className="text-cyan-500/30 text-5xl md:text-8xl absolute -bottom-10 -right-4 md:-bottom-16 md:-right-8">"</span>
            </blockquote>
            <p className="text-base md:text-xl text-slate-400 mt-8 font-medium">— {slide.author}</p>
          </div>
        );
      case 'content':
      default:
        return (
          <div className="flex flex-col h-full w-full justify-center px-4">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 md:mb-8 text-center md:text-left break-keep">{slide.title}</h2>
            <p className="text-base md:text-xl text-slate-300 leading-relaxed mb-8 md:mb-12 max-w-4xl text-center md:text-left break-keep font-medium">
              {slide.text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {slide.points.map((point, idx) => (
                <div key={idx} className="flex items-center bg-slate-800/60 p-4 md:p-6 rounded-2xl border border-slate-700 shadow-md">
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mr-3 md:mr-4 shrink-0" />
                  <span className="text-sm md:text-base text-slate-100 font-bold break-keep">{point}</span>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden relative selection:bg-cyan-500 selection:text-black">
      
      {/* 🚀 상단 플로팅 네비게이션 */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <button className="md:hidden p-2.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-xl text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="w-5 h-5" />
        </button>
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-black/80 hover:border-cyan-400/50 transition-all duration-300"
        >
          <span className="text-cyan-400 group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-white/90 group-hover:text-white text-xs md:text-sm font-bold tracking-wide">메인으로</span>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <Link 
          href="/bootcamp-sales" 
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] text-xs md:text-sm font-black transition-all hover:scale-105"
        >
          <span>🔥 부트캠프 VIP</span>
        </Link>
      </div>

      {/* 📖 좌측 챕터 사이드바 */}
      <aside className={`fixed md:relative w-72 md:w-80 h-full bg-[#070D18] border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} shrink-0 pt-16 md:pt-0`}>
        <div className="p-6 md:p-8 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-black text-white">FunnelBook</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 font-medium">1.5층 퍼널마케팅 비밀공식</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {CHAPTERS.map((chapter) => {
            const IconComponent = chapter.icon;
            const isActive = slide.chapterId === chapter.id;
            return (
              <button
                type="button"
                key={chapter.id}
                onClick={() => {
                  handlePageChange(SLIDES.findIndex(s => s.chapterId === chapter.id));
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 md:py-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="text-sm md:text-base font-bold text-left">{chapter.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 md:p-6 bg-slate-900/80 m-4 rounded-2xl border border-slate-800">
          <p className="text-xs md:text-sm text-slate-400 mb-2 font-bold">진행률</p>
          <div className="w-full bg-slate-950 rounded-full h-1.5 md:h-2">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 md:h-2 rounded-full transition-all duration-500" style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}></div>
          </div>
          <div className="mt-2 text-right text-[10px] md:text-xs font-bold text-slate-400">{currentSlide + 1} / {totalSlides}</div>
        </div>
      </aside>

      {isMenuOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}

      {/* 📄 메인 슬라이드 뷰어 */}
      <main className="flex-1 flex flex-col relative bg-[#090E17] overflow-hidden min-h-screen">
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-cyan-500/10 rounded-full blur-[100px] md:blur-[140px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-16 relative z-10 overflow-y-auto pt-20 md:pt-16">
          <div className={`w-full max-w-5xl min-h-full flex flex-col justify-center transition-all duration-300 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
            {renderSlideContent()}
          </div>
        </div>

        {/* 하단 슬라이드 조작 네비게이션 바 */}
        <div className="relative h-20 md:h-24 border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl px-4 md:px-12 flex items-center justify-between z-20 shrink-0">
          <button 
            type="button" 
            onClick={() => handlePageChange(currentSlide - 1)} 
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-colors cursor-pointer ${currentSlide === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> 
            <span className="hidden sm:inline">이전 페이지</span><span className="sm:hidden">이전</span>
          </button>

          <div className="flex gap-1.5 md:gap-2">
            {SLIDES.map((_, idx) => (
              <button 
                type="button" 
                key={idx} 
                onClick={() => handlePageChange(idx)}
                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-6 md:w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'w-1.5 md:w-2 bg-slate-700 hover:bg-slate-500'}`} 
              />
            ))}
          </div>

          <button 
            type="button" 
            onClick={() => handlePageChange(currentSlide + 1)} 
            disabled={currentSlide === totalSlides - 1}
            className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold transition-colors cursor-pointer ${currentSlide === totalSlides - 1 ? 'text-slate-600 cursor-not-allowed' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}
          >
            <span className="hidden sm:inline">다음 페이지</span><span className="sm:hidden">다음</span> 
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
