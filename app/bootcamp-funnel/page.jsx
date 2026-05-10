'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import StorybookModal from './components/StorybookModal';

export default function BootcampFunnelPage() {
  const [url, setUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return alert("진단할 채널 URL을 입력해주세요.");
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
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const report = analysisResult?.publicReport;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white">
      {isStorybookOpen && <StorybookModal onClose={() => setIsStorybookOpen(false)} />}

      {/* 🚀 Phase 1: 후킹 섹션 */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-slate-300 text-sm font-semibold tracking-wider">The Creators AI 독자 기술 엔진 가동 중</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">
            콘텐츠는 훌륭한데,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">왜 매출로 이어지지 않을까요?</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-3 justify-center max-w-3xl mx-auto bg-slate-900/50 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl mt-12">
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="분석할 URL을 입력하세요" className="flex-1 bg-slate-800/80 border-none p-5 rounded-xl text-white outline-none" />
            <button onClick={handleAnalyze} disabled={isLoading} className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold hover:bg-blue-500 disabled:bg-slate-700 transition-all">
              {isLoading ? '정밀 진단 중...' : '손해비용 분석하기'}
            </button>
          </div>
        </div>
      </section>

      {/* 📊 분석 리포트 영역 */}
      {report && (
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 animate-fade-in-up -mt-10 relative z-20">
          
          <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2">AI 정밀 진단 리포트</h2>
              <p className="text-slate-500 font-medium">데이터 엔진이 당신의 브랜드를 정확히 식별했습니다.</p>
            </div>

            {/* 💡 AI 브랜드 인식 프로필 (여기에 이름이 나옵니다) */}
            <div className="bg-indigo-900 rounded-3xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 grid md:grid-cols-3 gap-6">
                <div>
                  <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest block mb-1">Recognized Brand</span>
                  <div className="text-xl font-black">{report.brandName}</div>
                </div>
                <div>
                  <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest block mb-1">Representative</span>
                  <div className="text-sm font-bold opacity-90">{report.representative}</div>
                </div>
                <div>
                  <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest block mb-1">Sector</span>
                  <div className="text-sm font-bold opacity-90">{report.category}</div>
                </div>
              </div>
            </div>

            {/* 차트 & 누수비용 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Analysis Radar</span>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="내 채널" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="#818cf8" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-red-50 p-8 rounded-3xl border border-red-100 flex flex-col justify-center text-center">
                <span className="text-red-400 font-bold text-xs uppercase tracking-widest mb-2">Monthly Leakage</span>
                <span className="text-slate-600 font-bold">예상 월간 누수 비용</span>
                <h3 className="text-4xl md:text-5xl font-black text-red-600 tracking-tighter my-2">
                  {report.monthlyLeakageCost.toLocaleString()}<span className="text-2xl font-bold ml-1">원</span>
                </h3>
                <p className="text-sm text-red-500 font-medium mt-2">{report.painPoint}</p>
              </div>
            </div>

            {/* 💡 [수정됨] SWOT 분석 4개 카드 모두 출력 */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-800 px-2">채널 심층 SWOT 분석</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                  <div className="text-blue-600 font-black text-lg mb-1">S <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Strength</span></div>
                  <p className="text-slate-700 text-sm font-medium">{report.swot.s}</p>
                </div>
                <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl">
                  <div className="text-rose-600 font-black text-lg mb-1">W <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Weakness</span></div>
                  <p className="text-slate-700 text-sm font-medium">{report.swot.w}</p>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                  <div className="text-emerald-600 font-black text-lg mb-1">O <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Opportunity</span></div>
                  <p className="text-slate-700 text-sm font-medium">{report.swot.o}</p>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl">
                  <div className="text-amber-600 font-black text-lg mb-1">T <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Threat</span></div>
                  <p className="text-slate-700 text-sm font-medium">{report.swot.t}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-100">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest block mb-2">AI Identity Analysis</span>
              <p className="text-slate-700 font-bold leading-relaxed">{report.identity}</p>
            </div>
          </section>

          {/* 퍼널 스토리북 및 CTA */}
          <section className="bg-white rounded-[2rem] shadow-lg p-10 text-center relative overflow-hidden border border-slate-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">왜 이런 막대한 손해가 발생할까요?</h2>
            <button onClick={() => setIsStorybookOpen(true)} className="bg-indigo-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg">📖 퍼널 스토리북 열람</button>
          </section>

          <section className="bg-slate-900 text-white p-12 text-center rounded-[2.5rem] shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">문제를 알았다면,<br/>이제 끊어낼 시간입니다.</h2>
            <Link href="/bootcamp-sales" className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl px-12 py-5 rounded-2xl hover:scale-105 transition-all">
              🚀 부트캠프 상세 안내 보기
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}