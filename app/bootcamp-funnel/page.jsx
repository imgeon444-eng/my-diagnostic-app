'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
// 💡 [복구 완료] 어제 만든 스토리북 컴포넌트 불러오기
import StorybookModal from './components/StorybookModal';

export default function BootcampFunnelPage() {
  const router = useRouter();
  const resultRef = useRef(null);

  // 1. 상태 관리
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [instaData, setInstaData] = useState({ brandName: '', followerCount: '', mainContent: '', coreProblem: '' });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 💡 [복구 완료] 스토리북 모달 열림/닫힘 상태 관리
  const [isStorybookOpen, setIsStorybookOpen] = useState(false);

  // 2. 분석 완료 후 결과창으로 자동 스크롤
  useEffect(() => {
    if (analysisResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [analysisResult]);

  // 3. 분석 실행 함수
  const handleAnalyze = async () => {
    if (platform !== 'instagram' && !url.trim()) return alert("진단할 채널 URL을 입력해주세요.");
    if (platform === 'instagram' && (!instaData.brandName || !instaData.followerCount)) return alert("정확한 진단을 위해 브랜드명과 대략적인 팔로워 수를 입력해주세요.");
    
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
        setIsLoading(false);
        return;
      }
      setAnalysisResult(data);
    } catch (error) {
      alert("서버 통신 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const report = analysisResult?.publicReport;

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white font-sans break-keep">
      
      {/* =========================================
          🏢 1층 로비: 플랫폼 선택 및 데이터 입력
          ========================================= */}
      <section className="relative bg-slate-950 pt-20 pb-28 md:pt-24 md:pb-32 px-4 md:px-6 overflow-hidden min-h-[80vh] flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-6 md:mb-8">
            <span className="text-slate-300 text-xs md:text-sm font-semibold tracking-wider">The Creators AI 100% 팩트 진단 엔진</span>
          </div>
          
          {/* 💡 [모바일 최적화] 폴드 화면에서도 글자가 예쁘게 유지되도록 반응형 텍스트 및 break-keep 적용 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight break-keep">
            환각 없는 진짜 데이터를 위한<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"> 분석 플랫폼 선택</span>
          </h1>
          
          {/* 💡 [모바일 최적화] 버튼이 좁은 화면에서는 세로로, 넓은 화면에서는 가로로 배치됨 */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mb-8 w-full max-w-md sm:max-w-none mx-auto">
            <button onClick={() => setPlatform('youtube')} className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold transition-all text-sm md:text-base ${platform === 'youtube' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-100 sm:scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>유튜브 (URL)</button>
            <button onClick={() => setPlatform('web')} className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold transition-all text-sm md:text-base ${platform === 'web' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-100 sm:scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>웹사이트 (URL)</button>
            <button onClick={() => setPlatform('instagram')} className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold transition-all text-sm md:text-base ${platform === 'instagram' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30 scale-100 sm:scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>인스타그램 (직접입력)</button>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-2xl text-left">
            {platform !== 'instagram' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-slate-300 font-medium text-xs md:text-sm mb-4 break-keep leading-relaxed">
                  {platform === 'youtube' 
                    ? '📺 구글 공식 API 및 URL 구조를 분석하여 채널의 객관적 지표를 추출하고 정밀 진단합니다.' 
                    : '🌐 웹사이트의 구조를 스캔하여 트래픽 대비 세일즈 퍼널의 빈틈과 누수를 진단합니다.'}
                </p>
                <input 
                  type="text" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder={platform === 'youtube' ? "유튜브 채널 URL (예: https://youtube.com/@...)" : "웹사이트 URL 입력"} 
                  className="w-full bg-slate-800 border border-slate-700 p-4 md:p-5 rounded-xl text-white text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
            )}

            {platform === 'instagram' && (
              <div className="space-y-3 md:space-y-4 animate-fade-in">
                <p className="text-slate-300 font-medium text-xs md:text-sm mb-4 break-keep leading-relaxed">
                  🔒 인스타그램의 보안 정책을 존중합니다. 환각 없는 진짜 분석을 위해 채널의 객관적 팩트를 직접 입력해 주십시오.
                </p>
                <input type="text" value={instaData.brandName} onChange={(e) => setInstaData({...instaData, brandName: e.target.value})} placeholder="브랜드명 또는 계정명 (필수)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" value={instaData.followerCount} onChange={(e) => setInstaData({...instaData, followerCount: e.target.value})} placeholder="대략적인 팔로워 수 (예: 1.5만명) (필수)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" value={instaData.mainContent} onChange={(e) => setInstaData({...instaData, mainContent: e.target.value})} placeholder="핵심 콘텐츠 주제 (예: 승무원 면접 코칭)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" value={instaData.coreProblem} onChange={(e) => setInstaData({...instaData, coreProblem: e.target.value})} placeholder="현재 느끼는 가장 큰 고민 (예: 결제 저조)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            )}

            <button 
              onClick={handleAnalyze} 
              disabled={isLoading} 
              className="w-full mt-6 md:mt-8 bg-blue-600 text-white px-6 py-4 md:py-5 rounded-xl font-bold text-base md:text-lg hover:bg-blue-500 disabled:bg-slate-700 transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20"
            >
              {isLoading ? '팩트 기반 정밀 진단 중...' : '데이터 기반 진단 시작'}
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          📊 2층 결과창: 분석 리포트 출력
          ========================================= */}
      <div ref={resultRef} className="scroll-mt-10"> 
        {report && (
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-8 md:space-y-10 animate-fade-in-up">
            <section className="bg-white p-6 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 break-keep">AI 정밀 진단 리포트</h2>
                <p className="text-slate-500 text-sm md:text-base font-medium break-keep">데이터 엔진이 추출한 팩트 기반 결과입니다.</p>
              </div>

              {/* 💡 정보 바 모바일 최적화 (격자 간격 및 글자 깨짐 방지) */}
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 mb-8 md:mb-10 text-white grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 shadow-xl">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase">Brand</span>
                  <span className="text-lg md:text-xl font-black break-all">{report.brandName}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase">Rep</span>
                  <span className="text-xs md:text-sm font-bold opacity-80 break-all">{report.representative}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-[10px] md:text-xs font-bold uppercase">Sector</span>
                  <span className="text-xs md:text-sm font-bold opacity-80 break-all">{report.category}</span>
                </div>
              </div>

              {/* 차트 & 비용 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                <div className="bg-slate-950 rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px]">
                  <span className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-4">Analysis Radar</span>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-100 text-center flex flex-col justify-center">
                  <span className="text-slate-500 font-bold text-xs md:text-sm break-keep">월간 예상 누수 비용</span>
                  <h3 className="text-3xl md:text-5xl font-black text-red-600 my-3 md:my-4 tracking-tighter">{report.monthlyLeakageCost?.toLocaleString()}원</h3>
                  <p className="text-xs md:text-sm text-red-500 font-bold break-keep leading-relaxed">{report.painPoint}</p>
                </div>
              </div>

              {/* SWOT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
                {Object.entries(report.swot).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200">
                    <span className="text-blue-600 font-black text-lg md:text-xl mr-2">{key.toUpperCase()}</span>
                    <p className="text-slate-700 text-xs md:text-sm mt-2 font-medium leading-relaxed break-keep">{val}</p>
                  </div>
                ))}
              </div>

              {/* 💡 [복구 완료] 스토리북 진입 버튼 */}
              <div className="bg-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 md:mb-10 text-center flex flex-col items-center">
                <h4 className="text-lg md:text-xl font-black mb-2 break-keep">이 채널의 문제점을 어떻게 해결할까요?</h4>
                <p className="text-slate-400 text-xs md:text-sm mb-6 break-keep">AI가 분석한 맞춤형 퍼널 스토리북을 확인해 보세요.</p>
                <button 
                  onClick={() => setIsStorybookOpen(true)}
                  className="w-full md:w-auto bg-slate-700 border border-slate-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  📖 내 채널 퍼널 스토리북 열람하기
                </button>
              </div>

              <div className="pt-6 md:pt-8 mb-8 md:mb-10 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">AI Identity Analysis</p>
                <p className="text-slate-800 text-sm md:text-base font-bold leading-relaxed break-keep">{report.identity}</p>
              </div>

              {/* =========================================
                  🚪 3층 출구: 랜딩 페이지로 이동 (라우팅)
                  ========================================= */}
              <div className="bg-indigo-600 rounded-3xl p-6 md:p-10 text-white shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <h4 className="text-xl md:text-2xl font-black mb-3 md:mb-4 relative z-10 break-keep leading-tight">💡 월 {report.monthlyLeakageCost?.toLocaleString()}원의 누수를<br className="block sm:hidden"/> 지금 막으시겠습니까?</h4>
                <p className="text-indigo-100 text-xs md:text-sm mb-6 md:mb-8 font-medium relative z-10 break-keep">The Creators AI 부트캠프에서 당신의 채널을 자동화 수익 엔진으로 바꿔드립니다.</p>
                <button 
                  onClick={() => router.push('/bootcamp-sales')}
                  className="w-full md:w-auto relative z-10 bg-white text-indigo-600 px-6 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95 break-keep"
                >
                  부트캠프 커리큘럼 확인 및 신청하기 →
                </button>
              </div>

            </section>
          </div>
        )}
      </div>

      {/* 💡 [복구 완료] 스토리북 모달 렌더링 */}
      {isStorybookOpen && report && (
        <StorybookModal 
          report={report} 
          onClose={() => setIsStorybookOpen(false)} 
        />
      )}

    </div>
  );
}