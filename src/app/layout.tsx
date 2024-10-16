import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat,} from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/provider/Telegram.Provider";
import AuthContextProvider from "@/context/AuthContext";
import { MiniContextProvider } from "@/context/MiniContext";


const inter = Montserrat({ subsets: ["latin"], weight: '400' });
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "InFuse Wallet",
  description: "Simplifying Onboarding to the New Web3 Users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${inter.className} ${geistMono.variable} antialiased`} suppressContentEditableWarning
      >
      <TelegramProvider>
        <AuthContextProvider>
          <MiniContextProvider>
          {children}
          </MiniContextProvider>
        </AuthContextProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
