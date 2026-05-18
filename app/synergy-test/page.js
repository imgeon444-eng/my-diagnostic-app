'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SynergyTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: 인트로, 1~4: 퀴즈, 5: 분석중, 6: 결과
  const [score, setScore] = useState(0);

  // 💡 진단기 질문 및 배점 데이터
  const questions = [
    {
      question: "현재 AI를 비즈니스에 활용하는 주된 목적은 무엇입니까?",
      options: [
        { text: "빠른 텍스트 작성이나 이미지 생성 등 단순 작업 보조", score: 10 },
        { text: "기존 업무 프로세스의 효율을 높이기 위한 기획/분석 도구", score: 20 },
        { text: "나의 철학을 담은 무인 자동화 시스템이나 플랫폼 구축", score: 30 }
      ]
    },
    {
      question: "프롬프트를 작성할 때 당신의 접근 방식은?",
      options: [
        { text: "남들이 만든 '만능 프롬프트 템플릿'을 복사해서 사용한다", score: 10 },
        { text: "상황에 맞춰 프롬프트를 수정하고, 원하는 답이 나올 때까지 질문한다", score: 20 },
        { text: "AI가 내 비즈니스 맥락을 완벽히 이해하도록 나만의 '메타 데이터(DB)'를 먼저 주입한다", score: 30 }
      ]
    },
    {
      question: "새로운 AI 툴이 출시되었을 때 당신의 반응은?",
      options: [
        { text: "사용법이 복잡해 보여서 남들이 요약해 줄 때까지 기다린다", score: 5 },
        { text: "일단 가입해서 이것저것 눌러보며 기능 위주로 테스트한다", score: 15 },
        { text: "이 툴이 나의 기존 세일즈 퍼널 어느 구간에 연결될 수 있을지 즉시 설계한다", score: 25 }
      ]
    },
    {
      question: "AI가 내놓은 결과물이 마음에 들지 않을 때 어떻게 해결하나요?",
      options: [
        { text: "AI의 한계라고 생각하고 내가 직접 수정하거나 포기한다", score: 5 },
        { text: "프롬프트의 단어를 바꾸거나 더 구체적으로 지시해 본다", score: 10 },
        { text: "AI에게 '왜 이런 결과가 나왔는지' 역으로 질문하여, 나의 초기 기획 단계 오류를 점검한다", score: 15 }
      ]
    }
  ];

  const handleOptionClick = (points) => {
    setScore((prev) => prev + points);
    
    if (step < questions.length) {
      setStep((prev) => prev + 1);
    } else {
      // 마지막 문제 풀이 완료 시 분석 스피너로 이동
      setStep(5);
      setTimeout(() => {
        setStep(6);
      }, 2500); // 2.5초간 분석 애니메이션
    }
  };

  // 💡 결과 계산 로직 (성장형 카피라이팅 적용)
  const getResult = () => {
    if (score >= 80) {
      return {
        title: "오케스트라 지휘자",
        subTitle: "Orchestrator",
        color: "text-indigo-400",
        bg: "bg-indigo-900/20 border-indigo-500/30",
        desc: "탁월한 시너지입니다. 당신은 이미 AI의 무한한 연산력에 자신만의 고유한 철학을 결합할 줄 아는 준비된 리더입니다.",
        action: "이제 개별 도구의 파편적 활용을 넘어, 여러 AI 에이전트를 조율하고 당신의 비즈니스를 무인 자동화 시스템으로 빌딩하는 대규모 확장 단계로 진입할 차례입니다.",
        btnText: "🚀 내 고유성과 시스템을 결합하여 비즈니스 확장하기",
        btnStyle: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
      };
    } else if (score >= 40) {
      return {
        title: "스마트 프랙티셔너",
        subTitle: "Practitioner",
        color: "text-emerald-400",
        bg: "bg-emerald-900/20 border-emerald-500/30",
        desc: "AI를 유능한 조수(+)로 훌륭하게 활용하고 계십니다. 다만, 도구가 제시하는 모범 답안과 템플릿의 한계 안에서 움직이고 있을 가능성이 높습니다.",
        action: "지금 시대의 진정한 가치는 정답이 아닌 '질문의 해상도'에 있습니다. 프롬프트 수집을 멈추고 시스템의 주도권을 쥐는 메타인지를 재건해야 합니다.",
        btnText: "🌱 정답을 찾는 유저에서, 질문을 던지는 지휘자로 도약하기",
        btnStyle: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
      };
    } else {
      return {
        title: "포텐셜 디스커버러",
        subTitle: "Discoverer",
        color: "text-amber-400",
        bg: "bg-amber-900/20 border-amber-500/30",
        desc: "AI라는 거대한 파도 앞에서 이제 막 자신만의 가능성을 탐색하기 시작한 단계입니다. 기술의 속도에 압도될 필요는 전혀 없습니다.",
        action: "기능을 외우는 수고는 AI에게 맡기십시오. 비개발자도 기획자의 언어로 완벽하게 프로그램을 통제하는 '바이브 코딩'의 본질을 깨달으면 주도권은 즉시 당신에게 돌아옵니다.",
        btnText: "⚡ 도구의 한계를 넘어, 주도적인 AI 지휘자로 성장하기",
        btnStyle: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
      };
    }
  };

  const resultData = step === 6 ? getResult() : null;

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 font-sans flex items-center justify-center p-4 selection:bg-[#3B82F6] selection:text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10 animate-fade-in-up">
        
        {/* 🚀 0단계: 인트로 화면 */}
        {step === 0 && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[2rem] text-center shadow-2xl">
            <span className="text-cyan-400 font-black tracking-widest text-xs uppercase mb-4 block">Metacognition Test</span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6 break-keep">
              당신은 AI의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-cyan-300">주인</span>입니까,<br/>
              아니면 <span className="text-slate-500 line-through">하청업자</span> 입니까?
            </h1>
            <p className="text-slate-400 text-base md:text-lg mb-10 break-keep leading-relaxed">
              수백 개의 프롬프트를 외우는 것보다 중요한 것은 <strong>'나의 메타인지'</strong>입니다.<br/>
              4가지 질문을 통해 당신의 진정한 AI 시너지 레벨을 진단합니다.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-lg py-4 px-10 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 w-full sm:w-auto"
            >
              내 시너지 레벨 확인하기
            </button>
          </div>
        )}

        {/* 📝 1~4단계: 퀴즈 화면 */}
        {step >= 1 && step <= 4 && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 md:p-10 rounded-[2rem] shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-500 font-bold text-sm">Question {step} of 4</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className={`w-8 h-1.5 rounded-full ${step >= num ? 'bg-cyan-400' : 'bg-slate-800'}`}></div>
                ))}
              </div>
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-white mb-8 leading-relaxed break-keep">
              {questions[step - 1].question}
            </h2>

            <div className="space-y-4">
              {questions[step - 1].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option.score)}
                  className="w-full text-left bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 p-5 rounded-xl transition-all group flex items-start gap-4"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-cyan-400 shrink-0 mt-0.5 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-slate-300 group-hover:text-white font-medium text-sm md:text-base break-keep leading-relaxed">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ⏳ 5단계: 분석 중 로딩 화면 */}
        {step === 5 && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-12 rounded-[2rem] text-center shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">메타인지 데이터 분석 중...</h2>
            <p className="text-slate-500">당신의 성향과 비즈니스 핏을 계산하고 있습니다</p>
          </div>
        )}

        {/* 🎉 6단계: 최종 결과 화면 */}
        {step === 6 && resultData && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[2rem] text-center shadow-2xl animate-fade-in-up">
            <span className="text-slate-500 font-bold tracking-widest text-xs uppercase mb-4 block">Analysis Complete</span>
            
            <div className={`p-6 md:p-8 rounded-2xl border ${resultData.bg} mb-8`}>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                {resultData.title}
              </h1>
              <p className={`text-xl md:text-2xl font-black mb-6 ${resultData.color}`}>
                ({resultData.subTitle})
              </p>
              <div className="w-16 h-1 bg-slate-700 mx-auto mb-6"></div>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed break-keep mb-4 font-medium">
                {resultData.desc}
              </p>
              <p className="text-white font-bold text-sm md:text-base leading-relaxed break-keep bg-slate-900/50 p-4 rounded-xl">
                {resultData.action}
              </p>
            </div>

            {/* 🎯 3층(부트캠프 랜딩)으로 이동하는 성장형 CTA */}
            <Link 
              href="/bootcamp-sales"
              className={`w-full block text-center text-white font-bold py-5 px-6 rounded-xl transition-all hover:-translate-y-1 ${resultData.btnStyle}`}
            >
              {resultData.btnText}
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}