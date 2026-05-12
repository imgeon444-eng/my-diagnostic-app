'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const PART1_QUESTIONS = [
  { id: 'q1', text: "1. 핵심 타겟 고객의 구체적인 페르소나를 문서화해 두었습니까?" },
  { id: 'q2', text: "2. 경쟁사와 구분되는 우리 브랜드만의 차별점(USP)을 한 문장으로 정의할 수 있습니까?" },
  { id: 'q3', text: "3. 실제 매출과 전환을 일으키는 '돈이 되는 핵심 키워드'를 3개 이상 알고 있습니까?" },
  { id: 'q4', text: "4. 월간 검색량과 노출 현황을 파악하여 '틈새 키워드'를 발굴해 본 적이 있습니까?" },
  { id: 'q5', text: "5. 네이버 파워링크 등 검색광고(SA)의 필요성을 이해하고, 기본 세팅을 해본 경험이 있습니까?" },
  { id: 'q6', text: "6. 비즈니스에 적합한 뉴미디어 채널을 주 1회 이상 꾸준히 운영하고 있습니까?" },
  { id: 'q7', text: "7. 영상(숏폼 등) 기획/제작 체계가 있거나, AI 도구를 활용해 효율을 높여본 경험이 있습니까?" },
  { id: 'q8', text: "8. 실제 홈페이지 유입량이나 전환율(DB/매출) 데이터를 주기적으로 확인하십니까?" },
  { id: 'q9', text: "9. 월/분기별 마케팅 예산을 할당하고, 광고비 대비 수익률(ROAS)을 측정해 보셨습니까?" },
  { id: 'q10', text: "10. 구매하지 않은 고객에게 다시 광고를 띄우는 '리타겟팅'을 실행해 보셨습니까?" },
  { id: 'q11', text: "11. 브랜드 인지부터 구매까지의 과정(세일즈 퍼널)을 단계별로 설계해 보셨습니까?" },
  { id: 'q12', text: "12. 스스로 브랜드에 맞는 캠페인 기획안이나 작업 지시서를 논리적으로 작성할 수 있습니까?" },
  { id: 'q13', text: "13. 각 매체의 알고리즘 특성을 이해하고, 맞춤 전략을 수립할 수 있습니까?" },
  { id: 'q14', text: "14. 챗봇, 자동 이메일 발송 등 고객 관계 관리(CRM)를 자동화하여 리소스를 줄여보셨습니까?" },
  { id: 'q15', text: "15. 당장의 매출뿐만 아니라, 1~2년 뒤의 브랜드 가치를 높이기 위한 로드맵이 있습니까?" },
];

