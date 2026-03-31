import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Nav.module.css';

export default function Nav() {
  const { pathname } = useRouter();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoEmoji}>🧬</span>
        <span className={styles.logoText}>GenKviz</span>
      </Link>
      <div className={styles.links}>
        <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
          Kviz
        </Link>
        <Link href="/statistika" className={`${styles.link} ${pathname === '/statistika' ? styles.active : ''}`}>
          Statistika
        </Link>
      </div>
    </nav>
  );
}
