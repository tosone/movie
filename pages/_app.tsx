import '../styles/globals.css';
import { AppProps } from 'next/app';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as NextAuthProvider } from 'next-auth/client';
import PlausibleProvider from 'next-plausible';
import { DefaultSeo } from 'next-seo';
import { ReviewModalContext } from '../utils/ModalContext';
import React, { useState } from 'react';
import theme from '../styles/theme';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): React.ReactChild {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [movie, setMovie] = useState(null);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'ScuffedMDB';
  const shortSiteName =
    process.env.NEXT_PUBLIC_SHORT_SITE_NAME ||
    process.env.NEXT_PUBLIC_SITE_NAME ||
    'SMDB';

  const siteURI =
    process.env.NEXT_PUBLIC_APP_URI || 'https://www.movie.michael-hall.me';
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
