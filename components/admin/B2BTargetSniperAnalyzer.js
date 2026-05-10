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

      setResult({
        painPoint: payload.painPoint,
        monthlyLeakageCost: payload.monthlyLeakageCost,
        dmScript: payload.dmScript,
      });
      showToast('분석이 완료되었습니다.', 'success');
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
      showToast('DM 스크립트를 복사했습니다.', 'success');
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      showToast('복사에 실패했습니다. 다시 시도해 주세요.', 'error');
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
        <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
          B2B 타깃 스나이퍼 분석기
        </p>
        <h2 className="mt-3 text-2xl font-black text-slate-900">타깃 기업 한 곳만 찍어서, 바로 제안 메시지까지 완성</h2>
        <p className="mt-2 text-sm text-slate-600">
          웹사이트 URL만 입력하면, 서버에서 Gemini 분석을 실행해 가장 치명적인 취약점과 월간 누수 비용, 맞춤 DM 스크립트를 생성합니다.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5">
        <label htmlFor="targetUrl" className="mb-2 block text-sm font-bold text-slate-700">
          타깃 기업 웹사이트 URL
        </label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            id="targetUrl"
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="예: https://company.com"
            className="h-14 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!targetUrl.trim() || isLoading}
            className="h-14 rounded-xl bg-indigo-600 px-6 text-base font-extrabold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? '분석 중...' : '분석 시작'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-sm font-bold text-indigo-900">크롤링 데이터 기반 Gemini 분석 진행 중...</p>
          </div>
          <p className="mt-3 text-xs text-indigo-700 whitespace-pre-line">
            서버 프롬프트 조립 중: "이 회사의 결함을 찾고 인스타 DM 스크립트를 써줘"
          </p>
        </div>
      )}

      {!!serverErrorText && !isLoading && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-extrabold text-rose-700">서버 에러 원인</p>
          <p className="mt-1 text-sm font-semibold text-rose-900 break-all">{serverErrorText}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-500">치명적 Pain Point</p>
            <p className="mt-3 text-sm leading-relaxed font-semibold text-slate-800">{result.painPoint}</p>
            <div className="mt-5 rounded-xl bg-rose-50 p-4">
              <p className="text-xs font-bold text-rose-600">예상 월간 인건비 누수</p>
              <p className="mt-1 text-2xl font-black text-rose-700">
                {result.monthlyLeakageCost.toLocaleString('ko-KR')}원
              </p>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">초개인화 인스타 DM 스크립트</p>
              <button
                type="button"
                onClick={handleCopyScript}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
              >
                {isCopied ? '복사 완료' : '즉시 복사'}
              </button>
            </div>
            <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100 whitespace-pre-wrap">
              {result.dmScript}
            </pre>
          </article>
        </div>
      )}
    </section>
  );
}
