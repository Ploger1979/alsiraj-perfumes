
import Link from "next/link";
import { notFound } from "next/navigation";
import { products as staticProducts } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    const categoryName = category === "french" ? "ماركات عالمية" :
        category === "oils" ? "زيوت عطرية" :
            category === "men" ? "مجموعة الرجال" :
                category === "women" ? "مجموعة النساء" :
                    category === "unisex" ? "يونيسكس" :
                        category === "eau-de-toilette" ? "تيسترات" : category;

    await dbConnect();

    // Fetch products from DB
    let allProducts = await Product.find({}).lean();

    // Fallback to static if DB is empty
    if (!allProducts || allProducts.length === 0) {
        allProducts = staticProducts as any;
    }

    // Convert to plain JSON to avoid serialization issues
    const safeProducts = JSON.parse(JSON.stringify(allProducts));

    // ===================================================
    // 🔍 منطق الفلترة الذكي حسب التصنيف (بشكل حصري)
    // ===================================================
    const isTester = (p: any) =>
        p.concentration?.toLowerCase().includes("tester") ||
        p.concentration === "تيستر" ||
        p.category?.toLowerCase() === "tester" ||
        p.category === "تيستر" ||
        p.category === "eau-de-toilette";

    const isOil = (p: any) =>
        p.category === "oils" ||
        p.concentration?.toLowerCase() === "oil" ||
        p.category === "زيوت" ||
        p.concentration === "زيت";

    const categoryProducts = (() => {
        switch (category) {
            // تيسترات (حصرياً للتيسترات)
            case "eau-de-toilette":
                return safeProducts.filter((p: any) => isTester(p));
            // ماركات عالمية = كل المنتجات (أو يمكن لاحقاً فلترتها إذا لزم الأمر)
            case "french":
                return safeProducts;
            // زيوت عطرية (حصرياً)
            case "oils":
                return safeProducts.filter((p: any) => isOil(p));
            // رجالي (حصراً العطور الرجالية المستبعد منها التيسترات والزيوت)
            case "men":
                return safeProducts.filter((p: any) =>
                    !isTester(p) && !isOil(p) && (p.gender === "رجالي" || p.gender?.toLowerCase() === "men")
                );
            // نسائي (حصراً العطور النسائية المستبعد منها التيسترات والزيوت)
            case "women":
                return safeProducts.filter((p: any) =>
                    !isTester(p) && !isOil(p) && (p.gender === "نسائي" || p.gender?.toLowerCase() === "women")
                );
            // يونيسكس (حصراً عطور الجنسين المستبعد منها التيسترات والزيوت)
            case "unisex":
                return safeProducts.filter((p: any) =>
                    !isTester(p) && !isOil(p) && (p.gender === "للجنسين" || p.gender?.toLowerCase() === "unisex")
                );
            default:
                return safeProducts.filter((p: any) => p.category === category);
        }
    })();

    return (
        <div className="container" style={{ padding: "4rem 1.5rem" }}>
            <br />
            <br />
            <br />
            <h1 style={{ fontSize: "3rem", marginBottom: "2rem", textAlign: "center", textTransform: "capitalize" }}>
                {categoryName}
            </h1>

            {categoryProducts.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "3rem" }}>
                    {categoryProducts.map((item: any) => (
                        <div key={item.id} className="product-card" style={{ position: 'relative' }}>
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
                                <Link href={`/products/${item.id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="product-image"
                                        style={{ cursor: "pointer" }}
                                    />
                                </Link>
                            </div>
                            <div className="product-content">
                                <div>
                                    <h3 className="product-title">
                                        {item.name}
                                        {item.nameAr && <span style={{ display: 'block', fontSize: '0.85em', color: '#aaa', marginTop: '4px' }}>{item.nameAr}</span>}
                                    </h3>
                                    <div className="product-price">
                                        {formatCurrency(item.price)}
                                        {(item.originalPrice || 0) > 0 && (
                                            <span className="original-price">{formatCurrency(item.originalPrice)}</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'center', width: '100%' }}>
                                    <AddToCartButton product={item} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: "center", fontSize: "1.2rem", color: "var(--color-text-muted)" }}>لا توجد منتجات في هذا القسم حالياً.</p>
            )}
        </div>
    );
}

