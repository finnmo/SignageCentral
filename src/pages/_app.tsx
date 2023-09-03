import { api } from "~/utils/api";
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import "~/styles/globals.css";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


export type NextPageWithLayout<P = {[k: string | number | symbol]: never}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


function MyApp({
  Component,
  pageProps: {...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    
    <ClerkProvider {...pageProps} >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toaster  />
      <Head>
        <title>Digital Signage Manager</title>
        <meta name="description" content="Made by Finn" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignedIn>
        {layout}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      </LocalizationProvider>
    </ClerkProvider>
  );
}
export default api.withTRPC(MyApp);



