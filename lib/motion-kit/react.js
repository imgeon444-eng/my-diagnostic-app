'use client';
import { useEffect, useRef } from 'react';
import { createMotionKit } from './index.js';
/** A stable ref updated on client mount; no render-time DOM or business-event subscriptions. */
export function useMokuMotion(options) {
    const current = useRef(options);
    current.current = options;
    const kit = useRef(null);
    useEffect(() => {
        const host = current.current.container();
        if (!host)
            return;
        const initial = current.current;
        const instance = createMotionKit({ ...initial, container: host,
            isRecording: () => !!current.current.isRecording?.(), isHidden: () => !!current.current.isHidden?.(),
            domainTarget: key => current.current.domainTarget?.(key) ?? null,
            onStatic: c => current.current.onStatic?.(c) });
        kit.current = instance;
        return () => { instance.destroy(); if (kit.current === instance)
            kit.current = null; };
    }, [options.container, options.tokens, options.reducedMotion]);
    useEffect(() => { kit.current?.setEnabled(options.enabled !== false); }, [options.enabled]);
    return kit;
}
