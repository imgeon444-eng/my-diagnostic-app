'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// 💡 프론트엔드 환경에서 가장 안전하게 작동하는 Firebase 클라이언트 연결
import { db } from '../../lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';

const Icons = {
  Business: () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>,
  Marketing: () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
  Creator: () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
  Check: () => <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
  Alert: () => <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Lv1: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>,
  Lv2: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l8 14H4z" /></svg>,
  Lv3: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>,
  Lv4: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" /></svg>,
  Lv5: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L15 9h8l-6 5 2 9-7-5-7 5 2-9-6-5h8z" /></svg>,
  Lv6: () => <svg className="w-8 h-8 text-cyan-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 10.5c-2.67 0-8-1.34-8-4v-1c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v1c0 2.66-5.33 4-8 4z" /></svg>,
};

export default function SynergyTestPage() {
  const [step, setStep] = useState(0); 
  const [selectedField, setSelectedField] = useState('');
  const [score, setScore] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answersLog, setAnswersLog] = useState([]);
  
  const [formData, setFormData] = useState({ clientName: '', clientContact: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const fields = [
    { id: 'business', icon: <Icons.Business />, label: '대표 / 사업자', desc: '인건비 절감 및 시스템 빌딩' },
    { id: 'marketing', icon: <Icons.Marketing />, label: '마케터 / 기획자', desc: '퍼널 전환율 및 업무 자동화' },
    { id: 'creator', icon: <Icons.Creator />, label: '크리에이터', desc: '콘텐츠 공장형 파이프라인 구축' }
  ];

  const getQuestions = (field) => {
    return [
      { phase: "PHASE 1. 기본 역량 진단", tag: "Q1. 프롬프트 해상도 (Context)", q: "새로운 기획이나 아이디어를 AI에게 요청할 때 방식은?", options: [{ text: "생각나는 대로 짧고 포괄적인 문장으로 지시한다.", score: 0 }, { text: "타겟 고객, 예산, 브랜드 톤앤매너 등 제약 조건을 입력한다.", score: 1 }, { text: "핵심 데이터를 사전에 시스템화하여 프롬프트 모듈로 주입한다.", score: 2 }] },
      { phase: "PHASE 1. 기본 역량 진단", tag: "Q2. 환각(Hallucination) 통제", q: "AI 결과가 실무 퀄리티에 미치지 못할 때 대처법은?", options: [{ text: "결국 내가 엑셀이나 문서에 다시 작업한다.", score: 0 }, { text: "단어를 바꾸거나 추가 지시를 내린다.", score: 1 }, { text: "결과 도출 논리를 역추적 지시하여 맹점을 디버깅한다.", score: 2 }] },
      { phase: "PHASE 1. 기본 역량 진단", tag: "Q3. 포맷 지배력 (Format)", q: "AI가 생성한 데이터를 실무에 가져다 쓰는 과정은?", options: [{ text: "결과를 복사해서 다른 툴에 다시 보기 좋게 정리한다.", score: 0 }, { text: "표(Table) 등 특정 형태로 지정하여 출력시킨다.", score: 1 }, { text: "JSON 등 외부 API/DB에 무가공으로 꽂힐 수 있게 규격화한다.", score: 2 }] },
      { phase: "PHASE 2. 시스템 확장성 진단", tag: "Q4. 워크플로우 연동 (MCP)", q: "AI 결과물을 다른 툴(Tool)이나 로컬 데이터와 어떻게 연결합니까?", options: [{ text: "AI 화면 안에서 묻고 답하며 수동 복붙으로 이어간다.", score: 0 }, { text: "Zapier 등을 활용해 일부 단순 업무를 연결해 보았다.", score: 1 }, { text: "MCP를 통해 AI가 로컬/클라우드 DB에 직접 동기화하게 세팅한다.", score: 2 }] },
      { phase: "PHASE 2. 시스템 확장성 진단", tag: "Q5. 에이전트 지배 (Harness)", q: "업무 생태계 내에서 AI 역할을 어떻게 정의/통제하나요?", options: [{ text: "명령을 내려야 대답하는 빠른 검색 도우미로 쓴다.", score: 0 }, { text: "고정된 템플릿을 만들어 특정 업무 비서로 쓴다.", score: 1 }, { text: "하네스 엔지니어링으로 복수 에이전트 자율 협업망을 통제한다.", score: 2 }] },
      { phase: "PHASE 2. 시스템 확장성 진단", tag: "Q6. 완전 무인화 (Vibe Coding)", q: "24시간 트렌드 분석 및 결제 유도 무인 시스템에 대한 생각은?", options: [{ text: "전문 개발자가 없으면 불가능한 남의 이야기다.", score: 0 }, { text: "노코드 툴을 복잡하게 엮으면 어느 정도 가능할 것 같다.", score: 1 }, { text: "바이브 코딩으로 백엔드 서버와 퍼널 전체를 직접 통제할 수 있다.", score: 2 }] }
    ];
  };

  const currentQuestions = getQuestions(selectedField);
  const handleFieldSelect = (id) => { setSelectedField(id); setStep(2); };
  
  const handleOptionClick = (points, optionText) => {
    setScore(prev => prev + points);
    setAnswersLog(prev => [...prev, optionText]);
    if (currentQIdx < 5) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      setStep(8);
    }
  };

  // 📡 서버 연동 및 🗄️ 프론트단 Firebase 칸반보드 저장 로직 (에러 검출기 탑재)
  const submitLeadAndFetchAPI = async (e) => {
    e.preventDefault();
    setStep(9); 
    setIsAnalyzing(true);

    try {
      // 1. API 통신 (제미나이 분석 및 이메일 발송)
      const response = await fetch('/api/analyze-metacognition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientContact: formData.clientContact,
          field: selectedField,
          score: score,
          answers: answersLog
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setApiResult(data.aiData);
        
        // 💡 2. DB 직접 저장 시도 (보안 규칙 에러 강제 출력 모드)
        try {
          const fieldLabel = selectedField === 'business' ? '대표/사업자' : selectedField === 'marketing' ? '마케터' : '크리에이터';
          await addDoc(collection(db, "bootcamp_leads"), {
            clientTitle: formData.clientName,
            clientName: fieldLabel,
            clientContact: formData.clientContact,
            clientEmail: "AI 에이전틱 진단",
            totalScore: score,
            shortPainPoint: data.aiData.limits[0],
            status: "상담 대기",
            createdAt: new Date()
          });
          console.log("✅ 칸반보드 DB 저장 성공");
        } catch (dbError) {
          // 🚨 [디버깅 핵심] 조용히 무시되던 에러를 화면에 Alert로 띄웁니다!
          console.error("🚨 칸반보드 저장 에러:", dbError);
          alert("DB 저장 실패 사유 (Firebase): " + dbError.message); 
        }

        setStep(10); // 결과 화면으로 이동
      } else {
        throw new Error("서버 통신 실패");
      }
    } catch (error) {
      console.error(error);
      alert("진단 서버 처리 중 오류가 발생했습니다.");
      setStep(8);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => { 
    setStep(0); setScore(0); setCurrentQIdx(0); setSelectedField(''); 
    setAnswersLog([]); setFormData({clientName:'', clientContact:''}); setApiResult(null);
  };

  const getStaticUI = () => {
    const lostCost = selectedField === 'business' ? "연간 3,850만 원 (1인 인건비 누수)" :
                     selectedField === 'marketing' ? "매월 광고 트래픽 증발 및 CVR 정체" :
                     "일일 4.5시간 단순 병목 노동 (성장 한계)";

    if (score <= 2) return { level: 1, name: "Intern", title: "단순 종속 노동자", icon: <Icons.Lv1 />, formula: [], color: "text-slate-400", bgGlow: "from-slate-600", activeTheme: "border-slate-500 bg-slate-800 text-slate-300", lost: lostCost };
    if (score <= 4) return { level: 2, name: "Staff", title: "프롬프트 탐색자", icon: <Icons.Lv2 />, formula: ["Role"], color: "text-blue-400", bgGlow: "from-blue-600", activeTheme: "border-blue-500 bg-blue-900/40 text-blue-300", lost: lostCost };
    if (score <= 6) return { level: 3, name: "Manager", title: "반자동화 실무자", icon: <Icons.Lv3 />, formula: ["Role", "Context"], color: "text-emerald-400", bgGlow: "from-emerald-600", activeTheme: "border-emerald-500 bg-emerald-900/40 text-emerald-300", lost: "Scale-up 한계 봉착 및 병목 현상" };
    if (score <= 8) return { level: 4, name: "Director", title: "시스템 기획자", icon: <Icons.Lv4 />, formula: ["Role", "Context", "Task"], color: "text-purple-400", bgGlow: "from-purple-600", activeTheme: "border-purple-500 bg-purple-900/40 text-purple-300", lost: "기획이 실물 자산으로 치환되지 못하고 텍스트로 증발" };
    if (score <= 10) return { level: 5, name: "Master", title: "프롬프트 마스터", icon: <Icons.Lv5 />, formula: ["Role", "Context", "Task", "Format"], color: "text-amber-400", bgGlow: "from-amber-600", activeTheme: "border-amber-400 bg-amber-900/40 text-amber-300", lost: "100% 무인화 실패로 인한 보이지 않는 리소스 누수" };
    return { level: 6, name: "Grandmaster", title: "에이전틱 시스템의 창조자", icon: <Icons.Lv6 />, formula: ["Role", "Context", "Task", "Format", "MCP/Agent"], color: "text-cyan-300", bgGlow: "from-cyan-500", activeTheme: "border-cyan-300 bg-cyan-900/40 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.5)]", lost: "기회비용 0 (완벽한 무인 시스템 가동 중)" };
  };

  const uiData = step === 10 ? getStaticUI() : null;
  const pyramidTiers = [{ lvl: 6, name: "Grandmaster" }, { lvl: 5, name: "Master" }, { lvl: 4, name: "Director" }, { lvl: 3, name: "Manager" }, { lvl: 2, name: "Staff" }, { lvl: 1, name: "Intern" }];

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 font-sans flex items-center justify-center p-4 selection:bg-[#3B82F6] selection:text-white pb-24 pt-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10 animate-fade-in-up">
        
        {step === 0 && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-8 md:p-14 rounded-[2rem] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full"></div>
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 font-bold text-xs tracking-widest uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> The Creators AI Metacognition V2.0
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 break-keep">
              프롬프트의 시대는 <span className="text-rose-500 line-through">끝났습니다.</span><br/>당신은 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">시스템의 창조자</span>입니까?
            </h1>
            <p className="text-slate-400 text-sm md:text-base mb-12 break-keep leading-relaxed max-w-xl mx-auto font-medium">
              하네스 엔지니어링과 MCP 역량을 평가하는 <strong>최상위 정밀 진단</strong>을 통해,<br/>현재 대표님의 위치와 시스템에서 증발하는 <strong>치명적 기회비용</strong>을 스캔합니다.
            </p>
            <button onClick={() => setStep(1)} className="w-full sm:w-auto bg-blue-600 hover:bg-cyan-500 text-white font-black text-lg py-5 px-12 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all hover:-translate-y-1">
              에이전틱 역량 진단 시작하기
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-8 md:p-14 rounded-[2rem] text-center shadow-2xl animate-fade-in-up">
            <span className="text-cyan-500 font-black text-xs tracking-widest uppercase mb-3 block">Step 01. Context Setting</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-10">무인화를 도입하려는 핵심 분야를 선택하십시오.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {fields.map(field => (
                <button key={field.id} onClick={() => handleFieldSelect(field.id)} className="bg-slate-800/40 hover:bg-cyan-900/20 border border-slate-700 hover:border-cyan-500/50 p-8 rounded-[1.5rem] transition-all group flex flex-col items-center text-center shadow-lg">
                  <div className="text-slate-400 group-hover:text-cyan-400 transition-colors mb-5">{field.icon}</div>
                  <span className="font-bold text-white mb-2 text-lg">{field.label}</span>
                  <span className="text-xs text-slate-500 font-medium break-keep">{field.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step >= 2 && step <= 7 && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-6 md:p-14 rounded-[2rem] shadow-2xl animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className={`text-xs font-black tracking-widest uppercase mb-2 block ${currentQIdx < 3 ? 'text-blue-400' : 'text-cyan-400'}`}>
                  {currentQuestions[currentQIdx].phase}
                </span>
                <span className="text-slate-500 font-bold text-sm">Question 0{currentQIdx + 1} / 06</span>
              </div>
              <div className="flex-1 max-w-xs w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${currentQIdx < 3 ? 'bg-blue-500' : 'bg-cyan-400'}`} style={{ width: `${((currentQIdx + 1) / 6) * 100}%` }}></div>
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-10 leading-relaxed break-keep">
              <span className="text-slate-500 mr-2">{currentQuestions[currentQIdx].tag.split('.')[0]}.</span>
              {currentQuestions[currentQIdx].q}
            </h2>
            
            <div className="space-y-4">
              {currentQuestions[currentQIdx].options.map((option, idx) => (
                <button key={idx} onClick={() => handleOptionClick(option.score, option.text)} className="w-full text-left bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 p-5 md:p-6 rounded-[1rem] transition-all group flex items-center gap-5">
                  <div className="w-5 h-5 rounded-full border border-slate-600 group-hover:border-cyan-400 shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-200 font-medium text-sm md:text-base break-keep leading-relaxed">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 🎯 8. VIP 리드 수집 폼 */}
        {step === 8 && (
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-900/50 p-8 md:p-14 rounded-[2rem] shadow-2xl max-w-xl mx-auto animate-fade-in-up">
            <div className="text-center mb-10">
              <span className="text-cyan-400 mb-5 block flex justify-center"><Icons.Business /></span>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight">데이터 스캔 완료.</h2>
              <p className="text-slate-400 text-sm leading-relaxed">제미나이 2.5 기반의 맞춤형 한계 분석 리포트를 확인하기 위해<br/>기본 정보를 입력해 주세요.</p>
            </div>
            
            <form onSubmit={submitLeadAndFetchAPI} className="space-y-6">
              <div>
                <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">Name / Title</label>
                <input required type="text" placeholder="홍길동 대표" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700 p-4 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600" />
              </div>
              <div>
                <label className="text-slate-500 text-[10px] font-black mb-2 block uppercase tracking-widest">Contact Number</label>
                <input required type="tel" placeholder="010-0000-0000" value={formData.clientContact} onChange={e => setFormData({...formData, clientContact: e.target.value})} className="w-full bg-slate-950/50 border border-slate-700 p-4 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-600" />
              </div>
              <button type="submit" disabled={isAnalyzing} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg py-5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all mt-4 disabled:opacity-50">
                맞춤형 시스템 리포트 확인하기
              </button>
            </form>
          </div>
        )}

        {/* ⏳ 9. 사이버틱 API 로딩 */}
        {step === 9 && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-12 rounded-[2rem] text-center shadow-2xl flex flex-col items-center justify-center min-h-[450px]">
            <div className="relative w-24 h-24 mb-10">
              <svg className="animate-spin w-full h-full text-cyan-500/20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 4"/></svg>
              <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin" style={{animationDuration: '1.2s'}}></div>
              <div className="absolute inset-0 flex items-center justify-center text-cyan-400"><Icons.Business /></div>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-3 tracking-wide">제미나이 2.5 실시간 분석 중</h2>
            <p className="text-slate-500 font-medium text-sm">입력된 데이터를 서버로 전송하여 맞춤형 솔루션을 도출하고 있습니다.</p>
          </div>
        )}

        {/* 🎉 10. API 기반 하이엔드 인포그래픽 대시보드 */}
        {step === 10 && uiData && apiResult && (
          <div className="bg-slate-900 backdrop-blur-2xl border border-slate-800 rounded-[2rem] shadow-2xl animate-fade-in-up overflow-hidden flex flex-col">
            
            <div className="flex flex-col md:flex-row border-b border-slate-800">
              <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-center relative bg-slate-950/30">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br ${uiData.bgGlow} rounded-full blur-[90px] opacity-10 pointer-events-none`}></div>
                <h3 className="text-slate-500 font-bold text-xs tracking-widest uppercase mb-6">AI Mastery 6-Tier Architecture</h3>
                <div className="w-full max-w-[280px] flex flex-col items-center gap-1.5 relative z-10">
                  {pyramidTiers.map((tier) => {
                    const isCurrent = uiData.level === tier.lvl;
                    const widths = { 6: "w-[30%]", 5: "w-[45%]", 4: "w-[60%]", 3: "w-[75%]", 2: "w-[90%]", 1: "w-full" };
                    return (
                      <div key={tier.lvl} className={`
                        h-10 md:h-11 flex items-center justify-center rounded-t-lg transition-all duration-700
                        ${widths[tier.lvl]} 
                        ${isCurrent ? `${uiData.activeTheme} scale-110 z-10 font-black transform -translate-y-1 border border-b-0` : 'bg-slate-800/30 border-t border-x border-slate-700/30 text-slate-600 font-bold opacity-70'}
                      `}>
                        <span className="text-[9px] md:text-[11px] tracking-widest uppercase">{tier.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 bg-current rounded-full ${uiData.color} animate-pulse`}></span> Current Status
                </span>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`${uiData.color}`}>{uiData.icon}</div>
                  <div>
                    <h2 className={`text-3xl md:text-4xl font-black ${uiData.color} tracking-tight`}>Lv.{uiData.level} {uiData.name}</h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">{uiData.title}</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-800/50">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest block mb-4">Core System Formula</span>
                  <div className="flex flex-wrap gap-2.5">
                    {['Role', 'Context', 'Task', 'Format', 'MCP/Agent'].map((item) => {
                      const isActive = uiData.formula.includes(item);
                      return (
                        <div key={item} className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider transition-all border ${isActive ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-slate-900/50 text-slate-700 border-slate-800/50'}`}>
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/80">
              <div className="bg-slate-900 border border-slate-800 p-7 rounded-2xl h-full">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/50">
                  <Icons.Check />
                  <h4 className="text-white font-bold tracking-wide">맞춤형 시스템 가용 역량</h4>
                </div>
                <ul className="space-y-4">
                  {apiResult.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-400 font-medium break-keep">
                      <span className="text-emerald-500 mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span> {cap}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900 border border-rose-900/30 p-7 rounded-2xl flex flex-col relative overflow-hidden h-full">
                <div className="absolute left-0 top-0 w-1 h-full bg-rose-600/50"></div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800/50">
                  <Icons.Alert />
                  <h4 className="text-rose-100 font-bold tracking-wide">치명적 시스템 결함 <span className="text-[10px] text-rose-500/50 ml-2 font-normal">by Gemini 2.5</span></h4>
                </div>
                <ul className="space-y-4 mb-8">
                  {apiResult.limits.map((limit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-rose-300/70 font-medium break-keep">
                      <span className="text-rose-500 mt-1 text-xs shrink-0">✕</span> {limit}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto bg-rose-950/30 border border-rose-900/50 rounded-xl p-5">
                  <span className="text-rose-500/80 text-[10px] font-black block mb-1.5 uppercase tracking-widest">현재 누적 기회비용 예측</span>
                  <strong className="text-rose-100 text-sm md:text-base font-black">{uiData.lost}</strong>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-[#06090f] border-t border-slate-800 text-center">
              <p className="text-cyan-200/90 font-bold text-sm md:text-base leading-relaxed break-keep mb-8">
                💡 {apiResult.solution}
              </p>
              <Link href="/bootcamp-sales" className="w-full inline-flex items-center justify-center py-5 px-6 rounded-2xl font-black text-white text-base md:text-lg bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-1">
                MCP와 하네스 장착하고 Grandmaster로 스케일업 하기
              </Link>
              <button onClick={handleReset} className="mt-8 text-slate-600 hover:text-slate-400 text-xs font-bold uppercase tracking-widest transition-colors">
                [ 시스템 재진단 ]
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}