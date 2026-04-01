import { useState } from 'react';
import { useRouter } from 'next/router';
import { QUESTIONS, GENERATIONS, calculateResult } from '@/lib/quiz-data';
import type { Generation } from '@/lib/quiz-data';
import styles from '../styles/Quiz.module.css';

type Step = 'intro' | 'quiz' | 'submitting';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!name.trim()) { setError('Prosim vnesi svoje ime.'); return; }
    const year = parseInt(birthYear);
    if (!birthYear || isNaN(year) || year < 1940 || year > 2012) {
      setError('Prosim vnesi veljavno letnico rojstva (1940–2012).');
      return;
    }
    setError('');
    setStep('quiz');
  };

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setTimeout(() => {
      const newAnswers = [...answers, idx];
      if (currentQ < QUESTIONS.length - 1) {
        setAnswers(newAnswers);
        setCurrentQ(currentQ + 1);
        setSelected(null);
      } else {
        submitQuiz(newAnswers);
      }
    }, 350);
  };

  const submitQuiz = async (finalAnswers: number[]) => {
    setStep('submitting');
    const scores: Record<Generation, number> = { genZ: 0, millennials: 0, genX: 0, boomers: 0 };
    finalAnswers.forEach((ansIdx, qIdx) => {
      const ans = QUESTIONS[qIdx].answers[ansIdx];
      scores[ans.generation] += ans.points;
    });
    const result = calculateResult(scores);
    const payload = { name: name.trim(), birthYear: parseInt(birthYear), scores, result, timestamp: Date.now() };

    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error(e);
    }

    const params = new URLSearchParams({
      result,
      name: name.trim(),
      scores: JSON.stringify(scores),
    });
    router.push(`/rezultat?${params.toString()}`);
  };

  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const q = QUESTIONS[currentQ];

  return (
    <main className={styles.main}>
      <div className={styles.bg} />

      {step === 'intro' && (
        <div className={styles.intro} key="intro">
          <div className={styles.badge}>🧬 Generacijski test</div>
          <h1 className={styles.title}>
            Kateri<br />
            <span className={styles.gradient}>generaciji</span><br />
            res spadaš?
          </h1>
          <p className={styles.subtitle}>
            15 vprašanj. Nepristranski algoritem.<br />
            Resnica, ki te morda preseneti.
          </p>

          <div className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.field}>
              <label className={styles.label}>Tvoje ime</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Janez Novak"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Letnica rojstva</label>
              <input
                className={styles.input}
                type="number"
                placeholder="1985"
                value={birthYear}
                onChange={e => setBirthYear(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStart()}
                min={1940}
                max={2012}
              />
            </div>
            <button className={styles.startBtn} onClick={handleStart}>
              Začni kviz →
            </button>
          </div>

          <div className={styles.genPills}>
            {Object.entries(GENERATIONS).map(([key, g]) => (
              <div key={key} className={styles.pill} style={{ '--c': g.color } as React.CSSProperties}>
                {g.emoji} {g.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className={styles.quizWrap} key={`q-${currentQ}`}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.qCounter}>{currentQ + 1} / {QUESTIONS.length}</div>

          <div className={styles.questionCard}>
            <div className={styles.qEmoji}>{q.emoji}</div>
            <h2 className={styles.qText}>{q.text}</h2>

            <div className={styles.answers}>
              {q.answers.map((ans, idx) => {
                const gen = GENERATIONS[ans.generation];
                return (
                  <button
                    key={idx}
                    className={`${styles.answerBtn} ${selected === idx ? styles.selected : ''}`}
                    style={{ '--c': gen.color, '--cl': gen.color + '20' } as React.CSSProperties}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                  >
                    <span className={styles.answerText}>{ans.text}</span>
                    <span className={styles.answerArrow}>→</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 'submitting' && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Analiziramo tvoje odgovore…</p>
        </div>
      )}
    </main>
  );
}
