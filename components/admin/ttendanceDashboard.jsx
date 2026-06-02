'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AttendanceDashboard() {
  const [employees, setEmployees] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newEmp, setNewEmp] = useState({ name: '', email: '' });
  const [isClocking, setIsClocking] = useState(false);

  // 파이어베이스에서 직원 명부 및 출근 로그 실시간 로딩
  useEffect(() => {
    const unsubEmp = onSnapshot(query(collection(db, 'hr_employees'), orderBy('createdAt', 'desc')), (snap) => {
      setEmployees(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    const unsubLogs = onSnapshot(query(collection(db, 'attendance_logs'), orderBy('timestamp', 'desc')), (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data(), timeStr: d.data().timestamp?.toDate().toLocaleString() || '시간 기록 중' })));
    });

    return () => { unsubEmp(); unsubLogs(); };
  }, []);

  // 1. 직원 신규 등록 로직
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.email) return;
    
    await addDoc(collection(db, 'hr_employees'), { 
      name: newEmp.name, 
      email: newEmp.email, 
      role: '사원',
      createdAt: serverTimestamp() 
    });
    setNewEmp({ name: '', email: '' });
  };

  // 2. 해당 직원의 출근 버튼 클릭 시 로직
  const handleClockIn = async (emp) => {
    if (isClocking) return;
    setIsClocking(true);
    
    try {
      await addDoc(collection(db, 'attendance_logs'), {
        email: emp.email,
        name: emp.name,
        type: '출근',
        timestamp: serverTimestamp(),
        status: '정상 처리'
      });

      const timeStr = new Date().toLocaleString('ko-KR');
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emp.email, name: emp.name, time: timeStr })
      });

      if (res.ok) alert(`${emp.name}님의 출근이 기록되었으며, 대표님(nova78jyg@gmail.com)께 자동 보고되었습니다.`);
      else alert('DB 기록은 성공했으나, 이메일 알림에 실패했습니다.');
      
    } catch (error) {
      console.error(error);
      alert('시스템 에러가 발생했습니다.');
    } finally {
      setIsClocking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      
      {/* 왼쪽: 직원 명부 관리 */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-[600px]">
        <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
          <span className="text-emerald-400">👥</span> 직원 명부 등록
        </h3>
        
        <form onSubmit={handleAddEmployee} className="mb-6 space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <input type="text" placeholder="직원 이름" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-indigo-500" />
          <input type="email" placeholder="구글 이메일 (업무용)" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white outline-none focus:border-indigo-500" />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
            + 직원 추가하기
          </button>
        </form>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {employees.map(emp => (
            <div key={emp.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
              <div>
                <p className="text-white font-bold text-sm">{emp.name}</p>
                <p className="text-slate-400 text-[10px]">{emp.email}</p>
              </div>
              <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded font-bold">승인됨</span>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽: 키오스크 출근판 & 로그 */}
      <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col h-[600px]">
        <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
          <span className="text-indigo-400">⏱️</span> 실시간 근태(출근) 키오스크
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          
          {/* 출근 버튼 리스트 */}
          <div className="overflow-y-auto custom-scrollbar space-y-3 pr-2">
            <h4 className="text-slate-400 text-xs font-bold mb-3 border-b border-slate-800 pb-2">출근 처리 (본인 클릭)</h4>
            {employees.length === 0 && <p className="text-slate-600 text-sm">등록된 직원이 없습니다.</p>}
            {employees.map(emp => (
              <div key={`kiosk-${emp.id}`} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex justify-between items-center hover:border-indigo-500/50 transition-colors">
                <span className="text-white font-bold text-base">{emp.name}</span>
                <button 
                  onClick={() => handleClockIn(emp)}
                  disabled={isClocking}
                  className="bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-300 hover:text-white font-bold px-4 py-2 rounded-lg text-sm transition-all"
                >
                  출근하기
                </button>
              </div>
            ))}
          </div>

          {/* 실시간 로그 기록 */}
          <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 overflow-y-auto custom-scrollbar">
            <h4 className="text-slate-500 text-xs font-bold mb-3 border-b border-slate-800 pb-2">시스템 로그</h4>
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 text-sm">
                  <span className="text-slate-600 font-mono text-[10px] shrink-0 mt-0.5">{log.timeStr.split(' ')[3] || ''}</span>
                  <div>
                    <p className="text-emerald-400 font-bold text-xs">{log.name} <span className="text-slate-400 font-medium">님이 출근하셨습니다.</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}