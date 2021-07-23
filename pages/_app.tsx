import { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { useRouter } from 'next/router';
import PlausibleProvider from 'next-plausible';
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';

import '../styles/globals.css';
import theme from '../styles/theme';
import { PopulatedUserType } from '../models/user';
import { ReviewModalContext } from '../utils/ModalContext';
import { ReviewType, SerializedMovieType } from '../models/movie';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): React.ReactChild {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [movie, setMovie] = useState<SerializedMovieType<ReviewType<PopulatedUserType>[]> | null>(null);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const shortSiteName = process.env.NEXT_PUBLIC_SHORT_SITE_NAME || process.env.NEXT_PUBLIC_SITE_NAME || 'SMDB';

  const router = useRouter();
  useEffect(() => {
    if (document.getElementById('__next')) {
      (document.getElementById('__next') as HTMLElement).scrollTop = 0;
    }
  }, [router.pathname]);
  const siteURI = process.env.NEXT_PUBLIC_APP_URI || 'https://www.movie.michael-hall.me';
  return (
    <>
      <DefaultSeo
        titleTemplate={`%s | ${shortSiteName}`}
        description={'A private movie rating website'}
        openGraph={{
          title: siteName,
          type: `website`,
          site_name: siteName,
          images: [
            {
              url: `${siteURI}/sitePicture.png`,
              alt: `Screenshot of ${siteName}`,
            },
          ],
        }}
      />
      <PlausibleProvider
        domain="movie.michael-hall.me"
        selfHosted
        trackOutboundLinks
        enabled={process.env.NODE_ENV === 'production'}
        customDomain={'https://stats.michael-hall.me'}
      >
        <NextAuthProvider
          session={pageProps.session}
          options={{
            clientMaxAge: 60, // Re-fetch session if cache is older than 60 seconds
            keepAlive: 5 * 60, // Send keepAlive message every 5 minutes
          }}
        >
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <ReviewModalContext.Provider
                value={{ isOpen, onOpen, onClose, movie, setMovie }}
              >
                <Component {...pageProps} />
              </ReviewModalContext.Provider>
            </ChakraProvider>
          </QueryClientProvider>
        </NextAuthProvider>
      </PlausibleProvider>
    </>
  );
}

export default MyApp;
