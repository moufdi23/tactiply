import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUp, Sparkles, CheckCircle2, Bot, Pencil } from 'lucide-react';

export default function ConversationFlow({ businessDescription, questions, onComplete, onBack, error }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [cardVisible, setCardVisible] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const prefillRef = useRef(null);
  const skipTypingRef = useRef(false);

  // In edit mode show the question being edited; otherwise the next unanswered one
  const activeIdx = editingIdx ?? currentIdx;
  const currentQ = questions[activeIdx];
  const progressPct = (currentIdx / questions.length) * 100;

  // Typewriter effect + card fade-in
  useEffect(() => {
    if (!currentQ) return;

    // Consume edit signals before any state sets
    const prefill = prefillRef.current;
    const skipTyping = skipTypingRef.current;
    prefillRef.current = null;
    skipTypingRef.current = false;

    setCurrentAnswer(prefill ?? '');
    setCardVisible(false);

    if (skipTyping) {
      // For edits: skip the typewriter, show question instantly, keep input focused
      setIsTyping(false);
      setDisplayedQuestion(currentQ.question);
      const t = setTimeout(() => {
        setCardVisible(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }, 60);
      return () => clearTimeout(t);
    }

    setIsTyping(true);
    setDisplayedQuestion('');

    const enterDelay = setTimeout(() => setCardVisible(true), 60);

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

    return () => {
      clearTimeout(enterDelay);
      clearInterval(timer);
    };
  }, [activeIdx, currentQ]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [answers, displayedQuestion]);

  const submit = () => {
    if (!currentAnswer.trim() || isTyping) return;

    if (editingIdx !== null) {
      // Update only the edited answer in place; everything else stays untouched
      skipTypingRef.current = true; // re-showing currentIdx question doesn't need typewriter
      setAnswers(prev => prev.map((a, i) =>
        i === editingIdx ? { ...a, answer: currentAnswer.trim() } : a
      ));
      setEditingIdx(null);
      return;
    }

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

  const handleEditAnswer = (i) => {
    prefillRef.current = answers[i].answer;
    skipTypingRef.current = true;
    setEditingIdx(i);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {/* Progress pill */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-700 text-xs font-semibold tracking-wide">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm hidden sm:block">Tactiply</span>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <div className="flex-shrink-0 h-1 bg-slate-100">
        <div
          className="h-full transition-all duration-700 ease-out rounded-r-full"
          style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #059669, #10B981)' }}
        />
      </div>

      {/* ── Scroll area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Past Q&A pairs */}
          {answers.map((ans, i) => (
            <div key={i} className="animate-fade-in space-y-3">
              {/* AI question (past) */}
              <div className="flex items-start gap-3">
                <AvatarBot />
                <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-white border border-slate-200 text-slate-600 text-sm max-w-sm leading-relaxed shadow-sm">
                  {questions[i]?.question}
                </div>
              </div>
              {/* User answer chip + edit button */}
              <div className="flex justify-end items-center gap-2">
                {i === editingIdx ? (
                  <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                    <Pencil size={11} />
                    Editing…
                  </span>
                ) : (
                  <button
                    onClick={() => handleEditAnswer(i)}
                    disabled={editingIdx !== null}
                    className="flex items-center gap-1 text-slate-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0 group"
                    title="Edit this answer"
                  >
                    <Pencil size={12} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs hidden sm:inline">Edit</span>
                  </button>
                )}
                <div className={`flex items-center gap-2 rounded-2xl rounded-tr-none px-4 py-2.5 max-w-xs transition-colors ${
                  i === editingIdx
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-emerald-50 border border-emerald-200'
                }`}>
                  {i === editingIdx
                    ? <Pencil size={14} className="text-amber-400 flex-shrink-0" />
                    : <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  }
                  <span className={`text-sm font-medium leading-snug ${
                    i === editingIdx ? 'text-amber-700' : 'text-emerald-800'
                  }`}>{ans.answer}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Current AI question card */}
          {currentQ && (
            <div
              className="space-y-4"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.42s cubic-bezier(0.22,1,0.36,1), transform 0.42s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {/* Edit mode context label */}
              {editingIdx !== null && (
                <div className="ml-0 sm:ml-12 flex items-center gap-1.5 text-amber-500 text-xs font-medium">
                  <Pencil size={11} />
                  Editing your answer to question {editingIdx + 1} — other answers are untouched
                </div>
              )}

              {/* Question card */}
              <div className="flex items-start gap-3">
                <AvatarBot pulse />
                <div className="flex-1 bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-sm overflow-hidden">
                  {/* Emerald left accent */}
                  <div className="flex">
                    <div className="w-1 flex-shrink-0 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-sm" />
                    <div className="px-4 py-4 flex-1">
                      <p className="text-slate-800 text-base leading-relaxed font-medium">
                        {displayedQuestion}
                        {isTyping && (
                          <span className="animate-blink text-emerald-500 ml-0.5 font-bold">|</span>
                        )}
                      </p>
                      {!isTyping && (
                        <p className="mt-2 text-slate-400 text-xs font-normal">
                          {currentQ.hint || 'The more detail you share, the better your strategy.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="ml-0 sm:ml-12">
                <div
                  className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
                  style={{ '--tw-ring-color': '#10B981' }}
                >
                  <textarea
                    ref={inputRef}
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={currentQ.placeholder || 'Type your answer here…'}
                    disabled={isTyping}
                    rows={3}
                    className="w-full px-4 pt-4 pb-12 text-slate-800 placeholder-slate-400 resize-none focus:outline-none text-sm bg-transparent leading-relaxed disabled:opacity-40"
                    onFocus={e => {
                      e.target.closest('.relative').style.borderColor = '#10B981';
                      e.target.closest('.relative').style.boxShadow = '0 0 0 3px rgba(16,185,129,0.12)';
                    }}
                    onBlur={e => {
                      e.target.closest('.relative').style.borderColor = '';
                      e.target.closest('.relative').style.boxShadow = '';
                    }}
                  />
                  <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
                    <span className="text-slate-400 text-xs">
                      Press <kbd className="bg-slate-100 text-slate-500 rounded px-1 py-0.5 font-mono text-[10px]">Enter ↵</kbd> to continue
                    </span>
                    <button
                      onClick={submit}
                      disabled={!currentAnswer.trim() || isTyping}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 2px 8px rgba(5,150,105,0.35)' }}
                    >
                      <ArrowUp size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl px-4 py-3 text-red-600 text-sm bg-red-50 border border-red-200 animate-fade-in">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Footer context ── */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-4 sm:px-6 py-3">
        <p className="text-center text-slate-400 text-xs truncate">
          Analyzing: <span className="text-slate-500 font-medium">"{businessDescription.slice(0, 90)}{businessDescription.length > 90 ? '…' : ''}"</span>
        </p>
      </div>
    </div>
  );
}

function AvatarBot({ pulse = false }) {
  return (
    <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm relative"
      style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
      <Bot size={16} className="text-white" />
      {pulse && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
      )}
    </div>
  );
}
