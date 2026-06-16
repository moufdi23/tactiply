import { useState, useEffect, useRef } from 'react';
import {
  Target, Smartphone, CalendarDays, Mail, MousePointerClick,
  Search, BarChart3, MessageSquare, Zap, Rocket, Swords,
  UtensilsCrossed, Smile, Dumbbell, Coffee, Scale, Home,
  Scissors, Camera, Heart, Leaf, Activity, ChefHat,
  User, MapPin, DollarSign, Lock, ArrowRight, Bot,
  CheckCircle2, Minus, Check, Star,
  Globe, Send, Rss, Share2,
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
  { Icon: MousePointerClick, iconColor: '#059669', bg: '#ECFDF5', bd: '#A7F3D0', title: 'Google & Facebook Ad Copy',  desc: 'Ready-to-use ad headlines and descriptions you can launch today on any budget.' },
  { Icon: Search,            iconColor: '#d97706', bg: '#FFFBEB', bd: '#FDE68A', title: 'SEO Keywords',               desc: 'Primary, secondary, and long-tail keywords to help customers find you on Google.' },
  { Icon: MessageSquare,     iconColor: '#7c3aed', bg: '#F5F3FF', bd: '#DDD6FE', title: 'Smart AI Conversation',      desc: 'Our AI asks 5 targeted questions specific to your business type — not a generic form.' },
  { Icon: Zap,               iconColor: '#d97706', bg: '#FFFBEB', bd: '#FDE68A', title: 'Done in 60 Seconds',         desc: 'No agency, no consultant, no waiting. Your complete strategy is ready instantly.' },
  { Icon: BarChart3,         iconColor: '#059669', bg: '#F0FDF4', bd: '#BBF7D0', title: 'Marketing Score /100',       desc: 'Understand your marketing strengths and get specific quick wins to improve your score.' },
  { Icon: Swords,            iconColor: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE', title: 'Competitor Analysis',        desc: 'See who you\'re up against, what they do well, and exactly where you can outmaneuver them.' },
];

const STEPS = [
  { n: '01', title: 'Describe Your Business',     desc: 'Type one sentence about what you do. No sign-up, no credit card, no catch.' },
  { n: '02', title: 'Answer 5 Smart Questions',   desc: 'Our AI asks 5 questions tailored to your exact business type — goals, budget, and customers.' },
  { n: '03', title: 'Receive Your Full Strategy', desc: 'Get a complete marketing playbook: social content, ad copy, email templates, SEO, and your marketing score.' },
];

