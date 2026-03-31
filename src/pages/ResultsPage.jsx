import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import GenerationCard from '@/components/GenerationCard';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import {
  calculateActualGeneration,
  getGenerationLabel,
  getGenerationColorClass,
  getGenerationBgClass
} from '@/utils/GenerationUtils';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, scores, testResult } = location.state || {};

  const [birthYear, setBirthYear] = useState('');
  const [actualGeneration, setActualGeneration] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!answers || !scores || !testResult) {
    navigate('/');
    return null;
  }

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const sortedGenerations = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([gen]) => gen);

  const handleBirthYearSubmit = async (e) => {
    e.preventDefault();
    
    const year = parseInt(birthYear);
    if (year < 1946 || year > 2026) {
      toast.error('Prosim vnesi veljavno leto rojstva (1946-2026)');
      return;
    }

    setIsSubmitting(true);
    const actual = calculateActualGeneration(year);
    setActualGeneration(actual);

    try {
      await pb.collection('test_responses').create({
        answers: answers,
        scores: scores,
        test_result: testResult,
        birth_year: year,
        actual_generation: actual
      }, { $autoCancel: false });
      
      setIsSaved(true);
      toast.success('Rezultat shranjen!');
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Napaka pri shranjevanju rezultata');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMatch = actualGeneration === testResult;

  return (
    <>
      <Helmet>
        <title>{`Tvoj rezultat: ${getGenerationLabel(testResult)} - Generacijski Test`}</title>
        <meta name="description" content={`Tvoj rezultat generacijskega testa je ${getGenerationLabel(testResult)}. Preveri, ali se ujema s tvojo dejansko generacijo!`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Celebration Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Tvoj rezultat
            </h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`inline-block px-8 py-4 rounded-2xl ${getGenerationBgClass(testResult)} border-2 ${getGenerationColorClass(testResult).replace('bg-', 'border-')}`}
            >
              <p className="text-2xl md:text-3xl font-bold">
                {getGenerationLabel(testResult)}
              </p>
            </motion.div>
          </motion.div>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {sortedGenerations.map((gen, index) => (
              <GenerationCard
                key={gen}
                generation={gen}
                score={scores[gen]}
                totalScore={totalScore}
                isWinner={gen === testResult}
                index={index}
              />
            ))}
          </div>

          {/* Birth Year Form */}
          {!actualGeneration && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-lg mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Primerjaj z dejansko generacijo
              </h2>
              <p className="text-muted-foreground mb-6">
                Vnesi svoje leto rojstva in preveri, ali se tvoj rezultat ujema z dejansko generacijo
              </p>
              
              <form onSubmit={handleBirthYearSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="birthYear">Leto rojstva</Label>
                  <Input
                    id="birthYear"
                    type="number"
                    min="1946"
                    max="2026"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    placeholder="npr. 1995"
                    required
                    className="mt-2"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Shranjujem...' : 'Prikaži primerjavo'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Comparison Result */}
          {actualGeneration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`bg-card border-2 rounded-2xl p-8 shadow-lg mb-8 ${
                isMatch ? 'border-green-500' : 'border-primary'
              }`}
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Primerjava rezultatov
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center p-6 bg-muted rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Dejanska generacija</p>
                  <p className="text-2xl font-bold">{getGenerationLabel(actualGeneration)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Leto rojstva: {birthYear}</p>
                </div>
                
                <div className="text-center p-6 bg-primary/5 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Rezultat testa</p>
                  <p className="text-2xl font-bold">{getGenerationLabel(testResult)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Na podlagi odgovorov</p>
                </div>
              </div>
              
              <div className="text-center">
                {isMatch ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <p className="text-xl font-semibold text-green-700 mb-2">
                      Popolno ujemanje!
                    </p>
                    <p className="text-green-600">
                      Si pravi {getGenerationLabel(testResult)}! Tvoj način razmišljanja se popolnoma ujema s tvojo generacijo.
                    </p>
                  </div>
                ) : (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <p className="text-xl font-semibold text-primary mb-2">
                      Zanimivo!
                    </p>
                    <p className="text-muted-foreground">
                      Si {getGenerationLabel(actualGeneration)}, a razmišljaš kot {getGenerationLabel(testResult)}! 
                      Tvoj način razmišljanja presega meje tvoje generacije.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/statistics')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Poglej statistiko
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Ponovi test
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;