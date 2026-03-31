import { useRouter } from 'next/router';
import Link from 'next/link';
import { GENERATIONS } from '@/lib/quiz-data';
import type { Generation } from '@/lib/quiz-data';
import styles from '../styles/Rezultat.module.css';

const GEN_DESCRIPTIONS: Record<Generation, string> = {
  genZ: 'Ti si digitalni domačin – svet si ne predstavljaš brez interneta. Sprememba je tvoj element, hitrost tvoj ritem. Memi so tvoj jezik, avtentičnost tvoja vrednost.',
  millennials: 'Odrasel si z internetom in ga videl rasti. Ceniš ravnovesje med kariero in življenjem, si ambiciozen, a tudi ozaveščen. Nostalgičen na dober način.',
  genX: 'Neodvisen, pragmatičen, izkušen. Videl si analogni svet in digitalno revolucijo – in se uspešno prilagodil obojemu. Stabilnost ti pomeni svobodo.',
  boomers: 'Ti si gradil svet, kakršnega poznamo danes. Ceniš tradicijo, izkušnje in trdno delo. Tehnologija je orodje, ne cilj – in to je modrost, ne zaostalost.',
};

export default function Rezultat() {
  const router = useRouter();
  const { result, name, scores: scoresRaw } = router.query;

  if (!result || !scoresRaw) {
    return (
      <main className={styles.main}>
        <div className={styles.empty}>
          <p>Ni podatkov. <Link href="/">Reši kviz →</Link></p>
        </div>
      </main>
    );
  }

  const gen = result as Generation;
  const scores = JSON.parse(scoresRaw as string) as Record<Generation, number>;
  const genInfo = GENERATIONS[gen];
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);

  const sortedGens = (Object.entries(scores) as [Generation, number][])
    .sort((a, b) => b[1] - a[1]);

  return (
    <main className={styles.main}>
      <div className={styles.bg} style={{ '--c': genInfo.color } as React.CSSProperties} />

      <div className={styles.card}>
        <div className={styles.top}>
          <div className={styles.emoji}>{genInfo.emoji}</div>
          <div className={styles.label}>Tvoja generacija</div>
          <h1 className={styles.genName} style={{ color: genInfo.color }}>
            {genInfo.label}
          </h1>
          <div className={styles.years}>{genInfo.years}</div>
          {name && <div className={styles.greeting}>Čestitke, {name}!</div>}
          <p className={styles.description}>{GEN_DESCRIPTIONS[gen]}</p>
        </div>

        <div className={styles.scores}>
          <div className={styles.scoresTitle}>Razporeditev točk</div>
          {sortedGens.map(([key, pts]) => {
            const g = GENERATIONS[key as Generation];
            const pct = totalPoints > 0 ? (pts / totalPoints) * 100 : 0;
            return (
              <div key={key} className={styles.scoreRow}>
                <div className={styles.scoreLabel}>
                  <span>{g.emoji}</span>
                  <span>{g.label}</span>
                  <span className={styles.scorePts}>{pts} pt</span>
                </div>
                <div className={styles.scoreBar}>
                  <div
                    className={styles.scoreBarFill}
                    style={{
                      width: `${pct}%`,
                      background: g.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Link href="/" className={styles.btnSecondary}>
            ← Reši znova
          </Link>
          <Link href="/statistika" className={styles.btnPrimary} style={{ '--c': genInfo.color } as React.CSSProperties}>
            Poglej statistiko →
          </Link>
        </div>
      </div>
    </main>
  );
}