const OUTCOMES = [
  {
    business: 'Sunrise Bakery',
    type: 'Custom Cake Studio · Chicago',
    Icon: Coffee,
    bg: '#ECFDF5', bd: '#A7F3D0', iconColor: '#059669',
    score: 84,
    keywords: ['custom wedding cakes', 'cake shop near me', 'birthday cake delivery'],
    highlights: [
      { label: 'IG',    lbg: '#fce7f3', lc: '#be185d', text: '"Behind the cake" timelapse reel' },
      { label: 'Email', lbg: '#dbeafe', lc: '#1d4ed8', text: 'First-time customer welcome sequence' },
      { label: 'Ads',   lbg: '#ECFDF5', lc: '#065F46', text: 'Google: "custom wedding cakes Chicago"' },
    ],
    audience: 'Women 25–44 planning celebrations',
  },
  {
    business: 'Peak Form Gym',
    type: 'Boutique Fitness Studio · Austin',
    Icon: Dumbbell,
    bg: '#EFF6FF', bd: '#BFDBFE', iconColor: '#3b82f6',
    score: 79,
    keywords: ['boutique gym near me', 'personal training Austin', 'fitness classes downtown'],
    highlights: [
      { label: 'IG',  lbg: '#fce7f3', lc: '#be185d', text: 'Transformation Tuesday member spotlight' },
      { label: 'FB',  lbg: '#dbeafe', lc: '#1d4ed8', text: 'Free trial class offer carousel' },
      { label: 'SEO', lbg: '#ECFDF5', lc: '#065F46', text: '"gym near me" + neighborhood terms' },
    ],
    audience: 'Health-focused adults 25–40, urban',
  },
  {
    business: 'Bright Smile Dental',
    type: 'Family Dental Practice · Seattle',
    Icon: Smile,
    bg: '#FAF5FF', bd: '#E9D5FF', iconColor: '#8b5cf6',
    score: 88,
    keywords: ['dentist near me', 'family dentist Seattle', 'teeth whitening cost'],
    highlights: [
      { label: 'Email', lbg: '#dbeafe', lc: '#1d4ed8', text: 'Appointment reminder + review request' },
      { label: 'Ads',   lbg: '#ECFDF5', lc: '#065F46', text: '"New patient special" search ad' },
      { label: 'SEO',   lbg: '#F5F3FF', lc: '#7c3aed', text: 'Local map pack optimization tips' },
    ],
    audience: 'Families & new residents within 10 miles',
  },
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
          app.tactiply.com/strategy/bakery
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
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <nav className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: 'rgba(248,250,252,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #d1fae5' : '1px solid rgba(226,232,240,0.7)',
          boxShadow: scrolled ? '0 4px 24px rgba(5,150,105,0.07), 0 1px 6px rgba(0,0,0,0.05)' : 'none',
        }}>
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.38)' }}>
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-emerald-700">
              Tactiply
            </span>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Free · No Credit Card
            </div>
            <button onClick={openModal} className="emerald-btn px-5 py-2.5 rounded-xl text-sm font-bold">
              <span className="flex items-center gap-1.5">
                Get Started Free
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-16">

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
                  className="emerald-btn w-full sm:w-auto px-9 py-3.5 rounded-2xl text-base font-black">
                  <span>Get My Free Strategy</span>
                </button>
                <button
                  onClick={() => { onClearError(); onShowSample(); }}
                  className="w-full sm:w-auto px-9 py-3.5 rounded-2xl text-base font-bold border transition-all text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
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
                  <p className="text-base sm:text-sm text-slate-500 mt-0.5">
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
            <div style={rs(heroVisible, 180)} className="relative mt-10 lg:mt-0">
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
      <div ref={statsRef} className="py-12 sm:py-14" style={{ background: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 px-6 text-center">
          {[
            { val: '< 60s', label: 'Generation Time' },
            { val: '95%',   label: 'Satisfaction Rate' },
            { val: '7',     label: 'Strategy Sections' },
            { val: '$0',    label: 'To Get Started' },
          ].map((s, i) => (
            <div key={s.label} style={rs(statsVisible, i * 80)}>
              <div className="text-4xl font-black mb-1 gradient-text">{s.val}</div>
              <div className="text-slate-500 text-base sm:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features grid ───────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-14 sm:py-20 px-5 sm:px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" style={rs(featuresVisible)}>
            <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>What You Get</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
              Everything You Need to<br />Market Your Business
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              One AI session generates your entire marketing toolkit
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} style={rs(featuresVisible, (i % 4) * 70)}
                className={`feature-card p-6 cursor-default group${i === 8 ? ' lg:col-start-2' : ''}`}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.bg, border: `1px solid ${f.bd}` }}>
                  <f.Icon className="w-5 h-5" style={{ color: f.iconColor }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base sm:text-sm">{f.title}</h3>
                <p className="text-slate-500 text-base sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-5 sm:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-2xl mx-auto">
          <div ref={stepsRef}>
            <div className="text-center mb-12" style={rs(stepsVisible)}>
              <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>Process</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
                How Tactiply Works
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
                    <div className="flex-1 bg-white rounded-2xl p-6 sm:p-5"
                      style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <h3 className="font-bold text-lg mb-1.5" style={{ color: '#065F46' }}>{s.title}</h3>
                      <p className="text-slate-500 text-base sm:text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section ref={pricingRef} className="py-14 sm:py-20 px-5 sm:px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" style={rs(pricingVisible)}>
            <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-500 text-base">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free */}
            <div style={rs(pricingVisible, 0)} className="pricing-card p-6 sm:p-7">
              <div className="mb-6">
                <p className="text-sm sm:text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Free</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-slate-900">$0</span>
                  <span className="text-slate-400 mb-2 text-base sm:text-sm">/month</span>
                </div>
                <p className="text-slate-500 text-base sm:text-sm mt-1.5">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-5 sm:mb-7">
                {PRICING_FREE.map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-base sm:text-sm"
                    style={{ color: item.access === 'locked' ? '#cbd5e1' : item.access === 'partial' ? '#64748b' : '#475569' }}>
                    {item.access === 'locked'  && <LockIcon />}
                    {item.access === 'partial' && <PartialIcon />}
                    {item.access === 'full'    && <CheckIcon />}
                    <span>{item.text}</span>
                    {item.access === 'locked' && (
                      <span className="ml-auto text-xs sm:text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{ background: '#f1f5f9', color: '#94a3b8' }}>Pro</span>
                    )}
                  </li>
                ))}
              </ul>
              <button onClick={openModal}
                className="w-full py-3.5 rounded-xl font-bold text-base sm:text-sm border-2 transition-all hover:bg-emerald-50"
                style={{ borderColor: '#059669', color: '#059669' }}>
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div style={rs(pricingVisible, 100)} className="pricing-card featured p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#d1fae5', border: '1px solid rgba(255,255,255,0.2)' }}>
                Most Popular
              </div>
              <div className="mb-6 pt-8 sm:pt-0">
                <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#6ee7b7' }}>Pro</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="mb-2 text-base sm:text-sm" style={{ color: '#6ee7b7' }}>/month</span>
                </div>
                <p className="text-base sm:text-sm mt-1.5" style={{ color: '#a7f3d0' }}>For serious business owners</p>
              </div>
              <ul className="space-y-3 mb-5 sm:mb-7">
                {PRICING_PRO.map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-base sm:text-sm"
                    style={{ color: item.highlight ? '#ffffff' : '#d1fae5', fontWeight: item.highlight ? 800 : 400 }}>
                    <CheckIcon dark />
                    {item.text}
                  </li>
                ))}
              </ul>
              <button onClick={onShowWaitlist}
                className="w-full py-3.5 rounded-xl font-bold text-base sm:text-sm text-emerald-700 transition-all hover:scale-[1.02]"
                style={{ background: '#ffffff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Gets Generated ─────────────────────────────────────── */}
      <section ref={testimonialsRef} className="py-14 sm:py-20 px-5 sm:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" style={rs(testimonialsVisible)}>
            <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-2.5" style={{ color: '#059669' }}>Examples</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: '#065F46' }}>
              What Gets Generated<br />For You
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              A snapshot of what the AI builds — tailored to the specific business, not a template.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OUTCOMES.map((c, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-6 sm:p-5 flex flex-col gap-4"
                style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', ...rs(testimonialsVisible, i * 100) }}>

                {/* Card header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c.bg, border: `1px solid ${c.bd}` }}>
                    <c.Icon className="w-5 h-5" style={{ color: c.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-base sm:text-sm">{c.business}</p>
                    <p className="text-slate-400 text-sm sm:text-xs truncate">{c.type}</p>
                  </div>
                  <div className="flex-shrink-0 px-2 py-0.5 rounded-full text-sm sm:text-xs font-black"
                    style={{ background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                    {c.score}/100
                  </div>
                </div>

                {/* SEO keywords */}
                <div>
                  <p className="text-sm sm:text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94a3b8' }}>SEO Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.keywords.map(kw => (
                      <span key={kw} className="text-sm sm:text-xs px-2.5 sm:px-2 py-0.5 rounded-full"
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strategy highlights */}
                <div>
                  <p className="text-sm sm:text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#94a3b8' }}>Strategy Highlights</p>
                  <div className="space-y-1.5">
                    {c.highlights.map(h => (
                      <div key={h.text} className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0"
                          style={{ background: h.lbg, color: h.lc }}>
                          {h.label}
                        </span>
                        <span className="text-sm sm:text-xs text-slate-600 leading-tight">{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audience */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                  <span className="text-sm sm:text-xs font-semibold" style={{ color: '#94a3b8' }}>Target:</span>
                  <span className="text-sm sm:text-xs text-slate-500">{c.audience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section ref={ctaRef} className="py-14 sm:py-20 px-5 sm:px-6"
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
            Stop guessing and start marketing with a plan — AI-powered strategies built for your exact business. No agency, no consultant.
          </p>
          <button onClick={openModal}
            className="w-full sm:w-auto px-12 py-4 rounded-2xl text-lg font-black text-emerald-700 transition-all hover:scale-[1.02]"
            style={{ background: '#ffffff', boxShadow: '0 8px 28px rgba(0,0,0,0.14)' }}>
            Get My Free Strategy
          </button>
          <p className="mt-5 text-base sm:text-sm" style={{ color: '#6ee7b7' }}>No credit card · No sign-up · Instant results</p>
        </div>
      </section>

      {/* ── CTA → Footer gradient bridge ────────────────────────────── */}
      <div aria-hidden="true"
        style={{ height: 100, background: 'linear-gradient(to bottom, #047857 0%, #0f172a 100%)' }} />

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ background: '#0f172a' }}>
        {/* Emerald accent line */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)' }} />

        <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
          {/* Brand + socials */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 pb-10 mb-10"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#059669,#047857)', boxShadow: '0 4px 14px rgba(5,150,105,0.4)' }}>
                  <Zap className="w-4 h-4" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">Tactiply</span>
              </div>
              <p className="text-base sm:text-sm leading-relaxed" style={{ color: '#64748b', maxWidth: 260 }}>
                AI-powered marketing strategies for small businesses. Free. Instant. No fluff.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {[
                { Icon: Globe,   label: 'Website'  },
                { Icon: Send,    label: 'Telegram' },
                { Icon: Share2,  label: 'Social'   },
                { Icon: Rss,     label: 'Blog'     },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="footer-social">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 mb-12">
            <div>
              <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#34d399' }}>Product</p>
              <ul className="space-y-3.5">
                {['How it Works', 'Pricing'].map(link => (
                  <li key={link}>
                    <a href="#" className="footer-link group flex items-center gap-1.5 text-base sm:text-sm font-medium">
                      <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                      {link}
                    </a>
                  </li>
                ))}
                <li>
                  <button onClick={() => { onClearError(); onShowSample(); }}
                    className="footer-link group flex items-center gap-1.5 text-base sm:text-sm font-medium text-left">
                    <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                    See a Sample
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm sm:text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#34d399' }}>Company</p>
              <ul className="space-y-3.5">
                {['About', 'Contact', 'FAQ', 'Privacy Policy'].map(link => (
                  <li key={link}>
                    <a href="#" className="footer-link group flex items-center gap-1.5 text-base sm:text-sm font-medium">
                      <ArrowRight className="w-3 h-3 text-emerald-400 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Built With */}
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#475569' }}>Built With</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express', 'Supabase', 'Claude AI'].map(tech => (
                <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs" style={{ color: '#475569' }}>© 2026 Tactiply. All rights reserved.</p>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              <a
                href="https://buymeacoffee.com/tactiply"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-xs font-semibold"
                style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#34d399'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
              >
                Support this project ☕
              </a>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.28)', color: '#34d399' }}>
                <Zap className="w-3 h-3" />
                Built by Moufdi · Powered by Claude AI
              </div>
            </div>
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
                    Unlimited strategies · All 7 sections · Ad Copy · SEO Keywords · Competitor Analysis · Marketing Score · Zero ads · PDF export
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
