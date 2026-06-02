'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebase';

// 💡 onNavigate 프롭스를 받아 어드민 메인의 탭을 전환합니다.
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
    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-xl animate-fade-in-up">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-slate-300 text-xs font-bold">{currentUser?.email}</span>
      </div>
      <div className="w-px h-4 bg-slate-700 mx-1"></div>
      <button 
        onClick={onNavigate}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
      >
        인사/근태 이동 ⏱️
      </button>
    </div>
  );
}