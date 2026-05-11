'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function BootcampFunnelPage() {
  const router = useRouter();
  const resultRef = useRef(null);

  // 1. 상태 관리
  const [platform, setPlatform] = useState('youtube'); // youtube, web, instagram
  const [url, setUrl] = useState('');
  const [instaData, setInstaData] = useState({ brandName: '', followerCount: '', mainContent: '', coreProblem: '' });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white font-sans">
      
      {/* =========================================
          🏢 1층 로비: 플랫폼 선택 및 데이터 입력
          ========================================= */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-6 overflow-hidden min-h-[80vh] flex flex-col justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-b from-blue-900/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8">
            <span className="text-slate-300 text-sm font-semibold tracking-wider">The Creators AI 100% 팩트 진단 엔진</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
            환각 없는 진짜 데이터를 위한<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">분석 플랫폼 선택</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button onClick={() => setPlatform('youtube')} className={`px-8 py-4 rounded-xl font-bold transition-all ${platform === 'youtube' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>유튜브 (URL)</button>
            <button onClick={() => setPlatform('web')} className={`px-8 py-4 rounded-xl font-bold transition-all ${platform === 'web' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>웹사이트 (URL)</button>
            <button onClick={() => setPlatform('instagram')} className={`px-8 py-4 rounded-xl font-bold transition-all ${platform === 'instagram' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>인스타그램 (직접입력)</button>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-900/80 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-2xl text-left">
            {platform !== 'instagram' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-slate-300 font-medium text-sm mb-4">
                  {platform === 'youtube' 
                    ? '📺 구글 공식 API 및 URL 구조를 분석하여 채널의 객관적 지표를 추출하고 정밀 진단합니다.' 
                    : '🌐 웹사이트의 구조를 스캔하여 트래픽 대비 세일즈 퍼널의 빈틈과 누수를 진단합니다.'}
                </p>
                <input 
                  type="text" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder={platform === 'youtube' ? "유튜브 채널 URL (예: https://youtube.com/@...)" : "웹사이트 URL 입력"} 
                  className="w-full bg-slate-800 border border-slate-700 p-5 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
            )}

            {platform === 'instagram' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-slate-300 font-medium text-sm mb-4">
                  🔒 인스타그램의 보안 정책을 존중합니다. 환각(거짓) 없는 진짜 분석을 위해 채널의 객관적 팩트를 직접 입력해 주십시오.
                </p>
                <input type="text" value={instaData.brandName} onChange={(e) => setInstaData({...instaData, brandName: e.target.value})} placeholder="브랜드명 또는 계정명 (필수)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" value={instaData.followerCount} onChange={(e) => setInstaData({...instaData, followerCount: e.target.value})} placeholder="대략적인 팔로워 수 (예: 1.5만명) (필수)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" value={instaData.mainContent} onChange={(e) => setInstaData({...instaData, mainContent: e.target.value})} placeholder="핵심 콘텐츠 주제 (예: 승무원 면접 코칭)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" value={instaData.coreProblem} onChange={(e) => setInstaData({...instaData, coreProblem: e.target.value})} placeholder="현재 느끼는 가장 큰 고민 (예: 결제 전환율 저조)" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            )}

            <button 
              onClick={handleAnalyze} 
              disabled={isLoading} 
              className="w-full mt-8 bg-blue-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-blue-500 disabled:bg-slate-700 transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20"
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
          <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 animate-fade-in-up">
            <section className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 mb-2">AI 정밀 진단 리포트</h2>
                <p className="text-slate-500 font-medium">데이터 엔진이 추출한 팩트 기반 결과입니다.</p>
              </div>

              {/* 💡 [핀셋 수정 완료] 정보 바 글자 겹침 방지 (break-all 및 min-w-0 추가) */}
              <div className="bg-slate-900 rounded-3xl p-8 mb-10 text-white grid md:grid-cols-3 gap-8 shadow-xl">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-xs font-bold uppercase">Brand</span>
                  <span className="text-xl font-black break-all">{report.brandName}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-xs font-bold uppercase">Rep</span>
                  <span className="text-sm font-bold opacity-80 break-all">{report.representative}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-blue-400 text-xs font-bold uppercase">Sector</span>
                  <span className="text-sm font-bold opacity-80 break-all">{report.category}</span>
                </div>
              </div>

              {/* 차트 & 비용 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-slate-950 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[320px]">
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Analysis Radar</span>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center flex flex-col justify-center">
                  <span className="text-slate-500 font-bold text-sm">월간 예상 누수 비용</span>
                  <h3 className="text-4xl md:text-5xl font-black text-red-600 my-4 tracking-tighter">{report.monthlyLeakageCost?.toLocaleString()}원</h3>
                  <p className="text-sm text-red-500 font-bold">{report.painPoint}</p>
                </div>
              </div>

              {/* SWOT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {Object.entries(report.swot).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <span className="text-blue-600 font-black text-xl mr-2">{key.toUpperCase()}</span>
                    <p className="text-slate-700 text-sm mt-2 font-medium leading-relaxed">{val}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8 mb-10 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">AI Identity Analysis</p>
                <p className="text-slate-800 font-bold leading-relaxed">{report.identity}</p>
              </div>

              {/* =========================================
                  🚪 3층 출구: 랜딩 페이지로 이동 (라우팅)
                  ========================================= */}
              <div className="bg-indigo-600 rounded-3xl p-10 text-white shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <h4 className="text-2xl font-black mb-4 relative z-10">💡 월 {report.monthlyLeakageCost?.toLocaleString()}원의 누수를 지금 막으시겠습니까?</h4>
                <p className="text-indigo-100 mb-8 font-medium relative z-10">The Creators AI 부트캠프에서 당신의 채널을 자동화 수익 엔진으로 바꿔드립니다.</p>
                <button 
                  onClick={() => router.push('/bootcamp-sales')}
                  className="relative z-10 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95"
                >
                  부트캠프 커리큘럼 확인 및 신청하기 →
                </button>
              </div>

            </section>
          </div>
        )}
      </div>
    </div>
  );
}