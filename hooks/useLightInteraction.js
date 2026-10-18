'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMokuMotion } from '../lib/motion-kit/react.js';

export const DEFAULT_MOTION_TOKENS = Object.freeze({
  success: '#10B981',
  info: '#38BDF8',
  accent: '#3B82F6',
  neutral: '#64748B',
});

/**
 * Zone 1: 첫 진입 히어로 광원 정착 (780ms 1회)
 * 사용자 입력(pointerdown, wheel, touchmove, keydown) 발생 시 즉시 cancel()하여 조작성 보장
 */
export function useHeroGlowSettle(glowRef) {
  useEffect(() => {
    const el = glowRef?.current;
    if (!el || typeof window === 'undefined' || typeof el.animate !== 'function') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      el.style.opacity = '0.22';
      return;
    }

    const anim = el.animate(
      [
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.92)' },
        { opacity: 0.52, transform: 'translate(-50%, -50%) scale(1.03)', offset: 0.45 },
        { opacity: 0.24, transform: 'translate(-50%, -50%) scale(1)' },
      ],
      {
        duration: 780,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        fill: 'forwards',
      }
    );

    const stopImmediately = () => {
      try {
        if (anim.playState === 'running') {
          anim.cancel();
          el.style.opacity = '0.24';
          el.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      } catch {
        // Ignore cancellation errors
      }
    };

    const events = ['pointerdown', 'touchmove', 'wheel', 'keydown'];
    events.forEach((evt) => window.addEventListener(evt, stopImmediately, { capture: true, passive: true }));

    const onVisibility = () => {
      if (document.hidden) stopImmediately();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, stopImmediately, { capture: true }));
      document.removeEventListener('visibilitychange', onVisibility);
      try {
        anim.cancel();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [glowRef]);
}

/**
 * Zone 2: 핵심 CTA 단일 확장·감쇠 빛 테두리 (.light-cue)
 * 뷰포트 진입 시 3.6s 주기로 2회 잔잔하게 유도하며, 클릭/모달 오픈/뷰포트 이탈 시 즉시 해제
 */
export function useSingleLightCue(ctaRef, { disabled = false } = {}) {
  useEffect(() => {
    const el = ctaRef?.current;
    if (!el || typeof window === 'undefined') return;

    if (disabled) {
      el.removeAttribute('data-cue-active');
      return;
    }

    let hasPlayedInSession = false;

    const deactivate = () => {
      el.removeAttribute('data-cue-active');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !disabled && !document.hidden && !hasPlayedInSession) {
          hasPlayedInSession = true;
          el.setAttribute('data-cue-active', 'true');
        } else if (!entry.isIntersecting) {
          deactivate();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(el);

    const onVisibility = () => {
      if (document.hidden) deactivate();
    };
    const onPointerDown = () => {
      deactivate();
    };

    document.addEventListener('visibilitychange', onVisibility);
    el.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      el.removeEventListener('pointerdown', onPointerDown);
      deactivate();
    };
  }, [ctaRef, disabled]);
}

/**
 * Zone 3: 주요 카드 260ms 표면 빛 + 모바일 스크롤 중 오작동 방지 (8px 이하 탭 가드)
 */