export default function TheCreatorsDiagnostic() {
  const router = useRouter();
  const [step, setStep] = useState(0); 
  
  const [formData, setFormData] = useState({
    clientName: '', clientTitle: '', clientContact: '', clientEmail: '',
    part1: {}, budget: '', shortPainPoint: '', goals: []
  });

  const [score, setScore] = useState(0);

  useEffect(() => {
    let currentScore = 0;
    Object.values(formData.part1).forEach(val => { currentScore += parseInt(val || 0); });
    setScore(currentScore);
  }, [formData.part1]);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handlePart1Change = (qId, value) => setFormData(prev => ({ ...prev, part1: { ...prev.part1, [qId]: value } }));
  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev, goals: prev.goals.includes(value) ? prev.goals.filter(g => g !== value) : [...prev.goals, value]
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.clientName || !formData.clientContact)) {
      alert("기업명과 연락처를 입력해주세요.");
      return;
    }
    if (step === 2 && Object.keys(formData.part1).length < 15) {
      alert("15개 진단 문항을 모두 완료해주세요.");
      return;
    }
    window.scrollTo(0,0);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    window.scrollTo(0,0);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setStep(4);
    try {
      const docRef = await addDoc(collection(db, "diagnostics"), {
        ...formData, totalScore: score, createdAt: serverTimestamp(),
      });
      router.push(`/result?id=${docRef.id}`);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("오류가 발생했습니다.");
      setStep(3);
    }
  };

  const progressPercent = step > 0 && step < 4 ? Math.round((step / 3) * 100) : 0;

  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#090E17] flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-[#3B82F6] mb-8 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2 animate-pulse">AI가 데이터를 분석하고 있습니다</h2>
        <p className="text-slate-400 text-center font-medium">현재 마케팅 상태를 분석하여<br/>맞춤형 제안을 생성 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 font-sans break-keep flex justify-center items-start md:items-center py-0 md:py-10 relative overflow-hidden selection:bg-[#3B82F6] selection:text-white">
      
      {/* 배경 아우라 (부드러운 숨쉬기 애니메이션 적용) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 min-h-screen md:min-h-[850px] md:h-auto md:rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col z-10">
        
        {step > 0 && (
          <header className="px-6 pt-10 pb-4 bg-transparent z-10 border-b border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-black text-white">심층 진단</h1>
              <span className="text-sm font-black text-[#3B82F6] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]">{step} / 3</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700 ease-out relative">
                <div className="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px]"></div>
              </div>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto px-6 custom-scrollbar ${step === 0 ? 'pb-10 pt-16' : 'pb-32'}`}>
          
          {step === 0 && (
            <div className="animate-fade-in-up flex flex-col items-center justify-center h-full text-center mt-8">
              
              {/* 로고 영역 (i 잘림 버그 pr-2로 해결) */}
              <div className="mb-8 flex justify-center flex-col items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  The Creators AI Engine
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mt-3 flex items-baseline gap-1.5">
                  THE CREATORS 
                  <span className="font-sans font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-[#3B82F6] to-cyan-300 text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] translate-y-1 pr-2">
                    Ai
                  </span>
                </h1>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6 tracking-tight break-keep">
                클라이언트 마케팅<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm">심층 진단 대시보드</span>
              </h2>
              
              <div className="bg-black/20 border border-white/5 p-5 md:p-6 rounded-2xl mb-10 text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <p className="text-slate-400 leading-relaxed text-[15px] md:text-base font-medium break-keep pl-2">
                  이 진단기는 <strong className="text-blue-400">마케팅/브랜딩/퍼널 설계</strong>가 필요한 분들의 현재 상태를 진단 후 맞춤형 솔루션을 도출합니다.
                </p>
              </div>

              {/* 💡 액션 버튼 그룹 (이모지 완전 제거 & 고급 CSS 모션 적용) */}
              <div className="w-full space-y-4">
                
                {/* 1. 메인 시작 버튼 (빛이 스윽 지나가는 호버 효과) */}
                <button 
                  onClick={() => setStep(1)} 
                  className="group relative w-full h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] overflow-hidden flex items-center justify-center gap-2 border border-blue-400/50"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    데이터 기반 진단 시작
                  </span>
                </button>

                {/* 2. 전화 상담 버튼 (고급스러운 Ghost 버튼 스타일) */}
                <a 
                  href="tel:051-633-3812" 
                  className="group w-full h-16 bg-transparent border border-white/20 text-slate-300 hover:text-white rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/30"
                >
                  <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  다이렉트 유선 상담
                </a>
                
                <div className="pt-4 pb-2">
                  <div className="border-t border-white/10"></div>
                </div>

                {/* 3. 부트캠프 라우팅 버튼 (네온 테두리 & 텍스트 이동 효과) */}
                <Link 
                  href="/bootcamp-funnel" 
                  className="group w-full h-14 bg-[#0B1120] border border-indigo-500/30 text-indigo-300 rounded-xl font-bold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:border-indigo-400 hover:text-indigo-100 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300">AI 부트캠프 커리큘럼 확인</span>
                  <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
              </div>
            </div>
          )}

          {/* 이하 STEP 1, 2, 3 로직 유지 */}
          {step === 1 && (
            <div className="animate-fade-in-up mt-4">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight break-keep">반갑습니다.<br/>기본 정보를 알려주세요.</h2>
              <div className="space-y-4 mt-8">
                <input type="text" placeholder="기업명 또는 브랜드명" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500 transition-all" />
                <input type="text" placeholder="성함 및 직함" value={formData.clientTitle} onChange={e => handleInputChange('clientTitle', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500 transition-all" />
                <input type="text" placeholder="연락처" value={formData.clientContact} onChange={e => handleInputChange('clientContact', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500 transition-all" />
                <input type="email" placeholder="이메일" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500 transition-all" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up mt-4">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight break-keep">마케팅 체급 진단</h2>
              <div className="space-y-8 mt-8">
                {PART1_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-black/20 border border-white/5 p-5 md:p-6 rounded-3xl hover:border-white/10 transition-colors">
                    <h3 className="text-base md:text-lg font-bold text-slate-200 mb-4 md:mb-5 leading-snug break-keep">{q.text}</h3>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {[ {label: '네, 그렇습니다', val: '2'}, {label: '보통입니다', val: '1'}, {label: '아직 안하고 있습니다', val: '0'} ].map(opt => (
                        <button key={opt.val} onClick={() => handlePart1Change(q.id, opt.val)}
                          className={`w-full text-left p-4 rounded-2xl font-bold transition-all text-sm md:text-base ${formData.part1[q.id] === opt.val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)] transform scale-[1.01]' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-slate-200'}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in-up mt-4">
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight break-keep">거의 다 왔습니다.<br/>목표를 설정해 주세요.</h2>
              <div className="space-y-6 mt-8">
                <div>
                  <label className="block font-bold text-slate-300 mb-3 text-base md:text-lg">최우선 해결 목표</label>
                  <div className="flex flex-col gap-2 md:gap-3">
                    {['브랜드 인지도 상승', '잠재 고객 DB 수집', '매출 증대', '키워드 장악'].map(goal => (
                      <button key={goal} onClick={() => handleCheckboxChange(goal)} className={`w-full text-left p-4 rounded-2xl font-bold transition-all border ${formData.goals.includes(goal) ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] transform scale-[1.01]' : 'border-white/10 bg-black/40 text-slate-400 hover:bg-white/5 hover:text-slate-300'}`}>
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-3 text-base md:text-lg">예산</label>
                  <input type="text" placeholder="예: 월 300만 원" value={formData.budget} onChange={e => handleInputChange('budget', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500 transition-all" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-3 text-base md:text-lg">고민</label>
                  <textarea placeholder="자유롭게 적어주세요." value={formData.shortPainPoint} onChange={e => handleInputChange('shortPainPoint', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl h-28 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder:text-slate-500 transition-all custom-scrollbar" />
                </div>
              </div>
            </div>
          )}
        </main>

        {step > 0 && step < 4 && (
          <footer className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#090E17] via-[#090E17]/90 to-transparent z-20">
            <div className="flex gap-2 md:gap-3 mt-4">
              {step > 1 && <button onClick={prevStep} className="w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-bold transition-colors">←</button>}
              {step < 3 ? (
                <button onClick={nextStep} className="flex-1 h-14 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-black text-base transition-colors">다음 단계로</button>
              ) : (
                <button onClick={handleSubmit} className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-base transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2">
                  진단 완료 및 결과 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}