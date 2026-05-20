import { useEffect, useState } from 'react';

const STEPS = [
  'Analyzing your business type…',
  'Identifying your ideal customer…',
  'Crafting social media strategy…',
  'Building your content calendar…',
  'Writing email templates…',
  'Creating Google & Facebook ad copy…',
  'Researching SEO keywords…',
  'Calculating your marketing score…',
  'Finalizing your strategy…',
];

export default function LoadingScreen({ message }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx(i => (i + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 3, 92));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo with orbiting rings */}
      <div className="relative mb-12">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center font-black text-4xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', boxShadow: '0 0 60px rgba(124,58,237,0.5)' }}>
          M
        </div>

        {/* Orbit 1 */}
        <div className="absolute inset-[-20px] rounded-full animate-spin-slow"
          style={{ border: '1px solid rgba(124,58,237,0.3)' }}>
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-400" />
        </div>

        {/* Orbit 2 */}
        <div className="absolute inset-[-36px] rounded-full animate-spin-rev"
          style={{ border: '1px dashed rgba(59,130,246,0.2)' }}>
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">
        {message || 'Generating Your Strategy'}
      </h2>

      <div className="h-6 flex items-center mb-10">
        <p className="text-gray-400 text-sm text-center transition-all duration-500">
          {STEPS[stepIdx]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-72 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full shimmer-bar"
          style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
        />
      </div>
      <p className="mt-4 text-gray-600 text-xs">This usually takes 15–30 seconds</p>
    </div>
  );
}
