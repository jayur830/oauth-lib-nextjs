import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Login',
  description: 'OAuth Login Lib',
};

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
