import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import React from 'react'

export default function App({ Component, pageProps, ...appProps }: AppProps) {

  const isLayoutNeeded = ['/auth/signin'].includes(appProps.router.pathname);
  const LayoutComponent = isLayoutNeeded? React.Fragment : Layout;
  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  ) 
}
