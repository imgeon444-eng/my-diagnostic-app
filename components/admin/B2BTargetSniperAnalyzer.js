'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function B2BTargetSniperAnalyzer() {
  const [analysisLogs, setAnalysisLogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    channels: { web: 0, youtube: 0, insta: 0 },
    topKeywords: []
  });

  useEffect(() => {
    // 💡 2층 URL 분석기 데이터베이스 연동
    const q = query(collection(db, "url_analysis"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      
      // 🚀 신형 백엔드 데이터 호환 어댑터 적용
      const logs = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // 1. 플랫폼 명칭 호환 처리 (instagram -> insta, website -> web)
        let mappedChannel = 'web';
        if (data.platform === 'youtube') mappedChannel = 'youtube';
        if (data.platform === 'instagram' || data.channel === 'insta') mappedChannel = 'insta';

        return {
          id: doc.id,
          channel: mappedChannel,
          // 오늘 수정한 백엔드 구조에 맞춰 URL과 키워드(카테고리) 강제 매핑
          url: data.targetUrl ? decodeURIComponent(data.targetUrl) : (data.url || 'URL 없음'),
          keyword: data.publicReport?.category || data.keyword || '미분류',
          createdAt: data.createdAt || { toDate: () => new Date() }
        };
      });
      
      // 임시 목업 데이터 믹스 (초기 화면이 비어보이지 않도록 시각화)
      const displayLogs = logs.length > 0 ? logs : [
        { id: '1', channel: 'youtube', url: 'youtube.com/shorts/...', keyword: '비즈니스/동기부여', createdAt: { toDate: () => new Date() } },
        { id: '2', channel: 'insta', url: 'instagram.com/p/...', keyword: '뷰티/코스메틱', createdAt: { toDate: () => new Date(Date.now() - 3600000) } },
        { id: '3', channel: 'web', url: 'naver.com/place/...', keyword: '지역 맛집/F&B', createdAt: { toDate: () => new Date(Date.now() - 7200000) } },
        { id: '4', channel: 'youtube', url: 'youtube.com/watch?...', keyword: 'IT/테크 리뷰', createdAt: { toDate: () => new Date(Date.now() - 10800000) } },
        { id: '5', channel: 'youtube', url: 'youtube.com/shorts/...', keyword: '비즈니스/동기부여', createdAt: { toDate: () => new Date(Date.now() - 14400000) } },
      ];

      setAnalysisLogs(displayLogs);

      // 통계 계산 로직
      let web = 0, youtube = 0, insta = 0;
      const keywordCounts = {};

      displayLogs.forEach(log => {
        if (log.channel === 'web') web++;
        if (log.channel === 'youtube') youtube++;
        if (log.channel === 'insta') insta++;

        if (log.keyword) {
          keywordCounts[log.keyword] = (keywordCounts[log.keyword] || 0) + 1;
        }
      });

      const total = web + youtube + insta || 1; // 0 나누기 방지
      const sortedKeywords = Object.entries(keywordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5) // 상위 5개 추출
        .map(([name, count]) => ({ name, count, percent: Math.round((count / displayLogs.length) * 100) }));

      setStats({
        total: displayLogs.length,
        channels: {
          web: Math.round((web / total) * 100),
          youtube: Math.round((youtube / total) * 100),
          insta: Math.round((insta / total) * 100),
        },
        topKeywords: sortedKeywords
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full space-y-6">
      
      {/* 📊 상단 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* 채널별 관심도 (미니 데이터랩) */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:col-span-2 shadow-lg">
          <h3 className="text-white font-black text-lg mb-6 flex items-center gap-2">
            📊 플랫폼 채널별 고객 관심도
            <span className="text-xs font-medium text-slate-400 font-normal ml-2">실시간 URL 분석 점유율</span>
          </h3>
          
          <div className="space-y-5">
            {/* 유튜브 프로그레스 바 */}
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-bold text-red-400 flex items-center gap-1">▶️ YouTube</span>
                <span className="text-sm font-black text-white">{stats.channels.youtube}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${stats.channels.youtube}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 인스타그램 프로그레스 바 */}
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-bold text-pink-400 flex items-center gap-1">📸 Instagram</span>
                <span className="text-sm font-black text-white">{stats.channels.insta}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-600 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${stats.channels.insta}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 웹사이트 프로그레스 바 */}
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-bold text-blue-400 flex items-center gap-1">🌐 Web / Blog</span>
                <span className="text-sm font-black text-white">{stats.channels.web}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-3 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${stats.channels.web}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🏆 인기 장르/업종 랭킹 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2">
            🏆 분석 키워드 랭킹
          </h3>
          <div className="flex-1 bg-slate-900/50 rounded-xl p-4 border border-slate-800 flex flex-col gap-3">
            {stats.topKeywords.length > 0 ? stats.topKeywords.map((kw, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-amber-500 text-amber-900' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-slate-400'}`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors truncate max-w-[120px]">{kw.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{kw.count}건</span>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{kw.percent}%</span>
                </div>
              </div>
            )) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-slate-500 text-sm">데이터 수집 중...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔍 실시간 URL 분석 로그 */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
          <h3 className="text-white font-black text-base">🔍 실시간 고객 분석 로그 (Recent Logs)</h3>
          <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
            총 {stats.total}건 분석됨
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4 font-bold">시간</th>
                <th className="px-6 py-4 font-bold">플랫폼</th>
                <th className="px-6 py-4 font-bold">분석 대상 URL</th>
                <th className="px-6 py-4 font-bold">감지된 업종/장르</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {analysisLogs.slice(0, 10).map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {(() => {
                      if (!log.createdAt) return '방금 전';
                      try {
                        const d = log.createdAt.toDate ? log.createdAt.toDate() : (log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt));
                        return isNaN(d.getTime()) ? '방금 전' : d.toLocaleString('ko-KR');
                      } catch (e) {
                        return '방금 전';
                      }
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    {log.channel === 'youtube' && <span className="bg-red-500/10 text-red-400 text-[10px] font-black px-2 py-1 rounded border border-red-500/20">YOUTUBE</span>}
                    {log.channel === 'insta' && <span className="bg-pink-500/10 text-pink-400 text-[10px] font-black px-2 py-1 rounded border border-pink-500/20">INSTAGRAM</span>}
                    {log.channel === 'web' && <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-2 py-1 rounded border border-blue-500/20">WEB</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono truncate max-w-[200px] md:max-w-xs">
                    {log.url}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-bold truncate max-w-[150px]">
                    {log.keyword}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}