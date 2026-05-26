import { useState, useEffect, useRef } from 'react';
import {
  Target, Smartphone, CalendarDays, Mail, MousePointerClick,
  Search, BarChart3, MessageSquare, Zap, Rocket,
  UtensilsCrossed, Smile, Dumbbell, Coffee, Scale, Home,
  Scissors, Camera, Heart, Leaf, Activity, ChefHat,
  User, MapPin, DollarSign, Lock, ArrowRight, Bot,
  CheckCircle2, Minus, Check, Star,
} from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { Icon: UtensilsCrossed, label: 'Restaurant' },
  { Icon: Smile,           label: 'Dental Clinic' },
  { Icon: Dumbbell,        label: 'Gym' },
  { Icon: Coffee,          label: 'Bakery' },
  { Icon: Scale,           label: 'Law Firm' },
  { Icon: Home,            label: 'Real Estate' },
  { Icon: Scissors,        label: 'Salon' },
  { Icon: Camera,          label: 'Photography' },
  { Icon: Heart,           label: 'Pet Grooming' },
  { Icon: Leaf,            label: 'Wellness Studio' },
  { Icon: Activity,        label: 'Personal Trainer' },
  { Icon: ChefHat,         label: 'Catering' },
];

const FEATURES = [
  { Icon: Target,            iconColor: '#ef4444', bg: '#FEF2F2', bd: '#FECACA', title: 'Target Audience Profile',   desc: 'Know exactly who your ideal customer is — demographics, psychographics, pain points, and buying triggers.' },
  { Icon: Smartphone,        iconColor: '#8b5cf6', bg: '#FAF5FF', bd: '#E9D5FF', title: 'Social Media Content',       desc: 'Ready-to-use content ideas for Instagram, Facebook, and TikTok tailored to your specific business.' },
  { Icon: CalendarDays,      iconColor: '#3b82f6', bg: '#EFF6FF', bd: '#BFDBFE', title: '30-Day Content Calendar',    desc: 'A full day-by-day posting schedule so you always know what to post and when.' },
  { Icon: Mail,              iconColor: '#06b6d4', bg: '#ECFEFF', bd: '#A5F3FC', title: 'Email Marketing Templates',  desc: 'Professional welcome, promo, and re-engagement email templates — ready to copy and send.' },
  { Icon: MousePointerClick, iconColor: '#059669', bg: '#ECFDF5', bd: '#A7F3D0', title: 'Google & Facebook Ad Copy',  desc: 'High-converting ad headlines and descriptions you can launch today on any budget.' },
  { Icon: Search,            iconColor: '#d97706', bg: '#FFFBEB', bd: '#FDE68A', title: 'SEO Keywords',               desc: 'Primary, secondary, and long-tail keywords to help customers find you on Google.' },
  { Icon: BarChart3,         iconColor: '#059669', bg: '#F0FDF4', bd: '#BBF7D0', title: 'Marketing Score /100',       desc: 'Understand your marketing strengths and get specific quick wins to improve your score.' },
  { Icon: MessageSquare,     iconColor: '#7c3aed', bg: '#F5F3FF', bd: '#DDD6FE', title: 'Smart AI Conversation',      desc: 'Our AI asks 5 targeted questions specific to your business type — not a generic form.' },
  { Icon: Zap,               iconColor: '#d97706', bg: '#FFFBEB', bd: '#FDE68A', title: 'Done in 60 Seconds',         desc: 'No agency, no consultant, no waiting. Your complete strategy is ready instantly.' },
];

const STEPS = [
  { n: '01', title: 'Describe Your Business',     desc: 'Type one sentence about what you do. No sign-up, no credit card, no catch.' },
  { n: '02', title: 'Answer 5 Smart Questions',   desc: 'Our AI asks 5 questions tailored to your exact business type — goals, budget, and customers.' },
  { n: '03', title: 'Receive Your Full Strategy', desc: 'Get a complete marketing playbook: social content, ad copy, email templates, SEO, and your marketing score.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Custom Cake Studio', initials: 'SM', color: '#ECFDF5', stars: 5, text: "I spent $2,000 on a marketing consultant and got less than what MarketGenie gave me in 60 seconds. The ad copy alone got me 3 new wedding bookings." },
  { name: 'James K.', role: 'Personal Trainer',   initials: 'JK', color: '#EFF6FF', stars: 5, text: "My Facebook ads went from zero to 12 new clients in a single month. The targeting advice was spot-on for my exact gym type." },
  { name: 'Priya L.', role: 'Etsy Jewelry Shop',  initials: 'PL', color: '#FAF5FF', stars: 5, text: "The 30-day content calendar alone saves me 4+ hours a week. I know exactly what to post, when, and why. Total game changer." },
];

