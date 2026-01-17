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
        url: "/alsiraj-cover.png", // الصورة التي تظهر عند مشاركة الرابط (واتساب، فيسبوك، إلخ)
        width: 1200,
        height: 630,
        alt: "السراج للعطور",
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
    images: ["/alsiraj-cover.png"], // صورة المعاينة لتويتر
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
