'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

// ----------------------------------------------------------------------
// 🏷️ 리드 전용 카드 컴포넌트 
function LeadCard({ lead, onDragStart, onClick, onDelete }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => onClick(lead)}
      // 💡 모바일 최적화: 여백 조정 및 터치 피드백 강화
      className="bg-slate-800/80 border border-slate-700 p-3 md:p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all group relative shrink-0 active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-2 md:mb-3 pointer-events-none">
        <div>
          <h3 className="text-white font-bold text-sm md:text-base leading-tight break-keep">{lead.name}</h3>
          <p className="text-slate-400 text-[10px] md:text-xs mt-0.5 truncate max-w-[150px] sm:max-w-[180px]">{lead.company}</p>
        </div>
        {lead.score > 0 ? (
          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md border border-emerald-500/30 shrink-0">
            {lead.score}점
          </span>
        ) : (
          <span className="bg-blue-500/20 text-blue-400 text-[9px] md:text-[10px] font-black px-2 py-1 rounded-md border border-blue-500/30 shrink-0">
            VIP
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-3 md:mt-4">
        <div className="space-y-1.5 pointer-events-none w-full">
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] md:text-xs font-mono">
            <span>📞</span> {lead.contact}
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[9px] md:text-[10px]">
            <span>⏱️</span> {lead.date}
          </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
          className="opacity-100 md:opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 🔍 고객 상세 프로필 모달 (모바일 UX 고도화 탑재)
function LeadDetailModal({ lead, columns, isOpen, onClose, onStatusChange }) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-end md:items-center p-0 md:p-4 animate-fade-in-up">
      <div className="bg-[#090E17] border border-slate-700 rounded-t-[2rem] md:rounded-[2rem] w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-500 z-10"></div>
        {/* 모바일 하향 스와이프 손잡이 UI */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mt-3 mb-1 md:hidden"></div>

        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white transition-colors p-2 z-10">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-start gap-4 mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-xl md:text-2xl font-black text-white">{lead.name.charAt(0)}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl md:text-3xl font-black text-white break-keep">{lead.name}</h2>
                <span className="bg-slate-800 text-slate-300 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">
                  {lead.status}
                </span>
              </div>
              <p className="text-slate-400 font-medium text-xs md:text-sm">{lead.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700/50 col-span-2 md:col-span-1 flex flex-row md:flex-col justify-between items-center md:items-start">
              <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-0 md:mb-1">진단 스코어</p>
              <p className="text-lg md:text-2xl font-black text-emerald-400">{lead.score > 0 ? `${lead.score} / 45점` : '진단 안함'}</p>
            </div>
            <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700/50 overflow-hidden">
              <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1">연락처</p>
              <p className="text-xs md:text-sm font-bold text-slate-200 font-mono truncate">{lead.contact}</p>
            </div>
            <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700/50 overflow-hidden">
              <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1">이메일</p>
              <p className="text-xs md:text-sm font-bold text-slate-200 truncate">{lead.email || '미입력'}</p>
            </div>
          </div>

          {lead.painPoint && (
            <div className="bg-blue-900/10 border border-blue-500/20 p-4 md:p-5 rounded-2xl mb-6 relative">
              <span className="absolute -top-2.5 left-4 bg-[#090E17] text-blue-400 text-[9px] md:text-[10px] font-black uppercase px-2 tracking-widest border border-blue-500/20 rounded-md">
                Customer Pain Point
              </span>
              <p className="text-slate-300 font-medium leading-relaxed mt-2 text-xs md:text-sm break-keep">
                "{lead.painPoint}"
              </p>
            </div>
          )}

          {/* 🚀 핵심 UX 혁신: 터치 불가능한 모바일을 위한 원클릭 상태 이동 버튼 */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 mb-6 md:mb-0">
            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="text-blue-500">👆</span> 모바일 상태 변경 (터치 이동)
            </p>
            <div className="flex flex-wrap gap-2">
              {columns.map(status => (
                <button
                  key={`btn-${status}`}
                  onClick={() => onStatusChange(lead.id, status)}
                  className={`flex-1 min-w-[70px] px-2 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                    lead.status === status 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border-transparent' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
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
    e.preventDefault(); onAdd(formData);
    setFormData({ name: '', company: '', contact: '', email: '' }); onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-end md:items-center p-0 md:p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-t-2xl md:rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
        <div className="w-10 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 md:hidden"></div>
        <h2 className="text-lg md:text-xl font-black text-white mb-4">수동 접수</h2>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <input type="text" placeholder="성함 / 직함" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" />
          <input type="text" placeholder="회사명 / 브랜드명" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" />
          <input type="text" placeholder="연락처" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" />
          <input type="email" placeholder="이메일" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:border-blue-500" />
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold text-sm">취소</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md">추가하기</button>
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
          date: data.createdAt?.toDate().toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) || '방금 전',
        };
      });
      setLeads(leadData);
    });
    return () => unsubscribe();
  }, [collectionName, columns]);

  const handleDragStart = (e, id) => e.dataTransfer.setData('text/plain', id);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain'); 
    if (!leadId) return;
    await updateDoc(doc(db, collectionName, leadId), { status: newStatus });
  };

  // 💡 [신규] 상세 모달에서 터치로 상태를 변경하는 함수
  const handleStatusChangeTouch = async (leadId, newStatus) => {
    await updateDoc(doc(db, collectionName, leadId), { status: newStatus });
    // 변경 후 모달을 닫아주어 스무스한 UX 제공
    setIsDetailModalOpen(false);
  };

  const handleAddLead = async (newLead) => {
    await addDoc(collection(db, collectionName), {
      clientTitle: newLead.name, clientName: newLead.company,
      clientContact: newLead.contact, clientEmail: newLead.email,
      totalScore: 0, status: columns[0], createdAt: new Date()
    });
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm("이 고객 데이터를 완전히 삭제하시겠습니까?")) {
      try { await deleteDoc(doc(db, collectionName, leadId)); } 
      catch (error) { alert("삭제 오류 발생"); }
    }
  };

  return (
    <div className="w-full">
      <header className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${collectionName === 'diagnostics' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            {title}
          </h2>
          <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">좌우로 스와이프하여 확인하세요</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs md:text-sm font-bold py-2 md:py-2.5 px-4 md:px-5 rounded-xl shadow-sm transition-all w-full sm:w-fit"
        >
          + 데이터 추가
        </button>
      </header>

      {/* 🚀 핵심 UI 혁신: 모바일 횡스크롤(Horizontal Scroll) + 스냅핑(Snapping) 적용 */}
      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar items-start">
        {columns.map(status => (
          <div 
            key={status} 
            onDragOver={handleDragOver} 
            onDrop={(e) => handleDrop(e, status)} 
            // 💡 폭(width)을 모바일 화면(85vw)에 맞추고 정중앙 스냅(snap-center) 적용
            className="flex flex-col bg-slate-900/50 rounded-2xl p-3 md:p-4 border border-slate-800 h-[65vh] min-h-[450px] lg:min-h-[600px] w-[85vw] sm:w-[300px] lg:w-[320px] shrink-0 snap-center"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800 shrink-0">
              <h3 className="text-sm md:text-base font-bold text-slate-300">{status}</h3>
              <span className="bg-slate-800 text-slate-400 text-xs font-black px-2.5 py-1 rounded-full border border-slate-700">
                {leads.filter(l => l.status === status).length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3 h-full custom-scrollbar overflow-y-auto pr-1 pb-2">
              {leads.filter(lead => lead.status === status).map(lead => (
                <LeadCard 
                  key={lead.id} lead={lead} 
                  onDragStart={handleDragStart}
                  onClick={(l) => { setSelectedLead(l); setIsDetailModalOpen(true); }}
                  onDelete={handleDeleteLead} 
                />
              ))}
              
              {leads.filter(lead => lead.status === status).length === 0 && (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800/50 rounded-xl m-1 opacity-50">
                  <p className="text-slate-500 text-xs font-bold">비어있음</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddLead} />
      
      <LeadDetailModal 
        lead={selectedLead} 
        columns={columns}
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)}
        onStatusChange={handleStatusChangeTouch} // 💡 터치 이동 함수 프롭스 전달
      />
    </div>
  );
}