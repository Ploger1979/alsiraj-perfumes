import Link from "next/link";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";

// صفحة العروض الخاصة (تظهر المنتجات التي عليها خصم فقط)
export default function OffersPage() {
    // تصفية المنتجات لجلب التي عليها عرض (isOffer = true)
    const offers = products.filter((p) => p.isOffer);

    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <br />
            <br />
            <br />
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem", textAlign: "center" }}>عروض خاصة</h1>
            <p style={{ textAlign: "center", marginBottom: "4rem", color: "var(--color-text-muted)" }}>خصومات حصرية على مجموعتنا المميزة.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "3rem" }}>
                {offers.map((item) => (
                    <div key={item.id} className="product-card">
                        {/* شارة الخصم (تحسب النسبة المئوية تلقائياً) */}
                        <div className="product-badge">
                            {item.originalPrice && item.price ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0}%
                        </div>
                        <div className="product-image-container">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="product-image"
                            />
                        </div>
                        <div className="product-content">
                            <div>
                                <h3 className="product-title">{item.name}</h3>
                                {/* السعر بعد الخصم والسعر الأصلي */}
                                <div className="product-price">
                                    {item.price.toLocaleString()} د.ع
                                    {item.originalPrice && (
                                        <span className="original-price">{item.originalPrice.toLocaleString()} د.ع</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                <AddToCartButton product={item} />
                                <Link href={`/products/${item.id}`} className="btn">عرض التفاصيل</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
