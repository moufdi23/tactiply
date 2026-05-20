import { useState, useMemo, useEffect, useRef } from 'react';

// ── Section metadata ───────────────────────────────────────────────────────

const SECTION_META = [
  { key: 'target',   match: 'target audience', icon: '🎯', short: 'Audience', color: '#ef4444' },
  { key: 'social',   match: 'social media',    icon: '📱', short: 'Social',   color: '#8b5cf6' },
  { key: 'calendar', match: '30-day',          icon: '📅', short: 'Calendar', color: '#3b82f6' },
  { key: 'email',    match: 'email',           icon: '📧', short: 'Email',    color: '#06b6d4' },
  { key: 'ads',      match: 'ad copy',         icon: '💰', short: 'Ads',      color: '#10B981' },
  { key: 'seo',      match: 'seo',             icon: '🔍', short: 'SEO',      color: '#f59e0b' },
  { key: 'score',    match: 'marketing score', icon: '⭐', short: 'Score',    color: '#10B981' },
];

function getMeta(title) {
  const lower = title.toLowerCase();
  return SECTION_META.find(m => lower.includes(m.match)) ||
    { key: 'other', icon: '📋', short: title.slice(0, 10), color: '#6b7280' };
}

// ── Parsers ────────────────────────────────────────────────────────────────

function parseSections(text) {
  const parts = text.split(/^## /m).slice(1); // skip any preamble before first ##
  return parts
    .map(part => {
      const trimmed = part.trim();
      if (!trimmed) return null;
      const nl = trimmed.indexOf('\n');
      return nl === -1
        ? { title: trimmed, content: '' }
        : { title: trimmed.slice(0, nl).trim(), content: trimmed.slice(nl + 1).trim() };
    })
    .filter(Boolean);
}

function extractScore(content) {
  const m = content.match(/overall\s+score[:\s]*(\d{1,3})\s*(?:\/\s*100)?/i)
         || content.match(/(\d{1,3})\s*\/\s*100/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 0 && n <= 100) return n;
  }
  return 72;
}

function parseBreakdown(content) {
  const scores = [];
  for (const line of content.split('\n')) {
    const t = line.trim().replace(/\*\*/g, '');
    const m = t.match(/^[-•*]?\s*([^:]+):\s*(\d{1,3})\s*\/\s*100/);
    if (m) {
      const label = m[1].trim();
      const value = parseInt(m[2], 10);
      if (!label.toLowerCase().includes('overall') && value >= 0 && value <= 100) {
        scores.push({ label, value });
      }
    }
  }
  return scores;
}

function parseQuickWins(content) {
  const wins = [];
  let inWins = false;
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (/quick\s+win/i.test(t)) { inWins = true; continue; }
    if (inWins && /^\d+\.\s+/.test(t)) {
      wins.push(t.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim());
    }
    if (inWins && t.startsWith('##')) break;
  }
  return wins;
}

function splitKeywords(text) {
  return text
    .replace(/\*\*/g, '').replace(/[()]/g, '')
    .split(/[,;|]/)
    .map(k => k.trim().replace(/^[-•\d.]\s*/, '').replace(/^\d+-\d+\s*/, ''))
    .filter(k => k.length > 2 && !/^(list|keyword|phrase|include|cover)/i.test(k));
}

function parseSEOKeywords(content) {
  const result = { primary: [], secondary: [], longTail: [] };
  let currentGroup = null;

  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const lower = t.toLowerCase();

    if (/primary/i.test(lower) && !result.primary.length) {
      currentGroup = 'primary';
      const afterColon = t.includes(':') ? t.slice(t.indexOf(':') + 1) : '';
      result.primary.push(...splitKeywords(afterColon));
    } else if (/secondary/i.test(lower) && !result.secondary.length) {
      currentGroup = 'secondary';
      const afterColon = t.includes(':') ? t.slice(t.indexOf(':') + 1) : '';
      result.secondary.push(...splitKeywords(afterColon));
    } else if ((/long.?tail/i.test(lower) || /long.?tail/i.test(lower)) && !result.longTail.length) {
      currentGroup = 'longTail';
      const afterColon = t.includes(':') ? t.slice(t.indexOf(':') + 1) : '';
      result.longTail.push(...splitKeywords(afterColon));
    } else if (currentGroup && (t.startsWith('-') || t.startsWith('•') || t.startsWith('*') || /^\d+\./.test(t))) {
      const kw = t.replace(/^[-•*\d.]\s*/, '').replace(/\*\*/g, '').trim();
      if (kw) result[currentGroup].push(kw);
    }
  }
  return result;
}

