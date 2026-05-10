'use client';

import { useState } from 'react';

export default function B2BTargetSniperAnalyzer() {
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [serverErrorText, setServerErrorText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const handleAnalyze = async () => {
    if (!targetUrl.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setServerErrorText('');
    setIsCopied(false);
    
    try {
      const response = await fetch('/api/analyze-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: targetUrl.trim() }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorText = `${response.status} ${payload?.error || '분석 요청에 실패했습니다.'}`;
        setServerErrorText(errorText);
        throw new Error(errorText);
      }

      // 💡 [핵심 수정] 백엔드 이원화 구조에 맞게 데이터 추출 경로(Depth) 재설정
      // 고객이 보는 데이터와 직원이 보는 데이터를 모두 가져옵니다.
      setResult({
        // publicReport에서 가져오는 데이터
        painPoint: payload.publicReport?.painPoint,
        monthlyLeakageCost: payload.publicReport?.monthlyLeakageCost,
        brandName: payload.adminReport?.targetBrand || payload.publicReport?.brandName,
        
        // adminReport에서 가져오는 직원 전용 극비 데이터
        estimatedScale: payload.adminReport?.estimatedScale,
        employeeNeeds: payload.adminReport?.employeeNeeds,
        companyStrength: payload.adminReport?.companyStrength,
        hiddenProblem: payload.adminReport?.hiddenProblem,
        salesAction: payload.adminReport?.salesAction,
        
        // (선택) DM 스크립트가 API에 있다면 가져오고, 없으면 세일즈 액션을 활용
        dmScript: payload.dmScript || payload.adminReport?.salesAction, 
      });
      
      showToast('어드민 정밀 분석이 완료되었습니다.', 'success');
    } catch (error) {
      setResult(null);
      const message = error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.';
      if (!serverErrorText) {
        setServerErrorText(message);
      }
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = async () => {
    if (!result?.dmScript) return;
    try {
      await navigator.clipboard.writeText(result.dmScript);
      setIsCopied(true);
      showToast('세일즈 스크립트를 복사했습니다.', 'success');
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      showToast('복사에 실패했습니다.', 'error');
    }
  };

  return (
    <section className="w-full mb-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded-xl px-4 py-3 text-sm font-bold shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-6">
        <p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white tracking-widest">
          🔐 STAFF ONLY | X-RAY ANALYZER
        </p>
        <h2 className="mt-3 text-2xl font-black text-slate-900">타깃 기업 심층 X-Ray 스캐너</h2>
        <p className="mt-2 text-sm text-slate-600">
          고객에게 보이지 않는 '불편한 진실'과 세일즈 클로징을 위한 맞춤형 필살기 대본을 추출합니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
        <label htmlFor="targetUrl" className="mb-2 block text-sm font-bold text-slate-700">
          분석할 클라이언트 채널 URL
        </label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            id="targetUrl"
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="예: https://instagram.com/client_id"
            className="h-14 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base font-medium text-slate-900 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!targetUrl.trim() || isLoading}
            className="h-14 rounded-xl bg-slate-900 px-6 text-base font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 whitespace-nowrap"
          >
            {isLoading ? '스캔 중...' : 'X-Ray 스캔'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900"></div>
            <p className="text-sm font-bold text-slate-900">기업 비공개 데이터 및 약점 추출 중...</p>
          </div>
        </div>
      )}

      {!!serverErrorText && !isLoading && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-extrabold text-rose-700">서버 에러 원인</p>
          <p className="mt-1 text-sm font-semibold text-rose-900 break-all">{serverErrorText}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="mt-8 space-y-6">
          
          {/* 💡 [신설] 영업 사원용 브리핑 보드 */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 block">Target Brand</span>
              <h3 className="text-3xl font-black text-white mb-6 border-b border-slate-700 pb-4">{result.brandName}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-1">Estimated Scale</span>
                  <p className="text-slate-300 text-sm font-medium">{result.estimatedScale}</p>
                </div>
                <div>
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-1">Resource Needs</span>
                  <p className="text-slate-300 text-sm font-medium">{result.employeeNeeds}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 불편한 진실 (내부 고발용) */}
            <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Secret</span>
                <p className="text-sm font-black text-rose-800">숨겨진 문제점 (불편한 진실)</p>
              </div>
              <p className="text-sm leading-relaxed font-semibold text-rose-900">{result.hiddenProblem}</p>
              
              <div className="mt-5 rounded-xl bg-white border border-rose-100 p-4">
                <p className="text-xs font-bold text-slate-500">예상 월간 누수 비용 (고객 노출 수치)</p>
                <p className="mt-1 text-2xl font-black text-rose-600">
                  {result.monthlyLeakageCost ? result.monthlyLeakageCost.toLocaleString('ko-KR') : '0'}원
                </p>
              </div>
            </article>

            {/* 세일즈 클로징 필살기 */}
            <article className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Action</span>
                  <p className="text-sm font-black text-indigo-900">클로징 필살기 대본</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                >
                  {isCopied ? '복사 완료' : '대본 복사'}
                </button>
              </div>
              
              <div className="flex-1 bg-white rounded-xl border border-indigo-100 p-4 relative">
                <span className="absolute top-2 left-2 text-4xl text-indigo-100 font-serif leading-none">"</span>
                <p className="text-sm font-bold text-slate-800 leading-relaxed relative z-10 pt-2 px-2">
                  {result.salesAction}
                </p>
              </div>
            </article>
          </div>

        </div>
      )}
    </section>
  );
}