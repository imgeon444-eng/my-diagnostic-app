'use client';

import { useState } from 'react';
import Navbar from '../components/home/Navbar';
import HeroVideoSection from '../components/home/HeroVideoSection';
import FunnelGateways from '../components/home/FunnelGateways';
import VideoReviewGallery from '../components/home/VideoReviewGallery';
import DiagnosticModal from '../components/home/DiagnosticModal';
import Footer from '../components/home/Footer';

export default function TheCreatorsHomePage() {
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const openDiagnostic = () => setIsDiagnosticOpen(true);
  const closeDiagnostic = () => setIsDiagnosticOpen(false);

  return (
    <div className="min-h-screen bg-[#090E17] text-slate-200 font-sans selection:bg-[#3B82F6] selection:text-white relative overflow-x-hidden">
      
      {/* 🧭 상단 GNB 네비게이션 */}
      <Navbar onOpenDiagnostic={openDiagnostic} />

      {/* 🎬 1. 시네마틱 비디오 타이틀 히어로 섹션 */}
      <HeroVideoSection onOpenDiagnostic={openDiagnostic} />

      {/* 🏢 2. 1층~3층 퍼널 게이트웨이 관문 */}
      <FunnelGateways onOpenDiagnostic={openDiagnostic} />

      {/* 🎥 3. 실제 수강생 & 파트너사 영상 리뷰 갤러리 */}
      <VideoReviewGallery />

      {/* 📋 4. 1층 15문항 마케팅 체급 진단 모달 (Firebase 및 /result 연동 완벽 보존) */}
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={closeDiagnostic}
      />

      {/* 🏷️ 하단 푸터 */}
      <Footer onOpenDiagnostic={openDiagnostic} />

    </div>
  );
}