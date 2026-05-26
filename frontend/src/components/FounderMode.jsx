/**
 * FounderMode — secret keyboard-triggered bypass
 *
 * Press Ctrl+Shift+F anywhere in the app to reveal a subtle password input
 * in the bottom-right corner. Type the founder password and press Enter.
 *
 * Correct  → activates founder mode for this browser session (sessionStorage),
 *            shows a persistent "Founder Mode Active" badge, input fades away.
 * Incorrect → input shakes briefly then fades away.
 *
 * The badge stays visible until the tab/browser is closed.
 */

import { useEffect, useRef, useState } from 'react';
import { isFounderActive, activateFounder } from '../plan';
import { ShieldCheck, X } from 'lucide-react';

const FOUNDER_PASSWORD = 'password0000';

export default function FounderMode() {
  const [visible,  setVisible]  = useState(false);   // input box shown
  const [value,    setValue]    = useState('');
  const [shake,    setShake]    = useState(false);    // wrong-password animation
  const [active,   setActive]   = useState(isFounderActive);  // badge shown
  const inputRef = useRef(null);

  // ── Global Ctrl+Shift+F listener ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (active) return;            // already active — nothing to show
        setVisible(v => !v);
        setValue('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // Focus the input whenever it appears
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [visible]);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleKey = (e) => {
    if (e.key === 'Escape') { dismiss(); return; }
    if (e.key !== 'Enter')  return;

    if (value === FOUNDER_PASSWORD) {
      activateFounder();
      setActive(true);
      dismiss();
    } else {
      // Wrong — shake and auto-dismiss
      setShake(true);
      setTimeout(() => { setShake(false); dismiss(); }, 700);
    }
  };

  const dismiss = () => {
    setVisible(false);
    setValue('');
  };

  // ── Nothing to render if inactive & hidden ────────────────────────────────
  if (!visible && !active) return null;

  return (
    <>
      {/* ── Founder Mode Active badge ────────────────────────────────────── */}
      {active && (
        <div
          style={{
            position: 'fixed',
            bottom: 14,
            left: 14,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px 5px 7px',
            background: '#052e16',
            border: '1px solid #166534',
            borderRadius: 99,
            boxShadow: '0 2px 12px rgba(5,46,22,0.4)',
            animation: 'founderFadeIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          <ShieldCheck style={{ width: 13, height: 13, color: '#4ade80', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#86efac', letterSpacing: '0.02em' }}>
            Founder Mode Active
          </span>
        </div>
      )}

      {/* ── Hidden password input ─────────────────────────────────────────── */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 8px',
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            animation: shake
              ? 'founderShake 0.45s cubic-bezier(0.36,0.07,0.19,0.97)'
              : 'founderSlideUp 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          <ShieldCheck style={{ width: 13, height: 13, color: '#64748b', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="founder key"
            maxLength={32}
            style={{
              width: 112,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e2e8f0',
              fontSize: 12,
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              caretColor: '#10b981',
            }}
          />
          <button
            onClick={dismiss}
            tabIndex={-1}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#475569' }}
          >
            <X style={{ width: 12, height: 12 }} />
          </button>
        </div>
      )}

      {/* ── Keyframe animations ───────────────────────────────────────────── */}
      <style>{`
        @keyframes founderSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes founderFadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes founderShake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
      `}</style>
    </>
  );
}
