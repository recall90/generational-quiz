import React from 'react';
import { motion } from 'framer-motion';

const AnswerOption = ({ option, isSelected, onSelect, index }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/30'
          }`}
        >
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
        <span className={`text-base ${isSelected ? 'font-medium text-foreground' : 'text-foreground/80'}`}>
          {option.text}
        </span>
      </div>
    </motion.button>
  );
};

export default AnswerOption;