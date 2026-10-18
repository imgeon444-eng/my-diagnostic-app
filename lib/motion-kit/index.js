import { createLedger, validChange } from './core.js';
export function createMotionKit(options) {
    const host = options.container, doc = host.ownerDocument, win = doc.defaultView;
    if (!win || !host.isConnected)
        throw new Error('Mount motion kit on a connected client container.');
    if (!Object.values(options.tokens).every(v => typeof v === 'string' && v.trim()))
        throw new Error('Inject all four role colors.');
    const ledger = createLedger();
    let dead = false, enabled = options.enabled !== false;
    let layer = null;
    let active = null;
    const media = win.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = () => options.reducedMotion === true || media.matches;
    const hidden = () => doc.hidden || !!options.isHidden?.();
    const inView = (el) => {
        if (!el.isConnected || el.ownerDocument !== doc || !host.contains(el))
            return false;
        const r = el.getBoundingClientRect(), h = host.getBoundingClientRect();
        const st = win.getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && r.width > 0 && r.height > 0 &&
            r.bottom > Math.max(0, h.top) && r.top < Math.min(win.innerHeight, h.bottom) &&
            r.right > Math.max(0, h.left) && r.left < Math.min(win.innerWidth, h.right);
    };
    function stop(status = 'cancelled', scope) {
        const run = active;
        if (!run || (scope !== undefined && scope !== run.scope))
            return;
        active = null;
        for (const a of run.animations)
            a.cancel();
        for (const n of run.nodes)
            n.remove();
        layer?.remove();
        layer = null;
        run.finish(status);
    }
    const visibility = () => { if (hidden())
        stop(); };
    const invalidate = () => stop();
    doc.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', invalidate);
    win.addEventListener('resize', invalidate, { passive: true });
    doc.addEventListener('scroll', invalidate, { passive: true, capture: true });
    // No global event bus, storage keys, observer, RAF, timers, or business-state mutations.
    async function play(change) {
        if (dead)
            return 'destroyed';
        if (!validChange(change) || !inView(change.target))
            return 'ignored';
        if (!ledger.accept(change))
            return 'duplicate';
        stop(); // Latest committed event supersedes stale presentation; no unbounded queue.
        if (!enabled || reduced() || hidden() || options.isRecording?.() || typeof change.target.animate !== 'function') {
            try {
                options.onStatic?.(change);
            }
            catch { /* Optional host presentation must not break input. */ }
            return 'static';
        }
        let settle;
        const result = new Promise(r => { settle = r; });
        const run = { scope: change.scope ?? '', animations: new Set(), nodes: new Set(), finish: settle };
        active = run;
        layer = doc.createElement('div');
        layer.dataset.mokuMotionLayer = '';
        layer.setAttribute('aria-hidden', 'true');
        Object.assign(layer.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '250', overflow: 'hidden' });
        doc.body.appendChild(layer);
        const role = change.kind === 'activity-saved' ? options.tokens.success : change.kind === 'growth-updated' ? options.tokens.info : options.tokens.accent;
        const rect = change.target.getBoundingClientRect();
        function decoration(x, y, w, h, round = '16px') {
            const el = doc.createElement('div');
            el.dataset.mokuMotionDecoration = '';
            Object.assign(el.style, { position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', borderRadius: round, background: role, opacity: '0', pointerEvents: 'none' });
            layer.appendChild(el);
            run.nodes.add(el);
            return el;
        }
        function animate(el, frames, duration, delay = 0) {
            const a = el.animate(frames, { duration, delay, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'none' });
            run.animations.add(a);
            return a;
        }
        try {
            // Soft surface light is a translucent solid; no gradients or decorative connecting lines.
            const wash = decoration(rect.left, rect.top, rect.width, rect.height);
            animate(wash, [{ opacity: 0 }, { opacity: .16, offset: .35 }, { opacity: 0 }], change.kind === 'activity-saved' ? 240 : 420);
            if (change.from && inView(change.from)) {
                const from = change.from.getBoundingClientRect(), x = from.left + from.width / 2, y = from.top + from.height / 2;
                const light = decoration(x - 6, y - 6, 12, 12, '999px');
                animate(light, [{ transform: 'translate(0,0) scale(.6)', opacity: 0 }, { opacity: .8, offset: .2 },
                    { transform: `translate(${rect.left + rect.width / 2 - x}px,${rect.top + rect.height / 2 - y}px) scale(1)`, opacity: 0 }], 480);
            }
            if (change.kind === 'growth-updated') {
                // Changed domains only, five or any supplied count: not a growth-score/schema mapper.
                const changed = change.changes.filter(row => row.after !== row.before);
                changed.forEach((row, i) => {
                    const el = options.domainTarget?.(row.key);
                    if (!el || !inView(el))
                        return;
                    const r = el.getBoundingClientRect();
                    const mark = decoration(r.left, r.top, r.width, r.height);
                    if (row.after < row.before)
                        mark.style.background = options.tokens.neutral;
                    animate(mark, [{ opacity: 0 }, { opacity: .18, offset: .4 }, { opacity: 0 }], 300, Math.min(i * 35, 140));
                });
            }
            if (change.kind === 'reward-granted') {
                const ring = decoration(rect.left + rect.width / 2 - 20, rect.top + rect.height / 2 - 20, 40, 40, '999px');
                ring.style.background = 'transparent';
                ring.style.border = '2px solid ' + role;
                ring.style.boxSizing = 'border-box';
                animate(ring, [{ transform: 'scale(.7)', opacity: 0 }, { opacity: .7, offset: .3 }, { transform: `scale(${change.reward.leveledUp ? 2.3 : 1.7})`, opacity: 0 }], change.reward.leveledUp ? 580 : 400);
                // Existing RewardGainToast remains the sole textual reward notice; no duplicated XP labels.
            }
            const animations = [...run.animations];
            await Promise.all(animations.map(a => a.finished.catch(() => undefined)));
            if (active === run)
                stop('played');
        }
        catch {
            if (active === run)
                stop('cancelled');
        }
        return result;
    }
    return Object.freeze({ play, cancel(scope) { stop('cancelled', scope); },
        setEnabled(value) { enabled = value; if (!value)
            stop(); },
        destroy() { if (dead)
            return; dead = true; stop('destroyed'); ledger.clear(); doc.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', invalidate); win.removeEventListener('resize', invalidate); doc.removeEventListener('scroll', invalidate, true); },
        inspect() { return { destroyed: dead, active: active ? 1 : 0, animations: active?.animations.size ?? 0, decorations: active?.nodes.size ?? 0, ownedListeners: dead ? 0 : 4, ownedTimers: 0, ownedRaf: 0, ownedObservers: 0, remembered: ledger.size }; } });
}
