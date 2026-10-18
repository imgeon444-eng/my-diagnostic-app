const finite = (v) => typeof v === 'number' && Number.isFinite(v);
export function validChange(c) {
    if (!c || typeof c.operationId !== 'string' || !c.operationId.trim() || c.operationId.length > 200 ||
        !['activity-saved', 'growth-updated', 'reward-granted'].includes(c.kind) || !c.target ||
        (c.scope !== undefined && (typeof c.scope !== 'string' || c.scope.length > 200)) ||
        (c.revision !== undefined && (!Number.isSafeInteger(c.revision) || c.revision < 0)) ||
        (c.actualDelta !== undefined && !finite(c.actualDelta)))
        return false;
    if (c.kind === 'growth-updated') {
        const rows = c.changes;
        if (!Array.isArray(rows) || !rows.length || rows.length > 12)
            return false;
        const ids = new Set();
        for (const row of rows) {
            if (!row || typeof row.key !== 'string' || !row.key.trim() || ids.has(row.key) ||
                typeof row.label !== 'string' || !row.label.trim() || !finite(row.before) || !finite(row.after) ||
                row.before < 0 || row.after < 0)
                return false;
            ids.add(row.key);
        }
        return rows.some(row => row.after !== row.before);
    }
    if (c.kind === 'reward-granted') {
        const r = c.reward;
        return !!r && finite(r.amount) && r.amount > 0 && finite(r.totalXp) && r.totalXp >= r.amount &&
            Number.isInteger(r.level) && r.level >= 1 && r.level <= 99 && typeof r.leveledUp === 'boolean';
    }
    return true; // The caller's successful activity commit is the trigger, never a guessed score.
}
export function createLedger(limit = 256) {
    const seen = new Map();
    return {
        accept(c) {
            const key = JSON.stringify([c.scope ?? '', c.operationId, c.kind]);
            if (seen.has(key))
                return false;
            // Revision is informational: a committed event cannot replay merely by changing its delta/revision.
            seen.set(key, c.kind);
            if (seen.size > limit)
                seen.delete(seen.keys().next().value);
            return true;
        },
        clear() { seen.clear(); },
        get size() { return seen.size; }
    };
}
