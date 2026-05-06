import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegistrationForm from './components/RegistrationForm';
import SentimentQuestion from './components/SentimentQuestion';
import GameBoard from './components/GameBoard';
import './App.css';

type Step = 'registration' | 'sentiment' | 'game';

function App() {
  const [step, setStep] = useState<Step>('registration');
  const [userData, setUserData] = useState<any>(null);

  const handleRegistrationComplete = (data: any) => {
    setUserData(data);
    setStep('sentiment');
  };

  const handleSentimentComplete = (sentiment: string) => {
    setUserData({ ...userData, sentiment });
    setStep('game');
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {step === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <RegistrationForm onComplete={handleRegistrationComplete} />
          </motion.div>
        )}

        {step === 'sentiment' && (
          <motion.div
            key="sentiment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <SentimentQuestion 
              childName={userData?.childName || 'tu hijo'} 
              onComplete={handleSentimentComplete} 
            />
          </motion.div>
        )}

        {step === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GameBoard userData={userData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
