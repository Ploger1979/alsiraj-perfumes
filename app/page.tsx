import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import styles from "./page.module.css";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

export default async function Hero() {
  await dbConnect();

  // جلب المنتجات المميزة فقط (التي اختارها الأدمن)
  const featuredRaw = await Product.find({ isFeatured: true }).lean();
  const safeProducts = JSON.parse(JSON.stringify(featuredRaw));

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <HeroSlider />
        <div className={styles.heroContent} style={{ zIndex: 5, position: 'relative' }}>
          <h1 className={styles.heroTitle}>السراج للعطور</h1>
          <p className={styles.heroSubtitle}>اكتشف فخامة التراث العربي بأناقة العطورالعالمية</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/products" className="btn btn-primary">تسوق الآن</Link>
            <Link href="/about" className="btn">قصتنا</Link>
          </div>
        </div>
      </section>

      {/* ✅ مجموعات مميزة - يظهر فقط إذا اختار الأدمن منتجات يريد تمييزها */}
      {safeProducts.length > 0 && (
        <section className={`${styles.section} container`}>
          <h2 className={styles.sectionTitle}>مجموعات مميزة</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '3.5rem', marginTop: '-1.5rem' }}>
            <div style={{
              height: '1px',
              flex: '0 1 50px',
              background: 'linear-gradient(to left, var(--color-gold, #c9a84c), transparent)',
              opacity: 0.8
            }}></div>
            <p style={{
              textAlign: 'center',
              color: 'var(--foreground)',
              fontSize: '1.1rem',
              fontWeight: '500',
              margin: 0,
              letterSpacing: '1px',
              opacity: 0.95,
              textShadow: '0 0 1px rgba(201,168,76,0.2)'
            }}>
              اختيار خاص من أفضل عطورنا
            </p>
            <div style={{
              height: '1px',
              flex: '0 1 50px',
              background: 'linear-gradient(to right, var(--color-gold, #c9a84c), transparent)',
              opacity: 0.8
            }}></div>
          </div>
          <div className={styles.grid}>
            {safeProducts.map((product: any) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <Link href={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="product-image" style={{ cursor: "pointer" }} />
                  </Link>
                </div>
                <div className="product-content">
                  <div>
                    <h3 className="product-title">{product.name}</h3>
                    <div className="product-price" style={{ marginTop: '0.5rem' }}>
                      {formatCurrency(product.price)}
                      {(product.originalPrice || 0) > 0 && (
                        <span style={{ marginRight: '8px', fontSize: '0.83rem', textDecoration: 'line-through', color: '#888' }}>
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', width: '100%' }}>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA - عروض */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>عرض حصري</h2>
          <p className={styles.heroSubtitle}>احصل على أفضل خصومات عطورنا المختارة هذا الموقع</p>
          <Link href="/offers" className="btn btn-primary">مشاهدة العروض</Link>
        </div>
      </section>
    </div>
  );
}
