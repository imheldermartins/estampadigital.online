import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import AppContext from "../contexts";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EstampaDigital.online",
  description: "App online para confecção e pedido de confecções online."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${notoSans.variable} bg-zinc-950 text-gray-50`}>
        <AppContext>
          {children}
        </AppContext>
      </body>
    </html>
  );
}
