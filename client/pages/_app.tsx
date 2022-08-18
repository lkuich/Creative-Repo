import '../styles/globals.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { GqlAuthProvider } from 'hooks/useAuth';

import Head from 'next/head';

import { Column } from 'components/Group';

import styles from './home.module.sass';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Creative Repo</title>
      </Head>
      <GqlAuthProvider>
        {/* <div className={styles['main-grid']}> */}
        <Column className={styles.mainPage}>
          <Component {...pageProps} />
        </Column>
        {/* </div> */}
      </GqlAuthProvider>
    </SessionProvider>
  );
}

export default App;
