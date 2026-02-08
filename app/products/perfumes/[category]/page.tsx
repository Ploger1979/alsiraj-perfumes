
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

    const categoryName = category === "french" ? "عطور فرنسية" :
        category === "oils" ? "زيوت عطرية" :
            category === "men" ? "مجموعة الرجال" :
                category === "women" ? "مجموعة النساء" :
                    category === "eau-de-toilette" ? "Eau de Toilette" : category;

    await dbConnect();

    // Fetch products from DB
    let allProducts = await Product.find({}).lean();

    // Fallback to static if DB is empty
    if (!allProducts || allProducts.length === 0) {
        allProducts = staticProducts as any;
    }

    // Convert to plain JSON to avoid serialization issues
    const safeProducts = JSON.parse(JSON.stringify(allProducts));

    const categoryProducts = category === "eau-de-toilette"
        ? safeProducts.filter((p: any) => p.concentration === "Eau de Toilette")
        : safeProducts.filter((p: any) => p.category === category);

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
                        <div key={item.id} className="product-card">
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
                                    <h3 className="product-title">{item.name}</h3>
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

