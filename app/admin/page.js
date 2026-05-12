'use client';

import React, { useState } from 'react';
import KanbanBoard from '../../components/admin/KanbanBoard';
import B2BTargetSniperAnalyzer from '../../components/admin/B2BTargetSniperAnalyzer';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../../lib/firebase'; // firebase.js 경로 (필요시 확인)
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bootcamp'); 
  const router = useRouter();

  // 💡 신규 추가: 보안 로그아웃 기능
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
        
        {/* 💡 헤더에 로그아웃 버튼 배치 */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-6">
          <div>
            <span className="text-blue-500 font-black tracking-widest text-xs uppercase mb-2 block animate-pulse">Live CRM Dashboard</span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
              The Creators <span className="font-sans font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-[#3B82F6] to-cyan-300">Ai</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">전체 세일즈 퍼널 및 고객 파이프라인 통합 관리 시스템</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            🔒 시스템 로그아웃
          </button>
        </header>

        {/* 🎯 3대 파이프라인 탭(Tab) 네비게이션 */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 w-fit backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('bootcamp')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'bootcamp' ? 'bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            🔥 3층: 부트캠프 (VIP)
          </button>
          <button 
            onClick={() => setActiveTab('analyzer')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'analyzer' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            🔍 2층: URL 분석 데이터
          </button>
          <button 
            onClick={() => setActiveTab('diagnostics')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === 'diagnostics' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            📋 1층: 진단기 데이터
          </button>
        </div>

        {/* 🖥️ 탭 교체 화면 */}
        <main className="min-h-[600px] animate-fade-in-up">
          
          {/* 3층 부트캠프 보드 */}
          {activeTab === 'bootcamp' && (
            <div className="space-y-6 animate-fade-in-up">
              <KanbanBoard 
                collectionName="bootcamp_leads"
                title="부트캠프 세일즈 파이프라인"
                columns={['상담 대기', '연락 완료', '결제 대기', '등록 완료']}
              />
            </div>
          )}

          {/* 2층 분석기 보드 */}
          {activeTab === 'analyzer' && (
            <div className="space-y-6 animate-fade-in-up">
              <B2BTargetSniperAnalyzer />
            </div>
          )}

          {/* 1층 진단기 보드 */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6 animate-fade-in-up">
              <KanbanBoard 
                collectionName="diagnostics"
                title="마케팅 진단기 고객 파이프라인"
                columns={['신규 유입 (진단 완료)', '분석 중', '리타겟팅 대상', '상담 전환']}
              />
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}