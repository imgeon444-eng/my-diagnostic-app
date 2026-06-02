'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, serverTimestamp, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, app } from '../../lib/firebase';

// 💡 확장된 10가지 컬러 팔레트
const PALETTE = [
  'bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-teal-500', 
  'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
];

export default function CalendarDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [colorMap, setColorMap] = useState({}); // 컬러 매핑 데이터 상태
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newEvent, setNewEvent] = useState({ title: '', color: 'bg-blue-500' });

  useEffect(() => {
    const auth = getAuth(app);
    const unsubAuth = onAuthStateChanged(auth, (user) => setCurrentUser(user));

    // 일정 데이터 실시간 로드
    const unsubEvents = onSnapshot(query(collection(db, 'shared_schedules')), (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 💡 [신규] 컬러 매핑 데이터 실시간 로드
    const unsubColors = onSnapshot(collection(db, 'calendar_colors'), (snap) => {
      const map = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setColorMap(map);
    });

    return () => { unsubAuth(); unsubEvents(); unsubColors(); };
  }, []);

  // 달력 렌더링 엔진
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // 💡 [신규] 팀원 컬러 지정/해제 로직
  const handleClaimColor = async (colorClass) => {
    if (!currentUser) return;
    const myEmail = currentUser.email;
    const myName = currentUser.displayName || myEmail.split('@')[0];
    const isMaster = myEmail === 'nova78jyg@gmail.com';

    // 1. 이미 누군가 등록한 컬러일 경우
    if (colorMap[colorClass]) {
      if (isMaster) {
        if(window.confirm(`[대표 권한] ${colorMap[colorClass].name}님의 컬러 지정을 해제하시겠습니까?`)) {
          await deleteDoc(doc(db, 'calendar_colors', colorClass));
        }
      } else if (colorMap[colorClass].email === myEmail) {
        if(window.confirm(`내 컬러 지정을 해제하시겠습니까?`)) {
          await deleteDoc(doc(db, 'calendar_colors', colorClass));
        }
      } else {
        alert(`이미 ${colorMap[colorClass].name}님이 사용 중인 컬러입니다.`);
      }
      return;
    }

    // 2. 빈 컬러를 클릭했을 때 (기존 내 컬러가 있다면 옮길지 물어봄)
    const existingMyColor = Object.keys(colorMap).find(key => colorMap[key].email === myEmail);
    if (existingMyColor) {
      if(!window.confirm(`현재 사용 중인 컬러가 있습니다. 이 컬러로 변경하시겠습니까?`)) return;
      await deleteDoc(doc(db, 'calendar_colors', existingMyColor));
    }

    // 3. 파이어베이스에 컬러 등록
    await setDoc(doc(db, 'calendar_colors', colorClass), { name: myName, email: myEmail });
  };

  // 일정 추가 모달 열기 (내 컬러 자동 선택)
  const openAddModal = (day) => {
    const myEmail = currentUser?.email;
    const myClaimedColor = Object.keys(colorMap).find(key => colorMap[key]?.email === myEmail);

    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setSelectedDate(`${year}-${formattedMonth}-${formattedDay}`);
    setNewEvent({ title: '', color: myClaimedColor || 'bg-blue-500' });
    setIsModalOpen(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    
    await addDoc(collection(db, 'shared_schedules'), {
      date: selectedDate,
      title: newEvent.title,
      color: newEvent.color,
      author: currentUser?.displayName || currentUser?.email.split('@')[0] || '직원',
      authorEmail: currentUser?.email,
      createdAt: serverTimestamp()
    });
    
    setIsModalOpen(false);
  };

  const handleDeleteEvent = async (e, event) => {
    e.stopPropagation();
    const isMaster = currentUser?.email === 'nova78jyg@gmail.com';
    const isMine = currentUser?.email === event.authorEmail;
    
    if (!isMaster && !isMine) return alert("본인이 등록한 일정만 삭제할 수 있습니다.");
    if (window.confirm(`'${event.title}' 일정을 삭제하시겠습니까?`)) {
      await deleteDoc(doc(db, 'shared_schedules', event.id));
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-fade-in-up h-full min-h-[600px] flex flex-col">
      
      {/* 캘린더 헤더 */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-white font-black text-2xl flex items-center gap-3">
          <span className="text-blue-400">📅</span> 전사 통합 캘린더
        </h3>
        <div className="flex items-center gap-4 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
          <button onClick={prevMonth} className="text-slate-400 hover:text-white px-3 font-bold">&lt;</button>
          <span className="text-white font-black text-lg min-w-[120px] text-center">{year}년 {month + 1}월</span>
          <button onClick={nextMonth} className="text-slate-400 hover:text-white px-3 font-bold">&gt;</button>
        </div>
      </div>

      {/* 💡 [신규] 팀원 컬러 매핑 범례 (Legend) UI */}
      <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-slate-300 font-bold text-xs tracking-wider mr-2">🎨 구성원 컬러 매핑</span>
        {PALETTE.map(color => {
          const isTaken = !!colorMap[color];
          const ownerName = isTaken ? colorMap[color].name : '미지정 (클릭)';
          const isMine = colorMap[color]?.email === currentUser?.email;
          
          return (
            <button
              key={color}
              onClick={() => handleClaimColor(color)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                isMine ? 'border-emerald-400 bg-emerald-400/10' : 
                isTaken ? 'border-transparent bg-slate-700/50 opacity-60 hover:opacity-100' : 
                'border-dashed border-slate-600 hover:border-slate-400'
              }`}
            >
              <div className={`w-3 h-3 rounded-full shadow-sm ${color}`}></div>
              <span className={`text-[11px] font-bold ${isMine ? 'text-emerald-400' : 'text-slate-300'}`}>
                {ownerName}
              </span>
            </button>
          );
        })}
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div key={day} className={`text-center text-xs font-black py-2 ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{day}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
        {blanks.map((_, i) => <div key={`blank-${i}`} className="bg-slate-900/30 rounded-xl border border-slate-800/50 min-h-[100px]"></div>)}
        
        {days.map(day => {
          const formattedMonth = String(month + 1).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const dateString = `${year}-${formattedMonth}-${formattedDay}`;
          const dayEvents = events.filter(e => e.date === dateString);
          const isToday = new Date().toISOString().split('T')[0] === dateString;

          return (
            <div 
              key={day} 
              onClick={() => openAddModal(day)}
              className={`bg-slate-800/40 hover:bg-slate-700/50 rounded-xl border cursor-pointer p-2 flex flex-col transition-colors group min-h-[100px] ${isToday ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-blue-500/5' : 'border-slate-700/50 hover:border-slate-500'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-bold ${isToday ? 'bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md' : 'text-slate-300'} group-hover:text-white`}>{day}</span>
                <span className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-500 font-bold transition-opacity">+</span>
              </div>
              
              <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                {dayEvents.map(event => (
                  <div key={event.id} className={`${event.color} bg-opacity-20 border border-white/10 px-1.5 py-1 rounded text-[10px] text-white flex justify-between items-center group/item`}>
                    <span className="truncate flex-1 font-medium">{event.title}</span>
                    <button onClick={(e) => handleDeleteEvent(e, event)} className="opacity-0 group-hover/item:opacity-100 text-white/50 hover:text-rose-400 ml-1 font-bold">✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 일정 추가 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-black text-white mb-1">일정 등록</h2>
            <p className="text-slate-400 text-xs mb-4">{selectedDate}</p>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input type="text" placeholder="일정 내용을 입력하세요" required autoFocus value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 text-sm" />
              
              <div>
                <p className="text-slate-400 text-xs font-bold mb-2">카테고리 색상 (자동 선택됨)</p>
                <div className="flex gap-2 flex-wrap">
                  {PALETTE.map(color => (
                    <button key={color} type="button" onClick={() => setNewEvent({...newEvent, color})} className={`w-6 h-6 rounded-full ${color} ${newEvent.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-30 hover:opacity-100'} transition-all`}></button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 text-sm">취소</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 text-sm">등록하기</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}