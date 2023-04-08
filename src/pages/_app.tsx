import { api } from "~/utils/api";
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import "~/styles/globals.css";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);
  return (
    <ClerkProvider {...pageProps} >
      <SignedIn>
        {layout}
      </SignedIn>
      <SignedOut>
        {/* 
          Non-authenticated visitors will be redirected
          to the sign in page.
        */}
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);


