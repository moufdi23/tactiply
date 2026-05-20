import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ConversationFlow from './components/ConversationFlow';
import StrategyResults from './components/StrategyResults';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [phase, setPhase] = useState('landing');
  const [businessDescription, setBusinessDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');

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

  const handleAnswersComplete = async (answers) => {
    setPhase('loading');
    setLoadingMessage('Building your complete marketing strategy...');

    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDescription, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate strategy');
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
    setStrategy(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#030318]">
      {phase === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} error={error} onClearError={() => setError('')} />
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
          onReset={handleReset}
        />
      )}
    </div>
  );
}
