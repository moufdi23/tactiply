// ── plan.js ────────────────────────────────────────────────────────────────
// Usage-tracking and plan logic.
// All reads are synchronous (localStorage + URL params), so this module
// can be called anywhere in the render cycle without hooks.

// Returns the ISO date of the Monday that started the current week.
// This is our weekly reset anchor — free usage refreshes every Monday.
function getWeekKey() {
  const d = new Date();
  const day = d.getDay();                    // 0 = Sun … 6 = Sat
  const daysToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);  // "YYYY-MM-DD"
}

const STORAGE_KEY = 'mg_usage';
const FREE_LIMIT  = 1; // strategies per week on the free plan

function readUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { weekKey: '', count: 0 };
  } catch {
    return { weekKey: '', count: 0 };
  }
}

function writeUsage(weekKey, count) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ weekKey, count }));
  } catch {
    // localStorage unavailable (private browsing, etc.) — fail silently
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * getPlan()
 *
 * Returns the current user's plan state. Call inside any component —
 * it's cheap (one localStorage read + URL parse per call).
 *
 * isDemo      — URL contains ?demo=true → full Pro access, nothing recorded
 * canGenerate — user is allowed to start a new strategy right now
 * thisWeekCount — how many strategies generated this week (0 in demo mode)
 * recordUsage — call ONCE after a successful generation
 */
export function getPlan() {
  const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true';

  const weekKey       = getWeekKey();
  const usage         = readUsage();
  const thisWeekCount = usage.weekKey === weekKey ? usage.count : 0;
  const canGenerate   = isDemo || thisWeekCount < FREE_LIMIT;

  function recordUsage() {
    if (isDemo) return; // never burn a slot in demo mode
    const fresh = readUsage(); // re-read to avoid stale closure in async handlers
    const count = fresh.weekKey === weekKey ? fresh.count : 0;
    writeUsage(weekKey, count + 1);
  }

  return { isDemo, canGenerate, thisWeekCount, recordUsage };
}
