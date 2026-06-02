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
// 💡 [신규 탑재] 6층 미션 대시보드 호출
import MissionDashboard from '../../components/admin/MissionDashboard';

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
        
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-6">
          <div>
            <span className="text-blue-500 font-black tracking-widest text-xs uppercase mb-2 block animate-pulse">Live CRM Dashboard</span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
              The Creators AI
            </h1>
            <p className="text-slate-400 mt-2 font-medium">전체 세일즈 퍼널 및 고객 파이프라인 통합 관리 시스템</p>
          </div>
          
          <div className="flex items-center gap-3">
            <AttendanceWidget onNavigate={() => setActiveTab('hr')} />
            <button 
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            >
              🔒 시스템 로그아웃
            </button>
          </div>
        </header>

        {/* 💡 [탭 메뉴 영역] 6층 미션 버튼 추가 */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 w-fit backdrop-blur-md">
          <button onClick={() => setActiveTab('marketing')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'marketing' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>📋 1층: 마케팅 진단</button>
          <button onClick={() => setActiveTab('meta')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'meta' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>🧠 1층: AI 메타인지</button>
          <button onClick={() => setActiveTab('url')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'url' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>📊 2층: URL 통계</button>
          <button onClick={() => setActiveTab('landing')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'landing' ? 'bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>🔥 3층: 부트캠프 VIP</button>
          
          <button onClick={() => setActiveTab('hr')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ml-4 border ${activeTab === 'hr' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-700/50'}`}>🧑‍💻 4층: 인사/근태</button>
          <button onClick={() => setActiveTab('calendar')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 border ${activeTab === 'calendar' ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-700/50'}`}>📅 5층: 전사 일정</button>
          
          <button onClick={() => setActiveTab('mission')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 border ${activeTab === 'mission' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(243,24,103,0.4)] border-transparent' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-700/50'}`}>🎯 6층: 목표/미션</button>
        </div>

        <main className="min-h-[600px] animate-fade-in-up">
          {activeTab === 'marketing' && <div className="space-y-6 animate-fade-in-up"><KanbanBoard collectionName="diagnostics" title="마케팅 진단기 고객 파이프라인" columns={['신규 유입 (진단 완료)', '분석 중', '리타겟팅 대상', '상담 전환']} /></div>}
          {activeTab === 'meta' && <div className="space-y-6 animate-fade-in-up"><KanbanBoard collectionName="bootcamp_leads" title="AI 메타인지 진단 고객 파이프라인" columns={['상담 대기', '연락 완료', '결제 대기', '등록 완료']} /></div>}
          {activeTab === 'url' && <div className="space-y-6 animate-fade-in-up"><B2BTargetSniperAnalyzer /></div>}
          {activeTab === 'landing' && <div className="space-y-6 animate-fade-in-up"><KanbanBoard collectionName="bootcamp_leads" title="부트캠프 세일즈 파이프라인" columns={['심사 대기', '연락 완료', '결제 대기', '등록 완료']} /></div>}
          {activeTab === 'hr' && <div className="animate-fade-in-up"><AttendanceDashboard /></div>}
          {activeTab === 'calendar' && <div className="animate-fade-in-up h-full"><CalendarDashboard /></div>}
          
          {/* 💡 [신규] 6층 미션 대시보드 화면 렌더링 */}
          {activeTab === 'mission' && <div className="animate-fade-in-up h-full"><MissionDashboard /></div>}
        </main>
      </div>
    </div>
  );
}