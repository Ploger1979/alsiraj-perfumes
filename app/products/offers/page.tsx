import Link from "next/link";
import { products as staticProducts } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

// صفحة العروض الخاصة (تظهر المنتجات التي عليها خصم فقط)
export default async function OffersPage() {
    await dbConnect();
    let allProducts = await Product.find({}).lean();

    if (!allProducts || allProducts.length === 0) {
        allProducts = staticProducts as any;
    }

    allProducts = JSON.parse(JSON.stringify(allProducts));

    // تصفية المنتجات لجلب التي عليها عرض (isOffer = true)
    const offers = allProducts.filter((p: any) => p.isOffer);

    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <br />
            <br />
            <br />
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem", textAlign: "center" }}>عروض خاصة</h1>
            <p style={{ textAlign: "center", marginBottom: "4rem", color: "var(--color-text-muted)" }}>خصومات حصرية على مجموعتنا المميزة.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                {offers.map((item: any) => (
                    <div key={item.id} className="product-card" style={{ position: 'relative' }}>
                        {/* شارة الخصم الفخمة */}
                        {item.isOffer && (item.originalPrice || 0) > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                zIndex: 2,
                                pointerEvents: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    zIndex: -1 // to go behind the image
                                }}></div>
                                <img 
                                    src="/new-offer-badge.png" 
                                    alt="عرض خاص" 
                                    style={{ 
                                        width: '55px', 
                                        height: 'auto',
                                        position: 'relative'
                                    }} 
                                />
                            </div>
                        )}
                        <div className="product-image-container">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="product-image"
                            />
                        </div>
                        <div className="product-content">
                            <div>
                                <h3 className="product-title">
                                    {item.name}
                                    {item.nameAr && <span style={{ display: 'block', fontSize: '0.85em', color: '#aaa', marginTop: '4px' }}>{item.nameAr}</span>}
                                </h3>
                                {/* السعر بعد الخصم والسعر الأصلي */}
                                <div className="product-price">
                                    {item.price.toLocaleString()} دينار عراقي
                                    {item.originalPrice && (
                                        <span className="original-price">{item.originalPrice.toLocaleString()} دينار عراقي</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'center' }}>
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

