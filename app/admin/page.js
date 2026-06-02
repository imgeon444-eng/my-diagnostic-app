'use client';

import React, { useState } from 'react';
import KanbanBoard from '../../components/admin/KanbanBoard';
import B2BTargetSniperAnalyzer from '../../components/admin/B2BTargetSniperAnalyzer'; 
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

import AttendanceWidget from '../../components/admin/AttendanceWidget'; 
import AttendanceDashboard from '../../components/admin/AttendanceDashboard';
import CalendarDashboard from '../../components/admin/CalendarDashboard';
import MissionDashboard from '../../components/admin/MissionDashboard';

// 💡 [클린 아키텍처] 탭 메뉴 데이터를 배열로 분리하여 유지보수성 극대화
const TABS = [
  { id: 'marketing', icon: '📋', label: '1층: 마케팅 진단', color: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] border-transparent' },
  { id: 'meta', icon: '🧠', label: '1층: AI 메타인지', color: 'bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.4)] border-transparent' },
  { id: 'url', icon: '📊', label: '2층: URL 통계', color: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] border-transparent' },
  { id: 'landing', icon: '🔥', label: '3층: 부트캠프 VIP', color: 'bg-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.4)] border-transparent' },
  { id: 'hr', icon: '🧑‍💻', label: '4층: 인사/근태', color: 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.4)] border-transparent' },
  { id: 'calendar', icon: '📅', label: '5층: 전사 일정', color: 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] border-transparent' },
  { id: 'mission', icon: '🎯', label: '6층: 목표/미션', color: 'bg-rose-500 shadow-[0_0_15px_rgba(243,24,103,0.4)] border-transparent' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('marketing'); 
  const router = useRouter();

  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      router.push('/admin/login');
    });
  };

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 p-4 md:p-8 font-sans selection:bg-[#3B82F6] selection:text-white relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* 헤더 영역 (모바일에서 버튼이 잘리지 않도록 횡스크롤 적용) */}
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 border-b border-slate-800 pb-6 w-full">
          <div className="w-full md:w-auto shrink-0">
            <span className="text-blue-500 font-black tracking-widest text-[10px] md:text-xs uppercase mb-1.5 block animate-pulse">Live CRM Dashboard</span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
              The Creators AI
            </h1>
            <p className="text-slate-400 mt-1.5 text-xs md:text-sm font-medium">전체 세일즈 퍼널 및 고객 파이프라인 통합 시스템</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto overflow-x-auto custom-scrollbar pb-1 md:pb-0">
            <div className="shrink-0"><AttendanceWidget onNavigate={() => setActiveTab('hr')} /></div>
            <button 
              onClick={handleLogout}
              className="shrink-0 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              🔒 로그아웃
            </button>
          </div>
        </header>

        {/* 🚀 핵심 최적화: 모바일 횡스크롤(스와이프) 내비게이션 탭 */}
        <div className="relative mb-8">
          {/* 모바일 스크롤 유도 그림자 효과 */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#090E17] to-transparent pointer-events-none z-10 md:hidden rounded-r-2xl"></div>
          
          <div className="flex overflow-x-auto custom-scrollbar snap-x snap-mandatory gap-2 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 w-full backdrop-blur-md">
            {TABS.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`shrink-0 snap-start whitespace-nowrap px-4 py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-[11px] md:text-sm transition-all duration-300 flex items-center gap-2 border ${
                  activeTab === tab.id 
                    ? `text-white ${tab.color}` 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-700/50'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <main className="min-h-[600px] animate-fade-in-up">
          {activeTab === 'marketing' && <div className="space-y-6 animate-fade-in-up"><KanbanBoard collectionName="diagnostics" title="마케팅 진단기" columns={['신규 유입 (진단 완료)', '분석 중', '리타겟팅 대상', '상담 전환']} /></div>}
          {activeTab === 'meta' && <div className="space-y-6 animate-fade-in-up"><KanbanBoard collectionName="bootcamp_leads" title="AI 메타인지 진단" columns={['상담 대기', '연락 완료', '결제 대기', '등록 완료']} /></div>}
          {activeTab === 'url' && <div className="space-y-6 animate-fade-in-up"><B2BTargetSniperAnalyzer /></div>}
          {activeTab === 'landing' && <div className="space-y-6 animate-fade-in-up"><KanbanBoard collectionName="bootcamp_leads" title="부트캠프 VIP" columns={['심사 대기', '연락 완료', '결제 대기', '등록 완료']} /></div>}
          {activeTab === 'hr' && <div className="animate-fade-in-up"><AttendanceDashboard /></div>}
          {activeTab === 'calendar' && <div className="animate-fade-in-up h-full"><CalendarDashboard /></div>}
          {activeTab === 'mission' && <div className="animate-fade-in-up h-full"><MissionDashboard /></div>}
        </main>
      </div>
    </div>
  );
}