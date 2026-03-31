import { useState, useEffect } from 'react';
import { GENERATIONS } from '@/lib/quiz-data';
import type { Generation, QuizResult } from '@/lib/quiz-data';
import styles from '../styles/Statistika.module.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const GEN_ORDER: Generation[] = ['genZ', 'millennials', 'genX', 'boomers'];

function getDecade(year: number) {
  return `${Math.floor(year / 10) * 10}s`;
}

export default function Statistika() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = () => {
    setLoading(true);
    setError('');
    fetch('/api/results', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setResults(data.results ?? []);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setError('Napaka pri nalaganju podatkov.');
        setLoading(false);
      });
  };

  useEffect(() => { fetchResults(); }, []);

  const total = results.length;

  const genCounts = GEN_ORDER.map(g => ({
    name: GENERATIONS[g].label,
    count: results.filter(r => r.result === g).length,
    color: GENERATIONS[g].color,
    emoji: GENERATIONS[g].emoji,
    key: g,
  }));

  const decadeMap: Record<string, Record<Generation, number>> = {};
  results.forEach(r => {
    const decade = getDecade(r.birthYear);
    if (!decadeMap[decade]) decadeMap[decade] = { genZ: 0, millennials: 0, genX: 0, boomers: 0 };
    decadeMap[decade][r.result]++;
  });
  const decadeData = Object.entries(decadeMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([decade, counts]) => ({ decade, ...counts }));

  const recent = [...results].sort((a, b) => b.timestamp - a.timestamp).slice(0, 15);
  const pieData = genCounts.map(g => ({ name: g.name, value: g.count }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          {payload.map((p) => (
            <div key={p.name}>{p.name}: <strong>{p.value}</strong></div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <main className={styles.main}>
      <div className={styles.bg} />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Statistika</h1>
          <div className={styles.headerRight}>
            {!loading && (
              <div className={styles.totalBadge}>
                {total} {total === 1 ? 'udeleženec' : total < 5 ? 'udeleženci' : 'udeležencev'}
              </div>
            )}
            <button className={styles.refreshBtn} onClick={fetchResults} disabled={loading}>
              ↻ Osveži
            </button>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>Nalagam podatke…</p>
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorBox}>{error}</div>
        )}

        {!loading && !error && total === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyEmoji}>📊</div>
            <p>Še ni rezultatov. Bodite prvi!</p>
          </div>
        )}

        {!loading && !error && total > 0 && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Razporeditev po generacijah</h2>
              <div className={styles.genGrid}>
                {genCounts.map(g => (
                  <div key={g.key} className={styles.genCard} style={{ '--c': g.color } as React.CSSProperties}>
                    <div className={styles.genCardEmoji}>{g.emoji}</div>
                    <div className={styles.genCardName}>{g.name}</div>
                    <div className={styles.genCardCount}>{g.count}</div>
                    <div className={styles.genCardPct}>
                      {total > 0 ? Math.round((g.count / total) * 100) : 0}%
                    </div>
                    <div className={styles.genCardBar}>
                      <div
                        className={styles.genCardBarFill}
                        style={{ width: `${total > 0 ? (g.count / total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.chartsRow}>
              <div className={styles.chartBox}>
                <h2 className={styles.sectionTitle}>Pie chart</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                      {genCounts.map((g) => (
                        <Cell key={g.key} fill={g.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => <span style={{ color: '#8888AA', fontSize: '0.85rem' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {decadeData.length > 0 && (
                <div className={styles.chartBox}>
                  <h2 className={styles.sectionTitle}>Po letnici rojstva</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={decadeData} barSize={14}>
                      <XAxis dataKey="decade" tick={{ fill: '#8888AA', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#8888AA', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      {GEN_ORDER.map(g => (
                        <Bar key={g} dataKey={g} name={GENERATIONS[g].label} fill={GENERATIONS[g].color} radius={[4, 4, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Zadnji rezultati</h2>
              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <div>Ime</div>
                  <div>Rojen/a</div>
                  <div>Rezultat</div>
                  <div className={styles.hideSmall}>Datum</div>
                </div>
                {recent.map((r, i) => {
                  const gen = GENERATIONS[r.result];
                  return (
                    <div key={i} className={styles.tableRow}>
                      <div className={styles.tableName}>{r.name}</div>
                      <div className={styles.tableMuted}>{r.birthYear}</div>
                      <div>
                        <span className={styles.genTag} style={{ '--c': gen.color } as React.CSSProperties}>
                          {gen.emoji} {gen.label}
                        </span>
                      </div>
                      <div className={`${styles.tableMuted} ${styles.hideSmall}`}>
                        {new Date(r.timestamp).toLocaleDateString('sl-SI')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
