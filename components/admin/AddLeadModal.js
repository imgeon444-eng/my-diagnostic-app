import React, { useState } from 'react';
import { calculateLeadScore } from '../../lib/scoringEngine';

export default function AddLeadModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '', company: '', contact: '',
    budget: '1000미만', authority: '실무자', urgency: '미정', outsource: '내부병행'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // 엔진을 통해 자동 점수 계산
    const calculatedScore = calculateLeadScore({
      budget: formData.budget, authority: formData.authority,
      urgency: formData.urgency, outsource: formData.outsource
    });

    const newLead = {
      id: Date.now().toString(), // 임시 고유 ID 생성
      name: formData.name,
      company: formData.company,
      contact: formData.contact,
      status: '신규 유입',
      date: new Date().toISOString().split('T')[0],
      answers: { ...formData },
      score: calculatedScore
    };

    onAdd(newLead);
    onClose(); // 저장 후 팝업 닫기
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-4">더크리에이터즈AI 신규 리드 추가</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs font-bold text-gray-500">담당자 성함</label><input required type="text" className="w-full p-2 border rounded-lg bg-gray-50 mt-1" onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-gray-500">회사명</label><input required type="text" className="w-full p-2 border rounded-lg bg-gray-50 mt-1" onChange={e => setFormData({...formData, company: e.target.value})} /></div>
          <div><label className="text-xs font-bold text-gray-500">연락처</label><input required type="text" className="w-full p-2 border rounded-lg bg-gray-50 mt-1" onChange={e => setFormData({...formData, contact: e.target.value})} /></div>
          
          <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
            <div>
              <label className="text-xs font-bold text-gray-500">예산 규모</label>
              <select className="w-full p-2 border rounded-lg bg-gray-50 mt-1 text-sm" onChange={e => setFormData({...formData, budget: e.target.value})}>
                <option value="1000미만">1,000만 원 미만</option><option value="3000">3,000만 원</option><option value="5000이상">5,000만 원 이상</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500">결정 권한</label>
              <select className="w-full p-2 border rounded-lg bg-gray-50 mt-1 text-sm" onChange={e => setFormData({...formData, authority: e.target.value})}>
                <option value="실무자">실무자</option><option value="팀장">팀장급</option><option value="CEO">CEO/대표</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">취소</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">추가하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}