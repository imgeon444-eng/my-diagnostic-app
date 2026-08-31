'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import StorybookModal from './components/StorybookModal';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function BootcampFunnelPage() {
  const router = useRouter();
  const resultRef = useRef(null);

  // 1. 상태 관리
  const [platform, setPlatform] = useState('youtube'); 
  const [url, setUrl] = useState('');
  const [instaData, setInstaData] = useState({ brandName: '', followerCount: '', mainContent: '', coreProblem: '' });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);

  // 2. 자동 스크롤
  useEffect(() => {
    if (analysisResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [analysisResult]);

  // 3. 분석 실행
  const handleAnalyze = async () => {
    if (platform !== 'instagram' && !url.trim()) return alert("진단할 채널 URL을 입력해주세요.");
    if (platform === 'instagram' && (!instaData.brandName || !instaData.followerCount)) return alert("정확한 진단을 위해 브랜드명과 팔로워 수를 입력해주세요.");
    
    setIsLoading(true);
    setAnalysisResult(null);

    const payload = {
      platform,
      targetUrl: platform !== 'instagram' ? url.trim() : null,
      manualData: platform === 'instagram' ? instaData : null
    };

    try {
      const res = await fetch('/api/analyze-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        alert(`🚨 AI 진단 실패: ${data.error}`);
        return;
      }
      setAnalysisResult(data);

      // 🗄️ 2층 데이터랩 어드민 연동: Firestore url_analysis 컬렉션에 자동 기록
      try {
        await addDoc(collection(db, "url_analysis"), {
          platform,
          targetUrl: payload.targetUrl || payload.manualData?.brandName || 'URL 없음',
          publicReport: data.publicReport,
          keyword: data.publicReport?.category || '미분류',
          createdAt: serverTimestamp(),
        });
      } catch (logErr) {
        console.log("url_analysis logging non-blocking:", logErr);
      }
    } catch (error) {
      alert("서버 통신 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const report = analysisResult?.publicReport;

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 font-sans break-keep flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#3B82F6] selection:text-white">
      
      {/* 배경 블러 효과 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* =========================================
          🏢 1층 로비: 미래지향적 딥 네이비 글래스모피즘
          ========================================= */}
      {!report && (
        <div className="w-full max-w-lg bg-[#0F172A]/80 backdrop-blur-3xl border border-blue-500/20 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] p-8 md:p-12 text-center animate-fade-in-up relative z-10">
          
          {/* 브랜드 뱃지 */}
          <div className="mb-8 flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black tracking-widest uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              The Creators AI Engine
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tighter">
            당신의 비즈니스,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">데이터로 해부합니다.</span>
          </h2>

          <p className="text-slate-400 text-sm md:text-base font-medium mb-10 break-keep">
            정확한 AI 진단을 통해 현재의 세일즈 누수 지점을 파악하고, 최적화된 퍼널 마케팅 전략을 도출하세요.
          </p>

          {/* 탭 토글 */}
          <div className="bg-[#0B1120] p-1.5 rounded-2xl flex justify-between mb-8 border border-slate-800 shadow-inner">
            <button 
              onClick={() => setPlatform('youtube')} 
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${platform === 'youtube' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20 border border-red-500/50' : 'text-slate-500 hover:text-slate-300'}`}
            >
              유튜브
            </button>
            <button 
              onClick={() => setPlatform('web')} 
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${platform === 'web' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/50' : 'text-slate-500 hover:text-slate-300'}`}
            >
              웹사이트
            </button>
            <button 
              onClick={() => setPlatform('instagram')} 
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${platform === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-lg shadow-pink-500/20 border border-pink-500/50' : 'text-slate-500 hover:text-slate-300'}`}
            >
              인스타그램
            </button>
          </div>

          {/* 입력 폼 영역 */}
          <div className="space-y-5 mb-10 text-left">
            {platform !== 'instagram' ? (
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Target URL</label>
                <input 
                  type="text" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder={`${platform === 'youtube' ? '유튜브 채널' : '웹사이트'} URL을 입력하세요`} 
                  className="w-full bg-[#0B1120] border border-slate-700 p-5 rounded-2xl text-white text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 shadow-inner" 
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Brand Name</label>
                  <input type="text" value={instaData.brandName} onChange={(e) => setInstaData({...instaData, brandName: e.target.value})} placeholder="브랜드명 또는 계정명" className="w-full bg-[#0B1120] border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600 shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Followers</label>
                    <input type="text" value={instaData.followerCount} onChange={(e) => setInstaData({...instaData, followerCount: e.target.value})} placeholder="예: 1.5만" className="w-full bg-[#0B1120] border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600 shadow-inner" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Topic</label>
                    <input type="text" value={instaData.mainContent} onChange={(e) => setInstaData({...instaData, mainContent: e.target.value})} placeholder="핵심 주제" className="w-full bg-[#0B1120] border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600 shadow-inner" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Core Problem</label>
                  <input type="text" value={instaData.coreProblem} onChange={(e) => setInstaData({...instaData, coreProblem: e.target.value})} placeholder="현재 느끼는 가장 큰 고민" className="w-full bg-[#0B1120] border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600 shadow-inner" />
                </div>
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-4">
            <button 
              onClick={handleAnalyze} 
              disabled={isLoading} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex justify-center items-center gap-2 border border-blue-500/50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  데이터 추출 및 분석 중...
                </>
              ) : 'AI 정밀 진단 시작하기'}
            </button>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={() => router.push('/bootcamp-sales')} className="w-full bg-[#0F172A] border border-slate-700 text-slate-300 py-4 rounded-xl font-bold text-sm hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                부트캠프 알아보기
              </button>
              <a href="tel:051-633-3812" className="w-full flex items-center justify-center bg-[#0F172A] border border-slate-700 text-slate-300 py-4 rounded-xl font-bold text-sm hover:bg-slate-800 hover:text-white transition-all shadow-sm">
                📞 다이렉트 상담
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          📊 2층 결과창 (원본 보존)
          ========================================= */}
      <div ref={resultRef} className="scroll-mt-10 w-full max-w-4xl relative z-10"> 
        {report && (
          <div className="px-2 md:px-0 py-10 md:py-16 space-y-8 animate-fade-in-up">
            <section className="bg-white/5 backdrop-blur-2xl p-6 md:p-12 rounded-[2rem] shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              
              <div className="text-center mb-8 md:mb-12">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black tracking-widest uppercase mb-4 inline-block">Diagnostic Report</span>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-3 break-keep">AI 정밀 진단 리포트</h2>
                <p className="text-slate-400 text-sm md:text-base font-medium break-keep">데이터 엔진이 추출한 팩트 기반 결과입니다.</p>
              </div>

              <div className="bg-black/40 rounded-3xl p-6 md:p-8 mb-8 md:mb-10 text-white grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 border border-white/5">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Brand</span>
                  <span className="text-lg md:text-xl font-black break-all">{report.brandName}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Rep</span>
                  <span className="text-xs md:text-sm font-bold opacity-80 break-all">{report.representative}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">Sector</span>
                  <span className="text-xs md:text-sm font-bold opacity-80 break-all">{report.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                <div className="bg-black/40 rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px] border border-white/5">
                  <span className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-4">Analysis Radar</span>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <Radar name="Score" dataKey="score" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-gradient-to-br from-red-900/20 to-black/40 p-6 md:p-8 rounded-3xl border border-red-500/20 text-center flex flex-col justify-center">
                  <span className="text-red-400 font-bold text-xs md:text-sm break-keep tracking-widest uppercase">월간 예상 누수 비용</span>
                  <h3 className="text-4xl md:text-5xl font-black text-red-500 my-4 md:my-6 tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">{report.monthlyLeakageCost?.toLocaleString()}원</h3>
                  <p className="text-xs md:text-sm text-red-300 font-bold break-keep leading-relaxed opacity-90">{report.painPoint}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
                {Object.entries(report.swot).map(([key, val]) => (
                  <div key={key} className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="text-blue-400 font-black text-xl md:text-2xl mr-3">{key.toUpperCase()}</span>
                    <p className="text-slate-300 text-xs md:text-sm mt-3 font-medium leading-relaxed break-keep">{val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-3xl p-6 md:p-10 border border-blue-500/20 mb-8 md:mb-10 text-center flex flex-col items-center">
                <h4 className="text-xl md:text-2xl font-black text-white mb-3 break-keep">이 채널의 문제점을 어떻게 해결할까요?</h4>
                <p className="text-blue-200 text-sm md:text-base mb-8 break-keep">AI가 분석한 맞춤형 퍼널 스토리북을 확인해 보세요.</p>
                <button 
                  onClick={() => setIsStorybookOpen(true)}
                  className="w-full md:w-auto bg-white text-indigo-900 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 hover:scale-105"
                >
                  📖 내 채널 퍼널 스토리북 열람하기
                </button>
              </div>

              <div className="pt-8 border-t border-white/10 text-center mb-10">
                <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">AI Identity Analysis</p>
                <p className="text-slate-200 text-sm md:text-base font-bold leading-relaxed break-keep px-4">{report.identity}</p>
              </div>

              {/* 3층 출구 */}
              <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-[0_0_40px_rgba(79,70,229,0.3)] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
                <h4 className="text-2xl md:text-3xl font-black mb-4 relative z-10 break-keep leading-tight">💡 월 {report.monthlyLeakageCost?.toLocaleString()}원의 누수를<br className="block sm:hidden"/> 지금 막으시겠습니까?</h4>
                <p className="text-indigo-200 text-sm md:text-base mb-8 md:mb-10 font-medium relative z-10 break-keep">The Creators AI 부트캠프에서 당신의 채널을 자동화 수익 엔진으로 바꿔드립니다.</p>
                <button 
                  onClick={() => router.push('/bootcamp-sales')}
                  className="w-full md:w-auto relative z-10 bg-[#090E17] border border-indigo-400/30 text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black text-base md:text-xl hover:bg-black transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 break-keep"
                >
                  부트캠프 커리큘럼 확인 및 신청하기 →
                </button>
              </div>

            </section>
          </div>
        )}
      </div>

      {isStorybookOpen && report && (
        <StorybookModal report={report} onClose={() => setIsStorybookOpen(false)} />
      )}
    </div>
  );
}