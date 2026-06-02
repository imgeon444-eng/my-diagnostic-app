'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
// 💡 추가: deleteDoc 모듈 임포트
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

// ----------------------------------------------------------------------
// 🏷️ 리드 전용 카드 컴포넌트
function LeadCard({ lead, onDragStart, onClick, onDelete }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => onClick(lead)}
      className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all group relative"
    >
      <div className="flex justify-between items-start mb-3 pointer-events-none">
        <div>
          <h3 className="text-white font-bold text-sm md:text-base">{lead.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{lead.company}</p>
        </div>
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
      
      {/* 💡 하단 영역: 클릭 방지(pointer-events) 레이아웃 분리 */}
      <div className="flex justify-between items-end mt-4">
        <div className="space-y-2 pointer-events-none">
          <div className="flex items-center gap-2 text-slate-300 text-xs">
            <span>📞</span> {lead.contact}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
            <span>⏱️</span> {lead.date}
          </div>
        </div>
        
        {/* 🚨 삭제 버튼: e.stopPropagation() 으로 모달 열림 방지 */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete(lead.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
          title="데이터 삭제"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity text-center pointer-events-none">
        <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">상세 보기 클릭</span>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 🔍 고객 상세 프로필 모달 
function LeadDetailModal({ lead, isOpen, onClose }) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center p-4 animate-fade-in-up">
      <div className="bg-[#090E17] border border-slate-700 rounded-[2rem] w-full max-w-2xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
              <span className="text-2xl font-black text-white">{lead.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl md:text-3xl font-black text-white">{lead.name}</h2>
                <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                  {lead.status}
                </span>
              </div>
              <p className="text-slate-400 font-medium">{lead.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">진단 스코어</p>
              <p className="text-2xl font-black text-emerald-400">{lead.score > 0 ? `${lead.score} / 45점` : '진단 안함'}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">연락처</p>
              <p className="text-sm font-bold text-slate-200">{lead.contact}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 overflow-hidden">
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">이메일</p>
              <p className="text-sm font-bold text-slate-200 truncate">{lead.email || '미입력'}</p>
            </div>
          </div>

          {lead.painPoint && (
            <div className="bg-blue-900/10 border border-blue-500/20 p-5 rounded-2xl mb-8 relative">
              <span className="absolute -top-3 left-4 bg-[#090E17] text-blue-400 text-[10px] font-black uppercase px-2 tracking-widest border border-blue-500/20 rounded-md">
                Customer Pain Point
              </span>
              <p className="text-slate-300 font-medium leading-relaxed mt-2 text-sm md:text-base break-keep">
                "{lead.painPoint}"
              </p>
            </div>
          )}

          <div className="border-t border-slate-800 pt-6 flex justify-between items-center text-xs font-medium text-slate-500">
            <p>데이터 ID : {lead.id}</p>
            <p>최초 접수일 : {lead.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
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
// 📋 메인 칸반보드 컴포넌트
export default function KanbanBoard({ 
  collectionName = "bootcamp_leads", 
  title = "세일즈 파이프라인", 
  columns = ['상담 대기', '연락 완료', '결제 대기', '등록 완료'] 
}) {
  const [leads, setLeads] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
          score: data.totalScore || 0,
          painPoint: data.shortPainPoint || '', 
          status: data.status || columns[0], 
          date: data.createdAt?.toDate().toLocaleString() || new Date().toLocaleString(),
        };
      });
      setLeads(leadData);
    });
    return () => unsubscribe();
  }, [collectionName, columns]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };
  
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain'); 
    if (!leadId) return;
    
    const leadRef = doc(db, collectionName, leadId);
    await updateDoc(leadRef, { status: newStatus });
  };

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

  const handleCardClick = (lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  // 💡 신규 기능: 데이터베이스에서 삭제하는 함수
  const handleDeleteLead = async (leadId) => {
    if (window.confirm("이 고객 데이터를 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      try {
        await deleteDoc(doc(db, collectionName, leadId));
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("데이터 삭제 중 오류가 발생했습니다.");
      }
    }
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
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-sm font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> 수동 데이터 추가
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto pb-4">
        {columns.map(status => (
          <div 
            key={status} 
            onDragOver={handleDragOver} 
            onDrop={(e) => handleDrop(e, status)} 
            className="flex flex-col bg-slate-900/50 rounded-2xl p-4 border border-slate-800 min-h-[400px] lg:min-h-[600px] min-w-[280px]"
          >
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                {status}
              </h3>
              <span className="bg-slate-800 text-slate-400 text-xs font-black px-2.5 py-1 rounded-full border border-slate-700">
                {leads.filter(l => l.status === status).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 h-full custom-scrollbar overflow-y-auto pr-1">
              {leads.filter(lead => lead.status === status).map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onDragStart={handleDragStart}
                  onClick={handleCardClick}
                  onDelete={handleDeleteLead} // 💡 추가: 삭제 이벤트 전달
                />
              ))}
              
              {leads.filter(lead => lead.status === status).length === 0 && (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800/50 rounded-xl">
                  <p className="text-slate-600 text-xs font-bold">카드를 이곳으로 드래그</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddLead} />
      
      <LeadDetailModal 
        lead={selectedLead} 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
      />
    </div>
  );
}