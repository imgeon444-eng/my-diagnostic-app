'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, app } from '../../lib/firebase';

export default function MissionDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  
  // KPI 상태
  const [kpi, setKpi] = useState({ objective: '전사 목표를 설정해주세요.', deadline: '' });
  const [isEditingKpi, setIsEditingKpi] = useState(false);
  const [kpiForm, setKpiForm] = useState({ objective: '', deadline: '' });

  // 미션 상태
  const [missions, setMissions] = useState([]);
  const [newMission, setNewMission] = useState({ title: '', type: '일간' });

  useEffect(() => {
    const auth = getAuth(app);
    const unsubAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));

    // 1. 전사 KPI 실시간 로드 (단일 문서)
    const unsubKpi = onSnapshot(doc(db, 'company_kpi', 'current'), (docSnap) => {
      if (docSnap.exists()) {
        setKpi(docSnap.data());
        setKpiForm(docSnap.data());
      }
    });

    // 2. 전사 미션 실시간 로드
    const unsubMissions = onSnapshot(query(collection(db, 'employee_missions'), orderBy('createdAt', 'desc')), (snap) => {
      setMissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAuth(); unsubKpi(); unsubMissions(); };
  }, []);

  // 👑 마스터 권한 확인 (대표님 이메일 하드와이어링)
  const isMaster = currentUser?.email === 'nova78jyg@gmail.com';

  // KPI 저장 (마스터 전용)
  const handleSaveKpi = async () => {
    if (!isMaster) return;
    await setDoc(doc(db, 'company_kpi', 'current'), {
      ...kpiForm,
      updatedAt: serverTimestamp()
    });
    setIsEditingKpi(false);
  };

  // 개인 미션 등록
  const handleAddMission = async (e) => {
    e.preventDefault();
    if (!newMission.title.trim() || !currentUser) return;
    
    await addDoc(collection(db, 'employee_missions'), {
      title: newMission.title,
      type: newMission.type, // 일간, 주간, 월간
      isCompleted: false,
      authorEmail: currentUser.email,
      authorName: currentUser.displayName || currentUser.email.split('@')[0],
      createdAt: serverTimestamp()
    });
    setNewMission({ ...newMission, title: '' });
  };

  // 미션 완료 토글 (본인 것만 가능)
  const toggleMission = async (mission) => {
    if (currentUser?.email !== mission.authorEmail && !isMaster) {
      return alert("본인의 미션만 체크할 수 있습니다.");
    }
    await updateDoc(doc(db, 'employee_missions', mission.id), {
      isCompleted: !mission.isCompleted
    });
  };

  // 미션 삭제
  const deleteMission = async (mission) => {
    if (currentUser?.email !== mission.authorEmail && !isMaster) return;
    if (window.confirm("이 미션을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, 'employee_missions', mission.id));
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up h-full min-h-[600px]">
      
      {/* 👑 Section A: 전사 단기 목표 (KPI) 보드 */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.15)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-black px-3 py-1 rounded-full border border-indigo-500/30 tracking-widest uppercase">
            Global KPI
          </span>
          {isMaster && !isEditingKpi && (
            <button onClick={() => setIsEditingKpi(true)} className="text-indigo-400 hover:text-white text-xs font-bold bg-slate-800/50 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors">
              목표 수정 ✏️
            </button>
          )}
        </div>

        {isEditingKpi ? (
          <div className="space-y-4 relative z-10 bg-slate-900/80 p-5 rounded-xl border border-indigo-500/50">
            <input type="text" placeholder="예: 이번 달 부트캠프 VIP 10명 전환 달성" value={kpiForm.objective} onChange={e => setKpiForm({...kpiForm, objective: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-400 text-lg font-bold" />
            <div className="flex gap-4">
              <input type="text" placeholder="마감일 (예: 6월 30일)" value={kpiForm.deadline} onChange={e => setKpiForm({...kpiForm, deadline: e.target.value})} className="w-1/3 bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-400 text-sm" />
              <div className="flex gap-2 flex-1 justify-end">
                <button onClick={() => setIsEditingKpi(false)} className="px-5 py-2 rounded-xl font-bold text-slate-400 hover:text-white bg-slate-800">취소</button>
                <button onClick={handleSaveKpi} className="px-5 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg">저장하기</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight break-keep mb-3">
              "{kpi.objective}"
            </h2>
            {kpi.deadline && (
              <p className="text-indigo-300 font-bold text-sm">🎯 Target Deadline : {kpi.deadline}</p>
            )}
          </div>
        )}
      </div>

      {/* 🚀 Section B: 자율 미션 보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* 미션 등록 패널 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-fit">
          <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
            <span className="text-rose-400">🔥</span> 새로운 미션 선언
          </h3>
          <form onSubmit={handleAddMission} className="space-y-4">
            <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700">
              {['일간', '주간', '월간'].map(type => (
                <button 
                  key={type} type="button" 
                  onClick={() => setNewMission({...newMission, type})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${newMission.type === type ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <textarea 
              placeholder="스스로 달성할 미션을 입력하세요." 
              value={newMission.title} onChange={e => setNewMission({...newMission, title: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-rose-500 text-sm h-28 resize-none custom-scrollbar"
              required
            />
            <button type="submit" className="w-full bg-slate-800 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold py-3 rounded-xl text-sm transition-all shadow-sm">
              미션 등록하기
            </button>
          </form>
        </div>

        {/* 팀 미션 현황판 */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-[600px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-black text-lg flex items-center gap-2">
              <span className="text-emerald-400">✓</span> 구성원 미션 현황
            </h3>
            <span className="text-slate-400 text-xs font-bold">진행률 표시</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {missions.length === 0 && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl">
                <p className="text-slate-500 font-bold text-sm">등록된 미션이 없습니다.</p>
              </div>
            )}
            
            {missions.map(mission => {
              const isMine = currentUser?.email === mission.authorEmail;
              return (
                <div key={mission.id} className={`p-4 rounded-xl border transition-all flex items-start gap-4 group ${mission.isCompleted ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'}`}>
                  
                  {/* 커스텀 체크박스 */}
                  <button 
                    onClick={() => toggleMission(mission)}
                    disabled={!isMine && !isMaster}
                    className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      mission.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-slate-500 text-transparent hover:border-emerald-400'
                    } ${(!isMine && !isMaster) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        mission.type === '일간' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        mission.type === '주간' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      }`}>
                        {mission.type}
                      </span>
                      <span className="text-slate-400 text-xs font-bold">{mission.authorName}</span>
                    </div>
                    <p className={`text-sm font-medium transition-all ${mission.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {mission.title}
                    </p>
                  </div>

                  {/* 삭제 버튼 (본인 또는 마스터만 표시) */}
                  {(isMine || isMaster) && (
                    <button onClick={() => deleteMission(mission)} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-opacity p-1">
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}