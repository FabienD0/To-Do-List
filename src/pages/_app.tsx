import MainLayout from '@/components/layout/main-layout';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Roboto } from '@next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

type ComponentProps = React.PropsWithChildren<{
  index: any;
  value: any;
}> & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;



export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <MainLayout className={roboto.className}>
          <Component {...pageProps} />
        </MainLayout>
      </UserProvider>
    </>
  );
}
