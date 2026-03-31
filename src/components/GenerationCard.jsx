import React from 'react';
import { motion } from 'framer-motion';
import { getGenerationLabel, getGenerationColorClass, getGenerationBgClass } from '@/utils/GenerationUtils';

const GenerationCard = ({ generation, score, totalScore, isWinner = false, index = 0 }) => {
  const percentage = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
        isWinner
          ? 'border-primary shadow-lg scale-105'
          : 'border-border bg-card'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getGenerationColorClass(generation)}`} />
          <h3 className="text-lg font-semibold">{getGenerationLabel(generation)}</h3>
        </div>
        {isWinner && (
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            Tvoj rezultat
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Točke</span>
          <span className="text-2xl font-bold">{score}</span>
        </div>
        
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            className={`h-full ${getGenerationColorClass(generation)} rounded-full`}
          />
        </div>
        
        <div className="text-right">
          <span className="text-sm font-medium text-muted-foreground">{percentage}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GenerationCard;