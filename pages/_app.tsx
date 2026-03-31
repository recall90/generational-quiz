import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Nav from '@/components/Nav';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Generacijski Kviz</title>
        <meta name="description" content="Odkrij svojo pravo generacijsko identiteto!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧬</text></svg>" />
      </Head>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}
