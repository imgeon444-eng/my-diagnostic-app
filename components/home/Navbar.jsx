'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ onOpenDiagnostic }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090E17]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* 브랜드 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#090E17] rounded-[10px] flex items-center justify-center">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-cyan-300 text-lg">
                TC
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight text-white text-lg sm:text-xl leading-none flex items-center gap-1">
              THE CREATORS <span className="text-cyan-400 italic">Ai</span>
            </span>
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              System Builder
            </span>
          </div>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          <button
            onClick={onOpenDiagnostic}
            className="text-xs lg:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            📋 1층 진단
          </button>
          <Link
            href="/synergy-test"
            className="text-xs lg:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            🧠 AI 메타인지
          </Link>
          <Link
            href="/storybook"
            className="text-xs lg:text-sm font-bold text-emerald-300 hover:text-emerald-100 px-3 py-2 rounded-full hover:bg-emerald-500/10 transition-colors"
          >
            📖 1.5층 스토리북
          </Link>
          <Link
            href="/bootcamp-funnel"
            className="text-xs lg:text-sm font-bold text-slate-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            📊 2층 URL 데이터랩
          </Link>
          <Link
            href="/bootcamp-sales"
            className="text-xs lg:text-sm font-bold text-cyan-300 hover:text-cyan-100 px-3 py-2 rounded-full hover:bg-cyan-500/10 transition-colors"
          >
            🔥 3층 부트캠프 VIP
          </Link>
        </nav>

        {/* 우측 CTA 및 관리자 바로가기 */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenDiagnostic}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs lg:text-sm font-black px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            무료 진단 시작
          </button>
          <Link
            href="/admin/login"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
            title="관리자 CRM 관제탑"
          >
            🔒 CRM
          </Link>
        </div>

        {/* 모바일 햄버거 버튼 */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenDiagnostic}
            className="bg-blue-600 text-white text-xs font-black px-3 py-2 rounded-lg"
          >
            진단
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090E17]/95 border-b border-white/10 backdrop-blur-2xl px-6 py-6 space-y-4 animate-fade-in-up">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnostic();
              }}
              className="text-left py-3 px-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-300 font-bold text-sm"
            >
              📋 1층 마케팅 체급 진단기
            </button>
            <Link
              href="/synergy-test"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-xl bg-white/5 text-slate-200 font-bold text-sm"
            >
              🧠 1층 AI 메타인지 진단기
            </Link>
            <Link
              href="/storybook"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold text-sm"
            >
              📖 1.5층 퍼널마케팅 공식 스토리북
            </Link>
            <Link
              href="/bootcamp-funnel"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-xl bg-white/5 text-slate-200 font-bold text-sm"
            >
              📊 2층 URL 데이터랩 (누수 진단)
            </Link>
            <Link
              href="/bootcamp-sales"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 text-cyan-300 font-black text-sm"
            >
              🔥 3층 부트캠프 VIP 세일즈
            </Link>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between items-center">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-slate-400 font-bold hover:text-white"
            >
              🔒 관리자 CRM 시스템
            </Link>
            <a
              href="tel:051-633-3812"
              className="text-xs text-blue-400 font-bold"
            >
              📞 051-633-3812
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
