import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import styles from "./page.module.css";
// import { products } from "@/data/products"; // Deprecated
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { products as staticProducts } from "@/data/products"; // Fallback

export const dynamic = 'force-dynamic';

// المكون الرئيسي للصفحة الرئيسية (Hero Section)
export default async function Hero() {
  await dbConnect();

  // Fetch products from DB, fallback to static if DB is empty (for safety during migration)
  let products = await Product.find({}).sort({ createdAt: -1 }).lean();

  // Fallback if DB is empty (first run before seed)
  if (!products || products.length === 0) {
    products = staticProducts as any;
  }

  // Helper to map DB _id to simpler object if needed (lean() does most of it)
  // We use the custom 'id' field for links, so we are good.
  products = JSON.parse(JSON.stringify(products));

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      {/* القسم الترحيبي (Hero Section): أول ما يراه الزائر */}
      <section className={styles.hero}>
        <HeroSlider />
        <div className={styles.heroContent} style={{ zIndex: 5, position: 'relative' }}>
          <h1 className={styles.heroTitle}>السراج للعطور</h1>
          <p className={styles.heroSubtitle}>اكتشف فخامة التراث العربي بأناقة العطور الفرنسية.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/products" className="btn btn-primary">
              تسوق الآن
            </Link>
            <Link href="/about" className="btn">
              قصتنا
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* قسم المنتجات المميزة: يعرض قائمة بجميع المنتجات (أو المميزة فقط إذا قمنا بفلترتها) */}
      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>مجموعات مميزة</h2>
        <div className={styles.grid}>
          {products.slice(0, 8).map((product: any) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    style={{ cursor: "pointer" }}
                  />
                </Link>
              </div>
              <div className="product-content">
                <div>
                  <h3 className="product-title">{product.name}</h3>
                  {/* <p className="product-description">{product.description}</p> */}
                </div>
                <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', width: '100%' }}>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer */}
      {/* قسم العروض الخاصة (CTA): لجذب الانتباه لعروض معينة */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>عرض حصري</h2>
          <p className={styles.heroSubtitle}>احصل على خصم 20% على جميع العطور الفرنسية هذا الأسبوع.</p>
          <Link href="/offers" className="btn btn-primary">
            عرض العروض
          </Link>
        </div>
      </section>
    </div>
  );
}