const EXAMPLES = [
  'I run a small bakery specializing in custom wedding cakes',
  'I offer mobile dog grooming in the suburbs',
  'I sell handmade jewelry at local markets and on Etsy',
  'I provide personal training from my home gym',
];

const PRICING_FREE = [
  { text: '1 strategy per week',                access: 'full'    },
  { text: 'Target Audience — full access',       access: 'full'    },
  { text: 'Social Media Strategy — full access', access: 'full'    },
  { text: '30-Day Content Calendar — full',      access: 'full'    },
  { text: 'Email Templates — first only',        access: 'partial' },
  { text: 'Marketing Score — number only',       access: 'partial' },
  { text: 'Ad Copy',                             access: 'locked'  },
  { text: 'SEO Keywords',                        access: 'locked'  },
  { text: 'Competitor Analysis',                 access: 'locked'  },
];

const PRICING_PRO = [
  { text: 'Unlimited strategies',                         highlight: true  },
  { text: 'Everything in Free plan',                      highlight: false },
  { text: 'Full Marketing Score + breakdown + Quick Wins',highlight: false },
  { text: 'All 3 email templates',                        highlight: false },
  { text: 'Ad Copy — Google & Facebook previews',         highlight: false },
  { text: 'Full SEO Keywords breakdown',                  highlight: false },
  { text: 'Competitor Analysis',                          highlight: false },
  { text: 'Regenerate any section',                       highlight: false },
  { text: 'Zero ads',                                     highlight: false },
  { text: 'PDF export',                                   highlight: false },
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
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Helpers ────────────────────────────────────────────────────────────────

const rs = (visible, delay = 0) => ({
  opacity:   visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(24px)',
  transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
});

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

function CheckIcon({ dark }) {
  return <Check className={`w-4 h-4 flex-shrink-0 ${dark ? 'text-emerald-300' : 'text-emerald-500'}`} strokeWidth={2.5} />;
}

function LockIcon() {
  return <Lock className="w-3.5 h-3.5 flex-shrink-0 text-slate-300" />;
}

function PartialIcon() {
  return (
    <div className="w-4 h-4 flex-shrink-0 rounded-full border-2 border-amber-400 flex items-center justify-center">
      <Minus className="w-2 h-2 text-amber-400" strokeWidth={3} />
    </div>
  );
}

// ── Mock Dashboard ─────────────────────────────────────────────────────────

function MockDashboard({ visible }) {
  const C = 2 * Math.PI * 40;
  const score = 87;
  const offset = C * (1 - score / 100);

  return (
    <div className="w-full animate-float" style={{ filter: 'drop-shadow(0 28px 56px rgba(16,185,129,0.18))' }}>
      {/* Browser chrome */}
      <div className="rounded-t-2xl px-4 py-3 flex items-center gap-2.5"
        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderBottom: 'none' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 rounded-md px-3 py-1 text-center text-xs font-mono text-slate-400"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
          app.marketgenie.ai/strategy/bakery
        </div>
      </div>

      {/* Dashboard body */}
      <div className="rounded-b-2xl p-4 space-y-3"
        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTop: 'none' }}>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-800">Your Marketing Strategy</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Custom Cake Studio · Generated 48s ago</p>
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
            <p className="text-[10px] font-semibold text-slate-500">Marketing Score</p>
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
                <span className="text-xl font-black text-slate-900">{visible ? score : 0}</span>
                <span className="text-[9px] text-slate-400 font-semibold">/100</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">Excellent</span>
          </div>

          {/* Target audience */}
          <div className="mock-card p-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-500">Target Audience</p>
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-700">Women, 25–44</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-700">Urban suburbs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-700">$60K–$120K income</span>
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
          <div className="flex items-center gap-1.5 mb-2">
            <Search className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] font-semibold text-slate-500">Top SEO Keywords</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { kw: 'custom wedding cakes', vol: '8.1K' },
              { kw: 'bakery near me',        vol: '22K'  },
              { kw: 'birthday cake delivery', vol: '5.4K' },
              { kw: 'cake shop Chicago',      vol: '3.2K' },
            ].map(k => (
              <div key={k.kw} className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span className="text-[9px] text-slate-600">{k.kw}</span>
                <span className="text-[9px] font-black text-emerald-600">{k.vol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social content ideas */}
        <div className="mock-card p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Smartphone className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] font-semibold text-slate-500">Social Content Ideas</p>
          </div>
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
                <span className="text-[9px] text-slate-600 leading-tight">{item.idea}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function LandingPage({ onGetStarted, onShowSample, onShowWaitlist, error, onClearError, canGenerate = true, autoOpen = false, onAutoOpenHandled }) {
  const [showModal, setShowModal]   = useState(false);
  const [business, setBusiness]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      setShowModal(true);
      onAutoOpenHandled?.();
    }
  }, [autoOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#f8fafc' }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 px-5 py-3.5 flex items-center justify-between"
        style={{ background: 'rgba(248,250,252,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-black text-lg tracking-tight text-slate-900">MarketGenie</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm hidden sm:block">Free · No Credit Card</span>
          <button onClick={openModal} className="emerald-btn px-5 py-2.5 rounded-xl text-sm font-bold">
            <span>Get Started Free</span>
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-24 pb-0 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #ECFDF5 0%, #f8fafc 50%)' }}>

        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,95,70,0.04) 0%, transparent 70%)', transform: 'translate(-30%,30%)' }} />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[calc(100vh-6rem)] pb-16">

            {/* Left — text */}
            <div>
              {/* AI Badge */}
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', ...rs(heroVisible, 0) }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-semibold">
                <Bot className="w-4 h-4 text-emerald-600" />
                AI-Powered · Free · Ready in 60 Seconds
              </div>

              <h1 style={{ color: '#065F46', ...rs(heroVisible, 70) }}
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black leading-[1.06] mb-5 tracking-tight">
                Your Complete<br />
                Marketing Strategy<br />
                <span className="gradient-text">in 60 Seconds Flat.</span>
              </h1>

              <p style={rs(heroVisible, 140)} className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
                Describe your business in one sentence. Our AI builds a full marketing playbook — social content, email templates, ad copy, SEO keywords, and your marketing score. Free. Instant.
              </p>

              <div style={rs(heroVisible, 210)} className="flex flex-col sm:flex-row gap-3 mb-7">
                <button onClick={openModal}
                  className="emerald-btn px-9 py-3.5 rounded-2xl text-base font-black">
                  <span>Get My Free Strategy</span>
                </button>
                <button
                  onClick={() => { onClearError(); onShowSample(); }}
                  className="px-9 py-3.5 rounded-2xl text-base font-bold border transition-all text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
                  style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
                  See a Sample
                </button>
              </div>

              {/* Social proof — honest */}
              <div style={rs(heroVisible, 280)} className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[
                    { initials: 'SC', bg: '#ECFDF5' },
                    { initials: 'JK', bg: '#EFF6FF' },
                    { initials: 'PL', bg: '#FAF5FF' },
                    { initials: 'MR', bg: '#FEF2F2' },
                    { initials: 'TH', bg: '#FFFBEB' },
                  ].map((a, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-black"
                      style={{ background: a.bg, color: '#065F46' }}>
                      {a.initials}
                    </div>
                  ))}
                </div>
                <div>
                  <Stars n={5} />
                  <p className="text-sm text-slate-500 mt-0.5">
                    <span className="font-bold text-slate-700">Powered by Claude AI</span> — Real strategies for real businesses
                  </p>
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
            <div style={rs(heroVisible, 180)} className="relative hidden lg:block">
              <MockDashboard visible={heroVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ──────────────────────────────────────────────────── */}
      <div className="py-4 border-y" style={{ borderColor: '#e2e8f0', background: '#ffffff' }}>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i}
                className="inline-flex items-center gap-2 mx-4 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 whitespace-nowrap"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <item.Icon className="w-4 h-4 text-emerald-600" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div ref={statsRef} className="py-14" style={{ background: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 px-6 text-center">
          {[
            { val: '< 60s', label: 'Generation Time' },
            { val: '95%',   label: 'Satisfaction Rate' },
            { val: '7',     label: 'Strategy Sections' },
            { val: '$0',    label: 'To Get Started' },
          ].map((s, i) => (
            <div key={s.label} style={rs(statsVisible, i * 80)}>
              <div className="text-4xl font-black mb-1 gradient-text">{s.val}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features grid ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" style={rs(featuresVisible)}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>What You Get</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
              Everything You Need to<br />Market Your Business
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              One AI session generates your entire marketing toolkit
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} style={rs(featuresVisible, (i % 3) * 70)}
                className="feature-card p-6 cursor-default group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.bg, border: `1px solid ${f.bd}` }}>
                  <f.Icon className="w-5 h-5" style={{ color: f.iconColor }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-sm">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto">
          <div ref={stepsRef}>
            <div className="text-center mb-12" style={rs(stepsVisible)}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>Process</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
                How MarketGenie Works
              </h2>
              <p className="text-slate-500 text-base">From one sentence to a full strategy in 3 steps</p>
            </div>

            <div className="relative">
              {/* Animated connector */}
              <div style={{
                position: 'absolute', left: '31px', top: '40px',
                width: '2px', height: 'calc(100% - 80px)',
                background: 'linear-gradient(180deg,#10B981,#A7F3D0)',
                transform: stepsVisible ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: 'top',
                transition: 'transform 1s cubic-bezier(0.22,1,0.36,1) 0.3s',
              }} />

              <div className="space-y-4">
                {STEPS.map((s, i) => (
                  <div key={i} style={rs(stepsVisible, i * 140)} className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-base text-white z-10 relative"
                      style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 6px 20px rgba(5,150,105,0.28)' }}>
                      {s.n}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-5"
                      style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <h3 className="font-bold text-lg mb-1.5" style={{ color: '#065F46' }}>{s.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section ref={pricingRef} className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" style={rs(pricingVisible)}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-500 text-base">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free */}
            <div style={rs(pricingVisible, 0)} className="pricing-card p-7">
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Free</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-slate-900">$0</span>
                  <span className="text-slate-400 mb-2 text-sm">/month</span>
                </div>
                <p className="text-slate-500 text-sm mt-1.5">Perfect for getting started</p>
              </div>
              <ul className="space-y-2.5 mb-7">
                {PRICING_FREE.map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm"
                    style={{ color: item.access === 'locked' ? '#cbd5e1' : item.access === 'partial' ? '#64748b' : '#475569' }}>
                    {item.access === 'locked'  && <LockIcon />}
                    {item.access === 'partial' && <PartialIcon />}
                    {item.access === 'full'    && <CheckIcon />}
                    <span>{item.text}</span>
                    {item.access === 'locked' && (
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{ background: '#f1f5f9', color: '#94a3b8' }}>Pro</span>
                    )}
                  </li>
                ))}
              </ul>
              <button onClick={openModal}
                className="w-full py-3.5 rounded-xl font-bold text-sm border-2 transition-all hover:bg-emerald-50"
                style={{ borderColor: '#059669', color: '#059669' }}>
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div style={rs(pricingVisible, 100)} className="pricing-card featured p-7 relative overflow-hidden">
              <div className="absolute top-5 right-5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#d1fae5', border: '1px solid rgba(255,255,255,0.2)' }}>
                Most Popular
              </div>
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#6ee7b7' }}>Pro</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="mb-2 text-sm" style={{ color: '#6ee7b7' }}>/month</span>
                </div>
                <p className="text-sm mt-1.5" style={{ color: '#a7f3d0' }}>For serious business owners</p>
              </div>
              <ul className="space-y-2.5 mb-7">
                {PRICING_PRO.map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm"
                    style={{ color: item.highlight ? '#ffffff' : '#d1fae5', fontWeight: item.highlight ? 800 : 400 }}>
                    <CheckIcon dark />
                    {item.text}
                  </li>
                ))}
              </ul>
              <button onClick={onShowWaitlist}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-emerald-700 transition-all hover:scale-[1.02]"
                style={{ background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section ref={testimonialsRef} className="py-20 px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" style={rs(testimonialsVisible)}>
            <p className="text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: '#065F46' }}>
              Real Results from Real<br />Business Owners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-6 flex flex-col gap-3.5"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', ...rs(testimonialsVisible, i * 100) }}>
                <Stars n={t.stars} />
                <p className="text-slate-600 leading-relaxed flex-1 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: t.color, border: '1.5px solid #A7F3D0', color: '#065F46' }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section ref={ctaRef} className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #065F46 0%, #047857 55%, #059669 100%)' }}>
        <div style={rs(ctaVisible)} className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-7"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Grow<br />Your Business?
          </h2>
          <p className="text-base mb-8 max-w-md mx-auto leading-relaxed" style={{ color: '#a7f3d0' }}>
            Stop guessing and start growing — AI-powered marketing strategies built for your exact business. No agency, no consultant.
          </p>
          <button onClick={openModal}
            className="px-12 py-4 rounded-2xl text-lg font-black text-emerald-700 transition-all hover:scale-[1.02]"
            style={{ background: '#ffffff', boxShadow: '0 8px 28px rgba(0,0,0,0.14)' }}>
            Get My Free Strategy
          </button>
          <p className="mt-5 text-sm" style={{ color: '#6ee7b7' }}>No credit card · No sign-up · Instant results</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-10 grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-base text-slate-900">MarketGenie</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[210px]">
              AI-powered marketing for every business.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#059669' }}>Product</p>
            <ul className="space-y-2.5">
              {['How it Works', 'Pricing'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
              <li>
                <button onClick={() => { onClearError(); onShowSample(); }}
                  className="text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium text-left">
                  See a Sample
                </button>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#059669' }}>Company</p>
            <ul className="space-y-2.5">
              {['About', 'Contact', 'FAQ', 'Privacy Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e2e8f0' }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-slate-400 text-xs">© 2026 MarketGenie. All rights reserved.</p>
            <p className="text-slate-400 text-xs">Built by Moufdi · Powered by Claude AI</p>
          </div>
        </div>
      </footer>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative w-full max-w-xl animate-slide-up rounded-3xl p-8 bg-white"
            style={{ border: '1px solid #e2e8f0', boxShadow: '0 28px 72px rgba(0,0,0,0.16)' }}>

            <button onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {canGenerate ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 6px 20px rgba(5,150,105,0.32)' }}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Tell us about your business</h2>
                  <p className="text-slate-400 mt-1 text-sm">One sentence is all we need to build your strategy</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <textarea
                    value={business}
                    onChange={e => setBusiness(e.target.value)}
                    placeholder="e.g., I run a small bakery that specializes in custom wedding cakes in Chicago…"
                    className="w-full rounded-2xl px-5 py-4 text-slate-900 text-sm placeholder-slate-300 resize-none focus:outline-none transition-all"
                    style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
                    rows={4}
                    maxLength={300}
                    autoFocus
                    onFocus={e => (e.target.style.borderColor = '#059669')}
                    onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
                  />

                  <div className="flex items-center justify-between mt-2 mb-2">
                    <p className="text-slate-400 text-xs">Try an example:</p>
                    <span className="text-slate-400 text-xs">{business.length}/300</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
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
                    className="emerald-btn w-full py-3.5 rounded-2xl text-base font-black disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                    <span>{submitting ? 'Analyzing your business…' : 'Generate My Strategy'}</span>
                  </button>
                </form>
              </>
            ) : (
              /* Weekly limit reached */
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <CalendarDays className="w-7 h-7 text-amber-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2">You're on a roll!</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-1">
                  You've used your free strategy for this week.
                </p>
                <p className="text-slate-400 text-xs mb-6">
                  Free plan · 1 strategy per week · Resets every Monday
                </p>
                <button
                  onClick={() => { closeModal(); onShowWaitlist(); }}
                  className="block w-full py-3.5 rounded-2xl font-black text-sm text-white text-center transition-all hover:scale-[1.02] mb-4"
                  style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 16px rgba(5,150,105,0.28)' }}>
                  Join Pro Waitlist — Unlimited Strategies
                </button>
                <div className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p className="font-semibold text-slate-700 mb-1 text-xs">What's included in Pro:</p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Unlimited strategies · All 7 sections · Ad Copy · SEO Keywords · Marketing Score · Zero ads · PDF export
                  </p>
                </div>
                <p className="text-slate-400 text-xs mt-4">
                  Or come back Monday for your next free strategy
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
