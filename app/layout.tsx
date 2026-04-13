import type { Metadata } from "next";
import { Inter, Jacques_Francois } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jacquesFrancois = Jacques_Francois({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jacques-francois",
});

export const metadata: Metadata = {
  title: "POVEDA - Visit Nepal",
  description: "Experience the magic of Nepal with POVEDA. Discover adventures, culture, and relaxation in the heart of the Himalayas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jacquesFrancois.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#485342',
              color: '#fff',
              borderRadius: '8px',
              padding: '16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
