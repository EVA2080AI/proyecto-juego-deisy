import React from 'react';
import { Smile, Frown, Meh, Heart, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface SentimentQuestionProps {
  childName: string;
  onComplete: (sentiment: string) => void;
}

const sentiments = [
  { id: 'optimistic', label: 'Optimista', icon: <Smile className="text-success" />, color: '#10b981' },
  { id: 'nervous', label: 'Nervioso/a', icon: <Meh className="text-warning" />, color: '#f59e0b' },
  { id: 'anxious', label: 'Ansioso/a', icon: <Frown className="text-danger" />, color: '#ef4444' },
  { id: 'hopeful', label: 'Con Esperanza', icon: <Heart className="text-primary" />, color: '#3b82f6' }
];

const SentimentQuestion: React.FC<SentimentQuestionProps> = ({ childName, onComplete }) => {
  return (
    <div className="sentiment-wrapper">
      <motion.div 
        className="glass sentiment-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="info-badge">
          <Info size={16} /> Paso 2: Conectando
        </div>
        
        <h2>Hola, antes de empezar...</h2>
        <p className="subtitle">
          ¿Cómo te sientes hoy respecto al proceso de <strong>{childName}</strong>?
        </p>

        <div className="sentiment-options">
          {sentiments.map((s) => (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sentiment-btn"
              onClick={() => onComplete(s.id)}
            >
              <div className="sentiment-icon">{s.icon}</div>
              <span>{s.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SentimentQuestion;
