import { useState, useTransition } from 'react';
import LandingPage    from './components/LandingPage';
import ConversationFlow from './components/ConversationFlow';
import StrategyResults from './components/StrategyResults';
import LoadingScreen   from './components/LoadingScreen';
import WaitlistModal   from './components/WaitlistModal';
import FounderMode    from './components/FounderMode';
import { getPlan }     from './plan';
import {
  SAMPLE_BUSINESS,
  SAMPLE_ANSWERS,
  SAMPLE_STRATEGY,
} from './data/sampleStrategy';

export default function App() {
  const [phase,               setPhase]               = useState('landing');
  const [businessDescription, setBusinessDescription] = useState('');
  const [questions,           setQuestions]           = useState([]);
  const [answers,             setAnswers]             = useState([]);   // kept for Competitor & Regenerate
  const [strategy,            setStrategy]            = useState(null);
  const [isStreaming,         setIsStreaming]         = useState(false);
  const [isSample,            setIsSample]            = useState(false);
  const [showWaitlist,        setShowWaitlist]        = useState(false);
  const [openStrategyModal,   setOpenStrategyModal]   = useState(false);
  const [loadingMessage,      setLoadingMessage]      = useState('');
  const [error,               setError]               = useState('');

  // Mark incremental strategy updates as non-urgent so React can batch/skip
  // intermediate renders while chunks arrive rapidly.
  const [, startTransition] = useTransition();

  // Re-derived on every render — cheap sync read from localStorage
  const { canGenerate, recordUsage } = getPlan();

  // ── Get Started (normal flow) ────────────────────────────────────────────
  const handleGetStarted = async (description) => {
    setError('');
    setBusinessDescription(description);
    setPhase('loading');
    setLoadingMessage('Analyzing your business...');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDescription: description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
      setQuestions(data.questions);
      setPhase('conversation');
    } catch (err) {
      setError(err.message);
      setPhase('landing');
    }
  };

  // ── "Generate yours free" — from sample view → landing + open modal ──────
  const handleStartFree = () => {
    setPhase('landing');
    setBusinessDescription('');
    setQuestions([]);
    setAnswers([]);
    setStrategy(null);
    setIsStreaming(false);
    setIsSample(false);
    setError('');
    setOpenStrategyModal(true); // LandingPage will auto-open the modal on mount
  };

  // ── See a Sample ─────────────────────────────────────────────────────────
  const handleShowSample = () => {
    setBusinessDescription(SAMPLE_BUSINESS);
    setAnswers(SAMPLE_ANSWERS);
    setStrategy(SAMPLE_STRATEGY);
    setIsSample(true);
    setIsStreaming(false);
    setPhase('results');
  };

  // ── Answers complete → stream strategy ───────────────────────────────────
  const handleAnswersComplete = async (completedAnswers) => {
    setAnswers(completedAnswers); // store for downstream use
    setPhase('loading');
    setLoadingMessage('Building your complete marketing strategy...');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDescription, answers: completedAnswers }),
      });

      // Validation errors are returned as JSON before SSE mode starts.
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate strategy');
      }

      // ── SSE stream reader ────────────────────────────────────────────────
      const reader      = res.body.getReader();
      const decoder     = new TextDecoder();
      let sseBuffer     = '';          // incomplete SSE event accumulator
      let accumulated   = '';          // full strategy text built so far
      let inResultsPhase = false;      // true once we've switched to results view
      let usageRecorded  = false;

      // Process one parsed SSE event object.
      const handleEvent = (evt) => {
        if (evt.type === 'error') {
          throw new Error(evt.message || 'Failed to generate strategy. Please try again.');
        }

        if (evt.type === 'chunk') {
          accumulated += evt.text;

          // Switch from the loading screen to the results page as soon as the
          // first section header has arrived — users see content immediately.
          if (!inResultsPhase && accumulated.includes('## ')) {
            inResultsPhase = true;
            setIsStreaming(true);
            setStrategy(accumulated);
            setPhase('results');
          } else if (inResultsPhase) {
            // Non-urgent update — lets React skip intermediate renders when
            // chunks arrive faster than the frame rate.
            startTransition(() => setStrategy(accumulated));
          }
        }

        if (evt.type === 'done') {
          if (!usageRecorded) {
            recordUsage(); // record AFTER success — never charge a failed attempt
            usageRecorded = true;
          }
          setStrategy(evt.strategy);  // final assembled string (authoritative)
          setIsStreaming(false);
          if (!inResultsPhase) setPhase('results');
        }
      };

      // Read chunks until the stream closes.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });

        // SSE events are separated by blank lines (\n\n).
        const eventBlocks = sseBuffer.split('\n\n');
        sseBuffer = eventBlocks.pop() ?? ''; // keep any incomplete trailing block

        for (const block of eventBlocks) {
          for (const line of block.split('\n')) {
            if (!line.startsWith('data: ')) continue;
            try {
              handleEvent(JSON.parse(line.slice(6)));
            } catch (e) {
              if (e instanceof SyntaxError) continue; // malformed JSON — skip
              throw e;                                 // re-throw application errors
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      setIsStreaming(false);
      setPhase('conversation');
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setPhase('landing');
    setBusinessDescription('');
    setQuestions([]);
    setAnswers([]);
    setStrategy(null);
    setIsStreaming(false);
    setIsSample(false);
    setError('');
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {phase === 'landing' && (
        <LandingPage
          onGetStarted={handleGetStarted}
          onShowSample={handleShowSample}
          onShowWaitlist={() => setShowWaitlist(true)}
          error={error}
          onClearError={() => setError('')}
          canGenerate={canGenerate}
          autoOpen={openStrategyModal}
          onAutoOpenHandled={() => setOpenStrategyModal(false)}
        />
      )}

      {phase === 'loading' && <LoadingScreen message={loadingMessage} />}

      {phase === 'conversation' && (
        <ConversationFlow
          businessDescription={businessDescription}
          questions={questions}
          onComplete={handleAnswersComplete}
          onBack={handleReset}
          error={error}
        />
      )}

      {phase === 'results' && (
        <StrategyResults
          strategy={strategy}
          businessDescription={businessDescription}
          answers={answers}
          onReset={handleReset}
          isDemo={isSample}   // sample gets full Pro display
          isSample={isSample}
          isStreaming={isStreaming}
          onShowWaitlist={() => setShowWaitlist(true)}
          onStartFree={handleStartFree}
        />
      )}

      {showWaitlist && (
        <WaitlistModal onClose={() => setShowWaitlist(false)} />
      )}

      {/* ── Secret founder access mode (Ctrl+Shift+F) ── */}
      <FounderMode />
    </div>
  );
}
