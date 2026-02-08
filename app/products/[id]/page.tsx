
import { products } from "@/data/products";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

interface PageProps {
    params: Promise<{ id: string }>;
}

// دالة لتوليد صفحات المنتجات تلقائياً (SSG) لتحسين الأداء
export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

// صفحة المنتج الفردية (Dynamic Route)
// تستقبل الـ id من الرابط وتعرض تفاصيل المنتج
export default async function ProductPage({ params }: PageProps) {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);

    // محاولة جلب المنتج من قاعدة البيانات أولاً
    // Try fetching from DB first
    let product: any = null;
    try {
        await dbConnect();
        product = await Product.findOne({ id: productId }).lean();
    } catch (e) {
        console.error("Database fetch error:", e);
    }

    // إذا لم يوجد في الداتابيس، ابحث في الملف الثابت (للمنتجات القديمة)
    // If not in DB, check static file
    if (!product) {
        product = products.find((p) => p.id === productId);
    }

    if (!product) {
        notFound(); // إذا لم يوجد المنتج، اعرض صفحة 404
    }

    // تحويل الكائن بالكامل لتجنب مشاكل التسلسل (Serialization Error) مع Next.js
    // This handles nested _id fields (like in sizes array) automatically
    product = JSON.parse(JSON.stringify(product));

    // التأكد من أن الصور موجودة
    // Ensure images array exists
    if (!product.images) {
        product.images = product.image ? [product.image] : [];
    }

    return <ProductDetails product={product} />;
}
