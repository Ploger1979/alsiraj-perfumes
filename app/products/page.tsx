
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";

// صفحة عرض جميع المنتجات (كتالوج المنتجات)
export default function ProductsPage() {
    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <br />
            <br />
            <br />
            <br />
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem", textAlign: "center" }}>جميع المنتجات</h1>

            {/* شبكة المنتجات (Grid): تعرض المنتجات في صفوف وأعمدة متجاوبة */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "3rem" }}>
                {products.map((item) => (
                    <div key={item.id} className="product-card">
                        <div className="product-image-container">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="product-image" // صورة المنتج مع ملء المساحة المتاحة
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="product-content">
                            <div>
                                <h3 className="product-title">{item.name}</h3>
                                <div className="product-price">
                                    {formatCurrency(item.price)} {/* السعر الحالي */}
                                    {item.originalPrice && (
                                        <span className="original-price">{formatCurrency(item.originalPrice)}</span> // السعر الأصلي المشطوب (إن وجد)
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
