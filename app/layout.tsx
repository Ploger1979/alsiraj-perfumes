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

// إعدادات الـ Metadata (العناوين والوصف الذي يظهر في محركات البحث ومواقع التواصل)
export const metadata: Metadata = {
  metadataBase: new URL('https://alsiraj-perfumes.com'),
  title: {
    default: "السراج للعطور | أفضل العطور الفرنسية والشرقية في أوروبا",
    template: "%s | السراج للعطور"
  },
  description: "اكتشف عالم الفخامة مع السراج للعطور. نقدم أرقى العطور الفرنسية والشرقية، زيوت عطرية فاخرة، وعطور النيش بأسعار منافسة. تسوق الآن واحصل على تجربة عطرية لا تنسى.",
  keywords: ["عطور", "السراج للعطور", "عطور فرنسية", "عطور شرقية", "زيوت عطرية", "مسك", "عود", "هدايا عطور", "تسوق عطور اونلاين", "Alsiraj Perfumes", "Perfumes", "Fragrance", "Oud", "Musk", "Luxury Perfumes"],
  authors: [{ name: "Alsiraj Perfumes" }],
  creator: "Alsiraj Perfumes",
  publisher: "Alsiraj Perfumes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://alsiraj-perfumes.com',
  },
  openGraph: {
    title: "السراج للعطور | أفضل العطور الفرنسية والشرقية",
    description: "اكتشف عالم الفخامة مع السراج للعطور. تشكيلة واسعة من العطور العالمية والشرقية الفاخرة.",
    url: "https://alsiraj-perfumes.com",
    siteName: "السراج للعطور | Alsiraj Perfumes",
    images: [
      {
        url: "/alsiraj-cover.png",
        width: 1200,
        height: 630,
        alt: "السراج للعطور - فخامة العطـور",
      },
    ],
    locale: "ar_IQ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "السراج للعطور | Alsiraj Perfumes",
    description: "اكتشف فخامة العطور الفرنسية والشرقية مع السراج.",
    images: ["/alsiraj-cover.png"],
  },
  verification: {
    google: "Z84LXGtIqDF8x_jAW5BU9BoTqXKr7Pbzsw-GzwGG_Uo",
  },
};

// المخطط الرئيسي (Layout) الذي يحيط بكل صفحات الموقع
// هنا نضع الأشياء الثابتة مثل الـ Navbar والـ Footer ومزودي الخدمات (Providers)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <JsonLd />
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {/* مزود السلة يغلف التطبيق ليمكن الوصول للسلة من أي مكان */}
          <CartProvider>
            <Navbar /> {/* الشريط العلوي */}
            <CategoryBar /> {/* شريط التصنيفات */}
            <main style={{ minHeight: "100vh" }}>{children}</main> {/* محتوى الصفحة المتغير */}
            <Footer /> {/* تذييل الصفحة */}
            <CartDrawer /> {/* القائمة الجانبية للسلة (مخفية افتراضياً) */}
            <SearchModal /> {/* نافذة البحث (مخفية افتراضياً) */}
            <ScrollToTopButton /> {/* زر الصعود للأعلى */}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