function parseAdCopy(content) {
  const lines = content.split('\n');
  let section = null;
  let subsection = null;
  const googleHeadlines = [];
  const googleDescriptions = [];
  let fbHeadline = '';
  let fbBody = '';
  let fbCTA = '';

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const lower = t.toLowerCase().replace(/\*/g, '');

    if (/google/i.test(lower)) { section = 'google'; subsection = null; continue; }
    if (/facebook|instagram/i.test(lower)) { section = 'facebook'; subsection = null; continue; }

    if (section === 'google') {
      if (/headline/i.test(lower)) subsection = 'headlines';
      else if (/description/i.test(lower)) subsection = 'descriptions';
      if (t.startsWith('-') || t.startsWith('"') || /^\d+\./.test(t)) {
        const text = t.replace(/^[-"'\d.•*]\s*"?/, '').replace(/"$/, '').replace(/\*\*/g, '').trim();
        if (text && text.length > 3) {
          if (subsection === 'headlines' && googleHeadlines.length < 5) googleHeadlines.push(text);
          else if (subsection === 'descriptions' && googleDescriptions.length < 3) googleDescriptions.push(text);
        }
      }
    } else if (section === 'facebook') {
      const hMatch = t.match(/\*{0,2}headline[:\*\s]+(.+)/i);
      const bMatch = t.match(/\*{0,2}body[:\*\s]+(.+)/i);
      const cMatch = t.match(/\*{0,2}cta[^:]*[:\*\s]+(.+)/i);
      if (hMatch && !fbHeadline) fbHeadline = hMatch[1].replace(/\*\*/g, '').trim();
      else if (bMatch && !fbBody) fbBody = bMatch[1].replace(/\*\*/g, '').trim();
      else if (cMatch && !fbCTA) fbCTA = cMatch[1].replace(/\*\*/g, '').trim();
    }
  }
  return { googleHeadlines, googleDescriptions, fbHeadline, fbBody, fbCTA };
}

// ── Platform Icons ─────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="110%" r="150%">
          <stop offset="0%"   stopColor="#fdf497" />
          <stop offset="10%"  stopColor="#fd5949" />
          <stop offset="50%"  stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="17.8" cy="6.2" r="1.4" fill="white" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="#1877f2" />
      <path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="white" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <rect x="1" y="1" width="22" height="22" rx="5" fill="#010101" />
      <path d="M17 7.5A3.5 3.5 0 0 1 13.5 4h-2.5v10.5a1.5 1.5 0 1 1-1.5-1.5v-2.5A4 4 0 1 0 14 14.5V9a5.6 5.6 0 0 0 3 .88V7.5z" fill="white" />
      <path d="M15.5 7.5A3.5 3.5 0 0 1 12 4h-1a4.5 4.5 0 0 0 4.5 4.5z" fill="#69C9D0" opacity="0.8" />
    </svg>
  );
}

const PLATFORM_ICONS = {
  instagram: <InstagramIcon />,
  facebook:  <FacebookIcon />,
  tiktok:    <TikTokIcon />,
};

// ── Markdown renderers ─────────────────────────────────────────────────────

function InlineText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <strong key={i} className="text-gray-900 font-bold">{p}</strong>
          : p
      )}
    </>
  );
}

