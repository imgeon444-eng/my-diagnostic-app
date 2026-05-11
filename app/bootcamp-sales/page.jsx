'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// 💡 파이어베이스 연동 필수 부품 보존
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function BootcampSalesPage() {
  const [heroState, setHeroState] = useState(0);
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);
  
  // 💡 상담 접수 폼 관련 상태 관리 보존
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '', clientTitle: '', clientContact: '', clientEmail: ''
  });

  useEffect(() => {
    const interval = setInterval(() => setHeroState((prev) => (prev + 1) % 3), 3500);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  // 💡 파이어베이스 DB 전송 로직 보존
  const handleSubmitForm = async () => {
    if (!formData.clientName || !formData.clientContact) {
      return alert("성함과 연락처는 필수 입력 사항입니다.");
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bootcamp_leads"), {
        ...formData,
        status: "상담 대기",
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("접수 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 💡 [모바일 최적화] break-keep을 최상단에 적용하여 한글 단어 찢어짐 방지
    <div className="bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white relative font-sans break-keep">
      
      {/* 🚀 1. 히어로 섹션 */}
      <header className="relative pt-20 pb-16 md:pt-24 md:pb-20 px-4 md:px-6 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 md:px-6 py-3 rounded-xl md:rounded-2xl mb-6 md:mb-8 inline-block animate-pulse w-full sm:w-auto">
            <p className="font-bold text-xs md:text-base leading-snug">⚠️ 앞선 진단기에서 확인하신 매월 새어나가는 인건비 누수,</p>
            <p className="text-[10px] md:text-sm mt-1">The Creators AI 부트캠프가 지금 즉시 완벽하게 틀어막아 드립니다.</p>
          </div>
          <br className="hidden md:block"/>
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs md:text-sm mb-4 md:mb-6 border border-indigo-500/30">
            🚀 The Creators AI 1기 한정 모집 중
          </span>
          {/* 💡 [모바일 최적화] 폰트 크기 반응형 조절 및 모바일 강제 줄바꿈 제어 */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tight break-keep">
            개발자 채용할 돈으로,<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">마케팅에 투자하십시오.</span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-slate-300 mb-8 md:mb-10 font-medium max-w-2xl mx-auto leading-relaxed break-keep">
            코드 한 줄 몰라도 괜찮습니다. AI와 대화하며 단 4주 만에<br className="hidden md:block"/>
            우리 회사만의 자동화 CRM을 완성하는 <strong>'바이브 코딩'</strong> 실전 부트캠프.
          </p>

          {/* 애니메이션 프레임 (모바일 높이 최적화) */}
          <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-xl p-1 md:p-2 shadow-2xl border border-slate-700 relative h-48 sm:h-64 md:h-96 overflow-hidden">
            <div className={`absolute inset-0 bg-[#0c0c0c] p-4 sm:p-6 md:p-8 text-left font-mono transition-opacity duration-500 flex flex-col justify-center ${heroState === 0 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="text-rose-500 mb-1 md:mb-2 font-bold text-sm sm:text-lg md:text-xl">⨯ Error: Build failed</div>
              <div className="text-slate-400 mb-1 text-xs sm:text-sm md:text-base">&gt; next dev</div>
              <div className="text-amber-400 mb-1 text-xs sm:text-sm md:text-base">⚠ Port 3000 is in use.</div>
              <div className="text-rose-400 mb-1 text-xs sm:text-sm md:text-base">Module not found: 'scoringEngine.js'</div>
              <div className="text-slate-500 mt-2 md:mt-4 text-xs sm:text-sm animate-pulse">Waiting for manual fix_</div>
            </div>
            <div className={`absolute inset-0 bg-[#0c0c0c] p-4 sm:p-6 md:p-8 text-left font-mono transition-opacity duration-500 flex flex-col justify-center border-2 border-indigo-500 ${heroState === 1 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="text-indigo-400 mb-2 md:mb-3 font-bold text-sm sm:text-lg md:text-xl">✨ Vibe Coding Agent Activated</div>
              <div className="text-emerald-400 mb-1 text-xs sm:text-sm md:text-base">✓ Re-routing to available port 3002.</div>
              <div className="text-emerald-400 mb-1 text-xs sm:text-sm md:text-base">✓ Generating 'scoringEngine.js' dynamically.</div>
              <div className="text-indigo-300 mt-2 md:mt-4 text-xs sm:text-sm font-bold">Deploying CRM Dashboard...</div>
            </div>
            <div className={`absolute inset-0 bg-slate-50 p-3 sm:p-4 md:p-6 transition-opacity duration-700 flex flex-col text-left ${heroState === 2 ? 'opacity-100 z-30' : 'opacity-0 z-10'}`}>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 md:pb-3 mb-3 md:mb-4 shrink-0">
                <h3 className="text-slate-900 font-black text-sm sm:text-lg md:text-xl tracking-tighter">THE CREATORS AI CRM</h3>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-[8px] md:text-[10px] font-bold">+ 신규 추가</span>
              </div>
              <div className="flex gap-2 md:gap-4 flex-1 overflow-hidden">
                <div className="flex-1 bg-slate-100 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-200 shadow-inner">
                  <div className="text-[8px] md:text-[10px] font-bold text-slate-500 mb-1 md:mb-2">신규 유입</div>
                  <div className="bg-white p-2 rounded shadow-sm border-l-2 md:border-l-4 border-l-red-500">
                    <div className="text-[8px] md:text-[9px] font-bold text-red-500">매우 높음 | 92점</div>
                    <div className="text-[10px] md:text-xs font-black text-slate-900 mt-1">지혜정 대표</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. 패러다임 전환 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 md:mb-12 break-keep leading-tight">아직도 '기획서' 쓰면서<br className="block sm:hidden"/> 개발자 일정만 기다리십니까?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border-2 border-slate-200 relative opacity-80">
              <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-slate-600 text-white px-3 py-1 rounded-full font-bold text-xs md:text-sm whitespace-nowrap">기존 외주 방식</div>
              <div className="text-2xl md:text-4xl font-black text-slate-400 line-through mb-4 mt-2">견적 3,000만 원</div>
              <ul className="text-left space-y-2 md:space-y-3 text-slate-600 font-medium text-sm md:text-base break-keep">
                <li>❌ 소통 안 되는 외주사에 지친 대표님</li>
                <li>❌ 테스트까지 최소 3개월 대기</li>
              </ul>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-6 md:p-8 border-2 border-indigo-500 relative shadow-xl transform md:-translate-y-4">
              <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full font-bold text-xs md:text-sm whitespace-nowrap">바이브 코딩</div>
              <div className="text-2xl md:text-4xl font-black text-indigo-600 mb-4 mt-2">추가 비용 0원</div>
              <ul className="text-left space-y-2 md:space-y-3 text-indigo-900 font-bold text-sm md:text-base break-keep">
                <li>✅ 내 아이디어를 당장 내일 테스트</li>
                <li>✅ 기획부터 배포까지 대표가 직접 통제</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 커리큘럼 소개 */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-10 md:mb-16 text-slate-900 break-keep leading-tight">단 4주, 내 손으로 만드는<br/>세일즈 현금 창출 엔진</h2>
          <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 md:gap-6 items-start shadow-sm">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600 text-lg md:text-xl shrink-0">W1</div>
              <div>
                <h4 className="font-black text-lg md:text-xl mb-2 text-slate-900">바이브 코딩 뇌 구조 장착</h4>
                <p className="text-slate-600 text-sm md:text-base break-keep leading-relaxed">개발자의 언어가 아닌, CEO의 언어로 AI를 굴복시키는 프롬프트 엔지니어링의 본질을 배웁니다.</p>
              </div>
            </div>
            <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 md:gap-6 items-start shadow-sm">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600 text-lg md:text-xl shrink-0">W2</div>
              <div>
                <h4 className="font-black text-lg md:text-xl mb-2 text-slate-900">무에서 유를 만드는 프론트엔드</h4>
                <p className="text-slate-600 text-sm md:text-base break-keep leading-relaxed">Cursor 에디터를 활용하여 내 머릿속에만 있던 랜딩페이지와 퍼널 화면을 100% 똑같이 구현해 냅니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Risk Reversal (환불 보장 & FAQ) */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white break-keep">결제가 망설여지시나요?</h2>
            <p className="text-sm md:text-xl text-slate-400 font-medium break-keep">당연합니다. 그래서 저희가 모든 리스크를 짊어지겠습니다.</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border border-indigo-500/50 p-6 md:p-10 rounded-2xl md:rounded-3xl text-center mb-10 md:mb-16">
            <h3 className="text-lg md:text-2xl font-black text-indigo-400 mb-3 md:mb-4">💯 100% 만족도 환불 보장제</h3>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base max-w-2xl mx-auto break-keep">
              첫 1주 차 강의를 들어보시고, "이건 내 비즈니스에 적용할 수 없겠다"라는 생각이 조금이라도 드신다면 묻지도 따지지도 않고 전액 환불해 드립니다.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-slate-800 p-5 md:p-6 rounded-2xl">
              <h4 className="font-bold text-base md:text-lg text-white mb-2 break-keep">Q. 코딩을 정말 태어나서 한 번도 안 해봤는데 가능한가요?</h4>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed break-keep">네, 가능합니다. 이 캠프는 '코딩'을 배우는 곳이 아니라 '명령'을 내리는 법을 배우는 곳입니다. 한글만 할 줄 아시면 누구나 자사만의 시스템을 구축할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 5. 최종 Pricing 및 상담 접수 CTA */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 md:mb-8 break-keep">마지막 기회입니다.</h2>
          <div className="bg-slate-50 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-2 border-indigo-600 shadow-2xl relative max-w-2xl mx-auto">
            <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 md:px-6 py-1 md:py-2 rounded-full font-black text-xs md:text-sm tracking-widest shadow-lg whitespace-nowrap">
              1기 단 10명 한정 스페셜 티켓
            </div>
            <div className="text-slate-400 line-through text-lg md:text-2xl font-bold mt-4 mb-2">정가 2,200,000원</div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-indigo-600 mb-6 md:mb-8 tracking-tighter">990,000<span className="text-lg md:text-2xl text-slate-600 ml-1 md:ml-2 tracking-normal">원</span></div>
            
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-slate-900 text-white px-4 md:px-8 py-5 md:py-6 rounded-xl md:rounded-2xl text-base sm:text-lg md:text-2xl font-black shadow-xl hover:bg-indigo-600 hover:scale-105 transition-all break-keep leading-tight"
            >
              📝 1기 합류 전 우선 상담 접수하기
            </button>
            <p className="text-slate-500 text-xs md:text-sm mt-4 font-bold break-keep">* 담당자가 확인 후 순차적으로 연락을 드립니다.</p>
          </div>
        </div>
      </section>

      {/* 💡 상담 접수 모달 보존 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 md:p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
            {!isSuccess && (
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 md:top-6 right-4 md:right-6 w-8 h-8 bg-slate-100 rounded-full font-bold hover:bg-slate-200 text-slate-500">✕</button>
            )}
            
            {!isSuccess ? (
              // 접수 폼 화면
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2 break-keep">부트캠프 상담 접수</h2>
                <p className="text-slate-500 text-xs md:text-sm mb-6 md:mb-8 break-keep">입력해주신 연락처로 개별 안내를 도와드립니다.</p>
                
                <div className="space-y-3 md:space-y-4">
                  <input type="text" placeholder="기업명 또는 브랜드명" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm md:text-base" />
                  <input type="text" placeholder="성함 및 직함 (예: 홍길동 대표)" value={formData.clientTitle} onChange={e => handleInputChange('clientTitle', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm md:text-base" />
                  <input type="text" placeholder="연락처 (010-0000-0000)" value={formData.clientContact} onChange={e => handleInputChange('clientContact', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm md:text-base" />
                  <input type="email" placeholder="이메일" value={formData.clientEmail} onChange={e => handleInputChange('clientEmail', e.target.value)}
                    className="w-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm md:text-base" />
                  
                  <button 
                    onClick={handleSubmitForm}
                    disabled={isSubmitting}
                    className="w-full h-12 md:h-14 bg-indigo-600 text-white rounded-xl font-bold text-base md:text-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors mt-2 md:mt-4"
                  >
                    {isSubmitting ? '접수 중...' : '상담 신청 완료하기'}
                  </button>
                </div>
              </div>
            ) : (
              // 접수 완료 화면 (카카오톡 연동 보존)
              <div className="text-center py-4 md:py-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-2xl md:text-3xl mx-auto mb-4 md:mb-6">✓</div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 break-keep">접수가 완료되었습니다!</h2>
                <p className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base break-keep">
                  담당자가 내용을 확인 후 빠르게 연락드리겠습니다.<br className="hidden sm:block"/>
                  가장 빠른 답변을 원하시면 아래 채널로 직접 문의해 주세요.
                </p>
                
                <div className="space-y-2 md:space-y-3">
                  {/* 💡 카카오톡 오픈채팅 연결 (보존 완료) */}
                  <a href="https://open.kakao.com/o/sw0Qhz5b" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 h-12 md:h-14 bg-[#FEE500] text-[#191919] rounded-xl font-bold text-sm md:text-lg hover:bg-[#FADA0A] transition-colors">
                    💬 카카오톡 채널로 문의하기
                  </a>
                  <a href="tel:051-633-3812" className="w-full flex items-center justify-center gap-2 h-12 md:h-14 bg-slate-800 text-white rounded-xl font-bold text-sm md:text-lg hover:bg-slate-900 transition-colors">
                    📞 담당자 직통 전화 (051-633-3812)
                  </a>
                </div>
                
                <button onClick={() => {setIsFormOpen(false); setIsSuccess(false);}} className="mt-6 md:mt-8 text-slate-400 font-bold hover:text-slate-600 underline text-sm md:text-base">
                  창 닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}