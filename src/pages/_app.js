import React, { useEffect } from 'react'
import * as gtag from '../lib/gtag'
//import { AppProps } from 'next/dist/next-server/lib/router/router';
import { useRouter } from 'next/router';

//const CustomApp = ({ Component, pageProps }: AppProps) => {
const CustomApp = ({ Component, pageProps }) => {

    // Google Analyticsをページ遷移時にも対応させる
    const router = useRouter();
    useEffect(() => {
      const handleRouteChange = (url) => {
        gtag.pageview(url);
      };
      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }, [router.events]);
  
    return ( <Component {...pageProps} /> );
  };
  
  export default CustomApp;