export function useSurfaceLightHandlers() {
  const touchStateRef = useRef({ x: 0, y: 0, scrollY: 0, active: false });

  const runSurfaceWash = useCallback((cardEl) => {
    if (!cardEl || typeof window === 'undefined' || typeof cardEl.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let washEl = cardEl.querySelector(':scope > [data-surface-wash-layer]');
    if (!washEl) {
      washEl = document.createElement('span');
      washEl.setAttribute('data-surface-wash-layer', '');
      washEl.setAttribute('aria-hidden', 'true');
      Object.assign(washEl.style, {
        position: 'absolute',
        inset: '0',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        background: 'linear-gradient(125deg, rgba(56, 189, 248, 0.18), rgba(59, 130, 246, 0.08) 60%, transparent)',
        opacity: '0',
        zIndex: '1',
      });
      cardEl.appendChild(washEl);
    }

    washEl.getAnimations().forEach((a) => a.cancel());
    washEl.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.35 },
        { opacity: 0 },
      ],
      {
        duration: 260,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        fill: 'none',
      }
    );
  }, []);

  const onMouseEnter = useCallback(
    (e) => {
      if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
      runSurfaceWash(e.currentTarget);
    },
    [runSurfaceWash]
  );

  const onFocus = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        runSurfaceWash(e.currentTarget);
      }
    },
    [runSurfaceWash]
  );

  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse') return;
    touchStateRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      active: true,
    };
  }, []);

  const onPointerUp = useCallback(
    (e) => {
      if (e.pointerType === 'mouse') return;
      const st = touchStateRef.current;
      if (!st.active) return;
      st.active = false;

      const dist = Math.hypot(e.clientX - st.x, e.clientY - st.y);
      const scrollDiff = typeof window !== 'undefined' ? Math.abs(window.scrollY - st.scrollY) : 0;

      // 이동 거리 8px 이하이고 스크롤 이동이 없을 때만 실제 탭으로 판정하여 260ms 표면 빛 실행
      if (dist <= 8 && scrollDiff <= 4) {
        runSurfaceWash(e.currentTarget);
      }
    },
    [runSurfaceWash]
  );

  return {
    onMouseEnter,
    onFocus,
    onPointerDown,
    onPointerUp,
  };
}

/**
 * Zone 4: 실제 성공 시점에만 반응하는 3단계 연쇄 빛 (motion-kit 0.1.0 어댑터 + 언마운트 출발 앵커 보존)
 */
export function useCommittedLightFlow(containerRef, domainTargetResolver) {
  const getContainer = useCallback(() => containerRef?.current ?? null, [containerRef]);
  const originRectRef = useRef(null);

  const kitRef = useMokuMotion({
    container: getContainer,
    tokens: DEFAULT_MOTION_TOKENS,
    domainTarget: domainTargetResolver,
  });

  // 폼 제출/진단 시작 직전 출발 버튼의 뷰포트 좌표를 안전하게 캡처
  const captureOriginRect = useCallback((el) => {
    if (!el || typeof el.getBoundingClientRect !== 'function') return;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      originRectRef.current = {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      };
    }
  }, []);

  // 실제 응답/DB 저장 성공 확인 후 호출
  const playCommittedSuccess = useCallback(
    async ({
      operationId,
      scope = 'diagnostic-flow',
      kind = 'activity-saved',
      targetEl,
      fromEl = null,
      changes = undefined,
      reward = undefined,
    }) => {
      const host = containerRef?.current;
      const kit = kitRef?.current;
      if (!host || !kit || !targetEl) return 'ignored';

      let effectiveFrom = fromEl;
      let tempAnchor = null;

      // 출발 버튼이 조건부 언마운트되었거나 화면에서 숨겨진 경우 캡처된 좌표에 임시 앵커 생성
      const isFromValid =
        effectiveFrom &&
        effectiveFrom.isConnected &&
        host.contains(effectiveFrom) &&
        effectiveFrom.getBoundingClientRect().width > 0;

      if (!isFromValid && originRectRef.current) {
        const snap = originRectRef.current;
        tempAnchor = document.createElement('span');
        tempAnchor.setAttribute('aria-hidden', 'true');
        Object.assign(tempAnchor.style, {
          position: 'fixed',
          left: `${Math.max(4, Math.min(window.innerWidth - 20, snap.left + snap.width / 2 - 6))}px`,
          top: `${Math.max(4, Math.min(window.innerHeight - 20, snap.top + snap.height / 2 - 6))}px`,
          width: '12px',
          height: '12px',
          opacity: '0.01',
          pointerEvents: 'none',
          zIndex: '-1',
        });
        host.appendChild(tempAnchor);
        effectiveFrom = tempAnchor;
      }

      try {
        const outcome = await kit.play({
          operationId: String(operationId || `op-${Date.now()}`),
          scope,
          kind,
          from: effectiveFrom || undefined,
          target: targetEl,
          changes,
          reward,
        });
        return outcome;
      } finally {
        if (tempAnchor && tempAnchor.isConnected) {
          tempAnchor.remove();
        }
      }
    },
    [containerRef, kitRef]
  );

  return {
    kitRef,
    captureOriginRect,
    playCommittedSuccess,
  };
}
