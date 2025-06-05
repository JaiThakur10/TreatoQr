import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Treato - Refreshments & Food",
  description:
    "Delicious and healthy meals delivered to your doorstep. Try Treato's fresh thalis, fruit bowls, salads, and more.",
  keywords: [
    "Treato",
    "Healthy food delivery",
    "Fruit bowls",
    "Indian thali",
    "Online food order",
    "Home delivery meals",
  ],
  authors: [{ name: "Weularity", url: "https://www.weularity.com" }],
  openGraph: {
    title: "Treato - Refreshments & Food",
    description:
      "Order fresh and delicious meals from Treato. Fast delivery, healthy choices!",
    url: "https://treatofood.com",
    siteName: "Treato",
    images: [
      {
        url: "/images/boy.png", // ensure this image exists
        width: 1200,
        height: 630,
        alt: "Treato - Healthy Food Delivered",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  metadataBase: new URL("https://treatofood.com"),
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#facc15", // Tailwind's yellow-400
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
