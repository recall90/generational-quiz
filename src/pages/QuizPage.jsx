import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import AnswerOption from '@/components/AnswerOption';
import { quizQuestions } from '@/data/QuizData';
import { calculateScores, getWinningGeneration } from '@/utils/GenerationUtils';

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));

  const question = quizQuestions[currentQuestion];
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const hasAnswer = answers[currentQuestion] !== null;

  const handleAnswerSelect = (generation) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = generation;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const scores = calculateScores(answers);
    const testResult = getWinningGeneration(scores);
    
    navigate('/results', {
      state: {
        answers,
        scores,
        testResult
      }
    });
  };

  const allAnswered = answers.every(answer => answer !== null);

  return (
    <>
      <Helmet>
        <title>Generacijski Test - Ugotovi svojo generacijo</title>
        <meta name="description" content="Odgovori na 15 vprašanj in ugotovi, v katero generacijo dejansko spadaš. Gen Z, Millennials, Gen X ali Boomers?" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Generacijski Test
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Odgovori na 15 vprašanj in ugotovi, v katero generacijo dejansko spadaš
            </p>
          </motion.div>

          {/* Progress */}
          <div className="mb-8">
            <ProgressBar current={currentQuestion + 1} total={quizQuestions.length} />
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                {question.question}
              </h2>
              <p className="text-muted-foreground">
                {question.description}
              </p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  isSelected={answers[currentQuestion] === option.generation}
                  onSelect={() => handleAnswerSelect(option.generation)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Nazaj
            </Button>

            <div className="flex-1 text-center">
              <span className="text-sm text-muted-foreground">
                {answers.filter(a => a !== null).length} / {quizQuestions.length} odgovorjenih
              </span>
            </div>

            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="flex items-center gap-2"
              >
                Naprej
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                Zaključi test
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizPage;