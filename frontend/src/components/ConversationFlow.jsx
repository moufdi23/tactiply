import { useState, useEffect, useRef } from 'react';

export default function ConversationFlow({ businessDescription, questions, onComplete, onBack, error }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const currentQ = questions[currentIdx];
  const progress = (currentIdx / questions.length) * 100;

  // Typewriter effect
  useEffect(() => {
    if (!currentQ) return;
    setIsTyping(true);
    setDisplayedQuestion('');
    setCurrentAnswer('');

    const text = currentQ.question;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayedQuestion(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [currentIdx, currentQ]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [answers, displayedQuestion]);

  const submit = () => {
    if (!currentAnswer.trim() || isTyping) return;

    const newAnswer = { question: currentQ.question, answer: currentAnswer.trim() };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentIdx + 1 >= questions.length) {
      onComplete(newAnswers);
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #080812, #0d0d1f)' }}>

      {/* ── Header ── */}
      <header className="flex-shrink-0 px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,18,0.9)', backdropFilter: 'blur(16px)' }}>
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">Question {currentIdx + 1} of {questions.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md glow-btn flex items-center justify-center font-bold text-xs">M</div>
          <span className="font-semibold text-sm hidden sm:block">MarketGenie</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="flex-shrink-0 h-0.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #3b82f6)' }}
        />
      </div>

      {/* ── Chat scroll area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Answered question+answer pairs */}
          {answers.map((ans, i) => (
            <div key={i} className="animate-fade-in space-y-3">
              {/* AI bubble */}
              <div className="flex items-start gap-3">
                <Avatar />
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-gray-300 text-sm max-w-sm leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {questions[i]?.question}
                </div>
              </div>
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm px-4 py-3 text-white text-sm max-w-sm leading-relaxed"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  {ans.answer}
                </div>
              </div>
            </div>
          ))}

          {/* Current AI question */}
          {currentQ && (
            <div className="animate-slide-up">
              <div className="flex items-start gap-3 mb-5">
                <Avatar />
                <div className="rounded-2xl rounded-tl-sm px-5 py-4 max-w-lg"
                  style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <p className="text-white text-base leading-relaxed">
                    {displayedQuestion}
                    {isTyping && <span className="animate-blink text-purple-400 ml-0.5">|</span>}
                  </p>
                </div>
              </div>

              {/* Answer input */}
              <div className="relative ml-0 sm:ml-12">
                <textarea
                  ref={inputRef}
                  value={currentAnswer}
                  onChange={e => setCurrentAnswer(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={currentQ.placeholder || 'Type your answer…'}
                  disabled={isTyping}
                  rows={3}
                  className="w-full rounded-2xl px-5 py-4 pr-16 text-white placeholder-gray-600 resize-none focus:outline-none transition-colors disabled:opacity-40 text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.45)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  onClick={submit}
                  disabled={!currentAnswer.trim() || isTyping}
                  className="absolute right-3 bottom-3 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg disabled:opacity-25 transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}>
                  ↑
                </button>
              </div>
              <p className="text-center text-gray-700 text-xs mt-2">Press Enter to continue</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl px-4 py-3 text-red-400 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Footer context ── */}
      <div className="flex-shrink-0 px-6 py-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-gray-700 text-xs truncate">
          Analyzing: <span className="text-gray-500">"{businessDescription.slice(0, 90)}{businessDescription.length > 90 ? '…' : ''}"</span>
        </p>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
      style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', boxShadow: '0 0 12px rgba(124,58,237,0.3)' }}>
      M
    </div>
  );
}
