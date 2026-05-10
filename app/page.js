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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-blue-500 mb-8"></div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">AI가 데이터를 분석하고 있습니다</h2>
        <p className="text-slate-400 text-center">현재 마케팅 상태를 분석하여<br/>맞춤형 제안을 생성 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start md:items-center py-0 md:py-10">
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[850px] md:h-auto md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
        {step > 0 && (
          <header className="px-6 pt-10 pb-4 bg-white z-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-extrabold text-slate-900">심층 진단</h1>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{step} / 3</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto px-6 custom-scrollbar ${step === 0 ? 'pb-10 pt-16' : 'pb-32'}`}>
          {step === 0 && (
            <div className="animate-fade-in-up flex flex-col items-center justify-center h-full text-center mt-8">
              <img src="https://i.postimg.cc/4dhycVrx/logo.png" alt="더크리에이터즈AI 로고" className="h-14 md:h-20 object-contain mb-8" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
                클라이언트 마케팅<br/>심층 진단 대시보드
              </h2>
              <div className="bg-slate-50 border border-slate-100 p-5 md:p-6 rounded-2xl mb-10 text-left">
                <p className="text-slate-600 leading-relaxed text-[15px] md:text-base font-medium break-keep">
                  이 진단기는 <strong className="text-blue-600">마케팅/브랜딩/퍼널마케팅 설계</strong>가 필요한 사업자 분들의 현재 상태를 정확히 진단 후 맞춤형 제안을 드리기 위해 제공됩니다.
                </p>
              </div>

              <div className="w-full space-y-3">
                <button onClick={() => setStep(1)} className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
                  🚀 진단기 접수 시작하기
                </button>
                <a href="tel:051-633-3812" className="w-full h-16 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-extrabold text-lg transition-all shadow-lg flex items-center justify-center gap-2">
                  📞 바로 전화상담
                </a>
                
                <div className="pt-4 pb-2">
                  <div className="border-t border-slate-200"></div>
                </div>

                {/* 💡 3. 부트캠프 퍼널로 이동 (이 버튼만 남깁니다) */}
                <Link 
                  href="/bootcamp-funnel" 
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2"
                >
                  💡 AI 진단 후 부트캠프 합류하기
                </Link>
              </div>
            </div>
          )}

          {/* STEP 1~3: 진단기 로직 유지 */}
          {step === 1 && (
            <div className="animate-fade-in-up mt-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">반갑습니다.<br/>기본 정보를 알려주세요.</h2>
              <div className="space-y-4 mt-8">
                <input type="text" placeholder="기업명 또는 브랜드명" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" />
                <input type="text" placeholder="성함 및 직함" value={formData.clientTitle} onChange={e => handleInputChange('clientTitle', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" />
                <input type="text" placeholder="연락처" value={formData.clientContact} onChange={e => handleInputChange('clientContact', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" />
                <input type="email" placeholder="이메일" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)} className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up mt-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">마케팅 체급 진단</h2>
              <div className="space-y-8 mt-8">
                {PART1_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-slate-50 p-5 md:p-6 rounded-3xl">
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-5 leading-snug">{q.text}</h3>
                    <div className="flex flex-col gap-2 md:gap-3">
                      {[ {label: '네, 그렇습니다', val: '2'}, {label: '보통입니다', val: '1'}, {label: '아직 안하고 있습니다', val: '0'} ].map(opt => (
                        <button key={opt.val} onClick={() => handlePart1Change(q.id, opt.val)}
                          className={`w-full text-left p-4 rounded-2xl font-bold transition-all text-sm md:text-base ${formData.part1[q.id] === opt.val ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'}`}>
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">거의 다 왔습니다.<br/>목표를 설정해 주세요.</h2>
              <div className="space-y-6 mt-8">
                <div>
                  <label className="block font-bold text-slate-800 mb-3 text-base md:text-lg">최우선 해결 목표</label>
                  <div className="flex flex-col gap-2 md:gap-3">
                    {['브랜드 인지도 상승', '잠재 고객 DB 수집', '매출 증대', '키워드 장악'].map(goal => (
                      <button key={goal} onClick={() => handleCheckboxChange(goal)} className={`w-full text-left p-4 rounded-2xl font-bold transition-all border-2 ${formData.goals.includes(goal) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white'}`}>
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-3 text-base md:text-lg">예산</label>
                  <input type="text" placeholder="예: 월 300만 원" value={formData.budget} onChange={e => handleInputChange('budget', e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-3 text-base md:text-lg">고민</label>
                  <textarea placeholder="자유롭게 적어주세요." value={formData.shortPainPoint} onChange={e => handleInputChange('shortPainPoint', e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl h-28 outline-none" />
                </div>
              </div>
            </div>
          )}
        </main>

        {step > 0 && step < 4 && (
          <footer className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent z-20">
            <div className="flex gap-2 md:gap-3">
              {step > 1 && <button onClick={prevStep} className="w-14 h-14 flex items-center justify-center bg-slate-100 text-slate-600 rounded-2xl font-bold">←</button>}
              {step < 3 ? (
                <button onClick={nextStep} className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-extrabold text-base">다음 단계로</button>
              ) : (
                <button onClick={handleSubmit} className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-extrabold text-base">진단 완료 및 결과 보기</button>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}