function MarkdownTable({ rows }) {
  const dataRows = rows.filter(r => !/^\|[-:\s|]+\|$/.test(r));
  if (dataRows.length < 2) return null;
  const parse = row => row.split('|').slice(1, -1).map(c => c.trim());
  const [header, ...body] = dataRows;
  const headers = parse(header);

  return (
    <div className="overflow-x-auto my-4 rounded-xl" style={{ border: '1px solid #e5e7eb' }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: '#ECFDF5' }}>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-bold text-emerald-800 border-b border-emerald-100 text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : '#f9fafb' }}>
              {parse(row).map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-gray-600 border-b border-gray-50 text-sm">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Line({ line }) {
  const t = line.trim();
  if (!t) return <div className="h-2" />;

  // Horizontal rule
  if (/^-{3,}$/.test(t) || /^_{3,}$/.test(t) || /^\*{3,}$/.test(t))
    return <hr className="border-gray-200 my-4" />;

  if (t.startsWith('### '))
    return <h4 className="text-gray-900 font-bold text-base mt-6 mb-2">{t.slice(4)}</h4>;

  // Platform headings: **Instagram:**, **Facebook:**, **TikTok:**
  const platformMatch = t.match(/^\*\*(Instagram|Facebook|TikTok)[^*]*\*\*[:\s]*(.*)/i);
  if (platformMatch) {
    const platform = platformMatch[1].toLowerCase();
    const rest = platformMatch[2].trim();
    const icon = PLATFORM_ICONS[platform];
    return (
      <div className="flex items-start gap-2.5 mt-5 mb-2">
        <span className="mt-0.5">{icon}</span>
        <div>
          <span className="font-black text-gray-900 text-sm">{platformMatch[1]}</span>
          {rest && <span className="text-gray-600 text-sm ml-1">{rest}</span>}
        </div>
      </div>
    );
  }

  const bullet = t.match(/^[-•*]\s+(.*)/);
  if (bullet) return (
    <div className="flex items-start gap-3 mb-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-[7px]" />
      <span className="text-gray-600 text-sm leading-relaxed"><InlineText text={bullet[1]} /></span>
    </div>
  );

  const numbered = t.match(/^(\d+)\.\s+(.*)/);
  if (numbered) return (
    <div className="flex items-start gap-3 mb-2.5">
      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex-shrink-0 flex items-center justify-center mt-0.5">{numbered[1]}</span>
      <span className="text-gray-600 text-sm leading-relaxed"><InlineText text={numbered[2]} /></span>
    </div>
  );

  // Bold-only line (entire line is **...**)
  if (t.startsWith('**') && t.endsWith('**') && !t.slice(2, -2).includes('**'))
    return <p className="text-gray-800 font-bold mt-5 mb-2 text-sm">{t.slice(2, -2)}</p>;

  return (
    <p className="text-gray-600 text-sm leading-relaxed mb-2">
      <InlineText text={t} />
    </p>
  );
}

function renderContent(content) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0, key = 0;

  while (i < lines.length) {
    // Detect markdown table block
    if (lines[i].trim().startsWith('|')) {
      const tableRows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableRows.push(lines[i].trim());
        i++;
      }
      elements.push(<MarkdownTable key={key++} rows={tableRows} />);
      continue;
    }
    elements.push(<Line key={key++} line={lines[i]} />);
    i++;
  }
  return elements;
}

// ── Score Ring ─────────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const [count, setCount] = useState(0);
  const C = 2 * Math.PI * 40;

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 1800;
    const animate = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * score));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const offset = C * (1 - count / 100);
  const color = count >= 80 ? '#10B981' : count >= 60 ? '#f59e0b' : '#ef4444';
  const label = count >= 80 ? 'Excellent' : count >= 60 ? 'Good' : 'Needs Work';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#D1FAE5" strokeWidth="8" />
          <circle cx="50" cy="50" r="40" fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.04s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-gray-900">{count}</span>
          <span className="text-gray-400 text-sm font-semibold">/100</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-bold px-4 py-1.5 rounded-full"
        style={{ background: color + '18', color }}>
        {label}
      </span>
    </div>
  );
}

// ── Breakdown Bar ──────────────────────────────────────────────────────────

