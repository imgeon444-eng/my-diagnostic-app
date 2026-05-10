'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

function ResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(10);
  const [avgMonthlySalary, setAvgMonthlySalary] = useState(3500000);
  const [weeklyRoutineHours, setWeeklyRoutineHours] = useState(8);

  useEffect(() => {
    if (!id) return;
    
    const fetchResult = async () => {
      try {
        const docRef = doc(db, "diagnostics", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.log("데이터가 없습니다.");
        }
      } catch (error) {
        console.error("불러오기 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-blue-500 mb-8"></div>
        <h2 className="text-2xl font-bold text-white tracking-tight">리포트를 생성 중입니다...</h2>
      </div>
    );
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">데이터를 찾을 수 없습니다.</div>;
  }

  // 💡 [수정된 부분] 총점을 기준으로 실시간 등급 텍스트와 솔루션 부여
  let finalGrade = "";
  let solutionTitle = "";
  let solutionDesc = "";

  if (data.totalScore <= 12) {
    finalGrade = "🥉 레벨 1. 마케팅 비기너";
    solutionTitle = "🚨 마케팅 기초 뼈대 구축이 시급합니다.";
    solutionDesc = "현재 타겟 설정과 키워드 전략 등 기본기가 부족한 상태입니다. 밑빠진 독에 물 붓기 식의 광고비 지출을 멈추고, 더크리에이터즈AI의 [기초 실무 교육]을 통해 브랜드의 방향성부터 다시 잡아야 할 골든 타임입니다.";
  } else if (data.totalScore <= 22) {
    finalGrade = "🥈 레벨 2. 퍼포먼스 챌린저";
    solutionTitle = "💡 퍼널 고도화와 전환율 개선이 필요합니다.";
    solutionDesc = "기본적인 마케팅은 진행 중이나, 트래픽이 실제 매출로 이어지는 '전환 연결고리(Funnel)'가 끊어져 있습니다. 매체별 효율을 분석하고 자동화 CRM을 도입하는 [전략 컨설팅]이 가장 필요한 시점입니다.";
  } else {
    finalGrade = "🥇 레벨 3. 하이엔드 마스터";
    solutionTitle = "🚀 대규모 스케일업 파트너십이 가능합니다.";
    solutionDesc = "마케팅에 대한 훌륭한 이해도와 실행력을 갖추고 계십니다. 이제 혼자서 감당하기 힘든 퍼포먼스 마케팅 예산 운용과 하이엔드 브랜딩 콘텐츠 제작을 더크리에이터즈AI와 [파트너십]으로 해결하여 압도적 성장을 이뤄낼 때입니다.";
  }

  const hourlyWage = avgMonthlySalary / 160;
  const monthlyLeakageCost = employeeCount * hourlyWage * weeklyRoutineHours * 4;
  const annualLeakageCost = monthlyLeakageCost * 12;
  const workshopCost = employeeCount * 1500000;
  const roiBenefit = annualLeakageCost - workshopCost;
  const roiRate = workshopCost > 0 ? (roiBenefit / workshopCost) * 100 : 0;
  const maxGraphValue = Math.max(annualLeakageCost, workshopCost, 1);

  const formatWon = (value) => `${Math.round(value).toLocaleString('ko-KR')}원`;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start md:items-center py-0 md:py-10">
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:h-auto md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-fade-in-up">
        
        <header className="px-6 pt-10 pb-6 bg-slate-900 text-white text-center">
          <div className="inline-block bg-white/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
            분석 완료
          </div>
          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            <span className="text-blue-400">{data.clientName || '고객'}</span>님을 위한<br/>맞춤형 진단 리포트
          </h1>
        </header>

        <div className="px-6 py-8 bg-slate-50 border-b border-slate-100 text-center">
          <p className="text-slate-500 font-bold mb-2">마케팅 체급 총점</p>
          <div className="flex justify-center items-baseline gap-2 mb-4">
            <span className="text-5xl font-black text-slate-900">{data.totalScore}</span>
            <span className="text-xl text-slate-400 font-bold">/ 30점</span>
          </div>
          {/* 💡 [수정된 부분] DB 값이 아닌 실시간 계산된 등급(finalGrade)을 바로 출력 */}
          <div className="inline-block bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-lg">
            {finalGrade}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
          <h2 className="text-lg font-extrabold text-blue-600 mb-3">더크리에이터즈AI 솔루션</h2>
          <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug">{solutionTitle}</h3>
          <p className="text-slate-600 leading-relaxed font-medium bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            {solutionDesc}
          </p>
          
          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-2">입력하신 핵심 목표</h4>
            <div className="flex flex-wrap gap-2">
              {data.goals && data.goals.map((g, i) => (
                <span key={i} className="text-sm font-bold bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">{g}</span>
              ))}
            </div>
          </div>

          <section className="mt-8 p-5 bg-white rounded-2xl border border-slate-200">
            <h4 className="text-xl font-extrabold text-slate-900 mb-2">AI 도입 비용 절감(ROI) 시뮬레이터</h4>
            <p className="text-sm text-slate-500 mb-6">
              직원 수, 급여, 반복 업무 시간을 움직여서 지금 새고 있는 인건비를 확인해 보세요.
            </p>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700">직원 수</span>
                  <span className="text-sm font-extrabold text-slate-900">{employeeCount}명</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700">직원 평균 월급</span>
                  <span className="text-sm font-extrabold text-slate-900">{formatWon(avgMonthlySalary)}</span>
                </div>
                <input
                  type="range"
                  min="2000000"
                  max="10000000"
                  step="100000"
                  value={avgMonthlySalary}
                  onChange={(e) => setAvgMonthlySalary(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700">주당 단순 반복 업무 시간</span>
                  <span className="text-sm font-extrabold text-slate-900">{weeklyRoutineHours}시간</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={weeklyRoutineHours}
                  onChange={(e) => setWeeklyRoutineHours(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="mt-7 p-4 bg-rose-50 border border-rose-100 rounded-xl text-center">
              <p className="text-sm font-bold text-rose-500 mb-2">연간 허공에 버려지는 인건비</p>
              <p className="text-4xl font-black text-rose-600">{formatWon(annualLeakageCost)}</p>
            </div>

            <div className="mt-7 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-bold text-slate-700 mb-4">
                더크리에이터즈AI 3일 워크숍(직원당 150만 원) 수강 시 얻게 되는 압도적 투자 수익률(ROI)
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>연간 누수 비용</span>
                    <span>{formatWon(annualLeakageCost)}</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min((annualLeakageCost / maxGraphValue) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>워크숍 총비용</span>
                    <span>{formatWon(workshopCost)}</span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min((workshopCost / maxGraphValue) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-500 mb-1">예상 순효과</p>
                  <p className={`text-lg font-black ${roiBenefit >= 0 ? 'text-blue-700' : 'text-slate-700'}`}>
                    {formatWon(roiBenefit)}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-500 mb-1">예상 ROI</p>
                  <p className={`text-lg font-black ${roiRate >= 0 ? 'text-blue-700' : 'text-slate-700'}`}>
                    {roiRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.open('https://open.kakao.com/o/sw0Qhz5b', '_blank')}
                className="mt-5 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold transition-all"
              >
                워크숍 신청하고 ROI 만들기
              </button>
            </div>
          </section>
        </main>

        <footer className="p-6 bg-white border-t border-slate-100 z-20">
          <button 
            onClick={() => window.open('https://open.kakao.com/o/sw0Qhz5b', '_blank')}
            className="w-full h-16 bg-[#FEE500] hover:bg-[#FDD800] text-slate-900 rounded-2xl font-extrabold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
          >
            💬 카카오톡 1:1 심층 상담하기
          </button>
        </footer>

      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900"></div>}>
      <ResultContent />
    </Suspense>
  );
}