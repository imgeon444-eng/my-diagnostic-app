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

  let solutionTitle = "";
  let solutionDesc = "";

  if (data.totalScore <= 12) {
    solutionTitle = "🚨 마케팅 기초 뼈대 구축이 시급합니다.";
    solutionDesc = "현재 타겟 설정과 키워드 전략 등 기본기가 부족한 상태입니다. 밑빠진 독에 물 붓기 식의 광고비 지출을 멈추고, 더크리에이터즈AI의 [기초 실무 교육]을 통해 브랜드의 방향성부터 다시 잡아야 할 골든 타임입니다.";
  } else if (data.totalScore <= 22) {
    solutionTitle = "💡 퍼널 고도화와 전환율 개선이 필요합니다.";
    solutionDesc = "기본적인 마케팅은 진행 중이나, 트래픽이 실제 매출로 이어지는 '전환 연결고리(Funnel)'가 끊어져 있습니다. 매체별 효율을 분석하고 자동화 CRM을 도입하는 [전략 컨설팅]이 가장 필요한 시점입니다.";
  } else {
    solutionTitle = "🚀 대규모 스케일업 파트너십이 가능합니다.";
    solutionDesc = "마케팅에 대한 훌륭한 이해도와 실행력을 갖추고 계십니다. 이제 혼자서 감당하기 힘든 퍼포먼스 마케팅 예산 운용과 하이엔드 브랜딩 콘텐츠 제작을 더크리에이터즈AI와 [파트너십]으로 해결하여 압도적 성장을 이뤄낼 때입니다.";
  }

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
          <div className="inline-block bg-slate-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-lg">
            {data.grade || '등급 계산 불가'}
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
        </main>

        <footer className="p-6 bg-white border-t border-slate-100 z-20">
          {/* 변경된 부분: window.open을 사용하여 새 창으로 대표님의 오픈채팅방을 띄웁니다 */}
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