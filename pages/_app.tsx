import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import React from 'react'
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps, ...appProps }: AppProps) {

  const isLayoutNeeded = ['/auth/signin'].includes(appProps.router.pathname);
  const LayoutComponent = isLayoutNeeded ? React.Fragment : Layout;
  return (
    <SessionProvider session={pageProps.session}>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </SessionProvider>
  )
}
