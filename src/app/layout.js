import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/ChatBot";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://rutekita-delta.vercel.app";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "RuteKita  Angkutan Umum Kabupaten Garut",
    template: "%s | RuteKita",
  },
  description:
    "Informasi lengkap trayek, jadwal keberangkatan, tarif, dan peta rute angkutan umum Kabupaten Garut. Data resmi Dishub Garut.",
  keywords: [
    "angkutan umum Garut",
    "trayek angkot Garut",
    "jadwal angkot Garut",
    "tarif angkot Garut",
    "peta rute angkot Garut",
    "transportasi umum Garut",
    "RuteKita",
    "Dishub Garut",
  ],
  authors: [{ name: "RuteKita" }],
  creator: "RuteKita",
  publisher: "RuteKita",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: BASE_URL,
    siteName: "RuteKita",
    title: "RuteKita  Angkutan Umum Kabupaten Garut",
    description:
      "Temukan trayek, jadwal, tarif, dan peta rute angkutan umum Kabupaten Garut dalam satu tempat. Data resmi Dishub Garut.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RuteKita  Angkutan Umum Kabupaten Garut" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RuteKita  Angkutan Umum Kabupaten Garut",
    description: "Temukan trayek, jadwal, tarif, dan peta rute angkutan umum Kabupaten Garut dalam satu tempat.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ChatBot />
        <BottomNav />
      </body>
    </html>
  );
}

