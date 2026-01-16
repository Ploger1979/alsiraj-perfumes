
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    const categoryName = category === "french" ? "عطور فرنسية" :
        category === "oils" ? "زيوت عطرية" :
            category === "men" ? "مجموعة الرجال" :
                category === "women" ? "مجموعة النساء" :
                    category === "eau-de-toilette" ? "Eau de Toilette" : category;

    const categoryProducts = category === "eau-de-toilette"
        ? products.filter((p) => p.concentration === "Eau de Toilette")
        : products.filter((p) => p.category === category);

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
                    {categoryProducts.map((item) => (
                        <div key={item.id} className="product-card">
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
            ) : (
                <p style={{ textAlign: "center", fontSize: "1.2rem", color: "var(--color-text-muted)" }}>لا توجد منتجات في هذا القسم حالياً.</p>
            )}
        </div>
    );
}

