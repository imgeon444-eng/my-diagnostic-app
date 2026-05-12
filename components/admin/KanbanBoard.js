'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

// 🏷️ 리드 전용 카드 컴포넌트
function LeadCard({ lead, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all group"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-bold text-sm md:text-base">{lead.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{lead.company}</p>
        </div>
        {/* 진단기 점수가 있으면 점수를, 없으면 VIP 배지를 표시 */}
        {lead.score > 0 ? (
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md border border-emerald-500/30">
            {lead.score}점
          </span>
        ) : (
          <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black px-2 py-1 rounded-md border border-blue-500/30">
            VIP
          </span>
        )}
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-slate-300 text-xs">
          <span>📞</span> {lead.contact}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
          <span>⏱️</span> {lead.date}
        </div>
      </div>
    </div>
  );
}

// ➕ 수동 추가 모달 컴포넌트
function AddLeadModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: '', company: '', contact: '', email: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', company: '', contact: '', email: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
        <h2 className="text-xl font-black text-white mb-4">수동 접수</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="성함 / 직함" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500" />
          <input type="text" placeholder="회사명 / 브랜드명" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500" />
          <input type="text" placeholder="연락처" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500" />
          <input type="email" placeholder="이메일" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-500 outline-none focus:border-blue-500" />
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors">취소</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">추가하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 📋 메인 칸반보드 컴포넌트 (외부에서 데이터 통과 컬럼을 주입받는 만능 구조)
export default function KanbanBoard({ 
  collectionName = "bootcamp_leads", 
  title = "세일즈 파이프라인", 
  columns = ['상담 대기', '연락 완료', '결제 대기', '등록 완료'] 
}) {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 지정된 DB 서랍장에서 실시간 데이터 가져오기
  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.clientTitle || '이름 없음',
          company: data.clientName || '회사명 없음',
          contact: data.clientContact || '연락처 없음',
          email: data.clientEmail || '',
          score: data.totalScore || 0, // 진단기용 점수 데이터
          status: data.status || columns[0], // 초기 상태를 전달받은 첫 번째 컬럼으로 설정
          date: data.createdAt?.toDate().toLocaleString() || new Date().toLocaleString(),
        };
      });
      setLeads(leadData);
    });
    return () => unsubscribe();
  }, [collectionName, columns]);

  // 💡 드래그 버그 수정: text/plain 포맷 명시
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };
  
  const handleDragOver = (e) => e.preventDefault();

  // 2. 상태 변경 시 DB 업데이트
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain'); // 💡 버그 수정부
    if (!leadId) return;
    
    const leadRef = doc(db, collectionName, leadId);
    await updateDoc(leadRef, { status: newStatus });
  };

  // 3. 수동 추가 시 저장
  const handleAddLead = async (newLead) => {
    const formattedLead = {
      clientTitle: newLead.name,
      clientName: newLead.company,
      clientContact: newLead.contact,
      clientEmail: newLead.email,
      totalScore: 0,
      status: columns[0],
      createdAt: new Date()
    };
    await addDoc(collection(db, collectionName), formattedLead);
  };

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${collectionName === 'diagnostics' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            {title}
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">{collectionName} 데이터 실시간 동기화 중</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-sm font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> 수동 데이터 추가
        </button>
      </header>

      {/* 칸반보드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto pb-4">
        {columns.map(status => (
          <div 
            key={status} 
            onDragOver={handleDragOver} 
            onDrop={(e) => handleDrop(e, status)} 
            className="flex flex-col bg-slate-900/50 rounded-2xl p-4 border border-slate-800 min-h-[400px] lg:min-h-[600px] min-w-[280px]"
          >
            {/* 컬럼 헤더 */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                {status}
              </h3>
              <span className="bg-slate-800 text-slate-400 text-xs font-black px-2.5 py-1 rounded-full border border-slate-700">
                {leads.filter(l => l.status === status).length}
              </span>
            </div>
            
            {/* 카드 리스트 영역 */}
            <div className="flex flex-col gap-3 h-full custom-scrollbar overflow-y-auto pr-1">
              {leads.filter(lead => lead.status === status).map(lead => (
                <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
              ))}
              
              {/* 비어있을 때 안내 문구 */}
              {leads.filter(lead => lead.status === status).length === 0 && (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800/50 rounded-xl">
                  <p className="text-slate-600 text-xs font-bold">카드를 이곳으로 드래그</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddLead} />
    </div>
  );
}