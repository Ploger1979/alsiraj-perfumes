import Link from "next/link";
import styles from "./page.module.css";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";

export default function Hero() {
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
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
      <section className={`${styles.section} container`}>
        <h2 className={styles.sectionTitle}>مجموعات مميزة</h2>
        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-content">
                <div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                  <AddToCartButton product={product} />
                  <Link href={`/products/${product.id}`} className="btn">عرض التفاصيل</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer */}
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
