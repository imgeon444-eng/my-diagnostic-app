import React from 'react';
import { MoreHorizontal, Phone, Building, User } from 'lucide-react';

export default function LeadCard({ lead, onDragStart }) {
  // 가장 확실한 기본 색상(red, yellow, gray)으로 변경했습니다
  const getPriorityConfig = (score) => {
    if (score >= 80) return {
      label: '매우 높음',
      css: 'bg-red-500 text-white border-red-600',
      dot: 'bg-red-200'
    };
    if (score >= 50) return {
      label: '중간 순위',
      css: 'bg-yellow-100 text-yellow-800 border-yellow-400',
      dot: 'bg-yellow-500'
    };
    return {
      label: '일반 리드',
      css: 'bg-gray-100 text-gray-700 border-gray-300',
      dot: 'bg-gray-400'
    };
  };

  const priority = getPriorityConfig(lead.score);

  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, lead.id)} 
      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 cursor-grab active:cursor-grabbing transition-all group"
    >
      <div className="flex justify-between items-center mb-5">
        {/* 점수 뱃지 영역 */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black border shadow-sm ${priority.css}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${priority.dot}`}></span>
          {priority.label} | {lead.score}점
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base leading-tight">{lead.name}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-0.5">{lead.date}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Building size={14} className="text-gray-400" /> 
            <span className="truncate">{lead.company}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
            <Phone size={14} className="text-gray-400" /> 
            <span>{lead.contact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}