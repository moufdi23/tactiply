import { useState } from 'react';
import { Crown, CheckCircle2, Lock, Rocket } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function WaitlistModal({ onClose }) {
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      if (supabase) {
        const { error: dbErr } = await supabase
          .from('waitlist')
          .insert({ name: name.trim(), email: email.trim().toLowerCase() });

        // 23505 = unique_violation — email already on the list, treat as success
        if (dbErr && dbErr.code !== '23505') {
          throw dbErr;
        }
      }
      setDone(true);
    } catch (err) {
      console.error('Waitlist error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md animate-slide-up rounded-3xl bg-white"
        style={{ border: '1px solid #e2e8f0', boxShadow: '0 28px 72px rgba(0,0,0,0.18)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          aria-label="Close">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {done ? (
          /* ── Success state ── */
          <div className="px-8 py-10 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)', border: '2px solid #A7F3D0', boxShadow: '0 0 0 8px rgba(16,185,129,0.07)' }}>
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">You're on the list!</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-1">
              We'll notify you when Pro launches.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Early adopters get <strong className="text-emerald-600">exclusive pricing</strong> — your spot is reserved. We'll be in touch soon.
            </p>
            <button
              onClick={onClose}
              className="emerald-btn w-full py-3.5 rounded-2xl font-bold text-base"
            >
              <span>Got it — thanks!</span>
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <div className="px-8 py-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 6px 24px rgba(5,150,105,0.32)' }}>
                <Crown className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Join the Pro Waitlist</h2>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                Be first in line. Early adopters get exclusive pricing when we launch.
              </p>
            </div>

            {/* What's included callout */}
            <div className="rounded-2xl px-4 py-3.5 mb-5"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Pro includes</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'Unlimited strategies',
                  'Ad Copy (Google + FB)',
                  'Full SEO Keywords',
                  'Competitor Analysis',
                  'Score Breakdown',
                  'All email templates',
                  'Regenerate any section',
                  'PDF export',
                ].map(f => (
                  <div key={f} className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-slate-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none transition-all text-sm"
                  style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
                  onFocus={e  => (e.target.style.borderColor = '#059669')}
                  onBlur={e   => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@yourbusiness.com"
                  required
                  className="w-full px-4 py-3 rounded-xl text-slate-900 placeholder-slate-300 focus:outline-none transition-all text-sm"
                  style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
                  onFocus={e  => (e.target.style.borderColor = '#059669')}
                  onBlur={e   => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 px-3 py-2 rounded-lg"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!name.trim() || !email.trim() || submitting}
                className="emerald-btn w-full py-3.5 rounded-2xl text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none mt-1"
              >
                <span>
                  {submitting ? 'Saving your spot…' : "Join the Waitlist — It's Free"}
                </span>
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 mt-4">
              <Lock className="w-3 h-3 text-slate-300" />
              <p className="text-center text-slate-400 text-xs">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
