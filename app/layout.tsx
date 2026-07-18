import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onchain Trade Journal",
  description: "A provable, onchain trade journal built on Base",
  other: {
    "talentapp:project_verification": "fa9eb1582cfbda41cfad00fc7272b474f66b4b5e1236758cc1799fa51425810c34bb19e11e940d6391fef9a66232099b18b69ca4ff41d835e06d069a90402a15",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0E14] text-[#EDEFF3] font-[family-name:var(--font-body)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}