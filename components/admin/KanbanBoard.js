'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import LeadCard from './LeadCard';
import AddLeadModal from './AddLeadModal';

const COLUMNS = ['신규 유입', '컨택 중', '워크숍 전환', '보류'];

export default function KanbanBoard() {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. "diagnostics" 서랍장에서 실시간으로 데이터 가져오기
  useEffect(() => {
    // 진단기 코드와 동일하게 "diagnostics" 컬렉션을 바라봅니다.
    const q = query(collection(db, "diagnostics"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          // 진단기 데이터 필드명과 관리자 보드 필드명을 매칭합니다.
          name: data.clientTitle || '이름 없음',
          company: data.clientName || '회사명 없음',
          contact: data.clientContact || '연락처 없음',
          score: data.totalScore || 0,
          status: data.status || '신규 유입', // 처음에 값이 없으면 '신규 유입'
          date: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
        };
      });
      setLeads(leadData);
    });
    return () => unsubscribe();
  }, []);

  const handleDragStart = (e, id) => e.dataTransfer.setData('leadId', id);
  const handleDragOver = (e) => e.preventDefault();

  // 2. 상태 변경 시 DB 업데이트
  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const leadRef = doc(db, "diagnostics", leadId);
    await updateDoc(leadRef, { status: newStatus });
  };

  // 3. 수동 추가 시에도 "diagnostics" 서랍장에 저장
  const handleAddLead = async (newLead) => {
    const formattedLead = {
      clientTitle: newLead.name,
      clientName: newLead.company,
      clientContact: newLead.contact,
      totalScore: newLead.score,
      status: '신규 유입',
      createdAt: new Date()
    };
    await addDoc(collection(db, "diagnostics"), formattedLead);
  };

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">THE CREATORS AI CRM</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">실시간 진단기 데이터 동기화 활성화됨</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all">
          + 수동 리드 추가
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMNS.map(status => (
          <div key={status} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)} className="flex flex-col bg-gray-50/50 rounded-2xl p-4 border border-gray-200 min-h-[500px]">
            <div className="flex justify-between items-center mb-4 px-1">
              <h2 className="text-sm font-bold text-gray-700">{status}</h2>
              <span className="bg-white text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {leads.filter(l => l.status === status).length}
              </span>
            </div>
            <div className="flex flex-col gap-3 h-full">
              {leads.filter(lead => lead.status === status).map(lead => (
                <LeadCard key={lead.id} lead={lead} onDragStart={handleDragStart} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddLead} />
    </div>
  );
}