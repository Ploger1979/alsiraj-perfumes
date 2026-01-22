
import Link from "next/link";
import Image from "next/image";
import { products as staticProducts } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

// صفحة عرض جميع المنتجات (كتالوج المنتجات)
export default async function ProductsPage() {
    await dbConnect();
    let products = await Product.find({}).sort({ createdAt: -1 }).lean();

    if (!products || products.length === 0) {
        products = staticProducts as any;
    }

    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <br />
            <br />
            <br />
            <br />
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem", textAlign: "center" }}>جميع المنتجات</h1>

            {/* شبكة المنتجات (Grid): تعرض المنتجات في صفوف وأعمدة متجاوبة */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "3rem" }}>
                {products.map((item: any) => (
                    <div key={item.id} className="product-card">
                        <div className="product-image-container">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="product-image" // صورة المنتج مع ملء المساحة المتاحة
                            />
                        </div>
                        <div className="product-content">
                            <div>
                                <h3 className="product-title">{item.name}</h3>
                                <div className="product-price">
                                    {item.price.toLocaleString()} د.ع {/* السعر الحالي */}
                                    {item.originalPrice && (
                                        <span className="original-price">{item.originalPrice.toLocaleString()} د.ع</span> // السعر الأصلي المشطوب (إن وجد)
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

