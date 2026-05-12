'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebase'; // firebase.js 경로 (필요시 수정)

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    // Firebase가 현재 로그인된 사람의 신분증을 확인합니다.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true); // 통과
      } else {
        setAuthenticated(false); // 미승인
        // 로그인 페이지가 아닌 곳을 가려고 하면 로그인 페이지로 쫓아냅니다.
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // 1. 신분증 검사 중일 때 띄워줄 로딩 화면
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090E17] flex flex-col items-center justify-center selection:bg-cyan-500/30">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
        <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase animate-pulse">
          Security Checkpoint...
        </p>
      </div>
    );
  }

  // 2. 신분증이 없고, 가려는 곳이 로그인 페이지도 아니면 화면을 아예 안 보여줌 (깜빡임 방지)
  if (!authenticated && pathname !== '/admin/login') {
    return null;
  }

  // 3. 통과된 사람에게만 진짜 화면(children)을 보여줍니다.
  return <>{children}</>;
}