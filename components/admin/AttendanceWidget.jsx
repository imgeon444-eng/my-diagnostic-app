'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebase';

// 💡 onNavigate 프롭스를 받아 캘린더 탭으로 이동시킵니다.
export default function AttendanceWidget({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-2 md:gap-3 bg-slate-800/40 border border-slate-700/50 px-2 py-1.5 md:px-3 md:py-2 rounded-xl animate-fade-in-up backdrop-blur-sm">
      {/* PC 화면에서만 이메일 표시, 모바일에서는 버튼 공간 확보를 위해 숨김 */}
      <div className="hidden md:flex items-center gap-2 pr-2 border-r border-slate-700">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        <span className="text-slate-300 text-xs font-bold tracking-wide">
          {currentUser?.email}
        </span>
      </div>
      
      {/* 💡 [신규] 일정 확인 퀵 액션 버튼 */}
      <button
        onClick={onNavigate}
        className="bg-amber-500 hover:bg-amber-400 text-white text-[11px] md:text-xs font-black px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5"
      >
        <span>📅</span> 일정 확인
      </button>
    </div>
  );
}