function BreakdownBar({ label, value, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 200 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}<span className="text-gray-400 font-normal">/100</span></span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Score Section ──────────────────────────────────────────────────────────

function ScoreSection({ content }) {
  const score = extractScore(content);
  const breakdown = parseBreakdown(content);
  const quickWins = parseQuickWins(content);
  const expMatch = content.match(/explanation[:\s]+([\s\S]*?)(?=quick wins|\n\n\n|$)/i);
  const explanation = expMatch ? expMatch[1].replace(/\*\*/g, '').trim().split('\n')[0] : '';

  return (
    <div className="space-y-6">
      {/* Ring + explanation */}
      <div className="result-card p-8 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">Overall Marketing Score</p>
        <ScoreRing score={score} />
        {explanation && (
          <p className="text-gray-500 text-sm mt-5 max-w-lg mx-auto leading-relaxed">{explanation}</p>
        )}
      </div>

      {/* Breakdown bars */}
      {breakdown.length > 0 && (
        <div className="result-card p-6">
          <h4 className="font-black text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-sm">📊</span>
            Score Breakdown
          </h4>
          {breakdown.map((item, i) => (
            <BreakdownBar key={i} label={item.label} value={item.value} delay={i * 100} />
          ))}
        </div>
      )}

      {/* Quick wins */}
      {quickWins.length > 0 && (
        <div className="result-card p-6">
          <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-sm">⚡</span>
            Quick Wins — Implement This Week
          </h4>
          <div className="space-y-3">
            {quickWins.map((win, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: '#f0fdf4', border: '1px solid #d1fae5' }}>
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex-shrink-0 flex items-center justify-center">{i + 1}</span>
                <span className="text-gray-700 text-sm leading-relaxed">{win}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Ad Copy Section ────────────────────────────────────────────────────────

function AdSection({ content }) {
  const { googleHeadlines, googleDescriptions, fbHeadline, fbBody, fbCTA } = parseAdCopy(content);

  return (
    <div className="space-y-6">
      {/* Google Ad */}
      <div className="result-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: '#EFF6FF' }}>🔍</div>
          <h4 className="font-black text-gray-900">Google Search Ad</h4>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#EFF6FF', color: '#1d4ed8' }}>Preview</span>
        </div>

        {/* Mock Google result */}
        <div className="rounded-xl p-5" style={{ background: '#fafafa', border: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded border font-medium text-gray-500"
              style={{ borderColor: '#d1d5db' }}>Ad</span>
            <span className="text-xs text-gray-500">yourbusiness.com</span>
          </div>
          <p className="font-medium text-lg mb-1 leading-snug" style={{ color: '#1a0dab' }}>
            {googleHeadlines.slice(0, 3).join(' · ') || 'Your Business · Professional Services · Contact Us Today'}
          </p>
          {googleDescriptions.map((d, i) => (
            <p key={i} className="text-sm text-gray-600 leading-relaxed">{d}</p>
          ))}
          {!googleDescriptions.length && (
            <p className="text-sm text-gray-500">Your compelling ad description will appear here, driving clicks from your ideal customers.</p>
          )}
        </div>

        {/* All headlines as chips */}
        {googleHeadlines.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">All Headlines</p>
            <div className="flex flex-wrap gap-2">
              {googleHeadlines.map((h, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{ background: '#EFF6FF', color: '#1d4ed8', border: '1px solid #BFDBFE' }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Descriptions */}
        {googleDescriptions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Descriptions</p>
            <div className="space-y-2">
              {googleDescriptions.map((d, i) => (
                <div key={i} className="text-sm text-gray-600 px-3 py-2 rounded-lg"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Facebook Ad */}
      <div className="result-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: '#EFF6FF' }}>📘</div>
          <h4 className="font-black text-gray-900">Facebook / Instagram Ad</h4>
          <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#EFF6FF', color: '#1d4ed8' }}>Preview</span>
        </div>

        {/* Mock FB post */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
          <div className="px-4 py-3 flex items-center gap-3 bg-white" style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>M</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Your Business</p>
              <p className="text-xs text-gray-400">Sponsored · <span>🌐</span></p>
            </div>
            <div className="ml-auto text-gray-300 text-lg">···</div>
          </div>

          <div className="px-4 pt-3 pb-2 bg-white">
            <p className="text-sm text-gray-700 leading-relaxed">
              {fbBody || 'Your compelling Facebook ad body copy will appear here. This is where you connect with your ideal customers and drive them to take action.'}
            </p>
          </div>

          {/* Image placeholder */}
          <div className="mx-4 mb-3 rounded-xl h-36 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', border: '1.5px dashed #A7F3D0' }}>
            <div className="text-center">
              <div className="text-3xl mb-1">🖼️</div>
              <p className="text-emerald-600 text-xs font-semibold">Your Product / Service Image</p>
            </div>
          </div>

          <div className="px-4 py-3 flex items-center justify-between"
            style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <div className="min-w-0 mr-3">
              <p className="text-[10px] text-gray-400 font-medium uppercase">yourbusiness.com</p>
              <p className="font-bold text-gray-900 text-sm truncate">{fbHeadline || 'Your Compelling Ad Headline'}</p>
            </div>
            <button className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: '#1877f2' }}>
              {fbCTA || 'Learn More'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SEO Section ────────────────────────────────────────────────────────────

function SEOSection({ content }) {
  const { primary, secondary, longTail } = parseSEOKeywords(content);

  const groups = [
    { title: 'Primary Keywords', items: primary,    bg: '#ECFDF5', bd: '#A7F3D0', text: '#065F46' },
    { title: 'Secondary Keywords', items: secondary, bg: '#EFF6FF', bd: '#BFDBFE', text: '#1e40af' },
    { title: 'Long-Tail Phrases',  items: longTail,  bg: '#FAF5FF', bd: '#E9D5FF', text: '#6d28d9' },
  ];

  // If parsing found nothing, fall back to generic render
  const hasData = primary.length || secondary.length || longTail.length;
  if (!hasData) return <div>{renderContent(content)}</div>;

  return (
    <div className="space-y-5">
      {groups.map((g, gi) => g.items.length > 0 && (
        <div key={gi} className="result-card p-6">
          <h4 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wide" style={{ color: g.text }}>
            {g.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {g.items.map((kw, i) => (
              <span key={i}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold cursor-default transition-transform hover:scale-105"
                style={{ background: g.bg, border: `1px solid ${g.bd}`, color: g.text }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Copy Button ────────────────────────────────────────────────────────────

function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button onClick={copy}
      className="text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all flex-shrink-0"
      style={{
        background: done ? '#ECFDF5' : '#f3f4f6',
        color:      done ? '#065F46' : '#6b7280',
        border:     done ? '1px solid #A7F3D0' : '1px solid #e5e7eb',
      }}>
      {done ? '✓ Copied' : 'Copy'}
    </button>
  );
}

// ── Fade wrapper ───────────────────────────────────────────────────────────

function FadeIn({ children }) {
  return (
    <div style={{ animation: 'fadeSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards' }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function StrategyResults({ strategy, businessDescription, onReset }) {
  const sections = useMemo(() => parseSections(strategy || ''), [strategy]);
  const [activeIdx, setActiveIdx] = useState(0);
  const tabsRef = useRef(null);

  if (!strategy || sections.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">No strategy data available.</p>
      </div>
    );
  }

  const active     = sections[activeIdx];
  const activeMeta = getMeta(active.title);
  const isScore    = activeMeta.key === 'score';
  const isAds      = activeMeta.key === 'ads';
  const isSEO      = activeMeta.key === 'seo';

  const scrollTabIntoView = (i) => {
    const bar = tabsRef.current;
    if (!bar) return;
    const btn = bar.children[i];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const handleTab = (i) => {
    setActiveIdx(i);
    scrollTabIntoView(i);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Sticky Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100"
        style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>M</div>
            <div className="min-w-0">
              <p className="font-black text-gray-900 text-sm leading-none">MarketGenie</p>
              <p className="text-gray-400 text-xs truncate max-w-[220px] hidden sm:block mt-0.5">
                {businessDescription.slice(0, 65)}{businessDescription.length > 65 ? '…' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 text-xs font-bold">Strategy Ready</span>
            </div>
            <button onClick={onReset}
              className="text-sm font-bold px-4 py-2 rounded-xl transition-all border hover:bg-gray-50"
              style={{ color: '#374151', borderColor: '#e5e7eb' }}>
              New Strategy
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Header ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-bold"
            style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Your Complete Strategy is Ready
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            Marketing Strategy
          </h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed text-sm sm:text-base">
            "{businessDescription}"
          </p>
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────── */}
      <div className="sticky top-[65px] z-40 bg-white border-b border-gray-100"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div ref={tabsRef} className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide min-w-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {sections.map((sec, i) => {
            const m = getMeta(sec.title);
            const isActive = i === activeIdx;
            return (
              <button key={i} onClick={() => handleTab(i)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex-shrink-0"
                style={{
                  background: isActive ? '#10B981' : '#f3f4f6',
                  color:      isActive ? '#ffffff' : '#6b7280',
                  boxShadow:  isActive ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                }}>
                <span>{m.icon}</span>
                <span className="hidden sm:inline">{sec.title}</span>
                <span className="sm:hidden">{m.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <FadeIn key={activeIdx}>
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: activeMeta.color + '15', border: `1px solid ${activeMeta.color}30` }}>
                {activeMeta.icon}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{active.title}</h2>
                <p className="text-gray-400 text-xs">{sections.length} sections total</p>
              </div>
            </div>
            <CopyBtn text={`${active.title}\n\n${active.content}`} />
          </div>

          {/* Section-specific rendering */}
          {isScore && <ScoreSection content={active.content} />}
          {isAds   && <AdSection   content={active.content} />}
          {isSEO   && <SEOSection  content={active.content} />}

          {/* Generic sections */}
          {!isScore && !isAds && !isSEO && (
            <div className="result-card p-6 sm:p-8">
              {renderContent(active.content)}
            </div>
          )}

          {/* Nav between sections */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => handleTab(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-30">
              ← Previous
            </button>
            <span className="text-xs text-gray-300">{activeIdx + 1} / {sections.length}</span>
            <button
              onClick={() => handleTab(Math.min(sections.length - 1, activeIdx + 1))}
              disabled={activeIdx === sections.length - 1}
              className="flex items-center gap-2 text-sm font-semibold hover:text-emerald-600 transition-colors disabled:opacity-30"
              style={{ color: activeIdx === sections.length - 1 ? '#9ca3af' : '#10B981' }}>
              Next →
            </button>
          </div>
        </FadeIn>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-t border-gray-100 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-400 text-sm">© 2026 MarketGenie · Powered by Claude AI</p>
          <button onClick={onReset}
            className="emerald-btn px-6 py-2.5 rounded-xl text-sm font-bold">
            <span>Generate New Strategy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
