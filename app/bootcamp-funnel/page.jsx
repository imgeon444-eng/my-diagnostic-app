'use client';
import { useState } from 'react';
import Link from 'next/link';
// 💡 스토리북 부품 호출
import StorybookModal from './components/StorybookModal';

export default function BootcampFunnelPage() {
  const [url, setUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return alert("진단할 채널(또는 웹사이트) URL을 입력해주세요.");
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: url }),
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      alert("분석 중 오류가 발생했습니다. URL을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white">
      
      {/* 💡 스토리북 팝업창 */}
      {isStorybookOpen && (
        <StorybookModal onClose={() => setIsStorybookOpen(false)} />
      )}

      {/* 🚀 Phase 1: 하이엔드 후킹 섹션 */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-slate-300 text-sm font-semibold tracking-wider">The Creators AI 독자 기술 엔진 가동 중</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
            콘텐츠는 훌륭한데,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              왜 매출로 이어지지 않을까요?
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium break-keep">
            아무리 열심히 피드를 올리고 광고를 돌려도 밑빠진 독에 물 붓기입니다.<br/>
            URL 단 한 줄로, 당신의 채널에서 매월 증발하고 있는 <strong className="text-white">'치명적 병목 구간'</strong>과 <strong className="text-white">'누수 비용'</strong>을 지금 바로 확인하십시오.
          </p>
          
          <div className="flex flex-col md:flex-row gap-3 justify-center max-w-3xl mx-auto bg-slate-900/50 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl">
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://instagram.com/your_id" 
              className="flex-1 bg-slate-800/80 border-none p-5 rounded-xl text-white text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-600" 
            />
            <button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-500 disabled:bg-slate-700 transition-all whitespace-nowrap shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
            >
              {isLoading ? '정밀 진단 중...' : '손해비용 분석하기'}
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-4 tracking-wide">
            * 입력하신 데이터는 분석 즉시 폐기되며 안전하게 보호됩니다.
          </p>
        </div>
      </section>

      {/* 분석 완료 시 나타나는 하단 퍼널 영역 */}
      {analysisResult && (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-24 animate-fade-in-up -mt-10 relative z-20">
          
          {/* 📊 Phase 1 결과 */}
          <section className="bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-4">AI 정밀 진단 리포트</h2>
              <p className="text-slate-500 font-medium">입력하신 채널의 현재 상태를 스캔한 결과입니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <span className="text-slate-500 font-bold text-sm tracking-widest mb-2 block uppercase">Pain Point</span>
                <h3 className="text-xl font-bold text-slate-800 leading-snug">
                  {analysisResult.painPoint}
                </h3>
              </div>
              <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex flex-col justify-center items-center text-center">
                <span className="text-red-400 font-bold text-sm tracking-widest mb-2 block uppercase">Monthly Leakage</span>
                <span className="text-slate-600 mb-1">예상 월간 누수 비용</span>
                <h3 className="text-4xl font-black text-red-600 tracking-tighter">
                  {analysisResult.monthlyLeakageCost.toLocaleString()}<span className="text-2xl font-bold ml-1">원</span>
                </h3>
              </div>
            </div>
          </section>

          {/* 📖 Phase 2: 퍼널 스토리북 실행 영역 */}
          <section className="bg-white rounded-[2rem] shadow-lg p-10 md:p-14 border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            <span className="text-indigo-600 font-bold text-sm tracking-widest mb-4 block uppercase">Step 2. Solution</span>
            <h2 className="text-3xl font-black text-slate-900 mb-6">
              왜 이런 막대한 손해가 발생할까요?
            </h2>
            <p className="text-slate-500 text-lg mb-10">해답은 고객의 동선을 설계하는 '퍼널(Funnel) 마케팅'에 있습니다.</p>
            
            <div className="bg-slate-50 p-12 md:p-16 rounded-3xl border border-slate-200 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-full shadow-md mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">The Creators AI 독점 가이드</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">밑빠진 독을 수리하고 폭발적인 전환율을 만들어내는 퍼널 마케팅의 비밀 공식을 지금 바로 확인하세요.</p>
              
              <button 
                onClick={() => setIsStorybookOpen(true)}
                className="bg-indigo-600 text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
              >
                📖 무료로 퍼널 스토리북 열람하기
              </button>
            </div>
          </section>

          {/* 🎯 Phase 3: 세일즈 랜딩페이지로 연결되는 Link (에러 해결 지점) */}
          <section className="bg-slate-900 text-white p-12 md:p-16 text-center rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-blue-400 font-bold text-sm tracking-widest mb-4 block uppercase">Step 3. Action</span>
              <h2 className="text-3xl md:text-5xl font-black mt-2 mb-6 tracking-tight">
                문제를 알았다면,<br/>이제 끊어낼 시간입니다.
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                1단계 진단과 2단계 퍼널의 원리를 모두 확인하셨나요?<br/>
                실제 채널을 운영하며 한계에 부딪힌 대표님들을 The Creators AI 부트캠프로 모십니다.
              </p>
              
              {/* 잔존했던 </button> 찌꺼기가 완전히 제거된 깔끔한 Link 구문입니다. */}
              <Link 
                href="/bootcamp-sales"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl px-12 py-5 rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(79,70,229,0.5)]"
              >
                🚀 직접 내 채널 분석받고 부트캠프 상세 안내 보기
              </Link>
              
              <p className="text-sm text-slate-500 mt-6 tracking-wide">
                * 실제 비즈니스/채널 운영자만 한정적으로 모십니다.
              </p>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}