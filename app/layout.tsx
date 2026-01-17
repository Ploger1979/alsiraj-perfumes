import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryBar from "@/components/CategoryBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import SearchModal from "@/components/SearchModal";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://alsiraj-perfumes.netlify.app'),
  title: "السراج للعطور | Alsiraj Lileutur",
  description: "اكتشف الفخامة مع السراج للعطور. عطور وزيوت فرنسية فاخرة.",
  openGraph: {
    title: "السراج للعطور | Alsiraj Lileutur",
    description: "اكتشف الفخامة مع السراج للعطور. عطور وزيوت فرنسية فاخرة.",
    url: "https://alsiraj-perfumes.netlify.app",
    siteName: "السراج للعطور",
    images: [
      {
        url: "/logo-og.png",
        width: 800,
        height: 800,
        alt: "السراج للعطور Logo",
      },
    ],
    locale: "ar_IQ",
    type: "website",
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  twitter: {
    card: "summary_large_image",
    title: "السراج للعطور | Alsiraj Lileutur",
    description: "اكتشف الفخامة مع السراج للعطور.",
    images: ["/logo-og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar />
            <CategoryBar />
            <main style={{ minHeight: "100vh" }}>{children}</main>
            <Footer />
            <CartDrawer />
            <SearchModal />
            <ScrollToTopButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
