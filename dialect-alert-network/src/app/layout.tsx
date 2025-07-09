import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { NotificationsProvider } from '@/lib/notifications';
import Header from '@/components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dialect Alert Network",
  description: "AI-powered alert system for regional dialects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NotificationsProvider>
            <Header />
            {children}
          </NotificationsProvider>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
