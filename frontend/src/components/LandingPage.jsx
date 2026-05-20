import { useState, useEffect, useRef } from 'react';

// ── Constants ──────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  '🍕 Restaurant', '🦷 Dental Clinic', '💪 Gym', '🧁 Bakery',
  '⚖️ Law Firm', '🏠 Real Estate', '💇 Salon', '📸 Photography',
  '🐕 Pet Grooming', '🌿 Wellness Studio', '🏋️ Personal Trainer', '🎂 Catering',
];

const FEATURES = [
  { icon: '🎯', bg: '#FEF2F2', bd: '#FECACA', title: 'Target Audience Profile',   desc: 'Know exactly who your ideal customer is — demographics, psychographics, pain points, and buying triggers.' },
  { icon: '📱', bg: '#FAF5FF', bd: '#E9D5FF', title: 'Social Media Content',       desc: 'Ready-to-use content ideas for Instagram, Facebook, and TikTok tailored to your specific business.' },
  { icon: '📅', bg: '#EFF6FF', bd: '#BFDBFE', title: '30-Day Content Calendar',    desc: 'A full day-by-day posting schedule so you always know what to post and when.' },
  { icon: '📧', bg: '#ECFDF5', bd: '#A7F3D0', title: 'Email Marketing Templates',  desc: 'Professional welcome, promo, and re-engagement email templates — ready to copy and send.' },
  { icon: '💰', bg: '#F0FDF4', bd: '#BBF7D0', title: 'Google & Facebook Ad Copy',  desc: 'High-converting ad headlines and descriptions you can launch today on any budget.' },
  { icon: '🔍', bg: '#FFFBEB', bd: '#FDE68A', title: 'SEO Keywords',               desc: 'Primary, secondary, and long-tail keywords to help customers find you on Google.' },
  { icon: '⭐', bg: '#FDF4FF', bd: '#F0ABFC', title: 'Marketing Score /100',       desc: 'Understand your marketing strengths and get specific quick wins to improve your score.' },
  { icon: '💬', bg: '#EEF2FF', bd: '#C7D2FE', title: 'Smart AI Conversation',      desc: 'Our AI asks 5 targeted questions specific to your business type — not a generic form.' },
  { icon: '⚡', bg: '#ECFDF5', bd: '#6EE7B7', title: 'Done in 60 Seconds',         desc: 'No agency, no consultant, no waiting. Your complete strategy is ready instantly.' },
];

const STEPS = [
  { n: '01', title: 'Describe Your Business',     desc: 'Type one sentence about what you do. No sign-up, no credit card, no catch.' },
  { n: '02', title: 'Answer 5 Smart Questions',   desc: 'Our AI asks 5 questions tailored to your exact business type — goals, budget, and customers.' },
  { n: '03', title: 'Receive Your Full Strategy', desc: 'Get a complete marketing playbook: social content, ad copy, email templates, SEO, and your marketing score.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Custom Cake Studio', avatar: '👩‍🍳', stars: 5, text: "I spent $2,000 on a marketing consultant and got less than what MarketGenie gave me in 60 seconds. The ad copy alone got me 3 new wedding bookings." },
  { name: 'James K.', role: 'Personal Trainer',   avatar: '💪',   stars: 5, text: "My Facebook ads went from zero to 12 new clients in a single month. The targeting advice was spot-on for my exact gym type." },
  { name: 'Priya L.', role: 'Etsy Jewelry Shop',  avatar: '🎨',   stars: 5, text: "The 30-day content calendar alone saves me 4+ hours a week. I know exactly what to post, when, and why. Total game changer." },
];

const EXAMPLES = [
  'I run a small bakery specializing in custom wedding cakes',
  'I offer mobile dog grooming in the suburbs',
  'I sell handmade jewelry at local markets and on Etsy',
  'I provide personal training from my home gym',
];

const PRICING_FREE = [
  '3 marketing strategies per month',
  'All 7 strategy sections included',
  'PDF export',
  'Email templates',
  'SEO keyword research',
  'Basic support',
];

const PRICING_PRO = [
  'Unlimited strategies',
  'Priority Claude AI processing',
  'PDF + DOCX export',
  'White-label PDF reports',
  '30-day advanced content calendar',
  'Google & Facebook ad copy',
  'Priority email support',
  'New features first',
];

// ── Hooks ──────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Helpers ────────────────────────────────────────────────────────────────

