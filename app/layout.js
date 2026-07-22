import './globals.css';
import NextAuthProvider from '@/components/NextAuthProvider';

export const metadata = {
  title: 'DarkKnight AI — by The DN Production',
  description: 'An ultra-premium Agentic AI platform for personalized opportunities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body style={{ backgroundColor: '#050505', margin: 0, padding: 0 }}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
