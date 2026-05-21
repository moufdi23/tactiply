import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ConversationFlow from './components/ConversationFlow';
import StrategyResults from './components/StrategyResults';
import LoadingScreen from './components/LoadingScreen';
import { getPlan } from './plan';

export default function App() {
  const [phase, setPhase] = useState('landing');
  const [businessDescription, setBusinessDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);   // ← kept in state for Competitor & Regenerate
  const [strategy, setStrategy] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

  // Re-derived on every render — cheap sync read from localStorage + URL params
  const { isDemo, canGenerate, recordUsage } = getPlan();

  const handleGetStarted = async (description) => {
    setError('');
    setBusinessDescription(description);
    setPhase('loading');
    setLoadingMessage('Analyzing your business...');

    try {
      const res = await fetch('/api/questions', {
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

  const handleAnswersComplete = async (completedAnswers) => {
    setAnswers(completedAnswers); // store for downstream use
    setPhase('loading');
    setLoadingMessage('Building your complete marketing strategy...');

    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDescription, answers: completedAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate strategy');

      recordUsage(); // record AFTER success — never charge a failed attempt
      setStrategy(data.strategy);
      setPhase('results');
    } catch (err) {
      setError(err.message);
      setPhase('conversation');
    }
  };

  const handleReset = () => {
    setPhase('landing');
    setBusinessDescription('');
    setQuestions([]);
    setAnswers([]);
    setStrategy(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#030318]">
      {phase === 'landing' && (
        <LandingPage
          onGetStarted={handleGetStarted}
          error={error}
          onClearError={() => setError('')}
          canGenerate={canGenerate}
          isDemo={isDemo}
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
          isDemo={isDemo}
        />
      )}
    </div>
  );
}
