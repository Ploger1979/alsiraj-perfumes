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
import JsonLd from "@/components/JsonLd";

// تعريف الخطوط المستخدمة في الموقع (Google Fonts)
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

const siteUrl = "https://alsiraj-perfumes.com";
const ogImage = `${siteUrl}/og-cover-v2.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "السراج للعطور | أفضل العطور العالميه والشرقية في أوروبا",
    template: "%s | السراج للعطور",
  },

  description:
    "اكتشف عالم الفخامة مع السراج للعطور. نقدم أرقى العطور العالميه والشرقية، زيوت عطرية فاخرة وعطور بأسعار منافسة. تسوق الآن واحصل على تجربة عطرية لا تنسى.",
    

  alternates: {
    canonical: siteUrl,
  },

  icons: {
    icon: "/favicon-gold.png",
    shortcut: "/favicon-gold.png",
    apple: "/logo-Circle.png", // ← أيقونة iPhone الاحترافية
  },

  openGraph: {
    title: "السراج للعطور | أفضل العطور العالميه والشرقية",
    description:
      "اكتشف عالم الفخامة مع السراج للعطور. تشكيلة واسعة من العطور العالمية والشرقية الفاخرة.",
    url: siteUrl,
    siteName: "السراج للعطور | Alsiraj Perfumes",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "السراج للعطور - فخامة العطـور",
        type: "image/png",
      },
    ],
    locale: "ar_IQ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "السراج للعطور | Alsiraj Perfumes",
    description: "اكتشف فخامة العطور العالميه والشرقية مع السراج.",
    images: [ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "Z84LXGtIqDF8x_jAW5BU9BoTqXKr7Pbzsw-GzwGG_Uo",
  },
};


// المخطط الرئيسي (Layout) الذي يحيط بكل صفحات الموقع
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Apple PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="السراج للعطور" />
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <JsonLd />
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
        {/* Service Worker للـ PWA */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </body>
    </html>
  );
}
