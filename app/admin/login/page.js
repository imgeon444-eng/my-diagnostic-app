'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../../lib/firebase'; // firebase.js 경로 (점 3개 주의)

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const auth = getAuth(app);

    try {
      // Firebase 본부에 이메일/비번을 보내서 확인받습니다.
      await signInWithEmailAndPassword(auth, email, password);
      
      // 확인되면 진짜 관제탑(admin 메인)으로 문을 열어줍니다.
      router.push('/admin');
    } catch (err) {
      console.error("로그인 실패:", err);
      setError('접근 권한이 없습니다. 보안 인가를 다시 확인하십시오.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090E17] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 배경 사이버틱 효과 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-xl rounded-[2rem] p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
            System Secured
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">ADMIN PORTAL</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">The Creators AI 중앙 관제탑 출입구</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Authorized Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceo@thecreators.ai"
                className="w-full bg-black/30 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Security Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/30 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-center animate-fade-in-up">
              <p className="text-rose-400 text-sm font-bold">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-white text-black hover:bg-cyan-400 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>접속 인가 요청</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-600 text-xs">본 포털은 인가된 관리자만 접근 가능하며,<br/>불법적인 접근 시도 시 IP가 추적됩니다.</p>
        </div>
      </div>
    </div>
  );
}