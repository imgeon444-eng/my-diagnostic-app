'use client';

import Link from 'next/link';

export default function Footer({ onOpenDiagnostic }) {
  return (
    <footer className="bg-[#05080f] text-slate-400 border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* 브랜드 소개 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-[#090E17] rounded-[6px] flex items-center justify-center font-black text-cyan-300 text-xs">
                  TC
                </div>
              </div>
              <span className="font-black text-white text-lg tracking-tight">
                THE CREATORS <span className="text-cyan-400 italic">Ai</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
              비즈니스의 모든 병목을 파괴하고, 24시간 잠들지 않는 무인 세일즈 파이프라인과 AI 에이전틱 오피스를 구축하는 B2B 시스템 빌더입니다.
            </p>
            <div className="pt-2 text-xs text-slate-500 space-y-1 font-mono">
              <p>상호: 더크리에이터즈 AI (The Creators AI)</p>
              <p>대표 전화: 051-633-3812 | 이메일: nova78jyg@gmail.com</p>
            </div>
          </div>

          {/* 주요 솔루션 */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={onOpenDiagnostic} className="hover:text-cyan-300 transition-colors text-left">
                  1층: 마케팅 체급 진단소
                </button>
              </li>
              <li>
                <Link href="/synergy-test" className="hover:text-cyan-300 transition-colors">
                  1층: AI 메타인지 진단기
                </Link>
              </li>
              <li>
                <Link href="/storybook" className="hover:text-emerald-300 transition-colors">
                  1.5층: 퍼널마케팅 공식 스토리북
                </Link>
              </li>
              <li>
                <Link href="/bootcamp-funnel" className="hover:text-cyan-300 transition-colors">
                  2층: URL 데이터 누수 분석
                </Link>
              </li>
              <li>
                <Link href="/bootcamp-sales" className="hover:text-cyan-300 transition-colors">
                  3층: 실전 부트캠프 VIP
                </Link>
              </li>
            </ul>
          </div>

          {/* 비즈니스 & 관리자 */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">System</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/admin/login" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>🔒</span> 실시간 CRM 관제탑
                </Link>
              </li>
              <li>
                <a href="tel:051-633-3812" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>📞</span> 1:1 다이렉트 유선 상담
                </a>
              </li>
              <li>
                <span className="inline-block px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold mt-2">
                  Gemini 2.5 Flash Engine v2.0
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* 하단 카피라이트 */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 The Creators AI. All rights reserved.</p>
          <p>Powered by Next.js 15 & Google Generative AI</p>
        </div>
      </div>
    </footer>
  );
}
