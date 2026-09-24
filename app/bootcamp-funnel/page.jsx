'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  ExternalLink,
  Share2,
  RotateCcw,
  Check,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Phone,
  ShieldAlert,
  Layers,
  Compass,
  Calendar,
  Zap,
  Globe,
  ArrowRight,
  Clock,
  Target,
  DollarSign,
  Award,
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

function YoutubeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const LOADING_STEPS = [
  '대상 채널 및 트래픽 메타데이터 수집 중...',
  '잠재고객 유입 동선 및 전환 이탈 지점 정밀 스캔...',
  '업계 벤치마크 대비 세일즈 누수액 역산 시뮬레이션...',
  'AI 수석 AX 컨설턴트 5대 핵심 비즈니스 역량 평가 중...',
  '맞춤형 7일 긴급 개선 처방전 및 SWOT 리포트 완성 중...',
];

// ==========================================
// 🌌 1. 인터랙티브 뉴럴 네트워크 캔버스 (60fps GPU 가속)
// ==========================================
function NeuralNetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 32 : 65;
    const maxDistance = isMobile ? 90 : 130;

    let mouse = { x: null, y: null, radius: 120 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.8 + 0.8;
        this.isCyan = Math.random() > 0.4;
        this.alpha = Math.random() * 0.45 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isCyan
          ? `rgba(56, 189, 248, ${this.alpha})`
          : `rgba(129, 140, 248, ${this.alpha})`;
        ctx.fill();
      }
    }

    let particles = Array.from({ length: particleCount }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const mobile = width < 768;
      const count = mobile ? 32 : 65;
      particles = Array.from({ length: count }, () => new Particle());
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 sm:opacity-50"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// ==========================================
// 🔢 2. 매끄러운 롤링 카운트업 숫자 컴포넌트
// ==========================================
function AnimatedNumber({ value, duration = 1200 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * end);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

// ==========================================
// 🛡️ 3. 사이버네틱 HUD 코너 브래킷
// ==========================================
function CyberCornerBracket() {
  return (
    <>
      <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70 pointer-events-none" />
    </>
  );
}

// ==========================================
// 🔮 4. 홀로그래픽 퀀텀 스캐너 로딩 HUD
// ==========================================
function HolographicScanner({ stepIndex }) {
  const codeSnippets = [
    'SCANNING_PACKET_LOSS_RATE: 0.85',
    'AI_AX_ENGINE_INFERENCE: GEMINI_2.5_PRO',
    'EXTRACTING_GEO_AFFINITY_VECTORS...',
    'SYNTHESIZING_7DAY_ROADMAP...',
    'FIREBASE_AUDIT_LOG_INITIALIZED',
  ];

  return (
    <div className="relative my-6 p-6 sm:p-8 rounded-3xl bg-[#060D1A]/90 border border-cyan-500/40 text-center overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)]">
      {/* 4개 코너 HUD 브래킷 */}
      <CyberCornerBracket />

      {/* 홀로그래픽 다중 회전 링 & 레이더 */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-5 flex items-center justify-center">
        {/* 외곽 회전 링 1 */}
        <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-hologram-spin" />
        {/* 내부 역회전 링 2 */}
        <div className="absolute inset-3 rounded-full border border-indigo-400/50 border-t-transparent border-b-transparent animate-hologram-spin-reverse" />
        {/* 내부 고속 회전 링 3 */}
        <div className="absolute inset-6 rounded-full border-2 border-cyan-300/60 border-l-transparent border-r-transparent animate-hologram-spin-fast" />
        
        {/* 레이더 스위프 빔 */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-cyan-500/20 via-transparent to-transparent animate-radar-sweep" />
        </div>

        {/* 중앙 코어 펄스 */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>

      {/* 상태 인디케이터 배지 */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-black tracking-widest uppercase mb-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>QUANTUM SCAN STEP {stepIndex + 1} / 5</span>
      </div>

      {/* 실시간 단계 텍스트 */}
      <h3 className="text-base sm:text-lg font-black text-white mb-2 tracking-tight">
        {LOADING_STEPS[stepIndex]}
      </h3>

      {/* 사이버네틱 바이너리/매트릭스 데이터 스트림 */}
      <div className="font-mono text-[11px] text-cyan-400/70 tracking-wider truncate px-4 py-1.5 rounded-lg bg-black/40 border border-cyan-500/20 inline-block max-w-full">
        {`>> ${codeSnippets[stepIndex % codeSnippets.length]}`}
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full bg-white/5 h-1.5 rounded-full mt-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          style={{ width: `${((stepIndex + 1) / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function BootcampFunnelPage() {
  const router = useRouter();
  const resultRef = useRef(null);
  const inputRef = useRef(null);

  // 상태 관리
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [instaData, setInstaData] = useState({
    brandName: '',
    followerCount: '',
    mainContent: '',
    coreProblem: '',
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 로딩 인디케이터 스텝 애니메이션
  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // 결과 생성 시 부드러운 스크롤 이동
  useEffect(() => {
    if (analysisResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [analysisResult]);

  // 스마트 뒤로가기 핸들러
  const handleSmartBack = () => {
    if (typeof window !== 'undefined') {
      if (
        window.history.length > 1 &&
        document.referrer &&
        (document.referrer.includes('thecreator-mcn.com') ||
          document.referrer.includes(window.location.host))
      ) {
        window.history.back();
      } else {
        window.location.href = 'http://thecreator-mcn.com/';
      }
    }
  };

  // 분석 실행 핸들러
  const handleAnalyze = async () => {
    if (platform !== 'instagram' && !url.trim()) {
      alert('진단할 채널 또는 웹사이트 URL을 입력해주세요.');
      return;
    }
    if (
      platform === 'instagram' &&
      (!instaData.brandName.trim() || !instaData.followerCount.trim())
    ) {
      alert('정밀 진단을 위해 브랜드명과 팔로워 수를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const payload = {
      platform,
      targetUrl: platform !== 'instagram' ? url.trim() : null,
      manualData: platform === 'instagram' ? instaData : null,
    };

    try {
      const res = await fetch('/api/analyze-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(`진단 오류: ${data.error || '분석 중 문제가 발생했습니다.'}`);
        return;
      }

      setAnalysisResult(data);

      // Firestore 기록 연동 (비동기 안전 처리)
      try {
        await addDoc(collection(db, 'url_analysis'), {
          platform,
          targetUrl:
            payload.targetUrl || payload.manualData?.brandName || '직접입력',
          publicReport: data.publicReport,
          keyword: data.publicReport?.category || '미분류',
          createdAt: serverTimestamp(),
        });
      } catch (logErr) {
        console.warn('url_analysis logging non-blocking error:', logErr);
      }
    } catch (error) {
      alert('서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 리포트 텍스트 복사 핸들러
  const handleCopyReport = () => {
    if (!analysisResult?.publicReport) return;
    const r = analysisResult.publicReport;
    const textToCopy = `[The Creators AI 세일즈 누수 정밀 진단 결과]
- 브랜드: ${r.brandName} (${r.category})
- 위험도: ${r.severity || '심각'}
- 핵심 병목: ${r.bottleneckPhase || '전환 퍼널 부재'}
- 월간 예상 누수액: ${Number(r.monthlyLeakageCost || 0).toLocaleString()}원
- 연간 누적 누수액: ${Number(r.annualLeakageCost || (r.monthlyLeakageCost || 0) * 12).toLocaleString()}원
- 병목 원인: ${r.painPoint}
- 피보팅 제안: ${r.direction}

상세 리포트 및 솔루션: https://my-diagnostic-app.vercel.app/bootcamp-funnel`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      })
      .catch(() => {
        alert('클립보드 복사에 실패했습니다.');
      });
  };

  // 재진단 핸들러
  const handleReset = () => {
    setAnalysisResult(null);
    setUrl('');
    setInstaData({ brandName: '', followerCount: '', mainContent: '', coreProblem: '' });
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 3층 부트캠프 VIP 연동 핸들러 (진단 데이터 파라미터 전달)
  const handleGoToBootcamp = () => {
    if (report) {
      const params = new URLSearchParams();
      if (report.brandName) params.set('brand', report.brandName);
      if (monthlyCost) params.set('cost', monthlyCost.toString());
      if (report.painPoint) params.set('pain', report.painPoint);
      if (report.bottleneckPhase) params.set('bottleneck', report.bottleneckPhase);
      router.push(`/bootcamp-sales?${params.toString()}`);
    } else {
      router.push('/bootcamp-sales');
    }
  };

  const report = analysisResult?.publicReport;
  const monthlyCost = Number(report?.monthlyLeakageCost || 0);
  const annualCost = Number(report?.annualLeakageCost || monthlyCost * 12);

  return (
    <div className="min-h-screen w-full max-w-full bg-[#080C14] text-slate-100 font-sans break-words flex flex-col items-center selection:bg-cyan-500 selection:text-black relative overflow-x-hidden cyber-grid-bg">
      {/* 1. 인터랙티브 뉴럴 네트워크 캔버스 (60fps GPU 가속) */}
      <NeuralNetworkCanvas />

      {/* 2. 미래지향적 레이저 스캔 광학 빔 */}
      <div className="fixed inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none animate-laser-scan z-20" />

      {/* 3. 백그라운드 앰비언트 사이버 오로라 글로우 */}
      <div className="fixed top-[-15%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* =========================================
          네비게이션 헤더 바 (스마트 뒤로가기 탑재)
          ========================================= */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#080C14]/90 border-b border-slate-800/80 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleSmartBack}
            className="group flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-xs font-bold shadow-sm"
            title="본사 홈페이지 또는 이전 화면으로 이동"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>뒤로가기</span>
          </button>

          <a
            href="http://thecreator-mcn.com/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <span className="tracking-wide">The Creators AI</span>
            <span className="text-cyan-500/40">/</span>
            <span className="text-cyan-400 font-extrabold">데이터랩</span>
          </a>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/synergy-test"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 hover:text-cyan-200 transition-all text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            title="1층 에이전틱 AI 메타인지 역량 진단소로 이동"
          >
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span className="hidden xs:inline">1층</span>
            <span>AI수준진단</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
            title="진단기 플랫폼 1층 통합 허브로 이동"
          >
            <span>1층 허브</span>
          </Link>

          <a
            href="http://thecreator-mcn.com/subpage.php?sd=2&sc=2_3"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <span>모두의크루 파트너십</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="http://thecreator-mcn.com/"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-indigo-700 hover:from-cyan-500 hover:to-indigo-600 text-white transition-all text-xs font-bold shadow-md shadow-indigo-600/30 border border-cyan-400/30"
          >
            <span>본사 포털</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* =========================================
          메인 컨테이너
          ========================================= */}
      <main className="w-full max-w-5xl px-3 sm:px-6 py-8 sm:py-16 relative z-10 flex flex-col items-center min-w-0">
        {/* 상단 인트로 히어로 */}
        <div ref={inputRef} className="w-full text-center max-w-2xl mb-8 sm:mb-12">
          {/* 실시간 시스템 관제탑 마이크로 알약 칩 인디케이터 (Ruflo Cybernetic Style) */}
          <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D131F]/90 border border-slate-700/60 shadow-[0_0_25px_rgba(56,189,248,0.08)] backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] sm:text-xs text-slate-300 font-semibold tracking-tight">v2.5 Active</span>
              <span className="text-slate-600 font-mono text-[10px]">·</span>
              <span className="font-mono text-[11px] sm:text-xs text-cyan-400 font-semibold tracking-tight">Gemini Flash Core</span>
              <span className="text-slate-600 font-mono text-[10px]">·</span>
              <span className="font-mono text-[11px] sm:text-xs text-indigo-300 font-semibold tracking-tight">Multi-Agent Swarm Ready</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-black tracking-widest uppercase mb-4 sm:mb-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Transformation Quantum Lab</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-5 leading-tight tracking-tight">
            비즈니스 세일즈 퍼널
            <br />
            <span className="animate-cyber-shimmer text-transparent bg-clip-text font-black drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]">
              정밀 진단 & 누수액 측정
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base font-normal leading-relaxed px-2">
            단 하나의 URL 또는 채널 데이터로 실시간 세일즈 전환 병목을 <span className="text-cyan-300 font-bold underline decoration-cyan-500/50 underline-offset-4">정밀 역추적(Trace)</span>하고,
            <br className="hidden sm:block" />
            매월 증발하는 누수 비용과 7일 긴급 실행 처방전을 팩트 기반으로 도출합니다.
          </p>
        </div>

        {/* =========================================
            입력 폼 카드 (1단계: 사이버 HUD 입력 패널)
            ========================================= */}
        <div className="w-full max-w-xl bg-[#0B101B]/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden mb-12 min-w-0">
          {/* 4개 코너 HUD 브래킷 */}
          <CyberCornerBracket />

          {/* 상단 레이저 엣지 라인 */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400"></div>

          {/* 플랫폼 선택 탭 */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-[#040711] border border-white/10 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setPlatform('youtube')}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all ${
                platform === 'youtube'
                  ? 'bg-red-600/90 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <YoutubeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>유튜브</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('web')}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all ${
                platform === 'web'
                  ? 'bg-cyan-600/90 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>웹/스토어</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('instagram')}
              className={`flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-bold transition-all ${
                platform === 'instagram'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>인스타그램</span>
            </button>
          </div>

          {/* 입력 폼 필드 */}
          <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
            {platform !== 'instagram' ? (
              <div>
                <label className="block text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  {platform === 'youtube' ? '유튜브 채널 URL 또는 핸들(@)' : '웹사이트 / 쇼핑몰 URL'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isLoading) handleAnalyze();
                    }}
                    placeholder={
                      platform === 'youtube'
                        ? '예: https://www.youtube.com/@TheCreators'
                        : '예: https://thecreator-mcn.com'
                    }
                    className="w-full bg-[#050811] border border-cyan-500/30 focus:border-cyan-400 px-4 py-4 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  채널 프로필 주소나 랜딩 페이지 주소를 입력하시면 AI 엔진이 즉시 스캔합니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5">
                    브랜드명 또는 계정명
                  </label>
                  <input
                    type="text"
                    value={instaData.brandName}
                    onChange={(e) =>
                      setInstaData({ ...instaData, brandName: e.target.value })
                    }
                    placeholder="예: 더크리에이터즈"
                    className="w-full bg-[#050811] border border-pink-500/30 focus:border-pink-400 px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/30 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5">
                      팔로워 수
                    </label>
                    <input
                      type="text"
                      value={instaData.followerCount}
                      onChange={(e) =>
                        setInstaData({ ...instaData, followerCount: e.target.value })
                      }
                      placeholder="예: 2.3만"
                      className="w-full bg-[#050811] border border-pink-500/30 focus:border-pink-400 px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/30 transition-all placeholder:text-slate-600 shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5">
                      핵심 콘텐츠 분야
                    </label>
                    <input
                      type="text"
                      value={instaData.mainContent}
                      onChange={(e) =>
                        setInstaData({ ...instaData, mainContent: e.target.value })
                      }
                      placeholder="예: 지식창업, 교육, 서비스"
                      className="w-full bg-[#050811] border border-pink-500/30 focus:border-pink-400 px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/30 transition-all placeholder:text-slate-600 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-pink-300 uppercase tracking-wider mb-1.5">
                    현재 가장 심각한 비즈니스 고민
                  </label>
                  <input
                    type="text"
                    value={instaData.coreProblem}
                    onChange={(e) =>
                      setInstaData({ ...instaData, coreProblem: e.target.value })
                    }
                    placeholder="예: 조회수는 나오는데 문의 및 실제 결제로 이어지지 않음"
                    className="w-full bg-[#050811] border border-pink-500/30 focus:border-pink-400 px-4 py-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-pink-500/30 transition-all placeholder:text-slate-600 shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 홀로그래픽 퀀텀 스캐너 로딩 화면 (교체 완료) */}
          {isLoading && <HolographicScanner stepIndex={loadingStepIndex} />}

          {/* 진단 실행 버튼 */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white py-4 sm:py-5 px-3 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 border border-cyan-400/40 relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
            {isLoading ? (
              <span className="tracking-wider">양자 연산 정밀 해부 중...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 fill-cyan-200 shrink-0" />
                <span className="sm:hidden">AI 정밀 진단 시작</span>
                <span className="hidden sm:inline">AI 정밀 진단 & 누수액 계산 시작</span>
              </>
            )}
          </button>

          {/* 하단 서브 메뉴 링크 */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4 w-full">
            <button
              type="button"
              onClick={() => router.push('/bootcamp-sales')}
              className="py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-bold transition-all text-center truncate hover:border-cyan-500/30"
            >
              부트캠프 정규과정
            </button>
            <a
              href="tel:051-633-3812"
              className="py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 truncate hover:border-cyan-500/30"
            >
              <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>직통 유선 상담</span>
            </a>
          </div>
        </div>

        {/* =========================================
            진단 결과 대시보드 (2단계: 리포트 패널)
            ========================================= */}
        {report && (
          <div
            ref={resultRef}
            className="w-full max-w-4xl space-y-8 animate-fade-in-up mt-6"
          >
            {/* 리포트 상단 툴바 */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>진단 완료</span>
                </span>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString('ko-KR')} 데이터랩 추출 리포트
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">복사 완료</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>결과 복사</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>새 진단</span>
                </button>
              </div>
            </div>

            {/* 카드 1: 브랜드 프로필 및 진단 요약 */}
            <section className="bg-[#090F1E]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl relative overflow-hidden neon-glow-box">
              {/* 4개 모서리 사이버 HUD 브래킷 */}
              <CyberCornerBracket />

              {/* 상단 앰비언트 라인 */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Target Brand
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 font-medium">
                      {report.category || '비즈니스 퍼널'}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {report.brandName}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <div className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-center shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                    <span className="text-[10px] font-bold text-red-400 block uppercase">
                      누수 심각도
                    </span>
                    <span className="text-sm sm:text-base font-black text-red-300">
                      {report.severity || '심각'}
                    </span>
                  </div>

                  <div className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">
                      최우선 병목 단계
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-amber-300">
                      {report.bottleneckPhase || '세일즈 전환 병목'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 누수 비용 KPI 배너 (롤링 카운트업 넘버 탑재) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/50 via-red-900/30 to-black/70 border border-red-500/40 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-red-400 tracking-wider uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 animate-bounce" />
                      <span>월간 추정 세일즈 누수 비용</span>
                    </span>
                    <span className="text-[11px] text-red-400/80 font-semibold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                      월간 이탈 손실
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-red-400 tracking-tight my-2">
                    <AnimatedNumber value={monthlyCost} />
                    <span className="text-xl sm:text-2xl text-red-300 font-bold ml-1">
                      원
                    </span>
                  </div>
                  <p className="text-xs text-red-300/80 leading-relaxed font-medium">
                    {report.painPoint || '퍼널 이탈로 인해 매월 지속 발생하는 기회비용'}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#040711] border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span>연간 누적 예상 손실액</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        12개월 방치 기준
                      </span>
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
                      <AnimatedNumber value={annualCost} />
                      <span className="text-xl sm:text-2xl text-slate-400 font-bold ml-1">
                        원
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    자동화된 24시간 전환 엔진 미도입 시 연간 지속되는 누적 손실액입니다.
                  </p>
                </div>
              </div>

              {/* 산출 근거 및 GEO AI 노출 진단 바 (오픈소스 벤치마크 규격) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs shrink-0">
                      GEO
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        생성형 AI 검색 노출 지수
                      </span>
                      <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {report.geoInsight || 'AI 검색 엔진 최적화 진단'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-base sm:text-lg font-black text-cyan-400">
                      {report.geoScore || 58}점
                    </span>
                    <span
                      className={`block text-[10px] font-bold ${
                        (report.geoScore || 58) >= 75
                          ? 'text-emerald-400'
                          : (report.geoScore || 58) >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {report.geoReadiness || '보통'}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xs shrink-0">
                      FX
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        누수액 시뮬레이션 산출 공식
                      </span>
                      <span className="text-xs font-medium text-slate-300 line-clamp-1">
                        {report.leakageFormula || '월간 예상 유입 × 이탈율 85% × 추정 객단가'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 채널 아이덴티티 및 본질 분석 */}
              {report.identity && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 mb-6">
                  <span className="text-[11px] font-black text-blue-400 tracking-widest uppercase block mb-1.5">
                    Core Identity Analysis
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-slate-200 leading-relaxed">
                    {report.identity}
                  </p>
                </div>
              )}

              {/* 5대 역량 레이더 차트 및 역량 지표 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center pt-2">
                <div className="bg-[#050811]/90 rounded-2xl p-4 sm:p-6 border border-cyan-500/20 flex flex-col items-center justify-center min-h-[300px] shadow-inner relative overflow-hidden">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>5대 비즈니스 역량 분석 레이더</span>
                  </span>
                  <div className="w-full h-[240px]">
                    {isClient && report.chartData && report.chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
                          data={report.chartData}
                        >
                          <PolarGrid stroke="#1E293B" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#38BDF8', fontSize: 11, fontWeight: 'bold' }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            stroke="#334155"
                            tick={{ fill: '#64748B', fontSize: 9 }}
                          />
                          <Radar
                            name="역량 점수"
                            dataKey="score"
                            stroke="#06B6D4"
                            strokeWidth={2.5}
                            fill="#06B6D4"
                            fillOpacity={0.35}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                        차트 로딩 중...
                      </div>
                    )}
                  </div>
                </div>

                {/* 역량 스코어 바 */}
                <div className="space-y-3.5">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-widest block mb-2">
                    항목별 전환 취약 지표
                  </span>
                  {report.chartData?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#050811]/70 p-3.5 rounded-xl border border-cyan-500/20 shadow-sm"
                    >
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-slate-200 font-semibold">{item.subject}</span>
                        <span
                          className={`font-black font-mono ${
                            item.score >= 80
                              ? 'text-cyan-400'
                              : item.score >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.score}점
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 shadow-sm ${
                            item.score >= 80
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                              : item.score >= 60
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-gradient-to-r from-rose-500 to-red-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 카드 2: SWOT 분석 매트릭스 (벤토 그리드 큐브) */}
            {report.swot && (
              <section className="bento-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                <CyberCornerBracket />
                <div className="mb-6">
                  <span className="text-xs font-black text-cyan-400 tracking-widest uppercase block mb-1">
                    Strategic Diagnosis Matrix
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    SWOT 전환 구조 정밀 분석
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center border border-cyan-500/40">
                        S
                      </span>
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                        Strength (핵심 강점)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {report.swot.s}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 hover:border-red-400/60 transition-all shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-red-500/20 text-red-300 font-black text-xs flex items-center justify-center border border-red-500/40">
                        W
                      </span>
                      <span className="text-xs font-bold text-red-300 uppercase tracking-wide">
                        Weakness (수익화 약점)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {report.swot.w}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400/60 transition-all shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                        O
                      </span>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                        Opportunity (자동화 기회)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {report.swot.o}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/40">
                        T
                      </span>
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        Threat (방치 시 위협)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {report.swot.t}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 카드 3: 7일 긴급 개선 액션 플랜 (벤토 타임라인) */}
            {report.actionPlan7Days && report.actionPlan7Days.length > 0 && (
              <section className="bento-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                <CyberCornerBracket />
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-cyan-400 tracking-widest uppercase block">
                      Emergency 7-Day Protocol
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      누수 차단 7일 실행 처방전
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.actionPlan7Days.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#050811]/80 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-cyan-400/50 transition-all shadow-md group"
                    >
                      <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-black tracking-wider uppercase w-fit group-hover:bg-cyan-500/30 transition-colors">
                        {step.period}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 카드 4: 피보팅 전략 & 최우선 실행 과제 (2분할 벤토 카드) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.direction && (
                <div className="bento-card rounded-3xl p-6 relative overflow-hidden">
                  <CyberCornerBracket />
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      수익화 비즈니스 피보팅 방향
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                    {report.direction}
                  </p>
                </div>
              )}

              {report.futureTask && (
                <div className="bento-card rounded-3xl p-6 relative overflow-hidden">
                  <CyberCornerBracket />
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                      최우선 퍼널 구축 과제
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                    {report.futureTask}
                  </p>
                </div>
              )}
            </section>

            {/* =========================================
                전환 퍼널 CTA 배너 (3층 출구 솔루션)
                ========================================= */}
            <section className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-[#0B1120] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-black tracking-widest uppercase mb-4 inline-block">
                  AX Transformation Solution
                </span>

                <h4 className="text-2xl sm:text-4xl font-black mb-4 leading-tight">
                  월 {monthlyCost.toLocaleString()}원의 세일즈 누수,
                  <br />
                  지금 즉시 자동화 엔진으로 차단하시겠습니까?
                </h4>

                <p className="text-indigo-200 text-xs sm:text-base mb-8 leading-relaxed font-medium">
                  The Creators AI 부트캠프에서는 단순 강의가 아닌, 24시간 잠재고객을 획득하고
                  무인으로 구매 전환시키는 실시간 세일즈 머신을 직접 구축해 드립니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleGoToBootcamp}
                    className="flex-1 bg-white text-indigo-900 hover:bg-slate-100 py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all shadow-xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                  >
                    <span>부트캠프 커리큘럼 확인 및 정원 신청</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/synergy-test"
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all shadow-xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 border border-cyan-400/40"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>1층 내 AI수준(메타인지) 진단받기</span>
                  </Link>

                  <a
                    href="tel:051-633-3812"
                    className="flex items-center justify-center gap-2 bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-400/40 text-white py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all"
                  >
                    <Phone className="w-4 h-4 text-indigo-300" />
                    <span>유선 문의</span>
                  </a>
                </div>

                <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300">
                  <a
                    href="http://thecreator-mcn.com/subpage.php?sd=2&sc=2_3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white underline underline-offset-4 font-bold flex items-center gap-1"
                  >
                    <span>B2B 기업연수 및 모두의크루 제휴 문의</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={handleSmartBack}
                    className="hover:text-white underline underline-offset-4"
                  >
                    본사 포털로 돌아가기
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* =========================================
          푸터
          ========================================= */}
      <footer className="w-full border-t border-white/10 py-8 px-4 text-center text-xs text-slate-500 relative z-10">
        <p className="mb-2">
          (주)더크리에이터즈 | 대표자: 임건우 | 부산광역시 부산진구 범천동
        </p>
        <p className="text-[11px] text-slate-600">
          본 AI 진단 리포트는 공공 및 채널 데이터와 독자적 AX 엔진을 기반으로 산출된 시뮬레이션 지표입니다.
        </p>
      </footer>
    </div>
  );
}