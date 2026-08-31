'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

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

export default function DiagnosticModal({ isOpen, onClose }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientTitle: '',
    clientContact: '',
    clientEmail: '',
    part1: {},
    budget: '',
    shortPainPoint: '',
    goals: []
  });

  const [score, setScore] = useState(0);

  useEffect(() => {
    let currentScore = 0;
    Object.values(formData.part1).forEach(val => {
      currentScore += parseInt(val || 0);
    });
    setScore(currentScore);
  }, [formData.part1]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePart1Change = (qId, value) => {
    setFormData(prev => ({
      ...prev,
      part1: { ...prev.part1, [qId]: value }
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(value)
        ? prev.goals.filter(g => g !== value)
        : [...prev.goals, value]
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
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setStep(4);
    try {
      const docRef = await addDoc(collection(db, "diagnostics"), {
        ...formData,
        totalScore: score,
        createdAt: serverTimestamp(),
      });
      router.push(`/result?id=${docRef.id}`);
    } catch (error) {
      console.error("진단 결과 저장 실패:", error);
      alert("진단 결과 저장 중 오류가 발생했습니다.");
      setStep(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in-up">
      
      <div className="w-full max-w-lg bg-[#0F172A] border border-blue-500/30 rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* 상단 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 상단 헤더 & 프로그레스 바 */}
        {step < 4 && (
          <header className="px-6 pt-7 pb-4 bg-transparent border-b border-white/5 shrink-0">
            <div className="flex justify-between items-center mb-3 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">마케팅 체급 정밀 진단</span>
              </div>
              <span className="text-xs font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                STEP {step} / 3
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </header>
        )}

        {/* 메인 내용 영역 */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* STEP 1: 기본 정보 */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                  반갑습니다.<br/>기본 정보를 알려주세요.
                </h3>
                <p className="text-slate-400 text-xs font-medium">
                  진단 결과 분석 및 맞춤 리포트 발송을 위해 사용됩니다.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">기업명 / 브랜드명 *</label>
                  <input
                    type="text"
                    placeholder="예: 더크리에이터즈"
                    value={formData.clientName}
                    onChange={e => handleInputChange('clientName', e.target.value)}
                    className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-white placeholder:text-slate-600 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">성함 및 직함</label>
                  <input
                    type="text"
                    placeholder="예: 홍길동 대표"
                    value={formData.clientTitle}
                    onChange={e => handleInputChange('clientTitle', e.target.value)}
                    className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-white placeholder:text-slate-600 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">연락처 *</label>
                  <input
                    type="text"
                    placeholder="예: 010-1234-5678"
                    value={formData.clientContact}
                    onChange={e => handleInputChange('clientContact', e.target.value)}
                    className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-white placeholder:text-slate-600 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 ml-1">이메일</label>
                  <input
                    type="email"
                    placeholder="예: contact@domain.com"
                    value={formData.clientEmail}
                    onChange={e => handleInputChange('clientEmail', e.target.value)}
                    className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-white placeholder:text-slate-600 text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 15문항 체급 진단 */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="mb-4">
                <h3 className="text-xl font-black text-white tracking-tight mb-1">
                  15문항 마케팅 체급 진단
                </h3>
                <p className="text-slate-400 text-xs font-medium">
                  솔직하게 답변해 주실수록 AI의 처방 정확도가 올라갑니다.
                </p>
              </div>

              <div className="space-y-6">
                {PART1_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-[#0B1120] border border-slate-800 p-4 sm:p-5 rounded-2xl">
                    <h4 className="text-sm font-bold text-slate-200 mb-3 leading-snug break-keep">
                      {q.text}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: '네, 그렇습니다 (2점)', val: '2' },
                        { label: '보통입니다 (1점)', val: '1' },
                        { label: '아직 안하고 있습니다 (0점)', val: '0' }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => handlePart1Change(q.id, opt.val)}
                          className={`w-full text-left p-3 rounded-xl font-bold transition-all text-xs sm:text-sm ${
                            formData.part1[q.id] === opt.val
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                              : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: 고민 및 목표 */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="mb-4">
                <h3 className="text-xl font-black text-white tracking-tight mb-1">
                  거의 다 왔습니다.<br/>비즈니스 목표를 선택해 주세요.
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">최우선 해결 목표</label>
                <div className="grid grid-cols-2 gap-2">
                  {['브랜드 인지도 상승', '잠재 고객 DB 수집', '매출 증대', '키워드 장악'].map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => handleCheckboxChange(goal)}
                      className={`p-3.5 rounded-xl font-bold text-xs transition-all border ${
                        formData.goals.includes(goal)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                          : 'border-slate-800 bg-[#0B1120] text-slate-400 hover:bg-white/5 hover:text-slate-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">월 마케팅 예산</label>
                <input
                  type="text"
                  placeholder="예: 월 300만 원"
                  value={formData.budget}
                  onChange={e => handleInputChange('budget', e.target.value)}
                  className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-2xl outline-none focus:border-blue-500 text-white placeholder:text-slate-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">현재 가장 큰 고민</label>
                <textarea
                  placeholder="예: 광고비는 나가는데 실제 전환이 안 일어납니다."
                  value={formData.shortPainPoint}
                  onChange={e => handleInputChange('shortPainPoint', e.target.value)}
                  className="w-full p-4 bg-[#0B1120] border border-slate-700 rounded-2xl h-24 outline-none focus:border-blue-500 text-white placeholder:text-slate-600 text-sm custom-scrollbar"
                />
              </div>
            </div>
          )}

          {/* STEP 4: AI 분석 중 로딩 */}
          {step === 4 && (
            <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in-up">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              <h3 className="text-xl font-black text-white mb-2 animate-pulse">
                Gemini 2.5가 데이터를 분석하고 있습니다
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                체급 점수 계산 및 촌철살인 맞춤 솔루션을 생성 중입니다...
              </p>
            </div>
          )}

        </div>

        {/* 하단 네비게이션 버튼 바 */}
        {step < 4 && (
          <footer className="p-5 bg-slate-950/80 border-t border-white/5 flex gap-3 shrink-0">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center border border-white/10 transition-colors"
              >
                ←
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                다음 단계로
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
              >
                진단 완료 및 AI 결과 보기 →
              </button>
            )}
          </footer>
        )}

      </div>
    </div>
  );
}