const rs = (visible, delay = 0) => ({
  opacity:   visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(30px)',
  transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Check({ dark }) {
  return (
    <svg className={`w-5 h-5 flex-shrink-0 ${dark ? 'text-emerald-300' : 'text-emerald-500'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ── Mock Dashboard ─────────────────────────────────────────────────────────

function MockDashboard({ visible }) {
  const C = 2 * Math.PI * 40; // ≈ 251.3
  const score = 87;
  const offset = C * (1 - score / 100); // ≈ 32.7

  return (
    <div className="w-full animate-float" style={{ filter: 'drop-shadow(0 32px 64px rgba(16,185,129,0.2))' }}>
      {/* Browser chrome */}
      <div className="rounded-t-2xl px-4 py-3 flex items-center gap-2.5 border-b"
        style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderBottom: 'none' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 rounded-md px-3 py-1 text-center text-xs font-mono text-gray-400"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}>
          app.marketgenie.ai/strategy/bakery
        </div>
      </div>

      {/* Dashboard body */}
      <div className="rounded-b-2xl border border-t-0 p-4 space-y-3"
        style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-gray-800">Your Marketing Strategy</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Custom Cake Studio · Generated 48s ago</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700">Ready</span>
          </div>
        </div>

        {/* Score + Audience row */}
        <div className="grid grid-cols-2 gap-3">

          {/* Score ring */}
          <div className="mock-card p-3 flex flex-col items-center gap-1">
            <p className="text-[10px] font-semibold text-gray-500">Marketing Score</p>
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#D1FAE5" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="10"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: C,
                    strokeDashoffset: visible ? offset : C,
                    transition: 'stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1) 0.5s',
                  }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-900">{visible ? score : 0}</span>
                <span className="text-[9px] text-gray-400 font-semibold">/100</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">Excellent ↑</span>
          </div>

          {/* Target audience */}
          <div className="mock-card p-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-500">Target Audience</p>
            <div className="flex items-center gap-1.5">
              <span>👩</span>
              <span className="text-[10px] text-gray-700">Women, 25–44</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>📍</span>
              <span className="text-[10px] text-gray-700">Urban suburbs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>💰</span>
              <span className="text-[10px] text-gray-700">$60K–$120K income</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {['Celebrations', 'Gifting', 'Events'].map(t => (
                <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#ECFDF5', color: '#065F46' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* SEO keywords */}
        <div className="mock-card p-3">
          <p className="text-[10px] font-semibold text-gray-500 mb-2">🔍 Top SEO Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { kw: 'custom wedding cakes', vol: '8.1K' },
              { kw: 'bakery near me',        vol: '22K'  },
              { kw: 'birthday cake delivery', vol: '5.4K' },
              { kw: 'cake shop Chicago',      vol: '3.2K' },
            ].map(k => (
              <div key={k.kw} className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <span className="text-[9px] text-gray-600">{k.kw}</span>
                <span className="text-[9px] font-black text-emerald-600">{k.vol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social content ideas */}
        <div className="mock-card p-3">
          <p className="text-[10px] font-semibold text-gray-500 mb-2">📱 Social Content Ideas</p>
          <div className="space-y-1.5">
            {[
              { label: 'IG', lbg: '#fce7f3', lc: '#be185d', idea: '"Behind the cake" timelapse reel' },
              { label: 'FB', lbg: '#dbeafe', lc: '#1d4ed8', idea: 'Customer testimonial + photo carousel' },
              { label: 'TK', lbg: '#f3f4f6', lc: '#111827', idea: 'Cake decorating ASMR trend video' },
            ].map(item => (
              <div key={item.idea} className="flex items-center gap-2">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: item.lbg, color: item.lc }}>
                  {item.label}
                </span>
                <span className="text-[9px] text-gray-600 leading-tight">{item.idea}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function LandingPage({ onGetStarted, error, onClearError }) {
  const [showModal, setShowModal]   = useState(false);
  const [business, setBusiness]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [heroRef,         heroVisible]         = useReveal();
  const [statsRef,        statsVisible]        = useReveal();
  const [featuresRef,     featuresVisible]     = useReveal();
  const [stepsRef,        stepsVisible]        = useReveal();
  const [pricingRef,      pricingVisible]      = useReveal();
  const [testimonialsRef, testimonialsVisible] = useReveal();
  const [ctaRef,          ctaVisible]          = useReveal();

  const openModal  = () => { onClearError(); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setBusiness(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!business.trim() || submitting) return;
    setSubmitting(true);
    await onGetStarted(business.trim());
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #f0fdf4' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
            <span>M</span>
          </div>
          <span className="font-black text-lg tracking-tight text-gray-900">MarketGenie</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block">Free · No Credit Card</span>
          <button onClick={openModal} className="emerald-btn px-5 py-2.5 rounded-xl text-sm font-bold">
            <span>Get Started Free</span>
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-28 pb-0 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #ECFDF5 0%, #ffffff 55%)' }}>

        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,95,70,0.05) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-7rem)] pb-16">

            {/* Left — text */}
            <div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', ...rs(heroVisible, 0) }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                AI-Powered · Free · Ready in 60 Seconds
              </div>

              <h1 style={{ color: '#065F46', ...rs(heroVisible, 80) }}
                className="text-5xl sm:text-6xl font-black leading-[1.04] mb-6 tracking-tight">
                Your Complete<br />
                Marketing Strategy<br />
                <span className="gradient-text">in 60 Seconds Flat.</span>
              </h1>

              <p style={rs(heroVisible, 160)} className="text-xl text-gray-500 max-w-lg mb-10 leading-relaxed">
                Describe your business in one sentence. Our AI builds a full marketing playbook — social content, email templates, ad copy, SEO keywords, and your marketing score. Free. Instant. Insanely good.
              </p>

              <div style={rs(heroVisible, 240)} className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={openModal}
                  className="emerald-btn px-10 py-4 rounded-2xl text-lg font-black">
                  <span>Get My Free Strategy →</span>
                </button>
                <button onClick={openModal}
                  className="px-10 py-4 rounded-2xl text-lg font-bold border-2 border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 transition-all">
                  See a Sample
                </button>
              </div>

              <div style={rs(heroVisible, 310)} className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['👩‍🍳','💪','🏠','📸','🦷'].map((e, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-lg"
                      style={{ background: '#ECFDF5' }}>{e}</div>
                  ))}
                </div>
                <div>
                  <Stars n={5} />
                  <p className="text-sm text-gray-500 mt-0.5">Loved by <span className="font-bold text-gray-800">10,000+</span> business owners</p>
                </div>
              </div>

              {error && (
                <div className="mt-5 rounded-xl px-4 py-3 text-red-600 text-sm font-medium"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  {error}
                </div>
              )}
            </div>

            {/* Right — mock dashboard */}
            <div style={rs(heroVisible, 200)} className="relative hidden lg:block">
              <MockDashboard visible={heroVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ──────────────────────────────────────────────────── */}
      <div className="py-5 border-y" style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}
                className="inline-flex items-center gap-2 mx-4 px-4 py-2 rounded-full text-sm font-semibold text-gray-600 whitespace-nowrap"
                style={{ background: '#ffffff', border: '1.5px solid #e5e7eb' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div ref={statsRef} className="py-16 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 px-6 text-center">
          {[
            { val: '10K+',  label: 'Strategies Generated' },
            { val: '95%',   label: 'Satisfaction Rate' },
            { val: '< 60s', label: 'Generation Time' },
            { val: '$0',    label: 'To Get Started' },
          ].map((s, i) => (
            <div key={s.label} style={rs(statsVisible, i * 100)}>
              <div className="text-4xl font-black mb-1 gradient-text">{s.val}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features grid ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-24 px-6" style={{ background: '#f9fafb' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" style={rs(featuresVisible)}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#10B981' }}>What You Get</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#065F46' }}>
              Everything You Need to<br />Market Your Business
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              One AI session generates your entire marketing toolkit
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} style={rs(featuresVisible, (i % 3) * 80)}
                className="feature-card p-6 cursor-default group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.bg, border: `1.5px solid ${f.bd}` }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div ref={stepsRef}>
            <div className="text-center mb-14" style={rs(stepsVisible)}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#10B981' }}>Process</p>
              <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#065F46' }}>
                How MarketGenie Works
              </h2>
              <p className="text-gray-500 text-lg">From one sentence to a full strategy in 3 steps</p>
            </div>

            {/* Steps with animated connector */}
            <div className="relative">
              {/* Animated connector line */}
              <div style={{
                position:        'absolute',
                left:            '31px',
                top:             '40px',
                width:           '2px',
                height:          'calc(100% - 80px)',
                background:      'linear-gradient(180deg,#10B981,#A7F3D0)',
                transform:       stepsVisible ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: 'top',
                transition:      'transform 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s',
              }} />

              <div className="space-y-5">
                {STEPS.map((s, i) => (
                  <div key={i} style={rs(stepsVisible, i * 160)} className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg text-white z-10 relative"
                      style={{ background: 'linear-gradient(135deg,#10B981,#059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                      {s.n}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100"
                      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                      <h3 className="font-bold text-xl mb-2" style={{ color: '#065F46' }}>{s.title}</h3>
                      <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section ref={pricingRef} className="py-24 px-6" style={{ background: '#f9fafb' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14" style={rs(pricingVisible)}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#10B981' }}>Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#065F46' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 text-lg">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Free */}
            <div style={rs(pricingVisible, 0)} className="pricing-card p-8">
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Free</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-gray-900">$0</span>
                  <span className="text-gray-400 mb-2">/month</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PRICING_FREE.map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                    <Check /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={openModal}
                className="w-full py-4 rounded-2xl font-bold text-base border-2 transition-all hover:bg-emerald-50"
                style={{ borderColor: '#10B981', color: '#10B981' }}>
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div style={rs(pricingVisible, 120)} className="pricing-card featured p-8 relative overflow-hidden">
              {/* Most Popular badge */}
              <div className="absolute top-6 right-6 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#d1fae5', border: '1px solid rgba(255,255,255,0.25)' }}>
                Most Popular
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#6ee7b7' }}>Pro</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="mb-2" style={{ color: '#6ee7b7' }}>/month</span>
                </div>
                <p className="text-sm mt-2" style={{ color: '#a7f3d0' }}>For serious business owners</p>
              </div>
              <ul className="space-y-3 mb-8">
                {PRICING_PRO.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#d1fae5' }}>
                    <Check dark /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={openModal}
                className="w-full py-4 rounded-2xl font-bold text-base text-emerald-700 transition-all hover:scale-[1.02]"
                style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                Start Pro Trial →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section ref={testimonialsRef} className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14" style={rs(testimonialsVisible)}>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#10B981' }}>Testimonials</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#065F46' }}>
              Real Results from Real<br />Business Owners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-7 flex flex-col gap-4"
                style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', ...rs(testimonialsVisible, i * 120) }}>
                <Stars n={t.stars} />
                <p className="text-gray-600 leading-relaxed flex-1 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section ref={ctaRef} className="py-24 px-6"
        style={{ background: 'linear-gradient(135deg, #065F46 0%, #047857 60%, #059669 100%)' }}>
        <div style={rs(ctaVisible)} className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-8"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
            🚀
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            Ready to Grow<br />Your Business?
          </h2>
          <p className="text-lg mb-10 max-w-md mx-auto leading-relaxed" style={{ color: '#a7f3d0' }}>
            Join 10,000+ small business owners who stopped guessing and started growing — for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openModal}
              className="px-14 py-5 rounded-2xl text-xl font-black text-emerald-700 transition-all hover:scale-[1.03]"
              style={{ background: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              Get My Free Strategy →
            </button>
          </div>
          <p className="mt-6 text-sm" style={{ color: '#6ee7b7' }}>No credit card · No sign-up · Instant results</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100">
        {/* Top row */}
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}>
                M
              </div>
              <span className="font-black text-lg text-gray-900">MarketGenie</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
              AI-powered marketing for every business.
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#10B981' }}>Product</p>
            <ul className="space-y-3">
              {['How it Works', 'Pricing', 'See a Sample'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#10B981' }}>Company</p>
            <ul className="space-y-3">
              {['About', 'Contact', 'FAQ', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-gray-400 text-sm">© 2026 MarketGenie. All rights reserved.</p>
            <p className="text-gray-400 text-sm">Built by Moufdi · Powered by Claude AI</p>
          </div>
        </div>
      </footer>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative w-full max-w-xl animate-slide-up rounded-3xl p-8 bg-white"
            style={{ border: '1.5px solid #e5e7eb', boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>

            <button onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all text-lg leading-none">
              ✕
            </button>

            <div className="text-center mb-7">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.35)' }}>
                M
              </div>
              <h2 className="text-2xl font-black text-gray-900">Tell us about your business</h2>
              <p className="text-gray-400 mt-1.5 text-sm">One sentence is all we need to build your strategy</p>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                value={business}
                onChange={e => setBusiness(e.target.value)}
                placeholder="e.g., I run a small bakery that specializes in custom wedding cakes in Chicago…"
                className="w-full rounded-2xl px-5 py-4 text-gray-900 text-base placeholder-gray-300 resize-none focus:outline-none transition-all"
                style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb' }}
                rows={4}
                maxLength={300}
                autoFocus
                onFocus={e => (e.target.style.borderColor = '#10B981')}
                onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
              />

              <div className="flex items-center justify-between mt-2 mb-2">
                <p className="text-gray-400 text-xs">Try an example:</p>
                <span className="text-gray-400 text-xs">{business.length}/300</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {EXAMPLES.map((ex, i) => (
                  <button key={i} type="button" onClick={() => setBusiness(ex)}
                    className="text-xs rounded-full px-3 py-1.5 transition-all hover:border-emerald-400 hover:text-emerald-700"
                    style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46' }}>
                    {ex.slice(0, 32)}…
                  </button>
                ))}
              </div>

              <button type="submit"
                disabled={!business.trim() || submitting}
                className="emerald-btn w-full py-4 rounded-2xl text-lg font-black disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                <span>{submitting ? 'Analyzing your business…' : 'Generate My Strategy →'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
