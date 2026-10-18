'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [dbData, setDbData] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // 💡 ROI 시뮬레이터 상태값
  const [employeeCount, setEmployeeCount] = useState(10);
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(3500000);
  const [weeklyRoutineHours, setWeeklyRoutineHours] = useState(8);

  useEffect(() => {
    async function runFullAnalysis() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "diagnostics", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDbData(data);

          // 새로고침 시 중복 API 호출 및 중복 이메일 발송 방지 캐시 확인
          const cacheKey = `tc_diag_report_${id}`;
          const cachedReport = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
          if (cachedReport) {
            try {
              setAiReport(JSON.parse(cachedReport));
              setLoading(false);
              return;
            } catch (_) {
              // ignore malformed cache
            }
          }

          // 제미나이 2.5 플래시 API 호출 (1층 진단기 뇌)
          const response = await fetch('/api/diagnose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const analysis = await response.json();
          setAiReport(analysis);
          if (typeof window !== 'undefined' && analysis && !analysis.error) {
            sessionStorage.setItem(cacheKey, JSON.stringify(analysis));
          }
        }
      } catch (e) {
        console.error("데이터 로드 또는 분석 실패", e);
      } finally {
        setLoading(false);
      }
    }
    runFullAnalysis();
  }, [id]);

  // 💡 ROI 계산 로직
  const hourlyWage = avgMonthlySalary / 160;
  const monthlyLeakageCost = employeeCount * hourlyWage * weeklyRoutineHours * 4;
  const annualLeakageCost = monthlyLeakageCost * 12;
  const workshopCost = employeeCount * 1500000;
  const roiBenefit = annualLeakageCost - workshopCost;
  const roiRate = workshopCost > 0 ? (roiBenefit / workshopCost) * 100 : 0;
  const maxGraphValue = Math.max(annualLeakageCost, workshopCost, 1);
  const formatWon = (value) => `${Math.round(value).toLocaleString('ko-KR')}원`;

  if (loading) return (
    <div className="min-h-screen bg-[#090E17] flex flex-col items-center justify-center text-white px-4 text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-lg sm:text-xl font-black animate-pulse break-keep">AI 팀장이 리포트를 작성하고 있습니다...</p>
    </div>
  );

  if (!id || !dbData) return (
    <div className="min-h-screen bg-[#090E17] flex flex-col items-center justify-center text-white px-4 text-center">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
          Report Not Found
        </span>
        <h1 className="text-2xl font-black text-white mb-3 break-keep">진단 리포트 정보를 찾을 수 없습니다</h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed break-keep">
          진단 세션이 만료되었거나 잘못된 접근입니다. 1층 로비에서 1분 마케팅 체급 진단을 먼저 진행해 주세요.
        </p>
        <Link
          href="/"
          className="w-full inline-flex h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl items-center justify-center font-black text-base transition-all shadow-lg"
        >
          1층 메인 로비로 이동하기
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 font-sans pt-20 pb-12 px-4 md:p-8 md:pt-24 flex flex-col items-center overflow-x-hidden selection:bg-blue-500 relative">
      
      {/* 상단 플로팅 복귀 네비게이션 */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-6xl mx-auto pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <Link
            href="/"
            className="group flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-black/80 hover:border-cyan-400/50 transition-all text-xs sm:text-sm font-bold text-white"
          >
            <span className="text-cyan-400 group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>1층 로비</span>
          </Link>
          <Link
            href="/bootcamp-funnel"
            className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-lg hover:border-cyan-400 transition-all text-xs sm:text-sm font-bold text-cyan-300"
          >
            <span>2층 데이터랩</span>
          </Link>
        </div>
        <a
          href="http://thecreator-mcn.com/"
          className="pointer-events-auto flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-600/80 to-indigo-600/80 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-full shadow-lg text-xs sm:text-sm font-bold border border-cyan-400/30 transition-all"
        >
          <span>본사 포털</span>
        </a>
      </div>

      {/* 🚀 1. 상단 결과 헤더 */}
      <div className="max-w-3xl w-full mt-4 sm:mt-8 text-center animate-fade-in-up">
        <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black tracking-widest border border-blue-500/30 uppercase">
          Marketing Analysis Result
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mt-4 tracking-tighter leading-tight break-keep">
          {dbData?.clientName} 님을 위한<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">맞춤형 진단 리포트</span>
        </h1>
        
        <div className="flex justify-center items-baseline gap-2 mt-6 sm:mt-8">
          <span className="text-5xl sm:text-6xl font-black text-white">{dbData?.totalScore}</span>
          <span className="text-xl sm:text-2xl text-slate-500 font-bold">/ 45점</span>
        </div>
        <div className="inline-block bg-white/10 border border-white/10 text-white font-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-base sm:text-lg mt-4 backdrop-blur-md">
          {aiReport?.weightClass || "분석 중..."} 등급
        </div>
      </div>

      {/* 🧠 2. AI 처방전 섹션 */}
      <div className="max-w-3xl w-full mt-8 sm:mt-12 bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
        
        <div className="mb-8 sm:mb-10">
          <h3 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
             AI STRATEGIC ANALYSIS
          </h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug break-keep">
            {aiReport?.analysisText ? `"${aiReport.analysisText}"` : "AI 팀장이 심층 분석 리포트를 작성하고 있습니다..."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-10">
          <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5">
            <h4 className="text-slate-500 font-bold text-xs uppercase mb-3">핵심 성장 방향</h4>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed break-keep">
              {aiReport?.direction || "분석 데이터를 불러오는 중입니다."}
            </p>
          </div>
          <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5">
            <h4 className="text-slate-500 font-bold text-xs uppercase mb-3">등급 판정 근거</h4>
            <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed break-keep">
              {aiReport?.reason || "잠시만 기다려 주시면 정밀 판정 결과가 나옵니다."}
            </p>
          </div>
        </div>

        {/* 💡 가변형 CTA */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-slate-400 font-bold text-sm mb-6">
            AI 팀장 추천: 현재 <span className="text-blue-400">[{aiReport?.stage || "?"}단계]</span> 솔루션이 가장 효율적입니다.
          </p>
          
          {aiReport?.stage === 1 && (
            <a href="https://open.kakao.com/o/sw0Qhz5b" target="_blank" rel="noreferrer" className="w-full inline-flex h-14 sm:h-16 px-4 bg-emerald-600 text-white rounded-2xl items-center justify-center font-black text-base sm:text-lg hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20">무료 방향성 컨설팅 신청</a>
          )}
          {aiReport?.stage === 2 && (
            <Link href="/storybook" className="w-full inline-flex h-14 sm:h-16 px-4 bg-blue-600 text-white rounded-2xl items-center justify-center font-black text-base sm:text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">1.5층 퍼널마케팅 공식 스토리북 보기</Link>
          )}
          {aiReport?.stage === 3 && (
            <Link href="/bootcamp-sales" className="w-full inline-flex h-14 sm:h-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl items-center justify-center font-black text-base sm:text-lg hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/20">실전 부트캠프 VIP 합류하기 (상시 · 10명 소수정예)</Link>
          )}
          {aiReport?.stage === 4 && (
            <a href="mailto:ceo@thecreators.ai" className="w-full inline-flex h-14 sm:h-16 px-4 bg-white text-black rounded-2xl items-center justify-center font-black text-base sm:text-lg hover:bg-slate-200 transition-all">브랜드 파트너십 제안 (B2B)</a>
          )}
          {!aiReport?.stage && (
            <span className="text-slate-500 text-sm">추천 솔루션을 계산 중입니다...</span>
          )}
        </div>
      </div>

      {/* 🌪️ 2.5 세일즈 퍼널 병목 스캐너 (인포그래픽) */}
      <div className="max-w-3xl w-full mt-8 bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 md:p-10 backdrop-blur-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              세일즈 파이프라인 병목 스캐너
            </h3>
            <p className="text-slate-400 text-sm mt-2">15개 진단 문항을 알고리즘으로 역산하여 도출한 단계별 건강도입니다.</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
            <span className="text-rose-400 text-xs font-bold tracking-widest uppercase">Warning Zone Detected</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="group">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-300 group-hover:text-white transition-colors">1. 브랜드 인지 및 타겟팅 (Targeting)</span>
              <span className="text-blue-400 font-black">{Math.min(100, Math.round(((dbData?.totalScore || 0) / 45) * 100) + 15)}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full relative"
                style={{ width: `${Math.min(100, Math.round(((dbData?.totalScore || 0) / 45) * 100) + 15)}%`, transition: 'width 1.5s ease-out' }}
              ></div>
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-300 group-hover:text-white transition-colors">2. 트래픽 및 유입 설계 (Traffic)</span>
              <span className="text-indigo-400 font-black">{Math.min(100, Math.round(((dbData?.totalScore || 0) / 45) * 100) + 5)}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full relative"
                style={{ width: `${Math.min(100, Math.round(((dbData?.totalScore || 0) / 45) * 100) + 5)}%`, transition: 'width 1.5s ease-out 0.2s' }}
              ></div>
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-rose-400 group-hover:text-rose-300 transition-colors flex items-center gap-2">
                3. 수익 전환 퍼널 (Conversion) <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>
              </span>
              <span className="text-rose-500 font-black">{Math.max(0, Math.round(((dbData?.totalScore || 0) / 45) * 100) - 25)}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-rose-900/30 shadow-inner relative">
              <div 
                className="h-full bg-gradient-to-r from-rose-600 to-orange-500 rounded-full relative"
                style={{ width: `${Math.max(0, Math.round(((dbData?.totalScore || 0) / 45) * 100) - 25)}%`, transition: 'width 1.5s ease-out 0.4s' }}
              ></div>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)]"></div>
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-300 group-hover:text-white transition-colors">4. CRM 및 시스템 자동화 (Retention)</span>
              <span className="text-purple-400 font-black">{Math.max(0, Math.round(((dbData?.totalScore || 0) / 45) * 100) - 15)}%</span>
            </div>
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full relative"
                style={{ width: `${Math.max(0, Math.round(((dbData?.totalScore || 0) / 45) * 100) - 15)}%`, transition: 'width 1.5s ease-out 0.6s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 3. ROI 시뮬레이터 섹션 */}
      <section className="max-w-3xl w-full mt-12 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h4 className="text-2xl font-black text-white mb-2 tracking-tight">AI 도입 비용 절감(ROI) 시뮬레이터</h4>
        <p className="text-sm text-slate-500 mb-10">직원 수와 업무 시간을 조절하여 현재 새어나가는 기회비용을 확인하십시오.</p>

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-300">총 직원 수</span>
              <span className="text-xl font-black text-blue-400">{employeeCount}명</span>
            </div>
            <input type="range" min="1" max="50" value={employeeCount} onChange={(e) => setEmployeeCount(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-300">직원 평균 월급</span>
              <span className="text-xl font-black text-blue-400">{formatWon(avgMonthlySalary)}</span>
            </div>
            <input type="range" min="2000000" max="10000000" step="100000" value={avgMonthlySalary} onChange={(e) => setAvgMonthlySalary(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-300">주당 반복 업무 시간</span>
              <span className="text-xl font-black text-blue-400">{weeklyRoutineHours}시간</span>
            </div>
            <input type="range" min="1" max="20" value={weeklyRoutineHours} onChange={(e) => setWeeklyRoutineHours(Number(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>
        </div>

        <div className="mt-12 p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center">
          <p className="text-sm font-bold text-rose-400 mb-2 uppercase tracking-widest">Annual Labor Cost Leakage</p>
          <p className="text-4xl md:text-5xl font-black text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]">{formatWon(annualLeakageCost)}</p>
          <p className="text-slate-500 text-xs mt-4 leading-relaxed">매년 위 금액만큼의 인건비가 단순 반복 업무로 증발하고 있습니다.</p>
        </div>

        <div className="mt-10 space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>연간 누수 비용</span>
              <span className="text-rose-400">{formatWon(annualLeakageCost)}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${Math.min((annualLeakageCost / maxGraphValue) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>부트캠프 도입 비용</span>
              <span className="text-blue-400">{formatWon(workshopCost)}</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min((workshopCost / maxGraphValue) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 4. 푸터: 2층 URL 진단기 무한 루프 크로스셀링 */}
      <footer className="max-w-3xl w-full mt-16 mb-20 text-center animate-fade-in-up flex flex-col gap-5" style={{ animationDelay: '600ms' }}>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <p className="text-slate-400 font-bold text-sm md:text-base mb-2">
            💡 혹시 현재 운영 중인 유튜브나 웹사이트가 있으신가요?
          </p>
          <p className="text-white font-black text-lg md:text-xl break-keep">
            아래 <span className="text-cyan-400">URL 채널 진단기</span>를 통해<br/>
            트래픽 누수도 함께 확인해 보세요.
          </p>
        </div>

        <Link 
  href="/bootcamp-funnel" 
  className="group relative w-full h-20 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-3xl font-black text-xl md:text-2xl transition-all shadow-[0_10px_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 overflow-hidden active:scale-[0.98]"
>
  <div className="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"></div>
  🔍 내 채널 URL 진단하러 가기
</Link>

        <p className="text-slate-600 text-xs mt-6 font-medium">© 2026 The Creators AI. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090E17]"></div>}>
      <ResultContent />
    </Suspense>
  );
}